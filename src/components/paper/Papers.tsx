import type { CSSProperties } from "react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { paperHref, papers } from "@/content/papers"
import { ScrollRegion } from "@/components/papers/ScrollRegion"
import { PackageAnatomy } from "@/components/papers/sealed-skills/figures"
// The paper's figure styles: every rule is scoped to the paper's own classes.
import "@/app/papers/papers.css"

// The papers sheet: ideas worked through in writing, each set like a program
// entry, with its findings and its status stated.
export function Papers() {
  return (
    <section id="papers" className="sheet papers" aria-labelledby="papers-title">
      <header className="sheet__head">
        <h2 id="papers-title" className="sheet__title">
          Papers
        </h2>
        <p className="sheet__lede">Ideas worked through in writing. Each paper says what it proposes and how settled it is.</p>
      </header>

      {papers.map((paper) => (
        <article key={paper.slug} className="entry entry--row entry--paper" aria-labelledby={`paper-${paper.slug}`}>
          <div className="entry__text">
            <p className="paper-entry__kind">{paper.kind}</p>
            <h3 id={`paper-${paper.slug}`} className="entry__name" style={{ "--len": paper.title.length } as CSSProperties}>
              {paper.title}
            </h3>
            <p className="entry__line">{paper.subtitle}</p>
            <h4 className="paper-entry__head">What it finds</h4>
            <ol className="paper-entry__findings">
              {paper.findings.map((finding) => (
                <li key={finding.slice(0, 32)}>{finding}</li>
              ))}
            </ol>
            <ul className="entry__links">
              <li>
                <a href={paperHref(paper)}>
                  Read the paper
                  <ArrowRight aria-hidden="true" weight="bold" />
                </a>
              </li>
            </ul>
          </div>

          {paper.slug === "sealed-skills" && (
            <figure className="entry__media">
              <ScrollRegion label="Figure 1 of Sealed Skills, scrolls sideways">
                <PackageAnatomy />
              </ScrollRegion>
              <figcaption className="entry__caption">
                Figure 1 of the paper. Anatomy of a sealed package. Each recipient entry holds the content key wrapped to the public key that provider publishes on its own domain.
              </figcaption>
            </figure>
          )}

          <dl className="entry__facts">
            <div>
              <dt>Status</dt>
              <dd>
                <span className="chip chip--paper">Draft</span>
                <span className="entry__note">{paper.status.toLowerCase()}</span>
              </dd>
            </div>
            <div>
              <dt>Kind</dt>
              <dd>
                {paper.kind}, {paper.date.slice(0, 4)}
              </dd>
            </div>
            <div>
              <dt>Version</dt>
              <dd>
                {paper.version}, {paper.dateLabel}
              </dd>
            </div>
            <div>
              <dt>Topics</dt>
              <dd>{paper.topics.join(", ")}</dd>
            </div>
          </dl>
        </article>
      ))}
    </section>
  )
}
