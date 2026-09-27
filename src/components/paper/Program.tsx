import Image from "next/image"
import type { CSSProperties } from "react"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"
import { featured, minor, type Project } from "@/content/work"

// The paper program: everything the wall shouts, set straight in columns.

function Chip({ project }: { project: Project }) {
  return (
    <span className={`chip chip--${project.status.tone}`}>{project.status.label}</span>
  )
}

function Entry({ project }: { project: Project }) {
  const [main, ...rest] = project.shots
  const wide = project.layout === "wide"
  return (
    <article id={`work-${project.id}`} className={`entry entry--${project.layout}`} aria-labelledby={`${project.id}-name`}>
      <div className="entry__media">
        <figure className="entry__main" style={{ aspectRatio: `${main.width} / ${main.height}` }}>
          <Image src={main.src} alt={main.alt} fill sizes={wide ? "(min-width: 1100px) 1040px, 92vw" : "(min-width: 1100px) 600px, 92vw"} style={{ objectFit: "cover" }} />
        </figure>
        {rest.length > 0 && (
          <div className="entry__thumbs" style={{ gridTemplateColumns: `repeat(${rest.length}, minmax(0, 1fr))` }}>
            {rest.map((shot) => (
              <figure key={shot.src} className="entry__thumb">
                <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 1100px) 300px, 45vw" style={{ objectFit: "cover" }} />
              </figure>
            ))}
          </div>
        )}
        {project.caption && <p className="entry__caption">{project.caption}</p>}
      </div>

      <div className="entry__text">
        <h3 id={`${project.id}-name`} className="entry__name" style={{ "--len": project.name.length } as CSSProperties}>
          {project.name}
        </h3>
        <p className="entry__line">{project.line}</p>
        <p className="entry__body">{project.body}</p>
        <p className="entry__body">{project.detail}</p>
        {project.links.length > 0 && (
          <ul className="entry__links">
            {project.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <ArrowUpRight aria-hidden="true" weight="bold" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <dl className="entry__facts">
        <div>
          <dt>Status</dt>
          <dd>
            <Chip project={project} />
            {project.status.note && <span className="entry__note">{project.status.note}</span>}
          </dd>
        </div>
        <div>
          <dt>Kind</dt>
          <dd>{project.kind}, {project.years}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt>Built with</dt>
          <dd>{project.stack.join(", ")}</dd>
        </div>
      </dl>
    </article>
  )
}

export function Program() {
  return (
    <section id="work" className="sheet program" aria-labelledby="work-title">
      <header className="sheet__head">
        <h2 id="work-title" className="sheet__title">
          The work, in print
        </h2>
        <p className="sheet__lede">Every project from the wall, set straight: what it is, where it stands and what I built.</p>
      </header>

      {featured.map((project) => (
        <Entry key={project.id} project={project} />
      ))}

      <section className="minor" aria-labelledby="minor-title">
        <h3 id="minor-title" className="minor__title">
          Also on the bill
        </h3>
        <ul className="minor__list">
          {minor.map((item) => (
            <li key={item.id} id={`work-${item.id}`} className="minor__item">
              <p className="minor__name">{item.name}</p>
              <p className="minor__line">{item.line}</p>
              <p className="minor__meta">
                <span className="chip chip--paper">{item.status}</span>
                <span>
                  {item.years}. {item.stack}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  )
}
