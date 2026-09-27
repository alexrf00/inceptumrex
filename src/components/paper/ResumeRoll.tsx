"use client"

import { useEffect, useRef } from "react"
import type { Roll } from "./resume-roll"

// Stages the résumé paste-up. three.js loads a screen ahead of the sheet; when
// the sheet's top reaches the bottom of the screen the sheet hides behind a
// waiting roll, and once it is a quarter of the way up the roll unrolls. The
// sheet is never hidden without the roll ready to reveal it, never for more
// than a few seconds, never under reduced motion or Save-Data, never in print.
export function ResumeRoll() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const sheet = canvas?.parentElement?.querySelector<HTMLElement>(".resume")
    if (!canvas || !sheet) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return

    let roll: Roll | null = null
    let armed = false
    let played = false
    let fallback = 0
    const observers: IntersectionObserver[] = []
    const stop = () => observers.forEach((o) => o.disconnect())

    const play = () => {
      if (!roll || played) return
      played = true
      window.clearTimeout(fallback)
      stop()
      void roll.play()
    }

    const load = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        load.disconnect()
        import("./resume-roll").then(({ createRoll }) => {
          roll = createRoll(sheet, canvas)
        })
      },
      { rootMargin: "0px 0px 100% 0px" },
    )

    const arm = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || armed || !roll) return
      armed = true
      arm.disconnect()
      // Arrived by a jump with the sheet already well in view: just show it.
      if (entry.boundingClientRect.top < window.innerHeight * 0.75) {
        stop()
        roll.dispose()
        return
      }
      roll.arm()
      fallback = window.setTimeout(play, 4000)
    })

    const trigger = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && armed) play()
      },
      { rootMargin: "0px 0px -25% 0px" },
    )

    observers.push(load, arm, trigger)
    load.observe(sheet)
    arm.observe(sheet)
    trigger.observe(sheet)

    const beforePrint = () => roll?.dispose()
    window.addEventListener("beforeprint", beforePrint)

    return () => {
      stop()
      window.clearTimeout(fallback)
      window.removeEventListener("beforeprint", beforePrint)
      roll?.dispose()
    }
  }, [])

  return <canvas ref={ref} className="resume-roll" aria-hidden="true" />
}
