// Papers the owner has written. Each one has its own page under /papers/<slug>;
// the home page lists them on the Papers sheet. The text of a paper lives in
// its page and is set verbatim from the owner's final draft.

export type Paper = {
  slug: string
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
}

export const papers: Paper[] = [
  {
    slug: "sealed-skills",
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
  },
]

export const paperHref = (paper: Paper) => `/papers/${paper.slug}`
