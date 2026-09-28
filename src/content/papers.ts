// Papers the owner has written, in two kinds that are never mixed: a paper is
// an essay or an article for any reader; a research paper works a technical
// problem through for specialists. Each has its own
// page under /papers/<slug>; the papers screen (/papers) pastes them up and
// then sets them straight, one printed sheet per kind. A paper's text lives in
// its page, set verbatim from the owner's final draft.

export type PaperCategory = "paper" | "research"

export const categories: Record<PaperCategory, { title: string; one: string; definition: string; empty: string }> = {
  paper: {
    title: "Papers",
    one: "Paper",
    definition: "A paper is an essay or an article: an argument or an explanation written for any reader.",
    empty: "None is out yet.",
  },
  research: {
    title: "Research papers",
    one: "Research paper",
    definition: "A research paper works a technical problem through for specialists: the question, the design or method, the analysis and the sources it rests on.",
    empty: "None is out yet.",
  },
}

export type Paper = {
  slug: string
  category: PaperCategory
  title: string
  subtitle: string
  kind: string
  status: string
  version: string
  date: string
  dateLabel: string
  author: string
  // The paper's own findings, as its conclusion states them.
  findings: string[]
  topics: string[]
  // How it is pasted on the papers screen: its name in wood type and one line
  // of its own words.
  wall: { lines: string[]; line: string }
  // Research papers only: what a specialist needs to judge the work, and the
  // opening of its abstract, verbatim, for the page inside its offprint.
  study?: { question: string; approach: string; references: string; review: string; opening: string }
}

export const papers: Paper[] = [
  {
    slug: "sealed-skills",
    category: "research",
    title: "Sealed Skills",
    subtitle: "Provider-bound encryption for LLM agent skills, and the limits of confidential context.",
    kind: "Systems and measurement study",
    status: "Preprint draft, not peer reviewed",
    version: "1.0",
    date: "2026-09-27",
    dateLabel: "27 September 2026",
    author: "Alex M. Rodriguez",
    findings: [
      "Sealing removes every non-model path to a skill at negligible cost: a 10 KB skill seals and opens in under half a millisecond.",
      "Once a skill is in context, most of it can be extracted: without defences, 72–75% of attack conversations disclosed at least half of a skill's rules.",
      "A guard instruction and a lexical output filter bring that to about 2%, but block 12.5–19% of legitimate replies, because models quote rules while using them.",
      "Sealing protects a skill's artifacts from copying; it does not make its content or function secret.",
    ],
    topics: ["AI agent skills", "HPKE", "Prompt extraction", "LLM security"],
    wall: { lines: ["Sealed", "Skills"], line: "Encrypting AI agent skills, and measuring what still leaks" },
    study: {
      question: "Can an AI agent skill be encrypted so that only a chosen AI provider can open it, and how much of it can a user still extract through the model?",
      approach: "A design and prototype (HPKE to a provider-published key, no handshake), then 896 conversations with two open models across eight skills and 24 attacks, a sealing benchmark and a tool-use case study.",
      references: "61, among them RFC 9180 (HPKE), van Wyk et al. 2023 (encrypted prompts), Zhang et al. 2024 (prompt extraction) and the 2026 skill-stealing attacks.",
      review: "Preprint draft, not peer reviewed, v1.0",
      opening: "LLM agent skills (folders of instructions, scripts and reference files that an agent loads on demand) are becoming commercial products, yet they ship as plain text that anyone can copy.",
    },
  },
]

export const paperHref = (paper: Paper) => `/papers/${paper.slug}`
export const papersOf = (category: PaperCategory) => papers.filter((p) => p.category === category)
