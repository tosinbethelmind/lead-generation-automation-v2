"""
===============================================================================
🚀 GOOGLE COLAB 24/7 MULTI-ENGINE LEAD HARVESTER v10.0 (ZERO LAPTOP CPU)
===============================================================================
Run 100% in the cloud on Google's free servers!
Syncs net-new Lagos, Solar, and Ibadan leads directly into your Supabase DB.

HOW TO USE IN GOOGLE COLAB:
1. Go to https://colab.research.google.com/
2. Click 'New Notebook'
3. Copy & paste this entire script into a code cell
4. Click the 'Play' button ▶ to run!
===============================================================================
"""

import os
import sys
import time
import requests
import json
import random
import re
import hashlib
from datetime import datetime

# UTF-8 Encoding Fix for Windows / Linux / Google Colab
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# 🔐 Supabase Cloud Connection Credentials
SUPABASE_URL = "https://szyuterncawfxwzhvwcf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eXV0ZXJuY2F3Znh3emh2d2NmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM5ODIwOSwiZXhwIjoyMDk3OTc0MjA5fQ._SzfC4NE4KCwWkK_GFQAyQjgkFrQLhbpz1w9R3FIUBY"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates,return=representation"
}

# Target Multi-Engine Sectors & Districts
SOLAR_QUERIES = ["solar panel", "inverter dealer", "lithium battery", "solar installation", "solar light", "power equipment"]
LAGOS_DISTRICTS = ["ikeja", "lekki", "victoria-island", "yaba", "surulere", "oshodi", "ikorodu", "alimosho", "gbagada", "festac", "ajah", "agege"]
LAGOS_B2B_QUERIES = ["boutique", "supermarket", "car dealer", "pharmacy", "logistics", "restaurant", "hotel", "furniture", "electronics"]
IBADAN_DISTRICTS = ["Bodija", "Dugbe", "Challenge", "Mokola", "Agbowo", "Jericho", "Ring Road"]

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
]

def get_random_ua():
    return random.choice(USER_AGENTS)

def clean_phone_number(raw_phone):
    if not raw_phone: return ""
    digits = re.sub(r'\D', '', str(raw_phone))
    if digits.startswith('0') and len(digits) == 11:
        return '234' + digits[1:]
    if digits.startswith('234') and len(digits) == 13:
        return digits
    return digits if len(digits) >= 10 else ""

# ---------------------------------------------------------------------------
# ENGINE 1: Direct Jiji.ng Web API Engine
# ---------------------------------------------------------------------------
def fetch_jiji_api_leads(query, region_slug="lagos", page=1):
    url = f"https://jiji.ng/api_web/v1/listing?query={requests.utils.quote(query)}&region_slug={region_slug}&page={page}&sort=date"
    leads = []
    try:
        res = requests.get(url, headers={"User-Agent": get_random_ua(), "Accept": "application/json"}, timeout=10)
        if res.status_code == 200:
            data = res.json()
            adverts = data.get("adverts_list", {}).get("adverts", []) or data.get("adverts", [])
            for ad in adverts:
                if not ad or not ad.get("title"): continue
                title = ad.get("title", "").strip()
                if "wanted" in title.lower() or "buy" in title.lower(): continue
                
                ad_id = ad.get("id") or random.randint(100000, 999999)
                raw_phone = ad.get("user_phone") or ad.get("phone") or ""
                phone = clean_phone_number(raw_phone)
                
                is_solar = any(q in query.lower() for q in ["solar", "inverter", "battery", "power"])
                is_ibadan = region_slug.lower() in ["ibadan"] or any(d.lower() in title.lower() for d in IBADAN_DISTRICTS)
                
                engine_type = "solar" if is_solar else ("ibadan" if is_ibadan else "lagos")
                category = "Solar Energy Dealer" if is_solar else "Commercial B2B Merchant"

                clean_name = title.split('-')[0].split('|')[0].strip()
                hash_id = hashlib.sha256(f"colab_jiji_{ad_id}_{clean_name.lower()}".encode('utf-8')).hexdigest()[:16]

                leads.append({
                    "id": f"colab_{engine_type}_{hash_id}",
                    "name": clean_name[:80],
                    "phone": phone,
                    "phone_e164": f"+{phone}" if phone else "",
                    "phone_raw": raw_phone,
                    "category": category,
                    "address": f"{ad.get('region_name', region_slug.title())}, Nigeria",
                    "city": "Ibadan" if is_ibadan else "Lagos",
                    "source_query_or_seed": f"google_colab_{query}",
                    "status": "new",
                    "notes": f"Harvested via Google Colab 24/7 Engine ({query} - p{page})",
                    "created_at": datetime.utcnow().isoformat() + "Z"
                })
    except Exception as e:
        pass
    return leads

# ---------------------------------------------------------------------------
# ENGINE 2: Nominatim OpenStreetMap Geo Engine
# ---------------------------------------------------------------------------
def fetch_nominatim_osm_leads(query, area_name="Lagos"):
    search_q = f"{query} in {area_name} Nigeria"
    url = f"https://nominatim.openstreetmap.org/search?q={requests.utils.quote(search_q)}&format=json&addressdetails=1&limit=15"
    leads = []
    try:
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0 GoogleColabHarvester/10.0"}, timeout=8)
        if res.status_code == 200 and isinstance(res.json(), list):
            items = res.json()
            for item in items:
                display = item.get("display_name", "")
                if not display: continue
                name = display.split(",")[0].strip()
                if len(name) < 3: continue
                hash_id = hashlib.sha256(f"colab_osm_{name.lower()}_{area_name.lower()}".encode('utf-8')).hexdigest()[:16]
                
                leads.append({
                    "id": f"colab_osm_{hash_id}",
                    "name": name[:80],
                    "phone": "",
                    "phone_e164": "",
                    "phone_raw": "",
                    "category": f"{query.title()} Enterprise",
                    "address": display[:120],
                    "city": area_name,
                    "source_query_or_seed": f"google_colab_osm_{query}",
                    "status": "new",
                    "notes": f"Geo-Verified via OSM ({area_name})",
                    "created_at": datetime.utcnow().isoformat() + "Z"
                })
    except Exception:
        pass
    return leads

def sync_batch_to_supabase(leads):
    if not leads: return 0
    try:
        res = requests.post(f"{SUPABASE_URL}/rest/v1/leads", headers=HEADERS, json=leads, timeout=12)
        if res.status_code in [200, 201]:
            try:
                data = res.json()
                if isinstance(data, list):
                    return len(data)
            except Exception:
                pass
            return len(leads)
    except Exception as e:
        print(f"  ⚠️ Supabase sync error: {e}")
    return 0

def run_google_colab_harvester():
    print("=========================================================================")
    print("🚀 GOOGLE COLAB 24/7 MULTI-ENGINE HARVESTER v10.0 STARTED")
    print("   100% Free Cloud Compute — Running on Google Cloud Servers")
    print("=========================================================================\n")

    cycle = 1
    total_lifetime = 0

    while True:
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"⚡ CYCLE #{cycle} [{timestamp} WAT] — Scraping Lagos, Solar & Ibadan...")
        
        cycle_total = 0

        # 1. Harvest Solar Prospects
        query = random.choice(SOLAR_QUERIES)
        solar_leads = fetch_jiji_api_leads(query, region_slug="lagos", page=random.randint(1, 3))
        if not solar_leads:
            solar_leads = fetch_nominatim_osm_leads(query, area_name="Lagos")
        synced = sync_batch_to_supabase(solar_leads)
        cycle_total += synced
        print(f"  ├─ ☀️ Solar Engine ({query}): +{synced} prospects")

        time.sleep(2)

        # 2. Harvest Lagos 10K B2B Prospects
        district = random.choice(LAGOS_DISTRICTS)
        b2b_query = random.choice(LAGOS_B2B_QUERIES)
        lagos_leads = fetch_jiji_api_leads(b2b_query, region_slug=district, page=random.randint(1, 2))
        if not lagos_leads:
            lagos_leads = fetch_nominatim_osm_leads(b2b_query, area_name=district.title())
        synced = sync_batch_to_supabase(lagos_leads)
        cycle_total += synced
        print(f"  ├─ 🏙️ Lagos 10K Engine ({b2b_query} - {district}): +{synced} prospects")

        time.sleep(2)

        # 3. Harvest Ibadan 10K Prospects
        ibadan_district = random.choice(IBADAN_DISTRICTS)
        ibadan_leads = fetch_jiji_api_leads("business", region_slug="ibadan", page=random.randint(1, 2))
        if not ibadan_leads:
            ibadan_leads = fetch_nominatim_osm_leads("business", area_name=ibadan_district)
        synced = sync_batch_to_supabase(ibadan_leads)
        cycle_total += synced
        print(f"  └─ 🏰 Ibadan 10K Engine ({ibadan_district}): +{synced} prospects")

        total_lifetime += cycle_total
        print(f"\n🎉 Cycle #{cycle} Complete: +{cycle_total} leads synced this pass (Lifetime Colab Total: +{total_lifetime})")
        print("⏳ Sleeping 30s before next Google Cloud pass...\n")
        
        time.sleep(30)
        cycle += 1

if __name__ == "__main__":
    run_google_colab_harvester()
