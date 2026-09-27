import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Archivo, Archivo_Narrow, Big_Shoulders_Display, Big_Shoulders_Stencil_Display } from "next/font/google"
import { featured, person } from "@/content/work"
import "./globals.css"

const display = Big_Shoulders_Display({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-display" })
const stencil = Big_Shoulders_Stencil_Display({ subsets: ["latin"], weight: ["800"], variable: "--font-stencil" })
const narrow = Archivo_Narrow({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-narrow" })
const body = Archivo({ subsets: ["latin"], variable: "--font-body" })

const title = "Alex M. Rodriguez, InceptumRex"
const description =
  "Alex M. Rodriguez builds games, fiscal software and civic tools end to end: Big Party 3D, Fiscalia, LuzRD, Fixion and more. Dominican Republic and New York."

export const metadata: Metadata = {
  metadataBase: new URL(person.site),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title,
    description,
    siteName: "InceptumRex",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Alex M. Rodriguez: every project pasted on one wall" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
}

export const viewport: Viewport = {
  themeColor: "#121212",
  colorScheme: "dark",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  url: person.site,
  jobTitle: "Software engineer",
  brand: { "@type": "Brand", name: person.studio },
  sameAs: [person.github, person.linkedin],
  knowsLanguage: ["en", "es"],
  owns: featured.flatMap((p) => p.links.slice(0, 1).map((l) => ({ "@type": "CreativeWork", name: p.name, url: l.href }))),
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${stencil.variable} ${narrow.variable} ${body.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Analytics />
      </body>
    </html>
  )
}
