---
name: Linwei Song — PC-98 Sixteen-Color Research Workstation
description: Locked 16-color NEC PC-98 inspired fixed-region portfolio system pairing self-hosted Fusion Pixel 12px display typography, Bayer-dithered Agent pixel plates, and 0px double-beveled evidence windows.
world: "digital-design-canon-pc98-sixteen-color-field"
colors:
  space-navy: "#090b28"
  ink-panel: "#101435"
  indigo-hover: "#1e2356"
  steel-chrome: "#2e4882"
  steel-chrome-hi: "#3f60a8"
  structural-line: "#344a84"
  vermilion-magenta: "#a33a5d"
  vermilion-magenta-hi: "#c44a72"
  dither-violet: "#4e2a76"
  dither-coral: "#e26a5e"
  dither-orange: "#ee944e"
  signal-amber: "#f0b34c"
  signal-yellow: "#f3d97d"
  signal-lime: "#9bc552"
  signal-cyan: "#5cc2c8"
  silver-muted: "#b3c0d8"
  warm-paper: "#f0e0ba"
  warm-paper-bright: "#f7ebd0"
  archival-paper: "#f5efe0"
  archival-paper-2: "#ebe3cf"
  archival-ink: "#111538"
  archival-crimson: "#8c2c4d"
typography:
  display:
    fontFamily: "\"Fusion Pixel 12px\", \"Saira Condensed\", sans-serif"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "0.01em"
  headline:
    fontFamily: "\"Fusion Pixel 12px\", \"Saira Condensed\", sans-serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.02em"
  title:
    fontFamily: "\"Fusion Pixel 12px\", \"Saira Condensed\", sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.02em"
  body:
    fontFamily: "\"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei UI\", \"Microsoft YaHei\", \"Segoe UI\", system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "\"Share Tech Mono\", \"Cascadia Code\", Consolas, \"SF Mono\", Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.vermilion-magenta}"
    textColor: "{colors.warm-paper-bright}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "10px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.vermilion-magenta-hi}"
    textColor: "{colors.warm-paper-bright}"
    rounded: "{rounded.none}"
  button-secondary:
    backgroundColor: "{colors.steel-chrome}"
    textColor: "{colors.warm-paper-bright}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "10px 22px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.steel-chrome-hi}"
    textColor: "{colors.warm-paper-bright}"
    rounded: "{rounded.none}"
  window-card:
    backgroundColor: "{colors.space-navy}"
    textColor: "{colors.warm-paper}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  window-bar:
    backgroundColor: "{colors.steel-chrome}"
    textColor: "{colors.warm-paper-bright}"
    typography: "{typography.title}"
    padding: "6px 12px"
    height: "34px"
  tag-cyan:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.space-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "3px 8px"
  nav-item-active:
    backgroundColor: "{colors.steel-chrome}"
    textColor: "{colors.warm-paper-bright}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "8px 9px"
    height: "46px"
---

# Design System: Linwei Song — PC-98 Sixteen-Color Research Workstation

## Overview

**Creative North Star: "The Midnight PC-98 Research Console"**

This system reimagines a researcher's technical homepage as a locked 16-color NEC PC-98 fixed-region workstation. Rather than floating translucent SaaS cards over blurred neon gradients or adopting an overly ornamental literary broadsheet, every surface sits inside crisp, sharp-cornered double-beveled panes rendered on deep midnight space navy. Evidence—published papers, internship engineering logs, benchmark tables, and open-source checkpoints—occupies structured window partitions with immediate tabular legibility from the first pixel.

The aesthetic balances nostalgic Japanese 16-color bitmap craft against modern engineering rigor. Ordered 4×4 Bayer dithering and stepped `steps(4, end)` transitions evoke hardware VRAM discipline, while self-hosted pixel CJK+Latin display typography (`Fusion Pixel 12px`) unifies Chinese and English headings without falling back to smooth system sans. Historical long-form technical articles preserve their archival warm-paper reading room so legacy diagrams remain faithful, framed cleanly by the shared dark-navy PC-98 navbar and footer.

**Key Characteristics:**
- Locked 16-color midnight PC-98 palette anchored by deep space navy, steel chrome titlebars, warm cream outlines, and magenta/cyan/lime/amber evidence accents.
- Strict 0px pixel-sharp corners paired with 2px warm-paper outer borders and 1px steel inner bevels (`inset` box-shadows), never blurred drop shadows or soft pill radii.
- Self-hosted subsetted `Fusion Pixel 12px` display face (SIL OFL 1.1) covering both CJK and Latin at native 400 weight, paired with system sans body copy and `Share Tech Mono` tabular metadata.
- 4×4 ordered Bayer-dithered raster plates carrying embedded provenance (`assets/plates/`) plus CSS 4×4 checkerboard dither fills on chrome titlebars and inner page heroes.
- Zero external font requests, zero ambient particle loops, and full progressive enhancement so every page remains readable without JavaScript.

## Colors

A disciplined 16-color midnight palette contrasts high-luminance warm paper ink against deep space navy grounds, reserving saturated chromatic hues strictly for primary actions, verification status badges, and metric signals.

### Primary
- **Vermilion Magenta** (`vermilion-magenta`): Primary call-to-action buttons (such as the ACL Anthology paper button and active blog tag filters), selection highlights, and high-priority links. Shifts to **Vermilion Magenta Highlight** (`vermilion-magenta-hi`) with a yellow border on hover.
- **Steel Chrome** (`steel-chrome`): Structural window titlebars, active left-rail navigation states, secondary buttons, and inner frame bevel lines. Shifts to **Steel Chrome Highlight** (`steel-chrome-hi`) with a cyan border on hover.

### Secondary
- **Signal Cyan** (`signal-cyan`): Keyboard focus outlines (`2px solid`), section index prefixes (`02 /`), `PROFILE.DAT` field keys, published EMNLP badges, Kaggle silver-zone metrics, and link chevrons.
- **Signal Lime** (`signal-lime`): Positive benchmark deltas (`86.5%`), RepoSocratic RL highlight table rows, Blue Bridge Cup national award badges, and the live status indicator dot in `PROFILE.DAT`.
- **Signal Amber** (`signal-amber`): Under-review NAACL badges, internship tags, Gemma 4 competition metrics, disclosure boundary box strokes, and 5×5px list bullet squares.

### Tertiary
- **Twilight Dither Spectrum** (`dither-violet`, `dither-coral`, `dither-orange`, `signal-yellow`): Used exclusively inside the Bayer-dithered Agent Core hero illustration, the 16-color spectrum strip, and hover highlight states (`signal-yellow`).

### Neutral
- **Space Navy** (`space-navy`): Primary page ground, window content interiors, and outer rail canvas.
- **Ink Panel** (`ink-panel`): Recessed sub-panels (`PROFILE.DAT`, experience dossiers, note rows, inner `.page-hero` headers, and footer surface).
- **Indigo Hover** (`indigo-hover`): Interactive row hover wash and table header fill.
- **Structural Line** (`structural-line`): Table cell gridlines, dashed ledger row dividers, and muted technical tag borders.
- **Warm Paper Bright** (`warm-paper-bright`) & **Warm Paper** (`warm-paper`): Primary headline ink, body text, and crisp 2px outer window borders (>12:1 contrast against Space Navy).
- **Silver Muted** (`silver-muted`): Secondary metadata, timestamps, benchmark sub-conditions, and footer captions.
- **Archival Reading Room** (`archival-paper`, `archival-paper-2`, `archival-ink`, `archival-crimson`): Scoped strictly to historical essay and archived case pages (`body.article-page`, `body.rts-page`, `body.ledger-page`) to maintain >7:1 contrast with pre-existing light-background SVG diagrams.

### Named Rules
**The Midnight Ground Rule.** Every new primary surface starts on `space-navy` (`#090b28`) with recessed containers on `ink-panel` (`#101435`); never substitute neutral charcoal grays or translucent frosted glass.

**The Chromatic Signal Rule.** Magenta is reserved for primary action buttons and active filters; cyan, lime, and amber act exclusively as crisp data/status signals—never as full-bleed decorative gradients behind body copy.

## Typography

**Display Font:** `Fusion Pixel 12px` (self-hosted SIL OFL 1.1 WOFF2 subset covering all site CJK + Latin characters), falling back to `Saira Condensed` and `sans-serif`.
**Body Font:** System CJK sans stack (`PingFang SC`, `Hiragino Sans GB`, `Microsoft YaHei UI`, `Microsoft YaHei`, `Segoe UI`, `system-ui`, `sans-serif`).
**Label/Mono Font:** `Share Tech Mono` (self-hosted WOFF2), falling back to `Cascadia Code`, `Consolas`, `SF Mono`, `Menlo`, `monospace`.

**Character:** Crisp 12px-grid pixel display typography anchors the PC-98 workstation voice across both Chinese and English headings without synthetic weight distortion, while clean system sans keeps dense multi-bullet engineering dossiers effortless to scan and `Share Tech Mono` enforces tabular precision on dates, rankings, and evaluation scores.

### Hierarchy
- **Display** (`400`, `clamp(26px, 3.25vw, 48px)`, `1.18`): Homepage hero headline (`#hero-title`) and inner page H1 titles (`clamp(28px, 3.8vw, 48px)`).
- **Headline** (`400`, `clamp(24px, 2.7vw, 36px)`, `1.2`): Major numbered section headings (`02 / 论文研究`–`05 / 技术笔记`) and left-rail brand lockup (`clamp(24px, 2vw, 28px)`).
- **Title** (`400`, `1rem–1.28rem`, `1.15–1.4`): Window bar titles, paper titles, experience organization names, rail nav items (`clamp(17px, 1.38vw, 19.5px)`), and primary/secondary CTAs.
- **Body** (`400`, `0.94rem–1rem`, `1.72–1.75`): Dossier copy, technical summaries, and archive descriptions (constrained to `72ch` max measure on page leads and `760px` on historical essays).
- **Label** (`400`, `0.75rem–0.86rem`, `1.1–1.4`, `0.04em–0.08em`): Monospace dates, tags, `PROFILE.DAT` keys, evaluation conditions, and navigation indices (`tabular-nums` on all numeric metrics and tables). Minimum UI text floor is `0.75rem` (`12px`).

### Named Rules
**The Native Pixel Weight Rule.** Never apply `font-weight: 700` to `Fusion Pixel 12px`; render all pixel display headings at native `400` weight so browsers do not smear pixel edges with synthetic faux-bold.

**The Bilingual Unity Rule.** Every heading mixing Chinese and English uses the self-hosted `Fusion Pixel 12px` subset rather than letting CJK fall back to smooth platform sans, and omits extra ASCII spaces around full-width middle dots (`·`) in display headlines.

## Layout

Desktop (`> 960px`) opens with a locked full-viewport `.pc98-stage` grid (`min-height: clamp(660px, 55.8vw, 820px)`, `gap: 8px`, `padding: 4px 4px 6px 4px`):
- **Column 1 (`clamp(186px, 14vw, 206px)`)**: Full-height fixed left navigation rail spanning rows 1–2, holding the 56px pixel emblem + brand lockup, 6 numbered navigation links (`min-height: 46px`), and the docked bottom `PROFILE.DAT` coordinates partition.
- **Column 2, Row 1 (`minmax(410px, 1.62fr)`)**: Full-bleed twilight hero canvas (zero outer border) where the Bayer-dithered Agent Core illustration anchors the right edge and the spectrum strip, H1, two-line summary, and dual CTAs occupy the left foreground.
- **Column 2, Row 2 (`minmax(244px, 1fr)`)**: Three docked evidence windows split `1.65fr / 1.25fr / 0.72fr` (`RESEARCH & INDUSTRY`, `COMPETITIONS & EVAL`, `LINKS.LOG`).

Below the fold (`index.html`) and on inner pages (`projects.html`, `blog.html`, `about.html`, `projects/reposocratic.html`), content aligns to a centered `min(1240px, calc(100% - 40px))` shell with `clamp(44px, 5.5vw, 76px)` vertical section rhythm. On desktop `index.html`, scrolling past `.pc98-stage` reveals the fixed `60px` top `.navbar` synced via `IntersectionObserver` so below-the-fold sections never lose navigation.

**Responsive breakpoints:**
- `<= 1120px`: Dock row shifts to 2 columns with `LINKS.LOG` spanning full width horizontally; 6-node process flows fold to 3 columns.
- `<= 960px`: Left rail hides, fixed `60px` top navbar takes over, and the hero canvas converts to an unwashed `2.15 / 1` top pixel plate band above solid Space Navy copy (`display: none` scrim) so the illustration stays clear on phones. Multi-column grids collapse to 1 column.
- `<= 768px`: Mobile slide-over drawer (`min(290px, 84vw)`) with Escape/overlay dismissal, `inert` management, and focus restoration.
- `<= 480px` / `<= 420px`: Compact table padding keeps 3-column evaluation tables 100% unclipped down to `320px`; 4-column tables scroll horizontally with an explicit `.pc98-scroll-hint` cue.

## Elevation & Depth

This system uses **zero drop shadows and zero backdrop blur**. Depth is constructed purely through stepped pixel-bevel borders, tonal ground shifts (`space-navy` → `ink-panel` → `indigo-hover`), and 4×4 pixel ordered dither fills.

### Shadow Vocabulary
- **Double-Bevel Window Frame** (`box-shadow: inset 0 0 0 2px #090b28, inset 0 0 0 3px #2e4882`): Applied inside `2px solid #f0e0ba` borders on `.pc98-window` and `.pc98-rail` to create a crisp 5px hardware-window bezel.
- **Primary Button Inner Highlight** (`box-shadow: inset 0 0 0 2px #090b28, inset 0 0 0 3px #c68fa2`): Frames `.pc98-cta.is-primary` with a stepped retro-bevel highlight.
- **Secondary Button Inner Highlight** (`box-shadow: inset 0 0 0 2px #090b28, inset 0 0 0 3px #7a94c8`): Frames `.pc98-cta.is-secondary` with a cool steel highlight.
- **Active Nav Inset** (`box-shadow: inset 0 0 0 1px #090b28`): Separates the warm-paper border from the steel-dither fill on active left-rail items.
- **Pixel Text Relief** (`text-shadow: 3px 3px 0 #090b28, -1px -1px 0 #090b28`): Anchors hero display headlines over pixel artwork without soft blur halos.

### Named Rules
**The Zero-Blur Rule.** Never apply blurred `box-shadow`, `backdrop-filter`, or soft outer glows to PC-98 surfaces; every depth cue must resolve to crisp integer pixel offsets or 2×2 / 4×4 ordered dither patterns.

**The Stepped Motion Rule.** Interactive hover and focus transitions run on `140ms steps(4, end)` rather than smooth elastic curves, collapsing to `0.01ms` under `prefers-reduced-motion: reduce`.

## Shapes

Every PC-98 container, button, tag, nav item, table, and archive row enforces **strict `0px` square corners**. No rounded pills or `3px–8px` modern card radii appear on PC-98 chrome. Structural icons (`▶` carets, `─ □ ×` window controls) render as `shape-rendering="crispEdges"` inline SVGs on integer 8×8 or 38×10 grids; list markers render as crisp 5×5px solid amber squares.

## Components

### Buttons
Tactile, double-beveled hardware console keys with crisp pixel carets and stepped color-swap hover states.
- **Shape:** Sharp square corners (`0px`).
- **Primary (`.pc98-cta.is-primary`)**: Vermilion Magenta fill, Warm Paper Bright text, `2px solid #f0e0ba` outer border, inner rose bevel highlight, `min-height: 48px`, `padding: 10px 22px`.
- **Hover / Focus:** Shifts to Vermilion Magenta Highlight with Signal Yellow border on hover; `2px solid #5cc2c8` (`outline-offset: 2px`) on `:focus-visible`.
- **Secondary (`.pc98-cta.is-secondary` & `.pc98-link-btn`)**: Steel Chrome fill (hero) or Ink Panel fill (`min-height: 38px`, `padding: 6px 14px`) for inline card actions; highlights to Steel Chrome Highlight with Signal Cyan border on hover.

### Chips & Status Tags
High-contrast rectangular verification badges marking venues, rankings, and technical stacks.
- **Style:** `0px` corners, `Share Tech Mono` `0.76rem` bold (`padding: 3px 8px`), dark Space Navy text on Cyan (`EMNLP 2026`), Lime (`86.5%`, `全国第 5 名`), or Amber (`NAACL 在审`, `INTERN`, `Top 23%`) fills; tech stack chips sit on Space Navy with `1px solid #344a84` borders and Silver Muted text.
- **State:** Blog filter buttons (`.filter-btn`) default to Ink Panel with Steel border and switch to Vermilion Magenta with Warm Paper border when `.active` (`aria-pressed="true"`).

### Windows & Cards
Modular PC-98 application windows dividing dossiers, papers, internships, and competition evidence.
- **Corner Style:** `0px`.
- **Background:** `space-navy` body with `steel-chrome` header bar (`min-height: 34px`, overlaid with a 4×4px `repeating-conic-gradient` dither fill and `2px solid #f0e0ba` bottom divider).
- **Border & Shadow Strategy:** `2px solid #f0e0ba` outer border + Double-Bevel Window Frame inset shadow.
- **Internal Padding:** `12px 14px` in docked hero windows; `18px 20px` in below-the-fold experience and flagship grids (`14px` on `<= 420px`).

### Navigation
Dual-surface navigation honoring both the desktop PC-98 workstation frame and mobile/scrolled ergonomics.
- **Desktop First Viewport:** Fixed left `.pc98-rail` (`14vw` clamped `186–206px`) with 56px pixel emblem, `Fusion Pixel 12px` wordmark, and 6 numbered rows (`01`–`06`) where active items receive a dithered Steel Chrome fill, Warm Paper border, and crisp SVG yellow caret.
- **Desktop Scrolled & Inner Pages:** Fixed `60px` top `.navbar` with `2px solid #f0e0ba` bottom border + `2px` Steel shadow; synced to scroll position via `IntersectionObserver` on `index.html`.
- **Mobile (`<= 768px`):** `44×44px` square hamburger toggle opening a right-docked `min(290px, 84vw)` drawer with `inert` background handling, `Escape` dismissal, and focus restoration.

### Signature Component: PC-98 Docked Metric Ledger & `PROFILE.DAT`
Replaces decorative gauges and filler imagery with scannable tabular evidence.
- **`PROFILE.DAT`**: Docked directly into the bottom compartment of `.pc98-rail` via a single `2px solid #f0e0ba` top divider (no nested double frame), holding cyan monospace keys (`FOCUS`, `EDU`, `HONORS`, `BASE`), live `UTC+8` Fuzhou time, and direct GitHub/Email links.
- **`COMPETITIONS & EVAL`**: Flat hairline-dashed rows (`1px dashed #344a84`, zero nested card borders) pairing clickable benchmark titles/conditions on the left with right-aligned tabular `Fusion Pixel 12px` cyan/lime/amber scores (`0.703`, `86.5%`, `Top 23%`).

## Do's and Don'ts

### Do:
- **Do** frame primary sections and dossiers inside sharp `0px` double-beveled PC-98 windows with dithered steel titlebars and at most one `<h3>` per `<article>`.
- **Do** keep all display typography in self-hosted `Fusion Pixel 12px` at native `font-weight: 400`, and keep all UI text at or above `0.75rem` (`12px`).
- **Do** stage raster pixel plates cleanly on mobile as an unwashed top band (`aspect-ratio: 2.15 / 1`) above solid `#090b28` copy instead of burying them under heavy dark overlays.
- **Do** use `shape-rendering="crispEdges"` inline SVGs for carets and window controls, and CSS 5×5px squares for bullet markers.
- **Do** keep 3-column data tables natively readable at `320px` and attach explicit scroll cues when wider 4-column tables require horizontal scrolling.

### Don't:
- **Don't** introduce smooth `border-radius` (`3px–16px`), blurred drop shadows, frosted glass (`backdrop-filter`), or decorative gradient text on PC-98 surfaces.
- **Don't** nest bordered sub-cards inside already bordered PC-98 windows or the left rail—use hairline dashed dividers or flush compartments instead.
- **Don't** fall back to smooth OS system fonts (`Microsoft YaHei` / `PingFang SC`) for PC-98 display headlines, or load external Google Fonts/CDNs at runtime.
- **Don't** use raw Unicode symbols (`▶`, `▪`, `─ □ ×`) as structural UI icons or add job-seeking banners, resume downloads, or unverified hardware noise to public pages.
- **Don't** alter the archival warm-paper reading theme (`#f5efe0`) on historical `blog/*.html` essays where legacy light-ground SVG diagrams live.
