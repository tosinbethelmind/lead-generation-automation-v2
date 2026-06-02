"""
Jiji.ng Google Colab Scraper
Author: Antigravity
Description: Run this script inside Google Colab to scrape Jiji.ng listings.
             Uses Playwright (headless browser) to bypass Cloudflare.
             Saves results directly into your Google Sheet.

Instructions for Google Colab:
1. Open a new Google Colab Notebook (https://colab.research.google.com).
2. Create a new code cell, paste this code, and run it.
3. Follow the prompt to authorize Google Sheets access.
4. Set your Spreadsheet Name/ID and Jiji URL in the config section below.
"""

import sys
import os
import asyncio
import re
import datetime

# -------------------------------------------------------------
# CONFIGURATION
# -------------------------------------------------------------
SPREADSHEET_NAME = "Your Lead Sheet Name"  # Or Spreadsheet ID
JIJI_SEARCH_URL = "https://jiji.ng/ikeja/cars"  # Jiji list page to scrape
MAX_PAGES = 3  # Number of pages to paginate
MAX_RESULTS = 20  # Limit results to fetch

# -------------------------------------------------------------
# DEPENDENCY INSTALLATION (Colab Detection)
# -------------------------------------------------------------
try:
    import google.colab
    IN_COLAB = True
except ImportError:
    IN_COLAB = False

if IN_COLAB:
    print("Running in Google Colab. Installing dependencies...")
    # Install playwright and gspread
    os.system("pip install -q playwright gspread google-auth")
    os.system("playwright install chromium")
    # Need nest_asyncio to run playwright inside jupyter
    os.system("pip install -q nest_asyncio")
    import nest_asyncio
    nest_asyncio.apply()

import gspread
from playwright.async_api import async_playwright

# -------------------------------------------------------------
# GOOGLE SHEETS CONNECTION
# -------------------------------------------------------------
def get_google_sheet():
    if IN_COLAB:
        from google.colab import auth
        from google.auth import default
        print("Please authenticate to access your Google Sheet...")
        auth.authenticate_user()
        creds, _ = default()
        gc = gspread.authorize(creds)
    else:
        # Local run - expects credentials.json in current directory
        print("Running locally. Attempting to load credentials.json...")
        gc = gspread.service_account(filename="credentials.json")
    
    try:
        # Try opening by key first, then by name
        if len(SPREADSHEET_NAME) > 30 and "-" in SPREADSHEET_NAME:
            return gc.open_by_key(SPREADSHEET_NAME)
        return gc.open(SPREADSHEET_NAME)
    except Exception as e:
        print(f"Error opening spreadsheet '{SPREADSHEET_NAME}': {e}")
        print("Please check your SPREADSHEET_NAME config and ensure it is shared with your service account / Google account.")
        sys.exit(1)

# -------------------------------------------------------------
# PHONE NUMBER NORMALIZATION
# -------------------------------------------------------------
def normalize_phone_e164(raw):
    if not raw:
        return ""
    digits = re.sub(r"\D", "", raw)
    if digits.startswith("2340"):
        digits = "234" + digits[4:]
    elif digits.startswith("0"):
        digits = "234" + digits[1:]
    elif len(digits) == 10 and digits[0] in ["7", "8", "9"]:
        digits = "234" + digits
    return "+" + digits if digits else ""

# -------------------------------------------------------------
# DETECTIONS & PARSING (Jiji listings)
# -------------------------------------------------------------
async def scrape_jiji():
    print(f"Launching headless browser to scrape: {JIJI_SEARCH_URL}...")
    
    leads = []
    
    async with async_playwright() as p:
        # Launch browser with stealth-like headers
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        for current_page in range(1, MAX_PAGES + 1):
            url = JIJI_SEARCH_URL
            if current_page > 1:
                # Handle standard pagination queries (e.g. ?page=2)
                url = f"{JIJI_SEARCH_URL}?page={current_page}" if "?" not in JIJI_SEARCH_URL else f"{JIJI_SEARCH_URL}&page={current_page}"
            
            print(f"Scraping Page {current_page}: {url}...")
            try:
                await page.goto(url, wait_until="networkidle", timeout=30000)
                # Auto scroll to trigger lazy loading
                for _ in range(3):
                    await page.mouse.wheel(0, 800)
                    await asyncio.sleep(1)
            except Exception as e:
                print(f"Timeout or error loading page {current_page}: {e}")
                break
            
            # Select all listing links
            # Jiji lists are wrapped in cards
            cards = await page.query_selector_all("a")
            page_leads = []
            
            for card in cards:
                href = await card.get_attribute("href")
                if not href or not href.startswith("/") or not href.endswith(".html"):
                    continue
                
                # Extract details
                try:
                    # Check if card has a title element
                    # Search inside this anchor card for headers or title elements
                    title_elem = await card.query_selector(".b-advert-title-inner, .qa-advert-list-item-title, h4, .b-trending-card__title")
                    if not title_elem:
                        continue
                    
                    title = await title_elem.inner_text()
                    title = title.strip()
                    if not title:
                        continue
                    
                    # Extract Location / Region
                    loc_elem = await card.query_selector(".b-list-advert__region, .qa-advert-list-item-region, .b-trending-card__region")
                    location = await loc_elem.inner_text() if loc_elem else "Lagos"
                    location = location.strip()
                    
                    # Extract URL
                    profile_url = f"https://jiji.ng{href}"
                    
                    # Deterministic ID using URL path
                    lead_id = "JIJI_" + str(hash(href) & 0xffffffff)
                    
                    # Extract category from URL path if possible (e.g., /ikeja/cars/honda...)
                    category = "Seller"
                    parts = href.split('/')
                    if len(parts) > 2:
                        category = parts[2].replace("-", " ").title()
                    
                    page_leads.append({
                        "lead_id": lead_id,
                        "source": "JIJI",
                        "name": title,
                        "category": category,
                        "address": location,
                        "area": location.split(",")[0].strip(),
                        "city": "Lagos" if "Lagos" in location else "Nigeria",
                        "phone_raw": "",
                        "phone_e164": "",
                        "email": "",
                        "website": "",
                        "rating": "0",
                        "reviews_count": "0",
                        "verified": "FALSE",
                        "listings_count": "1",
                        "profile_url": profile_url,
                        "source_query_or_seed": JIJI_SEARCH_URL,
                        "collected_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "status": "NEW",
                        "last_contacted_at": "",
                        "duplicate_of_lead_id": "",
                        "business_summary": f"{title} listed on Jiji in {location}.",
                        "notes": "Scraped via Google Colab Scraper."
                    })
                except Exception as ex:
                    continue
            
            # Deduplicate items found on the same page
            seen_urls = set()
            for lead in page_leads:
                if lead["profile_url"] not in seen_urls:
                    seen_urls.add(lead["profile_url"])
                    leads.append(lead)
                    
            if len(leads) >= MAX_RESULTS:
                leads = leads[:MAX_RESULTS]
                break
                
        await browser.close()
        
    print(f"Scrape completed! Found {len(leads)} raw Jiji leads.")
    return leads

# -------------------------------------------------------------
# WRITE TO SHEET & DEDUPLICATE
# -------------------------------------------------------------
def sync_leads_to_sheet(scraped_leads):
    if not scraped_leads:
        print("No leads to sync.")
        return
        
    sh = get_google_sheet()
    
    # 1. Fetch DNC (Do Not Contact) list
    try:
        dnc_sheet = sh.worksheet("DNC")
        dnc_data = dnc_sheet.get_all_values()
        dnc_phones = {row[0].strip() for row in dnc_data if row and row[0]}
    except Exception:
        dnc_phones = set()
        print("DNC sheet not found or couldn't be read. Skipping DNC check.")

    # 2. Fetch Existing Leads
    try:
        leads_sheet = sh.worksheet("Leads")
    except Exception:
        print("Error: 'Leads' worksheet not found in the spreadsheet!")
        sys.exit(1)
        
    existing_data = leads_sheet.get_all_values()
    headers = existing_data[0]
    
    # Create column indexing maps
    col_map = {name: i for i, name in enumerate(headers)}
    
    # Track existing unique markers (phone and profile_url)
    existing_phones = set()
    existing_urls = set()
    existing_id_map = {}
    
    for row in existing_data[1:]:
        if len(row) <= max(col_map.values()):
            continue
        lead_id = row[col_map["lead_id"]]
        phone = row[col_map["phone_e164"]]
        p_url = row[col_map["profile_url"]]
        
        if phone:
            existing_phones.add(phone)
            existing_id_map[phone] = lead_id
        if p_url:
            existing_urls.add(p_url)
            existing_id_map[p_url] = lead_id

    # 3. Process & Write Leads
    new_rows = []
    skipped_count = 0
    duplicate_count = 0
    
    for lead in scraped_leads:
        # Check DNC
        if lead["phone_e164"] and lead["phone_e164"] in dnc_phones:
            print(f"Skipping lead (DNC Match): {lead['name']} ({lead['phone_e164']})")
            skipped_count += 1
            continue
            
        # Check Duplicates by Profile URL or Phone E164
        is_dup = False
        dup_id = None
        
        if lead["profile_url"] in existing_urls:
            is_dup = True
            dup_id = existing_id_map[lead["profile_url"]]
        elif lead["phone_e164"] and lead["phone_e164"] in existing_phones:
            is_dup = True
            dup_id = existing_id_map[lead["phone_e164"]]
            
        if is_dup:
            print(f"Duplicate lead filtered (won't append): {lead['name']} -> Duplicate of ID: {dup_id}")
            duplicate_count += 1
            continue
            
        # Prepare row values matching exact header structure
        row_values = []
        for h in headers:
            row_values.append(lead.get(h, ""))
            
        new_rows.append(row_values)
        
        # Add to set so we don't insert duplicate leads within the same run
        if lead["phone_e164"]:
            existing_phones.add(lead["phone_e164"])
        if lead["profile_url"]:
            existing_urls.add(lead["profile_url"])

    # 4. Append to sheet
    if new_rows:
        leads_sheet.append_rows(new_rows)
        print(f"Successfully added {len(new_rows)} new unique leads to the 'Leads' worksheet!")
    else:
        print("No new unique leads to add.")
        
    print(f"Summary: Appended: {len(new_rows)} | Duplicates Ignored: {duplicate_count} | DNC Blocked: {skipped_count}")

# -------------------------------------------------------------
# MAIN RUNNER
# -------------------------------------------------------------
if __name__ == "__main__":
    leads = asyncio.run(scrape_jiji())
    sync_leads_to_sheet(leads)
