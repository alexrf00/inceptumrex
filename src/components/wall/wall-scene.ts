import * as THREE from "three"
import { COMPACT, posters, type BillSpec } from "./posters"
import { makeUniforms, paperMaterial, shadowMaterial, type PaperMesh, type Uniforms } from "./paper-shader"
import { loadFonts, loadImageSet, loadPosterImages, paintPoster, readFonts, type PosterImages } from "./poster-texture"

// The wall in three.js: every HTML bill gets a paper twin lit by the wall's
// raking light, with torn edges and a little wet-paste sheen. The corner under
// the pointer curls around a cylinder, shows the paper's back and throws an
// offset shadow; under each image bill waits the bill pasted before it.
// Press and drag and the corner follows the pointer; let go far enough and the
// bill tears off the wall and falls, and the bill below becomes the bill, and
// the link. Nothing renders while nothing moves.

// A canvas and its texture, holding the paint of one layer of a bill's stack.
type Slot = { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture; layer: number; width: number; compact: boolean; ready: boolean }

type Entry = {
  el: HTMLElement
  id: string
  layers: BillSpec[]
  depth: number
  href0: string | null
  label0: string | null
  interactive: boolean
  visible: boolean
  mesh: PaperMesh
  shadow: PaperMesh
  under?: PaperMesh
  u: Uniforms
  top: Slot
  below?: Slot
  w: number
  h: number
  rot: number
  level: number
  base: THREE.Vector3
  fold: number
  vel: number
  target: number
  dirTarget: THREE.Vector2
  nextCorner: THREE.Vector2 | null
  lift: number
  liftTarget: number
  fly: { stage: "peel" | "fall"; t: number; spin: number; drift: number } | null
  paste: number
}

type Drag = {
  e: Entry
  id: number
  type: string
  x0: number
  y0: number
  f0: number
  moved: boolean
  vx: number
  vy: number
  lx: number
  ly: number
  lt: number
}

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export async function mountWall(wall: HTMLElement, canvas: HTMLCanvasElement): Promise<() => void> {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
  } catch {
    return () => {}
  }
  // Colors stay in sRGB end to end so a flat, unlit poster matches its HTML twin.
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const DIST = 2400
  const camera = new THREE.PerspectiveCamera(30, 1, 50, 6000)
  camera.position.set(0, 0, DIST)

  const fonts = readFonts()
  await loadFonts(fonts)
  const elements = [...wall.querySelectorAll<HTMLElement>("[data-poster]")]
  const imageSets = await Promise.all(elements.map(loadPosterImages))

  const geometry = new THREE.PlaneGeometry(1, 1, 64, 64)
  const maxAniso = renderer.capabilities.getMaxAnisotropy()
  const repasteButton = wall.querySelector<HTMLButtonElement>("[data-repaste]")

  let dpr = Math.min(window.devicePixelRatio || 1, 2)
  let disposed = false

  const makeSlot = (): Slot => {
    const paint = document.createElement("canvas")
    const texture = new THREE.CanvasTexture(paint)
    texture.colorSpace = THREE.NoColorSpace
    texture.anisotropy = maxAniso
    texture.minFilter = THREE.LinearMipmapLinearFilter
    return { canvas: paint, texture, layer: -1, width: 0, compact: false, ready: false }
  }

  // Prints of every layer, by bill and depth. Layer 0 comes from the HTML bill;
  // a bill pasted underneath loads its own prints the first time it is needed.
  const imageCache = new Map<string, PosterImages>()
  const imageLoads = new Map<string, Promise<void>>()
  const layerKey = (e: Entry, i: number) => `${e.id}:${i}`
  const cachedImages = (e: Entry, i: number): PosterImages | null => (e.layers[i].kind === "image" ? (imageCache.get(layerKey(e, i)) ?? null) : {})
  const loadLayer = (e: Entry, i: number): Promise<void> => {
    const layer = e.layers[i]
    const key = layerKey(e, i)
    if (layer.kind !== "image" || imageCache.has(key)) return Promise.resolve()
    let load = imageLoads.get(key)
    if (!load) {
      load = loadImageSet(layer).then((set) => {
        imageCache.set(key, set)
      })
      imageLoads.set(key, load)
    }
    return load
  }

  const entries: Entry[] = []
  elements.forEach((el, i) => {
    const spec = posters.find((p) => p.id === el.dataset.poster)
    if (!spec) return
    const interactive = !el.hasAttribute("data-static")
    const layers: BillSpec[] = spec.kind === "image" ? [spec, ...spec.under] : [spec]
    const top = makeSlot()
    const uniforms = makeUniforms(i * 7.13 + 1.7)
    const mesh = new THREE.Mesh(geometry, paperMaterial(uniforms, top.texture, interactive ? 2.6 : 7))
    const shadow = new THREE.Mesh(geometry, shadowMaterial(uniforms))
    const level = Number(getComputedStyle(el).zIndex) || i + 1
    shadow.renderOrder = level * 3
    mesh.renderOrder = level * 3 + 2
    scene.add(shadow, mesh)

    let under: PaperMesh | undefined
    let below: Slot | undefined
    if (layers.length > 1) {
      below = makeSlot()
      const underUniforms = makeUniforms(i * 3.7 + 9.1)
      underUniforms.uSize = uniforms.uSize
      under = new THREE.Mesh(geometry, paperMaterial(underUniforms, below.texture, 0))
      under.renderOrder = level * 3 + 1
      under.visible = false
      scene.add(under)
    }

    const entry: Entry = {
      el,
      id: spec.id,
      layers,
      depth: 0,
      href0: el.getAttribute("href"),
      label0: el.getAttribute("aria-label"),
      interactive,
      visible: true,
      mesh,
      shadow,
      under,
      u: uniforms,
      top,
      below,
      w: 0,
      h: 0,
      rot: 0,
      level,
      base: new THREE.Vector3(),
      fold: 0,
      vel: 0,
      target: 0,
      dirTarget: uniforms.uDir.value.clone(),
      nextCorner: null,
      lift: 0,
      liftTarget: 0,
      fly: null,
      paste: -1,
    }
    imageCache.set(layerKey(entry, 0), imageSets[i])
    entries.push(entry)
  })
  const byEl = new Map(entries.map((e) => [e.el, e]))

  const minSide = (e: Entry) => Math.min(e.w, e.h)
  const baseRot = (e: Entry) => (-e.rot * Math.PI) / 180
  const canTear = (e: Entry) => e.interactive && e.depth + 1 < e.layers.length
  // The corner's own diagonal, pointing into the paper.
  const diagonal = (e: Entry, corner = e.u.uCorner.value) => new THREE.Vector2(-corner.x * e.w, -corner.y * e.h).normalize()
  // How far the fold must travel from the corner to have turned the whole bill over.
  const extent = (e: Entry) => {
    const c = e.u.uCorner.value
    const d = e.u.uDir.value
    const hw = e.w / 2
    const hh = e.h / 2
    let m = 0
    for (const [x, y] of [
      [hw, hh],
      [hw, -hh],
      [-hw, hh],
      [-hw, -hh],
    ])
      m = Math.max(m, (x - c.x * hw) * d.x + (y - c.y * hh) * d.y)
    return m
  }

  function paintSlot(e: Entry, slot: Slot, i: number, force = false) {
    const want = Math.min(Math.round(e.w * dpr), 1800)
    const compact = e.w < COMPACT
    const fresh = slot.ready && slot.layer === i && slot.compact === compact && slot.width > 0 && Math.abs(want - slot.width) / slot.width <= 0.12
    if (fresh && !force) return
    const set = cachedImages(e, i)
    slot.layer = i
    if (!set) {
      slot.ready = false
      loadLayer(e, i).then(() => {
        if (disposed || slot.layer !== i) return
        paintSlot(e, slot, i, true)
        showUnder(e)
        kick()
      })
      return
    }
    paintPoster(slot.canvas, set, e.layers[i], want, (want * e.h) / e.w, fonts, e.w)
    // WebGL2 texture storage is immutable: a canvas that changed size needs a
    // fresh allocation, or the new paint lands in a corner of the old one.
    if (slot.width) slot.texture.dispose()
    slot.texture.needsUpdate = true
    slot.width = want
    slot.compact = compact
    slot.ready = true
  }

  function showUnder(e: Entry) {
    if (!e.under || !e.below) return
    e.under.visible = e.visible && canTear(e) && e.below.ready && e.below.layer === e.depth + 1
  }

  function layout() {
    const W = wall.clientWidth
    const H = wall.clientHeight
    // Very tall walls (phones) trade density for memory.
    dpr = Math.min(window.devicePixelRatio || 1, W * H > 1_600_000 ? 1.5 : 2)
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H, false)
    camera.aspect = W / H
    camera.fov = (2 * Math.atan(H / 2 / DIST) * 180) / Math.PI
    camera.updateProjectionMatrix()
    const wr = wall.getBoundingClientRect()
    for (const e of entries) {
      const r = e.el.getBoundingClientRect()
      e.w = e.el.offsetWidth
      e.h = e.el.offsetHeight
      e.visible = e.w > 0 && getComputedStyle(e.el).display !== "none"
      e.mesh.visible = e.shadow.visible = e.visible
      if (!e.visible) {
        if (e.under) e.under.visible = false
        continue
      }
      e.rot = parseFloat(getComputedStyle(e.el).getPropertyValue("--rot")) || 0
      const cx = r.left + r.width / 2 - wr.left
      const cy = r.top + r.height / 2 - wr.top
      // Layers sit 8px apart so paste bubbles never poke through the bill
      // above; each mesh is scaled back so perspective does not enlarge it
      // past its HTML twin.
      const z = e.level * 8
      const k = (DIST - z) / DIST
      e.base.set((cx - W / 2) * k, (H / 2 - cy) * k, z)
      if (!e.fly) {
        e.mesh.position.copy(e.base)
        e.mesh.rotation.z = baseRot(e)
      }
      e.mesh.scale.set(k, k, 1)
      e.shadow.position.copy(e.mesh.position)
      e.shadow.scale.copy(e.mesh.scale)
      e.shadow.rotation.z = e.mesh.rotation.z
      if (e.under) {
        const ku = (DIST - (z - 6)) / DIST
        e.under.position.set((cx - W / 2) * ku, (H / 2 - cy) * ku, z - 6)
        e.under.scale.set(ku, ku, 1)
        e.under.rotation.z = baseRot(e)
      }
      e.u.uSize.value.set(e.w, e.h)
      e.u.uRadius.value = clamp(minSide(e) * 0.065, 10, 30)
      if (e.u.uFold.value <= 2) e.u.uDir.value.copy((e.dirTarget = diagonal(e)))
      paintSlot(e, e.top, e.depth)
      if (e.below && canTear(e)) paintSlot(e, e.below, e.depth + 1)
      showUnder(e)
    }
  }

  let raf = 0
  let last = 0
  let visible = true
  let drag: Drag | null = null
  let suppressClick = false
  let interacted = false
  const K = 170
  const C = 18

  function stepFly(e: Entry, dt: number) {
    const f = e.fly!
    if (f.stage === "peel") {
      const a = 320 * (e.target - e.fold) - 24 * e.vel
      e.vel += a * dt
      e.fold = Math.max(0, e.fold + e.vel * dt)
      if (e.fold >= extent(e) + Math.PI * e.u.uRadius.value) {
        f.stage = "fall"
        f.t = 0
      }
      return
    }
    // Torn free, the bill drops away from the wall, turning, and is gone.
    f.t += dt
    const t = f.t
    e.mesh.position.set(e.base.x + f.drift * t, e.base.y - 60 * t - 1300 * t * t, e.base.z + 30)
    e.mesh.rotation.z = baseRot(e) + f.spin * t
    e.u.uAlpha.value = 1 - smooth(0.1, 0.42, t)
    if (t >= 0.45) completeFly(e)
  }

  function startFly(e: Entry, speed: number) {
    e.fly = { stage: "peel", t: 0, spin: (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.35), drift: e.u.uDir.value.x * 70 }
    e.target = extent(e) + Math.PI * e.u.uRadius.value + 80
    e.vel = Math.max(e.vel, speed, 700)
    e.liftTarget = 28
    // While it comes away the bill is in front of every other bill.
    e.mesh.renderOrder = 9000 + e.level * 3 + 2
    e.shadow.renderOrder = 9000 + e.level * 3
    if (e.depth + 2 < e.layers.length) loadLayer(e, e.depth + 2)
  }

  function completeFly(e: Entry) {
    e.fly = null
    // The bill below takes the top: swap paint slots and paper seeds.
    const old = e.top
    e.top = e.below!
    e.below = old
    e.mesh.material.uniforms.uMap.value = e.top.texture
    const underU = e.under!.material.uniforms
    underU.uMap.value = e.below.texture
    const seed = e.u.uSeed.value
    e.u.uSeed.value = underU.uSeed.value
    underU.uSeed.value = seed
    e.depth += 1
    e.below.ready = false
    if (canTear(e)) paintSlot(e, e.below, e.depth + 1)
    showUnder(e)
    // The top paper is flat again, holding the bill that was underneath.
    e.fold = e.vel = e.target = 0
    e.lift = e.liftTarget = 0
    e.u.uAlpha.value = 1
    e.u.uCorner.value.set(1, -1)
    e.u.uDir.value.copy((e.dirTarget = diagonal(e)))
    e.mesh.position.copy(e.base)
    e.mesh.rotation.z = baseRot(e)
    e.mesh.renderOrder = e.level * 3 + 2
    e.shadow.renderOrder = e.level * 3
    // The HTML twin now names and links the bill that is showing.
    const layer = e.layers[e.depth]
    if ("href" in layer) e.el.setAttribute("href", layer.href)
    if ("label" in layer) e.el.setAttribute("aria-label", layer.label)
    if (repasteButton) repasteButton.hidden = false
  }

  function stepPaste(e: Entry, dt: number) {
    e.paste += dt
    const t = Math.min(e.paste / 0.5, 1)
    e.u.uAlpha.value = Math.min(1, t * 2.4)
    e.lift = e.liftTarget = 26 * Math.pow(1 - t, 3)
    if (t >= 1) e.paste = -1
  }

  function frame(now: number) {
    raf = 0
    const dt = clamp((now - last) / 1000, 0.001, 1 / 30)
    last = now
    let moving = false
    for (const e of entries) {
      if (e.fly) {
        stepFly(e, dt)
        moving = true
      } else {
        if (e.nextCorner && e.fold < 2) {
          e.u.uCorner.value.copy(e.nextCorner)
          e.nextCorner = null
          e.u.uDir.value.copy((e.dirTarget = diagonal(e)))
        }
        const held = drag?.e === e && drag.moved
        const a = (held ? 900 : K) * (e.target - e.fold) - (held ? 60 : C) * e.vel
        e.vel += a * dt
        e.fold = Math.max(0, e.fold + e.vel * dt)
        if (Math.abs(e.target - e.fold) > 0.15 || Math.abs(e.vel) > 0.15) moving = true
      }
      const d = e.u.uDir.value
      if (d.distanceToSquared(e.dirTarget) > 1e-7) {
        d.lerp(e.dirTarget, Math.min(1, dt * 16)).normalize()
        moving = true
      }
      if (e.paste >= 0) {
        stepPaste(e, dt)
        moving = true
      }
      e.lift += (e.liftTarget - e.lift) * Math.min(1, dt * 10)
      if (Math.abs(e.liftTarget - e.lift) > 0.05) moving = true
      e.u.uFold.value = e.fold
      e.u.uLift.value = e.lift
      e.shadow.position.copy(e.mesh.position)
      e.shadow.rotation.z = e.mesh.rotation.z
    }
    renderer.render(scene, camera)
    if (moving && visible) raf = requestAnimationFrame(frame)
  }

  function kick() {
    if (!raf && visible && !disposed) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }

  // The pointer's offset from the bill's centre, in the bill's own frame (css
  // px, y down).
  function local(e: Entry, dx: number, dy: number) {
    const th = (e.rot * Math.PI) / 180
    return { x: dx * Math.cos(th) + dy * Math.sin(th), y: -dx * Math.sin(th) + dy * Math.cos(th) }
  }

  // Hover: the corner nearest the pointer lifts, more the nearer it is.
  // Returns that nearness, 0 at the centre to 1 on the corner.
  function peelToward(e: Entry, clientX: number, clientY: number) {
    const r = e.el.getBoundingClientRect()
    const { x: lx, y: ly } = local(e, clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2))
    const corner = new THREE.Vector2(lx >= 0 ? 1 : -1, ly >= 0 ? -1 : 1)
    const dist = Math.hypot(e.w / 2 - Math.abs(lx), e.h / 2 - Math.abs(ly))
    const near = 1 - Math.min(dist / (minSide(e) * 0.6), 1)
    const fold = (0.045 + 0.2 * Math.pow(near, 1.6)) * minSide(e)
    if (!corner.equals(e.u.uCorner.value) && e.fold > 2) {
      e.nextCorner = corner
      e.target = 0
    } else {
      e.u.uCorner.value.copy(corner)
      e.nextCorner = null
      e.dirTarget = diagonal(e)
      if (e.fold <= 2) e.u.uDir.value.copy(e.dirTarget)
      e.target = fold
    }
    e.liftTarget = 3
    return near
  }

  function rest(except?: Entry) {
    for (const e of entries) {
      if (e === except || e.fly || drag?.e === e) continue
      e.target = 0
      e.liftTarget = 0
    }
  }

  const posterAt = (x: number, y: number) => {
    const hit = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-poster]")
    const e = hit ? byEl.get(hit) : undefined
    return e?.interactive ? e : undefined
  }

  // Dragging: the fold turns toward the pull while the pull points into the
  // paper (within 60 degrees of the corner's diagonal) and runs half as far as
  // the pointer, so the lifted corner follows it. Pulled sideways or away, the
  // corner peels back along its diagonal. The last bill of a stack is pasted
  // for good: it gives a little and springs back.
  function dragMove(ev: PointerEvent) {
    const d = drag!
    const e = d.e
    const dx = ev.clientX - d.x0
    const dy = ev.clientY - d.y0
    if (!d.moved) {
      if (Math.hypot(dx, dy) < (d.type === "mouse" ? 6 : 10)) return
      d.moved = true
      suppressClick = true
      d.f0 = Math.max(e.fold, e.target)
      try {
        wall.setPointerCapture(d.id)
      } catch {}
      wall.dataset.peeling = ""
      delete wall.dataset.grab
      e.liftTarget = 6
    }
    const step = Math.max((ev.timeStamp - d.lt) / 1000, 1 / 240)
    const inst = local(e, (ev.clientX - d.lx) / step, (ev.clientY - d.ly) / step)
    d.vx = d.vx * 0.6 + inst.x * 0.4
    d.vy = d.vy * 0.6 - inst.y * 0.4
    d.lx = ev.clientX
    d.ly = ev.clientY
    d.lt = ev.timeStamp

    const p = local(e, dx, dy)
    const pull = new THREE.Vector2(p.x, -p.y)
    const len = pull.length()
    const inward = diagonal(e)
    let dir = inward
    if (len > 1) {
      const n = pull.clone().divideScalar(len)
      const cos = n.dot(inward)
      const turn = clamp(Math.atan2(inward.x * n.y - inward.y * n.x, cos), -Math.PI / 3, Math.PI / 3)
      const toward = inward.clone().rotateAround(new THREE.Vector2(), turn)
      dir = inward.clone().lerp(toward, clamp((cos - 0.05) / 0.45, 0, 1)).normalize()
    }
    e.dirTarget = dir
    let fold = Math.max(d.f0, (len + Math.PI * e.u.uRadius.value) / 2)
    if (!canTear(e)) {
      const cap = 0.3 * extent(e)
      if (fold > cap) fold = cap + (fold - cap) * 0.15
    }
    e.target = fold
    kick()
  }

  function endDrag(ev: PointerEvent, cancelled: boolean) {
    const d = drag
    if (!d || ev.pointerId !== d.id) return
    drag = null
    delete wall.dataset.peeling
    try {
      wall.releasePointerCapture(d.id)
    } catch {}
    if (!d.moved) return
    const e = d.e
    const dir = e.u.uDir.value
    const speed = d.vx * dir.x + d.vy * dir.y
    const reach = extent(e)
    const ready = e.below?.ready && e.below.layer === e.depth + 1
    if (!cancelled && canTear(e) && ready && (e.fold > 0.42 * reach || (e.fold > 0.16 * reach && speed > 900))) {
      startFly(e, speed * 0.5)
    } else {
      e.target = 0
      e.liftTarget = 0
      e.dirTarget = diagonal(e)
    }
    // The click that follows a drag must not follow the link.
    window.setTimeout(() => (suppressClick = false), 0)
    kick()
  }

  const onMove = (ev: PointerEvent) => {
    if (drag && ev.pointerId === drag.id) {
      dragMove(ev)
      return
    }
    if (ev.pointerType === "touch") return
    const e = posterAt(ev.clientX, ev.clientY)
    rest(e)
    let near = 0
    if (e && !e.fly) {
      interacted = true
      near = peelToward(e, ev.clientX, ev.clientY)
    }
    if (e && canTear(e) && near > 0.55) wall.dataset.grab = ""
    else delete wall.dataset.grab
    kick()
  }
  const onLeave = () => {
    if (drag) return
    delete wall.dataset.grab
    rest()
    kick()
  }
  const onDown = (ev: PointerEvent) => {
    suppressClick = false
    if (ev.pointerType === "mouse" && ev.button !== 0) return
    const e = posterAt(ev.clientX, ev.clientY)
    if (!e || e.fly) return
    interacted = true
    peelToward(e, ev.clientX, ev.clientY)
    // Take the corner under the pointer now, even if another was still lifted.
    if (e.nextCorner) {
      e.u.uCorner.value.copy(e.nextCorner)
      e.nextCorner = null
      e.u.uDir.value.copy((e.dirTarget = diagonal(e)))
      e.fold = Math.min(e.fold, 2)
      e.target = Math.max(e.target, 0.1 * minSide(e))
    }
    e.vel += 520
    drag = { e, id: ev.pointerId, type: ev.pointerType, x0: ev.clientX, y0: ev.clientY, f0: 0, moved: false, vx: 0, vy: 0, lx: ev.clientX, ly: ev.clientY, lt: ev.timeStamp }
    if (canTear(e)) loadLayer(e, e.depth + 1)
    if (e.depth + 2 < e.layers.length) loadLayer(e, e.depth + 2)
    kick()
  }
  const onUp = (ev: PointerEvent) => endDrag(ev, false)
  const onCancel = (ev: PointerEvent) => endDrag(ev, true)
  const onClick = (ev: MouseEvent) => {
    if (!suppressClick) return
    ev.preventDefault()
    ev.stopPropagation()
    suppressClick = false
  }
  const onFocusIn = (ev: FocusEvent) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-poster]")
    const e = el ? byEl.get(el) : undefined
    rest(e)
    if (e?.interactive && !e.fly) {
      const corner = new THREE.Vector2(1, -1)
      if (e.fold > 2 && !e.u.uCorner.value.equals(corner)) e.nextCorner = corner
      else {
        e.u.uCorner.value.copy(corner)
        e.dirTarget = diagonal(e)
      }
      e.target = 0.2 * minSide(e)
      e.liftTarget = 3
    }
    kick()
  }
  const onFocusOut = () => {
    rest()
    kick()
  }

  // Paste every bill back as it was, slapping each torn one on again.
  function repaste() {
    let first: Entry | undefined
    for (const e of entries) {
      if (e.depth === 0 && !e.fly) continue
      first ??= e
      e.fly = null
      e.depth = 0
      paintSlot(e, e.top, 0, true)
      if (e.below) {
        e.below.ready = false
        paintSlot(e, e.below, 1, true)
      }
      showUnder(e)
      e.fold = e.vel = e.target = 0
      e.u.uCorner.value.set(1, -1)
      e.u.uDir.value.copy((e.dirTarget = diagonal(e)))
      e.mesh.position.copy(e.base)
      e.mesh.rotation.z = baseRot(e)
      e.mesh.renderOrder = e.level * 3 + 2
      e.shadow.renderOrder = e.level * 3
      e.u.uAlpha.value = 0
      e.paste = 0
      restoreLink(e)
    }
    if (repasteButton) repasteButton.hidden = true
    first?.el.focus({ preventScroll: true })
    kick()
  }
  const restoreLink = (e: Entry) => {
    if (e.href0 !== null) e.el.setAttribute("href", e.href0)
    if (e.label0 !== null) e.el.setAttribute("aria-label", e.label0)
  }
  const onRepaste = () => repaste()

  wall.addEventListener("pointermove", onMove)
  wall.addEventListener("pointerleave", onLeave)
  wall.addEventListener("pointerdown", onDown)
  wall.addEventListener("pointerup", onUp)
  wall.addEventListener("pointercancel", onCancel)
  wall.addEventListener("click", onClick, true)
  wall.addEventListener("focusin", onFocusIn)
  wall.addEventListener("focusout", onFocusOut)
  repasteButton?.addEventListener("click", onRepaste)

  const ro = new ResizeObserver(() => {
    layout()
    kick()
  })
  ro.observe(wall)
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) kick()
  })
  io.observe(wall)

  layout()
  renderer.render(scene, camera)

  let lost = false
  const onLost = (ev: Event) => {
    ev.preventDefault()
    lost = true
    delete wall.dataset.gl
    // The HTML wall paints again, so every link goes back to its own bill.
    for (const e of entries) restoreLink(e)
    if (repasteButton) repasteButton.hidden = true
  }
  canvas.addEventListener("webglcontextlost", onLost)

  // Let the paste-up entrance finish on the HTML posters, then hand over.
  const handoverAt = Math.max(0, 1500 - performance.now())
  const handover = window.setTimeout(() => {
    if (!lost) wall.dataset.gl = "ready"
  }, handoverAt)

  // Once, if nobody has touched the wall yet, Fiscalia's corner lifts and
  // settles, to say the bills come away.
  let settle = 0
  const tease = window.setTimeout(() => {
    const e = entries.find((x) => x.id === "fiscalia" && x.visible)
    if (!e || interacted || lost || !visible) return
    e.u.uCorner.value.set(1, -1)
    e.u.uDir.value.copy((e.dirTarget = diagonal(e)))
    e.target = 0.26 * minSide(e)
    e.liftTarget = 3
    kick()
    settle = window.setTimeout(() => {
      if (drag?.e === e) return
      e.target = 0
      e.liftTarget = 0
      kick()
    }, 750)
  }, handoverAt + 1100)

  return () => {
    disposed = true
    window.clearTimeout(handover)
    window.clearTimeout(tease)
    window.clearTimeout(settle)
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    wall.removeEventListener("pointermove", onMove)
    wall.removeEventListener("pointerleave", onLeave)
    wall.removeEventListener("pointerdown", onDown)
    wall.removeEventListener("pointerup", onUp)
    wall.removeEventListener("pointercancel", onCancel)
    wall.removeEventListener("click", onClick, true)
    wall.removeEventListener("focusin", onFocusIn)
    wall.removeEventListener("focusout", onFocusOut)
    repasteButton?.removeEventListener("click", onRepaste)
    canvas.removeEventListener("webglcontextlost", onLost)
    delete wall.dataset.gl
    delete wall.dataset.peeling
    delete wall.dataset.grab
    if (repasteButton) repasteButton.hidden = true
    for (const e of entries) {
      restoreLink(e)
      e.top.texture.dispose()
      e.below?.texture.dispose()
      e.mesh.material.dispose()
      e.shadow.material.dispose()
      e.under?.material.dispose()
    }
    geometry.dispose()
    renderer.dispose()
  }
}
