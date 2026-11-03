import sys
import os
import time
from PIL import Image, ImageEnhance

def make_unique(input_path, output_path):
    img = Image.open(input_path).convert('RGB')
    
    # 1. Subtle brightness & contrast tweak (+1%)
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.02)
    enhancer_b = ImageEnhance.Brightness(img)
    img = enhancer_b.enhance(1.01)
    
    # 2. Crop 1 pixel off bottom/right to guarantee fresh dimensions & hash
    w, h = img.size
    img = img.crop((0, 0, w - 2, h - 2))
    
    # 3. Save with fresh metadata and unique timestamp
    img.save(output_path, 'JPEG', quality=95)
    print(f"Saved unique image to {output_path} (size: {w-2}x{h-2})")

if __name__ == '__main__':
    src = os.path.join('public', 'jiji_ads', 'ad_8_dispatch_waybill_tracker.png')
    dst = os.path.join('public', 'jiji_ads', 'ad_8_dispatch_waybill_tracker_unique.jpg')
    desktop_dst = r'C:\Users\HomePC\Desktop\JIJI_ADS_PICTURES\ad_8_dispatch_waybill_tracker_unique.jpg'
    
    make_unique(src, dst)
    make_unique(src, desktop_dst)
