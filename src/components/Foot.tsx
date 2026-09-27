import { person } from "@/content/work"

export function Foot() {
  return (
    <footer className="foot">
      {/* The full logo lockup, printed on a label pasted to the wall: its black type needs a light ground. */}
      <p className="foot__label">
        <img src="/brand/inceptumrex-logo.svg" alt="InceptumRex" width={720} height={220} />
      </p>
      <p className="foot__line">
        {person.name}, {new Date().getFullYear()}. Every poster on this wall is a real project.
      </p>
      <ul className="foot__links">
        <li>
          <a href={person.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={`mailto:${person.email}`}>{person.email}</a>
        </li>
      </ul>
    </footer>
  )
}
