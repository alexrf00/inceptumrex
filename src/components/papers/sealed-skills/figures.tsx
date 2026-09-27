import { Sequence } from "@/components/papers/Sequence"

// The figures of "Sealed Skills", redrawn from the owner's draft in the site's
// print: black line work on newsprint, no fills, no rounded corners. Solid
// rules are open ground; dashed rules mark what is sealed (the encrypted
// payload, the provider's trust boundary). Every shape and text carries
// presentation attributes in currentColor, so a figure still prints in black
// line work on a page without papers.css; papers.css restyles it with the site
// tokens (Press Black rules, Press Grey notes, Archivo and Archivo Narrow).

const join = (...names: (string | undefined)[]) => names.filter(Boolean).join(" ")

// Figure 1. Anatomy of a sealed package.
export function PackageAnatomy({ className }: { className?: string }) {
  return (
    <svg
      className={join("pp-svg", className)}
      viewBox="0 0 720 330"
      role="img"
      aria-label="Structure of a sealed skill package: a signed manifest containing skill metadata, policy, and one wrapped content key per provider, next to an encrypted payload holding the skill files."
    >
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        <rect className="pp-fig-frame" x={8} y={8} width={704} height={314} strokeWidth={2} />
        <rect className="pp-fig-box" x={26} y={72} width={300} height={62} />
        <rect className="pp-fig-box" x={26} y={146} width={300} height={62} />
        <rect className="pp-fig-box" x={26} y={248} width={145} height={56} />
        <rect className="pp-fig-box" x={181} y={248} width={145} height={56} />
        <path className="pp-fig-link" d="M326 276 H 380 V 150 H 400" strokeWidth={1.25} />
        <rect className="pp-fig-sealed" x={400} y={72} width={292} height={232} strokeWidth={1.5} strokeDasharray="6 4" />
      </g>
      <g fill="currentColor">
        <rect className="pp-fig-key" x={40} y={270} width={12} height={12} />
        <rect className="pp-fig-key" x={195} y={270} width={12} height={12} />
      </g>
      <g fill="currentColor" fontSize={12}>
        <text className="pp-fig-head" x={26} y={36} fontWeight={700}>
          SIGNED MANIFEST
        </text>
        <text className="pp-fig-small" x={26} y={54}>
          Ed25519 signature by the skill owner over everything below
        </text>
        <text className="pp-fig-name" x={40} y={96} fontSize={14} fontWeight={600}>
          Skill metadata
        </text>
        <text className="pp-fig-mono" x={40} y={118}>
          id · version · public description
        </text>
        <text className="pp-fig-name" x={40} y={170} fontSize={14} fontWeight={600}>
          Policy
        </text>
        <text className="pp-fig-mono" x={40} y={192}>
          licence issuer · confidential flag
        </text>
        <text className="pp-fig-head" x={26} y={236} fontWeight={700}>
          RECIPIENTS
        </text>
        <text className="pp-fig-name pp-fig-name--sm" x={60} y={272} fontSize={13} fontWeight={600}>
          Provider A
        </text>
        <text className="pp-fig-mono" x={60} y={290}>
          HPKE(CEK)
        </text>
        <text className="pp-fig-name pp-fig-name--sm" x={215} y={272} fontSize={13} fontWeight={600}>
          Provider B
        </text>
        <text className="pp-fig-mono" x={215} y={290}>
          HPKE(CEK)
        </text>
        <text className="pp-fig-small" x={336} y={268}>
          unwraps
        </text>
        <text className="pp-fig-head" x={416} y={98} fontWeight={700}>
          ENCRYPTED PAYLOAD
        </text>
        <text className="pp-fig-small" x={416} y={116}>
          AES-256-GCM under the CEK, 64 KiB chunks
        </text>
        <text className="pp-fig-mono" x={428} y={152}>
          SKILL.md
        </text>
        <text className="pp-fig-mono" x={428} y={176}>
          scripts/reconcile.py
        </text>
        <text className="pp-fig-mono" x={428} y={200}>
          scripts/validate.py
        </text>
        <text className="pp-fig-mono" x={428} y={224}>
          references/rules-2026.md
        </text>
        <text className="pp-fig-mono" x={428} y={248}>
          references/edge-cases.md
        </text>
        <text className="pp-fig-small" x={416} y={286}>
          Unreadable without a provider&apos;s private key
        </text>
      </g>
    </svg>
  )
}

// Figure 3. The trust boundary. The user's device is drawn solid (open ground,
// everything on it is visible); the provider's servers are the dashed trust
// boundary, the only place the skill exists in clear text.
export function TrustBoundary({ className }: { className?: string }) {
  return (
    <svg
      className={join("pp-svg", className)}
      viewBox="0 0 720 250"
      role="img"
      aria-label="Two zones. The user's device holds the client application, which sends only a skill ID and licence. The provider's servers hold the private key, decrypt the skill and run the model, and return only answers."
    >
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        <rect className="pp-fig-zone" x={8} y={8} width={250} height={234} strokeWidth={1.5} />
        <rect className="pp-fig-zone pp-fig-zone--sealed" x={370} y={8} width={342} height={234} strokeWidth={2} strokeDasharray="7 5" />
        <rect className="pp-fig-box" x={24} y={72} width={218} height={58} />
        <rect className="pp-fig-box" x={386} y={72} width={150} height={58} />
        <rect className="pp-fig-box" x={548} y={72} width={148} height={58} />
        <rect className="pp-fig-box" x={386} y={150} width={310} height={54} />
        <path className="pp-fig-arrow" d="M242 92 H 371" strokeWidth={1.5} />
        <path className="pp-fig-arrow" d="M380 186 H 250 V 147" strokeWidth={1.5} />
      </g>
      <g fill="currentColor">
        <rect className="pp-fig-key" x={398} y={95} width={12} height={12} />
        <polygon className="pp-fig-tip" points="380,92 371,87.5 371,96.5" />
        <polygon className="pp-fig-tip" points="250,138 245.5,147 254.5,147" />
      </g>
      <g fill="currentColor" fontSize={12}>
        <text className="pp-fig-head" x={24} y={34} fontWeight={700}>
          USER&apos;S DEVICE
        </text>
        <text className="pp-fig-small" x={24} y={52}>
          Everything here is visible to the user
        </text>
        <text className="pp-fig-name" x={38} y={96} fontSize={14} fontWeight={600}>
          Client application
        </text>
        <text className="pp-fig-mono" x={38} y={116}>
          chat, desktop, CLI agent
        </text>
        <text className="pp-fig-small" x={24} y={162}>
          Holds: skill ID, licence token
        </text>
        <text className="pp-fig-small" x={24} y={182}>
          Never holds: private key,
        </text>
        <text className="pp-fig-small" x={24} y={200}>
          content key, skill text
        </text>
        <text className="pp-fig-head" x={386} y={34} fontWeight={700}>
          PROVIDER SERVERS
        </text>
        <text className="pp-fig-small" x={386} y={52}>
          The only place the skill exists in clear text
        </text>
        <text className="pp-fig-name pp-fig-name--sm" x={418} y={97} fontSize={13} fontWeight={600}>
          Private key
        </text>
        <text className="pp-fig-mono" x={418} y={116}>
          unwrap, decrypt
        </text>
        <text className="pp-fig-name pp-fig-name--sm" x={562} y={97} fontSize={13} fontWeight={600}>
          Model
        </text>
        <text className="pp-fig-mono" x={562} y={116}>
          skill in context
        </text>
        <text className="pp-fig-name pp-fig-name--sm" x={400} y={173} fontSize={13} fontWeight={600}>
          Output filter
        </text>
        <text className="pp-fig-mono" x={400} y={192}>
          blocks replies that match skill text
        </text>
        <text className="pp-fig-small" x={262} y={84}>
          skill ID + licence
        </text>
        <text className="pp-fig-small" x={268} y={210}>
          answers only
        </text>
      </g>
    </svg>
  )
}

// Figure 2. Sealing, from the draft's mermaid source.
export function SealingSequence() {
  return (
    <Sequence
      label="Sequence diagram of sealing between AI provider, provider domain /.well-known, Skill owner and Any host (marketplace, CDN). Its six steps follow as a list."
      participants={[
        { id: "P", label: "AI provider" },
        { id: "W", label: "provider domain /.well-known" },
        { id: "O", label: "Skill owner" },
        { id: "D", label: "Any host (marketplace, CDN)" },
      ]}
      messages={[
        { kind: "sync", from: "P", to: "W", text: "Publish sealing public key (once, rotated on schedule)" },
        { kind: "sync", from: "O", to: "W", text: "Fetch key over HTTPS" },
        { kind: "self", from: "O", to: "O", text: "Check certificate, pin, optional attestation" },
        { kind: "self", from: "O", to: "O", text: "Encrypt skill, wrap CEK, sign manifest" },
        { kind: "sync", from: "O", to: "D", text: "Publish sealed package" },
        { kind: "note", over: ["O", "P"], text: "No message from owner to provider" },
      ]}
    />
  )
}

// Figure 4. Load-time unsealing, from the draft's mermaid source.
export function UnsealingSequence() {
  return (
    <Sequence
      label="Sequence diagram of load-time unsealing between Client app (user's device), Owner licensing service, Provider servers and Model. Its nine steps follow as a list."
      participants={[
        { id: "U", label: "Client app (user's device)" },
        { id: "K", label: "Owner licensing service" },
        { id: "S", label: "Provider servers" },
        { id: "M", label: "Model" },
      ]}
      messages={[
        { kind: "sync", from: "U", to: "K", text: "Buy / renew licence" },
        { kind: "reply", from: "K", to: "U", text: "Signed licence token" },
        { kind: "sync", from: "U", to: "S", text: "Skill ID + licence token (no skill content)" },
        { kind: "self", from: "S", to: "S", text: "Fetch package, verify owner signature and licence" },
        { kind: "self", from: "S", to: "S", text: "Unwrap CEK with private key, decrypt in memory" },
        { kind: "sync", from: "S", to: "M", text: "Load skill as sealed context" },
        { kind: "reply", from: "M", to: "S", text: "Draft reply" },
        { kind: "self", from: "S", to: "S", text: "Filter reply against skill text" },
        { kind: "reply", from: "S", to: "U", text: "Answer only" },
      ]}
    />
  )
}
