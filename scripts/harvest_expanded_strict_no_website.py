import urllib.request
import re
import json
import concurrent.futures
import time
import sys
from bs4 import BeautifulSoup

# Ensure stdout handles UTF-8 / ASCII cleanly without cp1252 crashes
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

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
        carrier = get_nigerian_carrier(d)
        if carrier != 'UNKNOWN':
            return d
    return None

def fetch_company_phones(cand):
    try:
        req = urllib.request.Request(cand['prof_url'], headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        p_html = urllib.request.urlopen(req, timeout=3.5).read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(p_html, 'html.parser')
        
        # Accurately identify if company has a dedicated standalone website
        has_ext_website = False
        for a in soup.find_all('a'):
            href = a.get('href', '').strip().lower()
            if href.startswith('http') and not any(ign in href for ign in [
                'businesslist', 'google.com/maps', 'facebook.com', 'twitter.com', 
                'linkedin.com', 'instagram.com', 'youtube.com', 'wa.me', 'whatsapp.com',
                'tiktok.com', 'pinterest.com'
            ]):
                has_ext_website = True
                break

        found = re.findall(r'(?:(?:\+?234)|0)[\s.-]?[789][01](?:[\s.-]?\d){8}', p_html)
        return cand, found, has_ext_website
    except Exception:
        return cand, [], False

def main():
    db_path = 'local_db/leads_db.json'
    db = json.load(open(db_path, encoding='utf-8'))
    existing_phones = {l.get('phone') for l in db} | {l.get('phone_e164') for l in db}
    existing_names = {l.get('name', '').strip().lower() for l in db}

    # High-converting Nigerian commercial categories across multiple pagination depths
    target_pages = [
        # Solar & Power
        ('https://www.businesslist.com.ng/category/solar-energy/4', 'Solar & Inverter Systems', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/solar-energy/5', 'Solar & Inverter Systems', 'Nigeria'),
        # Construction, Architecture & Interior Finishing
        ('https://www.businesslist.com.ng/category/construction-services/4', 'Construction & Engineering', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/construction-services/5', 'Construction & Engineering', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/architects/2', 'Architectural & Interior Design', 'Nigeria'),
        # Real Estate & Property Managers
        ('https://www.businesslist.com.ng/category/estate-agents/4', 'Real Estate & Properties', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/estate-agents/5', 'Real Estate & Properties', 'Nigeria'),
        # Clinics, Diagnostic Centers & Healthcare
        ('https://www.businesslist.com.ng/category/doctors-and-clinics/4', 'Healthcare & Medical Clinics', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/doctors-and-clinics/5', 'Healthcare & Medical Clinics', 'Nigeria'),
        # Vehicle Services & Tokunbo Car Dealerships
        ('https://www.businesslist.com.ng/category/vehicle-services/4', 'Auto Dealerships & Garages', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/vehicle-services/5', 'Auto Dealerships & Garages', 'Nigeria'),
        # Logistics & Haulage
        ('https://www.businesslist.com.ng/category/courier-services/2', 'Logistics & Haulage Dispatch', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/courier-services/3', 'Logistics & Haulage Dispatch', 'Nigeria'),
        # Private Schools & Academies
        ('https://www.businesslist.com.ng/category/schools/3', 'Private Schools & Academies', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/schools/4', 'Private Schools & Academies', 'Nigeria'),
        # Hotels & Shortlet Apartments
        ('https://www.businesslist.com.ng/category/hotels/3', 'Hotels & Shortlet Hospitality', 'Nigeria'),
        ('https://www.businesslist.com.ng/category/hotels/4', 'Hotels & Shortlet Hospitality', 'Nigeria'),
        # Law Firms & Legal Consultancies
        ('https://www.businesslist.com.ng/category/lawyers/3', 'Law Firms & Legal Chambers', 'Nigeria'),
        # Restaurants & Catering
        ('https://www.businesslist.com.ng/category/restaurants/4', 'Restaurants & Food Vendors', 'Nigeria'),
        # Beauty Salons, Spas & Wellness
        ('https://www.businesslist.com.ng/category/beauty-salons/2', 'Salons & Wellness Spas', 'Nigeria'),
    ]

    candidates = []
    print(f"[*] Scanning {len(target_pages)} high-yield category pages across Nigeria...")
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
                if len(clean_name) < 3 or clean_name.lower() in existing_names: continue
                
                addr_el = c.select_one('.address, .location')
                address = addr_el.get_text(strip=True) if addr_el else f'{area}, Nigeria'
                href = name_el.get('href', '')
                prof_url = href if href.startswith('http') else ('https://www.businesslist.com.ng' + href)
                candidates.append({'name': clean_name, 'address': address, 'prof_url': prof_url, 'category': cat, 'area': area})
        except Exception:
            pass

    print(f"[*] Found {len(candidates)} candidate companies. Concurrently checking profile details with 20 parallel threads...")
    t0 = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        results = list(executor.map(fetch_company_phones, candidates))

    added = 0
    discarded_has_website = 0
    discarded_no_valid_phone = 0

    for cand, phones, has_ext_web in results:
        # 1. STRICT NO-WEBSITE FILTER:
        # If the company already has a website, discard immediately!
        # We only want businesses without websites so we can sell them DFY website prototypes!
        if has_ext_web:
            discarded_has_website += 1
            continue

        valid_phone_found = None
        for p in phones:
            clean_p = validate_phone(p)
            if clean_p and clean_p not in existing_phones:
                valid_phone_found = clean_p
                break

        if not valid_phone_found:
            discarded_no_valid_phone += 1
            continue

        existing_phones.add(valid_phone_found)
        existing_names.add(cand['name'].lower())
        carrier = get_nigerian_carrier(valid_phone_found)

        # Generate slug for preview
        slug = re.sub(r'[^a-z0-9]+', '-', cand['name'].lower()).strip('-')
        lead_id = f"biz_{int(time.time()*1000)}_{added}"

        db.append({
            'id': lead_id,
            'lead_id': lead_id,
            'slug': slug,
            'name': cand['name'],
            'business_name': cand['name'],
            'phone': valid_phone_found,
            'phone_e164': '+234' + valid_phone_found[1:],
            'carrier': carrier,
            'email': None,
            'category': cand['category'],
            'sector': cand['category'],
            'area': cand['area'],
            'address': cand['address'],
            'website': None,
            'has_website': False,
            'hasWebsite': False,
            'preview_url': f"https://www.bethelmindanalytics.com/preview/{slug}",
            'source': 'BUSINESSLIST_NG_STRICT_NO_WEBSITE',
            'confidenceScore': 98,
            'status': 'NEW',
            'engineTag': 'HIGH_SPEED_STRICT_NO_WEBSITE_HARVESTER',
            'created_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        })
        added += 1

    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(db, f, indent=2)

    elapsed = time.time() - t0
    total_no_site = sum(1 for l in db if not l.get('website') or l.get('has_website') is False or l.get('website') in ['', 'N/A', 'None', None])
    print(f"\n[SUCCESS] Harvest run completed in {elapsed:.1f} seconds:")
    print(f"  + New verified NON-WEBSITE leads added: {added}")
    print(f"  - Discarded (already had websites): {discarded_has_website}")
    print(f"  - Discarded (no valid phone): {discarded_no_valid_phone}")
    print(f"  * Total database size: {len(db)}")
    print(f"  * Total 100% NON-WEBSITE SMEs in database: {total_no_site} ({total_no_site/len(db)*100:.1f}%)")

if __name__ == '__main__':
    main()
