import { COMPACT, blurbTop, imageLayout, lineupTops, remnantNameSize, type BillSpec, type ImagePoster, type OlderBill } from "./posters"

// Paints a bill onto a canvas for the three.js paper. Every number here is the
// same cqw value Poster.tsx and the .poster rules in globals.css use, and every
// pixel floor is the same CSS max() floor, computed from the poster's css width.

export type Fonts = { display: string; narrow: string; body: string }

export function readFonts(): Fonts {
  const css = getComputedStyle(document.documentElement)
  return {
    display: css.getPropertyValue("--font-display").trim() || "sans-serif",
    narrow: css.getPropertyValue("--font-narrow").trim() || "sans-serif",
    body: css.getPropertyValue("--font-body").trim() || "sans-serif",
  }
}

export async function loadFonts(f: Fonts) {
  await Promise.all([
    document.fonts.load(`900 40px ${f.display}`),
    document.fonts.load(`800 40px ${f.display}`),
    document.fonts.load(`600 40px ${f.narrow}`),
    document.fonts.load(`700 40px ${f.narrow}`),
    document.fonts.load(`700 40px ${f.body}`),
  ])
}

export type PosterImages = { photo?: HTMLImageElement; logo?: HTMLImageElement }

// A srcset <img> reports a density-corrected naturalWidth while drawImage reads
// real pixels, so textures are painted from plain Image() loads of the same URL.
export async function loadPosterImages(el: HTMLElement): Promise<PosterImages> {
  const load = async (role: "photo" | "logo") => {
    const tag = el.querySelector<HTMLImageElement>(`img[data-role="${role}"]`)
    if (!tag) return undefined
    const img = new Image()
    img.decoding = "async"
    img.src = tag.currentSrc || tag.src
    try {
      await img.decode()
      return img
    } catch {
      return undefined
    }
  }
  const [photo, logo] = await Promise.all([load("photo"), load("logo")])
  return { photo, logo }
}

async function loadImage(src: string) {
  const img = new Image()
  img.decoding = "async"
  img.src = src
  try {
    await img.decode()
    return img
  } catch {
    return undefined
  }
}

// A bill pasted under another has no HTML twin, so its prints load straight
// from their files.
export async function loadImageSet(spec: Omit<ImagePoster, "under">): Promise<PosterImages> {
  const [photo, logo] = await Promise.all([loadImage(spec.image.src), spec.logo ? loadImage(spec.logo.src) : undefined])
  return { photo, logo }
}

export type Ctx = CanvasRenderingContext2D & { letterSpacing?: string }

export function setFont(ctx: Ctx, weight: number, size: number, family: string, tracking = 0) {
  ctx.font = `${weight} ${size}px ${family}`
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${tracking * size}px`
}

// Draws one line of text whose CSS line box starts at `top`, matching how the
// browser places the baseline inside a line box of `lineHeight`.
export function line(ctx: Ctx, text: string, x: number, top: number, size: number, lineHeight: number, color: string) {
  const m = ctx.measureText("Hg")
  const ascent = m.fontBoundingBoxAscent ?? size * 0.8
  const descent = m.fontBoundingBoxDescent ?? size * 0.2
  ctx.fillStyle = color
  ctx.textAlign = "left"
  ctx.textBaseline = "alphabetic"
  ctx.fillText(text, x, top + (lineHeight * size - (ascent + descent)) / 2 + ascent)
}

export function wrap(ctx: Ctx, text: string, maxWidth: number) {
  const lines: string[] = []
  let current = ""
  for (const word of text.split(" ")) {
    const next = current ? `${current} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function cover(ctx: Ctx, img: HTMLImageElement, x: number, y: number, w: number, h: number, fx: number, fy: number) {
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  const scale = Math.max(w / iw, h / ih)
  const sw = w / scale
  const sh = h / scale
  const sx = Math.min(Math.max(iw * fx - sw / 2, 0), iw - sw)
  const sy = Math.min(Math.max(ih * fy - sh / 2, 0), ih - sh)
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

export type StripSpec = { text: string; short: string; bg: string; fg: string }

// The strip: height max(11cqw, 28px) and text max(4.6cqw, 12px); compact
// bills use max(11cqw, 24px) and max(5cqw, 11px) with the short text.
export function paintStrip(ctx: Ctx, s: StripSpec, small: boolean, W: number, H: number, u: number, px: number, fonts: Fonts) {
  const h = small ? Math.max(11 * u, 24 * px) : Math.max(11 * u, 28 * px)
  const size = small ? Math.max(5 * u, 11 * px) : Math.max(4.6 * u, 12 * px)
  ctx.fillStyle = s.bg
  ctx.fillRect(0, H - h, W, h)
  setFont(ctx, 800, size, fonts.display, 0.05)
  line(ctx, (small ? s.short : s.text).toUpperCase(), 6 * u, H - h, size, h / size, s.fg)
  return h
}

export function paintPoster(canvas: HTMLCanvasElement, images: PosterImages, spec: BillSpec, width: number, height: number, fonts: Fonts, cssWidth: number) {
  canvas.width = Math.round(width)
  canvas.height = Math.round(height)
  const ctx = canvas.getContext("2d") as Ctx
  const W = canvas.width
  const H = canvas.height
  const u = W / 100
  const px = W / cssWidth
  const compact = cssWidth < COMPACT
  const strip = (s: StripSpec, small: boolean) => paintStrip(ctx, s, small, W, H, u, px, fonts)

  ctx.fillStyle = spec.bg
  ctx.fillRect(0, 0, W, H)

  if (spec.kind === "older") paintOlder(ctx, spec, W, H, u, px, compact, fonts)

  if (spec.kind === "remnant") {
    const size = remnantNameSize(spec.name) * u
    setFont(ctx, 900, size, fonts.display)
    line(ctx, spec.name.toUpperCase(), 6 * u, 8 * u, size, 0.9, spec.fg)
    setFont(ctx, 600, 8 * u, fonts.narrow)
    line(ctx, spec.line, 6 * u, 8 * u + size * 0.9 + 3 * u, 8 * u, 1.2, spec.fg)
  }

  if (spec.kind === "headliner") {
    let top = 6 * u
    for (const l of spec.lines) {
      const size = l.size * u
      setFont(ctx, 900, size, fonts.display, -0.005)
      line(ctx, l.text.toUpperCase(), 6 * u, top, size, 0.86, l.color)
      top += 0.86 * size
    }
    const size = Math.max(4.6 * u, 13 * px)
    setFont(ctx, 600, size, fonts.narrow)
    wrap(ctx, spec.blurb, 84 * u).forEach((t, i) => line(ctx, t, 6 * u, blurbTop(spec) * u + i * 1.28 * size, size, 1.28, "#f4f4ef"))
    strip(spec.strip, false)
  }

  if (spec.kind === "image") {
    const layout = imageLayout(spec, compact)
    const x = layout.inset * u
    const w = W - 2 * x
    const h = layout.imageHeight * u
    if (images.photo?.naturalWidth) cover(ctx, images.photo, x, x, w, h, spec.image.focusX, spec.image.focusY)
    if (spec.frame) {
      ctx.strokeStyle = "#121212"
      ctx.lineWidth = 0.4 * u
      ctx.strokeRect(x + 0.2 * u, x + 0.2 * u, w - 0.4 * u, h - 0.4 * u)
    }
    if (spec.logo) {
      const lw = layout.logoSize * u
      if (images.logo?.naturalWidth) ctx.drawImage(images.logo, (W - lw) / 2, layout.logoTop * u, lw, layout.logoH * u)
    } else if (spec.title) {
      const size = layout.titleSize * u
      setFont(ctx, 900, size, fonts.display, -0.005)
      line(ctx, spec.title.text.toUpperCase(), 6 * u, layout.titleTop * u, size, 0.92, spec.title.color)
    }
    if (!compact) {
      const size = Math.max(4.6 * u, 12 * px)
      setFont(ctx, 600, size, fonts.narrow)
      line(ctx, spec.sub.text, 6 * u, layout.subTop * u, size, 1.2, spec.sub.color)
    }
    strip(spec.strip, compact)
  }

  if (spec.kind === "lineup") {
    setFont(ctx, 900, 9 * u, fonts.display)
    line(ctx, spec.heading.toUpperCase(), 6 * u, 6 * u, 9 * u, 1, "#121212")
    const tops = lineupTops(spec)
    spec.items.forEach((item, i) => {
      const size = item.size * u
      setFont(ctx, 800, size, fonts.display)
      line(ctx, item.name.toUpperCase(), 6 * u, tops[i] * u, size, 1.02, "#121212")
    })
    strip(spec.strip, false)
  }

  if (spec.kind === "flyer") {
    const size = spec.titleSize * u
    setFont(ctx, 900, size, fonts.display)
    spec.title.forEach((t, i) => line(ctx, t.toUpperCase(), 8 * u, 8 * u + i * 0.9 * size, size, 0.9, "#121212"))
    const tabTop = H * 0.58
    const tw = W / spec.tabs
    ctx.strokeStyle = "#121212"
    ctx.lineWidth = 0.35 * u
    ctx.setLineDash([1.6 * u, 1.2 * u])
    ctx.beginPath()
    ctx.moveTo(0, tabTop)
    ctx.lineTo(W, tabTop)
    for (let i = 1; i < spec.tabs; i++) {
      ctx.moveTo(i * tw, tabTop)
      ctx.lineTo(i * tw, H)
    }
    ctx.stroke()
    ctx.setLineDash([])
    // Same rule as the HTML: min(7cqw, 4cqh).
    setFont(ctx, 600, Math.min(7 * u, 0.04 * H), fonts.narrow)
    for (let i = 0; i < spec.tabs; i++) {
      ctx.save()
      ctx.translate(i * tw + tw / 2, tabTop + (H - tabTop) / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillStyle = "#121212"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(spec.tab, 0, 0)
      ctx.restore()
    }
  }
}

// An older bill: its name in wood type, each line fitted to 88cqw of the bill
// (at most 30cqw, and smaller if the lines would crowd the print), one line of
// print and a strip. There is no HTML twin, so the painter measures the face
// itself instead of estimating it.
function paintOlder(ctx: Ctx, bill: OlderBill, W: number, H: number, u: number, px: number, compact: boolean, fonts: Fonts) {
  const printSize = Math.max(4.6 * u, 12 * px)
  const stripH = compact ? Math.max(11 * u, 24 * px) : Math.max(11 * u, 28 * px)
  const top = 6 * u
  const room = H - stripH - top - (compact ? 5 * u : 3 * u + printSize * 1.2 + 6 * u)
  setFont(ctx, 900, 20 * u, fonts.display, -0.005)
  let sizes = bill.lines.map((l) => Math.min((88 * u * 20 * u) / ctx.measureText(l.toUpperCase()).width, 30 * u))
  const block = sizes.reduce((sum, v) => sum + v * 0.86, 0)
  if (block > room) sizes = sizes.map((v) => (v * room) / block)
  let y = top
  bill.lines.forEach((l, i) => {
    setFont(ctx, 900, sizes[i], fonts.display, -0.005)
    line(ctx, l.toUpperCase(), 6 * u, y, sizes[i], 0.86, bill.fg)
    y += sizes[i] * 0.86
  })
  if (!compact) {
    setFont(ctx, 600, printSize, fonts.narrow)
    line(ctx, bill.line, 6 * u, y + 3 * u, printSize, 1.2, bill.fg)
  }
  paintStrip(ctx, bill.strip, compact, W, H, u, px, fonts)
}
