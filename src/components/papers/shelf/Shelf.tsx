import type { CSSProperties } from "react"
import { OFFPRINT, broadsideTops, headTops, noticeTops, shelfSheets, type ShelfSheet } from "./sheets"
import { ShelfGL } from "./ShelfGL"

// The papers wall: every paper pasted up on the plywood, before the printed
// index below. Each HTML sheet is the link, the text and the no-WebGL wall;
// where WebGL runs, three.js paints its paper twin over it. Positions are cqw
// of the sheet's own width and mirror shelf-texture.ts.

type Vars = CSSProperties & Record<`--${string}`, string | number>

const cq = (n: number) => `${n}cqw`

function Strip({ strip }: { strip: { text: string; short: string; bg: string; fg: string } }) {
  return (
    <span className="sh__strip" style={{ background: strip.bg, color: strip.fg }}>
      <span className="sh__strip-long">{strip.text}</span>
      <span className="sh__strip-short" aria-hidden="true">
        {strip.short}
      </span>
    </span>
  )
}

function Sheet({ sheet, index }: { sheet: ShelfSheet; index: number }) {
  const base: Vars = { "--i": index }

  if (sheet.kind === "head") {
    const tops = headTops(sheet)
    return (
      <div className="sh sh--head" data-sheet={sheet.id} style={{ ...base, "--bg": sheet.bg } as Vars}>
        <span className="sh__paper">
          <h1 id="shelf-title" className="sh__name">
            {sheet.lines.map((l, i) => (
              <span key={l.text} style={{ color: l.color, "--size": cq(l.size), "--top": cq(tops.lines[i]) } as Vars}>
                {l.text}
              </span>
            ))}
          </h1>
          <p className="sh__blurb" style={{ "--top": cq(tops.blurb) } as Vars}>
            {sheet.blurb}
          </p>
          <Strip strip={sheet.strip} />
        </span>
      </div>
    )
  }

  if (sheet.kind === "broadside") {
    const tops = broadsideTops(sheet)
    return (
      <a className="sh sh--broadside" data-sheet={sheet.id} href={sheet.href} aria-label={sheet.label} draggable={false} style={{ ...base, "--bg": sheet.bg, color: sheet.fg } as Vars}>
        <span className="sh__paper">
          <span className="sh__eyebrow" style={{ "--top": cq(tops.eyebrow) } as Vars}>
            {sheet.eyebrow}
          </span>
          {sheet.lines.map((l, i) => (
            <span key={l.text} className="sh__wood" style={{ "--size": cq(l.size), "--top": cq(tops.lines[i]) } as Vars}>
              {l.text}
            </span>
          ))}
          <span className="sh__line" style={{ "--top": cq(tops.line) } as Vars}>
            {sheet.line}
          </span>
          <span className="sh__date">{sheet.date}</span>
          <Strip strip={sheet.strip} />
        </span>
      </a>
    )
  }

  if (sheet.kind === "notice") {
    const tops = noticeTops(sheet)
    return (
      <a className="sh sh--notice" data-sheet={sheet.id} href={sheet.href} aria-label={sheet.label} draggable={false} style={{ ...base, "--bg": sheet.bg, color: sheet.fg } as Vars}>
        <span className="sh__paper">
          {sheet.lines.map((l, i) => (
            <span key={l.text} className="sh__wood" style={{ "--size": cq(l.size), "--top": cq(tops.lines[i]) } as Vars}>
              {l.text}
            </span>
          ))}
          <span className="sh__line" style={{ "--top": cq(tops.line) } as Vars}>
            {sheet.line}
          </span>
          <Strip strip={sheet.strip} />
        </span>
      </a>
    )
  }

  return (
    <a className="sh sh--offprint" data-sheet={sheet.id} href={sheet.href} aria-label={sheet.label} draggable={false} style={base}>
      <span className="sh__paper">
        <span className="sh__band" style={{ "--band": cq(OFFPRINT.band) } as Vars}>
          <span>Research paper</span>
          <span>{sheet.number}</span>
        </span>
        <span className="sh__otitle" style={{ "--top": cq(OFFPRINT.title), "--size": cq(OFFPRINT.titleSize) } as Vars}>
          {sheet.title}
        </span>
        <span className="sh__author">{sheet.author}</span>
        {OFFPRINT.staples.map((at) => (
          <span key={at} className="sh__staple" style={{ "--at": `${at * 100}%` } as Vars} aria-hidden="true" />
        ))}
        <Strip strip={{ text: sheet.study.review, short: sheet.study.review, bg: "var(--black)", fg: "var(--paper)" }} />
      </span>
    </a>
  )
}

// Before the sheets are parsed, hide them for their paste-up if the three.js
// paper is likely to run; if it has not started within 3.5s, show them.
const PENDING = "(function(){var s=document.currentScript&&document.currentScript.parentElement;if(!s)return;var c=navigator.connection;if((window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)||(c&&c.saveData))return;s.setAttribute('data-gl','pending');setTimeout(function(){if(s.getAttribute('data-gl')==='pending')s.removeAttribute('data-gl')},3500)})()"

export function Shelf() {
  const sheets = shelfSheets()
  return (
    // The script sets data-gl before hydration, so React is told to expect it.
    <section className="shelf" data-shelf aria-labelledby="shelf-title" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: PENDING }} />
      <div className="shelf__stage">
        {sheets.map((sheet, i) => (
          <Sheet key={sheet.id} sheet={sheet} index={i} />
        ))}
      </div>
      <ShelfGL />
    </section>
  )
}
