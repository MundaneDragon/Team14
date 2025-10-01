from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
import traceback
import time
import re
from datetime import datetime

import os
from supabase import create_client, client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") 
supabase = create_client(url, key)

TARGET = "https://campus.hellorubric.com/search?type=societies"

driver = webdriver.Chrome()

def main():
    # ToDo: Someone add supabase to this pls 
    
    # Goes to the clubs 
    driver.get(TARGET)

    while True:
        dict = {}

        time.sleep(5)
        driver.find_element(By.CLASS_NAME, "search-university").click()
        driver.find_element(By.CSS_SELECTOR, "tr[universityid='5']").click()
        time.sleep(2)

        #Uncomment this when you want to go through every event
        while True:
            try: 
                driver.find_element(By.XPATH, "//*[text()='Load More']").click()
                time.sleep(0.5)
            except Exception:
                break
        
        # time.sleep(1)
        cards = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".column.is-one-third-desktop.is-half-tablet"))
        )


        for card in cards:
            dest = card.get_attribute("destination")  
            info = {}
            if dest:
                # potentially if dest (the event id) exists in the database 
                # then we skip it here, then at the end we add whatever is in the dictionary 
                # into our database?
                # someone with supabase knowledge should work on this part

                if dest in dict:
                    print("wtf why is there a duplicated society id????")
                    break 
                else:
                    id = int(re.search(r"\d+", dest).group())
                    dict[id] = info
                # print("destination is", dest)
                # print(card.text)

        #print(dict)
        time.sleep(2)

        # id, societyName, societyImage, societyUniversity, societyDesc, socialMedia, 
        # Goes through every event id from unsw 

        for key in dict:
            try: 
                driver.get(f"https://campus.hellorubric.com/?s={key}")
                time.sleep(1)
                details = dict[key]

                details["id"] = key

                details["societyName"] = driver.find_element(By.ID, "societyname").text.strip()


                img = driver.find_element(By.ID, "soclogononslim")
                src = img.get_attribute("src")

                details["societyImage"] = src

                # Dont need society uni because its all UNSW 
                # details["societyUniversity"] = 

                details["societyDesc"] = driver.find_element(By.ID, "societydesc").text.strip()

                # Maybe social media later but we don't have time for it right now 
                # details["socialMedia"] = 
                time.sleep(1)
                #print(key, dict[key])
            except Exception: 
                print("Something did not work")
                print(key)
        
        # At this point we've gone through all the societies
        break 
    
    #print(dict)
    print("Scraping completed! Upserted " + str(len(dict)) " societies")
    driver.quit()

    for id, society in dict.items(): 
        supabase.table("societies").upsert({
            "id": society["id"],
            "name": society["societyName"],
            "image": society["societyImage"],
            "description": society["societyDesc"]
        }).execute()
    

if __name__ == "__main__":
    main()
