// Single source of truth for everything the site says about the work.
// Every fact here is checked against the owner's repos, store listings, live
// sites or his own analytics export (see PRODUCT.md). No invented numbers.

export type Tone = "pink" | "yellow" | "orange" | "paper"

export type Shot = {
  src: string
  alt: string
  width: number
  height: number
}

// How a paper entry is set, chosen from the measured heights of its parts:
// "wide" puts the pictures across the sheet; "row" sets pictures beside the
// text with the facts as a full-width row under both; "side" hangs the facts
// under the text where the pictures run longer.
export type EntryLayout = "wide" | "row" | "side"

export type Project = {
  id: string
  layout: EntryLayout
  name: string
  kind: string
  years: string
  status: { label: string; tone: Tone; note?: string }
  line: string
  body: string
  detail: string
  role: string
  stack: string[]
  links: { label: string; href: string }[]
  shots: Shot[]
  caption?: string
}

export type Minor = {
  id: string
  name: string
  line: string
  status: string
  years: string
  stack: string
}

export const featured: Project[] = [
  {
    id: "big-party",
    layout: "wide",
    name: "Big Party 3D",
    kind: "Game",
    years: "2026",
    status: { label: "In development", tone: "yellow", note: "2D demo free on Steam" },
    line: "An online party brawl for up to 12 outlaws, rebuilt in three.js.",
    body:
      "Big Party began as a 2D Godot game whose free demo has been on Steam since August 6, 2026. The 3D remake builds its ranchers, arenas and most of its sound in code on three.js, over a hand-written character controller. Eight modes so far: shove rivals off a floating island, survive a werewolf hunt at night, play chess with living pieces or sit down to Dominican dominó.",
    detail:
      "Online camps of up to 12 run on Epic Online Services lobbies and peer-to-peer, with eight local couch seats, voice chat and ten languages. A Cloudflare Worker with a Durable Object keeps accounts, friends and the purchase ledger. Builds go to Steam through Electron, and an iPhone build runs the same game in a native shell.",
    role: "Solo: design, code, netcode, backend",
    stack: ["three.js", "JavaScript", "Electron", "steamworks.js", "Epic Online Services", "Cloudflare Workers"],
    links: [
      { label: "bigparty.me", href: "https://bigparty.me" },
      { label: "BIG PARTY (2D) on Steam", href: "https://store.steampowered.com/app/4633150/BIG_PARTY/" },
      { label: "Free 2D demo", href: "https://store.steampowered.com/app/4996010/" },
    ],
    shots: [
      { src: "/work/bigparty-hero.webp", alt: "Big Party 3D: ranchers and a werewolf brawling on a floating grass island at sunset, one rancher thrown through the air", width: 2400, height: 776 },
      { src: "/work/bigparty-curse-tag.webp", alt: "Curse Tag: a rancher runs from the werewolf through a low-poly forest at night", width: 1600, height: 900 },
      { src: "/work/bigparty-checkmate-canyon.webp", alt: "Checkmate Canyon: a chess duel with living purple and gold pieces", width: 1600, height: 900 },
      { src: "/work/bigparty-color-conquest.webp", alt: "Color Conquest: an arena floor painted in six team colors", width: 1600, height: 900 },
    ],
    caption: "Rendered inside the game.",
  },
  {
    id: "fiscalia",
    layout: "row",
    name: "Fiscalia",
    kind: "Product",
    years: "2025 to now",
    status: { label: "Live site", tone: "pink", note: "pre-revenue" },
    line: "Electronic invoicing for Dominican businesses, built to the DGII's rules.",
    body:
      "Fiscalia issues all ten e-CF document types. Each invoice is built, checked against the DGII's official schemas and business rules, signed and sent, and the customer gets a printable invoice with its QR and security code. Around that fiscal core sit the tools a small business runs on: point of sale with cash shifts, inventory with lot expiry, recurring billing, 606 and 609 report files and payroll.",
    detail:
      "The DGII certified my own taxpayer registration as an electronic invoicer using Fiscalia, on May 3, 2026 and again on a fresh production account on September 11. Three services back it: a Spring Boot system of record, a stateless bridge that signs with XMLDSig and talks to the DGII, and a Next.js front end, with 9,361 automated tests between them.",
    role: "Solo founder-engineer",
    stack: ["Java 21", "Spring Boot", "Next.js", "PostgreSQL", "Kong", "Cloudflare"],
    links: [{ label: "fiscaliaservice.com", href: "https://www.fiscaliaservice.com" }],
    shots: [
      { src: "/work/fiscalia-pos.webp", alt: "Fiscalia point of sale after a sale: order 002 paid, RD$ 463.00, with its fiscal receipt", width: 1600, height: 900 },
      { src: "/work/fiscalia-cockpit.webp", alt: "Fiscalia DGII cockpit: ITBIS collected, paid and net for September 2026, and e-NCF ranges by document type", width: 1600, height: 900 },
      { src: "/work/fiscalia-catalog.webp", alt: "Fiscalia product catalog with stock counts across locations", width: 1600, height: 900 },
    ],
    caption: "A demo business running against the DGII simulator; the accepted state shown is simulated.",
  },
  {
    id: "luzrd",
    layout: "wide",
    name: "LuzRD",
    kind: "Civic tool",
    years: "2026",
    status: { label: "Live", tone: "orange" },
    line: "A real-time blackout tracker for the Dominican Republic.",
    body:
      "LuzRD puts neighbors' outage reports and the three power distributors' published outages on one live map of all 32 provinces, down to 12,429 barrios. An area is confirmed after three reports and database triggers roll its status up the map. It also shows the national grid, recent earthquakes and the weather, sends alerts for your zone and hosts a moderated live chat.",
    detail:
      "In the three months of Google Search data ending July 3, 2026, the home page earned 2,305 clicks from 43,088 impressions at an average position of 4.3, and 93% of those clicks came from phones.",
    role: "Solo",
    stack: ["Next.js", "TypeScript", "Supabase", "Leaflet", "Gemini", "Web Push"],
    links: [{ label: "luzrd.do", href: "https://luzrd.do" }],
    shots: [
      { src: "/work/luzrd-map.webp", alt: "LuzRD live map of the Dominican Republic with outage zones, grid status and recent earthquakes", width: 1600, height: 718 },
    ],
  },
  {
    id: "fixion",
    layout: "side",
    name: "Fixion",
    kind: "Game",
    years: "2026",
    status: { label: "Prototype", tone: "paper" },
    line: "Dominican-folklore co-op survival horror for one to four players.",
    body:
      "Up to four investigators enter a coffee plantation at night, gather three ritual items and perform a conjuration to banish the Ciguapa before they escape. She hunts in four phases and whispers her story during the match, while sanity, stamina, batteries and noise decide who makes it out.",
    detail:
      "I built the menus, Steam networking and lobbies, the points economy with its Cloudflare Worker backend, and the procedural Blender pipeline behind the Cafetal de Baítoa map. Frankely Diaz wrote most of the core gameplay.",
    role: "Co-developer with Frankely Diaz",
    stack: ["Godot 4", "GDScript", "GodotSteam", "Cloudflare Workers", "D1", "Blender"],
    links: [],
    shots: [
      { src: "/work/fixion-map.webp", alt: "Night render of the Cafetal de Baítoa map: drying patio, terraced coffee, shanties and a river shrine", width: 1800, height: 1126 },
      { src: "/work/fixion-shrine.webp", alt: "A lantern-lit shrine by the river", width: 760, height: 520 },
      { src: "/work/fixion-results.webp", alt: "The Fixion results screen: PERDIDO, the objective checklist and the match rewards", width: 1600, height: 862 },
    ],
    caption: "Playable prototype, not released.",
  },
  {
    id: "battlepasstimer",
    layout: "row",
    name: "BattlePassTimer",
    kind: "Web app",
    years: "2025 to 2026",
    status: { label: "Live", tone: "orange" },
    line: "Every battle pass reset, counted down in one place.",
    body:
      "Real-time countdowns and season progress for Fortnite, Valorant, Apex Legends, Warzone and six more games, with a page for each game.",
    detail: "Per-game pages, an FAQ and a custom 404, deployed on Vercel.",
    role: "Solo",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    links: [{ label: "battlepasstimer.vercel.app", href: "https://battlepasstimer.vercel.app" }],
    shots: [
      { src: "/work/battlepass.webp", alt: "BattlePassTimer home page: never miss a battle pass reset", width: 1440, height: 735 },
    ],
  },
]

export const minor: Minor[] = [
  {
    id: "omni-run",
    name: "Omni Run",
    line: "A hunter-versus-runners parkour party shooter: one hunter converts the runners racing from A to B.",
    status: "Prototype",
    years: "2026",
    stack: "Unreal Engine 5.8",
  },
  {
    id: "fixion-2d",
    name: "Fixion 2D",
    line: "A top-down, four-player take on Fixion with foliage you can hide in. Sprite art is AI-generated.",
    status: "Prototype",
    years: "2026",
    stack: "Unreal Engine 5.8, Paper2D",
  },
  {
    id: "dubbtogether",
    name: "dubbtogether",
    line: "Re-dub a video with your own voice: splits the voice from music and ambience, aligns your takes, muxes them back.",
    status: "Local build",
    years: "2026",
    stack: "FastAPI, ffmpeg, demucs",
  },
  {
    id: "bxgoatdrip",
    name: "BxGoatDrip",
    line: "Storefront and stock admin for an Instagram streetwear reseller, with an autosaving admin and in-browser image resizing.",
    status: "Client work, offline",
    years: "2026",
    stack: "Next.js 16, Vercel Blob",
  },
  {
    id: "stitch-designer",
    name: "Stitch Designer",
    line: "A desktop studio for an embroidery business that turns a garment photo into sleeve and patch previews.",
    status: "Client desktop tool",
    years: "2026",
    stack: "Node, Express, Playwright",
  },
  {
    id: "excel-enricher",
    name: "Excel Enricher",
    line: "Fills spreadsheet columns with researched data through browser automation.",
    status: "Local tool",
    years: "2026",
    stack: "FastAPI, pandas, React",
  },
  {
    id: "asepre",
    name: "ASEPRE",
    line: "Landing page for a Dominican private security company.",
    status: "Client work, offline",
    years: "2025",
    stack: "Next.js, Tailwind CSS",
  },
  {
    id: "brolick-gym",
    name: "Brolick Gym",
    line: "Gym website with accounts and Stripe payments, built as a collaboration.",
    status: "Offline",
    years: "2025",
    stack: "Next.js, Firebase, Stripe",
  },
]

export const person = {
  name: "Alex M. Rodriguez",
  studio: "InceptumRex",
  email: "inceptumrex@gmail.com",
  github: "https://github.com/alexrf00",
  linkedin: "https://www.linkedin.com/in/alex-rodriguez-fernandez/",
  site: "https://inceptumrex.com",
  // A copy of the owner's Feb 2026 résumé with the personal email and phone
  // redacted and the site's public contacts set in their place.
  resume: "/Alex-M-Rodriguez-Resume.pdf",
}

// The résumé, merged from the owner's two résumé PDFs (Feb 2026 and the
// earlier one). Titles and dates follow the Feb 2026 version; figures are the
// owner's own résumé statements. Contact stays the site's public channels.
export type ResumeRole = { when: string; role: string; org: string; place: string; points: string[] }

export const resume = {
  role: "Software engineer, New York",
  bio: [
    "I'm a software engineer with eight years of experience building web applications end to end: Angular and React front ends, Java and Spring Boot services, SQL and GraphQL data, and tested code shipped through CI/CD. Lately I build games too.",
    "I was born in the Dominican Republic and learned English as a teenager in New York, where I work today. Two of the products on the wall, Fiscalia and LuzRD, are built for the Dominican Republic.",
  ],
  experience: [
    {
      when: "2025 to now",
      role: "Founder-engineer",
      org: "InceptumRex",
      place: "New York",
      points: ["Fiscalia, LuzRD, Big Party 3D, Fixion and client work, each built end to end and set out in the program above."],
    },
    {
      when: "Feb 2021 to Mar 2025",
      role: "Software Developer",
      org: "Bank of New York Mellon",
      place: "Manhattan",
      points: [
        "Built and iterated Angular, TypeScript and JavaScript front ends with the backend and UI/UX design teams.",
        "Integrated with backend systems through REST APIs and Java platforms, and built backend service enhancements in Java 17 and Spring Boot.",
        "Wrote unit-tested front-end components and backend services with JUnit and Mockito, and set up their testing pipelines.",
        "Monitored and analysed with Splunk, kept the platform reliable with Docker, and supported data operations on SQL, MySQL and Oracle.",
        "Shipped through Jira, Git and CI/CD pipelines, and wrote Node.js scripts for data processing and API integration.",
      ],
    },
    {
      when: "Aug 2020 to Feb 2021",
      role: "Application Support Intern",
      org: "Bank of New York Mellon",
      place: "Manhattan",
      points: [
        "Built front-end features for transaction-based requirements with stakeholders.",
        "Developed responsive, modular UI components in Angular 6 and Angular 15.",
      ],
    },
    {
      when: "Jan 2018 to Jan 2022",
      role: "Full Stack Developer",
      org: "InceptumRex",
      place: "Remote",
      points: [
        "Built React, Next.js and TypeScript front ends across several projects, including an online gym website with subscription management and protected routes.",
        "Built and maintained GraphQL APIs, reducing over-fetching by 40%.",
        "Optimised PostgreSQL schemas and queries, reducing slow-running queries by up to 60%.",
      ],
    },
  ] satisfies ResumeRole[],
  skills: [
    { group: "Front end", items: "Angular (6, 15), React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS, Tailwind CSS" },
    { group: "Back end", items: "Java (8, 11, 17), Spring Boot, Node.js, Python, REST APIs, GraphQL, OAuth 2" },
    { group: "Data", items: "SQL, PostgreSQL, Oracle, MySQL, NoSQL" },
    { group: "Delivery", items: "Docker, CI/CD, Jenkins, Git (GitHub, GitLab), Jira, Confluence, Splunk, release management" },
    { group: "Testing", items: "JUnit, Mockito, unit testing, debugging" },
  ],
  education: [
    { when: "Expected 2029", what: "B.S. Computer Science", where: "Medgar Evers College, Brooklyn" },
    { when: "Feb 2020 to Feb 2021", what: "Web development certification", where: "Year Up United, Manhattan" },
  ],
  certificates: [
    { when: "May 2025", what: "Version Control", by: "Meta" },
    { when: "Apr 2025", what: "Programming with JavaScript", by: "Meta" },
    { when: "Sep 2022", what: "Introduction to Front-End Development", by: "Meta" },
    { when: "Jan 2021", what: "The Bits and Bytes of Computer Networking", by: "Google" },
    { when: "Jan 2021", what: "Introduction to Back-End Development", by: "Meta" },
    { when: "Nov 2020", what: "Technical Support Fundamentals", by: "Google" },
  ],
  languages: "English and Spanish",
}
