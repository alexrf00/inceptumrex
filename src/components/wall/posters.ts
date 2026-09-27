// One definition per bill, read by two renderers: the HTML poster (the
// accessible, no-WebGL wall) and the canvas that paints the three.js paper
// texture. Sizes are in cqw, percent of the poster's own width, so both
// renderers agree at any size. Where a size has a pixel floor (CSS max()),
// poster-texture.ts applies the same floor from the poster's css width.

export const ink = {
  black: "#121212",
  paper: "#f4f4ef",
  back: "#d9d9d1",
  pink: "#ff2d87",
  yellow: "#ffe414",
  orange: "#ff6a1f",
} as const

// Below this css width an image bill goes compact: picture, name, short status.
export const COMPACT = 230

type Strip = { text: string; short: string; bg: string; fg: string }

// An older bill pasted underneath, revealed only when the corner peels (WebGL).
export type UnderBill = { bg: string; fg: string; name: string; line: string; year: string }

export type HeadlinerPoster = {
  kind: "headliner"
  id: string
  label: string
  bg: string
  lines: { text: string; color: string; size: number }[]
  blurb: string
  strip: Strip
}

export type ImagePoster = {
  kind: "image"
  id: string
  href: string
  label: string
  bg: string
  image: { src: string; width: number; height: number; focusX: number; focusY: number }
  inset: number
  imageHeight: number
  frame: boolean
  logo?: { src: string; width: number; height: number; size: number }
  title?: { text: string; size: number; color: string }
  sub: { text: string; color: string }
  strip: Strip
  under: UnderBill
}

export type LineupPoster = {
  kind: "lineup"
  id: string
  href: string
  label: string
  bg: string
  heading: string
  items: { id: string; name: string; size: number }[]
  strip: Strip
}

export type FlyerPoster = {
  kind: "flyer"
  id: string
  href: string
  label: string
  bg: string
  title: string[]
  titleSize: number
  tab: string
  tabs: number
}

// A torn older bill in a gutter of the wall. Decorative and static.
export type RemnantPoster = {
  kind: "remnant"
  id: string
  bg: string
  fg: string
  name: string
  line: string
}

export type PosterSpec = HeadlinerPoster | ImagePoster | LineupPoster | FlyerPoster | RemnantPoster

export const posters: PosterSpec[] = [
  {
    kind: "headliner",
    id: "headliner",
    label: "Alex M. Rodriguez. Games, fiscal software and civic tools, built end to end",
    bg: ink.black,
    // Each line is sized to fill the bill's width, the way wood type is set.
    lines: [
      { text: "Alex M.", color: ink.yellow, size: 29.8 },
      { text: "Rodriguez", color: ink.paper, size: 22.3 },
    ],
    blurb: "Games, fiscal software and civic tools, built end to end. Dominican Republic and New York.",
    strip: { text: "Live now: Fiscalia, LuzRD, BattlePassTimer", short: "Live now: 3 products", bg: ink.pink, fg: ink.black },
  },
  {
    kind: "image",
    id: "big-party",
    href: "#work-big-party",
    label: "Big Party 3D. An online party brawl for up to 12 outlaws, in development",
    bg: ink.black,
    image: { src: "/work/bigparty-poster.webp", width: 1400, height: 860, focusX: 0.5, focusY: 0.5 },
    inset: 0,
    imageHeight: 66,
    frame: false,
    logo: { src: "/work/bigparty-logo.png", width: 1280, height: 370, size: 74 },
    sub: { text: "Up to 12 outlaws. three.js", color: ink.paper },
    strip: { text: "In development. 2D demo free on Steam", short: "In development", bg: ink.yellow, fg: ink.black },
    under: { bg: ink.yellow, fg: ink.black, name: "Big Party", line: "2D, Godot. Free demo on Steam", year: "2026" },
  },
  {
    kind: "image",
    id: "fiscalia",
    href: "#work-fiscalia",
    label: "Fiscalia. Electronic invoicing for Dominican businesses, built to DGII rules. Live",
    bg: ink.paper,
    image: { src: "/work/fiscalia-poster.webp", width: 1150, height: 1000, focusX: 0.62, focusY: 0.6 },
    inset: 4,
    imageHeight: 62,
    frame: true,
    title: { text: "Fiscalia", size: 22, color: ink.black },
    sub: { text: "e-CF invoicing, built to DGII rules", color: ink.black },
    strip: { text: "Live: fiscaliaservice.com", short: "Live", bg: ink.orange, fg: ink.black },
    under: { bg: ink.black, fg: ink.yellow, name: "Asepre Business Suite", line: "Invoices and NCF, Spring Boot", year: "2025" },
  },
  {
    kind: "image",
    id: "luzrd",
    href: "#work-luzrd",
    label: "LuzRD. A real-time blackout tracker for the Dominican Republic. Live",
    bg: ink.pink,
    image: { src: "/work/luzrd-poster.webp", width: 1000, height: 560, focusX: 0.5, focusY: 0.5 },
    inset: 4,
    imageHeight: 44,
    frame: true,
    title: { text: "LuzRD", size: 25, color: ink.black },
    sub: { text: "Blackouts, live, barrio by barrio", color: ink.black },
    strip: { text: "Live: luzrd.do", short: "Live", bg: ink.black, fg: ink.yellow },
    under: { bg: ink.yellow, fg: ink.black, name: "InceptumRex", line: "Full-stack studio", year: "2018" },
  },
  {
    kind: "image",
    id: "fixion",
    href: "#work-fixion",
    label: "Fixion. Dominican-folklore co-op survival horror, a prototype made with Frankely Diaz",
    bg: ink.black,
    image: { src: "/work/fixion-map.webp", width: 1800, height: 1126, focusX: 0.42, focusY: 0.5 },
    inset: 0,
    imageHeight: 54,
    frame: false,
    title: { text: "Fixion", size: 24, color: ink.paper },
    sub: { text: "Co-op folklore horror", color: ink.paper },
    strip: { text: "Prototype, with Frankely Diaz", short: "Prototype, with Frankely Diaz", bg: ink.paper, fg: ink.black },
    under: { bg: ink.pink, fg: ink.black, name: "Excel Enricher", line: "Spreadsheets filled from the web", year: "2026" },
  },
  {
    kind: "lineup",
    id: "lineup",
    href: "#minor-title",
    label:
      "Also on the bill: BattlePassTimer, Omni Run, dubbtogether, BxGoatDrip, Stitch Designer, Excel Enricher, Fixion 2D, ASEPRE, Brolick Gym. Details in print below",
    bg: ink.yellow,
    heading: "Also on the bill",
    items: [
      { id: "battlepasstimer", name: "BattlePassTimer", size: 8 },
      { id: "omni-run", name: "Omni Run", size: 6.6 },
      { id: "dubbtogether", name: "dubbtogether", size: 6.6 },
      { id: "bxgoatdrip", name: "BxGoatDrip", size: 5.8 },
      { id: "stitch-designer", name: "Stitch Designer", size: 5.8 },
      { id: "excel-enricher", name: "Excel Enricher", size: 5.2 },
      { id: "fixion-2d", name: "Fixion 2D", size: 5.2 },
      { id: "asepre", name: "ASEPRE", size: 4.8 },
      { id: "brolick-gym", name: "Brolick Gym", size: 4.8 },
    ],
    strip: { text: "Details in print below", short: "Details below", bg: ink.black, fg: ink.yellow },
  },
  {
    kind: "flyer",
    id: "flyer",
    href: "#contact",
    label: "Work inquiries: contact Alex",
    bg: ink.paper,
    title: ["Work", "inquiries"],
    titleSize: 16,
    tab: "inceptumrex@gmail.com",
    tabs: 4,
  },
  {
    kind: "remnant",
    id: "rem-asepre",
    bg: ink.pink,
    fg: ink.black,
    name: "ASEPRE",
    line: "Landing page, 2025",
  },
  {
    kind: "remnant",
    id: "rem-brolick",
    bg: ink.paper,
    fg: ink.black,
    name: "Brolick Gym",
    line: "Gym site, 2025",
  },
  {
    kind: "remnant",
    id: "rem-bxgoatdrip",
    bg: ink.black,
    fg: ink.yellow,
    name: "BxGoatDrip",
    line: "Storefront, 2026",
  },
]

// Vertical positions inside an image poster, in cqw. Shared by both renderers.
export function imageLayout(spec: ImagePoster, compact: boolean) {
  const imageHeight = compact ? 60 : spec.imageHeight
  const inset = compact ? 0 : spec.inset
  if (spec.logo) {
    const size = compact ? 84 : spec.logo.size
    const logoH = (size * spec.logo.height) / spec.logo.width
    const logoTop = imageHeight - logoH * 0.62
    return { inset, imageHeight, logoSize: size, logoTop, logoH, titleTop: 0, titleSize: 0, subTop: logoTop + logoH + 2 }
  }
  const titleTop = inset + imageHeight + (compact ? 3 : 3.5)
  const titleSize = compact ? 17 : (spec.title?.size ?? 0)
  return { inset, imageHeight, logoSize: 0, logoTop: 0, logoH: 0, titleTop, titleSize, subTop: titleTop + titleSize * 0.92 + 1.4 }
}

// Top of each lineup act, in cqw.
export function lineupTops(spec: LineupPoster) {
  let top = 6 + 9 + 4
  return spec.items.map((item) => {
    const t = top
    top += item.size * 1.02 + 1.5
    return t
  })
}

// Top of the headliner blurb, in cqw.
export function blurbTop(spec: HeadlinerPoster) {
  return 6 + spec.lines.reduce((sum, line) => sum + line.size * 0.86, 0) + 4
}

// Remnant names use a fixed estimate of the face's width so HTML and canvas
// agree without measuring: Big Shoulders 900 caps run about 0.52em each.
export const remnantNameSize = (name: string) => Math.min(88 / (name.length * 0.52), 30)
