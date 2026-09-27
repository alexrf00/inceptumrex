import type { ReactNode } from "react"
import { ScrollRegion } from "./ScrollRegion"

// A code listing, highlighted the way a printer would: keywords bold, strings
// in long-copy ink, comments in grey italics. One pass, left to right, so a
// keyword inside a string or a comment stays part of it.

type Lang = "json" | "python"

// Group 1 is a comment, group 2 a string (or, in Python, a number literal),
// group 3 a keyword.
const TOKENS: Record<Lang, RegExp> = {
  json: /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")/g,
  python: /(#[^\n]*)|((?:\b[bf])?"(?:[^"\\\n]|\\.)*"|\b\d+(?:\s*\*\s*\d+)*\b)|(\b(?:and|def|for|if|in|return|True)\b)/g,
}

function highlight(code: string, lang: Lang) {
  const re = new RegExp(TOKENS[lang].source, "g")
  const out: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(code))) {
    const [token, comment, string] = match
    // "//" opens a JSON comment only after whitespace, never inside a URL.
    if (comment !== undefined && lang === "json" && match.index > 0 && !/\s/.test(code[match.index - 1])) {
      re.lastIndex = match.index + 2
      continue
    }
    const kind = comment !== undefined ? "c" : string !== undefined ? "s" : "k"
    if (match.index > last) out.push(code.slice(last, match.index))
    out.push(
      <span key={match.index} className={`pp-${kind}`}>
        {token}
      </span>,
    )
    last = match.index + token.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function Code({ code, lang, label }: { code: string; lang: Lang; label: string }) {
  return (
    <ScrollRegion label={label} className="pp-scroll--code">
      <pre className="pp-code">
        <code>{highlight(code, lang)}</code>
      </pre>
    </ScrollRegion>
  )
}
