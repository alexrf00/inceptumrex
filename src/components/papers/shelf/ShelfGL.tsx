"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

// Mounts the papers wall's three.js paper. Never under reduced motion or data
// saver; without it the HTML sheets are the wall. If the sheets are still
// waiting unseen for their paste-up, a failure shows them at once.
export function ShelfGL() {
  const ref = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = ref.current
    const shelf = canvas?.closest<HTMLElement>("[data-shelf]")
    if (!canvas || !shelf) return
    const reveal = () => {
      if (shelf.dataset.gl === "pending" || shelf.dataset.gl === "loading") delete shelf.dataset.gl
    }
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) {
      reveal()
      return
    }

    let cleanup: (() => void) | undefined
    let cancelled = false
    import("./shelf-scene")
      .then(async ({ mountShelf }) => {
        if (cancelled) return
        const dispose = await mountShelf(shelf, canvas, (href) => router.push(href))
        if (cancelled) dispose()
        else cleanup = dispose
      })
      .catch(reveal)
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [router])

  return <canvas ref={ref} className="shelf__gl" aria-hidden="true" />
}
