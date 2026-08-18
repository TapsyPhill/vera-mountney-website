#!/usr/bin/env python3
"""Generate the Vera Mountney Open Graph share image (1200x630)."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PORTRAIT = ROOT / "public/assets/images/profile/vera-mountney-main.jpg"
OUTPUT = ROOT / "public/og-image.jpg"

WIDTH, HEIGHT = 1200, 630
PORTRAIT_SIZE = 400
PORTRAIT_X = WIDTH - PORTRAIT_SIZE - 96
PORTRAIT_Y = (HEIGHT - PORTRAIT_SIZE) // 2


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def gradient_bg() -> Image.Image:
    img = Image.new("RGB", (WIDTH, HEIGHT))
    px = img.load()
    for y in range(HEIGHT):
        for x in range(WIDTH):
            t = (x / WIDTH + y / HEIGHT) / 2
            r = lerp(18, 76, t)
            g = lerp(10, 29, t)
            b = lerp(36, 149, t)
            px[x, y] = (r, g, b)
    return img


def add_glow(base: Image.Image, cx: int, cy: int, radius: int, color: tuple[int, int, int, int]) -> None:
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(glow)
    for step in range(radius, 0, -4):
        alpha = int(color[3] * (step / radius) ** 2)
        draw.ellipse(
            (cx - step, cy - step, cx + step, cy + step),
            fill=(color[0], color[1], color[2], alpha),
        )
    glow = glow.filter(ImageFilter.GaussianBlur(radius // 3))
    base.paste(glow, (0, 0), glow)


def circular_portrait() -> Image.Image:
    src = Image.open(PORTRAIT).convert("RGB")
    w, h = src.size
    side = min(w, h)
    left = (w - side) // 2
    top = max(0, (h - side) // 6)
    src = src.crop((left, top, left + side, top + side))
    src = src.resize((PORTRAIT_SIZE, PORTRAIT_SIZE), Image.Resampling.LANCZOS)

    mask = Image.new("L", (PORTRAIT_SIZE, PORTRAIT_SIZE), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, PORTRAIT_SIZE, PORTRAIT_SIZE), fill=255)
    out = Image.new("RGBA", (PORTRAIT_SIZE, PORTRAIT_SIZE), (0, 0, 0, 0))
    out.paste(src, (0, 0), mask)
    return out


def portrait_ring() -> Image.Image:
    ring = Image.new("RGBA", (PORTRAIT_SIZE + 16, PORTRAIT_SIZE + 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(ring)
    bbox = (4, 4, PORTRAIT_SIZE + 12, PORTRAIT_SIZE + 12)
    draw.ellipse(bbox, outline=(251, 191, 36, 255), width=5)
    return ring


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main() -> None:
    img = gradient_bg().convert("RGBA")
    add_glow(img, 220, 170, 260, (123, 47, 242, 90))
    add_glow(img, 1040, 120, 140, (123, 47, 242, 55))
    add_glow(img, 180, 520, 110, (251, 191, 36, 45))
    add_glow(img, 900, 500, 200, (251, 191, 36, 35))

    draw = ImageDraw.Draw(img)

    label_font = load_font(22, bold=True)
    title_font = load_font(74, bold=True)
    body_font = load_font(30)
    sub_font = load_font(22)
    url_font = load_font(26, bold=True)

    draw.text((88, 58), "VERA MOUNTNEY", font=label_font, fill=(251, 191, 36))
    draw.text((88, 118), "Vera Mountney", font=title_font, fill=(255, 255, 255))
    draw.rectangle((88, 210, 184, 214), fill=(251, 191, 36))
    draw.text((88, 248), "Creative Language Adviser,", font=body_font, fill=(212, 196, 228))
    draw.text((88, 292), "Coach & Author", font=body_font, fill=(212, 196, 228))
    draw.text((88, 364), "Coaching · Beratung · Integration · Buch", font=sub_font, fill=(167, 139, 250))
    draw.line((88, 548, 408, 548), fill=(255, 255, 255, 40), width=1)
    draw.text((88, 568), "vera-mountney.de", font=url_font, fill=(251, 191, 36))

    ring = portrait_ring()
    portrait = circular_portrait()
    img.paste(ring, (PORTRAIT_X - 8, PORTRAIT_Y - 8), ring)
    img.paste(portrait, (PORTRAIT_X, PORTRAIT_Y), portrait)

    img.convert("RGB").save(OUTPUT, "JPEG", quality=92, optimize=True, progressive=True)
    print(f"Open Graph image written to {OUTPUT} ({WIDTH}x{HEIGHT})")


if __name__ == "__main__":
    main()
