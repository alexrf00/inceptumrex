import { line, paintStrip, setFont, wrap, type Ctx, type Fonts } from "@/components/wall/poster-texture"
import { ink } from "@/components/wall/posters"
import { OFFPRINT, broadsideTops, headTops, noticeTops, type OffprintSheet, type ShelfSheet } from "./sheets"

// Paints a papers-wall sheet for the three.js paper. Every number is the cqw
// value Shelf.tsx and the .sh rules in papers.css use, and every CSS max()
// floor is mirrored from the sheet's css width.

const stripHeight = (u: number, px: number) => Math.max(11 * u, 28 * px)

export function paintSheet(canvas: HTMLCanvasElement, sheet: ShelfSheet, width: number, height: number, fonts: Fonts, cssWidth: number) {
  canvas.width = Math.round(width)
  canvas.height = Math.round(height)
  const ctx = canvas.getContext("2d") as Ctx
  const W = canvas.width
  const H = canvas.height
  const u = W / 100
  const px = W / cssWidth

  if (sheet.kind === "head") {
    ctx.fillStyle = sheet.bg
    ctx.fillRect(0, 0, W, H)
    const tops = headTops(sheet)
    sheet.lines.forEach((l, i) => {
      const size = l.size * u
      setFont(ctx, 900, size, fonts.display, -0.005)
      line(ctx, l.text.toUpperCase(), 6 * u, tops.lines[i] * u, size, 0.86, l.color)
    })
    const size = Math.max(4.6 * u, 13 * px)
    setFont(ctx, 600, size, fonts.narrow)
    wrap(ctx, sheet.blurb, 84 * u).forEach((t, i) => line(ctx, t, 6 * u, tops.blurb * u + i * 1.28 * size, size, 1.28, ink.paper))
    paintStrip(ctx, sheet.strip, false, W, H, u, px, fonts)
    return
  }

  if (sheet.kind === "broadside") {
    ctx.fillStyle = sheet.bg
    ctx.fillRect(0, 0, W, H)
    const tops = broadsideTops(sheet)
    const eyebrow = Math.max(3.6 * u, 11 * px)
    setFont(ctx, 700, eyebrow, fonts.narrow, 0.12)
    line(ctx, sheet.eyebrow.toUpperCase(), 6 * u, tops.eyebrow * u, eyebrow, 1.2, sheet.fg)
    sheet.lines.forEach((l, i) => {
      const size = l.size * u
      setFont(ctx, 900, size, fonts.display, -0.005)
      line(ctx, l.text.toUpperCase(), 6 * u, tops.lines[i] * u, size, 0.86, sheet.fg)
    })
    const size = Math.max(5.4 * u, 13 * px)
    setFont(ctx, 600, size, fonts.narrow)
    wrap(ctx, sheet.line, 86 * u).forEach((t, i) => line(ctx, t, 6 * u, tops.line * u + i * 1.22 * size, size, 1.22, sheet.fg))
    const date = 9 * u
    setFont(ctx, 800, date, fonts.display)
    line(ctx, sheet.date.toUpperCase(), 6 * u, H - stripHeight(u, px) - 3 * u - date * 0.9, date, 0.9, sheet.fg)
    paintStrip(ctx, sheet.strip, false, W, H, u, px, fonts)
    return
  }

  if (sheet.kind === "notice") {
    ctx.fillStyle = sheet.bg
    ctx.fillRect(0, 0, W, H)
    const tops = noticeTops(sheet)
    sheet.lines.forEach((l, i) => {
      const size = l.size * u
      setFont(ctx, 900, size, fonts.display, -0.005)
      line(ctx, l.text.toUpperCase(), 6 * u, tops.lines[i] * u, size, 0.86, sheet.fg)
    })
    const size = Math.max(7 * u, 14 * px)
    setFont(ctx, 700, size, fonts.narrow)
    line(ctx, sheet.line, 6 * u, tops.line * u, size, 1.1, sheet.fg)
    paintStrip(ctx, sheet.strip, false, W, H, u, px, fonts)
    return
  }

  paintOffprintCover(ctx, sheet, W, H, u, px, fonts)
}

function staples(ctx: Ctx, H: number, u: number) {
  ctx.fillStyle = ink.black
  for (const at of OFFPRINT.staples) ctx.fillRect(2.5 * u, H * at - 3.5 * u, 1.4 * u, 7 * u)
}

function paintOffprintCover(ctx: Ctx, sheet: OffprintSheet, W: number, H: number, u: number, px: number, fonts: Fonts) {
  ctx.fillStyle = ink.paper
  ctx.fillRect(0, 0, W, H)
  const band = OFFPRINT.band * u
  ctx.fillStyle = ink.black
  ctx.fillRect(0, 0, W, band)
  const label = Math.max(4 * u, 11 * px)
  setFont(ctx, 700, label, fonts.narrow, 0.12)
  line(ctx, "RESEARCH PAPER", 8 * u, (band - label * 1.2) / 2, label, 1.2, ink.yellow)
  const n = ctx.measureText(sheet.number.toUpperCase()).width
  line(ctx, sheet.number.toUpperCase(), W - 6 * u - n, (band - label * 1.2) / 2, label, 1.2, ink.yellow)
  const size = OFFPRINT.titleSize * u
  setFont(ctx, 700, size, fonts.body)
  wrap(ctx, sheet.title, 84 * u).forEach((t, i) => line(ctx, t, 8 * u, OFFPRINT.title * u + i * 1.1 * size, size, 1.1, ink.black))
  const author = Math.max(4 * u, 11 * px)
  setFont(ctx, 600, author, fonts.narrow)
  line(ctx, sheet.author, 8 * u, H - stripHeight(u, px) - 4 * u - author * 1.2, author, 1.2, ink.black)
  staples(ctx, H, u)
  paintStrip(ctx, { text: sheet.study.review, short: sheet.study.review, bg: ink.black, fg: ink.paper }, false, W, H, u, px, fonts)
}

// The page under an offprint's cover: the opening of its abstract, then the
// question, the approach and the references. WebGL only; the printed index carries the same facts.
export function paintOffprintInside(canvas: HTMLCanvasElement, sheet: OffprintSheet, width: number, height: number, fonts: Fonts, cssWidth: number) {
  canvas.width = Math.round(width)
  canvas.height = Math.round(height)
  const ctx = canvas.getContext("2d") as Ctx
  const W = canvas.width
  const H = canvas.height
  const u = W / 100
  const px = W / cssWidth
  ctx.fillStyle = ink.paper
  ctx.fillRect(0, 0, W, H)
  const label = Math.max(3.6 * u, 10 * px)
  const text = Math.max(4.2 * u, 11 * px)
  let y = 8 * u
  const block = (head: string, body: string) => {
    if (!body) return
    setFont(ctx, 700, label, fonts.narrow, 0.12)
    line(ctx, head, 8 * u, y, label, 1.2, ink.black)
    y += label * 1.2 + 1.5 * u
    setFont(ctx, 400, text, fonts.body)
    for (const t of wrap(ctx, body, 84 * u)) {
      if (y + text * 1.35 > H - 6 * u) return
      line(ctx, t, 8 * u, y, text, 1.35, ink.black)
      y += text * 1.35
    }
    y += 3.5 * u
  }
  block("ABSTRACT", sheet.abstract)
  block("QUESTION", sheet.study.question)
  block("APPROACH", sheet.study.approach)
  block("REFERENCES", sheet.study.references)
}
