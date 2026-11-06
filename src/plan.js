// The Bayshore Oasis 4-room plan, traced from the HDB brochure in plan pixels
// (see bayshore_oasis_4rm.jpg). x grows to the right, y grows down the page.
import { mx, mz, H } from './core.js';

const W = (id, x1, y1, x2, y2, o = {}) => ({ id, r: [x1, y1, x2, y2], t: 'full', ...o });
const win = (id, x1, y1, x2, y2, o = {}) => ({ id, r: [x1, y1, x2, y2], t: 'win', sill: 0.9, head: 2.25, ...o });
const door = (id, x1, y1, x2, y2, o = {}) => ({ id, r: [x1, y1, x2, y2], t: 'door', head: 2.1, ...o });
const open = (id, x1, y1, x2, y2, o = {}) => ({ id, r: [x1, y1, x2, y2], t: 'open', sill: 0, head: 2.1, ...o });

export function baseWalls() {
  return [
    // north facade
    W('cNW', 345, 383, 405, 413),
    win('wM', 405, 399, 565, 413),
    W('tA', 565, 399, 680, 413),
    win('wB2', 680, 399, 812, 413),
    W('tB', 812, 399, 1012, 413),
    W('colT', 840, 383, 990, 399),
    win('wB3', 1012, 399, 1148, 413),
    W('cNE', 1148, 383, 1210, 413),
    W('cNE2', 1178, 413, 1210, 530),
    W('lvN1', 1210, 515, 1250, 530),
    win('wLv', 1250, 517, 1410, 530, { sill: 0.45, head: 2.3 }),
    W('lvN2', 1410, 505, 1520, 530),
    W('fin', 1520, 497, 1590, 530, { ext: true }),
    W('lvE', 1505, 530, 1520, 835),
    // master bedroom shell
    W('mW', 345, 413, 378, 825),
    W('mS', 378, 800, 600, 812),
    W('mSx', 345, 812, 495, 825),
    // bathrooms
    door('dB1', 600, 800, 680, 812, { leaf: { hinge: 'L', into: 'S', open: 75 } }),
    W('bN', 680, 800, 808, 812),
    door('dB2', 808, 800, 895, 812, { leaf: { hinge: 'R', into: 'S', open: 80 } }),
    W('bMid', 724, 812, 734, 965),
    W('bW', 495, 812, 523, 975),
    W('bS1', 495, 965, 600, 975),
    win('wB1v', 600, 965, 668, 975, { sill: 1.55, head: 2.15 }),
    W('bS2', 668, 965, 745, 975),
    win('wB2v', 745, 965, 795, 975, { sill: 1.55, head: 2.15 }),
    W('bS3', 795, 965, 882, 975),
    W('colK', 895, 800, 945, 975),
    // kitchen and service yard
    W('kN', 945, 945, 1010, 975),
    win('wSY', 865, 975, 882, 1180, { sill: 0.95, head: 2.2 }),
    W('kS', 865, 1180, 1206, 1208),
    W('pKY1', 1003, 975, 1010, 1060),
    door('dKY', 1003, 1060, 1010, 1130, { leaf: { hinge: 'B', into: 'W', open: 70 } }),
    W('pKY2', 1003, 1130, 1010, 1180),
    W('kE1', 1180, 950, 1206, 1055),
    W('ent1', 1180, 1055, 1240, 1095),
    W('kE2', 1180, 1095, 1206, 1180),
    door('dMain', 1240, 1065, 1350, 1095, { leaf: { hinge: 'L', into: 'N', open: 0, main: true } }),
    // household shelter (structural, cannot be hacked)
    W('shN', 1360, 835, 1528, 862, { shelter: true }),
    W('shE', 1500, 862, 1528, 1095, { shelter: true }),
    W('shS', 1350, 1065, 1528, 1095, { shelter: true }),
    W('shW1', 1360, 862, 1390, 905, { shelter: true }),
    door('dSh', 1360, 905, 1390, 980, { shelter: true, leaf: { hinge: 'B', into: 'W', open: 0, steel: true } }),
    W('shW2', 1360, 980, 1390, 1065, { shelter: true }),
    // bedroom partitions
    W('p12', 640, 413, 648, 690),
    W('p23', 906, 413, 918, 700),
    W('b2S', 640, 688, 815, 700),
    door('dB2r', 815, 688, 906, 700, { leaf: { hinge: 'R', into: 'N', open: 85 } }),
    door('dB3r', 918, 688, 1010, 700, { leaf: { hinge: 'L', into: 'N', open: 85 } }),
    W('b3S', 1010, 688, 1190, 700),
    W('b3E', 1180, 530, 1190, 688),
    W('mdA', 735, 700, 745, 712),
    door('dM', 735, 712, 745, 795, { leaf: { hinge: 'B', into: 'W', open: 85 } }),
    W('mdB', 735, 795, 745, 800),
  ];
}

export function baseFloors() {
  return [
    { id: 'master', r: [378, 413, 640, 700], room: 'master' },
    { id: 'masterLow', r: [378, 700, 735, 800], room: 'master' },
    { id: 'bed2', r: [648, 413, 906, 688], room: 'bed2' },
    { id: 'bed3', r: [918, 413, 1180, 688], room: 'bed3' },
    { id: 'corridor', r: [745, 700, 1190, 800], room: 'living' },
    { id: 'living', r: [1190, 530, 1505, 835], room: 'living' },
    { id: 'dining', r: [945, 800, 1190, 950], room: 'living' },
    { id: 'dining2', r: [1190, 835, 1360, 950], room: 'living' },
    { id: 'foyer', r: [1206, 950, 1360, 1065], room: 'foyer' },
    { id: 'kitchen', r: [1010, 950, 1180, 1180], room: 'kitchen' },
    { id: 'yard', r: [882, 975, 1003, 1180], room: 'yard' },
    { id: 'bath1', r: [523, 812, 724, 965], room: 'bath1' },
    { id: 'bath2', r: [734, 812, 895, 965], room: 'bath2' },
    { id: 'shelter', r: [1390, 862, 1500, 1065], room: 'shelter' },
  ];
}

// Edit helpers for the hacked layouts.
export function editWalls(walls, { remove = [], add = [], replace = {} }) {
  const out = walls.filter((w) => !remove.includes(w.id)).map((w) => (replace[w.id] ? { ...w, ...replace[w.id] } : w));
  return out.concat(add);
}
export { W, win, door, open };

const pxBox = (S, m, r, y0, y1, o) => S.bb(m, mx(r[0]), y0, mz(r[1]), mx(r[2]), y1, mz(r[3]), o);

// Builds walls, openings, glazing, floors and ceilings into the spec.
// mats: { wall, glass, frame, sill, ceil, door, floors: { room: matName } }
export function buildShell(S, walls, floors, mats, o = {}) {
  S.plan.walls = walls.map((w) => ({ id: w.id, r: w.r, t: w.t, shelter: !!w.shelter }));
  S.plan.floors = floors.map((f) => ({ id: f.id, r: f.r, room: f.room }));
  const wallMat = (w) => (w.shelter ? mats.shelter || mats.wall : w.m || mats.wall);
  for (const w of walls) {
    const r = w.r;
    const wm = wallMat(w);
    if (w.t === 'full') {
      pxBox(S, wm, r, -0.35, w.h || H, { col: true });
      continue;
    }
    // every opening still gets a slab under it so the floor is continuous
    pxBox(S, mats.sill, r, -0.35, 0, {});
    if (w.t === 'door' || w.t === 'open') {
      if (w.sill > 0) pxBox(S, wm, r, -0.35, w.sill, { col: true });
      pxBox(S, wm, r, w.head, H, {});
      if (w.t === 'door' && w.leaf && !o.noLeaf?.includes(w.id)) doorLeaf(S, w, mats);
      if (w.t === 'door' && w.leaf && w.leaf.open === 0) S.colliders.push([mx(r[0]), mz(r[1]), mx(r[2]), mz(r[3])]);
      continue;
    }
    // window: sill wall, head wall, frame and glass in the middle of the wall
    pxBox(S, wm, r, -0.35, w.sill, { col: true });
    pxBox(S, wm, r, w.head, H, {});
    const horiz = r[2] - r[0] > r[3] - r[1];
    const x0 = mx(r[0]), x1 = mx(r[2]), z0 = mz(r[1]), z1 = mz(r[3]);
    const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    const len = horiz ? x1 - x0 : z1 - z0;
    const fr = mats.frame, t = 0.05;
    if (horiz) {
      S.bb(mats.glass, x0, w.sill, cz - 0.006, x1, w.head, cz + 0.006, { col: true });
      S.bb(fr, x0, w.sill, cz - t / 2, x1, w.sill + 0.04, cz + t / 2);
      S.bb(fr, x0, w.head - 0.04, cz - t / 2, x1, w.head, cz + t / 2);
      const n = Math.max(1, Math.round(len / 0.75));
      for (let i = 0; i <= n; i++) S.bb(fr, x0 + (len * i) / n - 0.02, w.sill, cz - t / 2, x0 + (len * i) / n + 0.02, w.head, cz + t / 2);
      if (w.head - w.sill > 1.2) S.bb(fr, x0, w.head - 0.45, cz - t / 2, x1, w.head - 0.42, cz + t / 2);
    } else {
      S.bb(mats.glass, cx - 0.006, w.sill, z0, cx + 0.006, w.head, z1, { col: true });
      S.bb(fr, cx - t / 2, w.sill, z0, cx + t / 2, w.sill + 0.04, z1);
      S.bb(fr, cx - t / 2, w.head - 0.04, z0, cx + t / 2, w.head, z1);
      const n = Math.max(1, Math.round(len / 0.75));
      for (let i = 0; i <= n; i++) S.bb(fr, cx - t / 2, w.sill, z0 + (len * i) / n - 0.02, cx + t / 2, w.head, z0 + (len * i) / n + 0.02);
    }
  }
  for (const f of floors) {
    const fm = mats.floors[f.id] || mats.floors[f.room] || mats.floors.default;
    pxBox(S, fm, f.r, -0.35, 0, {});
    const cm = mats.ceils?.[f.id] || mats.ceils?.[f.room] || mats.ceil;
    if (!o.noCeil?.includes(f.id)) S.onLayer(1, () => pxBox(S, cm, f.r, H, H + 0.08, {}));
  }
  // close the ceiling over walls too, so no daylight leaks along wall tops
  S.onLayer(1, () => S.bb(mats.ceil, mx(345), H + 0.08, mz(383), mx(1528), H + 0.2, mz(1208)));
  exterior(S, mats);
}

function doorLeaf(S, w, mats) {
  const r = w.r, L = w.leaf;
  const horiz = r[2] - r[0] > r[3] - r[1];
  const x0 = mx(r[0]), x1 = mx(r[2]), z0 = mz(r[1]), z1 = mz(r[3]);
  const span = horiz ? x1 - x0 : z1 - z0;
  const width = Math.min(L.w || span - 0.1, 0.92);
  const th = L.steel ? 0.06 : 0.045;
  const mat = L.steel ? mats.steel || mats.frame : L.main ? mats.mainDoor || mats.door : mats.door;
  // frame (architrave) around the opening
  const fr = mats.doorFrame || mats.frame;
  if (horiz) {
    S.bb(fr, x0, 0, z0 - 0.01, x0 + 0.04, 2.1, z1 + 0.01);
    S.bb(fr, x1 - 0.04, 0, z0 - 0.01, x1, 2.1, z1 + 0.01);
    S.bb(fr, x0, 2.06, z0 - 0.01, x1, 2.1, z1 + 0.01);
  } else {
    S.bb(fr, x0 - 0.01, 0, z0, x1 + 0.01, 2.1, z0 + 0.04);
    S.bb(fr, x0 - 0.01, 0, z1 - 0.04, x1 + 0.01, 2.1, z1);
    S.bb(fr, x0 - 0.01, 2.06, z0, x1 + 0.01, 2.1, z1);
  }
  // hinge corner in world space; closed leaf runs along the wall from the hinge
  const o = ((L.open || 0) * Math.PI) / 180;
  const hx = horiz ? (L.hinge === 'L' ? x0 + 0.04 : x1 - 0.04) : (x0 + x1) / 2;
  const hz = horiz ? (z0 + z1) / 2 : L.hinge === 'T' ? z0 + 0.04 : z1 - 0.04;
  const sign = { L: { N: 1, S: -1 }, R: { N: -1, S: 1 }, T: { E: 1, W: -1 }, B: { E: -1, W: 1 } }[L.hinge][L.into];
  const base = { L: 0, R: Math.PI, T: -Math.PI / 2, B: Math.PI / 2 }[L.hinge];
  const ang = base + sign * o;
  S.at(hx, 0, hz, ang, () => {
    S.bb(mat, 0, 0.01, -th / 2, width, 2.05, th / 2);
    S.bb(mats.handle || mats.frame, width - 0.1, 1.0, -th / 2 - 0.05, width - 0.07, 1.03, th / 2 + 0.05);
    if (L.main) {
      S.bb(mats.handle || mats.frame, width - 0.12, 0.95, -th / 2 - 0.02, width - 0.06, 1.15, th / 2 + 0.02);
      S.box([width / 2, 1.5, th / 2 + 0.002], [0.12, 0.12, 0.004], mats.handle || mats.frame);
    }
  });
}

function exterior(S, mats) {
  const ex = mats.exterior || mats.wall;
  // air-con ledge and laundry ledge
  pxBox(S, ex, [500, 975, 735, 1088], -0.2, -0.05, {});
  S.bb(mats.frame, mx(500), -0.05, mz(1080), mx(735), 0.9, mz(1088));
  S.bb(mats.frame, mx(500), -0.05, mz(975), mx(508), 0.9, mz(1088));
  S.box([mx(560), 0.3, mz(1030)], [0.8, 0.6, 0.3], 'ext_unit');
  pxBox(S, ex, [815, 975, 865, 1180], -0.2, -0.05, {});
  for (let i = 0; i < 5; i++) S.bb(mats.frame, mx(818 + i * 10), 1.9, mz(985), mx(820 + i * 10), 1.92, mz(1170));
  // common corridor outside the main door
  pxBox(S, ex, [1150, 1095, 1700, 1300], -0.2, -0.02, {});
  S.bb(ex, mx(1150), -0.02, mz(1290), mx(1700), 1.0, mz(1300));
  S.bb(ex, mx(1150), H + 0.2, mz(1095), mx(1700), H + 0.4, mz(1300));
  S.mat('ext_unit', { c: '#d9d9d6', r: 0.6 });
}

export const px = { mx, mz };
