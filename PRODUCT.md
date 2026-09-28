# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: people deciding whether to hire, contract or partner with Alex.** Engineering managers and recruiters in New York; founders and small-business owners in New York and the Dominican Republic who need software built. They arrive from a résumé, LinkedIn, GitHub or a referral, usually on a laptop between other tasks, and decide in well under a minute whether this person ships.
- **Secondary: people who met the work first.** Players who find Big Party on Steam or bigparty.me and click through to the developer; Dominican users of LuzRD or Fiscalia who want to know who built them.

## Product Purpose

inceptumrex.com is the personal portfolio of Alex M. Rodriguez, with InceptumRex as the studio label. It shows every project and game Alex has built (shipped, live and prototype) with real imagery, carries the papers and research papers Alex writes on a screen of their own (`/papers`), and turns interest into a work inquiry through one contact form. Success: within the first screen a visitor sees the range (games, fiscal software, civic tools) and the proof (live sites, a Steam listing, real screenshots), then follows a live link or sends an inquiry.

The site used to sell computer repair and IT support. Owner decision (2026-09-27): **portfolio only**. The repair-business copy, service list, hours and "certified technicians" claims are retired; one contact form stays for work inquiries.

## Positioning

One engineer who builds whole products end to end, across worlds that rarely share a résumé: a three.js online party game on Steam, a DGII electronic-invoicing platform for Dominican businesses, a live national blackout tracker with real search traffic, a Dominican-folklore co-op horror game. Born in the Dominican Republic, working from New York; several products exist because of that double home.

## Operating Context

- Live at inceptumrex.com (Vercel, Cloudflare in front). Existing SEO plumbing: next-sitemap postbuild, robots.txt, Vercel Analytics.
- Work inquiries arrive through Basin (the existing `usebasin.com` form endpoint) and land in the InceptumRex inbox.
- Visitors usually come with context in hand: a résumé, a LinkedIn message, a Steam store page, a LuzRD or Fiscalia link.
- Other live properties the site links out to: bigparty.me (Big Party site), Steam app 4633150 (Big Party) and 4996010 (its free demo), luzrd.do, fiscaliaservice.com, battlepasstimer.vercel.app, github.com/alexrf00, linkedin.com/in/alex-rodriguez-fernandez.

## Capabilities and Constraints

- **Stack (existing, keep):** Next.js 15.3 App Router, React 19.1, Tailwind CSS 4, next-sitemap, @vercel/analytics. three.js is requested by the owner for the new build.
- **Contact form:** keep the Basin endpoint and the field names `name`, `phone`, `email`, `message`; purpose changes from service requests to work inquiries.
- **Language:** English (chosen by default in the 2026-09-27 session; the owner was not asked). Spanish product names and taglines stay in Spanish.
- **Most repositories are private.** Link to live products, store pages and the GitHub profile, never to private repos.
- **Status honesty:** BIG PARTY (the 2D Godot game) is "Coming soon" on Steam with a free demo released 2026-08-06 and a free itch.io build; Big Party 3D (the three.js remake) is in development and not released, and its iOS build is not publicly listed; Fixion and Omni Run are prototypes; BxGoatDrip, ASEPRE and BrolickGym are currently offline; dubbtogether, Excel Enricher and Stitch Designer are local or desktop tools with no public build.
- **Fiscalia is an ERP** (owner, 2026-09-27: «showcase my ERP system»): point of sale with cash shifts, invoices with credit and debit notes, inventory by branch with lot expiry, purchases and expenses, recurring billing, payroll with TSS and IR-3, and the DGII's 606 and 609 report files, around the e-CF core. Claims follow the product's own marketing rules: the POS takes cash, transfer or cheque (card is "coming soon", never claimed), and nothing implies multi-business, an API or a customer portal.
- **Fiscalia wording:** DGII certified Alex's own taxpayer registration as an electronic invoicer (Facturador Electrónico) using Fiscalia's software, on 2026-05-03 and again on a fresh production account on 2026-09-11. Never call Fiscalia a "DGII-certified provider". Documents are signed with XMLDSig (RSA-SHA256). The product is pre-revenue. Product screenshots come from a demo tenant running against a DGII simulator, so any "accepted by DGII" state on screen is simulated and must be labelled that way.
- **Big Party art:** the 3D game's images are rendered inside the game; the 2D game's sprites and painted capsules are AI-generated and must be labelled as such if shown.
- **Credit:** Fixion was co-developed with Frankely Diaz, who wrote most of its core gameplay; Alex built its menus, Steam networking and lobbies, economy and backend worker, and map pipeline. BrolickGym was a collaboration.
- **Never publish:** secrets or keys, personal documents, other people's personal data (for example LuzRD's live chat names), Steamworks or other confidential dashboards, client logos without permission, and third-party or unknown-source artwork (the Fixion Ciguapa paintings, the Omni Run mascots).
- **Numbers:** only figures that come from the owner's own data (store listings, the LuzRD Search Console export, repository history) or the owner's own résumé. The résumé's 40% and 60% figures are the owner's statements from the résumé PDFs and appear only there. No invented metrics.

## Brand Commitments

- **Name:** "Alex M. Rodriguez" leads the site; "InceptumRex" is the studio label (owner decision, 2026-09-27).
- **Logo (owner-supplied 2026-09-27):** the InceptumRex emblem, a crowned R in a cyan circuit ring on a black disc, and the full lockup "INCEPTUM REX / TECHNICAL SERVICES" (`public/brand/`). It replaces the IT-repair-era favicon. Use it as supplied.
- **Existing social look (evidence, not a binding commitment):** the InceptumRex Instagram reels use charcoal and near-black grounds, one orange accent, a condensed grotesk in caps, and "INCEPTUMREX" set in tracked capitals.
- **Voice:** first person, plain and direct; states what was built and what it does.

## Evidence on Hand

- **Big Party 3D (three.js):** in-game renders of six modes (Last Standing, Curse Tag, Checkmate Canyon, Floor Collapse, Color Conquest, Gold Rush), the library hero and capsules, the app icon, and the live bigparty.me site. **BIG PARTY (2D):** the Steam listing, header and screenshot, and real gameplay captures.
- **Fixion:** procedural night renders of the Cafetal de Baítoa map (v2), shrine and shanty close-ups, the lobby and results screens, and 2D prototype stills.
- **Fiscalia:** the live fiscaliaservice.com marketing site; product screenshots from demo tenants.
- **LuzRD:** the live luzrd.do map (use crops without the live chat) and the owner's Search Console export.
- **BattlePassTimer:** the live site.
- **Portrait:** the photo the owner chose in chat (red cap, black pug), EXIF stripped.
- **Résumé:** the owner's two résumé PDFs (Feb 2026 and an earlier version), merged; titles and dates follow the Feb 2026 one. They also carry a personal Gmail and a phone number, which the site does not publish. The downloadable résumé (`public/Alex-M-Rodriguez-Resume.pdf`) is the Feb 2026 PDF with those two redacted and inceptumrex@gmail.com and inceptumrex.com in their place.
- **Papers and research papers (owner, 2026-09-27: «differentiate clearly papers from research papers»):** two kinds, never mixed. A paper is an essay or an article for any reader; a research paper is technical work for specialists (the question, the design or method, the analysis and the sources). The owner classes Sealed Skills as a research paper (a position paper is one kind of research paper). No paper is out yet, and the site says so instead of inventing one.
- **Research papers:** *Sealed Skills* (v1.0, a systems and measurement study, preprint draft, not peer reviewed, 27 September 2026). It grew out of the v0.2 position paper: it builds the design (encrypting AI agent skills to a key the AI company publishes on its own domain) and measures what still leaks through the model. It is a design and a study, not a product, a feature of any AI provider or a standard, and says so. `/papers/sealed-skills` sets its abstract, introduction, results, limitations and conclusion verbatim (condensed where marked) and links the full PDF (`public/papers/sealed-skills.pdf`) and the public repository github.com/alexrf00/sealed-skills. Its numbers come from that repository's `results/`; never restate them from memory.
- **Absences (do not fabricate):** no gameplay video for Fixion or Omni Run; no screenshots for BxGoatDrip, dubbtogether, Stitch Designer or Excel Enricher; no testimonials; no client list beyond named work.

## Product Principles

1. **Proof before adjectives.** Every project shows a real artifact and its honest status; the claim is the screenshot.
2. **Range is the story, depth is the proof.** Games and fiscal software share the stage; each earns one concrete engineering fact.
3. **Everything at once, one action.** The first screen holds all the work; the page asks for exactly one thing, a work inquiry.
4. **Credit and status are part of the craft.** Prototypes are labeled, collaborators are named, offline work is marked as such, and a draft paper says it is a draft.
5. **Dominican and New York roots are content, not decoration.**

## Accessibility & Inclusion

- WCAG 2.2 AA contrast and full keyboard access.
- Every WebGL/three.js moment needs a complete non-WebGL and `prefers-reduced-motion` equivalent; the work must stay readable with the 3D off.
- Must stay smooth on mid-range phones; a large share of the Dominican audience browses on mobile.
