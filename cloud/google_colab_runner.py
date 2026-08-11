"""
===============================================================================
🚀 GOOGLE COLAB 24/7 MULTI-ENGINE LEAD HARVESTER v9.0 (ZERO LAPTOP CPU)
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
import time
import requests
import json
import random
import re
from datetime import datetime

# 🔐 Supabase Cloud Connection Credentials
SUPABASE_URL = "https://szyuterncawfxwzhvwcf.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eXV0ZXJuY2F3Znh3emh2d2NmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjM5ODIwOSwiZXhwIjoyMDk3OTc0MjA5fQ._SzfC4NE4KCwWkK_GFQAyQjgkFrQLhbpz1w9R3FIUBY"

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

# Target Multi-Engine Sectors & Districts
SOLAR_QUERIES = ["solar panel", "inverter dealer", "lithium battery", "solar installation", "solar light", "power equipment"]
LAGOS_DISTRICTS = ["Ikeja", "Lekki", "Victoria Island", "Yaba", "Surulere", "Oshodi", "Ikorodu", "Alimosho", "Gbagada", "Festac", "Ajah", "Agege"]
LAGOS_B2B_QUERIES = ["boutique", "supermarket", "car dealer", "pharmacy", "logistics", "restaurant", "hotel", "furniture", "electronics"]
IBADAN_DISTRICTS = ["Bodija", "Dugbe", "Challenge", "Mokola", "Agbowo", "Jericho", "Ring Road"]

def clean_phone_number(raw_phone):
    if not raw_phone: return ""
    digits = re.sub(r'\D', '', str(raw_phone))
    if digits.startswith('0') and len(digits) == 11:
        return '234' + digits[1:]
    if digits.startswith('234') and len(digits) == 13:
        return digits
    return digits if len(digits) >= 10 else ""

def fetch_jiji_cloud_leads(query, region="lagos", page=1):
    url = f"https://jiji.ng/api/v1/search?query={requests.utils.quote(query)}&region={region.lower()}&page={page}"
    leads = []
    try:
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}, timeout=8)
        if res.status_code == 200:
            adverts = res.json().get("adverts_list", [])
            for ad in adverts:
                title = ad.get("title", "").strip()
                if not title or len(title) < 3: continue
                ad_id = ad.get("id") or random.randint(100000, 999999)
                raw_phone = ad.get("user_phone") or ad.get("phone") or ""
                phone = clean_phone_number(raw_phone)
                
                is_solar = any(q in query.lower() for q in ["solar", "inverter", "battery", "power"])
                is_ibadan = region.lower() in ["ibadan"] or any(d.lower() in title.lower() for d in IBADAN_DISTRICTS)
                
                engine_type = "solar" if is_solar else ("ibadan" if is_ibadan else "lagos")
                category = "Solar Energy Dealer" if is_solar else "Commercial B2B Merchant"

                leads.append({
                    "id": f"colab_{engine_type}_{ad_id}",
                    "name": title[:80],
                    "phone": phone,
                    "phone_e164": f"+{phone}" if phone else "",
                    "phone_raw": raw_phone,
                    "category": category,
                    "address": f"{ad.get('region_name', region.title())}, Nigeria",
                    "city": "Ibadan" if is_ibadan else "Lagos",
                    "source_query_or_seed": f"google_colab_{query}",
                    "status": "new",
                    "notes": f"Harvested via Google Colab 24/7 Engine ({query} - p{page})",
                    "created_at": datetime.utcnow().isoformat() + "Z"
                })
    except Exception as e:
        print(f"  ⚠️ Fetch warning ({query}): {e}")
    return leads

def sync_batch_to_supabase(leads):
    if not leads: return 0
    try:
        res = requests.post(f"{SUPABASE_URL}/rest/v1/leads", headers=HEADERS, json=leads, timeout=12)
        if res.status_code in [200, 201]:
            return len(leads)
    except Exception as e:
        print(f"  ⚠️ Supabase sync error: {e}")
    return 0

def run_google_colab_harvester():
    print("=========================================================================")
    print("🚀 GOOGLE COLAB 24/7 MULTI-ENGINE HARVESTER STARTED")
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
        solar_leads = fetch_jiji_cloud_leads(query, region="lagos", page=random.randint(1, 3))
        synced = sync_batch_to_supabase(solar_leads)
        cycle_total += synced
        print(f"  ├─ ☀️ Solar Engine ({query}): +{synced} prospects")

        time.sleep(2)

        # 2. Harvest Lagos 10K B2B Prospects
        district = random.choice(LAGOS_DISTRICTS)
        b2b_query = random.choice(LAGOS_B2B_QUERIES)
        lagos_leads = fetch_jiji_cloud_leads(f"{b2b_query} {district}", region="lagos", page=random.randint(1, 2))
        synced = sync_batch_to_supabase(lagos_leads)
        cycle_total += synced
        print(f"  ├─ 🏙️ Lagos 10K Engine ({b2b_query} - {district}): +{synced} prospects")

        time.sleep(2)

        # 3. Harvest Ibadan 10K Prospects
        ibadan_district = random.choice(IBADAN_DISTRICTS)
        ibadan_leads = fetch_jiji_cloud_leads(f"business {ibadan_district}", region="ibadan", page=random.randint(1, 2))
        synced = sync_batch_to_supabase(ibadan_leads)
        cycle_total += synced
        print(f"  └─ 🏰 Ibadan 10K Engine ({ibadan_district}): +{synced} prospects")

        total_lifetime += cycle_total
        print(f"\n🎉 Cycle #{cycle} Complete: +{cycle_total} leads synced this pass (Lifetime Colab Total: +{total_lifetime})")
        print("⏳ Sleeping 45s before next Google Cloud pass...\n")
        
        time.sleep(45)
        cycle += 1

if __name__ == "__main__":
    run_google_colab_harvester()
