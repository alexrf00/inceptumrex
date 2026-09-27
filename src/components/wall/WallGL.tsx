"use client"

import { useEffect, useRef } from "react"

// Mounts the three.js paper only when it can help: never under reduced motion
// or data saver, and never before the HTML wall has painted. Without it the
// HTML posters are the wall.
export function WallGL() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const wall = canvas?.closest<HTMLElement>("[data-wall]")
    if (!canvas || !wall) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return

    let cleanup: (() => void) | undefined
    let cancelled = false
    const start = () =>
      import("./wall-scene").then(async ({ mountWall }) => {
        if (cancelled) return
        const dispose = await mountWall(wall, canvas)
        if (cancelled) dispose()
        else cleanup = dispose
      })

    const hasIdle = typeof window.requestIdleCallback === "function"
    const handle = hasIdle ? window.requestIdleCallback(start, { timeout: 1200 }) : globalThis.setTimeout(start, 200)
    return () => {
      cancelled = true
      if (hasIdle) window.cancelIdleCallback(handle as number)
      else globalThis.clearTimeout(handle)
      cleanup?.()
    }
  }, [])

  return <canvas ref={ref} className="wall__gl" aria-hidden="true" />
}
