import Image from "next/image"
import { EnvelopeSimple, FilePdf, GithubLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr"
import { person, resume } from "@/content/work"
import { ResumeRoll } from "./ResumeRoll"

// The résumé sheet: one printed page about the person behind the wall. The
// stage wrapper lets the three.js roll hang past the sheet while the sheet
// itself is revealed under it.
export function Resume() {
  return (
    <div className="resume-stage">
      <section id="about" className="sheet resume" aria-labelledby="about-title">
        <div className="resume__side">
          <figure className="resume__photo">
            <Image src="/work/alex.webp" alt="Alex M. Rodriguez in a red cap, resting beside a sleeping black pug" fill sizes="(min-width: 900px) 320px, 70vw" style={{ objectFit: "cover", objectPosition: "50% 40%" }} />
          </figure>
          <ul className="resume__links">
            <li>
              <a href={person.resume} download>
                <FilePdf aria-hidden="true" weight="bold" />
                Download résumé (PDF)
              </a>
            </li>
            <li>
              <a href={person.github} target="_blank" rel="noopener noreferrer">
                <GithubLogo aria-hidden="true" weight="bold" />
                github.com/alexrf00
              </a>
            </li>
            <li>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinLogo aria-hidden="true" weight="bold" />
                LinkedIn
              </a>
            </li>
            <li>
              <a href={`mailto:${person.email}`}>
                <EnvelopeSimple aria-hidden="true" weight="bold" />
                {person.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="resume__main">
          <h2 id="about-title" className="sheet__title">
            {person.name}
          </h2>
          <p className="resume__role">{resume.role}</p>
          {resume.bio.map((p) => (
            <p key={p.slice(0, 24)} className="resume__bio">
              {p}
            </p>
          ))}

          <h3 className="resume__head">Experience</h3>
          <ol className="resume__rows">
            {resume.experience.map((job) => (
              <li key={`${job.org}-${job.when}`}>
                <span className="resume__when">{job.when}</span>
                <div className="resume__what">
                  <p>
                    <strong>{job.role}</strong>, {job.org}
                    <span className="resume__place">, {job.place}</span>
                  </p>
                  <ul className="resume__points">
                    {job.points.map((point) => (
                      <li key={point.slice(0, 32)}>{point}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <h3 className="resume__head">Skills</h3>
          <dl className="resume__skills">
            {resume.skills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>

          <h3 className="resume__head">Education</h3>
          <ol className="resume__rows">
            {resume.education.map((ed) => (
              <li key={ed.what}>
                <span className="resume__when">{ed.when}</span>
                <p className="resume__what">
                  <strong>{ed.what}</strong>, {ed.where}
                </p>
              </li>
            ))}
          </ol>

          <h3 className="resume__head">Certificates</h3>
          <ol className="resume__rows">
            {resume.certificates.map((c) => (
              <li key={c.what}>
                <span className="resume__when">{c.when}</span>
                <p className="resume__what">
                  {c.what}, <span className="resume__by">{c.by}</span>
                </p>
              </li>
            ))}
          </ol>

          <h3 className="resume__head">Languages</h3>
          <p className="resume__lang">{resume.languages}</p>
        </div>
      </section>
      <ResumeRoll />
    </div>
  )
}
