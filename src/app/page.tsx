import { Strip } from "@/components/Strip"
import { Wall } from "@/components/wall/Wall"
import { Program } from "@/components/paper/Program"
import { Papers } from "@/components/paper/Papers"
import { Resume } from "@/components/paper/Resume"
import { Flyer } from "@/components/paper/Flyer"
import { Foot } from "@/components/Foot"

export default function Home() {
  return (
    <>
      <a className="skip" href="#work">
        Skip to the work
      </a>
      <Strip />
      <main id="top">
        <Wall />
        <div className="paper">
          <Program />
          <Papers />
          <Resume />
          <Flyer />
        </div>
      </main>
      <Foot />
    </>
  )
}
