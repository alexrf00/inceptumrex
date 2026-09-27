import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { Strip } from "@/components/Strip"
import { Foot } from "@/components/Foot"
import { Code } from "@/components/papers/Code"
import { Contents, type ContentsEntry } from "@/components/papers/Contents"
import { ScrollRegion } from "@/components/papers/ScrollRegion"
import { PackageAnatomy, SealingSequence, TrustBoundary, UnsealingSequence } from "@/components/papers/sealed-skills/figures"
import { paperHref, papers } from "@/content/papers"
import { person } from "@/content/work"

// "Sealed Skills", v0.2, set verbatim from the owner's draft on one newsprint
// sheet. Only the author line differs from the draft: it carries the full name.

function findPaper(slug: string) {
  const found = papers.find((p) => p.slug === slug)
  if (!found) throw new Error(`src/content/papers.ts has no paper "${slug}"`)
  return found
}

const paper = findPaper("sealed-skills")
const href = paperHref(paper)
const title = `${paper.title}, ${paper.author}`

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
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Alex M. Rodriguez: every project pasted on one wall" }],
  },
  twitter: { card: "summary_large_image", title, description: paper.subtitle, images: ["/og.jpg"] },
}

const ABSTRACT =
  "Agent skills, the packaged instructions, scripts and reference files that teach an AI model a specialised job, are becoming commercial products, yet they ship as plain text that anyone can copy. This paper proposes Sealed Skills: a skill is encrypted to a public key that an AI provider publishes at a fixed address on its own domain. The skill owner fetches that key over HTTPS, seals the skill offline, and distributes the package anywhere. No onboarding, agreement or other exchange with the provider is required, and only the holder of the matching private key, the provider, can open the package. We show that decryption must happen on the provider's servers and never in a client application the user controls, because anything present on the user's device can be extracted. We then set out the channels through which a skill can still reach the person using the AI, what reduces each one, and the one design that keeps secret logic away from both the model and the user: placing it behind a tool on the owner's own server. Finally, we are explicit about what sealing without a handshake gives up: contractual terms, audit and reliable revocation."

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  headline: paper.title,
  alternativeHeadline: paper.subtitle,
  author: { "@type": "Person", name: paper.author, url: person.site },
  datePublished: paper.date,
  version: paper.version,
  abstract: ABSTRACT,
  inLanguage: "en",
  url: new URL(href, person.site).href,
  keywords: paper.topics,
}

const CONTENTS = [
  { id: "intro", n: "1", title: "Introduction" },
  { id: "terms", n: "2", title: "Parties and terms" },
  { id: "goals", n: "3", title: "Goals and non-goals" },
  { id: "overview", n: "4", title: "How it works" },
  { id: "publish", n: "5", title: "The published key" },
  { id: "seal", n: "6", title: "Sealing without a handshake" },
  { id: "where", n: "7", title: "Where decryption happens" },
  { id: "load", n: "8", title: "Loading a sealed skill" },
  { id: "format", n: "9", title: "Package format" },
  { id: "keys", n: "10", title: "Keys and rotation" },
  { id: "threats", n: "11", title: "Threat model" },
  { id: "leaks", n: "12", title: "Keeping it from the user" },
  { id: "tradeoffs", n: "13", title: "What the handshake gave" },
  { id: "build", n: "14", title: "Who builds what" },
  { id: "adoption", n: "15", title: "Adoption path" },
  { id: "open", n: "16", title: "Open questions" },
  { id: "conclusion", n: "17", title: "Conclusion" },
  { id: "appendix", n: "A", title: "Reference pseudocode" },
  { id: "refs", n: "B", title: "References" },
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

const KEY_DOCUMENT = `GET https://provider-a.example/.well-known/sealed-skill-keys

{
  "issuer": "provider-a.example",
  "keys": [
    {
      "key_id": "pa-2026-09-k3",
      "kty": "OKP", "crv": "X25519", "x": "base64url…",
      "hpke_suite": { "kem": "0x0020", "kdf": "0x0001", "aead": "0x0002" },
      "seal_until": "2026-12-31T00:00:00Z",
      "decrypt_until": "2027-12-31T00:00:00Z",
      "attestation": "base64…"   // optional, see below
    }
  ],
  "policy_url": "https://provider-a.example/sealed-skills/policy"
}`

const MANIFEST = `{
  "format": "sealed-skill/0.2",
  "skill": {
    "id": "com.example.tax-reconciler",
    "version": "2.3.0",
    "public_description": "Reconciles purchase ledgers against monthly tax filings.",
    "owner": "did:web:example.com"
  },
  "payload": {
    "aead": "AES-256-GCM",
    "chunking": "STREAM-64KiB",
    "size": 482113,
    "sha256": "9f2c…e71a"
  },
  "recipients": [
    {
      "provider": "provider-a.example",
      "key_source": "https://provider-a.example/.well-known/sealed-skill-keys",
      "key_id": "pa-2026-09-k3",
      "hpke_suite": { "kem": "0x0020", "kdf": "0x0001", "aead": "0x0002" },
      "enc": "base64…",
      "wrapped_cek": "base64…"
    }
  ],
  "policy": {
    "confidential": true,
    "licence_issuer_key": "https://licensing.example.com/.well-known/jwks.json",
    "allowed_runtimes": ["python3"],
    "scripts_readable_by_model": false
  },
  "signature": { "alg": "Ed25519", "key_id": "example-signing-2026", "sig": "base64…" }
}`

const PSEUDOCODE = `# Runs on the owner's machine. No contact with the provider.
def seal(skill_dir, providers, owner_key, policy):
    cek = random_bytes(32)
    payload = stream_encrypt(cek, tar(skill_dir), chunk=64 * 1024)  # AES-256-GCM
    header = {"skill": meta(skill_dir), "payload": {"sha256": sha256(payload)}}
    info = b"sealed-skill/0.2" + sha256(canonical(header))

    recipients = []
    for p in providers:
        doc = https_get(f"https://{p}/.well-known/sealed-skill-keys")  # TLS cert = provider's domain
        key = newest_key_with_seal_until_after(doc, now())
        require(matches_pin(p, key) and matches_other_vantage_points(p, key))
        if policy.require_attestation:
            require(attestation_ok(key))
        enc, wrapped = hpke_seal(key.public, info=info, plaintext=cek)
        recipients.append({"provider": p, "key_id": key.id,
                           "enc": enc, "wrapped_cek": wrapped})

    manifest = header | {"recipients": recipients, "policy": policy}
    manifest["signature"] = ed25519_sign(owner_key, canonical(manifest))
    return manifest, payload


# Runs ONLY on the provider's servers. Never in a client app.
def load_sealed(skill_ref, licence):
    manifest, payload = fetch_package(skill_ref)
    require(ed25519_verify(owner_public_key(manifest), manifest))
    require(sha256(payload) == manifest["payload"]["sha256"])
    if SUPPORTS_LICENSING:
        require(licence_valid_offline(licence, manifest))  # owner-signed, no call to owner

    r = find_recipient(manifest, SELF)
    info = b"sealed-skill/0.2" + sha256(canonical(header_of(manifest)))
    cek = hpke_open(PRIVATE_KEY_IN_HSM, r["enc"], info=info, ciphertext=r["wrapped_cek"])
    files = untar(stream_decrypt(cek, payload))            # memory only

    mount_run_only(files.scripts)                          # executable, not readable by the model
    add_output_filter(files.text)                          # block replies that reproduce the skill
    return add_to_context(files.instructions, confidential=True)`

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
            <Link className="pp-back" href="/#papers">
              <ArrowLeft aria-hidden="true" weight="bold" />
              Back to the papers
            </Link>

            <div className="pp-layout">
              <Contents entries={CONTENTS} />

              <article className="pp-article" aria-labelledby="pp-title">
                <header className="pp-head">
                  <p className="pp-eyebrow">Position paper · Draft for discussion</p>
                  <h1 id="pp-title" className="sheet__title pp-title">
                    Sealed Skills
                  </h1>
                  <p className="pp-subtitle">
                    Encrypting AI agent skills to a key the AI company publishes, so that only that company&apos;s servers can open them, with no handshake between owner and provider.
                  </p>
                  <dl className="pp-facts">
                    <div>
                      <dt>Author</dt>
                      <dd>Alex M. Rodriguez</dd>
                    </div>
                    <div>
                      <dt>Version</dt>
                      <dd>0.2</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>
                        <time dateTime={paper.date}>27 September 2026</time>
                      </dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>
                        <span className="chip chip--paper">Proposal, not a standard</span>
                      </dd>
                    </div>
                  </dl>
                </header>

                <div className="pp-abstract">
                  <p className="pp-eyebrow">Abstract</p>
                  <p>
                    Agent skills, the packaged instructions, scripts and reference files that teach an AI model a specialised job, are becoming commercial products, yet they ship as plain text that anyone can copy. This paper proposes <strong>Sealed Skills</strong>: a skill is encrypted to a public key that an AI provider publishes at a fixed address on its own domain. The skill owner fetches that key over HTTPS, seals the skill offline, and distributes the package anywhere. No onboarding, agreement or other exchange with the provider is required, and only the holder of the matching private key, the provider, can open the package. We show that decryption must happen on the provider&apos;s servers and never in a client application the user controls, because anything present on the user&apos;s device can be extracted. We then set out the channels through which a skill can still reach the person using the AI, what reduces each one, and the one design that keeps secret logic away from both the model and the user: placing it behind a tool on the owner&apos;s own server. Finally, we are explicit about what sealing without a handshake gives up: contractual terms, audit and reliable revocation.
                  </p>
                </div>

                <div className="pp-changes">
                  <p className="pp-eyebrow">What changed from v0.1</p>
                  <ul>
                    <li>The onboarding handshake is no longer required. Owners seal to a key the provider publishes on its domain (sections 5 and 6).</li>
                    <li>New section on why decryption must run on the provider&apos;s servers, not in desktop or command-line clients (section 7).</li>
                    <li>Expanded treatment of how a skill can leak to the end user through the model, with mitigations per channel (section 12).</li>
                    <li>New section comparing handshake, published-key and online key-release models, and what dropping the handshake costs (section 13).</li>
                  </ul>
                </div>

                <Section id="intro">
                  <p>
                    A skill is a folder. It usually holds a main instruction file (for example <code>SKILL.md</code>), optional scripts the agent may run, and reference documents the agent reads when it needs them. The agent loads the skill into its context when a task matches the skill&apos;s description. Good skills encode hard-won domain knowledge: how a tax authority validates a filing, how a hospital codes a procedure, how a firm structures a due-diligence memo.
                  </p>
                  <p>
                    Because a skill is plain text, its protection today is entirely social. Marketplace terms say &quot;do not redistribute&quot;, but the file enforces nothing. One leaked copy can be republished, rebranded, or loaded into a competing product. This discourages the experts whose knowledge would make skills most valuable.
                  </p>
                  <p>
                    We propose that commercial skills be <em>sealed</em>: encrypted so that the package is useless ciphertext to everyone except the AI providers its owner names. The motivating case is a skill meant to run only with one assistant, for example Claude from Anthropic, and to stay unreadable to the people using that assistant.
                  </p>
                  <p>
                    Version 0.1 of this paper required an onboarding handshake between owner and provider. This version drops it. An owner should be able to seal a skill for a provider the same way anyone can encrypt an email to a published public key: by looking the key up, without asking permission.
                  </p>
                </Section>

                <Section id="terms">
                  <dl className="pp-defs">
                    <div>
                      <dt>Skill owner</dt>
                      <dd>The person or company that wrote the skill and holds its rights. Holds a long-term signing key.</dd>
                    </div>
                    <div>
                      <dt>AI provider</dt>
                      <dd>The company that operates the model and the servers on which skills are unsealed and run.</dd>
                    </div>
                    <div>
                      <dt>Provider servers</dt>
                      <dd>The provider&apos;s own infrastructure, ideally a hardware-isolated environment that can prove what code it runs. The only place a sealed skill is ever decrypted.</dd>
                    </div>
                    <div>
                      <dt>Client application</dt>
                      <dd>The app the user interacts with: a chat website, a desktop app, a command-line agent such as Claude Code, or a customer&apos;s own integration. Runs on hardware the user controls.</dd>
                    </div>
                    <div>
                      <dt>End user</dt>
                      <dd>The person using the AI. Benefits from the skill, never sees its contents.</dd>
                    </div>
                    <div>
                      <dt>Key endpoint</dt>
                      <dd>A fixed HTTPS address on the provider&apos;s domain where it publishes its current sealing public keys.</dd>
                    </div>
                    <div>
                      <dt>Sealed package</dt>
                      <dd>The distributable artifact: a signed manifest plus an encrypted payload. Safe to host on any public server.</dd>
                    </div>
                    <div>
                      <dt>Content key (CEK)</dt>
                      <dd>A random 256-bit symmetric key that encrypts one version of one skill.</dd>
                    </div>
                  </dl>
                </Section>

                <Section id="goals">
                  <div className="pp-goals">
                    <div>
                      <h3 className="pp-h3">Goals</h3>
                      <ul>
                        <li>
                          <strong>Confidentiality.</strong> Only the servers of providers the owner names can recover the skill.
                        </li>
                        <li>
                          <strong>No handshake.</strong> The owner can seal for a provider without contacting it.
                        </li>
                        <li>
                          <strong>Hidden from the end user.</strong> The skill file never reaches the client application or the person using it.
                        </li>
                        <li>
                          <strong>Integrity.</strong> Tampering is detected before the skill runs.
                        </li>
                        <li>
                          <strong>Free distribution.</strong> Packages can travel through untrusted marketplaces and mirrors.
                        </li>
                        <li>
                          <strong>Licensing where honoured.</strong> A provider that chooses to can refuse to load a skill without a valid owner-signed licence.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="pp-h3">Non-goals</h3>
                      <ul>
                        <li>Hiding the skill from the provider. Its model has to read it.</li>
                        <li>Guaranteeing the end user learns nothing. The model&apos;s answers go to the user, and behaviour can be observed (section 12).</li>
                        <li>Protecting skills on models running on user-controlled hardware.</li>
                        <li>Binding the provider to terms. Without a handshake there is no agreement to bind it (section 13).</li>
                      </ul>
                    </div>
                  </div>
                </Section>

                <Section id="overview">
                  <p>
                    Sealing uses envelope encryption. The owner encrypts the skill once with a random content key, then wraps that content key for each chosen provider using the public key the provider publishes. Adding a provider means wrapping one more copy of a 32-byte key; the skill itself is not re-encrypted. A signature over the whole manifest binds everything together.
                  </p>
                  <figure className="pp-figure">
                    <ScrollRegion label="Figure 1: Anatomy of a sealed package">
                      <PackageAnatomy />
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Figure 1</b>Anatomy of a sealed package. Each recipient entry holds the content key wrapped to the public key that provider publishes on its own domain.
                    </figcaption>
                  </figure>
                </Section>

                <Section id="publish">
                  <p>Each participating provider publishes its sealing keys at a well-known address on its primary domain, for example:</p>
                  <Code code={KEY_DOCUMENT} lang="json" label="Example key document" />
                  <p>The fields matter for a scheme with no relationship between the parties:</p>
                  <ul>
                    <li>
                      <strong>
                        <code>seal_until</code>
                      </strong>{" "}
                      tells owners when to stop sealing to this key.
                    </li>
                    <li>
                      <strong>
                        <code>decrypt_until</code>
                      </strong>{" "}
                      is the provider&apos;s public commitment to keep the private key usable until then, so packages sealed today keep working without the owner ever contacting the provider.
                    </li>
                    <li>
                      <strong>
                        <code>attestation</code>
                      </strong>{" "}
                      is optional evidence from the hardware that the private key was generated inside, and cannot leave, an environment running published code. It turns &quot;trust the company&quot; into &quot;trust the company&apos;s measured servers&quot;.
                    </li>
                    <li>
                      <strong>
                        <code>policy_url</code>
                      </strong>{" "}
                      is where the provider states, unilaterally and publicly, how it treats sealed content: no training, no retention beyond the session, refusal of extraction requests. Without a handshake this public statement is the only commitment an owner has.
                    </li>
                  </ul>
                  <div className="pp-note">
                    <p className="pp-eyebrow">How the owner knows the key is genuine</p>
                    <p>
                      The baseline is the provider&apos;s HTTPS certificate: the key came from the provider&apos;s own domain. That is as strong as the domain&apos;s security, so tooling should add cheap checks: fetch from more than one network location and compare, pin the key across fetches and alert on unexpected changes, and, where available, confirm the key appears in a public transparency log. None of these require contacting the provider.
                    </p>
                  </div>
                </Section>

                <Section id="seal">
                  <p>The owner&apos;s sealing tool does the following. There is no message from the owner to the provider at any step.</p>
                  <ol className="pp-steps">
                    <li>
                      <div>
                        <strong>Fetch the key.</strong> Download the provider&apos;s key document over HTTPS and select a key whose <code>seal_until</code> is in the future.
                      </div>
                    </li>
                    <li>
                      <div>
                        <strong>Check it.</strong> Validate the certificate, compare with the pinned value and other vantage points, and verify attestation if the owner requires it.
                      </div>
                    </li>
                    <li>
                      <div>
                        <strong>Encrypt.</strong> Generate a content key and encrypt the skill folder.
                      </div>
                    </li>
                    <li>
                      <div>
                        <strong>Wrap.</strong> Wrap the content key to each chosen provider with HPKE (RFC 9180).
                      </div>
                    </li>
                    <li>
                      <div>
                        <strong>Sign and publish.</strong> Sign the manifest with the owner&apos;s key and publish the package on any host.
                      </div>
                    </li>
                  </ol>
                  <figure className="pp-figure">
                    <ScrollRegion label="Figure 2: Sealing">
                      <SealingSequence />
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Figure 2</b>Sealing. The provider publishes once; any owner can seal to it at any time without the provider knowing.
                    </figcaption>
                  </figure>
                </Section>

                <Section id="where">
                  <p>
                    This is the most important constraint in the design. <strong>A sealed skill must only ever be decrypted on the provider&apos;s servers.</strong> It must never be decrypted in a client application, even one the provider itself publishes, such as a desktop app or a command-line agent.
                  </p>
                  <p>The reason is that the user controls their own device. Two things follow:</p>
                  <ul>
                    <li>
                      <strong>Any secret shipped to the device can be extracted.</strong> If a desktop client held a private key, or a credential that proves &quot;I am the provider&quot;, the user could copy it out of the program and decrypt the skill themselves. Obfuscation slows this down; it does not stop it.
                    </li>
                    <li>
                      <strong>Plaintext on the device is visible to the user.</strong> Even if decryption were somehow safe, the skill text would then have to travel to the model inside the request. The user can read that traffic, the program&apos;s memory, and saved transcripts.
                    </li>
                  </ul>
                  <figure className="pp-figure">
                    <ScrollRegion label="Figure 3: The trust boundary">
                      <TrustBoundary />
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Figure 3</b>The trust boundary. The client sends a reference; the skill is decrypted, used and filtered entirely on the provider side.
                    </figcaption>
                  </figure>
                  <p>
                    For a provider like Anthropic, this means a sealed skill could be offered through its hosted surfaces (the Claude apps and the API), where the skill is fetched and loaded on Anthropic&apos;s side. A command-line or desktop client would send only the skill&apos;s identifier and licence, and the server would add the skill to Claude&apos;s context before the model runs. The client would never download the skill folder, which is how local skills work today.
                  </p>
                </Section>

                <Section id="load">
                  <p>When a user&apos;s agent needs the skill, the provider&apos;s servers:</p>
                  <ol className="pp-steps">
                    <li>
                      <div>
                        <strong>Receive a reference.</strong> The client sends the skill ID, version and, if the skill requires one, a licence token the owner issued to that customer.
                      </div>
                    </li>
                    <li>
                      <div>
                        <strong>Fetch and verify.</strong> Download the sealed package from its public location and check the owner&apos;s Ed25519 signature.
                      </div>
                    </li>
                    <li>
                      <div>
                        <strong>Check the licence.</strong> If the provider supports licensing, verify the owner-signed token offline: right skill, right customer, not expired. This needs no call to the owner.
                      </div>
                    </li>
                    <li>
                      <div>
                        <strong>Unwrap and decrypt.</strong> Find this provider&apos;s recipient entry, open it with the private key, and decrypt the payload into memory. Nothing is written to disk.
                      </div>
                    </li>
                    <li>
                      <div>
                        <strong>Load as confidential.</strong> Place the skill in the model&apos;s context marked as sealed, run its scripts in a sandbox that cannot read the skill files back out (section 12), and filter outputs.
                      </div>
                    </li>
                  </ol>
                  <figure className="pp-figure">
                    <ScrollRegion label="Figure 4: Load-time unsealing">
                      <UnsealingSequence />
                    </ScrollRegion>
                    <figcaption className="pp-cap">
                      <b>Figure 4</b>Load-time unsealing. The licensing service talks to the customer, not to the provider, so no owner-provider handshake is introduced.
                    </figcaption>
                  </figure>
                </Section>

                <Section id="format">
                  <p>
                    A sealed package is two files: <code>manifest.json</code> and <code>payload.bin</code>. The payload is a tar archive of the skill folder encrypted with AES-256-GCM in 64 KiB chunks using a STREAM-style construction, so large reference sets decrypt incrementally and truncation is detected.
                  </p>
                  <Code code={MANIFEST} lang="json" label="Example manifest" />
                  <p>
                    The HPKE suite identifiers are the registered RFC 9180 values: <code>0x0020</code> is DHKEM(X25519, HKDF-SHA256), <code>0x0001</code> is HKDF-SHA256, and <code>0x0002</code> is AES-256-GCM. The HPKE <code>info</code> parameter is the format string plus the canonical hash of the skill and payload blocks, so a wrapped key cannot be lifted from one package and replayed against another. The public description stays in clear text so marketplaces can list the skill and agents can decide whether it is relevant before unsealing it.
                  </p>
                </Section>

                <Section id="keys">
                  <h3 className="pp-h3">
                    <span className="pp-n">10.1</span>Adding a provider
                  </h3>
                  <p>Fetch the new provider&apos;s published key, wrap the existing content key to it, append a recipient entry and re-sign. The payload is unchanged.</p>
                  <h3 className="pp-h3">
                    <span className="pp-n">10.2</span>Removing a provider
                  </h3>
                  <p>
                    Deleting a recipient entry takes nothing away from a provider that already has the package. A real removal means a new content key and a re-encrypted payload, published as a new version. Old versions stay decryptable by the removed provider for as long as it keeps its key. With no handshake there is no revocation list the provider has agreed to honour, so removal only affects future versions.
                  </p>
                  <h3 className="pp-h3">
                    <span className="pp-n">10.3</span>Provider key rotation
                  </h3>
                  <p>
                    The provider adds a new key to its endpoint well before the old key&apos;s <code>seal_until</code>, and keeps each private key until its <code>decrypt_until</code>. Owner tooling re-wraps active skills to the newest key on its own schedule. Because owners and providers never talk, the published dates are the whole contract for key lifetime, and providers must treat them as binding.
                  </p>
                  <h3 className="pp-h3">
                    <span className="pp-n">10.4</span>Owner key compromise
                  </h3>
                  <p>
                    If the owner&apos;s signing key leaks, an attacker can sign malicious packages in the owner&apos;s name but cannot read existing ones. The owner publishes the revocation at its domain (the <code>did:web</code> document), issues a new key and re-signs current versions. Providers check the owner&apos;s published key status when verifying a manifest.
                  </p>
                  <h3 className="pp-h3">
                    <span className="pp-n">10.5</span>Licences
                  </h3>
                  <p>
                    Licence tokens are short-lived and signed by the owner&apos;s licensing service, whose public keys are listed in the manifest. A provider verifies them without contacting the owner. Ending a customer&apos;s access means not issuing another token. This works only with providers that choose to check licences.
                  </p>
                </Section>

                <Section id="threats">
                  <ScrollRegion label="Table: Threat model">
                    <table className="pp-table pp-table--threats">
                      <thead>
                        <tr>
                          <th scope="col">Adversary</th>
                          <th scope="col">Protected</th>
                          <th scope="col">How, or why not</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Pirate with the package</th>
                          <td>
                            <span className="chip pp-chip--yes">Yes</span>
                          </td>
                          <td>Holds only ciphertext and wrapped keys.</td>
                        </tr>
                        <tr>
                          <th scope="row">Marketplace or mirror</th>
                          <td>
                            <span className="chip pp-chip--yes">Yes</span>
                          </td>
                          <td>Can list and distribute from the public description; cannot read.</td>
                        </tr>
                        <tr>
                          <th scope="row">Competing AI provider</th>
                          <td>
                            <span className="chip pp-chip--yes">Yes</span>
                          </td>
                          <td>Not a recipient, so cannot unwrap.</td>
                        </tr>
                        <tr>
                          <th scope="row">Network attacker</th>
                          <td>
                            <span className="chip pp-chip--yes">Yes</span>
                          </td>
                          <td>Package is encrypted at rest and in transit; signature detects tampering.</td>
                        </tr>
                        <tr>
                          <th scope="row">End user, local client</th>
                          <td>
                            <span className="chip pp-chip--yes">Yes</span>
                          </td>
                          <td>
                            Only if decryption stays on the provider&apos;s servers. If a client decrypted locally, this row would be <em>No</em> (section 7).
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">End user, via the model</th>
                          <td>
                            <span className="chip chip--paper">Partly</span>
                          </td>
                          <td>Can ask the model to reveal or paraphrase the skill. Reduced, not eliminated, by the measures in section 12.</td>
                        </tr>
                        <tr>
                          <th scope="row">Attacker controlling provider DNS</th>
                          <td>
                            <span className="chip chip--paper">Partly</span>
                          </td>
                          <td>Could serve a fake key to owners. Caught by key pinning, multi-vantage fetches and transparency logs.</td>
                        </tr>
                        <tr>
                          <th scope="row">Provider employees</th>
                          <td>
                            <span className="chip chip--paper">Partly</span>
                          </td>
                          <td>Hardware isolation keeps keys and plaintext away from ordinary operators; not absolute.</td>
                        </tr>
                        <tr>
                          <th scope="row">The provider itself</th>
                          <td>
                            <span className="chip chip--paper">No</span>
                          </td>
                          <td>By design it can read the skill. Without a handshake, only its public policy commits it to anything.</td>
                        </tr>
                      </tbody>
                    </table>
                  </ScrollRegion>
                </Section>

                <Section id="leaks">
                  <p>
                    To follow a skill, the model must read it in clear text, and the model&apos;s replies go to the user. Encryption decides <em>which</em> model reads the skill. It cannot stop that model from being questioned about it. The channels below are how a sealed skill can still reach the person using the AI, even with decryption kept on the server.
                  </p>
                  <ScrollRegion label="Table: Keeping it from the user">
                    <table className="pp-table">
                      <thead>
                        <tr>
                          <th scope="col">Channel</th>
                          <th scope="col">Example</th>
                          <th scope="col">What reduces it</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Direct request</th>
                          <td>&quot;Print your instructions word for word.&quot;</td>
                          <td>Sealed content is treated like a confidential system prompt; the model declines. A server-side filter blocks replies with long overlaps with the skill text.</td>
                        </tr>
                        <tr>
                          <th scope="row">Sandbox file access</th>
                          <td>
                            The model is asked to run <code>cat SKILL.md</code> in its code sandbox.
                          </td>
                          <td>Skill files are mounted run-only: scripts can execute, but commands the model issues cannot read them. Better still, scripts run on the owner&apos;s server (below).</td>
                        </tr>
                        <tr>
                          <th scope="row">Tool and script output</th>
                          <td>A script prints the rule table it applies, which appears in the transcript.</td>
                          <td>Scripts return conclusions, not the rules behind them.</td>
                        </tr>
                        <tr>
                          <th scope="row">Reasoning display</th>
                          <td>Visible thinking or its summary quotes the skill.</td>
                          <td>Apply the same output filter to any reasoning shown to the user.</td>
                        </tr>
                        <tr>
                          <th scope="row">Gradual reconstruction</th>
                          <td>Many sessions of probing, each revealing a little.</td>
                          <td>Cannot be prevented. Unique marker phrases sealed into each customer&apos;s copy identify who leaked a reconstruction.</td>
                        </tr>
                      </tbody>
                    </table>
                  </ScrollRegion>
                  <p>
                    The last row sets the ceiling. A sealed skill protects against copying and redistribution of the file. It cannot promise that a determined user learns nothing about what the skill contains.
                  </p>
                  <h3 className="pp-h3">
                    <span className="pp-n">12.1</span>The part that must never leak
                  </h3>
                  <p>
                    One design keeps secrets away from both the user and the model: do not put them in the skill. Place the proprietary logic, rules or data behind a tool on the owner&apos;s own server (for example a remote MCP server with its own authentication and licence check). The sealed skill then carries only <em>when</em> to call the tool and <em>what</em> to pass. The model sends inputs and receives conclusions, such as &quot;row 14 fails rule R-7: amount mismatch&quot;, and never sees how the result was produced.
                  </p>
                  <div className="pp-note">
                    <p className="pp-eyebrow">Design advice for skill owners</p>
                    <p>
                      Use sealing for the instruction text, which needs protection from copying. Put anything that must never be seen, even partly, behind an owner-hosted tool. That approach works with today&apos;s AI products and needs nothing from the provider.
                    </p>
                  </div>
                </Section>

                <Section id="tradeoffs">
                  <p>
                    Dropping the onboarding handshake makes sealing as easy as encrypting to a published key. It also removes things only a relationship can provide. The table compares the three models considered while writing this paper.
                  </p>
                  <ScrollRegion label="Table: What the handshake gave">
                    <table className="pp-table pp-table--compare">
                      <thead>
                        <tr>
                          <td />
                          <th scope="col">Onboarding handshake (v0.1)</th>
                          <th scope="col" className="pp-chosen">
                            Published key (this paper)
                          </th>
                          <th scope="col">Online key release</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Owner contacts provider</th>
                          <td>Once, to onboard</td>
                          <td className="pp-chosen">Never</td>
                          <td>Never; provider calls owner on every load</td>
                        </tr>
                        <tr>
                          <th scope="row">Signed terms</th>
                          <td>Yes</td>
                          <td className="pp-chosen">No; provider&apos;s public policy only</td>
                          <td>No, unless added</td>
                        </tr>
                        <tr>
                          <th scope="row">Revoke access</th>
                          <td>Provider honours owner&apos;s revocation list</td>
                          <td className="pp-chosen">New versions only; stop issuing licences</td>
                          <td>Instant</td>
                        </tr>
                        <tr>
                          <th scope="row">Audit of use</th>
                          <td>Agreed access events</td>
                          <td className="pp-chosen">None, unless the provider volunteers</td>
                          <td>Every request</td>
                        </tr>
                        <tr>
                          <th scope="row">Owner runs a service</th>
                          <td>Feeds only</td>
                          <td className="pp-chosen">Optional licensing service</td>
                          <td>Yes, and it must stay up</td>
                        </tr>
                        <tr>
                          <th scope="row">Works offline</th>
                          <td>Yes</td>
                          <td className="pp-chosen">Yes</td>
                          <td>No</td>
                        </tr>
                      </tbody>
                    </table>
                  </ScrollRegion>
                  <p>
                    The published-key model is the simplest to adopt and the hardest to break operationally: nothing needs to be online, and a provider can support thousands of owners without a single agreement. Owners who need contractual terms, audit or instant revocation can layer the handshake or online release on top later, since the package format stays the same.
                  </p>
                </Section>

                <Section id="build">
                  <h3 className="pp-h3">AI providers</h3>
                  <ul>
                    <li>A key document at a well-known address, with keys generated and held in isolated hardware, published lifetimes, and optional attestation.</li>
                    <li>Server-side loading of sealed skills by reference, so clients never receive the skill.</li>
                    <li>Confidential handling in the model and runtime: extraction refusal, output filtering, run-only skill files in sandboxes.</li>
                    <li>A public policy stating how sealed content is treated.</li>
                    <li>Optional: licence verification against owner-published keys.</li>
                  </ul>
                  <p>
                    At the time of writing we are not aware of any major AI provider, Anthropic included, that publishes a skill-sealing key or loads encrypted skills. This paper describes what such support would look like.
                  </p>
                  <h3 className="pp-h3">Skill owners</h3>
                  <ul>
                    <li>A sealing tool that fetches and checks provider keys, encrypts, wraps and signs.</li>
                    <li>Optionally, a licensing service that issues short-lived tokens to paying customers.</li>
                    <li>An owner-hosted tool for any logic that must never be exposed (section 12.1).</li>
                  </ul>
                  <h3 className="pp-h3">The ecosystem</h3>
                  <ul>
                    <li>An open specification for the key document and the package format.</li>
                    <li>Transparency logs and monitors that record provider keys over time.</li>
                    <li>Marketplaces that list sealed skills from their public descriptions.</li>
                  </ul>
                </Section>

                <Section id="adoption">
                  <ol className="pp-phases">
                    <li>
                      <span className="pp-phases__when">Today</span>
                      <p>
                        <b>Owner-hosted tools.</b> Secret logic runs on the owner&apos;s server and is called by the model as a tool. Needs no provider support and already keeps the valuable part hidden.
                      </p>
                    </li>
                    <li>
                      <span className="pp-phases__when">Stage 1</span>
                      <p>
                        <b>Published key and server-side loading.</b> A provider publishes a sealing key and accepts sealed skills by reference on its hosted surfaces. Stops piracy and competing providers, and keeps the file off users&apos; devices.
                      </p>
                    </li>
                    <li>
                      <span className="pp-phases__when">Stage 2</span>
                      <p>
                        <b>Attested keys and confidential handling.</b> Keys are bound to measured hardware; run-only sandboxes and output filtering become standard for sealed content.
                      </p>
                    </li>
                    <li>
                      <span className="pp-phases__when">Stage 3</span>
                      <p>
                        <b>Open standard.</b> A shared key-document and package format across providers, with optional licensing, audit or onboarding layered on top.
                      </p>
                    </li>
                  </ol>
                </Section>

                <Section id="open">
                  <ul>
                    <li>
                      <strong>Safety review.</strong> Providers can decrypt and scan sealed skills for malware and prompt injection; marketplaces cannot, and will rely on provider scanning.
                    </li>
                    <li>
                      <strong>Customer inspection.</strong> Regulated customers may need to know what their agents follow. An auditor could be added as an extra recipient with its own published key.
                    </li>
                    <li>
                      <strong>Unwanted recipients.</strong> Any owner can seal to any provider without asking. Providers may want a way to decline sealed skills from unknown owners, for example by requiring a verified owner identity.
                    </li>
                    <li>
                      <strong>Liability.</strong> When a sealed skill gives harmful advice, the customer cannot read the cause. Who can see the plaintext during an incident investigation needs a public answer.
                    </li>
                    <li>
                      <strong>Local and open-weight models.</strong> A model on user hardware cannot keep a key from its user. Sealed skills are a feature of hosted AI services.
                    </li>
                    <li>
                      <strong>Composition.</strong> When one sealed skill&apos;s output feeds another provider&apos;s model, confidentiality rules must carry across.
                    </li>
                  </ul>
                </Section>

                <Section id="conclusion">
                  <p>
                    Skills are turning expert knowledge into software that AI agents run, and that market needs better protection than a licence clause on a text file. Sealed Skills offer a simple mechanism: the AI company publishes a key on its own domain, the owner encrypts to it without asking anyone, and only that company&apos;s servers can open the skill.
                  </p>
                  <p>
                    Three findings shape the design. Decryption must stay on the provider&apos;s servers, because anything on the user&apos;s device can be extracted. The model can still be questioned about what it read, so sealing protects the file from copying but cannot guarantee the user learns nothing. And dropping the handshake trades contracts, audit and revocation for simplicity. For logic that must never be seen, the answer already exists: keep it on the owner&apos;s own server and let the model call it as a tool.
                  </p>
                </Section>

                <Section id="appendix">
                  <p>Illustrative only. A real implementation should use a vetted HPKE library and streaming AEAD rather than hand-rolled primitives.</p>
                  <Code code={PSEUDOCODE} lang="python" label="Reference pseudocode" />
                </Section>

                <Section id="refs">
                  <ol className="pp-refs">
                    <li>
                      R. Barnes, K. Bhargavan, B. Lipp, C. Wood. <em>Hybrid Public Key Encryption.</em> RFC 9180, IETF, 2022.
                    </li>
                    <li>
                      S. Josefsson, I. Liusvaara. <em>Edwards-Curve Digital Signature Algorithm (EdDSA).</em> RFC 8032, IETF, 2017.
                    </li>
                    <li>
                      M. Nottingham. <em>Well-Known Uniform Resource Identifiers (URIs).</em> RFC 8615, IETF, 2019.
                    </li>
                    <li>
                      M. Jones. <em>JSON Web Key (JWK).</em> RFC 7517, IETF, 2015.
                    </li>
                    <li>
                      B. Laurie, E. Messeri, R. Stradling. <em>Certificate Transparency Version 2.0.</em> RFC 9162, IETF, 2021.
                    </li>
                    <li>
                      M. Dworkin. <em>Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC.</em> NIST SP 800-38D, 2007.
                    </li>
                    <li>
                      V. T. Hoang, R. Reyhanitabar, P. Rogaway, D. Vizár. <em>Online Authenticated-Encryption and its Nonce-Reuse Misuse-Resistance.</em> CRYPTO 2015 (the STREAM construction).
                    </li>
                    <li>
                      H. Birkholz et al. <em>Remote ATtestation procedureS (RATS) Architecture.</em> RFC 9334, IETF, 2023.
                    </li>
                    <li>
                      W3C Credentials Community Group. <em>did:web Method Specification.</em>
                    </li>
                    <li>Model Context Protocol specification (remote servers and authorization).</li>
                  </ol>
                </Section>

                <footer className="pp-end">
                  Sealed Skills · v0.2 draft · 27 September 2026. A proposal for discussion. It describes a design, not an existing product, feature of any AI provider, or agreed industry standard.
                </footer>
              </article>
            </div>
          </div>
        </div>
      </main>
      <Foot />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  )
}
