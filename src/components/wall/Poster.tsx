import Image from "next/image"
import type { CSSProperties } from "react"
import { blurbTop, imageLayout, lineupTops, remnantNameSize, type PosterSpec } from "./posters"

// The HTML poster. Positions and sizes are cqw of the poster's own width and
// mirror poster-texture.ts, so the three.js paper can replace it without the
// layout moving. The outer element carries position, rotation and shadow; the
// paper inside carries colour, the torn edge and the content.

type Vars = CSSProperties & Record<`--${string}`, string | number>

const cq = (n: number) => `${n}cqw`

function Strip({ strip }: { strip: { text: string; short: string; bg: string; fg: string } }) {
  return (
    <span className="poster__strip" style={{ background: strip.bg, color: strip.fg }}>
      <span className="strip__long">{strip.text}</span>
      <span className="strip__short" aria-hidden="true">
        {strip.short}
      </span>
    </span>
  )
}

export function Poster({ spec, index }: { spec: PosterSpec; index: number }) {
  const base: Vars = { "--bg": spec.bg, "--i": index }

  if (spec.kind === "remnant") {
    const size = remnantNameSize(spec.name)
    return (
      <div className="poster poster--remnant" data-poster={spec.id} data-static="" aria-hidden="true" style={base}>
        <span className="poster__paper">
          <span className="remnant__name" style={{ color: spec.fg, "--size": cq(size) } as Vars}>
            {spec.name}
          </span>
          <span className="remnant__line" style={{ color: spec.fg, "--top": cq(8 + size * 0.9 + 3) } as Vars}>
            {spec.line}
          </span>
        </span>
      </div>
    )
  }

  if (spec.kind === "headliner") {
    let top = 6
    return (
      <div className="poster poster--headliner" data-poster={spec.id} style={base}>
        <span className="poster__paper">
          <h1 className="poster__name">
            {spec.lines.map((line) => {
              const style = { color: line.color, "--size": cq(line.size), "--top": cq(top) } as Vars
              top += line.size * 0.86
              return (
                <span key={line.text} style={style}>
                  {line.text}
                </span>
              )
            })}
          </h1>
          <p className="poster__blurb" style={{ "--top": cq(blurbTop(spec)) } as Vars}>
            {spec.blurb}
          </p>
          <Strip strip={spec.strip} />
        </span>
      </div>
    )
  }

  if (spec.kind === "image") {
    const full = imageLayout(spec, false)
    const small = imageLayout(spec, true)
    const vars: Vars = {
      ...base,
      "--inset": cq(full.inset),
      "--img-h": cq(full.imageHeight),
      "--c-img-h": cq(small.imageHeight),
      "--c-top": cq(small.titleTop),
      "--c-size": cq(small.titleSize),
      "--c-logo-w": cq(small.logoSize),
      "--c-logo-top": cq(small.logoTop),
    }
    return (
      <a className="poster poster--image" data-poster={spec.id} href={spec.href} aria-label={spec.label} style={vars}>
        <span className="poster__paper">
          <span className={`poster__img${spec.frame ? " poster__img--frame" : ""}`}>
            <Image
              data-role="photo"
              src={spec.image.src}
              alt=""
              fill
              priority
              sizes="(min-width: 1100px) 30vw, (min-width: 700px) 25vw, 50vw"
              style={{ objectFit: "cover", objectPosition: `${spec.image.focusX * 100}% ${spec.image.focusY * 100}%` }}
            />
          </span>
          {spec.logo ? (
            <span className="poster__logo" style={{ "--logo-w": cq(full.logoSize), "--logo-top": cq(full.logoTop) } as Vars}>
              <Image data-role="logo" src={spec.logo.src} alt="" fill sizes="30vw" style={{ objectFit: "contain" }} />
            </span>
          ) : spec.title ? (
            <span className="poster__title" style={{ "--top": cq(full.titleTop), "--size": cq(full.titleSize), color: spec.title.color } as Vars}>
              {spec.title.text}
            </span>
          ) : null}
          <span className="poster__sub" style={{ "--top": cq(full.subTop), color: spec.sub.color } as Vars}>
            {spec.sub.text}
          </span>
          <Strip strip={spec.strip} />
        </span>
      </a>
    )
  }

  if (spec.kind === "lineup") {
    const tops = lineupTops(spec)
    return (
      <a className="poster poster--lineup" data-poster={spec.id} href={spec.href} aria-label={spec.label} style={base}>
        <span className="poster__paper">
          <span className="poster__heading">{spec.heading}</span>
          <span className="poster__lineup">
            {spec.items.map((item, i) => (
              <span key={item.id} className="poster__act" style={{ "--top": cq(tops[i]), "--size": cq(item.size) } as Vars}>
                {item.name}
              </span>
            ))}
          </span>
          <Strip strip={spec.strip} />
        </span>
      </a>
    )
  }

  return (
    <a className="poster poster--flyer" data-poster={spec.id} href={spec.href} aria-label={spec.label} style={base}>
      <span className="poster__paper">
        <span className="poster__flyer-title" style={{ "--size": cq(spec.titleSize) } as Vars}>
          {spec.title.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </span>
        <span className="poster__tabs" aria-hidden="true">
          {Array.from({ length: spec.tabs }, (_, i) => (
            <span key={i}>{spec.tab}</span>
          ))}
        </span>
      </span>
    </a>
  )
}
