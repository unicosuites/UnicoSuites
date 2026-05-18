#!/usr/bin/env python3
"""Image pipeline for Unico Suites site.

Inputs : /Users/aliamin/Productions/UnicoSuites/public
Outputs: /Users/aliamin/Productions/UnicoSuites/site/assets/{brand,images,team,icons}
"""

from __future__ import annotations

import io
import os
import sys
import unicodedata
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

PUBLIC = Path("/Users/aliamin/Productions/UnicoSuites/public")
SITE   = Path("/Users/aliamin/Productions/UnicoSuites/site")
BRAND  = SITE / "assets" / "brand"
IMAGES = SITE / "assets" / "images"
TEAM   = SITE / "assets" / "team"
ICONS  = SITE / "assets" / "icons"

for d in (BRAND, IMAGES, TEAM, ICONS):
    d.mkdir(parents=True, exist_ok=True)


# ----------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------

def find_file(stem_substring: str) -> Path:
    """Locate a file in PUBLIC whose name contains stem_substring (case-insensitive)."""
    s = stem_substring.lower()
    for p in PUBLIC.iterdir():
        if s in p.name.lower():
            return p
    raise FileNotFoundError(f"No file matching {stem_substring!r} in {PUBLIC}")


def save_jpeg(img: Image.Image, dest: Path, quality: int = 84) -> None:
    img = img.convert("RGB")
    img.save(dest, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"  ✔ {dest.relative_to(SITE)}  ({dest.stat().st_size//1024} KB)")


def save_webp(img: Image.Image, dest: Path, quality: int = 82, lossless: bool = False) -> None:
    img.save(dest, "WEBP", quality=quality, method=6, lossless=lossless)
    print(f"  ✔ {dest.relative_to(SITE)}  ({dest.stat().st_size//1024} KB)")


def save_png(img: Image.Image, dest: Path) -> None:
    img.save(dest, "PNG", optimize=True)
    print(f"  ✔ {dest.relative_to(SITE)}  ({dest.stat().st_size//1024} KB)")


def resize_within(img: Image.Image, max_w: int, max_h: int | None = None) -> Image.Image:
    max_h = max_h or 10_000
    w, h = img.size
    scale = min(max_w / w, max_h / h, 1.0)
    if scale >= 1.0:
        return img
    return img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)


# ----------------------------------------------------------------------
# Brand assets
# ----------------------------------------------------------------------

def process_brand():
    print("\n▶ Brand assets")
    logo = Image.open(find_file("Unico Suites _ new logo.png"))
    # Logo is a flat-coloured graphic — heavily quantise the PNG for size.
    logo_small = resize_within(logo, 320).convert("RGBA")
    # Quantise (256 colours, dithered) — drops ~290KB to ~20KB without visible loss
    logo_palette = logo_small.convert("RGB").quantize(colors=64, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
    logo_palette.save(BRAND / "logo.png", "PNG", optimize=True)
    print(f"  ✔ assets/brand/logo.png  ({(BRAND / 'logo.png').stat().st_size//1024} KB)")
    save_webp(logo_small, BRAND / "logo.webp", quality=88)

    # Banner — clean (no text)
    banner = Image.open(find_file("Banner with no text or logo.png")).convert("RGB")
    save_jpeg(resize_within(banner, 2400), BRAND / "banner-hero.jpg", quality=86)
    save_webp(resize_within(banner, 2400), BRAND / "banner-hero.webp", quality=82)
    save_jpeg(resize_within(banner, 1200), BRAND / "banner-hero-1200.jpg", quality=82)
    save_webp(resize_within(banner, 1200), BRAND / "banner-hero-1200.webp", quality=80)

    # Branded banner (with text + logo) — used on About / final CTA
    branded = Image.open(find_file("Unico Suites _ main banner.jpeg")).convert("RGB")
    save_jpeg(resize_within(branded, 2400), BRAND / "banner-branded.jpg", quality=86)
    save_webp(resize_within(branded, 2400), BRAND / "banner-branded.webp", quality=82)

    # Favicon set (use the central U-mark from logo — square crop of the logo)
    # logo is square 1024×1024 navy with U-mark; export at various favicon sizes
    base = logo.convert("RGBA")
    for size in (16, 32, 48, 64, 96, 144, 180, 192, 256, 512):
        ico = base.resize((size, size), Image.LANCZOS)
        save_png(ico, ICONS / f"favicon-{size}.png")
    base.resize((512, 512), Image.LANCZOS).save(ICONS / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"  ✔ assets/icons/favicon.ico")

    # OG image — branded banner cropped to 1200×630
    og = branded.copy()
    w, h = og.size
    target_ratio = 1200 / 630
    cur_ratio = w / h
    if cur_ratio > target_ratio:
        new_w = int(h * target_ratio)
        og = og.crop(((w - new_w) // 2, 0, (w + new_w) // 2, h))
    else:
        new_h = int(w / target_ratio)
        og = og.crop((0, (h - new_h) // 2, w, (h + new_h) // 2))
    og = og.resize((1200, 630), Image.LANCZOS)
    save_jpeg(og, BRAND / "og-image.jpg", quality=85)


# ----------------------------------------------------------------------
# Property photos
# ----------------------------------------------------------------------

PROPERTY_MAP = {
    # source stem -> (out slug, alt text)
    "4_52653":  ("living-grey",  "Bright living room with grey sofa, gallery wall and parquet floor"),
    "7_52653":  ("living-fireplace", "Reception room with wing-back armchair, fireplace and bookshelf"),
    "16_52653": ("bathroom-freestanding", "Bathroom with freestanding bath, patterned floor tiles and oak door"),
    "22_52653": ("hallway-monochrome", "Monochrome hallway with crittall doors and tiled floor"),
    "25_52653": ("kitchen-island", "Open-plan kitchen with marble flooring, navy island and skylight"),
    "30_52653": ("garden-pergola", "Garden patio with glass pergola, rattan seating and dining set"),
}


def process_properties():
    print("\n▶ Property photos")
    for src_stem, (slug, _alt) in PROPERTY_MAP.items():
        src = find_file(src_stem)
        img = Image.open(src).convert("RGB")
        # Three responsive sizes per image: 2000, 1200, 640 (square crop for thumbs handled by CSS)
        for w in (2000, 1200, 640):
            r = resize_within(img, w)
            save_webp(r, IMAGES / f"{slug}-{w}.webp", quality=80 if w >= 1200 else 78)
            save_jpeg(r, IMAGES / f"{slug}-{w}.jpg", quality=82 if w >= 1200 else 80)


# ----------------------------------------------------------------------
# Founder portraits — background removal + circular crop
# ----------------------------------------------------------------------

def find_founders() -> tuple[Path, Path]:
    """Return (saad_src, naz_src). Resolves unicode-narrow-space-bearing names."""
    saad, naz = None, None
    for p in PUBLIC.iterdir():
        n = unicodedata.normalize("NFKC", p.name)
        if "WhatsApp Image 2026-04-01" in n:
            saad = p
        elif "WhatsApp Image 2026-04-14" in n:
            naz = p
    if not saad or not naz:
        raise FileNotFoundError(f"Founder images not found. saad={saad}, naz={naz}")
    return saad, naz


def remove_background(src: Path) -> Image.Image:
    """Run rembg on src. Returns RGBA PIL image."""
    from rembg import remove
    data = src.read_bytes()
    out = remove(data, alpha_matting=True, alpha_matting_foreground_threshold=240,
                 alpha_matting_background_threshold=20, alpha_matting_erode_size=11)
    return Image.open(io.BytesIO(out)).convert("RGBA")


def compute_head_box(alpha: Image.Image, img_w: int, img_h: int,
                     side_scale: float = 3.0, eye_from_top: float = 0.40) -> tuple[int, int, int, int]:
    """Find a square crop box around the head, GUARANTEED to lie fully inside the
    image so the circular portrait is filled edge-to-edge (background intact).

    rembg's alpha is used ONLY to locate the head — the box is then applied to the
    original photo, backgrounds and all.
    """
    bbox = alpha.getbbox()
    if bbox is None:
        # Fallback: centre square
        side = min(img_w, img_h)
        left = (img_w - side) // 2
        top = 0
        return (left, top, left + side, top + side)
    x0, y0, x1, y1 = bbox
    subj_w = x1 - x0
    subj_h = y1 - y0

    # Head occupies roughly the top ~22% of a head-and-shoulders pose.
    head_slice = alpha.crop((x0, y0, x1, y0 + max(1, int(subj_h * 0.22))))
    hb = head_slice.getbbox()
    if hb:
        hx0, hy0, hx1, hy1 = hb
        head_w = max(hx1 - hx0, int(subj_w * 0.25))
        head_cx = x0 + (hx0 + hx1) // 2
        head_cy = y0 + (hy0 + hy1) // 2          # ~ eye / forehead line
    else:
        head_w = subj_w // 2
        head_cx = (x0 + x1) // 2
        head_cy = y0 + subj_h // 8

    side = int(head_w * side_scale)
    side = min(side, img_w, img_h)               # never larger than the photo
    left = head_cx - side // 2
    top  = head_cy - int(side * eye_from_top)
    # Clamp fully inside the image so the circle is always 100% photo
    left = max(0, min(left, img_w - side))
    top  = max(0, min(top,  img_h - side))
    return (left, top, left + side, top + side)


def circle_mask(size: int) -> Image.Image:
    """Return an L-mode mask: opaque circle with smooth anti-aliased edge."""
    m = Image.new("L", (size * 4, size * 4), 0)  # 4× super-sampled for AA
    d = ImageDraw.Draw(m)
    d.ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    return m.resize((size, size), Image.LANCZOS)


def make_circular_from_photo(photo: Image.Image, box: tuple[int, int, int, int],
                             out_size: int) -> Image.Image:
    """Crop the ORIGINAL photo (background intact) to `box`, resize to a square,
    then apply a circular alpha mask. Returns RGBA."""
    crop = photo.crop(box).resize((out_size, out_size), Image.LANCZOS).convert("RGBA")
    crop.putalpha(circle_mask(out_size))
    return crop


def process_founders():
    print("\n▶ Founder portraits (background-intact circular crops)")
    saad_src, naz_src = find_founders()
    print(f"  saad src: {saad_src.name}")
    print(f"  naz  src: {naz_src.name}")

    for src, slug in (
        (saad_src, "saad-aqeel"),
        (naz_src,  "naz-islam"),
    ):
        print(f"\n  → {slug}")
        photo = Image.open(src).convert("RGB")
        # Use rembg purely to locate the head — pixels come from the original photo.
        rgba = remove_background(src)
        box = compute_head_box(rgba.getchannel("A"), photo.width, photo.height)
        print(f"     crop box {box}  (photo {photo.width}x{photo.height})")

        for size in (480, 240):
            portrait = make_circular_from_photo(photo, box, size)
            save_png(portrait, TEAM / f"{slug}-circle-light-{size}.png")
            save_webp(portrait, TEAM / f"{slug}-circle-light-{size}.webp", quality=90)

        # Remove now-stale artefacts from the old background-removed approach.
        for stale in (f"{slug}-cutout.png",
                      f"{slug}-circle-navy-480.png", f"{slug}-circle-navy-480.webp",
                      f"{slug}-circle-navy-240.png", f"{slug}-circle-navy-240.webp"):
            sp = TEAM / stale
            if sp.exists():
                sp.unlink()
                print(f"     removed stale {stale}")


# ----------------------------------------------------------------------
# Run
# ----------------------------------------------------------------------

def main():
    process_brand()
    process_properties()
    process_founders()
    print("\n✓ Image pipeline complete.")


if __name__ == "__main__":
    main()
