import type { Metadata } from "next"
import { Strip } from "@/components/Strip"
import { Foot } from "@/components/Foot"
import { Shelf } from "@/components/papers/shelf/Shelf"
import { PaperIndex } from "@/components/papers/PaperIndex"

const title = "Papers, Alex M. Rodriguez"
const description =
  "Papers and research papers by Alex M. Rodriguez, told apart: papers argue for a position, a proposal or a design; research papers report a study with its method and data."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/papers" },
  openGraph: {
    type: "website",
    url: "/papers",
    title,
    description,
    siteName: "InceptumRex",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Alex M. Rodriguez: every project pasted on one wall" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
}

// The papers screen: every paper pasted up on the wall, then set straight,
// one printed sheet per kind.
export default function PapersPage() {
  return (
    <>
      <a className="skip" href="#index">
        Skip to the list
      </a>
      <Strip />
      <main id="top">
        <Shelf />
        <div className="paper">
          <PaperIndex />
        </div>
      </main>
      <Foot />
    </>
  )
}
