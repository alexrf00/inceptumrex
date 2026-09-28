import * as THREE from "three"
import { makeUniforms, paperMaterial, shadowMaterial, type PaperMesh, type Uniforms } from "@/components/wall/paper-shader"
import { loadFonts, readFonts } from "@/components/wall/poster-texture"
import { shelfSheets, type ShelfSheet } from "./sheets"
import { paintOffprintInside, paintSheet } from "./shelf-texture"

// The papers wall in three.js, on the same lit paper as the home wall.
// - Paste-up: each sheet arrives folded back on itself, its top edge pasted
//   first, and is brushed down onto the wall, the fold running to its foot.
// - Hover: a paper's nearest corner lifts; a research offprint opens, its
//   cover turning over the staples to show the abstract inside.
// - Read: pick a paper and it comes off the wall and up to the reader, then
//   its page opens.
// Nothing renders while nothing moves.

type Paint = { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture; width: number }

type Entry = {
  el: HTMLElement
  sheet: ShelfSheet
  mesh: PaperMesh
  shadow: PaperMesh
  u: Uniforms
  paint: Paint
  inside?: { mesh: PaperMesh; paint: Paint }
  w: number
  h: number
  rot: number
  level: number
  base: THREE.Vector3
  fold: number
  vel: number
  target: number
  dirTarget: THREE.Vector2
  lift: number
  liftTarget: number
  enter: number
  fly: { t: number; href: string; gone: boolean } | null
}

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const ENTER_MS = 1050
const FLY_S = 0.6

export async function mountShelf(shelf: HTMLElement, canvas: HTMLCanvasElement, navigate: (href: string) => void): Promise<() => void> {
  // Pasted up only if the HTML sheets are still waiting unseen; if they have
  // already shown, the paper simply takes over.
  const entering = shelf.dataset.gl === "pending"
  if (entering) shelf.dataset.gl = "loading"

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
  } catch {
    delete shelf.dataset.gl
    return () => {}
  }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const DIST = 2400
  const camera = new THREE.PerspectiveCamera(30, 1, 50, 6000)
  camera.position.set(0, 0, DIST)

  const fonts = readFonts()
  await loadFonts(fonts)
  const specs = new Map(shelfSheets().map((s) => [s.id, s]))
  const elements = [...shelf.querySelectorAll<HTMLElement>("[data-sheet]")]
  const geometry = new THREE.PlaneGeometry(1, 1, 64, 64)
  const maxAniso = renderer.capabilities.getMaxAnisotropy()
  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  let disposed = false

  const makePaint = (): Paint => {
    const paint = document.createElement("canvas")
    const texture = new THREE.CanvasTexture(paint)
    texture.colorSpace = THREE.NoColorSpace
    texture.anisotropy = maxAniso
    texture.minFilter = THREE.LinearMipmapLinearFilter
    return { canvas: paint, texture, width: 0 }
  }

  const entries: Entry[] = []
  elements.forEach((el, i) => {
    const sheet = specs.get(el.dataset.sheet ?? "")
    if (!sheet) return
    const u = makeUniforms(i * 5.3 + 2.1)
    const paint = makePaint()
    const mesh = new THREE.Mesh(geometry, paperMaterial(u, paint.texture, 2.6))
    const shadow = new THREE.Mesh(geometry, shadowMaterial(u))
    const level = i + 1
    shadow.renderOrder = level * 3
    mesh.renderOrder = level * 3 + 2
    scene.add(shadow, mesh)
    let inside: Entry["inside"]
    if (sheet.kind === "offprint") {
      const iu = makeUniforms(i * 2.9 + 7.7)
      iu.uSize = u.uSize
      const ipaint = makePaint()
      const imesh = new THREE.Mesh(geometry, paperMaterial(iu, ipaint.texture, 1.2))
      imesh.renderOrder = level * 3 + 1
      scene.add(imesh)
      inside = { mesh: imesh, paint: ipaint }
    }
    if (entering) u.uAlpha.value = 0
    entries.push({
      el,
      sheet,
      mesh,
      shadow,
      u,
      paint,
      inside,
      w: 0,
      h: 0,
      rot: 0,
      level,
      base: new THREE.Vector3(),
      fold: 0,
      vel: 0,
      target: 0,
      dirTarget: u.uDir.value.clone(),
      lift: 0,
      liftTarget: 0,
      enter: entering ? 120 + i * 170 : -1,
      fly: null,
    })
  })
  const byEl = new Map(entries.map((e) => [e.el, e]))

  const minSide = (e: Entry) => Math.min(e.w, e.h)
  const baseRot = (e: Entry) => (-e.rot * Math.PI) / 180
  const diagonal = (e: Entry) => new THREE.Vector2(-e.u.uCorner.value.x * e.w, -e.u.uCorner.value.y * e.h).normalize()
  const restRadius = (e: Entry) => clamp(minSide(e) * 0.065, 10, 30)

  function repaint(e: Entry) {
    const want = Math.min(Math.round(e.w * dpr), 1800)
    if (e.paint.width && Math.abs(want - e.paint.width) / e.paint.width <= 0.12) return
    paintSheet(e.paint.canvas, e.sheet, want, (want * e.h) / e.w, fonts, e.w)
    // WebGL2 storage is immutable: a resized canvas needs a fresh allocation.
    if (e.paint.width) e.paint.texture.dispose()
    e.paint.texture.needsUpdate = true
    e.paint.width = want
    if (e.inside && e.sheet.kind === "offprint") {
      paintOffprintInside(e.inside.paint.canvas, e.sheet, want, (want * e.h) / e.w, fonts, e.w)
      if (e.inside.paint.width) e.inside.paint.texture.dispose()
      e.inside.paint.texture.needsUpdate = true
      e.inside.paint.width = want
    }
  }

  function layout() {
    const W = shelf.clientWidth
    const H = shelf.clientHeight
    dpr = Math.min(window.devicePixelRatio || 1, W * H > 1_600_000 ? 1.5 : 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H, false)
    camera.aspect = W / H
    camera.fov = (2 * Math.atan(H / 2 / DIST) * 180) / Math.PI
    camera.updateProjectionMatrix()
    const sr = shelf.getBoundingClientRect()
    for (const e of entries) {
      const r = e.el.getBoundingClientRect()
      e.w = e.el.offsetWidth
      e.h = e.el.offsetHeight
      e.rot = parseFloat(getComputedStyle(e.el).getPropertyValue("--rot")) || 0
      const cx = r.left + r.width / 2 - sr.left
      const cy = r.top + r.height / 2 - sr.top
      const z = e.level * 8
      const k = (DIST - z) / DIST
      e.base.set((cx - W / 2) * k, (H / 2 - cy) * k, z)
      if (!e.fly) {
        e.mesh.position.copy(e.base)
        e.mesh.rotation.z = baseRot(e)
      }
      e.mesh.scale.set(k, k, 1)
      e.shadow.position.copy(e.mesh.position)
      e.shadow.rotation.z = e.mesh.rotation.z
      e.shadow.scale.copy(e.mesh.scale)
      if (e.inside) {
        const ki = (DIST - (z - 4)) / DIST
        e.inside.mesh.position.set((cx - W / 2) * ki, (H / 2 - cy) * ki, z - 4)
        e.inside.mesh.scale.set(ki, ki, 1)
        e.inside.mesh.rotation.z = baseRot(e)
      }
      e.u.uSize.value.set(e.w, e.h)
      if (e.enter < 0) e.u.uRadius.value = restRadius(e)
      repaint(e)
    }
  }

  let raf = 0
  let last = 0
  let visible = true
  let start = 0
  const K = 170
  const C = 18

  // Paste-up: the top edge goes on first and the rest is brushed down, the
  // fold line running from above the sheet to its foot as the paper unfolds.
  function stepEnter(e: Entry, now: number) {
    const t = now - start - e.enter
    if (t < 0) return
    const p = Math.min(t / ENTER_MS, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    const R = clamp(minSide(e) * 0.09, 16, 36)
    e.u.uCorner.value.set(0, -1)
    e.u.uDir.value.set(0, 1)
    e.u.uRadius.value = R
    e.fold = (e.h + Math.PI * R * 0.6) * (1 - eased)
    e.u.uAlpha.value = smooth(0, 0.16, p)
    e.lift = 16 * (1 - eased)
    if (p >= 1) {
      e.enter = -1
      e.fold = 0
      e.lift = 0
      e.u.uAlpha.value = 1
      e.u.uCorner.value.set(1, -1)
      e.u.uDir.value.copy((e.dirTarget = diagonal(e)))
      e.u.uRadius.value = restRadius(e)
    }
  }

  // Read: the sheet straightens, lifts and comes up to the reader, then the
  // paper's page opens.
  function stepFly(e: Entry, dt: number) {
    const f = e.fly!
    f.t += dt
    const p = Math.min(f.t / FLY_S, 1)
    const ease = p * p * (3 - 2 * p)
    e.target = 0
    e.fold += (0 - e.fold) * Math.min(1, dt * 14)
    e.lift = 60 * ease
    e.mesh.rotation.z = baseRot(e) * (1 - ease)
    e.mesh.position.set(e.base.x * (1 - 0.7 * ease), e.base.y * (1 - 0.7 * ease), e.base.z + 1100 * ease * ease)
    if (e.inside) e.inside.mesh.visible = p < 0.2
    if (p >= 1 && !f.gone) {
      f.gone = true
      navigate(f.href)
    }
  }

  function frame(now: number) {
    raf = 0
    const dt = clamp((now - last) / 1000, 0.001, 1 / 30)
    last = now
    let moving = false
    for (const e of entries) {
      if (e.enter >= 0) {
        stepEnter(e, now)
        moving = true
      } else if (e.fly) {
        stepFly(e, dt)
        if (!e.fly.gone) moving = true
      } else {
        const a = K * (e.target - e.fold) - C * e.vel
        e.vel += a * dt
        e.fold = Math.max(0, e.fold + e.vel * dt)
        if (Math.abs(e.target - e.fold) > 0.15 || Math.abs(e.vel) > 0.15) moving = true
        const d = e.u.uDir.value
        if (d.distanceToSquared(e.dirTarget) > 1e-7) {
          d.lerp(e.dirTarget, Math.min(1, dt * 16)).normalize()
          moving = true
        }
        e.lift += (e.liftTarget - e.lift) * Math.min(1, dt * 10)
        if (Math.abs(e.liftTarget - e.lift) > 0.05) moving = true
      }
      e.u.uFold.value = e.fold
      e.u.uLift.value = e.lift
      e.shadow.position.copy(e.mesh.position)
      e.shadow.rotation.z = e.mesh.rotation.z
    }
    renderer.render(scene, camera)
    if (moving && visible && !disposed) raf = requestAnimationFrame(frame)
  }

  function kick() {
    if (!raf && visible && !disposed) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }

  // Hover and focus. A paper lifts the corner nearest the pointer; an offprint
  // opens from its free edge, the cover turning right over the staples.
  function engage(e: Entry, clientX?: number, clientY?: number) {
    if (e.enter >= 0 || e.fly) return
    if (e.sheet.kind === "offprint") {
      e.u.uCorner.value.set(1, 0)
      e.u.uDir.value.set(-1, 0)
      e.dirTarget.set(-1, 0)
      e.target = e.w + Math.PI * e.u.uRadius.value * 0.5
      e.liftTarget = 2
      return
    }
    let corner = new THREE.Vector2(1, -1)
    let near = 0.7
    if (clientX !== undefined && clientY !== undefined) {
      const r = e.el.getBoundingClientRect()
      const th = (e.rot * Math.PI) / 180
      const dx = clientX - (r.left + r.width / 2)
      const dy = clientY - (r.top + r.height / 2)
      const lx = dx * Math.cos(th) + dy * Math.sin(th)
      const ly = -dx * Math.sin(th) + dy * Math.cos(th)
      corner = new THREE.Vector2(lx >= 0 ? 1 : -1, ly >= 0 ? -1 : 1)
      near = 1 - Math.min(Math.hypot(e.w / 2 - Math.abs(lx), e.h / 2 - Math.abs(ly)) / (minSide(e) * 0.6), 1)
    }
    if (!corner.equals(e.u.uCorner.value) && e.fold > 2) {
      e.target = 0
      return
    }
    e.u.uCorner.value.copy(corner)
    e.dirTarget = diagonal(e)
    if (e.fold <= 2) e.u.uDir.value.copy(e.dirTarget)
    e.target = (0.045 + 0.2 * Math.pow(near, 1.6)) * minSide(e)
    e.liftTarget = 3
  }

  function rest(except?: Entry) {
    for (const e of entries) {
      if (e === except || e.enter >= 0 || e.fly) continue
      e.target = 0
      e.liftTarget = 0
    }
  }

  const sheetAt = (x: number, y: number) => {
    const hit = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-sheet]")
    return hit ? byEl.get(hit) : undefined
  }

  const onMove = (ev: PointerEvent) => {
    if (ev.pointerType === "touch") return
    const e = sheetAt(ev.clientX, ev.clientY)
    rest(e)
    if (e) engage(e, ev.clientX, ev.clientY)
    kick()
  }
  const onLeave = () => {
    rest()
    kick()
  }
  const onFocusIn = (ev: FocusEvent) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-sheet]")
    const e = el ? byEl.get(el) : undefined
    rest(e)
    if (e) engage(e)
    kick()
  }
  const onFocusOut = () => {
    rest()
    kick()
  }
  // A plain click on a paper plays the pick-up before its page opens. A click
  // that asks for a new tab or window keeps the browser's own behaviour.
  const onClick = (ev: MouseEvent) => {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return
    const link = (ev.target as Element).closest<HTMLAnchorElement>("a[data-sheet]")
    const href = link?.getAttribute("href") ?? ""
    const e = link ? byEl.get(link) : undefined
    if (!e || !href || href.startsWith("#") || e.fly || shelf.dataset.gl !== "ready") return
    ev.preventDefault()
    e.fly = { t: 0, href, gone: false }
    e.mesh.renderOrder = 9002
    e.shadow.renderOrder = 9000
    if (e.inside) e.inside.mesh.renderOrder = 9001
    kick()
  }
  // Coming back through the history cache, every sheet is on the wall again.
  const onShow = (ev: PageTransitionEvent) => {
    if (!ev.persisted) return
    for (const e of entries) {
      if (!e.fly) continue
      e.fly = null
      e.mesh.renderOrder = e.level * 3 + 2
      e.shadow.renderOrder = e.level * 3
      if (e.inside) {
        e.inside.mesh.renderOrder = e.level * 3 + 1
        e.inside.mesh.visible = true
      }
      e.fold = e.vel = e.target = e.lift = e.liftTarget = 0
    }
    layout()
    kick()
  }

  shelf.addEventListener("pointermove", onMove)
  shelf.addEventListener("pointerleave", onLeave)
  shelf.addEventListener("focusin", onFocusIn)
  shelf.addEventListener("focusout", onFocusOut)
  shelf.addEventListener("click", onClick)
  window.addEventListener("pageshow", onShow)

  const ro = new ResizeObserver(() => {
    layout()
    kick()
  })
  ro.observe(shelf)
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) kick()
  })
  io.observe(shelf)

  layout()
  renderer.render(scene, camera)
  shelf.dataset.gl = "ready"
  start = performance.now()
  kick()

  const onLost = (ev: Event) => {
    ev.preventDefault()
    delete shelf.dataset.gl
  }
  canvas.addEventListener("webglcontextlost", onLost)

  return () => {
    disposed = true
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    shelf.removeEventListener("pointermove", onMove)
    shelf.removeEventListener("pointerleave", onLeave)
    shelf.removeEventListener("focusin", onFocusIn)
    shelf.removeEventListener("focusout", onFocusOut)
    shelf.removeEventListener("click", onClick)
    window.removeEventListener("pageshow", onShow)
    canvas.removeEventListener("webglcontextlost", onLost)
    delete shelf.dataset.gl
    for (const e of entries) {
      e.paint.texture.dispose()
      e.mesh.material.dispose()
      e.shadow.material.dispose()
      if (e.inside) {
        e.inside.paint.texture.dispose()
        e.inside.mesh.material.dispose()
      }
    }
    geometry.dispose()
    renderer.dispose()
  }
}
