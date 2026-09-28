import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft, ArrowUpRight, FilePdf } from "@phosphor-icons/react/dist/ssr"
import { Strip } from "@/components/Strip"
import { Foot } from "@/components/Foot"
import { Code } from "@/components/papers/Code"
import { Contents, type ContentsEntry } from "@/components/papers/Contents"
import { ScrollRegion } from "@/components/papers/ScrollRegion"
import { PackageAnatomy, TrustBoundary } from "@/components/papers/sealed-skills/figures"
import { ExtractionByCategory } from "@/components/papers/sealed-skills/charts"
import { paperHref, papers } from "@/content/papers"
import { person } from "@/content/work"

// "Sealed Skills", v1.0: the research paper that grew out of the v0.2 position
// paper. The page sets the paper's abstract, introduction, results, limitations
// and conclusion verbatim from its LaTeX source (condensed where marked); the
// full text is the PDF, and the code, data and source are on GitHub.

function findPaper(slug: string) {
  const found = papers.find((p) => p.slug === slug)
  if (!found) throw new Error(`src/content/papers.ts has no paper "${slug}"`)
  return found
}

const paper = findPaper("sealed-skills")
const href = paperHref(paper)
const title = `${paper.title}, ${paper.author}`
const PDF = "/papers/sealed-skills.pdf"
const REPO = "https://github.com/alexrf00/sealed-skills"

export const metadata: Metadata = {
  title,
  description: paper.subtitle,
  authors: [{ name: paper.author, url: person.site }],
  alternates: { canonical: href },
  openGraph: {
    type: "article",
    url: href,
    title,
    description: paper.subtitle,
    siteName: "InceptumRex",
    publishedTime: paper.date,
    authors: [paper.author],
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Alex M. Rodriguez: every project pasted on one wall",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: paper.subtitle,
    images: ["/og.jpg"],
  },
}

const ABSTRACT =
  "LLM agent skills (folders of instructions, scripts and reference files that an agent loads on demand) are becoming commercial products, yet they ship as plain text that anyone can copy. We present Sealed Skills, a packaging scheme in which a skill is encrypted with HPKE to a public key that an AI provider publishes at a well-known URL on its own domain. The owner seals offline with no handshake, packages can be distributed through untrusted channels, and only the provider's servers can open them; clients send a reference and a licence and never receive the skill. Our prototype seals and opens a 10 KB skill in under half a millisecond. We then measure the channel encryption cannot close: the model must read the skill, and its answers go to the user. Across eight synthetic skills, 24 extraction attacks and two open 7–8B models, 72–75% of attack conversations disclose at least half of a skill's rules and 35–41% reproduce it nearly verbatim. A confidentiality instruction reduces substantial extraction to 19% and 46%, but for one model at the cost of failing a third of legitimate tasks, mostly by refusing them. A de-obfuscating lexical output filter reduces substantial extraction to 1.6–3.1% but blocks 12.5–25% of benign replies, because models quote rules while applying them; embedding-similarity filtering is far weaker. Per-customer canaries appear in 98% of verbatim leaks, enabling attribution. In a tool-use case study, scripts co-located with a code interpreter are extractable, while an owner-hosted tool protects the code but still reveals its rate table to ordinary queries. Sealing protects a skill's artifacts from copying; it does not make its content or function secret."

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: `${paper.title}: ${paper.subtitle}`,
  author: { "@type": "Person", name: paper.author, url: person.site },
  datePublished: paper.date,
  version: paper.version,
  abstract: ABSTRACT,
  inLanguage: "en",
  url: new URL(href, person.site).href,
  keywords: paper.topics,
  encoding: {
    "@type": "MediaObject",
    contentUrl: new URL(PDF, person.site).href,
    encodingFormat: "application/pdf",
  },
  isBasedOn: REPO,
}

const CONTENTS = [
  { id: "intro", n: "1", title: "Introduction" },
  { id: "design", n: "2", title: "Design" },
  { id: "goals", n: "3", title: "Goals and threat model" },
  { id: "setup", n: "4", title: "Evaluation setup" },
  { id: "cost", n: "5", title: "RQ1: cost of sealing" },
  { id: "extraction", n: "6", title: "RQ2: extraction from context" },
  { id: "filters", n: "7", title: "RQ3: output filters" },
  { id: "scripts", n: "8", title: "RQ4: scripts through tools" },
  { id: "limits", n: "9", title: "Limitations" },
  { id: "conclusion", n: "10", title: "Conclusion" },
  { id: "refs", n: "R", title: "Selected references" },
] as const satisfies readonly ContentsEntry[]

type SectionId = (typeof CONTENTS)[number]["id"]

// A numbered section; its number and title come from the contents, so the two
// can never disagree.
function Section({ id, children }: { id: SectionId; children: ReactNode }) {
  const entry = CONTENTS.find((e) => e.id === id)
  if (!entry) throw new Error(`No contents entry for #${id}`)
  return (
    <section id={id} className="pp-section">
      <h2 className="pp-h2">
        <span className="pp-n">{entry.n}</span>
        {entry.title}
      </h2>
      {children}
    </section>
  )
}

const MANIFEST = `{ "format": "sealed-skill/0.2",
  "skill":   { "id": "com.example.tax-reconciler", "version": "2.3.0",
               "public_description": "Reconciles purchase ledgers against tax filings.",
               "owner": "did:web:example.com" },
  "payload": { "aead": "AES-256-GCM", "chunking": "STREAM-64KiB",
               "size": 482113, "sha256": "9f2c…e71a" },
  "recipients": [{ "provider": "provider-a.example", "key_id": "pa-2026-09-k3",
      "key_source": "https://provider-a.example/.well-known/sealed-skill-keys",
      "hpke_suite": {"kem": "0x0020", "kdf": "0x0001", "aead": "0x0002"},
      "enc": "…", "wrapped_cek": "…" }],
  "policy":  { "confidential": true, "scripts": "owner-hosted",
               "licence_issuer_key": "https://licensing.example.com/.well-known/jwks.json" },
  "signature": { "alg": "Ed25519", "key_id": "example-signing-2026", "sig": "…" } }`

// Table 1 and a subset of Table 2 of the paper, from results/summary.json.
const TABLE_1 = [
  {
    model: "Llama 3.1 8B",
    guard: "no",
    full: "35.4",
    subst: "71.9",
    rules: "70.4",
    canary: "42.2",
    success: "100.0",
    benignRules: "20.1",
  },
  {
    model: "Llama 3.1 8B",
    guard: "yes",
    full: "13.5",
    subst: "18.8",
    rules: "19.5",
    canary: "15.6",
    success: "65.6",
    benignRules: "15.1",
  },
  {
    model: "Qwen 2.5 7B",
    guard: "no",
    full: "41.1",
    subst: "74.5",
    rules: "74.3",
    canary: "46.9",
    success: "96.9",
    benignRules: "14.0",
  },
  {
    model: "Qwen 2.5 7B",
    guard: "yes",
    full: "18.8",
    subst: "46.4",
    rules: "46.6",
    canary: "20.8",
    success: "96.9",
    benignRules: "14.9",
  },
]

const TABLE_2: {
  group: string
  rows: [string, string, string, string, string][]
}[] = [
  {
    group: "Without guard instruction",
    rows: [
      ["No filter", "71.9", "0.0", "74.5", "0.0"],
      ["Lexical, L = 12", "3.1", "25.0", "2.6", "18.8"],
      ["Lexical, L = 24", "9.9", "6.2", "5.2", "3.1"],
      ["Semantic (τ at 5%)", "50.0", "12.5", "59.4", "3.1"],
    ],
  },
  {
    group: "With guard instruction",
    rows: [
      ["No filter", "18.8", "0.0", "46.4", "0.0"],
      ["Lexical, L = 12", "2.1", "12.5", "1.6", "18.8"],
      ["Lexical, L = 24", "2.1", "0.0", "4.7", "9.4"],
      ["Semantic (τ at 5%)", "16.2", "0.0", "31.8", "6.2"],
    ],
  },
]

export default function SealedSkillsPage() {
  return (
    <>
      <a className="skip" href="#paper">
        Skip to the paper
      </a>
      <Strip />
      <main id="top">
        <div className="paper">
          <div id="paper" className="sheet pp-sheet">
            <Link className="pp-back" href="/papers">
              <ArrowLeft aria-hidden="true" weight="bold" />
              Back to the papers
            </Link>

            <div className="pp-layout">
              <Contents entries={CONTENTS} />

              <article className="pp-article" aria-labelledby="pp-title">
                <header className="pp-head">
                  <p className="pp-eyebrow">Research paper · Preprint draft</p>
                  <h1 id="pp-title" className="sheet__title pp-title">
                    Sealed Skills
                  </h1>
                  <p className="pp-subtitle">{paper.subtitle}</p>
                  <dl className="pp-facts">
                    <div>
                      <dt>Author</dt>
                      <dd>{paper.author}</dd>
                    </div>
                    <div>
                      <dt>Version</dt>
                      <dd>{paper.version}</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>
                        <time dateTime={paper.date}>{paper.dateLabel}</time>
                      </dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>
                        <span className="chip chip--paper">{paper.status}</span>
                      </dd>
                    </div>
                  </dl>
                  <ul className="pp-links">
                    <li>
                      <a href={PDF}>
                        <FilePdf aria-hidden="true" weight="bold" />
                        Read the full paper (PDF, 21 pages)
                      </a>
                    </li>
                    <li>
                      <a href={REPO} rel="noopener">
                        <ArrowUpRight aria-hidden="true" weight="bold" />
                        Code, data and LaTeX source on GitHub
                      </a>
                    </li>
                  </ul>
                </header>

                <div className="pp-abstract">
                  <p className="pp-eyebrow">Abstract</p>
                  <p>{ABSTRACT}</p>
                </div>

                <div className="pp-changes">
                  <p className="pp-eyebrow">From position paper to research paper</p>
                  <ul>
                    <li>Version 0.2 was a position paper: it proposed the design. Version 1.0 builds it and measures it.</li>
                    <li>New: a working prototype, a test corpus of eight skills and 24 attacks, 896 model conversations, a sealing benchmark and a tool-use case study.</li>
                    <li>New: related work across 61 references, including the closest prior design (van Wyk et al., 2023) and the 2026 skill-stealing attacks.</li>
                    <li>This page sets the paper in part; the PDF is the complete text.</li>
                  </ul>
                </div>

                <Section id="intro">
                  <p>
                    LLM agents increasingly acquire specialised abilities from <em>skills</em>: directories holding instructions, scripts and reference files that the agent loads when a task calls for
                    them. A good skill encodes expertise that took time and money to produce, such as how a tax authority cross-checks a filing or how a firm scores a contract, and skills are starting
                    to be sold. They ship as plain text. Whoever obtains the folder can read it, republish it, or load it into a competing product, and the licence terms attached to it enforce
                    nothing.
                  </p>
                  <p>
                    This paper asks what it would take to sell a skill that only a chosen AI provider can open, and how much protection that actually buys. We make three observations. First, the
                    cryptography is straightforward and cheap: an owner can encrypt a skill to a public key the provider publishes, in the same way anyone can encrypt email to a published key, without
                    the parties ever talking. Second, the protection depends on a strict architectural rule that is easy to get wrong: the skill must only ever be decrypted on the provider&apos;s
                    servers, never in a client, because anything present on the user&apos;s device can be extracted by the user. Third, and most important, encryption cannot close the channel that
                    matters most. To follow a skill, the model must read it in clear text, and the model&apos;s answers go to the user, who can ask for the skill directly, indirectly, or in disguise.
                  </p>
                  <h3 className="pp-h3">Contributions</h3>
                  <ul>
                    <li>
                      <strong>Design.</strong> Sealed Skills, a provider-bound packaging scheme for agent skills: HPKE key wrapping to a key published at <code>/.well-known/sealed-skill-keys</code>,
                      STREAM-encrypted payloads, owner signatures, offline-verifiable licences, and per-customer canaries, with no owner–provider handshake.
                    </li>
                    <li>
                      <strong>Implementation.</strong> An open prototype with a mock provider, and measurements showing sealing costs are negligible next to model inference.
                    </li>
                    <li>
                      <strong>Measurement of the residual channel.</strong> On eight synthetic multi-rule skills, 24 attacks and two open models, we quantify extraction from context, the effect and
                      utility cost of a guard instruction, and the trade-off curves of lexical and semantic output filters. We use an evidence-grounded judge for rule disclosure after finding that an
                      unconstrained LLM judge counts applying a rule as disclosing it.
                    </li>
                    <li>
                      <strong>Scripts.</strong> A tool-use case study showing that &ldquo;run-only&rdquo; scripts cannot be enforced in a sandbox that also executes arbitrary code, and that
                      owner-hosted tools protect implementations but not function.
                    </li>
                  </ul>
                </Section>

                <Section id="design">
                  <p>
                    Sealing uses envelope encryption. The owner samples a fresh 256-bit content key, encrypts the skill folder with it in 64 KiB STREAM chunks, and wraps the content key with HPKE (RFC
                    9180) for each chosen provider, using the public key that provider publishes at a well-known path on its own domain. The HPKE context binds each wrapped key to one skill version
                    and payload, and an Ed25519 signature covers the whole manifest. Adding a recipient later means wrapping the same 32-byte key once more; the payload is untouched.
                  </p>
                  <figure className="pp-figure">
                    <ScrollRegion label="Figure 1: Anatomy of a sealed package, scrolls sideways">
                      <PackageAnatomy />
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Figure 1</b>Anatomy of a sealed package. Each recipient entry holds the content key wrapped to the public key that provider publishes on its own domain.
                    </figcaption>
                  </figure>
                  <p>
                    The central architectural rule is that <strong>a sealed skill is decrypted only on the provider&apos;s servers, never in a client</strong>, including clients the provider itself
                    distributes. Any secret shipped to a device the user controls can be extracted by that user, and even a correctly decrypted skill would have to travel from the client to the model
                    inside the request, where the user can read it. A client therefore sends only a skill reference and, where the owner requires one, a licence token.
                  </p>
                  <figure className="pp-figure">
                    <ScrollRegion label="Figure 2: The trust boundary, scrolls sideways">
                      <TrustBoundary />
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Figure 2</b>The trust boundary. The client sends a reference; the skill is decrypted, used and filtered entirely on the provider side.
                    </figcaption>
                  </figure>
                  <Code code={MANIFEST} lang="json" label="Abridged manifest (format sealed-skill/0.2)" />
                </Section>

                <Section id="goals">
                  <p>The paper states five goals (condensed here):</p>
                  <ul>
                    <li>
                      <strong>G1 Recipient confidentiality.</strong> Only providers named by the owner can recover the skill plaintext from a package.
                    </li>
                    <li>
                      <strong>G2 No handshake.</strong> The owner can seal for a provider using only public information the provider already publishes.
                    </li>
                    <li>
                      <strong>G3 Integrity and binding.</strong> Modified packages are rejected, and a key wrapped for one package cannot be used to open another.
                    </li>
                    <li>
                      <strong>G4 Client exclusion.</strong> The plaintext never reaches the client or the end user as a file.
                    </li>
                    <li>
                      <strong>G5 Output confidentiality.</strong> The end user cannot recover the skill&apos;s contents from the agent&apos;s outputs.
                    </li>
                  </ul>
                  <p>
                    G1–G4 are cryptographic or architectural properties. G5 is not: the model must read the skill in clear text to follow it, and its outputs go to the user. We treat G5 as a quantity
                    to be measured and reduced, not a property to be proved. The recipient provider is trusted with the plaintext, and models running on user-controlled hardware are out of scope.
                  </p>
                </Section>

                <Section id="setup">
                  <p>
                    <strong>Models.</strong> Llama 3.1 8B Instruct and Qwen 2.5 7B Instruct, 4-bit quantised, served by Ollama on one NVIDIA RTX 3070 (8 GB), greedy decoding. <strong>Corpus.</strong>{" "}
                    Eight synthetic skills written for the study (tax reconciliation, veterinary visit summaries, NDA review, clearance pricing, incident postmortems, menu costing, tariff
                    classification, B2B outreach), each 290–360 words with eight or nine numbered rules, a required output format and a unique canary phrase. <strong>Attacks and tasks.</strong> 24
                    extraction attacks in six categories and four benign tasks per skill, run against every skill, model and guard setting: 768 attack conversations and 128 benign ones.
                  </p>
                  <p>
                    <strong>Metrics.</strong> Replies are de-obfuscated and, when not in English, back-translated before scoring. A <em>full extraction</em> reaches ROUGE-L recall ≥ 0.9 against the
                    skill. A rule is <em>disclosed</em> if a reply contains a six-word verbatim run from it, or an LLM judge claims it is stated and quotes evidence that passes three mechanical
                    checks. A <em>substantial extraction</em> has ROUGE-L ≥ 0.5 or discloses at least half of the rules.
                  </p>
                </Section>

                <Section id="cost">
                  <p>
                    A 10 KB skill, typical of <code>SKILL.md</code> files, seals in 0.30 ms and opens in 0.39 ms (medians of 50 runs); a 1 MB skill with reference files takes about 2.5 ms; even 64 MB
                    takes 216 ms to seal and 133 ms to open. Adding a recipient to a sealed 10 MB package takes 0.19 ms, against 34 ms to reseal it. The median benign reply in our experiments took 4.3
                    s (Llama) and 4.9 s (Qwen) to generate, so unsealing adds well under 0.1% to a request.
                  </p>
                </Section>

                <Section id="extraction">
                  <figure className="pp-figure">
                    <ScrollRegion label="Table 1: Extraction and utility per model and guard setting">
                      <table className="pp-table pp-table--data">
                        <thead>
                          <tr>
                            <th scope="col">Model</th>
                            <th scope="col">Guard</th>
                            <th scope="col">Full</th>
                            <th scope="col">Substantial</th>
                            <th scope="col">Rules</th>
                            <th scope="col">Canary</th>
                            <th scope="col">Task success</th>
                            <th scope="col">Rules in benign use</th>
                          </tr>
                        </thead>
                        <tbody>
                          {TABLE_1.map((r) => (
                            <tr key={r.model + r.guard}>
                              <th scope="row">{r.model}</th>
                              <td>{r.guard}</td>
                              <td className="pp-num">{r.full}</td>
                              <td className="pp-num">{r.subst}</td>
                              <td className="pp-num">{r.rules}</td>
                              <td className="pp-num">{r.canary}</td>
                              <td className="pp-num">{r.success}</td>
                              <td className="pp-num">{r.benignRules}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Table 1</b>Extraction and utility, in %. Attack columns are over 192 conversations per row; benign columns over 32 tasks per row.
                    </figcaption>
                  </figure>
                  <p>
                    <strong>Without a guard instruction, a skill in context is largely extractable.</strong> Across the eight skills and 24 attacks, 35.4% (Llama) and 41.1% (Qwen) of conversations
                    reproduce the skill almost verbatim, and 71.9% and 74.5% disclose at least half of its rules. Transformation attacks rarely yield verbatim copies but usually disclose the rules
                    anyway: a &ldquo;detailed summary that keeps every threshold&rdquo;, a JSON object of rules or a translation preserves the skill&apos;s substance.
                  </p>
                  <p>
                    <strong>The guard instruction helps, unevenly, and at a cost.</strong> It cuts substantial extraction from 71.9% to 18.8% for Llama and from 74.5% to 46.4% for Qwen. For Llama it
                    nearly eliminates authority, indirect and multi-turn attacks, but plain direct requests still succeed in 53.1% of conversations. The cost falls on utility: with the guard, Llama
                    completed only 21 of 32 benign tasks, and 7 of its 11 failures were refusals to perform the task at all. Qwen&apos;s task success was unchanged.
                  </p>
                  <figure className="pp-figure">
                    <ScrollRegion label="Figure 3: Substantial extraction by attack category, scrolls sideways">
                      <ExtractionByCategory />
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Figure 3</b>Substantial extraction by attack category, with and without the guard instruction (32 conversations per bar; 48 for transform, 16 for tool).
                    </figcaption>
                  </figure>
                  <p>
                    <strong>Ordinary use already discloses part of a skill.</strong> Even in benign tasks, the models stated 14–20% of a skill&apos;s rules on average, typically by quoting a rule
                    while applying it, and the guard barely changes this. <strong>Canaries</strong> work for attribution: 205 of the 209 full extractions (98.1%) reproduced the skill&apos;s canary
                    phrase. They do not survive paraphrase.
                  </p>
                </Section>

                <Section id="filters">
                  <figure className="pp-figure">
                    <ScrollRegion label="Table 2: Residual substantial extraction and benign replies blocked, per filter">
                      <table className="pp-table pp-table--data">
                        <thead>
                          <tr>
                            <th scope="col">Filter</th>
                            <th scope="col">Llama: residual</th>
                            <th scope="col">Llama: blocked</th>
                            <th scope="col">Qwen: residual</th>
                            <th scope="col">Qwen: blocked</th>
                          </tr>
                        </thead>
                        {TABLE_2.map((g) => (
                          <tbody key={g.group}>
                            <tr>
                              <th scope="rowgroup" colSpan={5} className="pp-group">
                                {g.group}
                              </th>
                            </tr>
                            {g.rows.map((r) => (
                              <tr key={g.group + r[0]}>
                                <th scope="row">{r[0]}</th>
                                {r.slice(1).map((v, i) => (
                                  <td key={i} className="pp-num">
                                    {v}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        ))}
                      </table>
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Table 2</b>Residual substantial extraction after each filter, and benign replies it blocks, in % (subset of the paper&apos;s table).
                    </figcaption>
                  </figure>
                  <p>
                    The <strong>lexical filter</strong> is effective against what the models actually produce: at L = 12 it blocks every full extraction and reduces substantial extraction to 1.6–3.1%
                    across all four configurations. Of the 18 conversations (of 768) that still leak substantially, 13 are transformation attacks: nine poems that restate one rule per stanza and four
                    translations. The price is utility: because models quote rules while applying them, the same filter blocks 12.5–25% of benign replies. The <strong>semantic filter</strong> performs
                    poorly on its own: sentence embeddings cannot separate a reply that states a rule from one that applies it. These numbers are an optimistic bound for the defender, because the
                    attacks are not adaptive to the filter.
                  </p>
                </Section>

                <Section id="scripts">
                  <p>
                    We gave the agent a proprietary withholding-calculator script and two tools: one that runs the script, and one that runs arbitrary Python in the agent&apos;s workspace. In the{" "}
                    <em>co-located</em> design the script sits in the workspace; in the <em>owner-hosted</em> design it runs on the owner&apos;s side and only results come back.
                  </p>
                  <p>
                    <strong>Source extraction.</strong> Executing the attacks&apos; code directly, as an obedient agent would, printed the full script in all three co-located attempts and in none of
                    the owner-hosted ones. With the models in the loop, Qwen printed the complete script, rate table and canary included, in 1 of 6 attacks; no owner-hosted run leaked the source (0 of
                    12). &ldquo;Run-only&rdquo; is not a property a co-located sandbox can provide.
                  </p>
                  <p>
                    <strong>Functional extraction.</strong> Owner hosting protects the code, not its function. Asked to run the tool once per category, the models reconstructed the entire rate table
                    in three of four model–design combinations, and a second probe exposed the minimum threshold and the 45,000 cap in all four. Any secret that is directly readable from input–output
                    pairs is disclosed by ordinary use.
                  </p>
                </Section>

                <Section id="limits">
                  <p>
                    The extraction study uses two 7–8B open models run locally with greedy decoding and a single sample per prompt; frontier hosted models have stronger instruction-following and may
                    be both more resistant to naive requests and more capable of faithful paraphrase. The corpus is eight synthetic skills written for this study, and the 24 attacks are hand-written
                    rather than optimised. The semantic filter&apos;s threshold is calibrated on the same benign prompts on which its block rate is reported, and benign rates rest on 32 tasks per
                    configuration. Rule disclosure is judged by a 7B model constrained by mechanical evidence checks; the manual check of its decisions is small (85 decisions) and has not been
                    repeated by an independent annotator. The tool-use case study is illustrative. The design has not been implemented by any AI provider; we are not aware of any provider that
                    currently publishes a skill-sealing key or loads encrypted skills, so the provider in the study is a mock.
                  </p>
                </Section>

                <Section id="conclusion">
                  <p>
                    Agent skills are becoming a medium for selling expertise, and today they ship as plain text. Sealed Skills let an owner encrypt a skill to the public key an AI provider publishes
                    on its domain, without any handshake, so that only that provider&apos;s servers can open it and no client ever receives it. Our prototype shows the cryptographic cost is negligible
                    next to model inference. Our measurements show that the harder problem sits at the model&apos;s output: once a skill is in context, a user can extract much of it, guard
                    instructions and output filters reduce but do not eliminate this, and every filter trades leakage against legitimate use. For content that must stay secret, the answer is
                    architectural: keep it behind an owner-hosted tool and out of the model&apos;s context entirely.
                  </p>
                </Section>

                <Section id="refs">
                  <p>The paper cites 61 works; the complete list is in the PDF. Among them:</p>
                  <ol className="pp-refs">
                    <li>
                      R. Barnes, K. Bhargavan, B. Lipp, C. Wood. <em>Hybrid Public Key Encryption.</em> RFC 9180, IETF, 2022.
                    </li>
                    <li>
                      M. A. van Wyk, M. Bekker, X. L. Richards, K. J. Nixon. <em>Protect Your Prompts: Protocols for IP Protection in LLM Applications.</em> arXiv:2306.06297, 2023.
                    </li>
                    <li>
                      Y. Zhang, N. Carlini, D. Ippolito. <em>Effective Prompt Extraction from Language Models.</em> COLM 2024.
                    </li>
                    <li>
                      Y.-L. Tsai, Y.-A. Lu, C.-Y. Tsai, M. Lyu, R. A. Popa, C.-M. Yu. <em>Daydreaming: Stealing Hidden Agent Skills through Black-Box Task Interaction.</em> arXiv:2608.26733, 2026.
                    </li>
                    <li>
                      V. T. Hoang, R. Reyhanitabar, P. Rogaway, D. Vizár. <em>Online Authenticated-Encryption and its Nonce-Reuse Misuse-Resistance.</em> CRYPTO 2015.
                    </li>
                    <li>
                      B. Chor, A. Fiat, M. Naor. <em>Tracing Traitors.</em> CRYPTO 1994.
                    </li>
                  </ol>
                </Section>

                <footer className="pp-end">
                  Sealed Skills · v{paper.version} · {paper.dateLabel}. A preprint draft, not peer reviewed. It describes a design and a study, not an existing product, feature of any AI provider, or
                  agreed industry standard.
                </footer>
              </article>
            </div>
          </div>
        </div>
      </main>
      <Foot />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  )
}
