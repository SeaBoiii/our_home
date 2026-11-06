// Furniture and joinery kit. Conventions:
//  - pieces that stand against a wall have their back at local z = 0 and their
//    front facing +z, centred on x (runs go from x = 0 to len);
//  - free-standing pieces are centred on the origin;
//  - y = 0 is the finished floor.
// Material names are passed in; every design defines the generic ones below.

export const FACE = { S: 0, N: Math.PI, E: Math.PI / 2, W: -Math.PI / 2 };

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- living ----------

export function sofa(S, o = {}) {
  const w = o.w ?? 2.2, d = o.d ?? 0.95, fab = o.m ?? 'fabric', cush = o.cush ?? fab, leg = o.leg ?? 'wood';
  const arm = o.arm ?? 0.18, seatH = 0.44, backH = o.backH ?? 0.82, bev = o.round ? 0.08 : 0.035;
  const n = o.n ?? (w > 2.0 ? 3 : 2);
  if (o.plinth) S.bb(o.plinth, -w / 2 + 0.05, 0, 0.05, w / 2 - 0.05, 0.1, d - 0.05);
  else for (const sx of [-1, 1]) for (const z of [0.08, d - 0.08]) S.bb(leg, sx * (w / 2 - 0.1) - 0.025, 0, z - 0.025, sx * (w / 2 - 0.1) + 0.025, 0.1, z + 0.025);
  S.bb(fab, -w / 2, 0.1, 0, w / 2, 0.3, d, { bev: 0.02, col: true });
  S.bb(fab, -w / 2 + (o.noArms ? 0 : arm), 0.3, 0, w / 2 - (o.noArms ? 0 : arm), backH - 0.1, 0.16, { bev });
  const inner = w - (o.noArms ? 0 : 2 * arm);
  for (let i = 0; i < n; i++) {
    const x0 = -inner / 2 + (inner * i) / n + 0.008, x1 = -inner / 2 + (inner * (i + 1)) / n - 0.008;
    S.bb(cush, x0, 0.3, 0.2, x1, seatH, d - 0.01, { bev: 0.045 });
    S.box([(x0 + x1) / 2, (seatH + backH) / 2 + 0.02, 0.25], [x1 - x0, backH - seatH, 0.18], cush, { bev: 0.07, rot: [-0.13, 0, 0] });
  }
  if (!o.noArms) for (const sx of [-1, 1]) S.bb(fab, sx * w / 2 - (sx > 0 ? arm : 0), 0.1, 0, sx * w / 2 + (sx < 0 ? arm : 0), o.armH ?? 0.62, d, { bev: o.round ? 0.08 : 0.04 });
  const pil = o.pillows ?? ['pillow', 'pillow2'];
  pil.forEach((pm, i) => {
    const sx = i % 2 ? 1 : -1, k = Math.floor(i / 2);
    S.box([sx * (inner / 2 - 0.25 - k * 0.32), 0.62, 0.32 + k * 0.03], [0.44, 0.42, 0.13], pm, { bev: 0.06, rot: [-0.25, sx * 0.25, sx * 0.08] });
  });
}

// L-shaped sofa: main run along x, chaise on the +x end coming forward.
export function lsofa(S, o = {}) {
  const w = o.w ?? 2.8, d = o.d ?? 0.95, cd = o.chaise ?? 1.6;
  sofa(S, { ...o, w, d });
  const fab = o.m ?? 'fabric', cush = o.cush ?? fab;
  S.bb(fab, w / 2 - 0.9 - (o.arm ?? 0.18), 0.1, d - 0.02, w / 2, 0.3, cd, { bev: 0.02, col: true });
  S.bb(cush, w / 2 - 0.9 - 0.01, 0.3, d - 0.05, w / 2 - (o.arm ?? 0.18) - 0.008, 0.44, cd - 0.01, { bev: 0.045 });
  S.bb(fab, w / 2 - (o.arm ?? 0.18), 0.1, d - 0.02, w / 2, 0.62, cd, { bev: 0.04 });
}

export function armchair(S, o = {}) {
  const fab = o.m ?? 'fabric2', leg = o.leg ?? 'wood';
  for (const sx of [-1, 1]) for (const z of [0.1, 0.72]) S.cyl([sx * 0.3, 0.07, z], 0.018, 0.14, leg, { rb: 0.012 });
  S.bb(fab, -0.4, 0.14, 0, 0.4, 0.4, 0.82, { bev: 0.05, col: true });
  S.bb(fab, -0.4, 0.4, 0, 0.4, 0.85, 0.2, { bev: 0.07 });
  for (const sx of [-1, 1]) S.bb(fab, sx * 0.4 - (sx > 0 ? 0.12 : 0), 0.14, 0, sx * 0.4 + (sx < 0 ? 0.12 : 0), 0.6, 0.82, { bev: 0.05 });
  S.bb(o.cush ?? fab, -0.28, 0.4, 0.18, 0.28, 0.5, 0.8, { bev: 0.04 });
  if (o.pillow) S.box([0, 0.66, 0.28], [0.4, 0.3, 0.12], o.pillow, { bev: 0.05, rot: [-0.2, 0, 0] });
}

// Deco tub chair: round back, for the ocean-liner lounge.
export function tubChair(S, o = {}) {
  const fab = o.m ?? 'fabric2';
  S.cyl([0, 0.2, 0.4], 0.38, 0.32, fab, { seg: 28 });
  S.cyl([0, 0.06, 0.4], 0.3, 0.12, o.leg ?? 'brass', { seg: 28 });
  S.cyl([0, 0.4, 0.42], 0.3, 0.1, o.cush ?? fab, { seg: 28 });
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (0.15 + (0.7 * i) / 8) + Math.PI;
    S.box([Math.cos(a) * 0.33, 0.58, 0.4 - Math.sin(a) * 0.33], [0.15, 0.42, 0.1], fab, { bev: 0.04, rot: [0, -a - Math.PI / 2, 0] });
  }
  S.addCollider({ k: 'cyl', p: S.wp([0, 0.3, 0.4]), r: 0.38, h: 0.6, q: [0, 0, 0, 1] }, true);
}

export function coffeeTable(S, o = {}) {
  const top = o.top ?? 'wood', leg = o.leg ?? top;
  if (o.round) {
    const r = o.r ?? 0.45;
    S.cyl([0, 0.38, 0], r, 0.04, top, { seg: 40 });
    if (o.tiered) S.cyl([0, 0.2, 0.0], r * 0.8, 0.03, top, { seg: 40 });
    S.cyl([0, 0.18, 0], r * 0.55, 0.36, leg, { seg: 32, rb: r * 0.65 });
    S.addCollider({ k: 'cyl', p: S.wp([0, 0.2, 0]), r, h: 0.4, q: [0, 0, 0, 1] }, true);
    return;
  }
  const w = o.w ?? 1.2, d = o.d ?? 0.6;
  S.bb(top, -w / 2, 0.36, -d / 2, w / 2, 0.4, d / 2, { bev: 0.01, col: true });
  if (o.block) S.bb(leg, -w / 2 + 0.08, 0, -d / 2 + 0.08, w / 2 - 0.08, 0.36, d / 2 - 0.08);
  else for (const sx of [-1, 1]) for (const sz of [-1, 1]) S.bb(leg, sx * (w / 2 - 0.06) - 0.02, 0, sz * (d / 2 - 0.06) - 0.02, sx * (w / 2 - 0.06) + 0.02, 0.36, sz * (d / 2 - 0.06) + 0.02);
  if (o.shelf) S.bb(leg, -w / 2 + 0.06, 0.1, -d / 2 + 0.06, w / 2 - 0.06, 0.12, d / 2 - 0.06);
}

export function sideTable(S, o = {}) {
  const m = o.m ?? 'wood', h = o.h ?? 0.52, r = o.r ?? 0.22;
  S.cyl([0, h - 0.015, 0], r, 0.03, m, { seg: 28 });
  S.cyl([0, (h - 0.03) / 2, 0], 0.025, h - 0.03, o.leg ?? m);
  S.cyl([0, 0.01, 0], r * 0.7, 0.02, o.leg ?? m, { seg: 24 });
}

export function rug(S, w, d, m, o = {}) {
  if (o.round) S.cyl([0, 0.006, 0], w / 2, 0.012, m, { seg: 48 });
  else S.bb(m, -w / 2, 0.001, -d / 2, w / 2, 0.012, d / 2);
  if (o.border) S.bb(o.border, -w / 2 + 0.08, 0.0125, -d / 2 + 0.08, w / 2 - 0.08, 0.0135, d / 2 - 0.08);
}

export function tv(S, o = {}) {
  const w = o.w ?? 1.45, h = w * 0.5625, y = o.y ?? 1.15;
  S.bb('black', -w / 2, y - h / 2, 0.02, w / 2, y + h / 2, 0.05);
  S.bb(o.screen ?? 'screen', -w / 2 + 0.01, y - h / 2 + 0.01, 0.0505, w / 2 - 0.01, y + h / 2 - 0.01, 0.052);
}

export function console_(S, o = {}) {
  const w = o.w ?? 2.0, d = o.d ?? 0.42, h = o.h ?? 0.45, y0 = o.float ? 0.22 : 0;
  const body = o.m ?? 'wood', fr = o.front ?? body;
  S.bb(body, -w / 2, y0, 0, w / 2, y0 + h, d, { col: true });
  const n = o.doors ?? 3;
  for (let i = 0; i < n; i++) {
    const x0 = -w / 2 + (w * i) / n + 0.006, x1 = -w / 2 + (w * (i + 1)) / n - 0.006;
    if (o.fluted) flutes(S, fr, x0, y0 + 0.02, d, x1, y0 + h - 0.02, 0.03);
    else S.bb(fr, x0, y0 + 0.01, d, x1, y0 + h - 0.01, d + 0.012);
    if (o.handle) S.bb(o.handle, (x0 + x1) / 2 - 0.1, y0 + h - 0.06, d + 0.012, (x0 + x1) / 2 + 0.1, y0 + h - 0.05, d + 0.03);
  }
  if (o.top) S.bb(o.top, -w / 2 - 0.01, y0 + h, -0.005, w / 2 + 0.01, y0 + h + 0.025, d + 0.03);
  if (o.led) S.bb(o.led, -w / 2 + 0.05, y0 - 0.006, d - 0.06, w / 2 - 0.05, y0, d - 0.04);
}

// Vertical flutes over a face at z = zf (facing +z).
export function flutes(S, m, x0, y0, zf, x1, y1, pitch = 0.035, depth = 0.016) {
  const n = Math.max(1, Math.round((x1 - x0) / pitch));
  const p = (x1 - x0) / n;
  S.bb(m, x0, y0, zf - 0.002, x1, y1, zf + depth * 0.3);
  for (let i = 0; i < n; i++) S.cyl([x0 + p * (i + 0.5), (y0 + y1) / 2, zf + depth * 0.3], p * 0.48, y1 - y0, m, { seg: 8, sc: [1, 1, 0.6] });
}

// Wall slats (timber battens) over [x0,x1] at z = 0 facing +z.
export function slats(S, m, x0, y0, x1, y1, o = {}) {
  const pitch = o.pitch ?? 0.06, w = o.w ?? 0.035, dep = o.d ?? 0.03;
  if (o.back) S.bb(o.back, x0, y0, 0, x1, y1, 0.01);
  for (let x = x0 + w / 2; x <= x1 - w / 2 + 1e-6; x += pitch) S.bb(m, x - w / 2, y0, 0.01, x + w / 2, y1, 0.01 + dep);
}

export function floorLamp(S, o = {}) {
  const sh = o.shade ?? 'shade', m = o.m ?? 'brass';
  S.cyl([0, 0.015, 0], 0.16, 0.03, m, { seg: 24 });
  S.cyl([0, 0.75, 0], 0.012, 1.45, m);
  S.cyl([0, 1.52, 0], 0.2, 0.3, sh, { rb: 0.24, seg: 28 });
  if (o.light !== false) S.light('point', [0, 1.45, 0], { c: '#ffd9a0', i: o.i ?? 4, d: 4.5, night: true });
}

export function arcLamp(S, o = {}) {
  const m = o.m ?? 'brass';
  S.bb('stone', -0.15, 0, -0.15, 0.15, 0.06, 0.15);
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8, a = t * Math.PI * 0.75;
    pts.push([Math.sin(a) * 1.0, 0.06 + Math.sin(a + 0.6) * 1.55 + t * 0.25, 0]);
  }
  for (let i = 0; i < pts.length - 1; i++) S.rod(pts[i], pts[i + 1], 0.012, m);
  const e = pts[pts.length - 1];
  S.sph([e[0], e[1] - 0.12, 0], 0.18, o.shade ?? 'shade', { sc: [1, 0.6, 1] });
  S.light('point', [e[0], e[1] - 0.25, 0], { c: '#ffd9a0', i: o.i ?? 4, d: 4, night: true });
}

export function pendant(S, o = {}) {
  const drop = o.drop ?? 0.8, top = 2.65, y = top - drop, m = o.m ?? 'brass';
  S.cyl([0, top - 0.01, 0], 0.05, 0.02, m);
  S.cyl([0, top - drop / 2, 0], 0.004, drop, 'black', { seg: 4 });
  const shape = o.shape ?? 'dome', r = o.r ?? 0.22;
  if (shape === 'dome') {
    S.sph([0, y, 0], r, o.shade ?? m, { sc: [1, 0.55, 1] });
    S.cyl([0, y - r * 0.2, 0], r * 0.5, 0.01, 'lamp');
  } else if (shape === 'globe') S.sph([0, y - r, 0], r, o.shade ?? 'lamp');
  else if (shape === 'cyl') S.cyl([0, y - 0.15, 0], r, 0.3, o.shade ?? 'shade');
  else if (shape === 'linear') {
    S.bb(o.shade ?? m, -o.len / 2, y - 0.05, -0.04, o.len / 2, y, 0.04);
    S.bb('lamp', -o.len / 2 + 0.02, y - 0.052, -0.02, o.len / 2 - 0.02, y - 0.049, 0.02);
  }
  if (o.light !== false) S.light('point', [0, y - (shape === 'globe' ? r : 0.12), 0], { c: o.c ?? '#ffd6a0', i: o.i ?? 5, d: o.d ?? 5, night: !o.always });
}

export function downlights(S, pts, o = {}) {
  for (const [x, z] of pts) {
    S.cyl([x, 2.645, z], 0.045, 0.008, 'lamp', { seg: 16 });
    S.cyl([x, 2.648, z], 0.055, 0.004, o.ring ?? 'white', { seg: 16 });
  }
}

export function plant(S, o = {}) {
  const kind = o.kind ?? 'fig', pot = o.pot ?? 'pot', leaf = o.leaf ?? 'leaf', R = rng(o.seed ?? 7);
  const ph = o.potH ?? 0.4, pr = o.potR ?? 0.2;
  S.cyl([0, ph / 2, 0], pr, ph, pot, { rb: pr * 0.82, seg: 24, col: true });
  S.cyl([0, ph - 0.01, 0], pr * 0.92, 0.02, 'soil', { seg: 20 });
  if (kind === 'fig') {
    const h = o.h ?? 1.7;
    S.cyl([0, ph + (h - ph) / 2, 0], 0.018, h - ph, 'bark', { seg: 6 });
    for (let i = 0; i < 26; i++) {
      const y = ph + 0.35 + R() * (h - ph - 0.3), a = R() * Math.PI * 2, rr = 0.08 + R() * 0.22 * (1 - (y - ph) / (h * 1.3));
      S.box([Math.cos(a) * rr, y, Math.sin(a) * rr], [0.2, 0.012, 0.15], i % 3 ? leaf : 'leaf2', { rot: [R() * 0.8 - 0.4, a, R() * 0.6 - 0.3] });
    }
  } else if (kind === 'palm') {
    const h = o.h ?? 1.6;
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + R() * 0.4, lean = 0.3 + R() * 0.3;
      const tip = [Math.cos(a) * lean * h * 0.6, ph + h * (0.55 + R() * 0.35), Math.sin(a) * lean * h * 0.6];
      S.rod([0, ph, 0], tip, 0.008, 'bark');
      for (let j = 0; j < 6; j++) {
        const t = 0.35 + j * 0.11;
        S.box([tip[0] * t, ph + (tip[1] - ph) * t, tip[2] * t], [0.32, 0.01, 0.09], j % 2 ? leaf : 'leaf2', { rot: [0, -a + Math.PI / 2, 0.4] });
      }
    }
  } else if (kind === 'snake') {
    for (let i = 0; i < 9; i++) {
      const a = R() * Math.PI * 2, rr = R() * pr * 0.6, hh = 0.35 + R() * 0.4;
      S.box([Math.cos(a) * rr, ph + hh / 2, Math.sin(a) * rr], [0.06, hh, 0.012], i % 2 ? leaf : 'leaf2', { rot: [R() * 0.2 - 0.1, a, R() * 0.2 - 0.1] });
    }
  } else {
    // bush / monstera
    const h = o.h ?? 0.8;
    for (let i = 0; i < 14; i++) {
      const a = R() * Math.PI * 2, rr = R() * 0.3, y = ph + 0.15 + R() * (h - 0.15);
      S.rod([0, ph, 0], [Math.cos(a) * rr, y, Math.sin(a) * rr], 0.006, 'bark');
      S.box([Math.cos(a) * rr, y, Math.sin(a) * rr], [0.28, 0.012, 0.24], i % 2 ? leaf : 'leaf2', { rot: [R() * 0.6 - 0.3, a, -0.3 - R() * 0.4] });
    }
  }
}

export function books(S, x0, x1, y, depth, R, palette, o = {}) {
  let x = x0;
  while (x < x1 - 0.03) {
    if (R() < (o.gap ?? 0.12)) { x += 0.06 + R() * 0.12; continue; }
    const t = 0.02 + R() * 0.035, h = 0.17 + R() * 0.12, d = depth * (0.65 + R() * 0.3);
    if (x + t > x1) break;
    if (R() < 0.08) {
      // a small stack lying flat
      const n = 2 + Math.floor(R() * 3);
      for (let i = 0; i < n; i++) S.bb(palette[Math.floor(R() * palette.length)], x, y + i * 0.035, 0.02, x + 0.2, y + (i + 1) * 0.035 - 0.003, 0.02 + d);
      x += 0.22;
      continue;
    }
    S.bb(palette[Math.floor(R() * palette.length)], x, y, 0.02, x + t, y + h, 0.02 + d);
    x += t + 0.002;
  }
}

export function shelving(S, o = {}) {
  const w = o.w ?? 1.2, h = o.h ?? 2.1, d = o.d ?? 0.32, m = o.m ?? 'wood', R = rng(o.seed ?? 3);
  const rows = o.rows ?? 5, pal = o.books ?? ['book1', 'book2', 'book3', 'book4', 'book5'];
  if (o.back) S.bb(o.back, -w / 2, 0, 0, w / 2, h, 0.015);
  S.bb(m, -w / 2, 0, 0, -w / 2 + 0.025, h, d, { col: true });
  S.bb(m, w / 2 - 0.025, 0, 0, w / 2, h, d, { col: true });
  const cols = o.cols ?? Math.max(1, Math.round(w / 0.9));
  for (let c = 1; c < cols; c++) S.bb(m, -w / 2 + (w * c) / cols - 0.0125, 0, 0, -w / 2 + (w * c) / cols + 0.0125, h, d);
  for (let r = 0; r <= rows; r++) {
    const y = (h - 0.03) * (r / rows);
    S.bb(m, -w / 2, y, 0, w / 2, y + 0.03, d);
    if (r < rows && o.fill !== false) {
      for (let c = 0; c < cols; c++) {
        const cx0 = -w / 2 + (w * c) / cols + 0.03, cx1 = -w / 2 + (w * (c + 1)) / cols - 0.03;
        if (o.objects && R() < 0.35) { ornament(S, (cx0 + cx1) / 2, y + 0.03, d / 2, R, o.objects); continue; }
        books(S, cx0, cx1, y + 0.03, d - 0.04, R, pal);
      }
    }
    if (o.led && r > 0) S.bb(o.led, -w / 2 + 0.03, y - 0.004, d - 0.04, w / 2 - 0.03, y, d - 0.03);
  }
}

export function ornament(S, x, y, z, R, mats) {
  const m = mats[Math.floor(R() * mats.length)], k = Math.floor(R() * 3);
  if (k === 0) S.cyl([x, y + 0.11, z], 0.05, 0.22, m, { rb: 0.07, seg: 18 });
  else if (k === 1) S.sph([x, y + 0.07, z], 0.07, m);
  else { S.bb(m, x - 0.09, y, z - 0.05, x + 0.09, y + 0.13, z + 0.05); }
}

// Picture frame with art panel; tex comes from the material.
export function frame(S, w, h, art, o = {}) {
  const fm = o.frame ?? 'black', b = o.border ?? 0.025, mat = o.mat ?? 0.05;
  S.bb(fm, -w / 2, -h / 2, 0, w / 2, h / 2, 0.03);
  if (o.mount !== false) S.bb('paper', -w / 2 + b, -h / 2 + b, 0.03, w / 2 - b, h / 2 - b, 0.031);
  S.panel([0, 0, 0.032], w - 2 * (b + mat), h - 2 * (b + mat), art);
}

export function curtains(S, w, o = {}) {
  const h = o.h ?? 2.55, m = o.m ?? 'sheer', n = Math.max(6, Math.round(w / 0.09));
  S.bb(o.track ?? 'white', -w / 2 - 0.05, h + 0.02, -0.02, w / 2 + 0.05, h + 0.05, 0.06);
  const open = o.open ?? 0;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1), x = -w / 2 + t * w;
    if (open && Math.abs(x) < (w / 2) * open) continue;
    const xx = open ? (x < 0 ? -w / 2 + (x + w / 2) * (1 - open) * 0.5 : w / 2 - (w / 2 - x) * (1 - open) * 0.5) : x;
    S.box([xx, h / 2 + 0.01, 0.02 + (i % 2) * 0.03], [w / n * (open ? 0.55 : 1.15), h, 0.012], m, { rot: [0, (i % 2 ? 0.5 : -0.5), 0] });
  }
}

export function blind(S, w, h, m, o = {}) {
  const drop = o.drop ?? 0.6;
  S.bb(o.box ?? 'white', -w / 2, h - 0.08, 0, w / 2, h, 0.08);
  S.bb(m, -w / 2 + 0.02, h - drop, 0.035, w / 2 - 0.02, h - 0.08, 0.045);
  S.bb(o.box ?? 'white', -w / 2 + 0.02, h - drop - 0.02, 0.03, w / 2 - 0.02, h - drop, 0.05);
}

// The classic Singapore ceiling fan.
export function ceilingFan(S, o = {}) {
  const m = o.m ?? 'white', bl = o.blade ?? m, R = o.r ?? 0.65;
  S.cyl([0, 2.6, 0], 0.03, 0.1, m);
  S.cyl([0, 2.45, 0], 0.12, 0.14, m, { rb: 0.09, seg: 24 });
  const n = o.n ?? 3;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.3;
    S.box([Math.cos(a) * (R / 2 + 0.08), 2.42, Math.sin(a) * (R / 2 + 0.08)], [R, 0.012, 0.13], bl, { rot: [0.12, -a, 0] });
  }
  if (o.light) { S.sph([0, 2.36, 0], 0.08, 'lamp', { sc: [1, 0.6, 1] }); S.light('point', [0, 2.25, 0], { c: '#ffe6c4', i: 3, d: 4, night: true }); }
}

export function aircon(S, o = {}) {
  const w = o.w ?? 0.9, y = o.y ?? 2.25;
  S.bb('white', -w / 2, y, 0, w / 2, y + 0.3, 0.22, { bev: 0.02 });
  S.bb('vent', -w / 2 + 0.03, y + 0.01, 0.17, w / 2 - 0.03, y + 0.05, 0.225);
}

// ---------- bedroom ----------

export function bed(S, o = {}) {
  const w = o.w ?? 1.83, l = o.l ?? 2.05, fr = o.frame ?? 'fabric', hb = o.head ?? fr;
  const hbH = o.hbH ?? 1.15, hbW = o.hbW ?? w + 0.2;
  // headboard against the wall at z = 0
  if (o.headStyle === 'channel') {
    const n = Math.round(hbW / 0.16);
    for (let i = 0; i < n; i++) S.bb(hb, -hbW / 2 + (hbW * i) / n + 0.004, 0.25, 0.0, -hbW / 2 + (hbW * (i + 1)) / n - 0.004, hbH, 0.1, { bev: 0.04 });
  } else if (o.headStyle === 'wing') {
    S.bb(hb, -hbW / 2, 0.25, 0, hbW / 2, hbH, 0.1, { bev: 0.04 });
    for (const sx of [-1, 1]) S.bb(hb, sx * hbW / 2 - (sx > 0 ? 0.2 : 0), 0.25, 0.02, sx * hbW / 2 + (sx < 0 ? 0.2 : 0), hbH + 0.05, 0.3, { bev: 0.06, rot: [0, sx * -0.4, 0] });
  } else if (o.headStyle === 'arch') {
    S.bb(hb, -hbW / 2, 0.25, 0, hbW / 2, hbH - hbW / 2 + 0.2, 0.1, { bev: 0.03 });
    S.cyl([0, hbH - hbW / 2 + 0.2, 0.05], hbW / 2, 0.1, hb, { rot: [Math.PI / 2, 0, 0], seg: 40 });
  } else S.bb(hb, -hbW / 2, 0.25, 0, hbW / 2, hbH, 0.08, { bev: 0.03 });
  const z0 = 0.1;
  if (o.plinth) S.bb(o.plinth, -w / 2 + 0.08, 0, z0 + 0.08, w / 2 - 0.08, 0.12, z0 + l - 0.08);
  else for (const sx of [-1, 1]) for (const z of [z0 + 0.1, z0 + l - 0.1]) S.bb(o.leg ?? 'wood', sx * (w / 2 - 0.08) - 0.025, 0, z - 0.025, sx * (w / 2 - 0.08) + 0.025, 0.12, z + 0.025);
  S.bb(fr, -w / 2 - 0.04, 0.12, z0, w / 2 + 0.04, 0.34, z0 + l + 0.04, { bev: 0.02, col: true });
  S.bb(o.mattress ?? 'linen', -w / 2 + 0.01, 0.34, z0 + 0.02, w / 2 - 0.01, 0.55, z0 + l - 0.01, { bev: 0.05 });
  S.bb(o.duvet ?? 'duvet', -w / 2 - 0.06, 0.4, z0 + 0.62, w / 2 + 0.06, 0.6, z0 + l + 0.03, { bev: 0.05 });
  S.box([0, 0.585, z0 + 0.6], [w + 0.1, 0.06, 0.18], o.duvet ?? 'duvet', { bev: 0.03, rot: [0.15, 0, 0] });
  if (o.throw) S.bb(o.throw, -w / 2 - 0.08, 0.36, z0 + l - 0.5, w / 2 + 0.08, 0.625, z0 + l + 0.05, { bev: 0.03 });
  const pw = w > 1.6 ? 4 : 2;
  for (let i = 0; i < 2; i++) {
    const sx = i ? 1 : -1;
    S.box([sx * w / 4, 0.68, z0 + 0.2], [w / 2 - 0.1, 0.14, 0.4], o.pillow ?? 'linen', { bev: 0.06, rot: [-0.9, 0, 0] });
    if (pw > 2) S.box([sx * w / 4, 0.64, z0 + 0.38], [w / 2 - 0.15, 0.13, 0.36], o.pillow2 ?? o.pillow ?? 'linen', { bev: 0.06, rot: [-0.55, 0, 0] });
  }
  if (o.cushion) S.box([0, 0.66, z0 + 0.52], [0.5, 0.3, 0.12], o.cushion, { bev: 0.05, rot: [-0.35, 0, 0] });
}

export function bedside(S, o = {}) {
  const m = o.m ?? 'wood', w = o.w ?? 0.48, h = o.h ?? 0.5;
  if (o.float) S.bb(m, -w / 2, 0.25, 0, w / 2, h, 0.4);
  else S.bb(m, -w / 2, 0, 0, w / 2, h, 0.4, { col: true });
  S.bb(o.front ?? m, -w / 2 + 0.01, (o.float ? 0.26 : 0.02), 0.4, w / 2 - 0.01, h - 0.02, 0.41);
  if (o.handle) S.bb(o.handle, -0.06, h - 0.07, 0.41, 0.06, h - 0.06, 0.425);
  if (o.lamp !== false) tableLamp(S, 0, h, 0.2, o);
}

export function tableLamp(S, x, y, z, o = {}) {
  S.cyl([x, y + 0.12, z], 0.06, 0.24, o.lampBase ?? 'ceramic', { rb: 0.08, seg: 18 });
  S.cyl([x, y + 0.34, z], 0.13, 0.2, o.shade ?? 'shade', { rb: 0.15, seg: 24 });
  S.light('point', [x, y + 0.32, z], { c: '#ffd59a', i: o.li ?? 1.6, d: 3, night: true });
}

export function wardrobe(S, o = {}) {
  const w = o.w ?? 2.0, h = o.h ?? 2.4, d = o.d ?? 0.6, m = o.m ?? 'wood', fr = o.front ?? m;
  S.bb(m, -w / 2, 0, 0, w / 2, h, d, { col: true });
  const n = o.doors ?? Math.max(2, Math.round(w / 0.5));
  for (let i = 0; i < n; i++) {
    const x0 = -w / 2 + (w * i) / n + 0.004, x1 = -w / 2 + (w * (i + 1)) / n - 0.004;
    if (o.fluted) flutes(S, fr, x0, 0.08, d, x1, h - 0.02, 0.04, 0.018);
    else if (o.glass && i % 2 === 0) {
      S.bb(fr, x0, 0.08, d, x1, h - 0.02, d + 0.012);
      S.bb(o.glass, x0 + 0.05, 0.3, d + 0.012, x1 - 0.05, h - 0.2, d + 0.016);
    } else S.bb(fr, x0, 0.08, d, x1, h - 0.02, d + 0.018);
    if (o.handle) {
      const hx = i % 2 ? x0 + 0.04 : x1 - 0.04;
      S.bb(o.handle, hx - 0.008, 0.9, d + 0.018, hx + 0.008, 1.3, d + 0.045);
    }
  }
  if (o.plinth !== false) S.bb('black', -w / 2 + 0.02, 0, d - 0.06, w / 2 - 0.02, 0.08, d - 0.04);
}

export function dresser(S, o = {}) {
  const w = o.w ?? 1.0, m = o.m ?? 'wood';
  S.bb(m, -w / 2, 0.3, 0, w / 2, 0.76, 0.45, { col: true });
  S.bb(o.front ?? m, -w / 2 + 0.01, 0.31, 0.45, w / 2 - 0.01, 0.75, 0.46);
  if (o.legs !== false) for (const sx of [-1, 1]) S.bb(o.leg ?? 'brass', sx * (w / 2 - 0.04) - 0.01, 0, 0.03, sx * (w / 2 - 0.04) + 0.01, 0.3, 0.42);
  if (o.mirror) {
    S.cyl([0, 1.35, 0.02], 0.35, 0.02, o.mirrorFrame ?? 'brass', { rot: [Math.PI / 2, 0, 0], seg: 40 });
    S.cyl([0, 1.35, 0.032], 0.33, 0.01, 'mirror', { rot: [Math.PI / 2, 0, 0], seg: 40 });
  }
  if (o.stool) { S.cyl([0, 0.22, 0.75], 0.2, 0.44, o.stool, { seg: 24 }); }
}

export function desk(S, o = {}) {
  const w = o.w ?? 1.4, d = o.d ?? 0.7, m = o.m ?? 'wood', leg = o.leg ?? 'black';
  S.bb(m, -w / 2, 0.71, 0, w / 2, 0.745, d, { col: true });
  for (const sx of [-1, 1]) S.bb(leg, sx * (w / 2 - 0.05) - 0.025, 0, 0.05, sx * (w / 2 - 0.05) + 0.025, 0.71, d - 0.05);
  if (o.drawers) S.bb(o.drawers, w / 2 - 0.45, 0.45, 0.03, w / 2 - 0.08, 0.7, d - 0.05);
  if (o.mat) S.bb(o.mat, -0.45, 0.745, d - 0.38, 0.45, 0.748, d - 0.05);
}

export function monitor(S, x, z, o = {}) {
  const w = o.w ?? 0.62, h = o.h ?? w * 0.42, y = 0.745;
  S.bb('black', x - 0.12, y, z, x + 0.12, y + 0.01, z + 0.18);
  S.bb('black', x - 0.02, y, z + 0.04, x + 0.02, y + 0.12 + h / 2, z + 0.07);
  if (o.curved) {
    const n = 7;
    for (let i = 0; i < n; i++) {
      const a = ((i - (n - 1) / 2) / n) * 0.5, seg = w / n;
      S.at(x, y + 0.12 + h / 2, z + 0.1, 0, () => {
        S.box([Math.sin(a) * w * 0.95, 0, -Math.cos(a) * 0.2 + 0.2], [seg + 0.004, h, 0.025], 'black', { rot: [0, -a, 0] });
        S.box([Math.sin(a) * w * 0.95 + Math.cos(a) * 0, 0, -Math.cos(a) * 0.2 + 0.2 + 0.013], [seg, h - 0.02, 0.002], o.screen ?? 'screen', { rot: [0, -a, 0] });
      });
    }
    return;
  }
  S.bb('black', x - w / 2, y + 0.12, z + 0.07, x + w / 2, y + 0.12 + h, z + 0.095);
  S.bb(o.screen ?? 'screen', x - w / 2 + 0.008, y + 0.128, z + 0.0955, x + w / 2 - 0.008, y + 0.112 + h, z + 0.097);
}

export function keyboard(S, x, z, o = {}) {
  S.bb(o.m ?? 'black', x - 0.2, 0.745, z, x + 0.2, 0.765, z + 0.13);
  S.bb(o.glow ?? 'rgb', x - 0.19, 0.765, z + 0.01, x + 0.19, 0.767, z + 0.12);
  S.bb(o.m ?? 'black', x + 0.3, 0.745, z + 0.02, x + 0.36, 0.77, z + 0.12, { bev: 0.01 });
}

export function pcTower(S, x, z, o = {}) {
  S.bb('black', x - 0.11, 0, z, x + 0.11, 0.48, z + 0.46, { col: true });
  S.bb('glassDark', x + 0.11, 0.03, z + 0.03, x + 0.113, 0.45, z + 0.43);
  S.bb(o.glow ?? 'rgb', x + 0.05, 0.08, z + 0.06, x + 0.1, 0.42, z + 0.07);
  S.cyl([x + 0.08, 0.3, z + 0.25], 0.06, 0.02, o.glow ?? 'rgb', { rot: [0, 0, Math.PI / 2] });
}

export function officeChair(S, o = {}) {
  const m = o.m ?? 'black', fab = o.fab ?? 'fabric3';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    S.box([Math.cos(a) * 0.15, 0.06, Math.sin(a) * 0.15], [0.3, 0.03, 0.04], m, { rot: [0, -a, 0] });
    S.sph([Math.cos(a) * 0.3, 0.03, Math.sin(a) * 0.3], 0.03, m);
  }
  S.cyl([0, 0.27, 0], 0.025, 0.4, 'chrome');
  S.bb(fab, -0.25, 0.45, -0.24, 0.25, 0.53, 0.24, { bev: 0.04 });
  if (o.gaming) {
    S.box([0, 0.95, -0.3], [0.5, 0.8, 0.1], fab, { bev: 0.05, rot: [-0.12, 0, 0] });
    S.box([0, 1.25, -0.33], [0.3, 0.15, 0.08], o.accent ?? fab, { bev: 0.03, rot: [-0.12, 0, 0] });
    for (const sx of [-1, 1]) S.box([sx * 0.2, 0.9, -0.27], [0.1, 0.6, 0.12], o.accent ?? fab, { bev: 0.04, rot: [-0.12, 0, 0] });
  } else S.box([0, 0.85, -0.27], [0.46, 0.55, 0.06], fab, { bev: 0.03, rot: [-0.12, 0, 0] });
  for (const sx of [-1, 1]) S.bb(m, sx * 0.27 - 0.02, 0.53, -0.1, sx * 0.27 + 0.02, 0.72, 0.15);
}

// ---------- dining ----------

export function diningTable(S, o = {}) {
  const top = o.top ?? 'wood', leg = o.leg ?? top;
  if (o.round) {
    const r = o.r ?? 0.6;
    S.cyl([0, 0.74, 0], r, 0.04, top, { seg: 48, col: true });
    S.cyl([0, 0.37, 0], 0.08, 0.7, leg, { seg: 20 });
    S.cyl([0, 0.02, 0], 0.3, 0.04, leg, { seg: 32 });
    return;
  }
  const w = o.w ?? 1.8, d = o.d ?? 0.9;
  S.bb(top, -w / 2, 0.72, -d / 2, w / 2, 0.76, d / 2, { bev: 0.008, col: true });
  if (o.pedestal) {
    for (const sx of [-1, 1]) S.bb(leg, sx * w * 0.28 - 0.06, 0, -d / 2 + 0.15, sx * w * 0.28 + 0.06, 0.72, d / 2 - 0.15);
  } else for (const sx of [-1, 1]) for (const sz of [-1, 1]) S.bb(leg, sx * (w / 2 - 0.08) - 0.025, 0, sz * (d / 2 - 0.08) - 0.025, sx * (w / 2 - 0.08) + 0.025, 0.72, sz * (d / 2 - 0.08) + 0.025);
}

export function chair(S, o = {}) {
  const m = o.m ?? 'wood', seat = o.seat ?? m;
  for (const sx of [-1, 1]) for (const z of [-0.18, 0.18]) S.cyl([sx * 0.19, 0.22, z], 0.016, 0.44, m, { seg: 8 });
  S.bb(seat, -0.22, 0.44, -0.21, 0.22, 0.48, 0.21, { bev: 0.015 });
  if (o.style === 'wishbone') {
    S.cyl([0, 0.72, -0.2], 0.24, 0.03, m, { rot: [Math.PI / 2, 0, 0], seg: 24, sc: [1, 1, 0.35] });
    S.bb(m, -0.015, 0.48, -0.215, 0.015, 0.7, -0.185);
  } else if (o.style === 'cane') {
    S.bb(m, -0.21, 0.48, -0.22, 0.21, 0.88, -0.2);
    S.bb(o.cane ?? 'rattan', -0.18, 0.55, -0.205, 0.18, 0.84, -0.19);
  } else S.box([0, 0.72, -0.2], [0.42, 0.42, 0.03], m, { rot: [-0.1, 0, 0], bev: 0.01 });
}

export function stool(S, o = {}) {
  const h = o.h ?? 0.65, m = o.m ?? 'black';
  S.cyl([0, h - 0.025, 0], 0.18, 0.05, o.seat ?? 'fabric', { seg: 24 });
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.78;
    S.rod([Math.cos(a) * 0.1, h - 0.05, Math.sin(a) * 0.1], [Math.cos(a) * 0.17, 0, Math.sin(a) * 0.17], 0.012, m);
  }
  S.tor([0, h * 0.35, 0], 0.14, 0.008, m, { rot: [Math.PI / 2, 0, 0] });
}

// ---------- kitchen ----------

// Base cabinet run from x = 0 to len, back at z = 0.
export function baseRun(S, len, o = {}) {
  const d = o.d ?? 0.6, body = o.body ?? 'cab', top = o.top ?? 'stone', n = Math.max(1, Math.round(len / 0.6));
  S.bb('black', 0.02, 0, 0.0, len - 0.02, 0.1, d - 0.06);
  S.bb(body, 0, 0.1, 0, len, 0.86, d - 0.02, { col: true });
  for (let i = 0; i < n; i++) {
    const x0 = (len * i) / n + 0.003, x1 = (len * (i + 1)) / n - 0.003;
    if (o.fluted) flutes(S, body, x0, 0.11, d - 0.02, x1, 0.85, 0.035, 0.012);
    else S.bb(o.front ?? body, x0, 0.11, d - 0.02, x1, 0.85, d);
    if (o.handle) S.bb(o.handle, x0 + 0.05, 0.8, d, x1 - 0.05, 0.81, d + 0.025);
  }
  S.bb(top, -0.005, 0.86, -0.005, len + 0.005, 0.9, d + 0.02);
  if (o.splash) S.bb(o.splash, 0, 0.9, 0, len, 1.5, 0.012);
}

export function wallRun(S, len, o = {}) {
  const d = o.d ?? 0.35, body = o.body ?? 'cab', y0 = o.y0 ?? 1.5, y1 = o.y1 ?? 2.3, n = Math.max(1, Math.round(len / 0.6));
  S.bb(body, 0, y0, 0, len, y1, d);
  for (let i = 0; i < n; i++) {
    const x0 = (len * i) / n + 0.003, x1 = (len * (i + 1)) / n - 0.003;
    if (o.glass && i % 3 === 1) {
      S.bb(o.front ?? body, x0, y0 + 0.005, d, x1, y1 - 0.005, d + 0.015);
      S.bb(o.glass, x0 + 0.04, y0 + 0.05, d + 0.015, x1 - 0.04, y1 - 0.05, d + 0.018);
    } else S.bb(o.front ?? body, x0, y0 + 0.005, d, x1, y1 - 0.005, d + 0.018);
  }
  if (o.led) S.bb(o.led, 0.02, y0 - 0.004, d - 0.06, len - 0.02, y0, d - 0.04);
}

export function hob(S, x, o = {}) {
  S.bb('glassDark', x - 0.3, 0.9, 0.06, x + 0.3, 0.906, 0.54);
  for (const [dx, dz, r] of [[-0.15, 0.18, 0.09], [0.15, 0.18, 0.07], [0, 0.4, 0.1]]) S.tor([x + dx, 0.907, dz], r, 0.004, 'vent', { rot: [Math.PI / 2, 0, 0] });
  if (o.hood !== false) {
    S.bb(o.hood ?? 'chrome', x - 0.45, 1.6, 0, x + 0.45, 1.68, 0.5);
    S.bb(o.hood ?? 'chrome', x - 0.15, 1.68, 0, x + 0.15, 2.4, 0.25);
  }
}

export function sink(S, x, o = {}) {
  S.bb('chrome', x - 0.4, 0.86, 0.1, x + 0.4, 0.903, 0.52);
  S.bb('steelDark', x - 0.37, 0.75, 0.13, x - 0.02, 0.904, 0.49);
  S.bb('steelDark', x + 0.02, 0.75, 0.13, x + 0.37, 0.904, 0.49);
  S.cyl([x, 1.08, 0.06], 0.015, 0.36, o.tap ?? 'chrome');
  S.rod([x, 1.26, 0.06], [x, 1.26, 0.25], 0.013, o.tap ?? 'chrome');
  S.rod([x, 1.26, 0.25], [x, 1.16, 0.27], 0.012, o.tap ?? 'chrome');
}

export function fridge(S, o = {}) {
  const w = o.w ?? 0.8, h = o.h ?? 1.85, m = o.m ?? 'steel';
  S.bb(m, -w / 2, 0, 0, w / 2, h, 0.7, { bev: 0.01, col: true });
  S.bb('black', -0.003, 0.02, 0.7, 0.003, h - 0.02, 0.705);
  for (const sx of [-1, 1]) S.bb(o.handle ?? 'chrome', sx * 0.05 - 0.01, 0.9, 0.705, sx * 0.05 + 0.01, 1.4, 0.74);
}

export function ovenTower(S, o = {}) {
  const w = o.w ?? 0.6, h = o.h ?? 2.3, body = o.body ?? 'cab';
  S.bb(body, -w / 2, 0, 0, w / 2, h, 0.6, { col: true });
  S.bb('glassDark', -w / 2 + 0.02, 0.85, 0.6, w / 2 - 0.02, 1.45, 0.615);
  S.bb('chrome', -w / 2 + 0.06, 1.38, 0.615, w / 2 - 0.06, 1.395, 0.64);
  S.bb('glassDark', -w / 2 + 0.02, 1.5, 0.6, w / 2 - 0.02, 1.86, 0.615);
}

// ---------- bathroom ----------

export function vanity(S, o = {}) {
  const w = o.w ?? 0.9, body = o.body ?? 'wood', top = o.top ?? 'stone', basins = o.basins ?? 1;
  S.bb(body, -w / 2, 0.35, 0, w / 2, 0.82, 0.5, { col: true });
  S.bb(top, -w / 2 - 0.01, 0.82, 0, w / 2 + 0.01, 0.85, 0.52);
  for (let i = 0; i < basins; i++) {
    const x = basins === 1 ? 0 : (i ? 1 : -1) * w / 4;
    S.cyl([x, 0.9, 0.27], 0.2, 0.1, 'ceramic', { rb: 0.16, seg: 32 });
    S.cyl([x, 0.951, 0.27], 0.17, 0.004, 'water', { seg: 32 });
    S.cyl([x, 1.0, 0.06], 0.012, 0.3, o.tap ?? 'chrome');
    S.rod([x, 1.14, 0.06], [x, 1.14, 0.17], 0.01, o.tap ?? 'chrome');
  }
  if (o.mirror !== false) {
    if (o.roundMirror) for (let i = 0; i < basins; i++) {
      const x = basins === 1 ? 0 : (i ? 1 : -1) * w / 4;
      S.cyl([x, 1.55, 0.015], 0.3, 0.03, o.mirrorFrame ?? 'brass', { rot: [Math.PI / 2, 0, 0], seg: 40 });
      S.cyl([x, 1.55, 0.031], 0.285, 0.004, 'mirror', { rot: [Math.PI / 2, 0, 0], seg: 40 });
    }
    else {
      S.bb(o.mirrorFrame ?? 'black', -w / 2, 1.15, 0.0, w / 2, 2.0, 0.02);
      S.bb('mirror', -w / 2 + 0.015, 1.165, 0.02, w / 2 - 0.015, 1.985, 0.022);
    }
    if (o.led) S.bb(o.led, -w / 2, 1.13, 0.0, w / 2, 1.145, 0.03);
  }
}

export function toilet(S, o = {}) {
  S.bb('ceramic', -0.18, 0.3, 0, 0.18, 0.75, 0.16, { bev: 0.03 });
  S.cyl([0, 0.2, 0.36], 0.18, 0.4, 'ceramic', { rb: 0.14, seg: 24, sc: [1, 1, 1.25] });
  S.cyl([0, 0.41, 0.37], 0.19, 0.03, o.seat ?? 'ceramic', { seg: 24, sc: [1, 1, 1.3] });
  S.bb('chrome', -0.04, 0.9, 0.0, 0.04, 1.05, 0.012);
}

export function showerScreen(S, x0, z0, x1, z1, o = {}) {
  S.bb('glassClear', x0, 0.02, z0, x1, 2.0, z1);
  S.bb(o.frame ?? 'black', x0, 1.98, z0, x1, 2.0, z1);
}

export function rainShower(S, x, z, o = {}) {
  S.cyl([x, 2.0, z], 0.15, 0.015, o.m ?? 'chrome', { seg: 28 });
  S.rod([x, 2.0, z], [x, 2.25, z], 0.012, o.m ?? 'chrome');
  S.bb(o.m ?? 'chrome', x - 0.04, 1.0, z - 0.03, x + 0.04, 1.2, z + 0.03);
}

export function bathtub(S, o = {}) {
  const l = o.l ?? 1.6, w = o.w ?? 0.78, m = o.m ?? 'ceramic';
  S.bb(m, -l / 2, 0, -w / 2, l / 2, 0.58, w / 2, { bev: 0.18, col: true });
  S.bb('water', -l / 2 + 0.08, 0.5, -w / 2 + 0.08, l / 2 - 0.08, 0.52, w / 2 - 0.08, { bev: 0.1 });
  S.cyl([l / 2 + 0.1, 0.45, 0], 0.02, 0.9, o.tap ?? 'chrome');
  S.rod([l / 2 + 0.1, 0.9, 0], [l / 2 - 0.05, 0.9, 0], 0.016, o.tap ?? 'chrome');
}

export function towelRail(S, o = {}) {
  for (const y of [0.9, 1.1, 1.3]) S.rod([-0.25, y, 0.06], [0.25, y, 0.06], 0.01, o.m ?? 'chrome');
  S.bb(o.towel ?? 'towel', -0.22, 0.75, 0.05, 0.22, 1.12, 0.08, { bev: 0.01 });
}

// ---------- utility ----------

export function washerStack(S, o = {}) {
  for (const [y0, y1] of [[0, 0.85], [0.86, 1.71]]) {
    S.bb(o.m ?? 'white', -0.3, y0, 0, 0.3, y1, 0.6, { bev: 0.01, col: true });
    S.cyl([0, (y0 + y1) / 2 - 0.05, 0.6], 0.2, 0.02, 'glassDark', { rot: [Math.PI / 2, 0, 0], seg: 32 });
    S.tor([0, (y0 + y1) / 2 - 0.05, 0.61], 0.2, 0.018, 'chrome', { rot: [0, 0, 0] });
  }
}

export function shoeCabinet(S, o = {}) {
  const w = o.w ?? 1.2, h = o.h ?? 1.0, d = o.d ?? 0.38, m = o.m ?? 'wood';
  S.bb(m, -w / 2, o.float ? 0.2 : 0, 0, w / 2, h, d, { col: true });
  const n = Math.round(w / 0.4);
  for (let i = 0; i < n; i++) {
    const x0 = -w / 2 + (w * i) / n + 0.004, x1 = -w / 2 + (w * (i + 1)) / n - 0.004;
    if (o.fluted) flutes(S, o.front ?? m, x0, (o.float ? 0.21 : 0.01), d, x1, h - 0.01, 0.03, 0.012);
    else if (o.cane) { S.bb(o.front ?? m, x0, (o.float ? 0.21 : 0.01), d, x1, h - 0.01, d + 0.01); S.bb(o.cane, x0 + 0.04, (o.float ? 0.25 : 0.05), d + 0.01, x1 - 0.04, h - 0.05, d + 0.013); }
    else S.bb(o.front ?? m, x0, (o.float ? 0.21 : 0.01), d, x1, h - 0.01, d + 0.015);
  }
  if (o.top) S.bb(o.top, -w / 2 - 0.01, h, -0.005, w / 2 + 0.01, h + 0.02, d + 0.02);
  if (o.led && o.float) S.light('rect', [0, 0.18, d / 2], { w: w - 0.1, h: d - 0.1, rot: [-Math.PI / 2, 0, 0], c: '#ffcf8a', i: 3, night: true });
}

// ---------- the people who live here ----------

// Cat tree with a sisal post, two platforms and a hammock bed.
export function catTree(S, o = {}) {
  const m = o.m ?? 'wood', sis = o.sisal ?? 'sisal', pad = o.pad ?? 'fabric3', h = o.h ?? 1.6;
  S.bb(m, -0.3, 0, -0.25, 0.3, 0.04, 0.25, { col: true });
  S.cyl([-0.12, h / 2, 0], 0.05, h, sis, { seg: 14 });
  S.cyl([0.16, h * 0.32, 0.06], 0.045, h * 0.62, sis, { seg: 14 });
  S.cyl([-0.05, h * 0.4, 0.05], 0.24, 0.03, m, { seg: 28 });
  S.cyl([-0.05, h * 0.425, 0.05], 0.22, 0.02, pad, { seg: 28 });
  S.cyl([0.12, h * 0.65, -0.05], 0.2, 0.03, m, { seg: 28 });
  S.cyl([-0.12, h + 0.02, 0], 0.26, 0.04, m, { seg: 28 });
  S.cyl([-0.12, h + 0.06, 0], 0.24, 0.07, pad, { seg: 28, rb: 0.2 });
  if (o.cat) cat(S, -0.12, h + 0.08, 0, o.cat, 0.6);
}

// A loaf-shaped cat, because Nurul's cats come too.
export function cat(S, x, y, z, m, ry = 0, o = {}) {
  S.at(x, y, z, ry, () => {
    S.sph([0, 0.09, 0], 0.11, m, { sc: [1.55, 0.85, 1] });
    S.sph([0.16, 0.16, 0], 0.075, m);
    for (const sz of [-1, 1]) S.cyl([0.18, 0.235, sz * 0.04], 0.025, 0.05, m, { rb: 0.003, seg: 4, rot: [sz * 0.2, 0, 0] });
    S.cyl([-0.14, 0.03, 0.07], 0.022, 0.24, o.tail ?? m, { rot: [Math.PI / 2, -0.6, 0], seg: 8 });
    for (const sz of [-1, 1]) S.sph([0.228, 0.175, sz * 0.025], 0.008, 'black');
  });
}

export function catShelf(S, w, y, m, pad) {
  S.bb(m, -w / 2, y, 0, w / 2, y + 0.035, 0.3);
  if (pad) S.bb(pad, -w / 2 + 0.02, y + 0.035, 0.02, w / 2 - 0.02, y + 0.05, 0.28);
}

export function litterBox(S, o = {}) {
  S.bb(o.m ?? 'white', -0.3, 0, 0, 0.3, 0.45, 0.45, { bev: 0.05, col: true });
  S.cyl([0, 0.2, 0.45], 0.1, 0.01, 'black', { rot: [Math.PI / 2, 0, 0], seg: 20 });
}

// Prayer corner: folded sejadah on a low bench, a rolled spare, and a
// small qibla marker on the wall.
export function prayerCorner(S, o = {}) {
  const mat = o.mat ?? 'sejadah', m = o.m ?? 'wood';
  S.bb(mat, -0.35, 0.002, 0.1, 0.35, 0.014, 1.25);
  S.bb(o.trim ?? 'brass', -0.33, 0.014, 0.12, 0.33, 0.016, 0.18);
  S.bb(m, -0.45, 0, 0, 0.45, 0.42, 0.32);
  S.bb(o.front ?? m, -0.44, 0.01, 0.32, 0.44, 0.41, 0.33);
  S.cyl([0.25, 0.47, 0.16], 0.05, 0.4, o.roll ?? mat, { rot: [0, 0, Math.PI / 2] });
  S.bb('paper', -0.2, 0.42, 0.08, 0.05, 0.47, 0.26);
  S.cyl([0, 1.75, 0.01], 0.07, 0.015, o.trim ?? 'brass', { rot: [Math.PI / 2, 0, 0], seg: 24 });
}

// Wall strip of LED light (emissive) at height y from x0 to x1, z just off the wall.
export function ledStrip(S, x0, x1, y, m = 'led', z = 0.01) {
  S.bb(m, x0, y - 0.006, z, x1, y + 0.006, z + 0.012);
}

// Recessed ceiling cove: an emissive strip just under the ceiling edge.
export function cove(S, x0, z0, x1, z1, m = 'led', drop = 0.12) {
  const y = 2.65 - drop;
  S.bb('white', x0, y - 0.03, z0, x1, y, z1);
  S.bb(m, x0 + 0.03, y + 0.005, z0 + 0.03, x1 - 0.03, y + 0.012, z1 - 0.03);
}
