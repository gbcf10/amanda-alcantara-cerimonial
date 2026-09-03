from PIL import Image

src = r"C:\Users\Usuario\Downloads\WhatsApp Image 2026-09-01 at 22.36.23.jpeg"
dst = r"C:\Users\Usuario\Desktop\cerimonial amanda\public\logo.png"

img = Image.open(src).convert("L")  # grayscale

# Autocrop: bounding box of pixels darker than near-white threshold
threshold = 245
mask = img.point(lambda p: 255 if p < threshold else 0)
bbox = mask.getbbox()
if bbox:
    pad = 20
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(img.width, bbox[2] + pad)
    bottom = min(img.height, bbox[3] + pad)
    img = img.crop((left, top, right, bottom))

# Alpha = darkness (black logo becomes opaque, white becomes transparent)
alpha = img.point(lambda p: max(0, 255 - p))

# Solid foreground-colored RGB layer
fg = Image.new("RGB", img.size, (20, 18, 15))
rgba = fg.convert("RGBA")
rgba.putalpha(alpha)

rgba.save(dst, "PNG")
print(f"Logo salva em {dst} ({rgba.size[0]}x{rgba.size[1]})")
