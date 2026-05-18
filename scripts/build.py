#!/usr/bin/env python3
"""Production build: minify CSS + JS in place.

CSS: strip comments and collapse whitespace.
JS : strip /* */ comments and trailing single-line comments, collapse runs of
    whitespace outside string literals.

Both minifiers are deliberately conservative — they preserve correctness over
maximum compression. The site target is a Netlify deploy with brotli, so the
heavy lifting is at the edge; this just trims obvious slack.

Run AFTER scripts/build_pages.py so generated HTML is also up-to-date.
"""
from __future__ import annotations
import re
from pathlib import Path

SITE = Path("/Users/aliamin/Productions/UnicoSuites/site")
CSS_DIR = SITE / "css"
JS_DIR  = SITE / "js"

# ---------- CSS minifier ----------
_CSS_COMMENT_RE = re.compile(r"/\*.*?\*/", re.DOTALL)
_CSS_SPACE_RE   = re.compile(r"\s+")
_CSS_AROUND_RE  = re.compile(r"\s*([{}:;,>+~])\s*")
_CSS_TRAILING_SEMI_RE = re.compile(r";}")

def minify_css(src: str) -> str:
    out = _CSS_COMMENT_RE.sub("", src)
    out = _CSS_SPACE_RE.sub(" ", out)
    out = _CSS_AROUND_RE.sub(r"\1", out)
    out = _CSS_TRAILING_SEMI_RE.sub("}", out)
    return out.strip()

# ---------- JS minifier (lightweight, string-safe) ----------
def minify_js(src: str) -> str:
    # Iterate char-by-char tracking string context to avoid mangling string literals.
    out = []
    i, n = 0, len(src)
    while i < n:
        c = src[i]
        # Line comment
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = j if j != -1 else n
            continue
        # Block comment
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            i = (j + 2) if j != -1 else n
            continue
        # String literal — copy verbatim
        if c in ('"', "'", "`"):
            quote = c
            out.append(c)
            i += 1
            while i < n:
                cc = src[i]
                out.append(cc)
                if cc == "\\" and i + 1 < n:
                    out.append(src[i + 1])
                    i += 2
                    continue
                i += 1
                if cc == quote: break
            continue
        # Regex literal heuristic: '/' after operator/keyword
        # — skipped (would over-complicate). Our codebase doesn't use bare regex on a line start.
        out.append(c)
        i += 1
    joined = "".join(out)
    # Collapse whitespace runs
    joined = re.sub(r"[ \t]+", " ", joined)
    joined = re.sub(r"\s*\n\s*", "\n", joined)
    joined = re.sub(r"\n+", "\n", joined)
    return joined.strip()

def main():
    saved_css = 0
    for p in CSS_DIR.glob("*.css"):
        if p.name.endswith(".min.css"): continue
        original = p.read_text()
        minified = minify_css(original)
        out = p.with_name(p.stem + ".min.css")
        out.write_text(minified)
        saved_css += len(original) - len(minified)
        print(f"  ✔ {out.relative_to(SITE)}  ({len(minified)//1024} KB · saved {(len(original)-len(minified))//1024} KB)")

    saved_js = 0
    for p in JS_DIR.glob("*.js"):
        if p.name.endswith(".min.js"): continue
        original = p.read_text()
        minified = minify_js(original)
        out = p.with_name(p.stem + ".min.js")
        out.write_text(minified)
        saved_js += len(original) - len(minified)
        print(f"  ✔ {out.relative_to(SITE)}  ({len(minified)//1024} KB · saved {(len(original)-len(minified))//1024} KB)")

    # Rewrite HTML references to use .min.css / .min.js
    for html in SITE.glob("*.html"):
        text = html.read_text()
        new = (text
               .replace('href="css/globals.css"',    'href="css/globals.min.css"')
               .replace('href="css/components.css"', 'href="css/components.min.css"')
               .replace('href="css/pages.css"',      'href="css/pages.min.css"')
               .replace('src="js/main.js"',          'src="js/main.min.js"')
               .replace('src="js/deal-analyser.js"', 'src="js/deal-analyser.min.js"')
               .replace('src="js/cookie-consent.js"','src="js/cookie-consent.min.js"')
               .replace('src="js/form-validation.js"','src="js/form-validation.min.js"')
               .replace('src="js/faq.js"',           'src="js/faq.min.js"'))
        if new != text:
            html.write_text(new)
            print(f"  ✔ {html.name} → references updated to .min.*")

    print(f"\nTotal saved: CSS {saved_css//1024} KB, JS {saved_js//1024} KB")

if __name__ == "__main__":
    main()
