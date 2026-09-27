import * as THREE from "three"
import { COMPACT, ink, posters, type PosterSpec } from "./posters"
import { loadFonts, loadPosterImages, paintPoster, paintUnderBill, readFonts, type PosterImages } from "./poster-texture"

// The wall in three.js: every HTML bill gets a paper twin lit by the wall's
// raking light, with torn edges and a little wet-paste sheen. The corner under
// the pointer curls around a cylinder, shows the paper's back, throws an offset
// shadow and uncovers the older bill pasted underneath. Nothing renders while
// nothing moves.

const noiseChunk = /* glsl */ `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
`

const shared = /* glsl */ `
uniform vec2 uSize;
uniform vec2 uCorner;
uniform float uFold;
uniform float uRadius;
uniform float uLift;
uniform float uSeed;
${noiseChunk}

// Returns the displaced point; curl is 0 on the flat paper and up to 1 where
// the flap has rolled over; foldDist is the distance past the fold line on the
// flat side.
vec3 paper(vec2 uvIn, out float curl, out float foldDist) {
  vec3 p = vec3((uvIn - 0.5) * uSize, 0.0);

  // Paste bubbles: low, soft, a little stronger near the edges.
  vec2 q = p.xy * 0.011 + uSeed;
  float edge = 1.0 - smoothstep(0.0, 0.18, min(min(uvIn.x, 1.0 - uvIn.x), min(uvIn.y, 1.0 - uvIn.y)));
  p.z += ((noise(q) - 0.5) * 1.8 + (noise(q * 3.3) - 0.5) * 0.7) * (0.55 + 1.5 * edge);

  vec2 c = uCorner * uSize * 0.5;
  vec2 d = normalize(-uCorner * uSize);
  float s = dot(p.xy - c, d);
  float t = uFold - s;
  curl = 0.0;
  foldDist = s - uFold;
  if (uFold > 0.0 && t > 0.0) {
    float R = uRadius;
    float a = t / R;
    float along;
    float z;
    if (a < 3.14159265) {
      along = uFold - R * sin(a);
      z = R * (1.0 - cos(a));
    } else {
      along = uFold + (t - 3.14159265 * R);
      z = 2.0 * R;
    }
    p.xy += d * (along - s);
    p.z += z;
    curl = min(a / 3.14159265, 1.0);
  }
  p.z += uLift;
  return p;
}
`

const posterVertex = /* glsl */ `
${shared}
varying vec2 vUv;
varying vec2 vLocal;
varying vec3 vView;
varying float vCurl;
varying float vFoldDist;
void main() {
  vUv = uv;
  vLocal = (uv - 0.5) * uSize + uSeed * 40.0;
  vec3 p = paper(uv, vCurl, vFoldDist);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const posterFragment = /* glsl */ `
${noiseChunk}
float crinkle(vec2 p) {
  return noise(p * 0.085) * 0.6 + noise(p * 0.21) * 0.4;
}
uniform sampler2D uMap;
uniform vec3 uLight;
uniform vec3 uBack;
uniform vec2 uSize;
uniform float uFold;
uniform float uRadius;
uniform float uRag;
varying vec2 vUv;
varying vec2 vLocal;
varying vec3 vView;
varying float vCurl;
varying float vFoldDist;
void main() {
  // Torn edge: the paper's border is eaten away by a few irregular pixels.
  float edgeDist = min(min(vUv.x, 1.0 - vUv.x) * uSize.x, min(vUv.y, 1.0 - vUv.y) * uSize.y);
  float rag = uRag * (noise(vLocal * 0.16) * 0.7 + noise(vLocal * 0.8) * 0.3);
  float alpha = smoothstep(rag - 0.7, rag + 0.7, edgeDist);
  if (alpha < 0.02) discard;

  vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
  // Fine crinkle from drying paste, independent of the mesh density.
  float gx = crinkle(vLocal + vec2(1.5, 0.0)) - crinkle(vLocal - vec2(1.5, 0.0));
  float gy = crinkle(vLocal + vec2(0.0, 1.5)) - crinkle(vLocal - vec2(0.0, 1.5));
  n = normalize(n + vec3(-gx, -gy, 0.0) * 0.2);
  float shade = 1.0 + 0.95 * (dot(n, uLight) - uLight.z);
  vec3 col;
  if (gl_FrontFacing) {
    col = texture2D(uMap, vUv).rgb;
    // The lifted flap darkens the paper just past the fold.
    float contact = uFold > 0.5 ? step(0.0, vFoldDist) * exp(-vFoldDist / (0.8 * uRadius + 6.0)) : 0.0;
    col *= 1.0 - 0.3 * contact;
  } else {
    vec3 through = texture2D(uMap, vec2(1.0 - vUv.x, vUv.y)).rgb;
    col = mix(uBack, uBack * through, 0.14);
  }
  col *= shade;
  // Wet paste still shines in patches.
  vec3 halfway = normalize(uLight + normalize(-vView));
  float wet = smoothstep(0.5, 0.85, noise(vLocal * 0.012 + 7.0));
  col += pow(max(dot(n, halfway), 0.0), 60.0) * (0.03 + 0.09 * wet);
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.02;
  gl_FragColor = vec4(col, alpha);
}
`

const shadowVertex = /* glsl */ `
${shared}
uniform vec2 uShadowDir;
varying vec2 vUv;
varying float vHeight;
void main() {
  vUv = uv;
  float curl;
  float foldDist;
  vec3 p = paper(uv, curl, foldDist);
  vHeight = max(p.z, 0.0);
  p.xy *= 1.012;
  p.xy += uShadowDir * (7.0 + vHeight * 0.9);
  p.z = -8.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

const shadowFragment = /* glsl */ `
varying vec2 vUv;
varying float vHeight;
void main() {
  float e = smoothstep(0.0, 0.045, vUv.x) * smoothstep(0.0, 0.045, 1.0 - vUv.x) * smoothstep(0.0, 0.045, vUv.y) * smoothstep(0.0, 0.045, 1.0 - vUv.y);
  float a = e * (0.34 + 0.22 * smoothstep(0.0, 36.0, vHeight));
  gl_FragColor = vec4(0.02, 0.07, 0.04, a);
}
`

type Uniforms = {
  uSize: { value: THREE.Vector2 }
  uCorner: { value: THREE.Vector2 }
  uFold: { value: number }
  uRadius: { value: number }
  uLift: { value: number }
  uSeed: { value: number }
}

type Under = { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>; texture: THREE.CanvasTexture; canvas: HTMLCanvasElement }

type Entry = {
  el: HTMLElement
  spec: PosterSpec
  images: PosterImages
  interactive: boolean
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  shadow: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  under?: Under
  texture: THREE.CanvasTexture
  canvas: HTMLCanvasElement
  w: number
  h: number
  rot: number
  paintedW: number
  compact: boolean
  fold: number
  vel: number
  target: number
  corner: THREE.Vector2
  nextCorner: THREE.Vector2 | null
  lift: number
  liftTarget: number
}

const hex = (c: string) => new THREE.Color(c)

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
  const light = new THREE.Vector3(-0.55, 0.62, 0.56).normalize()
  const shadowDir = new THREE.Vector2(-light.x, -light.y).normalize()
  const maxAniso = renderer.capabilities.getMaxAnisotropy()

  let dpr = Math.min(window.devicePixelRatio || 1, 2)

  const makeTexture = () => {
    const paint = document.createElement("canvas")
    const texture = new THREE.CanvasTexture(paint)
    texture.colorSpace = THREE.NoColorSpace
    texture.anisotropy = maxAniso
    texture.minFilter = THREE.LinearMipmapLinearFilter
    return { paint, texture }
  }

  const makeUniforms = (seed: number): Uniforms => ({
    uSize: { value: new THREE.Vector2(1, 1) },
    uCorner: { value: new THREE.Vector2(1, -1) },
    uFold: { value: 0 },
    uRadius: { value: 20 },
    uLift: { value: 0 },
    uSeed: { value: seed },
  })

  const paperMaterial = (uniforms: Uniforms, texture: THREE.Texture, rag: number) =>
    new THREE.ShaderMaterial({
      uniforms: { ...uniforms, uMap: { value: texture }, uLight: { value: light }, uBack: { value: hex(ink.back) }, uRag: { value: rag } },
      vertexShader: posterVertex,
      fragmentShader: posterFragment,
      side: THREE.DoubleSide,
      transparent: true,
    })

  const entries: Entry[] = []
  elements.forEach((el, i) => {
    const spec = posters.find((p) => p.id === el.dataset.poster)
    if (!spec) return
    const interactive = !el.hasAttribute("data-static")
    const { paint, texture } = makeTexture()
    const uniforms = makeUniforms(i * 7.13 + 1.7)
    const mesh = new THREE.Mesh(geometry, paperMaterial(uniforms, texture, interactive ? 2.6 : 7))
    const shadow = new THREE.Mesh(
      geometry,
      new THREE.ShaderMaterial({
        uniforms: { ...uniforms, uShadowDir: { value: shadowDir } },
        vertexShader: shadowVertex,
        fragmentShader: shadowFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    )
    const z = Number(getComputedStyle(el).zIndex) || i + 1
    shadow.renderOrder = z * 3
    mesh.renderOrder = z * 3 + 2
    scene.add(shadow, mesh)

    let under: Under | undefined
    if (spec.kind === "image") {
      const u = makeTexture()
      const underUniforms = makeUniforms(i * 3.7 + 9.1)
      underUniforms.uSize = uniforms.uSize
      const underMesh = new THREE.Mesh(geometry, paperMaterial(underUniforms, u.texture, 0))
      underMesh.renderOrder = z * 3 + 1
      scene.add(underMesh)
      under = { mesh: underMesh, texture: u.texture, canvas: u.paint }
    }

    entries.push({
      el,
      spec,
      images: imageSets[i],
      interactive,
      mesh,
      shadow,
      under,
      texture,
      canvas: paint,
      w: 0,
      h: 0,
      rot: 0,
      paintedW: 0,
      compact: false,
      fold: 0,
      vel: 0,
      target: 0,
      corner: uniforms.uCorner.value,
      nextCorner: null,
      lift: 0,
      liftTarget: 0,
    })
  })
  const byEl = new Map(entries.map((e) => [e.el, e]))

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
      const visible = e.w > 0 && getComputedStyle(e.el).display !== "none"
      e.mesh.visible = e.shadow.visible = visible
      if (e.under) e.under.mesh.visible = visible
      if (!visible) continue
      e.rot = parseFloat(getComputedStyle(e.el).getPropertyValue("--rot")) || 0
      const cx = r.left + r.width / 2 - wr.left
      const cy = r.top + r.height / 2 - wr.top
      // Layers sit 8px apart so paste bubbles never poke through the bill
      // above; each mesh is scaled back so perspective does not enlarge it
      // past its HTML twin.
      const z = Math.floor(e.mesh.renderOrder / 3) * 8
      const k = (DIST - z) / DIST
      e.mesh.position.set((cx - W / 2) * k, (H / 2 - cy) * k, z)
      e.mesh.scale.set(k, k, 1)
      e.shadow.position.copy(e.mesh.position)
      e.shadow.scale.copy(e.mesh.scale)
      e.mesh.rotation.z = e.shadow.rotation.z = (-e.rot * Math.PI) / 180
      if (e.under) {
        const ku = (DIST - (z - 6)) / DIST
        e.under.mesh.position.set((cx - W / 2) * ku, (H / 2 - cy) * ku, z - 6)
        e.under.mesh.scale.set(ku, ku, 1)
        e.under.mesh.rotation.z = e.mesh.rotation.z
      }
      const mat = e.mesh.material.uniforms
      mat.uSize.value.set(e.w, e.h)
      mat.uRadius.value = Math.min(Math.max(Math.min(e.w, e.h) * 0.065, 10), 30)
      const want = Math.min(Math.round(e.w * dpr), 1800)
      const compact = e.w < COMPACT
      if (!e.paintedW || compact !== e.compact || Math.abs(want - e.paintedW) / e.paintedW > 0.12) {
        paintPoster(e.canvas, e.images, e.spec, want, (want * e.h) / e.w, fonts, e.w)
        // WebGL2 texture storage is immutable: a canvas that changed size needs
        // a fresh allocation, or the new paint lands in a corner of the old one.
        if (e.paintedW) e.texture.dispose()
        e.texture.needsUpdate = true
        if (e.under && e.spec.kind === "image") {
          paintUnderBill(e.under.canvas, e.spec.under, want, (want * e.h) / e.w, fonts)
          if (e.paintedW) e.under.texture.dispose()
          e.under.texture.needsUpdate = true
        }
        e.paintedW = want
        e.compact = compact
      }
    }
  }

  let raf = 0
  let last = 0
  let visible = true
  const K = 170
  const C = 18

  function frame(now: number) {
    raf = 0
    const dt = Math.min(Math.max((now - last) / 1000, 0.001), 1 / 30)
    last = now
    let moving = false
    for (const e of entries) {
      if (e.nextCorner && e.fold < 2) {
        e.corner.copy(e.nextCorner)
        e.nextCorner = null
      }
      const a = K * (e.target - e.fold) - C * e.vel
      e.vel += a * dt
      e.fold = Math.max(0, e.fold + e.vel * dt)
      e.lift += (e.liftTarget - e.lift) * Math.min(1, dt * 10)
      if (Math.abs(e.target - e.fold) > 0.15 || Math.abs(e.vel) > 0.15 || Math.abs(e.liftTarget - e.lift) > 0.05) moving = true
      const u = e.mesh.material.uniforms
      u.uFold.value = e.fold
      u.uLift.value = e.lift
    }
    renderer.render(scene, camera)
    if (moving && visible) raf = requestAnimationFrame(frame)
  }

  function kick() {
    if (!raf && visible) {
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
  }

  const minSide = (e: Entry) => Math.min(e.w, e.h)

  function peelToward(e: Entry, clientX: number, clientY: number) {
    const r = e.el.getBoundingClientRect()
    const th = (e.rot * Math.PI) / 180
    const dx = clientX - (r.left + r.width / 2)
    const dy = clientY - (r.top + r.height / 2)
    const lx = dx * Math.cos(th) + dy * Math.sin(th)
    const ly = -dx * Math.sin(th) + dy * Math.cos(th)
    const corner = new THREE.Vector2(lx >= 0 ? 1 : -1, ly >= 0 ? -1 : 1)
    const dist = Math.hypot(e.w / 2 - Math.abs(lx), e.h / 2 - Math.abs(ly))
    const near = 1 - Math.min(dist / (minSide(e) * 0.6), 1)
    const fold = (0.045 + 0.2 * Math.pow(near, 1.6)) * minSide(e)
    if (!corner.equals(e.corner) && e.fold > 2) {
      e.nextCorner = corner
      e.target = 0
    } else {
      e.corner.copy(corner)
      e.nextCorner = null
      e.target = fold
    }
    e.liftTarget = 3
  }

  function rest(except?: Entry) {
    for (const e of entries) {
      if (e === except) continue
      e.target = 0
      e.liftTarget = 0
    }
  }

  const posterAt = (x: number, y: number) => {
    const hit = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-poster]")
    const e = hit ? byEl.get(hit) : undefined
    return e?.interactive ? e : undefined
  }

  const onMove = (ev: PointerEvent) => {
    if (ev.pointerType === "touch") return
    const e = posterAt(ev.clientX, ev.clientY)
    rest(e)
    if (e) peelToward(e, ev.clientX, ev.clientY)
    kick()
  }
  const onLeave = () => {
    rest()
    kick()
  }
  const onDown = (ev: PointerEvent) => {
    const e = posterAt(ev.clientX, ev.clientY)
    if (!e) return
    peelToward(e, ev.clientX, ev.clientY)
    e.vel += 520
    kick()
  }
  const onFocusIn = (ev: FocusEvent) => {
    const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-poster]")
    const e = el ? byEl.get(el) : undefined
    rest(e)
    if (e?.interactive) {
      if (e.fold > 2 && !e.corner.equals(new THREE.Vector2(1, -1))) e.nextCorner = new THREE.Vector2(1, -1)
      else e.corner.set(1, -1)
      e.target = 0.2 * minSide(e)
      e.liftTarget = 3
    }
    kick()
  }
  const onFocusOut = () => {
    rest()
    kick()
  }

  wall.addEventListener("pointermove", onMove)
  wall.addEventListener("pointerleave", onLeave)
  wall.addEventListener("pointerdown", onDown)
  wall.addEventListener("focusin", onFocusIn)
  wall.addEventListener("focusout", onFocusOut)

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
  }
  canvas.addEventListener("webglcontextlost", onLost)

  // Let the paste-up entrance finish on the HTML posters, then hand over.
  const handover = window.setTimeout(() => {
    if (!lost) wall.dataset.gl = "ready"
  }, Math.max(0, 1500 - performance.now()))

  return () => {
    window.clearTimeout(handover)
    cancelAnimationFrame(raf)
    ro.disconnect()
    io.disconnect()
    wall.removeEventListener("pointermove", onMove)
    wall.removeEventListener("pointerleave", onLeave)
    wall.removeEventListener("pointerdown", onDown)
    wall.removeEventListener("focusin", onFocusIn)
    wall.removeEventListener("focusout", onFocusOut)
    canvas.removeEventListener("webglcontextlost", onLost)
    delete wall.dataset.gl
    for (const e of entries) {
      e.texture.dispose()
      e.mesh.material.dispose()
      e.shadow.material.dispose()
      if (e.under) {
        e.under.texture.dispose()
        e.under.mesh.material.dispose()
      }
    }
    geometry.dispose()
    renderer.dispose()
  }
}
