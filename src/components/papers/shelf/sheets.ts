import { categories, paperHref, papersOf } from "@/content/papers"
import { ink } from "@/components/wall/posters"

// The papers wall, sheet by sheet. Read by two renderers, like the home wall's
// posters.ts: the HTML sheet (the link, the text, the no-WebGL wall) and the
// canvas that paints its three.js paper. Sizes are cqw of the sheet's width.
//
// The two kinds are two kinds of paper: a paper (an essay for any reader) is a
// BROADSIDE, one loud sheet pasted flat with its name in wood type; a research
// paper (technical work for specialists) is an OFFPRINT, a sober stapled
// booklet whose cover turns to its abstract. A kind with nothing out yet gets
// a NOTICE that says so.

type Strip = { text: string; short: string; bg: string; fg: string }

export type HeadSheet = {
  kind: "head"
  id: string
  bg: string
  lines: { text: string; color: string; size: number }[]
  blurb: string
  strip: Strip
}

export type BroadsideSheet = {
  kind: "broadside"
  id: string
  href: string
  label: string
  bg: string
  fg: string
  eyebrow: string
  lines: { text: string; size: number }[]
  line: string
  date: string
  strip: Strip
}

export type OffprintSheet = {
  kind: "offprint"
  id: string
  href: string
  label: string
  number: string
  title: string
  author: string
  abstract: string
  study: { question: string; approach: string; references: string; review: string }
}

export type NoticeSheet = {
  kind: "notice"
  id: string
  href: string
  label: string
  bg: string
  fg: string
  lines: { text: string; size: number }[]
  line: string
  strip: Strip
}

export type ShelfSheet = HeadSheet | BroadsideSheet | OffprintSheet | NoticeSheet

// Wood type fitted to the sheet: Big Shoulders 900 capitals run about 0.52em
// each, so a line of n letters fills `width` cqw at width / (0.52 n), capped.
export const fit = (text: string, max: number, width = 86) => Math.min(width / (text.length * 0.52), max)

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export function shelfSheets(): ShelfSheet[] {
  const argued = papersOf("paper")
  const studies = papersOf("research")
  const sheets: ShelfSheet[] = [
    {
      kind: "head",
      id: "head",
      bg: ink.black,
      lines: [
        { text: "Papers", color: ink.yellow, size: fit("Papers", 30, 88) },
        { text: "& research", color: ink.paper, size: fit("& research", 30, 88) },
      ],
      blurb: "I write two kinds, kept apart: papers, essays for any reader, and research papers, technical work with its analysis and its sources.",
      strip: {
        text: `${argued.length ? plural(argued.length, "paper", "papers") : "no papers yet"} · ${studies.length ? plural(studies.length, "research paper", "research papers") : "no research papers yet"}`,
        short: `${argued.length} + ${studies.length}`,
        bg: ink.pink,
        fg: ink.black,
      },
    },
  ]
  for (const p of argued) {
    sheets.push({
      kind: "broadside",
      id: `paper-${p.slug}`,
      href: paperHref(p),
      label: `${categories.paper.one}: ${p.title}. ${p.kind}, ${p.status.toLowerCase()}, version ${p.version}. Opens the paper`,
      bg: ink.yellow,
      fg: ink.black,
      eyebrow: `${categories.paper.one} · ${p.kind}`,
      lines: p.wall.lines.map((text) => ({ text, size: fit(text, 30) })),
      line: p.wall.line,
      date: p.dateLabel,
      strip: { text: `${p.status}, v${p.version}`, short: `v${p.version}`, bg: ink.black, fg: ink.yellow },
    })
  }
  studies.forEach((p, i) => {
    sheets.push({
      kind: "offprint",
      id: `research-${p.slug}`,
      href: paperHref(p),
      label: `${categories.research.one}: ${p.title}. ${p.study?.review ?? p.status}. Opens the paper`,
      number: `Nº ${String(i + 1).padStart(2, "0")}`,
      title: p.title,
      author: p.author,
      abstract: p.study?.opening ?? p.subtitle,
      study: { question: p.study?.question ?? "", approach: p.study?.approach ?? "", references: p.study?.references ?? "", review: p.study?.review ?? p.status },
    })
  })
  // A kind with nothing out yet says so, after the sheets that are.
  if (!argued.length) {
    sheets.push({
      kind: "notice",
      id: "paper-none",
      href: "#index",
      label: "Papers: none out yet",
      bg: ink.yellow,
      fg: ink.black,
      lines: [{ text: "Papers", size: fit("Papers", 26) }],
      line: "None out yet",
      strip: { text: "Essays for any reader", short: "Soon", bg: ink.black, fg: ink.yellow },
    })
  }
  if (!studies.length) {
    sheets.push({
      kind: "notice",
      id: "research-none",
      href: "#research",
      label: "Research papers: none out yet",
      bg: ink.paper,
      fg: ink.black,
      lines: [
        { text: "Research", size: fit("Research", 22) },
        { text: "papers", size: fit("papers", 22) },
      ],
      line: "None out yet",
      strip: { text: "Technical work, with sources", short: "Soon", bg: ink.orange, fg: ink.black },
    })
  }
  return sheets
}

// Vertical anatomy, in cqw, shared by both renderers.
export function headTops(sheet: HeadSheet) {
  let top = 6
  const lines = sheet.lines.map((l) => {
    const t = top
    top += l.size * 0.86
    return t
  })
  return { lines, blurb: top + 4 }
}

export function broadsideTops(sheet: BroadsideSheet) {
  let top = 15
  const lines = sheet.lines.map((l) => {
    const t = top
    top += l.size * 0.86
    return t
  })
  return { eyebrow: 7, lines, line: top + 3.5 }
}

export function noticeTops(sheet: NoticeSheet) {
  let top = 7
  const lines = sheet.lines.map((l) => {
    const t = top
    top += l.size * 0.86
    return t
  })
  return { lines, line: top + 3 }
}

// The offprint cover: a black band with the kind and number, the title in the
// body face, the author, and the review status on the foot.
export const OFFPRINT = { band: 16, title: 24, titleSize: 8.2, author: 3.2, staples: [0.2, 0.8] } as const
