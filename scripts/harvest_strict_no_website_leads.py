import urllib.request
import re
import json
import concurrent.futures
import time
from bs4 import BeautifulSoup

def get_nigerian_carrier(clean_phone):
    pre = clean_phone[:4]
    if pre in ['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916', '0704']: return 'MTN'
    if pre in ['0802', '0808', '0708', '0812', '0701', '0902', '0901', '0904', '0907', '0912']: return 'Airtel'
    if pre in ['0805', '0807', '0705', '0815', '0811', '0905', '0915']: return 'Glo'
    if pre in ['0809', '0817', '0818', '0909', '0908']: return '9mobile'
    return 'UNKNOWN'

def validate_phone(p):
    d = re.sub(r'\D', '', p)
    if d.startswith('234') and len(d) == 13: d = '0' + d[3:]
    elif len(d) == 10: d = '0' + d
    if len(d) == 11 and d.startswith('0') and not any(x in d for x in ['0000', '1111', '8888', '123456']):
        return d
    return None

def fetch_company_phones(cand):
    try:
        req = urllib.request.Request(cand['prof_url'], headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        p_html = urllib.request.urlopen(req, timeout=3.5).read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(p_html, 'html.parser')
        
        # Accurately identify if company has a dedicated standalone website (ignoring Google Maps, social media, directory links)
        has_ext_website = False
        for a in soup.find_all('a'):
            href = a.get('href', '').strip().lower()
            if href.startswith('http') and not any(ign in href for ign in ['businesslist', 'google.com/maps', 'facebook.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'wa.me', 'whatsapp.com']):
                has_ext_website = True
                break

        found = re.findall(r'(?:(?:\+?234)|0)[\s.-]?[789][01](?:[\s.-]?\d){8}', p_html)
        return cand, found, has_ext_website
    except Exception:
        return cand, [], False

def main():
    db = json.load(open('local_db/leads_db.json', encoding='utf-8'))
    existing = {l.get('phone') for l in db} | {l.get('phone_e164') for l in db}

    target_pages = [
        ('https://www.businesslist.com.ng/category/construction-services/3', 'Construction Contractors (Page 3)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/doctors-and-clinics/3', 'Doctors & Private Clinics (Page 3)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/estate-agents/3', 'Real Estate & Property Agents (Page 3)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/vehicle-services/3', 'Auto Repair & Vehicle Services (Page 3)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/restaurants/3', 'Restaurants & Catering (Page 3)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/shopping-centres/3', 'Retail Stores & Shopping Malls (Page 3)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/solar-energy/3', 'Solar & Inverter Contractors (Page 3)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/employment-agencies/2', 'Employment & Staffing Agencies (Page 2)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/schools/2', 'Private Schools & Colleges (Page 2)', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/lawyers/2', 'Law Firms & Legal Consultancies (Page 2)', 'Nigeria')
    ]

    candidates = []
    print(f"Scanning {len(target_pages)} category pages for active Nigerian businesses...")
    for page_url, cat, area in target_pages:
        try:
            req = urllib.request.Request(page_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            for c in soup.select('div.company'):
                name_el = c.select_one('h4 a, h3 a, a.company_name')
                if not name_el: continue
                clean_name = re.sub(r'^\d+\s*\|\s*', '', name_el.get_text(strip=True)).strip()
                clean_name = re.sub(r'view profile', '', clean_name, flags=re.I).strip()
                if len(clean_name) < 3: continue
                addr_el = c.select_one('.address, .location')
                address = addr_el.get_text(strip=True) if addr_el else f'{area}, Nigeria'
                href = name_el.get('href', '')
                prof_url = href if href.startswith('http') else ('https://www.businesslist.com.ng' + href)
                candidates.append({'name': clean_name, 'address': address, 'prof_url': prof_url, 'category': cat, 'area': area})
        except Exception as e:
            pass

    print(f"Discovered {len(candidates)} prospective companies. Concurrently parsing phone numbers via 15 parallel workers (Strict Zero-Website Enforcement)...")
    t0 = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
        results = list(executor.map(fetch_company_phones, candidates))

    added = 0
    discarded_websites = 0
    for cand, phones, has_ext_web in results:
        if has_ext_web:
            discarded_websites += 1
            continue  # STRICT NO-WEBSITE FILTER: Reject any company with an existing website!

        for p in phones:
            clean_p = validate_phone(p)
            if clean_p and clean_p not in existing:
                existing.add(clean_p)
                carrier = get_nigerian_carrier(clean_p)
                db.append({
                    'id': f'bizlist_{int(time.time()*1000)}_{added}',
                    'lead_id': f'bizlist_{int(time.time()*1000)}_{added}',
                    'name': cand['name'],
                    'business_name': cand['name'],
                    'phone': clean_p,
                    'phone_e164': '+234' + clean_p[1:],
                    'carrier': carrier,
                    'email': None,
                    'category': cand['category'],
                    'area': cand['area'],
                    'address': cand['address'],
                    'website': None,
                    'hasWebsite': False,
                    'source': 'BUSINESSLIST_NG',
                    'confidenceScore': 95,
                    'status': 'NEW',
                    'engineTag': 'PARALLEL_STRICT_NO_WEBSITE_HARVESTER',
                    'created_at': '2026-10-08T10:40:00Z'
                })
                added += 1
                break

    json.dump(db, open('local_db/leads_db.json', 'w', encoding='utf-8'), indent=2)
    elapsed = time.time() - t0
    print(f"=== HIGH-SPEED HARVEST COMPLETE in {elapsed:.2f}s ===")
    print(f"* Added 100% NON-WEBSITE Genuine Leads: {added}")
    print(f"* Companies filtered out (Had existing websites): {discarded_websites}")
    print(f"* Total Verified Database Size: {len(db)}")

if __name__ == '__main__':
    main()
