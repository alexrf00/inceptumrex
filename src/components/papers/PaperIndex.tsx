import type { CSSProperties, ReactNode } from "react"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { categories, paperHref, papersOf, type Paper, type PaperCategory } from "@/content/papers"
import { ScrollRegion } from "./ScrollRegion"
import { PackageAnatomy } from "./sealed-skills/figures"

// The papers screen set straight: one printed sheet per kind, never mixed.
// A paper is set like a program entry with its findings; a research paper
// also carries what a specialist needs to judge it: its question, its
// approach, its references and where it stands.

// A paper's own figure, where it has one worth showing in the list.
const figures: Record<string, { figure: ReactNode; caption: string; label: string }> = {
  "sealed-skills": {
    figure: <PackageAnatomy />,
    label: "Figure from Sealed Skills, scrolls sideways",
    caption: "From the paper's design. Anatomy of a sealed package. Each recipient entry holds the content key wrapped to the public key that provider publishes on its own domain.",
  },
}

function PaperEntry({ paper }: { paper: Paper }) {
  const research = paper.category === "research"
  const fig = figures[paper.slug]
  return (
    <article className="entry entry--row entry--paper" aria-labelledby={`paper-${paper.slug}`}>
      <div className="entry__text">
        <p className="paper-entry__kind">
          {categories[paper.category].one}
          {paper.kind.toLowerCase() !== categories[paper.category].one.toLowerCase() && ` · ${paper.kind}`}
        </p>
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
              Read the {research ? "research paper" : "paper"}
              <ArrowRight aria-hidden="true" weight="bold" />
            </a>
          </li>
        </ul>
      </div>

      {fig && (
        <figure className="entry__media">
          <ScrollRegion label={fig.label}>{fig.figure}</ScrollRegion>
          <figcaption className="entry__caption">{fig.caption}</figcaption>
        </figure>
      )}

      {research && paper.study ? (
        <dl className="entry__facts">
          <div>
            <dt>Status</dt>
            <dd>
              <span className="chip chip--paper">Draft</span>
              <span className="entry__note">{paper.study.review.toLowerCase()}</span>
            </dd>
          </div>
          <div>
            <dt>Question</dt>
            <dd>{paper.study.question}</dd>
          </div>
          <div>
            <dt>Approach</dt>
            <dd>{paper.study.approach}</dd>
          </div>
          <div>
            <dt>References</dt>
            <dd>{paper.study.references}</dd>
          </div>
        </dl>
      ) : (
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
      )}
    </article>
  )
}

function KindSheet({ category, id }: { category: PaperCategory; id: string }) {
  const kind = categories[category]
  const list = papersOf(category)
  return (
    <section id={id} className={`sheet papers papers--${category}`} aria-labelledby={`${id}-title`}>
      <header className="sheet__head">
        <p className="papers__kind">{category === "paper" ? "Kind one" : "Kind two"}</p>
        <h2 id={`${id}-title`} className="sheet__title">
          {kind.title}
        </h2>
        <p className="sheet__lede">{kind.definition}</p>
      </header>
      {list.length ? list.map((paper) => <PaperEntry key={paper.slug} paper={paper} />) : <p className="papers__empty">{kind.empty}</p>}
    </section>
  )
}

export function PaperIndex() {
  return (
    <>
      <KindSheet category="paper" id="index" />
      <KindSheet category="research" id="research" />
    </>
  )
}
