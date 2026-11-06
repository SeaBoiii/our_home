import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeCanvas } from './textures.js';
import { DESIGNS } from './designs.js';
import { PX, OX, OY } from './core.js';

const $ = (s) => document.querySelector(s);
const isTouch = matchMedia('(pointer: coarse)').matches;
const EYE = 1.6;
const RADIUS = 0.2;

// ---------- renderer ----------
const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, isTouch ? 1.5 : 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.localClippingEnabled = true;
RectAreaLightUniformsLib.init();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 1, 0.03, 3000);
camera.rotation.order = 'YXZ';
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.32, 0.5, 0.88);
composer.addPass(bloom);
composer.addPass(new OutputPass());

const cutPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.45);
const dollBg = new THREE.Color('#0b1a22');

// ---------- world outside the windows ----------
const world = new THREE.Group();
scene.add(world);
const skyUniforms = { night: { value: 0 } };
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(1500, 32, 16),
  new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: skyUniforms,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float night; varying vec3 vP;
      float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164))) * 43758.5453); }
      void main(){
        float y = vP.y;
        vec3 dayTop = vec3(0.32,0.56,0.86), dayHz = vec3(0.86,0.9,0.92);
        vec3 nTop = vec3(0.01,0.03,0.07), nHz = vec3(0.09,0.12,0.2);
        vec3 day = mix(dayHz, dayTop, smoothstep(-0.02, 0.5, y));
        vec3 nt = mix(nHz, nTop, smoothstep(-0.02, 0.4, y));
        vec3 s = vec3(step(0.9975, h(floor(vP*420.0)))) * smoothstep(0.05,0.3,y);
        vec3 col = mix(day, nt + s, night);
        if (y < 0.0) col = mix(col, mix(vec3(0.18,0.36,0.44), vec3(0.02,0.05,0.08), night), smoothstep(0.0,-0.03,y));
        gl_FragColor = vec4(col, 1.0);
      }`,
  }),
);
world.add(sky);
const seaMat = new THREE.MeshStandardMaterial({ color: '#2d6c80', roughness: 0.25, metalness: 0.1 });
const sea = new THREE.Mesh(new THREE.CircleGeometry(1400, 48), seaMat);
sea.rotation.x = -Math.PI / 2;
sea.position.y = -42;
world.add(sea);
const cityDay = new THREE.CanvasTexture(makeCanvas({ tex: { k: 'windows', seed: 4 } }));
const cityNight = new THREE.CanvasTexture(makeCanvas({ tex: { k: 'windows', seed: 4, lit: true, c: '#20262e' } }));
for (const t of [cityDay, cityNight]) { t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; }
const cityMat = new THREE.MeshStandardMaterial({ map: cityDay, roughness: 0.9, emissive: '#ffffff', emissiveMap: cityNight, emissiveIntensity: 0 });
const landMat = new THREE.MeshStandardMaterial({ color: '#5d7a55', roughness: 1 });
{
  const land = new THREE.Mesh(new THREE.RingGeometry(0, 380, 48, 1, Math.PI * 0.05, Math.PI * 1.25), landMat);
  land.rotation.x = -Math.PI / 2;
  land.position.set(0, -41.6, 60);
  world.add(land);
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const blocks = new THREE.InstancedMesh(geo, cityMat, 90);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < 90; i++) {
    const a = Math.PI * (0.1 + rnd() * 1.1), d = 90 + rnd() * 260;
    const h = 30 + rnd() * 90, w = 14 + rnd() * 20;
    m4.compose(new THREE.Vector3(Math.cos(a) * d, -42 + h / 2, 60 + Math.sin(a) * d), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rnd() * 3, 0)), new THREE.Vector3(w, h, w * 0.6));
    blocks.setMatrixAt(i, m4);
  }
  world.add(blocks);
}

const hemi = new THREE.HemisphereLight('#dfeaff', '#b7a68e', 0.9);
scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff1dc', 3.2);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 60 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);

// ---------- state ----------
const state = {
  design: 0, mode: 'walk', night: false, cut: true, quality: isTouch ? 'fast' : 'high',
  yaw: 0, pitch: 0, pos: new THREE.Vector3(), keys: {}, locked: false,
  spec: null, root: null, mats: {}, lights: [], groups: {}, colliders: [], openState: {},
  platforms: [], flying: null, joy: null, look: null,
};

const orbit = new OrbitControls(camera, canvas);
orbit.enabled = false;
orbit.enableDamping = true;
orbit.maxPolarAngle = Math.PI * 0.47;
orbit.minDistance = 3;
orbit.maxDistance = 30;

// ---------- spec -> three ----------
const texCache = new Map();
function texture(def) {
  const key = JSON.stringify([def.tex, def.c]);
  if (texCache.has(key)) return texCache.get(key);
  const c = makeCanvas(def);
  const t = c ? new THREE.CanvasTexture(c) : null;
  if (t) {
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = 8;
  }
  texCache.set(key, t);
  return t;
}

function material(name, def) {
  const glass = def.glass || (def.o !== undefined && def.o < 1);
  const M = def.phys || def.cc ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const m = new M({
    color: def.tex && !def.tint ? '#ffffff' : def.c ?? '#cccccc',
    roughness: def.r ?? 0.6, metalness: def.m ?? 0,
    transparent: glass, opacity: def.o ?? 1, depthWrite: !glass,
    side: def.ds || glass ? THREE.DoubleSide : THREE.FrontSide,
  });
  if (def.cc) { m.clearcoat = def.cc; m.clearcoatRoughness = 0.15; }
  if (def.tex) {
    const t = texture(def);
    if (t) {
      m.map = t;
      if (def.bump) { m.bumpMap = t; m.bumpScale = def.bump; }
      if (def.emap) m.emissiveMap = t;
    }
  }
  if (def.e) {
    m.emissive = new THREE.Color(def.e);
    m.emissiveIntensity = def.ei ?? 1;
  }
  if (def.env !== undefined) m.envMapIntensity = def.env;
  m.userData = { def, name };
  return m;
}

function uvScale(geo, sx, sy) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * sx, uv.getY(i) * sy);
}

function geometry(it, def) {
  let g;
  const ts = def?.ts;
  switch (it.k) {
    case 'box': {
      const [w, h, d] = it.s;
      g = it.bev ? new RoundedBoxGeometry(w, h, d, 2, Math.min(it.bev, w / 2.01, h / 2.01, d / 2.01)) : new THREE.BoxGeometry(w, h, d);
      if (ts && !it.bev) {
        // per-face UVs in metres so textures keep a real-world scale
        const uv = g.attributes.uv;
        const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
        for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
          const i = f * 4 + k;
          uv.setXY(i, (uv.getX(i) * dims[f][0]) / ts, (uv.getY(i) * dims[f][1]) / ts);
        }
      }
      break;
    }
    case 'cyl':
      g = new THREE.CylinderGeometry(it.r, it.rb ?? it.r, it.h, it.seg || 20);
      if (ts) uvScale(g, (Math.PI * 2 * it.r) / ts, it.h / ts);
      break;
    case 'sph':
      g = new THREE.SphereGeometry(it.r, 18, 12);
      break;
    case 'tor':
      g = new THREE.TorusGeometry(it.R, it.r, 8, 28);
      break;
    case 'ext': {
      const shape = new THREE.Shape(it.pts.map(([x, z]) => new THREE.Vector2(x, -z)));
      g = new THREE.ExtrudeGeometry(shape, { depth: it.h, bevelEnabled: false });
      g.rotateX(-Math.PI / 2);
      if (ts) uvScale(g, 1 / ts, 1 / ts);
      break;
    }
    case 'pnl':
      g = new THREE.PlaneGeometry(it.s[0], it.s[1]);
      break;
    default:
      return null;
  }
  if (it.sc) g.scale(...it.sc);
  if (g.index) g = g.toNonIndexed();
  for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
  g.applyQuaternion(new THREE.Quaternion(...it.q));
  g.translate(...it.p);
  return g;
}

function disposeCurrent() {
  if (!state.root) return;
  state.root.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
  });
  for (const m of Object.values(state.mats)) m.dispose();
  for (const l of state.lights) scene.remove(l.obj);
  scene.remove(state.root);
}

function build(spec) {
  disposeCurrent();
  state.spec = spec;
  const root = new THREE.Group();
  state.mats = {};
  for (const [name, def] of Object.entries(spec.mats)) state.mats[name] = material(name, def);
  const buckets = new Map();
  state.groups = {};
  for (const ia of spec.interactive) {
    const g = new THREE.Group();
    g.position.set(...ia.pivot);
    root.add(g);
    state.groups[ia.id] = { obj: g, ia, t: state.openState[ia.id] ?? 0 };
  }
  for (const it of spec.items) {
    const def = spec.mats[it.m];
    if (!def) { console.warn('missing material', it.m); continue; }
    const g = geometry(it, def);
    if (!g) continue;
    if (it.g) g.translate(...state.groups[it.g].ia.pivot.map((v) => -v));
    const key = `${it.m}|${it.L || 0}|${it.g || ''}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(g);
  }
  for (const [key, geos] of buckets) {
    const [m, L, gid] = key.split('|');
    const merged = mergeGeometries(geos, false);
    geos.forEach((g) => g.dispose());
    const mesh = new THREE.Mesh(merged, state.mats[m]);
    const def = spec.mats[m];
    const see = def.glass || (def.o ?? 1) < 1;
    mesh.castShadow = !see && !def.noShadow;
    mesh.receiveShadow = !see;
    mesh.userData.layer = +L;
    if (see) mesh.renderOrder = 2;
    (gid ? state.groups[gid].obj : root).add(mesh);
  }
  state.lights = spec.lights.map((l) => {
    let obj;
    const col = new THREE.Color(l.c);
    if (l.k === 'point') {
      obj = new THREE.PointLight(col, l.i, l.d, 2);
    } else if (l.k === 'spot') {
      obj = new THREE.SpotLight(col, l.i, l.d, l.a, l.pen, 2);
      obj.target.position.set(...l.t);
      scene.add(obj.target);
    } else if (l.k === 'rect') {
      obj = new THREE.RectAreaLight(col, l.i, l.w, l.h);
      obj.quaternion.set(...l.q);
    }
    obj.position.set(...l.p);
    scene.add(obj);
    return { obj, def: l };
  });
  state.colliders = spec.colliders;
  state.platforms = spec.meta.platforms || [];
  scene.add(root);
  state.root = root;
  for (const g of Object.values(state.groups)) applyGroup(g);
  buildLabels(spec);
  drawMinimapBase(spec);
  applyLighting();
  applyCut();
}

// ---------- lighting / time of day ----------
function applyLighting() {
  const n = state.night;
  const d = DESIGNS[state.design];
  skyUniforms.night.value = n ? 1 : 0;
  hemi.intensity = n ? 0.04 : 0.95;
  hemi.color.set(n ? '#7a8cb8' : '#dfeaff');
  sun.intensity = n ? 0.12 : 3.0;
  sun.color.set(n ? '#9fb5ff' : d.sunColor ?? '#fff1dc');
  const sd = d.sun ?? [-0.5, 0.75, -0.9];
  sun.position.set(7 + sd[0] * 20, sd[1] * 20, 4.5 + sd[2] * 20);
  sun.target.position.set(7, 0, 4.5);
  scene.environmentIntensity = n ? 0.08 : 0.5;
  renderer.toneMappingExposure = n ? 1.25 : 0.95;
  cityMat.emissiveIntensity = n ? 1.2 : 0;
  cityMat.color.set(n ? '#20262e' : '#ffffff');
  seaMat.color.set(n ? '#06121a' : '#2d6c80');
  landMat.color.set(n ? '#0b130c' : '#5d7a55');
  for (const m of Object.values(state.mats)) {
    const def = m.userData.def;
    if (def.e) m.emissiveIntensity = n ? def.ein ?? def.ei ?? 1 : def.ei ?? 1;
  }
  for (const l of state.lights) l.obj.intensity = l.def.night ? (n ? l.def.i : 0) : l.def.i * (n ? 1 : 0.7);
  $('#btn-night').setAttribute('aria-pressed', n);
  $('#btn-night').textContent = n ? 'Night' : 'Day';
}

function applyQuality() {
  const hi = state.quality === 'high';
  renderer.shadowMap.enabled = hi;
  sun.castShadow = hi;
  renderer.setPixelRatio(Math.min(devicePixelRatio, hi ? 2 : 1));
  bloom.enabled = hi;
  for (const m of Object.values(state.mats)) m.needsUpdate = true;
  $('#btn-quality').textContent = hi ? 'High detail' : 'Fast';
  resize();
}

function applyCut() {
  const on = state.mode === 'orbit' && state.cut;
  for (const m of Object.values(state.mats)) {
    m.clippingPlanes = on ? [cutPlane] : null;
    m.needsUpdate = true;
  }
  state.root?.traverse((o) => { if (o.isMesh && o.userData.layer === 1) o.visible = state.mode !== 'orbit'; });
}

// ---------- interactive pieces (the secret bookcase) ----------
function applyGroup(g) {
  const ia = g.ia;
  const e = g.t < 0.5 ? 2 * g.t * g.t : 1 - Math.pow(-2 * g.t + 2, 2) / 2;
  if (ia.slide) g.obj.position.set(ia.pivot[0] + ia.slide[0] * e, ia.pivot[1] + ia.slide[1] * e, ia.pivot[2] + ia.slide[2] * e);
  else g.obj.rotation.set(0, (ia.open || 0) * e, 0);
}

function nearInteractive() {
  let best = null, bd = Infinity;
  for (const g of Object.values(state.groups)) {
    const d = Math.hypot(state.pos.x - g.ia.at[0], state.pos.z - g.ia.at[1]);
    if (d < g.ia.r && d < bd) { best = g; bd = d; }
  }
  return best;
}

function toggleInteractive() {
  const g = nearInteractive();
  if (!g) return;
  g.target = g.target === 1 ? 0 : g.t > 0.5 ? 0 : 1;
}

// ---------- collision ----------
function blocked(c) {
  if (c.length === 5) {
    const g = state.groups[c[4]];
    return g ? g.t < 0.6 : true;
  }
  return true;
}

function collide(p) {
  for (let iter = 0; iter < 3; iter++) {
    for (const c of state.colliders) {
      if (!blocked(c)) continue;
      const nx = Math.max(c[0], Math.min(p.x, c[2])), nz = Math.max(c[1], Math.min(p.z, c[3]));
      const dx = p.x - nx, dz = p.z - nz, d2 = dx * dx + dz * dz;
      if (d2 >= RADIUS * RADIUS) continue;
      if (d2 > 1e-9) {
        const d = Math.sqrt(d2), push = RADIUS - d;
        p.x += (dx / d) * push; p.z += (dz / d) * push;
      } else {
        const l = p.x - c[0] + RADIUS, r = c[2] - p.x + RADIUS, t = p.z - c[1] + RADIUS, b = c[3] - p.z + RADIUS;
        const m = Math.min(l, r, t, b);
        if (m === l) p.x = c[0] - RADIUS; else if (m === r) p.x = c[2] + RADIUS; else if (m === t) p.z = c[1] - RADIUS; else p.z = c[3] + RADIUS;
      }
    }
  }
}

function floorAt(x, z) {
  for (const [x0, z0, x1, z1, h] of state.platforms) if (x >= x0 && x <= x1 && z >= z0 && z <= z1) return h;
  return 0;
}

// ---------- camera control ----------
function setWalk(pos, look, instant = false) {
  const yaw = Math.atan2(-(look[0] - pos[0]), -(look[2] - pos[2]));
  const dy = look[1] - pos[1], dist = Math.hypot(look[0] - pos[0], look[2] - pos[2]);
  const pitch = Math.atan2(dy, dist);
  if (instant) {
    state.pos.set(pos[0], 0, pos[2]);
    state.yaw = yaw; state.pitch = pitch;
    return;
  }
  state.flying = {
    from: { p: camera.position.clone(), yaw: state.mode === 'walk' ? state.yaw : yawFromCamera(), pitch: state.mode === 'walk' ? state.pitch : camera.rotation.x },
    to: { p: new THREE.Vector3(pos[0], floorAt(pos[0], pos[2]) + EYE, pos[2]), yaw, pitch }, t: 0,
  };
  if (state.mode !== 'walk') setMode('walk', true);
}

function yawFromCamera() {
  const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ');
  return e.y;
}

function setMode(mode, keepCamera = false) {
  state.mode = mode;
  document.body.dataset.mode = mode;
  $('#btn-walk').setAttribute('aria-pressed', mode === 'walk');
  $('#btn-house').setAttribute('aria-pressed', mode === 'orbit');
  $('#btn-cut').hidden = mode !== 'orbit';
  if (mode === 'orbit') {
    if (document.pointerLockElement) document.exitPointerLock();
    orbit.enabled = true;
    orbit.target.set(7.0, 0.2, 4.7);
    if (!keepCamera) camera.position.set(9.4, 8.6, 11.9);
    orbit.update();
  } else {
    orbit.enabled = false;
    if (!keepCamera) {
      camera.position.set(state.pos.x, floorAt(state.pos.x, state.pos.z) + EYE, state.pos.z);
    }
    camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ');
  }
  world.visible = mode !== 'orbit';
  scene.background = mode === 'orbit' ? dollBg : null;
  camera.fov = mode === 'orbit' ? 45 : innerWidth < innerHeight ? 80 : 70;
  camera.updateProjectionMatrix();
  applyCut();
  updateLabels();
}

// ---------- input ----------
addEventListener('keydown', (e) => {
  if (e.target?.closest?.('input, textarea')) return;
  if (!$('#gallery').hidden) {
    if (e.code === 'Escape') closeGallery();
    if (!$('#lightbox').hidden && e.code === 'ArrowLeft') showShot(shotIdx - 1);
    if (!$('#lightbox').hidden && e.code === 'ArrowRight') showShot(shotIdx + 1);
    return;
  }
  state.keys[e.code] = true;
  if (e.code === 'KeyF' || e.code === 'KeyE') toggleInteractive();
  if (e.code === 'KeyN') { state.night = !state.night; applyLighting(); }
  if (e.code === 'KeyM') setMode(state.mode === 'walk' ? 'orbit' : 'walk');
  if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) selectDesign(+e.code.slice(5) - 1);
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
});
addEventListener('keyup', (e) => { state.keys[e.code] = false; });
addEventListener('blur', () => { state.keys = {}; });

canvas.addEventListener('click', () => {
  if (state.mode !== 'walk' || isTouch || state.dragged) return;
  try {
    const r = canvas.requestPointerLock?.();
    if (r && r.catch) r.catch(() => {});
  } catch { /* drag-to-look still works */ }
});
document.addEventListener('pointerlockchange', () => {
  state.locked = document.pointerLockElement === canvas;
  document.body.classList.toggle('locked', state.locked);
});
document.addEventListener('mousemove', (e) => {
  if (!state.locked || state.mode !== 'walk') return;
  state.yaw -= e.movementX * 0.0022;
  state.pitch = Math.max(-1.3, Math.min(1.3, state.pitch - e.movementY * 0.0022));
});

// drag-to-look (mouse without pointer lock, and touch)
canvas.addEventListener('pointerdown', (e) => {
  state.dragged = false;
  if (state.mode !== 'walk' || state.locked) return;
  if (e.pointerType === 'touch' && e.clientX < innerWidth * 0.42 && e.clientY > innerHeight * 0.45) return;
  state.look = { id: e.pointerId, x: e.clientX, y: e.clientY };
});
canvas.addEventListener('pointermove', (e) => {
  const L = state.look;
  if (!L || L.id !== e.pointerId) return;
  const dx = e.clientX - L.x, dy = e.clientY - L.y;
  if (Math.abs(dx) + Math.abs(dy) > 3) state.dragged = true;
  const k = e.pointerType === 'touch' ? 0.005 : 0.004;
  state.yaw += dx * k;
  state.pitch = Math.max(-1.3, Math.min(1.3, state.pitch + dy * k));
  L.x = e.clientX; L.y = e.clientY;
});
const endLook = (e) => { if (state.look?.id === e.pointerId) state.look = null; };
canvas.addEventListener('pointerup', endLook);
canvas.addEventListener('pointercancel', endLook);

// virtual joystick for phones
const joy = $('#joy'), knob = $('#joy-knob');
joy.addEventListener('pointerdown', (e) => {
  joy.setPointerCapture(e.pointerId);
  const r = joy.getBoundingClientRect();
  state.joy = { id: e.pointerId, cx: r.left + r.width / 2, cy: r.top + r.height / 2, x: 0, y: 0 };
});
joy.addEventListener('pointermove', (e) => {
  const J = state.joy;
  if (!J || J.id !== e.pointerId) return;
  let dx = e.clientX - J.cx, dy = e.clientY - J.cy;
  const m = Math.hypot(dx, dy), max = 44;
  if (m > max) { dx = (dx / m) * max; dy = (dy / m) * max; }
  J.x = dx / max; J.y = dy / max;
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
});
const endJoy = () => { state.joy = null; knob.style.transform = ''; };
joy.addEventListener('pointerup', endJoy);
joy.addEventListener('pointercancel', endJoy);
$('#btn-act').addEventListener('click', toggleInteractive);

// ---------- labels ----------
const labelLayer = $('#labels');
function buildLabels(spec) {
  labelLayer.innerHTML = '';
  for (const l of spec.labels) {
    const el = document.createElement('div');
    el.className = 'room-label';
    el.textContent = l.text;
    el._p = new THREE.Vector3(...l.p);
    labelLayer.appendChild(el);
  }
}
const tmpV = new THREE.Vector3();
function updateLabels() {
  const show = state.mode === 'orbit';
  labelLayer.hidden = !show;
  if (!show) return;
  for (const el of labelLayer.children) {
    tmpV.copy(el._p).project(camera);
    const vis = tmpV.z < 1;
    el.style.transform = `translate(-50%,-50%) translate(${((tmpV.x + 1) / 2) * innerWidth}px, ${((1 - tmpV.y) / 2) * innerHeight}px)`;
    el.style.opacity = vis ? 1 : 0;
  }
}

// ---------- minimap ----------
const mm = $('#minimap'), mctx = mm.getContext('2d');
let mmBase = null;
const MM = { x0: 330, y0: 370, x1: 1610, y1: 1230 };
function mmScale() { return Math.min(mm.width / (MM.x1 - MM.x0), mm.height / (MM.y1 - MM.y0)); }
function drawMinimapBase(spec) {
  const dpr = Math.min(devicePixelRatio, 2);
  mm.width = mm.clientWidth * dpr;
  mm.height = mm.clientHeight * dpr;
  const s = mmScale(), c = document.createElement('canvas');
  c.width = mm.width; c.height = mm.height;
  const x = c.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const tr = (px, py) => [(px - MM.x0) * s, (py - MM.y0) * s];
  x.fillStyle = css.getPropertyValue('--mm-floor').trim();
  for (const f of spec.plan.floors) {
    const [a, b] = tr(f.r[0], f.r[1]);
    x.fillRect(a, b, (f.r[2] - f.r[0]) * s, (f.r[3] - f.r[1]) * s);
  }
  x.fillStyle = css.getPropertyValue('--mm-wall').trim();
  for (const w of spec.plan.walls) {
    if (w.t !== 'full') continue;
    const [a, b] = tr(w.r[0], w.r[1]);
    x.fillRect(a, b, Math.max(1.5, (w.r[2] - w.r[0]) * s), Math.max(1.5, (w.r[3] - w.r[1]) * s));
  }
  mmBase = c;
}
function drawMinimap() {
  if (!mmBase) return;
  mctx.clearRect(0, 0, mm.width, mm.height);
  mctx.drawImage(mmBase, 0, 0);
  const s = mmScale();
  const p = state.mode === 'walk' ? state.pos : camera.position;
  const px = (p.x / PX + OX - MM.x0) * s, py = (p.z / PX + OY - MM.y0) * s;
  const yaw = state.mode === 'walk' ? state.yaw : yawFromCamera();
  mctx.save();
  mctx.translate(px, py);
  mctx.rotate(-yaw);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim();
  mctx.fillStyle = accent + '55';
  mctx.beginPath(); mctx.moveTo(0, 0); mctx.arc(0, 0, 34 * (mm.width / 220), -Math.PI / 2 - 0.6, -Math.PI / 2 + 0.6); mctx.fill();
  mctx.fillStyle = accent;
  mctx.beginPath(); mctx.arc(0, 0, 4 * (mm.width / 220), 0, Math.PI * 2); mctx.fill();
  mctx.restore();
}
mm.addEventListener('click', (e) => {
  const r = mm.getBoundingClientRect(), s = mmScale();
  const dpr = mm.width / r.width;
  const px = ((e.clientX - r.left) * dpr) / s + MM.x0, py = ((e.clientY - r.top) * dpr) / s + MM.y0;
  const x = (px - OX) * PX, z = (py - OY) * PX;
  const yaw = state.yaw;
  setWalk([x, EYE, z], [x - Math.sin(yaw), EYE, z - Math.cos(yaw)]);
});

// ---------- UI ----------
function selectDesign(i, fromHash = false) {
  if (i < 0 || i >= DESIGNS.length) return;
  state.design = i;
  const d = DESIGNS[i];
  document.querySelectorAll('.design-tab').forEach((b, k) => b.setAttribute('aria-selected', k === i));
  document.documentElement.style.setProperty('--theme', d.accent);
  $('#loading').hidden = false;
  requestAnimationFrame(() => setTimeout(() => {
    build(d.build());
    renderInfo(d);
    $('#loading').hidden = true;
    const start = state.spec.views[0];
    if (!state.started || !fromHash) { setWalk(start.p, start.look, true); if (state.mode === 'walk') setMode('walk'); }
    state.started = true;
    try { history.replaceState(null, '', '#' + d.id); } catch { /* hash is optional */ }
  }, 20));
}

function renderInfo(d) {
  $('#info-eyebrow').textContent = d.eyebrow;
  $('#info-title').textContent = d.name;
  $('#info-lede').textContent = d.lede;
  const sw = $('#swatches');
  sw.innerHTML = '';
  for (const [name, col] of d.palette) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="chip" style="background:${col}"></span><span>${name}</span>`;
    sw.appendChild(li);
  }
  const tour = $('#tour');
  tour.innerHTML = '';
  state.spec.views.forEach((v) => {
    const b = document.createElement('button');
    b.className = 'stop';
    b.innerHTML = `<span class="stop-name">${v.name}</span>${v.note ? `<span class="stop-note">${v.note}</span>` : ''}`;
    b.addEventListener('click', () => setWalk(v.p, v.look));
    tour.appendChild(b);
  });
  const ch = $('#changes');
  ch.innerHTML = '';
  for (const c of d.changes) {
    const li = document.createElement('li');
    li.textContent = c;
    ch.appendChild(li);
  }
  $('#changes-wrap').hidden = !d.changes.length;
  $('#hdb-note').textContent = d.note;
}

DESIGNS.forEach((d, i) => {
  const b = document.createElement('button');
  b.className = 'design-tab';
  b.setAttribute('role', 'tab');
  b.innerHTML = `<span class="tab-num">${i + 1}</span><span class="tab-text"><span class="tab-name">${d.name}</span><span class="tab-sub">${d.short}</span></span>`;
  b.addEventListener('click', () => selectDesign(i));
  $('#tabs').appendChild(b);
});

$('#btn-walk').addEventListener('click', () => setMode('walk'));
$('#btn-house').addEventListener('click', () => setMode('orbit'));
$('#btn-night').addEventListener('click', () => { state.night = !state.night; applyLighting(); });
$('#btn-cut').addEventListener('click', () => {
  state.cut = !state.cut;
  $('#btn-cut').setAttribute('aria-pressed', state.cut);
  applyCut();
});
$('#btn-quality').addEventListener('click', () => { state.quality = state.quality === 'high' ? 'fast' : 'high'; applyQuality(); });
$('#btn-info').addEventListener('click', () => {
  const open = document.body.classList.toggle('info-open');
  $('#btn-info').setAttribute('aria-expanded', open);
});

// ---------- renders gallery (Blender stills published next to the page) ----------
let shots = [], shotIdx = 0;
function openGallery() {
  if (document.pointerLockElement) document.exitPointerLock();
  const id = state.spec.meta.design, views = state.spec.views;
  shots = views.map((v, i) => ({ src: `renders/${id}_v${i}.jpg`, cap: v.name }));
  shots.push(
    { src: `renders/${id}_plan.jpg`, cap: 'From above' },
    { src: `renders/${id}_v0_night.jpg`, cap: `${views[0].name}, at night` },
    { src: `renders/${id}_v1_night.jpg`, cap: `${views[1].name}, at night` },
  );
  $('#gallery-title').textContent = DESIGNS[state.design].name;
  const grid = $('#gallery-grid');
  grid.innerHTML = '';
  shots.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'shot';
    const img = new Image();
    img.loading = 'lazy';
    img.src = s.src;
    img.alt = s.cap;
    img.onerror = () => b.remove();
    const cap = document.createElement('span');
    cap.textContent = s.cap;
    b.append(img, cap);
    b.addEventListener('click', () => showShot(i));
    grid.appendChild(b);
  });
  $('#gallery').hidden = false;
  $('#gallery-close').focus();
}
function showShot(i) {
  shotIdx = (i + shots.length) % shots.length;
  $('#lightbox-img').src = shots[shotIdx].src;
  $('#lightbox-img').alt = shots[shotIdx].cap;
  $('#lightbox-cap').textContent = shots[shotIdx].cap;
  $('#lightbox').hidden = false;
}
function closeGallery() {
  if (!$('#lightbox').hidden) $('#lightbox').hidden = true;
  else $('#gallery').hidden = true;
}
$('#btn-renders').addEventListener('click', openGallery);
$('#gallery-close').addEventListener('click', () => { $('#lightbox').hidden = true; $('#gallery').hidden = true; });
$('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox' || e.target.id === 'lightbox-img') $('#lightbox').hidden = true; });
$('#lb-prev').addEventListener('click', () => showShot(shotIdx - 1));
$('#lb-next').addEventListener('click', () => showShot(shotIdx + 1));

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.fov = state.mode === 'orbit' ? 45 : w < h ? 80 : 70;
  camera.updateProjectionMatrix();
  if (state.spec) drawMinimapBase(state.spec);
}
addEventListener('resize', resize);

// ---------- loop ----------
const clock = new THREE.Clock();
const fwd = new THREE.Vector3(), right = new THREE.Vector3();
function tick() {
  const dt = Math.min(clock.getDelta(), 0.05);
  for (const g of Object.values(state.groups)) {
    if (g.target === undefined) continue;
    const dir = Math.sign(g.target - g.t);
    if (dir) { g.t = Math.max(0, Math.min(1, g.t + dir * dt * 0.8)); applyGroup(g); state.openState[g.ia.id] = g.t; }
  }
  if (state.flying) {
    const F = state.flying;
    F.t = Math.min(1, F.t + dt / 1.1);
    const e = F.t < 0.5 ? 4 * F.t ** 3 : 1 - (-2 * F.t + 2) ** 3 / 2;
    camera.position.lerpVectors(F.from.p, F.to.p, e);
    let dyaw = F.to.yaw - F.from.yaw;
    dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
    state.yaw = F.from.yaw + dyaw * e;
    state.pitch = F.from.pitch + (F.to.pitch - F.from.pitch) * e;
    camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ');
    if (F.t >= 1) {
      state.pos.set(F.to.p.x, 0, F.to.p.z);
      state.flying = null;
    }
  } else if (state.mode === 'walk') {
    const k = state.keys;
    let mvF = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
    let mvR = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);
    if (state.joy) { mvF = -state.joy.y; mvR = state.joy.x; }
    if (k.KeyQ) state.yaw += dt * 1.8;
    if (k.KeyE && !k.KeyF) { /* E is interact */ }
    const speed = (k.ShiftLeft || k.ShiftRight ? 3.0 : 1.5) * dt;
    fwd.set(-Math.sin(state.yaw), 0, -Math.cos(state.yaw));
    right.set(Math.cos(state.yaw), 0, -Math.sin(state.yaw));
    if (mvF || mvR) {
      const len = Math.min(1, Math.hypot(mvF, mvR));
      const n = Math.hypot(mvF, mvR) || 1;
      state.pos.addScaledVector(fwd, (mvF / n) * len * speed).addScaledVector(right, (mvR / n) * len * speed);
      collide(state.pos);
    }
    const fy = floorAt(state.pos.x, state.pos.z) + EYE;
    camera.position.set(state.pos.x, camera.position.y + (fy - camera.position.y) * Math.min(1, dt * 10), state.pos.z);
    camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ');
    const near = nearInteractive();
    $('#prompt').hidden = !near;
    $('#btn-act').hidden = !near || !isTouch;
    if (near) $('#prompt-text').textContent = near.t > 0.5 ? near.ia.promptClose ?? 'Close it' : near.ia.prompt;
  }
  if (state.mode === 'orbit') { orbit.update(); updateLabels(); $('#prompt').hidden = true; }
  drawMinimap();
  if (state.quality === 'high') composer.render(dt);
  else renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

// ---------- boot ----------
resize();
applyQuality();
const fromHash = DESIGNS.findIndex((d) => '#' + d.id === location.hash);
document.body.dataset.mode = 'walk';
if (isTouch) document.body.classList.add('touch');
selectDesign(fromHash >= 0 ? fromHash : 0);
requestAnimationFrame(tick);
// Debug handle for local checks: build a design and grab a frame without
// waiting for animation frames (which pause when the tab is hidden).
window.__home = {
  state, camera, orbit, setWalk, setMode, selectDesign, DESIGNS,
  load(i) { state.design = i; build(DESIGNS[i].build()); $('#loading').hidden = true; },
  frame(view, { night = false, mode = 'walk' } = {}) {
    state.night = night; applyLighting();
    if (mode === 'orbit') setMode('orbit');
    else {
      const v = state.spec.views[view];
      setMode('walk', true);
      state.pos.set(v.p[0], 0, v.p[2]);
      setWalk(v.p, v.look, true);
      camera.position.set(v.p[0], floorAt(v.p[0], v.p[2]) + EYE, v.p[2]);
      camera.rotation.set(state.pitch, state.yaw, 0, 'YXZ');
    }
    camera.updateMatrixWorld();
    if (state.quality === 'high') composer.render(0.016); else renderer.render(scene, camera);
    return new Promise((r) => canvas.toBlob(r, 'image/png'));
  },
  // every canvas texture a design uses, keyed by material name
  async textures(i) {
    const out = {};
    for (const [name, def] of Object.entries(DESIGNS[i].build().mats)) {
      if (!def.tex) continue;
      const c = makeCanvas(def);
      if (c) out[name] = await new Promise((r) => c.toBlob(r, 'image/png'));
    }
    return out;
  },
};
addEventListener('hashchange', () => {
  const i = DESIGNS.findIndex((d) => '#' + d.id === location.hash);
  if (i >= 0 && i !== state.design) selectDesign(i, true);
});
