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
    subtitle:
      "Encrypting AI agent skills to a key the AI company publishes, so that only that company's servers can open them, with no handshake between owner and provider.",
    kind: "Position paper",
    status: "Draft for discussion",
    version: "0.2",
    date: "2026-09-27",
    dateLabel: "27 September 2026",
    author: "Alex M. Rodriguez",
    findings: [
      "Decryption must stay on the provider's servers, because anything on the user's device can be extracted.",
      "The model can still be questioned about what it read, so sealing protects the file from copying but cannot guarantee the user learns nothing.",
      "Dropping the handshake trades contracts, audit and revocation for simplicity.",
    ],
    topics: ["AI agent skills", "Envelope encryption", "HPKE", "Confidential computing"],
    wall: { lines: ["Sealed", "Skills"], line: "Encrypting AI agent skills to a key the AI company publishes" },
    study: {
      question: "How can AI agent skills be encrypted so that only the AI company's servers can open them, with no handshake between owner and provider?",
      approach: "A protocol design: envelope encryption with HPKE to a key the provider publishes on its domain, a package format, a threat model and reference pseudocode.",
      references: "Ten, among them RFC 9180 (HPKE), RFC 8032 (EdDSA), RFC 8615 (well-known URIs) and RFC 9334 (RATS).",
      review: "Draft for discussion, v0.2",
      opening: "Agent skills, the packaged instructions, scripts and reference files that teach an AI model a specialised job, are becoming commercial products, yet they ship as plain text that anyone can copy.",
    },
  },
]

export const paperHref = (paper: Paper) => `/papers/${paper.slug}`
export const papersOf = (category: PaperCategory) => papers.filter((p) => p.category === category)
