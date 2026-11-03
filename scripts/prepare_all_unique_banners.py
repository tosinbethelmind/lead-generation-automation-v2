import os
import random
from PIL import Image, ImageEnhance

banners = [
    ('ad_2_website_ai_closer_luxury.png', 'ad_2_unique.jpg'),
    ('ad_3_solar_boq_sizer_luxury.png', 'ad_3_unique.jpg'),
    ('ad_4_fake_alert_shield_luxury.png', 'ad_4_unique.jpg'),
    ('ad_5_salon_deposit_booking_luxury.png', 'ad_5_unique.jpg'),
    ('ad_6_school_fee_portal_luxury.png', 'ad_6_unique.jpg'),
    ('ad_7_tenant_rent_portal_luxury.png', 'ad_7_unique.jpg'),
    ('ad_8_dispatch_waybill_tracker_luxury.png', 'ad_8_unique.jpg'),
    ('ad_9_stock_theft_ledger_luxury.png', 'ad_9_unique.jpg'),
    ('ad_10_construction_estimator_luxury.png', 'ad_10_unique.jpg'),
    ('ad_11_shortlet_booking_escrow_luxury.png', 'ad_11_unique.jpg'),
    ('ad_14_website_to_android_app_luxury.png', 'ad_14_unique.jpg'),
]

src_dir = os.path.join('public', 'jiji_ads')
desktop_dir = r'C:\Users\HomePC\Desktop\JIJI_ADS_PICTURES'
os.makedirs(desktop_dir, exist_ok=True)

for src_name, dst_name in banners:
    src_path = os.path.join(src_dir, src_name)
    if not os.path.exists(src_path):
        print(f"Skipping {src_name}, not found")
        continue

    img = Image.open(src_path).convert('RGB')
    
    # Slight micro-contrast adjustment (1.01 - 1.03)
    contrast_factor = round(random.uniform(1.01, 1.03), 3)
    img = ImageEnhance.Contrast(img).enhance(contrast_factor)
    
    # Slight micro-brightness adjustment (1.005 - 1.015)
    brightness_factor = round(random.uniform(1.005, 1.015), 3)
    img = ImageEnhance.Brightness(img).enhance(brightness_factor)
    
    # Crop 2-3 pixels to change dimensions and checksum
    crop_x = random.randint(1, 3)
    crop_y = random.randint(1, 3)
    w, h = img.size
    img = img.crop((crop_x, crop_y, w - crop_x, h - crop_y))
    
    dst_path = os.path.join(src_dir, dst_name)
    desktop_dst = os.path.join(desktop_dir, dst_name)
    
    img.save(dst_path, 'JPEG', quality=94, optimize=True)
    img.save(desktop_dst, 'JPEG', quality=94, optimize=True)
    print(f"Saved: {dst_name} -> {img.size}")

print("All unique banners generated successfully!")
