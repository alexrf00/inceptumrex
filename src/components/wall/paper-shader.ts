import * as THREE from "three"
import { ink } from "./posters"

// The WebGL paper shared by the wall and the papers screen: a plane that
// curls around a cylinder from any corner or edge (uCorner, uDir, uFold),
// with paste bubbles, a torn ragged edge, drying crinkle, wet-paste sheen and
// the paper's back showing through, lit by the site's one light.

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
uniform vec2 uDir;
uniform float uFold;
uniform float uRadius;
uniform float uLift;
uniform float uSeed;
${noiseChunk}

// Returns the displaced point; curl is 0 on the flat paper and up to 1 where
// the flap has rolled over; foldDist is the distance past the fold line on the
// flat side. The fold line runs across uDir, uFold px in from the lifted corner.
vec3 paper(vec2 uvIn, out float curl, out float foldDist) {
  vec3 p = vec3((uvIn - 0.5) * uSize, 0.0);

  // Paste bubbles: low, soft, a little stronger near the edges.
  vec2 q = p.xy * 0.011 + uSeed;
  float edge = 1.0 - smoothstep(0.0, 0.18, min(min(uvIn.x, 1.0 - uvIn.x), min(uvIn.y, 1.0 - uvIn.y)));
  p.z += ((noise(q) - 0.5) * 1.8 + (noise(q * 3.3) - 0.5) * 0.7) * (0.55 + 1.5 * edge);

  vec2 c = uCorner * uSize * 0.5;
  vec2 d = uDir;
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
uniform float uAlpha;
varying vec2 vUv;
varying vec2 vLocal;
varying vec3 vView;
varying float vCurl;
varying float vFoldDist;
void main() {
  // Torn edge: the paper's border is eaten away by a few irregular pixels.
  float edgeDist = min(min(vUv.x, 1.0 - vUv.x) * uSize.x, min(vUv.y, 1.0 - vUv.y) * uSize.y);
  float rag = uRag * (noise(vLocal * 0.16) * 0.7 + noise(vLocal * 0.8) * 0.3);
  float alpha = smoothstep(rag - 0.7, rag + 0.7, edgeDist) * uAlpha;
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
    // Ink seen through the paper from behind: the same point of the print, so
    // the flip itself mirrors it.
    vec3 through = texture2D(uMap, vUv).rgb;
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
uniform float uAlpha;
varying vec2 vUv;
varying float vHeight;
void main() {
  float e = smoothstep(0.0, 0.045, vUv.x) * smoothstep(0.0, 0.045, 1.0 - vUv.x) * smoothstep(0.0, 0.045, vUv.y) * smoothstep(0.0, 0.045, 1.0 - vUv.y);
  float a = e * (0.34 + 0.22 * smoothstep(0.0, 36.0, vHeight));
  gl_FragColor = vec4(0.02, 0.07, 0.04, a * uAlpha);
}
`

export type Uniforms = {
  uSize: { value: THREE.Vector2 }
  uCorner: { value: THREE.Vector2 }
  uDir: { value: THREE.Vector2 }
  uFold: { value: number }
  uRadius: { value: number }
  uLift: { value: number }
  uSeed: { value: number }
  uAlpha: { value: number }
}

export type PaperMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>

// The one light, from the upper left; shadows fall away from it.
export const LIGHT = new THREE.Vector3(-0.55, 0.62, 0.56).normalize()
export const SHADOW_DIR = new THREE.Vector2(-LIGHT.x, -LIGHT.y).normalize()

export const makeUniforms = (seed: number): Uniforms => ({
  uSize: { value: new THREE.Vector2(1, 1) },
  uCorner: { value: new THREE.Vector2(1, -1) },
  uDir: { value: new THREE.Vector2(-1, 1).normalize() },
  uFold: { value: 0 },
  uRadius: { value: 20 },
  uLift: { value: 0 },
  uSeed: { value: seed },
  uAlpha: { value: 1 },
})

export const paperMaterial = (uniforms: Uniforms, texture: THREE.Texture, rag: number) =>
  new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uMap: { value: texture }, uLight: { value: LIGHT }, uBack: { value: new THREE.Color(ink.back) }, uRag: { value: rag } },
    vertexShader: posterVertex,
    fragmentShader: posterFragment,
    side: THREE.DoubleSide,
    transparent: true,
  })

// A soft copy of the paper, pushed away from the light by its height.
export const shadowMaterial = (uniforms: Uniforms) =>
  new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uShadowDir: { value: SHADOW_DIR } },
    vertexShader: shadowVertex,
    fragmentShader: shadowFragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })
