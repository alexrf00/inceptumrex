import type { ReactNode } from "react"
import { Strip } from "@/components/Strip"
import { Foot } from "@/components/Foot"
import "./babycloset.css"

// Baby Closet's App Store pages (privacy policy and support): the site's shell
// around one printed sheet of plain, readable text.
export default function BabyClosetLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#sheet">
        Skip to the text
      </a>
      <Strip />
      <main id="top" className="bc">
        <article id="sheet" className="bc__sheet">
          {children}
        </article>
      </main>
      <Foot />
    </>
  )
}
