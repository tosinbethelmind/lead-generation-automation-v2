import os
from PIL import Image, ImageEnhance

src = os.path.join('public', 'jiji_ads', 'ad_14_website_to_android_app_luxury.png')
dst = os.path.join('public', 'jiji_ads', 'ad_14_website_to_android_app_luxury_unique.jpg')
desktop_dst = r'C:\Users\HomePC\Desktop\JIJI_ADS_PICTURES\ad_14_website_to_android_app_luxury_unique.jpg'

img = Image.open(src).convert('RGB')
enhancer = ImageEnhance.Contrast(img)
img = enhancer.enhance(1.02)
enhancer_b = ImageEnhance.Brightness(img)
img = enhancer_b.enhance(1.01)

w, h = img.size
img = img.crop((1, 1, w - 1, h - 1))

img.save(dst, 'JPEG', quality=95)
img.save(desktop_dst, 'JPEG', quality=95)
print(f"Successfully generated unique image: {dst} ({w-2}x{h-2})")
