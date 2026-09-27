import type { ReactNode } from "react"
import "./papers.css"

// Papers share the site's shell (strip, wall ground, foot); this layout only
// brings in the print styles for a paper's sheet.
export default function PapersLayout({ children }: { children: ReactNode }) {
  return children
}
