"""Builds the wall's two layers from a real photograph.

    public/wall/plywood.webp  three painted 4 x 8 ft sheets: grain, seams, screws
    public/wall/wear.webp     transparent wear: paint runs and graffiti buff marks

Source photograph (CC0, Wikimedia Commons, "Wood 036 plywood.jpg" by Dprojects):
https://commons.wikimedia.org/wiki/File:Wood_036_plywood.jpg

The page tiles the sheets at 1200 x 800 css px and the wear at 1700 x 1150, so
the two only line up again every 20,400 x 18,400 px: no visible repeat. Torn
paper is not drawn here; it lives on the wall as real remnant bills.

    python scripts/make-plywood.py path/to/Wood_036_plywood.jpg
"""

import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SHEET_W, SHEET_H = 800, 1600  # one sheet at 2x of 400 x 800 css px
SHEETS = 3
W, H = SHEET_W * SHEETS, SHEET_H
WEAR_W, WEAR_H = 1700, 1150  # 1x, css px
PAINT = np.array([0x37, 0x61, 0x3D], dtype=np.float32)  # net target #355E3B
rng = np.random.default_rng(11)


def noise(w, h, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale))).astype(np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def blur(a, radius):
    img = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius))
    return np.asarray(img, dtype=np.float32) / 255.0


def sheets(src):
    photo = Image.open(src).convert("L")
    grain = np.zeros((H, W), dtype=np.float32)
    for i in range(SHEETS):
        # Each sheet gets its own crop of the photo so the grain never repeats.
        box = (0 if i != 1 else 200, 0, photo.width - (200 if i == 2 else 0), photo.height)
        sheet = photo.crop(box).resize((SHEET_W, SHEET_H), Image.LANCZOS)
        if i == 1:
            sheet = sheet.transpose(Image.FLIP_LEFT_RIGHT)
        g = np.asarray(sheet, dtype=np.float32)
        grain[:, i * SHEET_W : (i + 1) * SHEET_W] = (g - g.mean()) / (g.std() + 1e-6)

    # Paint over wood: the grain reads as a relief under the colour.
    shade = 1.0 + 0.075 * np.clip(blur(grain / 8 + 0.5, 0.8) * 8 - 4, -3, 3)
    shade *= 1.0 + 0.05 * (noise(W, H, 110, 1) - 0.5) + 0.03 * (noise(W, H, 9, 2) - 0.5)
    rgb = PAINT[None, None, :] * shade[:, :, None]

    # Screw rows on each sheet's edges and on the two studs between them.
    yy, xx = np.ogrid[-7:8, -7:8]
    ring = (np.sqrt(xx * xx + yy * yy) <= 6.5).astype(np.float32)
    lit = (((xx + 2) ** 2 + (yy + 2) ** 2) <= 4).astype(np.float32)
    for s in range(SHEETS):
        for cx in (22, SHEET_W // 3, 2 * SHEET_W // 3, SHEET_W - 22):
            for cy in range(60, H - 8, 200):
                x = s * SHEET_W + cx + int(rng.integers(-2, 3))
                y = cy + int(rng.integers(-3, 4))
                patch = rgb[y - 7 : y + 8, x - 7 : x + 8]
                patch *= 1 - 0.28 * ring[:, :, None]
                patch += 30 * lit[:, :, None]

    # Seams on every sheet's left edge and on the top, with a lit bevel.
    for s in range(SHEETS):
        x = s * SHEET_W
        rgb[:, x : x + 3] *= 0.42
        rgb[:, x + 3 : x + 5] *= 1.12
    rgb[0:3, :] *= 0.5
    rgb[3:5, :] *= 1.1

    out = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))
    out.save("public/wall/plywood.webp", "WEBP", quality=86, method=6)
    mean = np.asarray(out, dtype=np.float32).reshape(-1, 3).mean(0)
    print("wrote public/wall/plywood.webp %dx%d, mean colour #%02x%02x%02x" % ((W, H) + tuple(int(c) for c in mean)))


def wear():
    w, h = WEAR_W, WEAR_H
    rgba = np.zeros((h, w, 4), dtype=np.float32)

    # Buff marks: graffiti painted out with a green that never quite matches,
    # brushed at the edges. Semi-opaque so the grain still shows through.
    rough = noise(w, h, 5, 5) * 0.65 + noise(w, h, 1, 6) * 0.35
    for i, (shift, warm) in enumerate(((1.08, 0.97), (0.9, 1.05), (1.06, 1.03), (0.93, 0.98))):
        shape = Image.new("L", (w, h), 0)
        x0, y0 = int(rng.integers(20, w - 320)), int(rng.integers(20, h - 300))
        bw, bh = int(rng.integers(150, 300)), int(rng.integers(110, 260))
        ImageDraw.Draw(shape).rectangle([x0, y0, x0 + bw, y0 + bh], fill=255)
        base = blur(np.asarray(shape, dtype=np.float32) / 255.0, 6)
        m = np.clip((base - 0.5 + (rough - 0.5) * 0.7) * 5 + 0.5, 0, 1)
        m *= 1.0 + 0.1 * (noise(w, h, 3, 20 + i) - 0.5)  # brush streaks
        tint = PAINT * np.array([shift * warm, shift, shift * (2 - warm)], dtype=np.float32)
        a = np.clip(m * 0.62, 0, 1)
        rgba[..., :3] = rgba[..., :3] * (1 - a[..., None]) + tint[None, None, :] * a[..., None]
        rgba[..., 3] = np.maximum(rgba[..., 3], a)

    # Paint runs from the top coat, each ending in a bead.
    dark = PAINT * 0.78
    for _ in range(12):
        x = int(rng.integers(20, w - 20))
        y0 = int(rng.integers(0, h - 420))
        length = int(rng.integers(120, 400))
        width = int(rng.integers(2, 4))
        for y in range(y0, min(h, y0 + length)):
            half = max(1, int(width * (0.6 + 0.4 * (y - y0) / length)))
            sl = slice(x - half, x + half)
            rgba[y, sl, :3] = dark
            rgba[y, sl, 3] = np.maximum(rgba[y, sl, 3], 0.5)
        by = min(h - 4, y0 + length)
        rgba[by - 3 : by + 3, x - width : x + width, :3] = dark
        rgba[by - 3 : by + 3, x - width : x + width, 3] = 0.6

    out = Image.fromarray(np.clip(np.dstack([rgba[..., :3], rgba[..., 3:] * 255]), 0, 255).astype(np.uint8))
    out.save("public/wall/wear.webp", "WEBP", quality=82, method=6)
    print("wrote public/wall/wear.webp %dx%d" % (w, h))


if __name__ == "__main__":
    sheets(sys.argv[1])
    wear()
