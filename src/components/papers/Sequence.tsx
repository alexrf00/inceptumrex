import type { ReactNode } from "react"

// A sequence diagram drawn on the server as a static SVG, from data: participant
// heads across the top, dashed lifelines, one row per message. A paper can carry
// one without shipping a diagram library to the browser. The SVG is one image
// with a label; the same steps follow it as a list for screen readers.

export type SequenceParticipant = { id: string; label: string }

export type SequenceMessage =
  | { kind: "sync" | "reply" | "self"; from: string; to: string; text: string }
  | { kind: "note"; over: [string, string]; text: string }

type Font = { size: number; weight: 400 | 600 }

// Advance widths of Archivo (the site's --font-body) for ASCII 32 to 126, in
// thousandths of an em, measured from the font the site serves. Labels wrap
// against these, so a label never runs across a lifeline.
const ADVANCE: Record<Font["weight"], number[]> = {
  400: "209 273 374 582 510 950 692 209 355 355 407 625 277 333 277 294 573 521 567 573 555 571 573 553 574 573 296 296 625 625 625 578 1005 682 698 728 734 677 612 796 736 267 559 662 536 847 736 788 665 788 727 673 606 731 648 924 680 655 635 296 294 296 625 485 187 545 567 519 567 548 280 556 563 225 223 514 225 860 563 570 567 567 332 510 297 562 504 723 513 504 498 353 245 353 625"
    .split(" ")
    .map(Number),
  600: "200 292 444 583 541 966 729 246 357 357 407 636 300 333 300 298 575 576 576 576 577 575 576 576 576 575 336 336 636 636 636 613 998 709 706 721 728 672 609 794 732 282 585 695 570 844 732 782 670 782 717 667 619 724 671 954 686 677 634 339 298 339 636 507 209 556 592 547 592 561 307 591 584 252 250 543 252 861 584 598 592 592 362 541 314 583 529 758 546 529 509 394 245 394 636"
    .split(" ")
    .map(Number),
}

const LABEL: Font = { size: 12, weight: 400 }
const HEAD: Font = { size: 13, weight: 600 }
const NOTE: Font = { size: 12, weight: 600 }

const PAD = 8 // margin around the drawing
const LINE = 15 // line pitch of labels and notes
const HEAD_LINE = 16 // line pitch inside a participant head
const BASE = 11 // baseline offset inside a line
const HEAD_W = 144
const HEAD_PAD = 9
const CLEAR = 10 // clearance between a label and a lifeline
const TIP = 8 // arrowhead length
const LOOP_W = 26 // self-message loop
const LOOP_H = 16
const ROW_GAP = 14
const NOTE_OUT = 48 // how far a note reaches past its outer lifelines

const round = (v: number) => Math.round(v * 10) / 10

function measure(text: string, font: Font) {
  const table = ADVANCE[font.weight]
  let em = 0
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    em += code >= 32 && code <= 126 ? table[code - 32] : 620
  }
  return (em / 1000) * font.size
}

function wrapAt(words: string[], max: number, font: Font) {
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (line && measure(next, font) > max) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

// The narrowest width at which the text still wraps into `lines` lines or fewer.
function fitWidth(text: string, lines: number, font: Font) {
  const words = text.split(" ")
  let lo = Math.max(...words.map((w) => measure(w, font)))
  let hi = measure(text, font)
  if (wrapAt(words, lo, font).length <= lines) return lo
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2
    if (wrapAt(words, mid, font).length <= lines) hi = mid
    else lo = mid
  }
  return hi
}

// As few lines as fit in `max`, then as even as those lines can be.
function wrap(text: string, max: number, font: Font) {
  const count = wrapAt(text.split(" "), max, font).length
  return wrapAt(text.split(" "), Math.min(max, fitWidth(text, count, font)), font)
}

type Box = { x1: number; x2: number; y1: number; y2: number }

// A lifeline stops where a note or a label that spans several lifelines crosses it.
function lifeline(x: number, from: number, to: number, boxes: Box[]) {
  const cuts = boxes
    .filter((b) => b.x1 <= x && x <= b.x2)
    .map((b) => [b.y1 - 3, b.y2 + 3])
    .sort((p, q) => p[0] - q[0])
  const parts: [number, number][] = []
  let y = from
  for (const [c1, c2] of cuts) {
    if (c1 > y) parts.push([y, c1])
    y = Math.max(y, c2)
  }
  if (y < to) parts.push([y, to])
  return parts
}

type LinesProps = { x: number; top: number; lines: string[]; anchor: "start" | "middle"; className: string; font: Font }

function Lines({ x, top, lines, anchor, className, font }: LinesProps) {
  return (
    <text className={className} textAnchor={anchor} fontSize={font.size} fontWeight={font.weight}>
      {lines.map((line, k) => (
        <tspan key={k} x={round(x)} y={round(top + BASE + k * LINE)}>
          {k < lines.length - 1 ? `${line} ` : line}
        </tspan>
      ))}
    </text>
  )
}

function describe(m: SequenceMessage, name: (id: string) => string) {
  switch (m.kind) {
    case "note":
      return `Note over ${name(m.over[0])} and ${name(m.over[1])}: ${m.text}`
    case "self":
      return `${name(m.from)}, to itself: ${m.text}`
    case "reply":
      return `${name(m.from)} replies to ${name(m.to)}: ${m.text}`
    default:
      return `${name(m.from)} to ${name(m.to)}: ${m.text}`
  }
}

type Props = {
  participants: SequenceParticipant[]
  messages: SequenceMessage[]
  // The SVG's accessible name.
  label: string
  // Width of the drawing in SVG units; it grows only if the heads cannot fit.
  width?: number
}

export function Sequence({ participants, messages, label, width = 720 }: Props) {
  const count = participants.length
  const column = new Map(participants.map((p, i) => [p.id, i]))
  const at = (id: string) => {
    const i = column.get(id)
    if (i === undefined) throw new Error(`Sequence: unknown participant "${id}"`)
    return i
  }
  const name = (id: string) => participants[at(id)].label

  // Columns. Each gap between neighbouring lifelines is made wide enough for
  // the labels drawn in it (on at most two lines), then the gaps are stretched
  // or squeezed so the drawing fills its width.
  const least = HEAD_W + 16
  const gaps = Array.from({ length: Math.max(count - 1, 0) }, () => least)
  let tail = HEAD_W / 2
  for (const m of messages) {
    if (m.kind === "note") continue
    const a = at(m.from)
    if (m.kind === "self") {
      const need = LOOP_W + 2 * CLEAR + fitWidth(m.text, 2, LABEL)
      if (a < count - 1) gaps[a] = Math.max(gaps[a], need)
      else tail = Math.max(tail, need)
      continue
    }
    const b = at(m.to)
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    const need = fitWidth(m.text, hi - lo > 1 ? 1 : 2, LABEL) + 2 * CLEAR
    const have = gaps.slice(lo, hi).reduce((s, g) => s + g, 0)
    if (need > have) for (let g = lo; g < hi; g++) gaps[g] += (need - have) / (hi - lo)
  }
  const used = 2 * PAD + HEAD_W / 2 + tail + gaps.reduce((s, g) => s + g, 0)
  if (used < width && gaps.length) {
    for (let g = 0; g < gaps.length; g++) gaps[g] += (width - used) / gaps.length
  } else if (used > width) {
    const slack = gaps.reduce((s, g) => s + g - least, 0)
    const keep = slack > 0 ? Math.max(0, 1 - (used - width) / slack) : 0
    for (let g = 0; g < gaps.length; g++) gaps[g] = least + (gaps[g] - least) * keep
  }
  const w = Math.max(width, 2 * PAD + HEAD_W / 2 + tail + gaps.reduce((s, g) => s + g, 0))
  const xs = [PAD + HEAD_W / 2]
  for (const g of gaps) xs.push(xs[xs.length - 1] + g)

  // Heads.
  const heads = participants.map((p) => wrap(p.label, HEAD_W - 2 * CLEAR, HEAD))
  const headH = Math.max(...heads.map((l) => l.length)) * HEAD_LINE + 2 * HEAD_PAD
  const lines: ReactNode[] = []
  const tips: ReactNode[] = []
  const texts: ReactNode[] = []
  const knock: Box[] = []

  participants.forEach((p, i) => {
    const x = xs[i] - HEAD_W / 2
    lines.push(<rect key={`h${p.id}`} className="pp-seq-head" x={round(x)} y={PAD} width={HEAD_W} height={headH} />)
    const top = PAD + (headH - heads[i].length * HEAD_LINE) / 2
    texts.push(
      <text key={`h${p.id}`} className="pp-seq-head-text" textAnchor="middle" fontSize={HEAD.size} fontWeight={HEAD.weight}>
        {heads[i].map((line, k) => (
          <tspan key={k} x={round(xs[i])} y={round(top + 12 + k * HEAD_LINE)}>
            {k < heads[i].length - 1 ? `${line} ` : line}
          </tspan>
        ))}
      </text>,
    )
  })

  // Rows, top to bottom.
  let y = PAD + headH + 20
  messages.forEach((m, i) => {
    if (m.kind === "note") {
      const [a, b] = m.over.map(at)
      const x1 = Math.max(PAD, Math.min(xs[a], xs[b]) - NOTE_OUT)
      const x2 = Math.min(w - PAD, Math.max(xs[a], xs[b]) + NOTE_OUT)
      const text = wrap(m.text, x2 - x1 - 2 * CLEAR, NOTE)
      const h = text.length * LINE + 12
      lines.push(<rect key={i} className="pp-seq-note" x={round(x1)} y={round(y)} width={round(x2 - x1)} height={h} strokeWidth={1} />)
      texts.push(<Lines key={i} className="pp-seq-note-text" x={(x1 + x2) / 2} top={y + 6} lines={text} anchor="middle" font={NOTE} />)
      knock.push({ x1, x2, y1: y, y2: y + h })
      y += h + ROW_GAP
      return
    }

    const a = at(m.from)
    if (m.kind === "self") {
      const x = xs[a]
      const right = a < count - 1 ? xs[a + 1] : w - PAD
      const left = x + LOOP_W + CLEAR
      const text = wrap(m.text, right - CLEAR - left, LABEL)
      const block = Math.max(LOOP_H + 6, text.length * LINE)
      const mid = y + block / 2
      const top = mid - LOOP_H / 2
      const bottom = mid + LOOP_H / 2
      lines.push(<path key={i} className="pp-seq-msg" d={`M${round(x)} ${round(top)}H${round(x + LOOP_W)}V${round(bottom)}H${round(x + TIP)}`} />)
      tips.push(<polygon key={i} className="pp-seq-tip" points={`${round(x)},${round(bottom)} ${round(x + TIP)},${round(bottom - 4)} ${round(x + TIP)},${round(bottom + 4)}`} />)
      texts.push(<Lines key={i} className="pp-seq-label" x={left} top={mid - (text.length * LINE) / 2} lines={text} anchor="start" font={LABEL} />)
      y += block + ROW_GAP
      return
    }

    const b = at(m.to)
    const x1 = xs[a]
    const x2 = xs[b]
    const dir = x2 >= x1 ? 1 : -1
    const text = wrap(m.text, Math.abs(x2 - x1) - 2 * CLEAR, LABEL)
    const mid = (x1 + x2) / 2
    const arrow = y + (text.length - 1) * LINE + BASE + 7
    texts.push(<Lines key={i} className="pp-seq-label" x={mid} top={y} lines={text} anchor="middle" font={LABEL} />)
    lines.push(
      <line
        key={i}
        className={m.kind === "reply" ? "pp-seq-msg pp-seq-msg--reply" : "pp-seq-msg"}
        x1={round(x1)}
        y1={round(arrow)}
        x2={round(x2 - dir * TIP)}
        y2={round(arrow)}
        strokeDasharray={m.kind === "reply" ? "6 4" : undefined}
      />,
    )
    tips.push(<polygon key={i} className="pp-seq-tip" points={`${round(x2)},${round(arrow)} ${round(x2 - dir * TIP)},${round(arrow - 4)} ${round(x2 - dir * TIP)},${round(arrow + 4)}`} />)
    if (Math.abs(b - a) > 1) {
      const half = Math.max(...text.map((l) => measure(l, LABEL))) / 2 + 4
      knock.push({ x1: mid - half, x2: mid + half, y1: y, y2: y + text.length * LINE })
    }
    y = arrow + ROW_GAP + 4
  })

  const end = y - ROW_GAP + 10
  const h = end + PAD
  const lifelines = xs.flatMap((x, i) =>
    lifeline(x, PAD + headH, end, knock).map(([y1, y2]) => (
      <line key={`${i}-${round(y1)}`} className="pp-seq-life" x1={round(x)} y1={round(y1)} x2={round(x)} y2={round(y2)} />
    )),
  )

  return (
    <>
      <svg className="pp-svg pp-seq" viewBox={`0 0 ${round(w)} ${round(h)}`} role="img" aria-label={label}>
        <g fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="3 4">
          {lifelines}
        </g>
        <g fill="none" stroke="currentColor" strokeWidth={1.5}>
          {lines}
        </g>
        <g fill="currentColor">{tips}</g>
        <g fill="currentColor">{texts}</g>
      </svg>
      <ol className="sr-only">
        {messages.map((m, i) => (
          <li key={i}>{describe(m, name)}</li>
        ))}
      </ol>
    </>
  )
}
