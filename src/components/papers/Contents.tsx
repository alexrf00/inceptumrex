export type ContentsEntry = { id: string; n: string; title: string }

// A paper's contents. On desktop it is a column that sticks beside the article;
// under 900px it folds into a closed <details> above it. Both are rendered and
// CSS shows one, so the fold needs no script and the column is never closed.
export function Contents({ entries }: { entries: readonly ContentsEntry[] }) {
  const list = (
    <ol className="pp-toc__list">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a href={`#${entry.id}`}>
            <span className="pp-toc__n">{entry.n}</span>
            <span className="pp-toc__t">{entry.title}</span>
          </a>
        </li>
      ))}
    </ol>
  )
  return (
    <nav className="pp-toc" aria-label="Contents">
      <div className="pp-toc__wide">
        <p className="pp-toc__label">Contents</p>
        {list}
      </div>
      <details className="pp-toc__fold">
        <summary>
          Contents
          <span className="pp-toc__sign" aria-hidden="true" />
        </summary>
        {list}
      </details>
    </nav>
  )
}
