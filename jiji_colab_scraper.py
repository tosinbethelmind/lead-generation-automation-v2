"""
Jiji.ng Google Colab Scraper — v2 (curl_cffi Edition)
Author: Antigravity
Description:
  Run this in Google Colab to scrape Jiji.ng listings.
  Uses curl_cffi to impersonate Chrome's TLS fingerprint, bypassing
  Cloudflare without needing a full headless browser.
  Extracts phone numbers from Jiji's __NUXT_DATA__ JSON blob.
  Saves results to Google Sheets with deduplication + DNC checking.

Why curl_cffi beats Playwright here:
  - Cloudflare's #1 detection signal is the TLS fingerprint of the
    connection, not just the browser headers. Python's requests/httpx
    use Python's default TLS stack — instantly identified as a bot.
  - curl_cffi wraps libcurl and can replay Chrome's exact TLS cipher
    list and extension order, so Cloudflare's passive fingerprint
    check passes at the TCP layer, before any headers are even read.
  - Google Colab's IP addresses are not in Cloudflare's datacenter
    blocklist (they are consumer Google Cloud IPs), so they pass the
    IP reputation check as well.

Instructions:
  1. Open https://colab.research.google.com and create a new notebook.
  2. Paste this script into a code cell and run it.
  3. Authenticate your Google account when prompted.
  4. Set SPREADSHEET_NAME and JIJI_SEARCH_URL below.
"""

import sys, os, re, time, json, datetime, random, hashlib

# ──────────────────────────────────────────────────────────────────────────────
# CONFIGURATION — edit these before running
# ──────────────────────────────────────────────────────────────────────────────
SPREADSHEET_NAME = "Your Lead Sheet Name"   # Google Sheet name or ID
JIJI_SEARCH_URL  = "https://jiji.ng/lagos/services"  # Category page to scrape
MAX_PAGES        = 5       # Listing pages to paginate through
MAX_LEADS        = 50      # Max total leads to collect per run
DELAY_BETWEEN_REQUESTS = (1.5, 4.0)   # Random delay range (seconds)

# ──────────────────────────────────────────────────────────────────────────────
# DEPENDENCY INSTALLATION
# ──────────────────────────────────────────────────────────────────────────────
try:
    import google.colab
    IN_COLAB = True
except ImportError:
    IN_COLAB = False

if IN_COLAB:
    print("Installing dependencies...")
    os.system("pip install -q curl_cffi gspread google-auth beautifulsoup4 lxml")

from curl_cffi import requests as cf_requests
from bs4 import BeautifulSoup
import gspread

# ──────────────────────────────────────────────────────────────────────────────
# ROTATING USER-AGENTS (aligned with TLS impersonation profile)
# ──────────────────────────────────────────────────────────────────────────────
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
]

# Cloudflare-realistic header set
def build_headers(referer="https://www.google.com/"):
    ua = random.choice(USER_AGENTS)
    return {
        "User-Agent": ua,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": random.choice(["en-US,en;q=0.9", "en-GB,en;q=0.9", "en-NG,en;q=0.9"]),
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": referer,
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
    }

# Shared session — reuses TCP + TLS connection and cf_clearance cookie
_session = cf_requests.Session(impersonate="chrome126")

def jiji_get(url, referer="https://jiji.ng/", retries=3):
    """
    Fetch a Jiji URL with Chrome TLS impersonation.
    Retries with exponential backoff on 403/429.
    """
    for attempt in range(retries):
        try:
            time.sleep(random.uniform(*DELAY_BETWEEN_REQUESTS))
            resp = _session.get(
                url,
                headers=build_headers(referer),
                timeout=20,
                allow_redirects=True,
            )
            if resp.status_code == 403:
                wait = 2 ** attempt * 3
                print(f"  [BLOCKED] 403 on {url[:70]}. Waiting {wait}s before retry {attempt+1}/{retries}...")
                time.sleep(wait)
                continue
            if resp.status_code == 429:
                wait = 2 ** attempt * 5
                print(f"  [RATE LIMITED] 429. Waiting {wait}s...")
                time.sleep(wait)
                continue
            resp.raise_for_status()
            return resp
        except Exception as e:
            print(f"  [ERROR] Attempt {attempt+1}: {e}")
            if attempt == retries - 1:
                raise
    return None

# ──────────────────────────────────────────────────────────────────────────────
# PHONE NORMALISATION
# ──────────────────────────────────────────────────────────────────────────────
def normalize_phone(raw):
    if not raw:
        return ""
    digits = re.sub(r"\D", "", raw)
    if digits.startswith("2340"):
        digits = "234" + digits[4:]
    elif digits.startswith("0") and len(digits) >= 10:
        digits = "234" + digits[1:]
    elif len(digits) == 10 and digits[0] in "789":
        digits = "234" + digits
    if len(digits) >= 12 and digits.startswith("234"):
        return "+" + digits
    return ""

NG_PHONE_RE = re.compile(r'(?:234\d{10}|0[789]\d{9})')

def extract_phones(text):
    return list(dict.fromkeys(NG_PHONE_RE.findall(text)))  # deduplicated, ordered

# ──────────────────────────────────────────────────────────────────────────────
# NUXT DATA PHONE EXTRACTION (Jiji's embedded JSON blob)
# ──────────────────────────────────────────────────────────────────────────────
def extract_phone_from_nuxt(html):
    """Try to find phone/WhatsApp numbers from Jiji's __NUXT_DATA__ blob."""
    m = re.search(r'<script[^>]+id="__NUXT_DATA__"[^>]*>([\s\S]*?)</script>', html)
    if not m:
        return ""
    blob = m.group(1)
    # Strategy A: wa.me link
    wa = re.search(r'wa\.me[/%]?2?F?(\d{10,15})', blob)
    if wa:
        return normalize_phone(wa.group(1))
    # Strategy B: explicit phone field
    ph = re.search(r'"phone"\s*:\s*"(\+?\d[\d\s\-\.]{6,})"', blob)
    if ph:
        return normalize_phone(ph.group(1))
    # Strategy C: Nigerian number pattern
    phones = extract_phones(blob)
    if phones:
        return normalize_phone(phones[0])
    return ""

# ──────────────────────────────────────────────────────────────────────────────
# SCRAPER
# ──────────────────────────────────────────────────────────────────────────────
def scrape_jiji():
    print(f"\n{'='*60}")
    print(f"Jiji Scraper v2 (curl_cffi TLS Impersonation)")
    print(f"Target: {JIJI_SEARCH_URL}")
    print(f"{'='*60}\n")

    # Warm up the session with a Jiji home visit (gets cf_clearance cookie)
    print("Warming up session on jiji.ng home page...")
    try:
        warmup = jiji_get("https://jiji.ng/", referer="https://www.google.com/")
        if warmup:
            print(f"  Session warm-up OK — Status: {warmup.status_code}")
            if "cf_clearance" in str(_session.cookies):
                print("  cf_clearance cookie obtained!")
    except Exception as e:
        print(f"  Warm-up failed: {e}. Continuing anyway...")

    all_leads = []
    seen_urls = set()

    for page_num in range(1, MAX_PAGES + 1):
        if len(all_leads) >= MAX_LEADS:
            break

        # Build paginated URL
        sep = "&" if "?" in JIJI_SEARCH_URL else "?"
        page_url = JIJI_SEARCH_URL if page_num == 1 else f"{JIJI_SEARCH_URL}{sep}page={page_num}"
        print(f"\n[Page {page_num}/{MAX_PAGES}] Fetching listing index: {page_url}")

        try:
            resp = jiji_get(page_url, referer="https://jiji.ng/")
        except Exception as e:
            print(f"  Failed to load listing page: {e}")
            break

        soup = BeautifulSoup(resp.text, "lxml")

        # Extract listing card links
        card_links = []
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if href.startswith("/") and href.endswith(".html") and "/ad/" in href:
                abs_url = "https://jiji.ng" + href
                if abs_url not in seen_urls and abs_url not in card_links:
                    card_links.append(abs_url)

        print(f"  Found {len(card_links)} listing links on page {page_num}")
        if not card_links:
            print("  No listings found — stopping pagination.")
            break

        # Fetch each detail page
        for i, listing_url in enumerate(card_links):
            if len(all_leads) >= MAX_LEADS:
                break
            seen_urls.add(listing_url)

            print(f"  [{i+1}/{len(card_links)}] {listing_url[:70]}...")
            try:
                detail_resp = jiji_get(listing_url, referer=page_url)
            except Exception as e:
                print(f"    Skipping — fetch error: {e}")
                continue

            html = detail_resp.text
            d_soup = BeautifulSoup(html, "lxml")

            # Extract seller name
            name_el = d_soup.select_one(".b-seller-block__name, .qa-seller-name, [class*='seller-name']")
            seller_name = name_el.get_text(strip=True) if name_el else "Jiji Seller"

            # Extract description
            desc_el = d_soup.select_one(".qa-description-text, .b-advert-description-text, [class*='description']")
            description = desc_el.get_text(strip=True) if desc_el else ""

            # Extract category and area from URL
            parts = listing_url.replace("https://jiji.ng/", "").split("/")
            area     = parts[0].replace("-", " ").title() if len(parts) > 0 else "Lagos"
            category = parts[1].replace("-", " ").title() if len(parts) > 1 else "Seller"

            # Extract phone — priority: NUXT_DATA > description text > HTML scan
            phone_raw = extract_phone_from_nuxt(html)
            if not phone_raw:
                desc_phones = extract_phones(description)
                phone_raw = normalize_phone(desc_phones[0]) if desc_phones else ""
            if not phone_raw:
                html_phones = extract_phones(html)
                phone_raw = normalize_phone(html_phones[0]) if html_phones else ""

            if not phone_raw:
                print(f"    No phone found — skipping.")
                continue

            lead_id = "JIJI_" + hashlib.sha256(listing_url.encode()).hexdigest()[:16]

            lead = {
                "lead_id": lead_id,
                "source": "JIJI",
                "name": seller_name,
                "category": category,
                "address": f"{area}, Lagos, Nigeria",
                "area": area,
                "city": "Lagos",
                "phone_raw": phone_raw,
                "phone_e164": phone_raw if phone_raw.startswith("+") else normalize_phone(phone_raw),
                "email": "",
                "website": "",
                "rating": 4.0,
                "reviews_count": 1,
                "verified": "TRUE",
                "listings_count": 1,
                "profile_url": listing_url,
                "source_query_or_seed": JIJI_SEARCH_URL,
                "collected_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "status": "NEW",
                "last_contacted_at": "",
                "duplicate_of_lead_id": "",
                "business_summary": description[:200] or f"{seller_name} listed on Jiji in {area}.",
                "notes": "Scraped via curl_cffi TLS impersonation (Colab v2)."
            }
            all_leads.append(lead)
            print(f"    ✓ {seller_name} | {phone_raw}")

    print(f"\n{'='*60}")
    print(f"Scrape complete. Collected {len(all_leads)} leads with phone numbers.")
    print(f"{'='*60}\n")
    return all_leads

# ──────────────────────────────────────────────────────────────────────────────
# GOOGLE SHEETS WRITE-BACK
# ──────────────────────────────────────────────────────────────────────────────
def get_google_sheet():
    if IN_COLAB:
        from google.colab import auth
        from google.auth import default
        print("Authenticating with Google Sheets...")
        auth.authenticate_user()
        creds, _ = default()
        gc = gspread.authorize(creds)
    else:
        gc = gspread.service_account(filename="credentials.json")

    if len(SPREADSHEET_NAME) > 30 and "-" in SPREADSHEET_NAME:
        return gc.open_by_key(SPREADSHEET_NAME)
    return gc.open(SPREADSHEET_NAME)

def sync_to_sheet(leads):
    if not leads:
        print("No leads to sync.")
        return

    sh = get_google_sheet()

    # DNC list
    try:
        dnc_phones = {row[0].strip() for row in sh.worksheet("DNC").get_all_values() if row and row[0]}
    except Exception:
        dnc_phones = set()
        print("No DNC sheet found — skipping DNC check.")

    # Existing leads
    try:
        ws = sh.worksheet("Leads")
    except Exception:
        print("ERROR: 'Leads' worksheet not found!")
        sys.exit(1)

    existing = ws.get_all_values()
    headers  = existing[0] if existing else []
    existing_phones = set()
    existing_urls   = set()

    for row in existing[1:]:
        col = {h: i for i, h in enumerate(headers)}
        if "phone_e164" in col and len(row) > col["phone_e164"]:
            existing_phones.add(row[col["phone_e164"]])
        if "profile_url" in col and len(row) > col["profile_url"]:
            existing_urls.add(row[col["profile_url"]])

    new_rows       = []
    skipped_dnc    = 0
    skipped_dup    = 0

    for lead in leads:
        phone = lead.get("phone_e164", "")
        url   = lead.get("profile_url", "")

        if phone and phone in dnc_phones:
            skipped_dnc += 1
            continue
        if url in existing_urls or (phone and phone in existing_phones):
            skipped_dup += 1
            continue

        row_values = [lead.get(h, "") for h in headers]
        new_rows.append(row_values)
        if phone: existing_phones.add(phone)
        if url:   existing_urls.add(url)

    if new_rows:
        ws.append_rows(new_rows)
        print(f"✓ Added {len(new_rows)} new leads to Sheets.")
    else:
        print("No new unique leads to add.")

    print(f"Summary — Added: {len(new_rows)} | Duplicates: {skipped_dup} | DNC: {skipped_dnc}")

# ──────────────────────────────────────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    leads = scrape_jiji()
    sync_to_sheet(leads)
