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



TARGET = "https://campus.hellorubric.com/search?type=events"

driver = webdriver.Chrome()

def main():
    # ToDo: Someone add supabase to this pls 
    
    # Goes to the society website
    driver.get(TARGET)

    while True:

        dict = {}

        time.sleep(5)
        driver.find_element(By.CLASS_NAME, "search-university").click()
        driver.find_element(By.CSS_SELECTOR, "tr[universityid='5']").click()
        time.sleep(2)

        # Uncomment this when you want to go through every event
        # while True:
        #     try: 
        #         driver.find_element(By.XPATH, "//*[text()='Load More']").click()
        #         time.sleep(0.5)
        #     except Exception:
        #         break
        
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
                    print("wtf why is there a duplicated event id????")
                    break 
                else:
                    lines = card.text.splitlines()
                    info["category"] = lines[3]

                    id = int(re.search(r"\d+", dest).group())
                    dict[id] = info
                # print("destination is", dest)
                # print(card.text)

        
        time.sleep(2)


        # id, startTime, endTime, location, title, hostedById, desc, network, societyName, category, eventImage, price, societyImage
        # Goes through every event id from unsw 

        for key in dict:
            try: 
                driver.get(f"https://campus.hellorubric.com/?eid={key}")
                time.sleep(1)
                details = dict[key]

                details["id"] = key


                text = driver.find_element(By.CLASS_NAME, "ed_eventTime").text
                print(text)
                startTime = text.split("-", 1)[0].strip()
                
                startTimeStamp = datetime.strptime(startTime, "%a, %d %b %Y %I:%M %p") 
                startTimeStamp = startTimeStamp.strftime("%Y-%m-%d %H:%M:%S")
                
                details["startTime"] = startTimeStamp
                
                endTime = text.split("-", 1)[1].strip()
                endTimeStamp = datetime.strptime(endTime, "%a, %d %b %Y %I:%M %p") 
                endTimeStamp = endTimeStamp.strftime("%Y-%m-%d %H:%M:%S")
                details["endTime"] = endTimeStamp


                details["location"] = driver.find_element(By.ID, "eventAddress").text.strip()
                details["title"] = driver.find_element(By.ID, "eventName1").text.strip()
                # ed_hosted-by
                link = driver.find_element(By.CSS_SELECTOR, "#ed_hosted-by a")
                href = link.get_attribute("href")
                match = re.search(r"s=(\d+)", href)

                details["hostedById"] = match.group(1)
                # eventName2
                details["desc"] = driver.find_element(By.ID, "eventName2").text.strip()
                details["network"] = []
                details["societyName"] = driver.find_element(By.ID, "ed_hosted-by").text.strip()

                img = driver.find_element(By.ID, "ed_bannerimage")
                src = img.get_attribute("src")

                details["eventImage"] = src

                # ticketPriceRangeSection
                details["price"] = driver.find_element(By.ID, "ticketPriceRangeSection").text.strip() 

                print(key, dict[key])
                time.sleep(1)
            except Exception: 
                    print("Something did not work")
                    print(key)

        # At this point we've gone through all the events
        break 

    print(dict)
    print("Scraping completed!")
    driver.quit()

if __name__ == "__main__":
    main()
