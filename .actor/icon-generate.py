#!/usr/bin/env python3
"""Generate Apify actor icons matching Elisabeth Hitz brand:
Cormorant Garamond/Didot serif + Montserrat sans, warm blush + teal palette.
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Brand palette (Closer Method / Brain Builder design system)
CREAM = (251, 246, 240)       # warm cream
WARM_BLUSH = (245, 215, 195)  # warm blush
DEEP_TEAL = (44, 95, 93)      # deep teal
LIGHT_TEAL = (143, 178, 175)  # soft teal accent
INK = (54, 49, 43)            # warm ink (no pure black)

DIDOT = "/System/Library/Fonts/Supplemental/Didot.ttc"
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"

SIZE = 512

def make_icon(letter: str, bg: tuple, fg: tuple, accent: tuple, output_path: str, accent_dots: int = 0):
    img = Image.new("RGB", (SIZE, SIZE), bg)
    draw = ImageDraw.Draw(img)

    # Subtle border ring
    border_pad = 12
    for i in range(3):
        draw.rounded_rectangle(
            [border_pad + i, border_pad + i, SIZE - border_pad - i, SIZE - border_pad - i],
            radius=80,
            outline=(*accent, 40 + i * 20) if len(accent) == 4 else accent,
            width=1,
        )

    # Try Didot italic, fall back to Georgia Bold
    font_size = 380
    try:
        font = ImageFont.truetype(DIDOT, font_size, index=1)  # Didot Italic
    except Exception:
        font = ImageFont.truetype(GEORGIA_BOLD, font_size)

    # Center the letter
    bbox = draw.textbbox((0, 0), letter, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (SIZE - text_w) // 2 - bbox[0]
    y = (SIZE - text_h) // 2 - bbox[1] - 12  # slight optical adjust
    draw.text((x, y), letter, font=font, fill=fg)

    # Accent dots (small marks indicating breadth — countries, tools, etc.)
    if accent_dots > 0:
        dot_radius = 8
        gap = 28
        total_w = (accent_dots - 1) * gap
        start_x = (SIZE - total_w) // 2
        dot_y = SIZE - 80
        for i in range(accent_dots):
            cx = start_x + i * gap
            draw.ellipse(
                [cx - dot_radius, dot_y - dot_radius, cx + dot_radius, dot_y + dot_radius],
                fill=accent,
            )

    img.save(output_path, "PNG", optimize=True)
    print(f"Wrote {output_path}")


# Icon 1: SMB Sales Intelligence MCP
# Warm cream bg, deep teal "S", 3 accent dots = 3-option pricing framework signature
make_icon(
    letter="S",
    bg=CREAM,
    fg=DEEP_TEAL,
    accent=WARM_BLUSH,
    output_path=os.path.expanduser("~/Desktop/icon-smb-sales.png"),
    accent_dots=3,
)

# Icon 2: EMEA Compliance MCP
# Warm blush bg, deep teal "E", 7 accent dots = 7 EMEA countries
make_icon(
    letter="E",
    bg=WARM_BLUSH,
    fg=DEEP_TEAL,
    accent=CREAM,
    output_path=os.path.expanduser("~/Desktop/icon-emea-compliance.png"),
    accent_dots=7,
)
