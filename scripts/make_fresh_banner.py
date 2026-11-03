import sys
import random
from PIL import Image, ImageEnhance, ImageDraw

if len(sys.argv) < 3:
    print("Usage: python make_fresh_banner.py <src_png> <dst_jpg>")
    sys.exit(1)

src = sys.argv[1]
dst = sys.argv[2]

img = Image.open(src).convert('RGB')
w, h = img.size

# Random crop between 6 and 14 pixels
cx = random.randint(6, 14)
cy = random.randint(6, 14)
img = img.crop((cx, cy, w - cx, h - cy))

# Contrast & brightness micro-jitter
cf = round(random.uniform(1.02, 1.06), 3)
bf = round(random.uniform(0.97, 1.03), 3)
img = ImageEnhance.Contrast(img).enhance(cf)
img = ImageEnhance.Brightness(img).enhance(bf)

# Subtle imperceptible corner dot
draw = ImageDraw.Draw(img)
draw.point((random.randint(2, 10), random.randint(2, 10)), fill=(20, 20, 20))

img.save(dst, 'JPEG', quality=random.randint(91, 95), optimize=True)
print(f"Generated fresh banner: {dst} ({img.size})")
