# Garden display font

`garden-serif.woff2` is a self-hosted character subset of **Noto Serif SC**, distributed under the included `OFL-NotoSerifSC.txt` (SIL OFL 1.1). The font retains its variable weight axis, original naming and copyright metadata. It is used for display headings; body copy uses the visitor's system sans-serif font.

- Upstream: https://github.com/google/fonts/tree/main/ofl/notoserifsc
- Source file: `NotoSerifSC[wght].ttf`, Git blob `eab063faf229160a52d3760f5555150e4eb9e5bf`.
- Upstream source project: https://github.com/notofonts/noto-cjk
- Subset on 2026-09-06: 721 input characters, 762 glyphs, 230,124 bytes (224.73 KiB).
- Scope: headings and display labels in the explicitly listed public HTML routes and article template; Latin ASCII and navigation symbols are included. Missing glyphs fall back to the system serif font.
- No browser requests to Google Fonts or a third-party font CDN. `font-display: swap` preserves immediate readability if the font fails to load.

After adding display text, download the same upstream font to a local non-public directory and run:

```text
python tools/subset-display-font.py "tmp/video-redesign/fonts/NotoSerifSC[wght].ttf"
node tools/stamp-assets.mjs
node tools/build-site.mjs
```

The optional authoring script uses the installed `fonttools` and Brotli packages; normal site validation/build/deployment requires only Node.js and the committed WOFF2. The full 25 MB source font is not committed or published. Only the subset and its license are in the public manifest.
