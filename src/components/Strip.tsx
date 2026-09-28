// The sniping strip: a long black bill pasted across the top of the wall,
// carrying the studio name and the site's four destinations: three sections of
// the home page and the papers screen, written so they work from any page.
export function Strip() {
  return (
    <header className="strip">
      <a className="strip__mark" href="/#top" aria-label="InceptumRex, back to the wall">
        {/* The owner's emblem, as supplied; the wordmark stays in the wall's stencil face. */}
        <img className="strip__emblem" src="/brand/inceptumrex-mark.svg" alt="" width={34} height={34} />
        <span>InceptumRex</span>
      </a>
      <nav aria-label="Primary">
        <ul className="strip__nav">
          <li>
            <a href="/#work">Work</a>
          </li>
          <li>
            <a href="/papers">Papers</a>
          </li>
          <li>
            <a href="/#about">About</a>
          </li>
          <li>
            <a href="/#contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
