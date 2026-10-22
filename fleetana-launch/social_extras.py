"""After render_posts.mjs: build the LinkedIn document PDF and the Instagram grid preview per language."""
from PIL import Image

for lang in ("en", "ar"):
    d = f"social/{lang}"
    pages = [Image.open(f"{d}/li2-{i:02d}.png").convert("RGB") for i in range(1, 8)]
    pages[0].save(f"{d}/linkedin-2-document.pdf", save_all=True, append_images=pages[1:], resolution=144)
    # profile grid: newest post top-left, thumbnails cropped to 3:4
    order = [["ig9", "ig8-01", "ig7cover"], ["ig6", "ig5-01", "ig4cover"], ["ig3", "ig2-01", "ig1cover"]]
    tw, th, gap = 360, 480, 4
    grid = Image.new("RGB", (tw * 3 + gap * 2, th * 3 + gap * 2), "#ffffff")
    for r, row in enumerate(order):
        for c, name in enumerate(row):
            im = Image.open(f"{d}/{name}.png").convert("RGB"); w, h = im.size
            cw = min(w, int(h * 3 / 4)); ch = int(cw * 4 / 3); x0 = (w - cw) // 2; y0 = (h - ch) // 2
            grid.paste(im.crop((x0, y0, x0 + cw, y0 + ch)).resize((tw, th), Image.LANCZOS), (c * (tw + gap), r * (th + gap)))
    grid.save(f"{d}/instagram-grid-preview.png")
print("ok")
