"""Rebuild the self-hosted display font. Optional authoring dependency: fonttools[woff].
Usage: python tools/subset-display-font.py /path/to/NotoSerifSC[wght].ttf
The source font is intentionally kept outside the public build.
"""
from pathlib import Path
from html.parser import HTMLParser
import re
import sys
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
class DisplayText(HTMLParser):
    def __init__(self):
        super().__init__(); self.depth = 0; self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag in ('br','img','meta','link','input','hr','source','wbr'): return
        values = dict(attrs)
        classes = values.get('class','')
        display = tag in ('h1','h2','h3','h4','h5','h6','text') or any(x in classes for x in ('brand-','vertical-note','identity-name','page-hero-side','folio-margin','note-glyph','garden-about-mark','poster-bottom'))
        self.depth = self.depth+1 if self.depth else int(display)
    def handle_endtag(self, tag):
        if self.depth: self.depth -= 1
    def handle_data(self, data):
        if self.depth: self.parts.append(data)

def collect():
    # The manifest is the shared public boundary. The authoring template is included for future posts.
    manifest = (ROOT/'tools/site-manifest.mjs').read_text(encoding='utf-8')
    routes = re.findall(r"'([^']+\.html)'", manifest.split('export const publicFiles')[0])
    chars = set(chr(i) for i in range(32,127))
    for route in routes + ['blog/template.html']:
        parser = DisplayText(); parser.feed((ROOT/route).read_text(encoding='utf-8'))
        chars.update(''.join(parser.parts))
    chars.update('蔚宋林窗间上下左右前后第页篇作品花园手记继续慢生长暂停空间平面，。！？：；（）「」《》、—·→←↗↓')
    return ''.join(sorted(chars))

if __name__ == '__main__':
    source = Path(sys.argv[1]).resolve()
    font = TTFont(source)
    text = collect()
    options = subset.Options(); options.flavor = 'woff2'; options.desubroutinize = True
    sub = subset.Subsetter(options=options); sub.populate(text=text); sub.subset(font)
    # Keep variable weights so 500/600/650/700 remain real weights rather than synthesized bold.
    font.flavor = 'woff2'
    output = ROOT/'assets/fonts/garden-serif.woff2'; output.parent.mkdir(exist_ok=True)
    font.save(output)
    print(f'{len(text)} display characters; {len(font.getGlyphOrder())} glyphs; {output.stat().st_size} bytes')
