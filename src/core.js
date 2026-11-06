// Scene spec: a plain-data description of the flat. The Three.js walkthrough
// and the Blender builder (tools/blender_build.py) both read it, so nothing
// in here may depend on Three.js.

// Plan pixels -> metres. The HDB plan is drawn at roughly 1.12 cm per pixel
// (internal area of the traced rooms comes to ~86 sqm, matching the brochure).
export const PX = 0.0112;
export const OX = 345;
export const OY = 380;
export const H = 2.65; // floor to ceiling
export const mx = (px) => +((px - OX) * PX).toFixed(4);
export const mz = (py) => +((py - OY) * PX).toFixed(4);

// Quaternions are [x, y, z, w], same convention as Three.js.
export function qeuler(x = 0, y = 0, z = 0) {
  const c1 = Math.cos(x / 2), c2 = Math.cos(y / 2), c3 = Math.cos(z / 2);
  const s1 = Math.sin(x / 2), s2 = Math.sin(y / 2), s3 = Math.sin(z / 2);
  return [
    s1 * c2 * c3 + c1 * s2 * s3,
    c1 * s2 * c3 - s1 * c2 * s3,
    c1 * c2 * s3 + s1 * s2 * c3,
    c1 * c2 * c3 - s1 * s2 * s3,
  ];
}

export function qmul(a, b) {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}

export function qrot(q, v) {
  const [x, y, z, w] = q;
  const [vx, vy, vz] = v;
  const ix = w * vx + y * vz - z * vy;
  const iy = w * vy + z * vx - x * vz;
  const iz = w * vz + x * vy - y * vx;
  const iw = -x * vx - y * vy - z * vz;
  return [
    ix * w + iw * -x + iy * -z - iz * -y,
    iy * w + iw * -y + iz * -x - ix * -z,
    iz * w + iw * -z + ix * -y - iy * -x,
  ];
}

const r4 = (n) => Math.round(n * 1e4) / 1e4;

export class Spec {
  constructor(meta = {}) {
    this.meta = meta;
    this.mats = {};
    this.items = [];
    this.lights = [];
    this.colliders = [];
    this.interactive = [];
    this.labels = [];
    this.views = [];
    this.plan = { walls: [], floors: [] };
    this.frames = [{ p: [0, 0, 0], q: [0, 0, 0, 1], s: 1 }];
    this.layer = 0;
    this.groupId = null;
  }

  get f() { return this.frames[this.frames.length - 1]; }

  mat(name, def) { this.mats[name] = def; return name; }

  // Run fn with a local frame at (x, y, z) rotated ry about the vertical axis.
  at(x, y, z, ry, fn, s = 1) {
    const f = this.f;
    const p = this.wp([x, y, z]);
    this.frames.push({ p, q: qmul(f.q, qeuler(0, ry, 0)), s: f.s * s });
    fn();
    this.frames.pop();
  }

  // Same as at() but takes plan pixels and a floor-level y.
  atPx(px, py, ry, fn, y = 0) { this.at(mx(px), y, mz(py), ry, fn); }

  wp(local) {
    const f = this.f;
    const r = qrot(f.q, local.map((v) => v * f.s));
    return [r4(f.p[0] + r[0]), r4(f.p[1] + r[1]), r4(f.p[2] + r[2])];
  }

  onLayer(layer, fn) {
    const prev = this.layer;
    this.layer = layer;
    fn();
    this.layer = prev;
  }

  // Items drawn inside fn move together; the app animates them about the pivot.
  group(id, pivotLocal, fn, anim) {
    const prev = this.groupId;
    const pivot = this.wp(pivotLocal);
    this.groupId = id;
    fn();
    this.groupId = prev;
    const at = anim.at ? this.wp(anim.at) : pivot;
    this.interactive.push({
      id, pivot, axis: anim.axis || 'y', open: anim.open, slide: anim.slide ? qrot(this.f.q, anim.slide) : null,
      at: [at[0], at[2]], r: anim.r || 1.3, prompt: anim.prompt || 'Open', promptClose: anim.promptClose,
    });
  }

  push(item, o) {
    const f = this.f;
    const lq = o.rot ? qeuler(...o.rot) : [0, 0, 0, 1];
    item.p = this.wp(item.p);
    item.q = qmul(f.q, lq).map(r4);
    if (f.s !== 1) for (const k of ['s', 'r', 'rb', 'R', 'h']) if (item[k] !== undefined) item[k] = Array.isArray(item[k]) ? item[k].map((v) => v * f.s) : item[k] * f.s;
    if (this.layer) item.L = this.layer;
    if (this.groupId) item.g = this.groupId;
    if (o.bev) item.bev = o.bev * f.s;
    if (o.sc) item.sc = o.sc;
    if (o.uv) item.uv = o.uv;
    this.items.push(item);
    if (o.col) this.addCollider(item, o.col);
    return item;
  }

  addCollider(item, col) {
    const half = item.k === 'box' ? [item.s[0] / 2, item.s[1] / 2, item.s[2] / 2]
      : item.k === 'cyl' ? [Math.max(item.r, item.rb ?? item.r), item.h / 2, Math.max(item.r, item.rb ?? item.r)]
      : [item.r, item.r, item.r];
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const c = qrot(item.q, [sx * half[0], 0, sz * half[2]]);
      x0 = Math.min(x0, c[0]); x1 = Math.max(x1, c[0]);
      z0 = Math.min(z0, c[2]); z1 = Math.max(z1, c[2]);
    }
    const rect = [r4(item.p[0] + x0), r4(item.p[2] + z0), r4(item.p[0] + x1), r4(item.p[2] + z1)];
    if (this.groupId) rect.push(this.groupId);
    this.colliders.push(rect);
  }

  // Box by centre and size.
  box(p, s, m, o = {}) { return this.push({ k: 'box', p, s, m }, o); }

  // Box by min/max corners, which reads more naturally for joinery.
  bb(m, x0, y0, z0, x1, y1, z1, o = {}) {
    return this.box([(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], [Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)], m, o);
  }

  // Vertical cylinder (or cone with o.rb) centred at p.
  cyl(p, r, h, m, o = {}) { return this.push({ k: 'cyl', p, r, rb: o.rb ?? r, h, seg: o.seg || 20, m }, o); }

  sph(p, r, m, o = {}) { return this.push({ k: 'sph', p, r, m }, o); }

  tor(p, R, r, m, o = {}) { return this.push({ k: 'tor', p, R, r, m }, o); }

  // Prism: polygon pts in local [x, z], extruded up by h from p.y.
  ext(p, pts, h, m, o = {}) {
    const f = this.f;
    return this.push({ k: 'ext', p, pts: pts.map(([x, z]) => [r4(x * f.s), r4(z * f.s)]), h, m }, o);
  }

  // A flat text/art panel facing local +z. tex is a canvas recipe for the app.
  panel(p, w, h, m, o = {}) { return this.push({ k: 'pnl', p, s: [w, h], m }, o); }

  // Thin cylinder between two local points (rigging, rails, legs at an angle).
  rod(a, b, r, m, o = {}) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const len = Math.hypot(...d);
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
    // rotate +y onto d
    const n = d.map((v) => v / len);
    const ax = [n[2], 0, -n[0]];
    const al = Math.hypot(...ax);
    let q = [0, 0, 0, 1];
    if (al > 1e-6) {
      const ang = Math.acos(Math.max(-1, Math.min(1, n[1])));
      const s = Math.sin(ang / 2) / al;
      q = [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(ang / 2)];
    } else if (n[1] < 0) q = [1, 0, 0, 0];
    const item = this.push({ k: 'cyl', p: mid, r, rb: r, h: len, seg: o.seg || 6, m }, {});
    item.q = qmul(item.q, q).map(r4);
    return item;
  }

  // Lights: kind 'point' | 'spot' | 'rect'. i is in Three.js physical units.
  light(kind, p, o = {}) {
    const l = { k: kind, p: this.wp(p), c: o.c || '#ffe2b8', i: o.i ?? 6, d: o.d ?? 6 };
    if (o.t) l.t = this.wp(o.t);
    if (kind === 'spot') { l.a = o.a ?? 0.5; l.pen = o.pen ?? 0.6; }
    if (kind === 'rect') { l.w = o.w; l.h = o.h; l.q = qmul(this.f.q, o.rot ? qeuler(...o.rot) : [0, 0, 0, 1]).map(r4); }
    if (o.night) l.night = true;
    if (o.shadow) l.shadow = true;
    this.lights.push(l);
    return l;
  }

  label(text, p) { this.labels.push({ text, p: this.wp(p) }); }

  view(name, p, look, note = '') { this.views.push({ name, p: this.wp(p), look: this.wp(look), note }); }

  toJSON() {
    return {
      meta: this.meta, mats: this.mats, items: this.items, lights: this.lights, colliders: this.colliders,
      interactive: this.interactive, labels: this.labels, views: this.views, plan: this.plan, H,
    };
  }
}
