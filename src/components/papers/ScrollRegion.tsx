import type { ReactNode } from "react"

// A figure, table or listing wider than a phone scrolls sideways inside this
// frame instead of pushing the page wide. It is focusable and named, so a
// keyboard can scroll it too (WCAG 2.1.1).
export function ScrollRegion({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className ? `pp-scroll ${className}` : "pp-scroll"} tabIndex={0} role="region" aria-label={label}>
      {children}
    </div>
  )
}
