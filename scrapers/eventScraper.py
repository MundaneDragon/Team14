from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
import traceback
import time



TARGET = "https://campus.hellorubric.com/search?type=events"

driver = webdriver.Chrome()

def main():
    # ToDo: Someone add supabase to this pls 
    
    # Goes to the society website
    driver.get(TARGET)

    while True:
        time.sleep(5)
        driver.find_element(By.CLASS_NAME, "search-university").click()
        driver.find_element(By.CSS_SELECTOR, "tr[universityid='5']").click()
        time.sleep(5)
        driver.find_element(By.CLASS_NAME, "search-university").click()
        driver.find_element(By.CSS_SELECTOR, "tr[universityid='5']").click()
        time.sleep(5)
        # At this point its 


        break 

    print("Scraping completed!")
    driver.quit()

if __name__ == "__main__":
    main()
