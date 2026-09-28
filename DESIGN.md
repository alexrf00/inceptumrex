---
name: InceptumRex
description: The portfolio of Alex M. Rodriguez, every project wheat-pasted as a release poster on one sidewalk-shed wall, then set straight on printed paper below it.
colors:
  wall: "#355e3b"
  wall-deep: "#2b4d31"
  pink: "#ff2d87"
  yellow: "#ffe414"
  orange: "#ff6a1f"
  alarm: "#a0001e"
  black: "#121212"
  paper: "#f4f4ef"
  paper-back: "#d9d9d1"
  wall-ink: "#eef1e8"
  sheet: "#efefe9"
  sheet-ink: "#161614"
  sheet-body: "#2b2b27"
  sheet-dim: "#4a4a44"
  rule: "#161614"
  plate-well: "#d6d6ce"
typography:
  bill-headliner:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "29.8cqw"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.005em"
  bill-title:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "24cqw"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  bill-act:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "8cqw"
    fontWeight: 800
    lineHeight: 1.02
  bill-strip:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "max(4.6cqw, 12px)"
    fontWeight: 800
    lineHeight: "max(11cqw, 28px)"
    letterSpacing: "0.05em"
  bill-print:
    fontFamily: "Archivo Narrow, sans-serif"
    fontSize: "max(4.6cqw, 13px)"
    fontWeight: 600
    lineHeight: 1.28
  sheet-title:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "clamp(3rem, 8.5vw, 6.5rem)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.005em"
  entry-name:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "min(clamp(2.7rem, 5.2vw, 4.4rem), calc(185cqi / var(--len, 8)))"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.005em"
  section-head:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.02em"
  standfirst:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "Archivo Narrow, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.12em"
  link-label:
    fontFamily: "Archivo Narrow, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
  nav:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.14em"
  chip:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.07em"
  button:
    fontFamily: "Big Shoulders Display, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.09em"
  mark:
    fontFamily: "Big Shoulders Stencil Display, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.16em"
  stencil:
    fontFamily: "Big Shoulders Stencil Display, sans-serif"
    fontSize: "clamp(1.8rem, 3.6vw, 3.2rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.14em"
rounded:
  none: "0px"
spacing:
  strip-h: "3.5rem"
  bill-margin: "6cqw"
  wall-gutter: "clamp(0.75rem, 1.6vw, 1.5rem)"
  paper-gutter: "clamp(0.75rem, 3vw, 3rem)"
  sheet-pad: "clamp(1.5rem, 4.5vw, 4.5rem)"
  sheet-gap: "clamp(3.5rem, 7vw, 7rem)"
  entry-block: "clamp(2.25rem, 4.5vw, 3.75rem)"
  entry-column-gap: "clamp(1.75rem, 4vw, 3.5rem)"
  thumb-gap: "0.75rem"
components:
  strip-nav:
    backgroundColor: "{colors.black}"
    textColor: "{colors.yellow}"
    typography: "{typography.nav}"
    height: "{spacing.strip-h}"
    padding: "0 clamp(1rem, 3vw, 2.5rem)"
  strip-nav-hover:
    textColor: "{colors.paper}"
  bill-headliner:
    backgroundColor: "{colors.black}"
    textColor: "{colors.yellow}"
    typography: "{typography.bill-headliner}"
    rounded: "{rounded.none}"
  bill-image-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
    typography: "{typography.bill-title}"
    rounded: "{rounded.none}"
  bill-lineup:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    typography: "{typography.bill-act}"
    rounded: "{rounded.none}"
  bill-strip:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.black}"
    typography: "{typography.bill-strip}"
    height: "max(11cqw, 28px)"
    padding: "0 0 0 6cqw"
  chip-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    typography: "{typography.chip}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.55rem 0.35rem"
  chip-pink:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.black}"
    typography: "{typography.chip}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.55rem 0.35rem"
  chip-orange:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.black}"
    typography: "{typography.chip}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.55rem 0.35rem"
  chip-paper:
    backgroundColor: "transparent"
    textColor: "{colors.black}"
    typography: "{typography.chip}"
    rounded: "{rounded.none}"
    padding: "0.4rem 0.55rem 0.35rem"
  paper-sheet:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.sheet-ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.sheet-pad}"
    width: "min(100%, 78rem)"
  link-print:
    textColor: "{colors.sheet-ink}"
    typography: "{typography.link-label}"
    padding: "0.35rem 0"
  button-primary:
    backgroundColor: "{colors.black}"
    textColor: "{colors.yellow}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "1rem 1.5rem"
  button-primary-hover:
    backgroundColor: "#2c2c29"
  button-quiet:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.black}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "1rem 1.5rem"
  button-quiet-hover:
    backgroundColor: "color-mix(in srgb, {colors.yellow} 92%, {colors.black})"
  input-line:
    backgroundColor: "transparent"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0.55rem 0.1rem"
  tear-tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
    height: "11.5rem"
  tear-tab-hover:
    backgroundColor: "color-mix(in srgb, {colors.paper} 78%, {colors.yellow})"
  repaste-tag:
    backgroundColor: "{colors.black}"
    textColor: "{colors.yellow}"
    typography: "{typography.nav}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.1rem 0.75rem"
    height: "2.75rem"
  repaste-tag-hover:
    backgroundColor: "color-mix(in srgb, {colors.black} 86%, {colors.paper})"
---

# Design System: InceptumRex

## Overview

**Creative North Star: "The Wheat-Paste Wall"**

Every project is a street poster announcing its release, wheat-pasted on one sidewalk-shed wall, newest on top; below the wall the same work is set straight on printed paper. The page has exactly two registers and never mixes them. The wall shouts: condensed wood type in black, paper white and three fluorescent inks, torn edges, paste crinkle and gloss, and, where WebGL runs, real lit paper whose corner lifts under the cursor and that a visitor can grab and tear off the wall to uncover the bill pasted beneath. The paper reads: newsprint sheets with black rules, straight columns and printed status chips, holding everything the wall shouted in a calm order, then the résumé and the contact flyer. Papers have a screen of their own built the same way: a wall where every paper is pasted up, then one printed sheet per kind.

Everything on the page is a physical material under one raking light from the top left. There is one ground: hunter-green painted plywood, built from a real CC0 photograph with seams, screw rows, paint runs and buffed-out graffiti. Bills and sheets are paper pasted onto it, never panels floating over it. The work itself, screenshots and in-game renders, prints unretouched; only the paper it is printed on wears. The interface recedes into the world: navigation is a black sniping strip, the contact form is a flyer with tear-off tabs, the footer is a stencil painted on the wall.

The first viewport holds every project at once: the headliner bill carries the name and a live-now strip, four image bills carry the lead projects with their honest status, a lineup bill ranks every other project by type size, and a flyer points to contact. On desktop the whole collage is fitted to the viewport; on phones the wall grows taller than the screen and the first screen holds the name and the complete lineup. The build folded the separate BattlePassTimer bill the direction planned into the lineup, where BattlePassTimer is the lead act.

**Key Characteristics:**
- One painted-plywood ground for the whole page; paper is pasted on it, never a second theme.
- Two registers: a loud paste-up wall and a calm printed program, each with its own type scale.
- Condensed wood type sized to fill its bill; lineup acts ranked by size like a concert bill.
- Black, paper white and three fluorescent inks; every status is written in words.
- Torn masks, paste crinkle, newsprint fibre and green-black shadows from one top-left light.
- A WebGL paper twin for every bill that only paints; the HTML bill stays the link, the focus target and the text, and follows whichever bill is showing.
- Stacks of real bills: peel one off and the next is underneath.
- Real screenshots and renders, unretouched, each carrying its provenance.

## Colors

Hunter-green paint as the only ground, two printing inks (Poster Black and Bill Paper), three fluorescent inks, and a quiet newsprint family for the printed program.

### Primary
- **Sidewalk-Shed Green** (#355e3b): the painted plywood, New York sidewalk-shed green, and the ground of the entire page. The body stacks, top to bottom: a white radial highlight (8%, 110vw by 70vh at 8% / -5%, gone by 62%) for the raking light, the wear layer (`/wall/wear.webp`, 1700 by 1150 css px tiles offset 310 / 170), the plywood (`/wall/plywood.webp`, 1200 by 800 css px tiles) and this paint as the fallback. The two tile periods realign only every 20,400 by 18,400 px, so the wall never visibly repeats. The texture's measured mean is #36603c.
- **Shed Shadow Green** (#2b4d31): the plate under the wall: the `html` background (seen on overscroll) and the scrollbar track.

### Secondary
- **Fluorescent Pink** (#ff2d87): as a field, the headliner's live-now strip, the LuzRD bill, a remnant and the pink chip. On paper it appears only as the 0.2rem rule under program links, the underline of résumé links, the text caret and the focus ring around form fields. It is also the text-selection colour, with Poster Black type.
- **Fluorescent Yellow** (#ffe414): as a field, the lineup bill, Big Party's status strip, the yellow chip, the skip link and the quiet button. As type it appears only on Poster Black: the navigation, the headliner's first line, the send button and the black status strips. It is also the focus ring on the wall, the scrollbar thumb and the underline of footer links.
- **Fluorescent Orange** (#ff6a1f): Fiscalia's status strip and the orange chip. Always a field carrying black type.

### Tertiary
- **Alarm Red** (#a0001e): form errors only, the border of a field that fails validation after interaction (`:user-invalid`) and the error line under the form. Nothing else.

### Neutral
- **Poster Black** (#121212): the black bills (headliner, Big Party, Fixion, a remnant), black status strips, the sniping strip, the send button, the keyline around framed prints on bills, and all type set on fluorescent ink or bill paper. Also the browser theme colour.
- **Bill Paper** (#f4f4ef): paper-white bills (Fiscalia, the flyer bill, a remnant), Fixion's status strip, the contact flyer and its tear-off tabs, the studio mark, and light type on black bills.
- **Paper Back** (#d9d9d1): the back of a bill, seen only when a corner curls in WebGL, with 14% of the mirrored print showing through.
- **Stencil White** (#eef1e8): all readable text on bare wall (the footer's credit line and links) and the body's default text colour. There is no dimmer wall ink: a faded grey measured 4.36:1 on the lightest plywood grain and was retired.
- **Newsprint** (#efefe9): the program and résumé sheets, under a fibre-noise texture.
- **Press Black** (#161614): headings, standfirsts, fact values and link text on newsprint.
- **Long-Copy Ink** (#2b2b27): paragraphs on newsprint (entry bodies, the résumé bio, minor-project lines). Written as a literal in the CSS, not yet a custom property.
- **Press Grey** (#4a4a44): secondary print: the lede, captions, fact labels, status notes, dates and the optional-field marker.
- **Printed Rule** (#161614): every rule on the newsprint sheets: 0.35rem under a sheet's head and above the minor list, 2px over the facts and under résumé heads, 1px between entries, and the 1px keyline around every printed image. Same ink as Press Black, kept as its own token.
- **Plate Well** (#d6d6ce): the well behind each printed image and the portrait while they load.

### Measured contrast
Text (WCAG 2.2 AA asks 4.5:1, or 3:1 for the large display type):
- Poster Black on Bill Paper, and Bill Paper on Poster Black: 16.98:1. Yellow on Poster Black, and Poster Black on Yellow: 14.59:1. Poster Black on Orange: 6.54:1. Poster Black on Pink: 5.33:1.
- Press Black on Newsprint 15.70:1. Long-Copy Ink on Newsprint 12.31:1. Press Grey on Newsprint 7.73:1. Alarm Red on Bill Paper 7.57:1.
- Stencil White on the wall: 6.53:1 against the paint, still 5.22:1 on the lightest 0.1% of the plywood grain.

Non-text (3:1): the yellow ring on the wall 5.81:1, the black ring on newsprint 16.23:1, the pink ring on Bill Paper 3.18:1.

### Named Rules
**The One Ground Rule.** The painted plywood is the only page ground. Paper (bills, sheets, the flyer) is pasted onto it; nothing introduces a second background, a theme toggle or a panel colour.

**The Ink-On-Black Rule.** A fluorescent ink is either a flat field carrying Poster Black type, or type set on Poster Black. Pink, yellow and orange are never type on paper, newsprint or the wall; there they appear only as a link rule, a caret or a focus ring.

**The Words-Carry-Status Rule.** Every project's status is written out (Live, Live site, In development, Prototype, Offline). A fluorescent field marks work that is live or shipping; the outlined paper chip marks work that is not running. Which fluorescent ink a project wears is a paste-up colour choice (Fiscalia's chip is pink while its wall strip is orange), never a status code.

## Typography

**Display Font:** Big Shoulders Display (800 and 900 in use), with next/font's metric-matched fallback
**Stencil Font:** Big Shoulders Stencil Display (800)
**Label/Print Font:** Archivo Narrow (600 and 700 in use)
**Body Font:** Archivo (400, 500 and 600 in use), with system-ui as fallback

**Character:** Big Shoulders is condensed wood type in the Chicago poster tradition: tall, tight capitals that fill a bill edge to edge and read from across a street, and its stencil cut is the paint on the wall. Archivo Narrow is a poster's small print and a program's tracked labels; Archivo is the plain grotesque the reading happens in.

### Hierarchy
On the bills every size is `cqw`, a percentage of the bill's own width, with a CSS `max()` floor wherever small print must stay legible:
- **Headliner** (900, one size per line, 0.86, -0.005em, caps): the name, ALEX M. at 29.8cqw in yellow and RODRIGUEZ at 22.3cqw in Bill Paper. It is the page's `h1`.
- **Bill title** (900, 22 to 25cqw, 0.92, -0.005em, caps): an image bill's project name (Fiscalia 22, Fixion 24, LuzRD 25); 17cqw on a compact bill.
- **Lineup heading** (900, 9cqw, 1, caps): "Also on the bill".
- **Lineup act** (800, 8 down to 4.8cqw, 1.02, caps): one project per line, ranked by the Billing Rule.
- **Status strip** (800, max(4.6cqw, 12px), 0.05em, caps, line-height equal to the strip's height): the status across a bill's foot; max(5cqw, 11px) on a compact bill.
- **Bill print** (Archivo Narrow 600): the headliner's blurb at max(4.6cqw, 13px)/1.28, an image bill's one-line sub at max(4.6cqw, 12px)/1.2.
- **Flyer bill** (900, 16cqw, 0.9, caps, two lines) with tab text in Archivo Narrow 600 at min(7cqw, 4cqh), running vertically.
- **Remnant** name (900, min(88 / (0.52 x letters), 30)cqw, 0.9, caps) and line (Archivo Narrow 600, 8cqw/1.2).

On paper, sizes are `rem` and fluid clamps:
- **Sheet title** (900, clamp(3rem, 8.5vw, 6.5rem), 0.88, -0.005em, caps, balanced wrap): "The work, in print" and the résumé's name. The contact flyer's title runs larger, clamp(3.4rem, 10vw, 6.4rem)/0.86.
- **Entry name** (900, min(clamp(2.7rem, 5.2vw, 4.4rem), 185cqi / letters), 0.9, caps): the text column is a size container and the name's letter count caps its size, so a long single word (BattlePassTimer) shrinks to its column instead of breaking.
- **Minor title** (900, clamp(2.2rem, 4.5vw, 3.4rem)/0.9) and **minor name** (800, 1.85rem/1).
- **Section head** (800, 1.55rem/1, 0.02em, caps, 2px rule under): the résumé's sections.
- **Standfirst** (Archivo 600, 1.25rem/1.4): an entry's one line (max 42ch) and the résumé's role; the flyer's line uses Archivo Narrow 600 at the same size.
- **Lede** (Archivo 500, 1.15rem/1.55, max 60ch, Press Grey): under a sheet title.
- **Body** (Archivo 400, 1.0625rem/1.65, max 64ch, Long-Copy Ink; the bio caps at 62ch, minor lines run 1rem/1.6 at 54ch).
- **Caption** (Archivo 500, 0.9rem/1.45, Press Grey): image captions; status notes use 0.9rem/1.35.
- **Fact label** (Archivo Narrow 700, 0.78rem/1.3, 0.12em, caps, Press Grey): Status, Kind, Role, Built with. Form labels use 0.85rem/1.2 at 0.1em in black.
- **Link label** (Archivo Narrow 700, 0.98rem/1, 0.06em, caps): program links.
- **Dates** (Archivo Narrow 600, 0.95rem/1.5, tabular figures, Press Grey): the résumé's when-column.

Chrome and paint:
- **Navigation** (800, 1.05rem/1, 0.14em, caps; 0.95rem at 0.1em under 560px) and the **studio mark** (Stencil 800, 1.4rem/1, 0.16em, caps; 1.15rem at 0.1em under 560px).
- **Chip** (800, 0.88rem/1, 0.07em, caps) and **button** (800, 1.12rem/1, 0.09em, caps).
- **Wall stencil** (Stencil 800, clamp(1.8rem, 3.6vw, 3.2rem)/1, 0.14em, caps, Stencil White at 20%): POST NO BILLS, decorative. The **footer mark** (Stencil 800, clamp(3.2rem, 11vw, 8.5rem)/0.9, 0.12em, at 16%) is a logotype; no other text is set that faint.

### Named Rules
**The Wood-Type Rule.** A headliner line is set as large as its bill allows: each line gets its own size so it fills the bill's width (ALEX M. 29.8cqw, RODRIGUEZ 22.3cqw), set tight at 0.86 with -0.005em tracking in 900 capitals. Remnant and under-bill names are fitted to 88cqw of width by formula. Never one size for every line.

**The Billing Rule.** On the lineup bill type size is billing: the acts step down 8, 6.6, 6.6, 5.8, 5.8, 5.2, 5.2, 4.8 and 4.8cqw in listed order, the way a concert bill ranks its acts.

**The Two Registers Rule.** Big Shoulders shouts on the wall and heads the paper; reading copy is Archivo at 1.0625rem/1.65 within 64ch; Archivo Narrow is only a bill's small print and paper's tracked labels. A new text role picks its register first.

## Layout

The page is one column in four parts: the sticky sniping strip (3.5rem), the wall (at least the viewport height below the strip), the paper (the program sheet, the résumé sheet and the contact flyer, clamp(3.5rem, 7vw, 7rem) apart) and the foot. The papers screen (`/papers`) has the same four parts: the strip, the papers wall, the paper (one sheet per kind of paper) and the foot. Each paper has a page of its own at `/papers/<slug>`, with the same strip and foot around one sheet. Every anchor target clears the strip (`scroll-margin-top`: the strip plus 1rem).

### The wall and its three stages
The wall holds a fixed-aspect stage. Each bill is placed on it by custom properties: x and width as a percentage of the stage's width, y as a percentage of its height, plus aspect ratio, rotation and stacking level, set per stage in the `[data-poster]` rules of `globals.css`. The wall is padded clamp(0.9rem, 2vw, 1.5rem) on top, clamp(0.75rem, 1.6vw, 1.5rem) at the sides and 3rem below, with the POST NO BILLS stencil bottom right.
- **Desktop collage** (900px and wider, wider than tall, at least 560px tall): aspect 1.62 at min(1520px, 100%, (100svh - strip - 4.25rem) x 1.62), so the whole collage fits the first viewport. Headliner top left, Big Party top centre, Fiscalia top right; the lineup bottom left with the flyer beside it, LuzRD bottom centre, Fixion bottom right; remnants of ASEPRE, Brolick Gym and BxGoatDrip in the gaps.
- **Portrait tablet and narrow window** (700px and wider when taller than wide, 700 to 899px wide, or 700px and wider but under 560px tall): a square stage at max(min(100%, 1000px, 100svh - strip - 4rem), min(100%, 640px)). The name and the lineup run across the top with the flyer over the lineup's bare side; the four image bills stagger below.
- **Phone** (under 700px): full width at aspect 0.32, taller than the screen. The name, then the full lineup directly under it, so the first screen names every project; then the four image bills staggered, Fixion pasted over the bare end of Big Party's strip. The flyer bill and the Brolick Gym remnant are not pasted here.

### The paste-up
Bills tilt between -1.9° and +2.6° (remnants up to 3°) and stack by recency. On desktop Big Party (10) is newest, then the flyer (9), the headliner (8), Fixion (7), LuzRD (6), the lineup (5) and Fiscalia (3); torn remnants sit at 1.

**The Paste-Up Rule.** Newest on top, and a bill overlaps a neighbour only where that neighbour is bare paper, never over a title, a status strip or a screenshot. Gaps fill with torn remnants of older, real work, which are residue rather than content.

### Bill anatomy is one set of numbers
Every bill dimension is `cqw` of the bill's own width, defined once in `posters.ts` and read by both renderers, the HTML bill (`Poster.tsx` with `globals.css`) and the WebGL texture painter (`poster-texture.ts`). Shared helpers compute the vertical anatomy: `imageLayout(spec, compact)` for print, logo, title and sub-line positions, `lineupTops(spec)`, `blurbTop(spec)` and `remnantNameSize(name)`, with `COMPACT = 230` px as the compact threshold and the `ink` table as the colours. Every CSS `max()` floor is mirrored in the painter from the bill's CSS width, and the painter places each line of text the way a CSS line box does.

**The One-Number Rule.** A bill measurement lives in exactly one place and both renderers read it; the WebGL paper must be able to replace the HTML bill without the layout moving.

### DOM order is story order
The DOM runs: skip link, strip, the headliner (the page's `h1`), the four image bills in program order (Big Party, Fiscalia, LuzRD, Fixion), the lineup bill (one link, to the paper list of the same projects), the flyer bill, the re-paste tag (hidden until a bill has been torn off), then the program, the résumé, the contact form and the footer. Stages move bills only through custom properties, so reading and tab order are the same on all three.

### The paper program
Sheets are straight and square, at most 78rem wide, padded clamp(1.5rem, 4.5vw, 4.5rem), inside a clamp(0.75rem, 3vw, 3rem) page gutter.
- **Program entry**: a 7fr / 5fr grid with a 1.75rem by clamp(1.75rem, 4vw, 3.5rem) gap, clamp(2.25rem, 4.5vw, 3.75rem) of block padding and a 1px rule between entries. Each project takes one of three layouts, chosen from the measured heights of its parts:
  - **wide**: the pictures across the sheet, then text and facts side by side (Big Party, LuzRD).
  - **row**: pictures beside the text, then the facts as one four-column row under both (Fiscalia, BattlePassTimer).
  - **side**: the pictures run long on the left across two rows; the facts hang under the text (Fixion).
- **Pictures**: the main print at its own aspect ratio, further prints as a row of equal 16:9 thumbnails 0.75rem apart, a caption under them.
- **The papers screen** (`/papers`): papers come in two kinds that are never mixed, and each kind is its own kind of paper. A **paper** (an essay or an article for any reader) is a **broadside**: one loud yellow sheet, its kind as a label, its name in wood type fitted to 86cqw (at most 30cqw), one line of its own words, its date in wood type and a black strip with its status and version. A **research paper** (technical work for specialists: the question, the design or method, the analysis and the sources) is an **offprint**: a sober Bill Paper booklet with a black band (RESEARCH PAPER and its number in yellow), the title in Archivo 700, the author at the foot, two staples down the spine and a black strip with its review status. The wall opens the screen like the home wall: a black head bill (PAPERS / & RESEARCH, a first-person line on the difference, a pink strip counting both kinds), then every broadside, then every offprint, then a notice bill for any kind with nothing out yet (PAPERS on yellow with a black strip, or RESEARCH PAPERS on Bill Paper with an orange strip; None out yet). Sealed Skills, a position paper, is a research paper and hangs as an offprint. Below the wall, one newsprint sheet per kind, labelled Kind one and Kind two over the title and a one-sentence definition: papers set like program entries with their findings (facts: Status, Kind, Version, Topics); research papers with what a specialist needs to judge them (facts: Status, Question, Approach, References). An empty kind says so in plain words. Desktop sets the wall in one row filling the first screen; under 900px the head goes full width over the rest; under 560px every sheet stacks.
- **A paper's page** (`/papers/<slug>`; styles in `src/app/papers/papers.css`, every class prefixed `pp-`): the strip and foot around one straight sheet. It opens with Back to the papers (a program link, arrow left), then on desktop a sticky numbered Contents column (13rem, clear of the strip) beside the article; under 900px the contents fold into a closed `<details>`. The title block sets the kind and status as a label, the name at the sheet-title scale, the subtitle as the standfirst and a facts row (Author, Version, Date, and Status as the outlined chip) between rules. Sections are numbered display heads over a 2px rule; the text is Archivo at 1.0625rem/1.65 within about 66ch. Figures are the paper's own diagrams redrawn in print: black line work on newsprint, solid rules for open ground, dashed rules for what is sealed, 12px squares for keys, no fills and no rounding. Sequence diagrams are static SVG built from data, with the same steps in a list only screen readers get; no diagram library loads. Tables are printed (a heavy rule on top, 1px rules between rows, row headers in the first column); in the threat model Yes is a solid Poster Black chip and Partly and No are outlined chips. Code sits in a 1px ruled box in the system monospace, highlighted in print: keywords bold, comments italic Press Grey. Anything wider than a phone scrolls sideways inside a focusable, named frame, never the page. A print stylesheet drops the strip, foot, contents and back link. The text is set verbatim from the owner's final draft; the byline carries the owner's name as the site gives it.
- **Contact flyer**: at most 48rem, centred, tilted -0.6°, a two-column form and a row of six tear-off tabs across its foot.

Under 900px, entries, the minor list and the résumé go to one column, row-layout facts drop to two columns, and the portrait stops sticking and caps at 22rem. Under 560px the facts go to one column in every layout, the form to one column, résumé dates stack over their rows, the tabs drop to four, and the strip's type shrinks.

## Elevation & Depth

Depth is material, not interface elevation: paper pasted on a wall under one raking light from the top left. Every shadow falls down and to the right in green-black, the colour of shade on painted plywood. Nothing lifts on hover except a bill's own paper in WebGL.

### Shadow Vocabulary
- **Bill drop** (`filter: drop-shadow(0.3rem 0.5rem 0.45rem rgb(6 16 10 / 0.45))`): every HTML bill. A filter, so it follows the torn edge.
- **Sheet** (`box-shadow: 0.5rem 0.9rem 2.2rem rgb(5 14 8 / 0.5), 0 2px 4px rgb(5 14 8 / 0.45)`): the program and résumé sheets and the contact flyer, pasted flat.
- **Strip** (`box-shadow: 0 0.35rem 1rem rgb(5 14 8 / 0.45)`): the sniping strip over the wall.
- **WebGL paper shadow**: a soft-edged copy of the bill, 1.2% larger, pushed away from the light by 7px plus 0.9 times the paper's height, alpha 0.34 rising to 0.56 as a flap lifts, in rgb(0.02, 0.07, 0.04). It replaces the bill drop once the WebGL wall takes over.
- **Keylines, not elevation**: printed images on paper sit in a 1px Printed Rule ring (`box-shadow: 0 0 0 1px`); the paper chip is a 2px inset ring.

In WebGL each stacking level sits 8px deeper than the one above it, every mesh scaled back so perspective never enlarges it past its HTML twin; the bill under an image bill sits 6px beneath it, an engaged bill lifts 3px, a held bill 6px, and a bill tearing away lifts 28px and is drawn in front of every other bill, its shadow with it.

### Named Rules
**The One Light Rule.** One light, from the upper left: the wall's radial highlight, the crinkle's diffuse light (azimuth 225°, elevation 60°), every CSS shadow offset (positive x, positive y) and the WebGL light vector (-0.55, 0.62, 0.56) agree. No second light, no glow, no neutral-grey shadow.

## Shapes

No radius anywhere: paper is cut or torn, and form controls stay square (`border-radius: 0`).
- **Torn edge** (`--torn`): an SVG displacement mask (turbulence 0.09, displacement 5) that nibbles the edge of every current bill. In WebGL the same edge is a ragged alpha that eats up to 2.6px.
- **Hard tear** (`--torn-hard`): turbulence 0.035, displacement 34, on remnants only (7px of ragged alpha in WebGL), so older bills read as ripped away.
- **Clean edges**: the sheets and the contact flyer keep straight edges; they are printed sheets, not street bills.
- **Perforations**: tear-off tabs are divided by dashed black lines, 2px on the contact flyer and 0.35cqw on the flyer bill.
- **Rotation**: bills tilt within -1.9° to +2.6°, remnants up to 3°, the contact flyer -0.6°. The program and résumé sheets never tilt.
- **Rules**: 0.35rem (sheet heads, the minor list), 2px (facts, résumé heads, a field's underline), 1px (between entries, image keylines).

## Components

Components are plain classes and custom properties in `src/app/globals.css` over Tailwind's preflight; Tailwind utilities are not used for styling (only `sr-only`).

### Sniping Strip (navigation)
A long black bill pasted across the top of the wall: sticky, 3.5rem tall, Poster Black under the strip shadow. On the left the studio mark: the owner's InceptumRex emblem (2.125rem, 1.875rem under 560px) beside INCEPTUMREX in the stencil face (Bill Paper), 0.7rem apart, one link back to the wall; on the right Work, Papers, About and Contact in yellow display capitals with 0.6rem by 0.1rem of hit padding, turning Bill Paper on hover (0.2s). Work, About and Contact point at the home page's sections (`/#work` and so on) and Papers at the papers screen, so the strip works the same from every page. Under 480px the wordmark steps aside (the link's accessible name keeps it) and the links close up to 0.95rem apart. Links sit clamp(1.1rem, 3vw, 2.5rem) apart inside clamp(1rem, 3vw, 2.5rem) of padding. A skip link ("Skip to the work", black capitals on yellow) drops in above the strip on focus.

### Bills (wall posters)
A bill is two boxes. The outer box holds place, rotation, stacking and the drop shadow, and is a size container; the paper inside carries the colour, the torn mask, the crinkle (a neutral soft-light relief at 0.9) and the content. Content hangs from a 6cqw left margin (8cqw on the flyer bill), and most bills end in a status strip across the full width of the foot, max(11cqw, 28px) tall.
- **Headliner** (black): the name lines from 6cqw down, each advancing 0.86 times its size; the blurb 4cqw below them, 84cqw wide, in Bill Paper; the pink live-now strip. Not a link.
- **Image bill** (black, paper or pink; links to the project's program entry, or to whichever bill of its stack is showing): the print at the top, full-bleed on black bills or inset 4cqw inside a 0.4cqw black keyline on paper and coloured bills, 44 to 66cqw tall and cropped around a focus point; the title 3.5cqw under the print; the one-line sub 1.4cqw under the title; the status strip. Big Party sets its logo instead of a title, 74cqw wide and centred, overlapping the print's foot by 62% of its own height, with the sub 2cqw under it.
- **Compact image bill** (under 230px wide, by container query): the print goes full-bleed at 60cqw, the title drops to 17cqw (the logo widens to 84cqw), the sub hides and the strip switches to its short text, max(11cqw, 24px) tall.
- **Lineup** (yellow; one link to "Also on the bill" in the program, named by an `aria-label` that lists every act): the heading at 6cqw, then one act per line from 19cqw down, each act advancing its size times 1.02 plus 1.5cqw, ranked by the Billing Rule; a black strip, "Details in print below". The acts are print, not separate links: the whole bill is the target, so small acts never become small tap targets.
- **Flyer bill** (paper; links to the contact flyer): "Work inquiries" in two 16cqw lines; the bottom 42% cut into four dashed tear-off tabs with the email running vertically (decorative, hidden from assistive technology).
- **Remnant** (pink, paper or black): a hard-torn scrap of an older, real project, its name fitted to 88cqw with one line under it. Decorative, hidden from assistive technology, never peels.

**Paste-up entrance.** On load each bill slaps on in DOM order and then sits still: 0.62s on cubic-bezier(0.16, 1, 0.3, 1), from 3° more rotation, 0.8rem higher, 104.5% scale and transparent, staggered 85ms per bill after 100ms. Only under `prefers-reduced-motion: no-preference`; it is the wall's one entrance.

**Résumé paste-up.** The résumé sheet is pasted up as it arrives. three.js loads a screen ahead; when the sheet's top reaches the bottom of the screen the sheet hides (a `clip-path` on the HTML sheet, nothing else) behind a rolled sheet resting on its top edge, and when its top is a quarter of the way up the screen the roll unrolls down it: a lit Paper Back cylinder of radius clamp(2.8% of the sheet width, 14px, 34px) that thins to 55% as paper leaves it, turns as it rolls (print-through lines run along its axis), shows its layered ends and throws a green-black band shadow down and to the right. The HTML sheet is revealed just above the roll the whole way; the run takes clamp(0.9ms per px of sheet, 1.6s, 3.2s) on an ease-in-out cubic, so the first screen of paper takes about a second, then the roll fades in 280ms and the renderer is disposed. It never runs under reduced motion or Save-Data, never hides a sheet that is already in view (a jump to #about shows it at once), never waits more than 4s, never hides it before three.js is ready, and clears on print.

### The WebGL Paper Twin
Where WebGL runs, every bill gets a lit paper twin on one canvas laid over the wall (z-index 12, `pointer-events: none`, `aria-hidden`). The twin only paints. The HTML bill underneath stays the link, the hit target (the pointer is resolved with `elementFromPoint`), the focus target and the text screen readers read.
- **Material**: the bill's texture painted from the same spec, on a 64 by 64 plane with low paste bubbles (stronger within 18% of the edge), a two-octave crinkle in the surface normal (0.2), shading of 1 + 0.95 x (n·L - L.z) so flat paper shows exactly its HTML twin's colour, wet-paste sheen in patches (specular exponent 60, 0.03 to 0.12), 1% grain and the ragged alpha edge. Colours stay sRGB end to end.
- **The peel**: the corner nearest the pointer, found in the bill's rotated frame, rolls around a cylinder of radius clamp(0.065 x the short side, 10px, 30px), up to (0.045 + 0.2 x nearness^1.6) x the short side. The flap shows Paper Back, the paper just past the fold darkens by up to 30%, and the shadow grows with the flap. A press or tap kicks the fold (+520px/s); keyboard focus peels the bottom-right corner to 0.2 x the short side. The fold is a spring (stiffness 170, damping 18), and a change of corner first relaxes to flat. Near a corner of a bill that can come away, the cursor is a grab hand.
- **Pulling a bill off**: a press that travels 6px (10px for touch) becomes a pull, and the fold follows the pointer. The fold line turns toward the pull while the pull points into the paper, within 60° of the corner's diagonal, and runs half the pointer's travel plus half a turn of the cylinder, so the lifted corner stays under the finger; pulled sideways or away, the corner peels back along its diagonal. While held the spring stiffens (900, damping 60) and the bill lifts 6px. Let go past 42% of the bill's reach along the fold, or past 16% with a flick faster than 900px/s, and the bill tears away: the fold runs past the far edge, the sheet lifts 28px in front of every bill, drops (60px/s plus 1300px/s² of fall), turns by up to ±0.7 rad/s and fades out between 0.1s and 0.42s. Short of that it springs back. A pull never follows the link (the click after it is swallowed) and uses pointer capture, so it keeps tracking outside the wall. Image bills take `touch-action: pan-y pinch-zoom`: on a phone a sideways swipe peels and a vertical one scrolls the page.
- **Stacks**: under every image bill are real bills whose facts also live in print. Big Party covers BIG PARTY, the 2D Godot game (yellow, "Coming soon on Steam"); LuzRD covers the InceptumRex studio bill (yellow, "Since 2018"); Fixion covers Fixion 2D (pink, "Prototype, 2026"). Fiscalia covers its own older bill from before it was set as an ERP (black, FISCALIA / E-CF in yellow wood type, "Invoicing built to DGII rules", an orange "Since 2025" strip). An older bill sets its name in wood type, each line fitted to 88cqw by the painter's own measurement (at most 30cqw, smaller if the lines would crowd the print), one line of print and a strip. When a bill tears off, the bill below takes the top paint, the paper seed and the HTML twin's `href` and `aria-label`, and the next bill down is painted into the freed canvas (its prints load on the first press of that bill). The last bill of a stack, and every bill without one, is pasted for good: a pull gives up to 30% of its reach and only 15% of any more, then springs back.
- **Re-pasting**: after the first tear-off the re-paste tag appears. It slaps every torn bill back on (0.5s: its alpha rises and it drops from 26px to the wall), puts every link back and moves focus to the first re-pasted bill.
- **The tease**: once per visit, 1.1s after the handover and only if nobody has touched the wall, Fiscalia's bottom-right corner lifts to 0.26 x its short side and settles 0.75s later, so a visitor sees that the bills come away.
- **The papers wall** (`src/components/papers/shelf/`, sharing the paper in `wall/paper-shader.ts`): **Paste-up**: before the sheets are parsed, a small script marks the wall `data-gl="pending"` (never under reduced motion or Save-Data) so the HTML sheets wait unseen; the paper then pastes each one up in turn, 170ms apart: it arrives folded back on itself above its place, its back showing, its top edge goes on first and the fold runs down to its foot over 1.05s (ease-out cubic) around a fat roll (radius clamp(0.09 x the short side, 16px, 36px)), fading in over the first 16%. If the paper has not started within 3.5s the HTML sheets show and the paper later takes over without a paste-up. **Hover and focus**: a broadside, the head and the notice lift the corner nearest the pointer, like a bill; an offprint opens: its cover turns from the free edge over the staples like a page, all the way over, and shows the opening of its abstract, its question, its approach and its references printed on the page inside. **Read**: a plain click on a broadside or an offprint picks it up: it straightens, lifts 60px and comes 1100px toward the reader over 0.6s, drawn in front of everything, and then the paper's page opens by client-side navigation; a click asking for a new tab or window keeps the browser's own behaviour, and a page restored from the history cache puts every sheet back.
- **Render on demand**: frames run only while a spring moves and the wall is on screen; a resize lays out and paints once. Textures repaint only when a bill's width changes by more than 12% or it crosses the compact threshold, at most 1800px wide; the pixel ratio caps at 2, and at 1.5 once the wall exceeds 1.6 million CSS px².
- **Mount and handover**: three.js loads when the browser is idle (within 1.2s), never under reduced motion or Save-Data, and waits for the fonts and prints. The canvas fades in over 0.3s no earlier than 1.5s after navigation, when the paste-up has finished, and only then do the HTML bills stop painting (opacity, after a 0.3s step). If WebGL fails or the context is lost, the HTML wall paints again, every link goes back to its own bill and the re-paste tag hides.

### Status Chips
Printed status on paper: display 800 capitals, black type, 0.4rem by 0.55rem of padding (0.35rem below), square. Yellow, pink and orange fields for live or shipping work; the paper chip (no field, a 2px inset black ring) for prototypes, offline and local builds. A note in Press Grey can follow the chip ("pre-revenue", "2D demo free on Steam").

### Paper Sheets and Program Entries
Newsprint under a fibre texture and the sheet shadow. A sheet's head is a sheet title, a lede and a 0.35rem rule. An entry is a name, a standfirst, two body paragraphs and links, with a facts list (Status with its chip, Kind with years, Role, Built with) under a 2px rule, set wide, row or side (see Layout).

### Links
- **Program links**: Archivo Narrow 700 capitals in Press Black over a 0.2rem pink rule that turns Press Black on hover (0.2s), a bold up-right arrow icon, 0.35rem of vertical hit padding; they open a new tab and say so to screen readers.
- **Résumé links**: Archivo 600 with an icon (GitHub, LinkedIn, envelope), underlined 0.15rem in pink at a 0.3em offset.
- **Footer links**: Archivo 600 in Stencil White, underlined 0.15rem in yellow.

### Buttons
- **Shape:** square (0px), no border.
- **Primary** (Send inquiry): yellow display capitals on Poster Black, 1rem by 1.5rem of padding. Hover warms the field to #2c2c29 (0.2s); a press moves it down 1px (0.1s); while sending it shows a progress cursor at 65% opacity.
- **Quiet** (Send another): black capitals on yellow; hover deepens the yellow with 8% Poster Black.

### Inputs / Fields
- **Style:** a label in Archivo Narrow 700 capitals (0.85rem, 0.1em) over a transparent field with a 2px black underline, Archivo 500 at 1.08rem, a pink caret, square. The message is a boxed textarea (2px black, 0.7rem by 0.8rem of padding, vertical resize). Optional fields say "(optional)" in Press Grey without capitals.
- **Focus:** a 3px pink ring at a 2px offset.
- **Error:** after interaction an invalid field's border turns Alarm Red; a failed send shows an Alarm Red line announced as an alert. Success replaces the form with "Sent." announced as a status.

### Tear-off Tabs
Six paper tabs (four under 560px) across the contact flyer's foot, bleeding to its edges, 11.5rem tall, split by 2px dashed perforations, the email running vertically in Archivo Narrow 600. Hover tints them with 22% yellow. Pressing a tab copies the email (or opens the mail app) and tears the tab off: 0.8s on the same ease-out, a 4° tug, then a 9rem drop turning 16° as it fades; a polite live region says what happened. Under reduced motion the torn tab rests at 25% opacity.

### Re-paste Tag
A scrap of the sniping strip pasted low on the wall, bottom left and tilted -1.4°: yellow display capitals (800, 0.95rem, 0.1em) on Poster Black, 0.8rem by 1.1rem of padding, at least 2.75rem tall, under the bill drop shadow. Hover warms the black with 14% Bill Paper; focus is the wall's 3px yellow ring. It reads "Paste the bills back" and exists only for the WebGL wall, hidden until a bill has been torn off.

### Footer
Centred on the wall: the full InceptumRex logo lockup printed on a label pasted to the wall (Bill Paper under the fibre, the sheet shadow, tilted -1.2°, at most 34rem wide), because its black type needs a light ground; then a credit line and GitHub, LinkedIn and email links, all in Stencil White.

### The InceptumRex Mark
The owner's logo (supplied 2026-09-27) lives in `public/brand/`: `inceptumrex-logo.svg` is the full lockup exactly as supplied (emblem, INCEPTUM REX, TECHNICAL SERVICES and its signature line), `inceptumrex-mark.svg` the emblem alone (the same drawing with the lettering left off and the viewBox cropped to the disc). The emblem is also `src/app/icon.svg`, `favicon.ico` (16, 32, 48) and `apple-icon.png` (on its own disc colour). Its cyan (#34d8ff) and near-black (#0b0b0d) live only inside those files, never as interface colours.

**The Mark Rule.** Use the logo as supplied: the emblem alone where it must be small (the strip, the icons), the full lockup only on a light paper ground and wide enough to read (the footer label). Never recolour, redraw, outline or re-letter it, and never pull its cyan into the interface. At 16px the emblem's ring and pins blur; a simplified small-size drawing would be the owner's call.

### Printed Images and Provenance
Screenshots and renders print unretouched: no duotone, tint, grunge or colour filter. On the wall a print takes only the paper's own crinkle and light; on paper it sits clean in a Plate Well inside a 1px keyline, and its caption says what the viewer is looking at ("Rendered inside the game.", a demo business against the DGII simulator whose accepted state is simulated). Every shipping raster carries an ORIGIN record: a WebP has a `<file>.webp.json` sidecar written with `impeccable embed-prompt`, and a JPEG or PNG carries the same record embedded in the file (`og.jpg`, `bigparty-logo.png`). The two wall textures are made by `scripts/make-plywood.py` from a CC0 photograph and record that origin. No generated imagery ships.

### Focus, Keyboard and Screen Readers
- **Rings contrast with their ground:** 3px yellow at a 3px offset on the wall and the strip, 4px yellow at a 6px offset around a whole bill (it lands on the wall, never on the bill's own paper, so the yellow lineup bill is ringed like the rest), black inside the sheets and on the contact flyer, 3px pink at a 2px offset around fields.
- **Focus rises above the paper:** while the WebGL wall is active, a focused bill, or one holding focus, rises to z-index 20 above the canvas so its ring is never painted under the paper.
- **The HTML twin stays in the tree:** when WebGL takes over, the HTML bills fade by opacity, never `visibility` or `display`, so the links, the `h1`, the labels and the tab order are unchanged.
- **Decoration is hidden:** remnants, the stencil, the canvas, the flyer bill's tabs, a strip's short duplicate text and every icon are `aria-hidden`. Each image bill is a link named by its `aria-label` (project, one line, status) with a decorative image inside; every image in the program has descriptive alt text.
- **Reduced motion:** no paste-up, no WebGL, no tear animation, no smooth scrolling. The HTML wall is the complete wall.

## Do's and Don'ts

### Do:
- **Do** size each headliner line to fill its bill, one size per line (29.8cqw and 22.3cqw today), and rank lineup acts by type size.
- **Do** define every bill measurement once, in `cqw` in `posters.ts`, and read it through the shared helpers (`imageLayout`, `lineupTops`, `blurbTop`, `remnantNameSize`) in both `Poster.tsx` and `poster-texture.ts`, mirroring every CSS `max()` floor in the painter.
- **Do** paste a new bill with a spec in `posters.ts` and a position rule for each of the three stages (or hide it on phones, as the flyer is), newest on top, overlapping only bare paper.
- **Do** fill gaps on the wall with torn remnants of real older work, `aria-hidden` and at the bottom of the stack.
- **Do** write every status in words on a chip or a strip: fluorescent for live or shipping work, the outlined paper chip for the rest.
- **Do** set a fluorescent ink as a field under black type, or as type on Poster Black, and nowhere else.
- **Do** cast every shadow down and to the right in green-black from the one top-left light, in CSS and WebGL alike.
- **Do** keep every focus ring in contrast with the surface it lands on: yellow on the wall and the strip, black on paper and newsprint, pink around fields.
- **Do** print screenshots and renders unretouched and caption what is simulated or rendered.
- **Do** give every shipping raster an ORIGIN record: a `.json` sidecar for WebP, embedded metadata for JPEG and PNG.
- **Do** give every image bill a stack of real bills whose facts are also in print, and keep the last bill of a stack pasted for good.

### Don't:
- **Don't** set the work in a card grid, a dark hero or a logo wall; work lives on the wall as bills and on paper as entries.
- **Don't** add a second ground (a theme toggle, a dark section, a coloured panel); paper is pasted on the one wall.
- **Don't** round a corner. Paper is cut or torn.
- **Don't** set pink, yellow or orange type on paper, newsprint or the wall, and don't use Alarm Red for anything but errors.
- **Don't** let a bill cover a neighbour's title, status strip or screenshot.
- **Don't** change a bill measurement in one renderer only.
- **Don't** reorder the DOM for a stage; stages move bills through custom properties only.
- **Don't** hide the HTML twin with `visibility` or `display` when WebGL takes over, and don't let the canvas take pointer events.
- **Don't** run a continuous render loop; render only while something moves and the wall is on screen.
- **Don't** mount WebGL under reduced motion or Save-Data, and don't put anything a visitor needs only in the WebGL paper; what the peel reveals is residue whose facts also live in print.
- **Don't** tilt or overlap the program and résumé sheets; only bills tilt, and the contact flyer is one.
- **Don't** tint, duotone or filter a screenshot, and don't ship a raster without its ORIGIN record.
- **Don't** set readable text on the wall in anything dimmer than Stencil White, or shrink a lineup act below 4.8cqw; the grain eats contrast and 4.8cqw is the legibility floor.
- **Don't** split a bill into several small links; one bill is one target.
- **Don't** let a pull follow a link, or take vertical swipes on the wall away from the page.
- **Don't** mix papers and research papers: a paper (an essay for any reader) is a broadside and a research paper (technical work for specialists) an offprint, each kind has its own printed sheet, and an empty kind says it is empty instead of borrowing from the other.
- **Don't** recolour or redraw the InceptumRex logo, or bring its cyan into the interface.
- **Don't** put the personal email or phone from the résumé PDFs on the page; the site's public channels are the only contact.
- **Don't** let the résumé paste-up hide the sheet when it cannot reveal it: no three.js, reduced motion, Save-Data, a jump to #about or print all show the sheet as is.
