import * as THREE from "three"
import { ink } from "../wall/posters"

// The résumé paste-up. A rolled sheet waits on the résumé's top edge, then
// unrolls down the wall and the printed sheet appears above it, the way a
// wheat-paster rolls a poster onto a wall. Only the roll is WebGL: the sheet is
// the real HTML, clipped just above the roll while it runs and never longer.

const DIST = 2400
// Long enough that the first screen of paper takes about a second.
const duration = (height: number) => Math.min(Math.max(height * 0.9, 1600), 3200)
const FADE = 280
const SHEET_PAD = 80 // keep the sheet's shadow outside the clip on three sides

export type Roll = {
  arm: () => void
  play: () => Promise<void>
  dispose: () => void
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function paperBack(): THREE.CanvasTexture {
  // The back of the rolled paper: newsprint fibre, a faint print-through and the
  // sheet's free edge, which turns with the roll.
  const c = document.createElement("canvas")
  c.width = 1024
  c.height = 256
  const g = c.getContext("2d")!
  g.fillStyle = ink.back
  g.fillRect(0, 0, c.width, c.height)
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(90, 90, 80, ${Math.random() * 0.08})`
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 1 + Math.random() * 6, 1)
  }
  // Print showing through: lines of type run along the roll's axis, so they
  // turn with it.
  g.fillStyle = "rgba(60, 60, 54, 0.09)"
  for (let x = 30; x < c.width - 30; x += 26) g.fillRect(x, 16 + Math.random() * 40, 8, c.height - 60 - Math.random() * 90)
  g.fillStyle = "rgba(40, 40, 36, 0.35)"
  g.fillRect(0, 0, 3, c.height) // the free edge of the outer layer
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = THREE.RepeatWrapping
  return t
}

function rollEnd(): THREE.CanvasTexture {
  // The roll seen end-on: layers of paper round a hollow core.
  const c = document.createElement("canvas")
  c.width = c.height = 256
  const g = c.getContext("2d")!
  g.fillStyle = ink.back
  g.beginPath()
  g.arc(128, 128, 127, 0, Math.PI * 2)
  g.fill()
  g.strokeStyle = "rgba(60, 60, 54, 0.35)"
  g.lineWidth = 1.2
  for (let r = 44; r < 126; r += 4.5) {
    g.beginPath()
    g.arc(128, 128, r, 0, Math.PI * 2)
    g.stroke()
  }
  g.fillStyle = "#2a2a26"
  g.beginPath()
  g.arc(128, 128, 40, 0, Math.PI * 2)
  g.fill()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function shadowBand(): THREE.CanvasTexture {
  const c = document.createElement("canvas")
  c.width = 4
  c.height = 128
  const g = c.getContext("2d")!
  const grad = g.createLinearGradient(0, 0, 0, c.height)
  grad.addColorStop(0, "rgba(5, 14, 8, 0.55)")
  grad.addColorStop(0.35, "rgba(5, 14, 8, 0.28)")
  grad.addColorStop(1, "rgba(5, 14, 8, 0)")
  g.fillStyle = grad
  g.fillRect(0, 0, c.width, c.height)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function createRoll(sheet: HTMLElement, canvas: HTMLCanvasElement): Roll | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  } catch {
    return null
  }
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 50, 6000)
  camera.position.set(0, 0, DIST)

  // The wall's one light, from the upper left.
  const sun = new THREE.DirectionalLight(0xffffff, 2.9)
  sun.position.set(-0.55, 0.62, 0.56)
  scene.add(sun, new THREE.AmbientLight(0xffffff, 0.8))

  const sideTex = paperBack()
  const endTex = rollEnd()
  const shadowTex = shadowBand()
  const side = new THREE.MeshLambertMaterial({ map: sideTex, transparent: true })
  const end = new THREE.MeshLambertMaterial({ map: endTex, transparent: true })
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })

  let geometry: THREE.CylinderGeometry | null = null
  const roll = new THREE.Mesh<THREE.CylinderGeometry, THREE.Material[]>(undefined, [side, end, end])
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat)
  scene.add(shadow, roll)

  let W = 0
  let H = 0
  let cw = 0
  let ch = 0
  let left = 0
  let top = 0
  let r0 = 20

  const clip = (revealed: number) => {
    sheet.style.clipPath = `inset(-${SHEET_PAD}px -${SHEET_PAD}px ${Math.max(0, H - revealed)}px -${SHEET_PAD}px)`
  }

  const place = (revealed: number, e: number) => {
    const r = r0 * Math.sqrt(1 - 0.7 * e) // paper leaves the roll as it runs
    const y = top + revealed
    roll.scale.set(1, r, r)
    roll.position.set(left + W / 2 - cw / 2, ch / 2 - y, r)
    roll.rotation.x = -revealed / (r0 * 0.8) // rolling, not sliding
    const band = r * 1.7
    shadow.scale.set(W, band, 1)
    shadow.position.set(left + W / 2 - cw / 2 + r * 0.22, ch / 2 - y - r * 0.2 - band / 2, 0.5)
  }

  const measure = () => {
    const c = canvas.getBoundingClientRect()
    const s = sheet.getBoundingClientRect()
    cw = c.width
    ch = c.height
    W = s.width
    H = s.height
    left = s.left - c.left
    top = s.top - c.top
    r0 = Math.min(Math.max(W * 0.028, 14), 34)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(cw, ch, false)
    camera.aspect = cw / ch
    camera.fov = (2 * Math.atan(ch / 2 / DIST) * 180) / Math.PI
    camera.updateProjectionMatrix()
    geometry?.dispose()
    geometry = new THREE.CylinderGeometry(1, 1, W, 72, 1, false)
    geometry.rotateZ(Math.PI / 2) // lie along the sheet's width
    roll.geometry = geometry
  }

  let raf = 0
  let done = false

  const dispose = () => {
    if (done) return
    done = true
    cancelAnimationFrame(raf)
    sheet.style.clipPath = ""
    canvas.style.display = "none"
    geometry?.dispose()
    shadow.geometry.dispose()
    side.dispose()
    end.dispose()
    shadowMat.dispose()
    sideTex.dispose()
    endTex.dispose()
    shadowTex.dispose()
    renderer.dispose()
  }

  return {
    // Hide the sheet and set the roll on its top edge, waiting.
    arm() {
      if (done) return
      measure()
      clip(0)
      place(0, 0)
      renderer.render(scene, camera)
    },
    play() {
      return new Promise<void>((resolve) => {
        if (done) return resolve()
        measure()
        const run = duration(H)
        const start = performance.now()
        const tick = (now: number) => {
          if (done) return resolve()
          const t = Math.min((now - start) / run, 1)
          const e = easeInOut(t)
          const revealed = e * H
          clip(revealed)
          place(revealed, e)
          if (t >= 1) {
            // The last of the roll lifts away at the foot of the sheet.
            const fade = Math.min((now - start - run) / FADE, 1)
            side.opacity = end.opacity = shadowMat.opacity = 1 - fade
            if (fade >= 1) {
              renderer.render(scene, camera)
              dispose()
              return resolve()
            }
          }
          renderer.render(scene, camera)
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      })
    },
    dispose,
  }
}
