// Design 5 — Bayshore Residence. Aleem's "warm coastal Japandi" brief: a
// boutique seaside resort in the morning, a cosy sanctuary at night. The
// original layout stays; the luxury is in proportion, joinery and light.
//  01 foyer: a continuous light-oak wall that folds in the household shelter
//  02 living: low oatmeal sofa, oval oak table, a quiet TV wall
//  03 the Titanic: a sealed museum case between living and dining
//  04 dining: a four-seater (extends to six), nothing else
//  05 kitchen: appliance tower, an open appliance zone, slim glass sliders
//  06 main bedroom: restful, no visible tech
//  07 bedroom 2: Aleem's tech sanctuary with a guest daybed
//  08 bedroom 3: Nurul's dressing and quiet room, with space to pray
import { Spec, mx, mz } from '../core.js';
import { baseWalls, baseFloors, buildShell } from '../plan.js';
import * as K from '../kit.js';
import { titanicMats, vitrine } from '../titanic.js';
import { mats, art, labels, cove } from './common.js';
import { tileRoom } from './d1.js';

const { FACE } = K;
const A = (S, px, py, ry, fn, y = 0) => S.atPx(px, py, ry, fn, y);
const QIBLA = FACE.E - 0.4; // ~293 degrees, assuming the plan's top is north

// Rice-paper lantern with a few ribs, hung from the ceiling by its flex.
function lantern(S, x, z, r, drop, i = 3) {
  const y = 2.65 - drop - r * 0.82;
  S.at(x, 0, z, 0, () => {
    S.cyl([0, 2.65 - drop / 2, 0], 0.004, drop, 'black', { seg: 4 });
    S.sph([0, y, 0], r, 'paperLantern', { sc: [1, 0.82, 1] });
    for (let k = -2; k <= 2; k++) {
      const t = k / 3;
      S.tor([0, y + t * r * 0.82, 0], r * Math.sqrt(1 - t * t) * 1.004, 0.0025, 'paperRib', { rot: [Math.PI / 2, 0, 0] });
    }
    S.light('point', [0, y, 0], { c: '#ffd9a8', i, d: 5, night: true });
  });
}

// Plan outline of a rectangle with rounded corners, for the dining table top.
function roundRect(w, d, r, n = 6) {
  const pts = [];
  const corners = [[w / 2 - r, d / 2 - r, 0], [-w / 2 + r, d / 2 - r, Math.PI / 2], [-w / 2 + r, -d / 2 + r, Math.PI], [w / 2 - r, -d / 2 + r, Math.PI * 1.5]];
  for (const [cx, cz, a0] of corners) for (let i = 0; i <= n; i++) {
    const a = a0 + (i / n) * (Math.PI / 2);
    pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
  }
  return pts;
}

// Monitor on a desk-clamped arm instead of its stand.
function armMonitor(S, x, z, w = 0.62) {
  const h = w * 0.42, y = 1.12;
  S.cyl([x, 0.8, 0.04], 0.018, 0.12, 'black');
  S.rod([x, 0.86, 0.04], [x, 1.02, 0.12], 0.012, 'black');
  S.rod([x, 1.02, 0.12], [x, y, z - 0.02], 0.012, 'black');
  S.bb('black', x - w / 2, y - h / 2, z, x + w / 2, y + h / 2, z + 0.025);
  S.bb('screen', x - w / 2 + 0.008, y - h / 2 + 0.008, z + 0.0255, x + w / 2 - 0.008, y + h / 2 - 0.008, z + 0.027);
}

export function build() {
  const S = new Spec({ design: 'd5' });
  mats(S, {
    wall: { c: '#f3ede3', r: 0.93, tex: { k: 'limewash', seed: 41 }, ts: 4 },
    ceil: { c: '#f7f3ec', r: 0.95 },
    shelter: { c: '#f3ede3', r: 0.93 },
    frame: { c: '#2b2b2a', r: 0.45, m: 0.4 },
    door: { c: '#ece4d6', r: 0.6 },
    doorFrame: { c: '#ece4d6', r: 0.6 },
    handle: { c: '#b9a27a', r: 0.35, m: 0.9 },
    brass: { c: '#b9a27a', r: 0.35, m: 0.9 },
    mainDoor: { c: '#c8a27a', r: 0.5, tex: { k: 'grain', vertical: true }, ts: 1.2 },
    wood: { c: '#c8a27a', r: 0.55, tex: 'grain', ts: 1.0 },
    wood2: { c: '#a98560', r: 0.55, tex: 'grain', ts: 1.0 },
    fabric: { c: '#e6dccb', r: 0.97, tex: 'boucle', ts: 0.35 },
    fabric2: { c: '#9aaa8c', r: 0.95, tex: 'fabric', ts: 0.3 },
    fabric3: { c: '#efe9df', r: 0.97, tex: 'boucle', ts: 0.3 },
    pillow: { c: '#9aaa8c', r: 0.95, tex: 'fabric', ts: 0.3 },
    pillow2: { c: '#efe6d6', r: 0.95, tex: 'boucle', ts: 0.3 },
    linen: { c: '#f6f1e8', r: 0.95, tex: 'fabric', ts: 0.4 },
    duvet: { c: '#eee6d8', r: 0.95, tex: 'fabric', ts: 0.4 },
    cab: { c: '#c8a27a', r: 0.5, tex: { k: 'grain', vertical: true }, ts: 1.0 },
    stone: { c: '#f1ebe1', r: 0.3, tex: { k: 'marble', vein: 'rgba(150,135,115,0.35)', veins: 6 }, ts: 1.6 },
    shade: { c: '#f1e6d0', r: 0.9, e: '#ffd9a0', ei: 0, ein: 0.9 },
    leaf: { c: '#56704a', r: 0.55, ds: true },
    leaf2: { c: '#7c9268', r: 0.55, ds: true },
    pot: { c: '#d9cdbb', r: 0.85 },
    book1: { c: '#9aaa8c', r: 0.8 },
    book2: { c: '#c8a27a', r: 0.7 },
    book3: { c: '#efe6d6', r: 0.8 },
    book4: { c: '#8fa9a8', r: 0.8 },
    book5: { c: '#6f6455', r: 0.8 },
    sejadah: { c: '#7c8a6e', r: 0.9, tex: { k: 'songket', bg: '#7c8a6e', fg: '#e8dcc4' }, ts: 0.5 },
  });
  titanicMats(S);
  S.mat('stoneFloor', { c: '#e6dacb', r: 0.42, tex: { k: 'travertine', c: '#e6dacb', n: 2, grout: '#d6c9b6' }, ts: 2.4 });
  S.mat('oakFloor', { c: '#cdb08a', r: 0.6, tex: { k: 'wood', planks: 4 }, ts: 1.5 });
  S.mat('bathFloor', { c: '#ddd1bf', r: 0.45, tex: { k: 'travertine', c: '#ddd1bf', n: 4 }, ts: 1.2 });
  S.mat('stoneTile', { c: '#e8ded0', r: 0.35, tex: { k: 'travertine', c: '#e8ded0', n: 2, grout: '#d8ccba' }, ts: 1.2 });
  S.mat('sageTile', { c: '#a9b59c', r: 0.25, tex: { k: 'tile', n: 8, m: 8, c: '#a9b59c', cols: ['#a9b59c', '#9aaa8c', '#b4bfa8'], grout: '#efe8dc', zellige: true, vary: 0.1 }, ts: 0.6, bump: 0.02 });
  S.mat('oak', { c: '#c9a57c', r: 0.55, tex: { k: 'grain', vertical: true }, ts: 0.8 });
  S.mat('oakH', { c: '#c9a57c', r: 0.5, tex: { k: 'grain' }, ts: 1.0 });
  S.mat('ivoryCab', { c: '#efe8dc', r: 0.5 });
  S.mat('sage', { c: '#9aaa8c', r: 0.6 });
  S.mat('seaglass', { c: '#8fa9a8', r: 0.5 });
  S.mat('sandLime', { c: '#e2d3bc', r: 0.95, tex: { k: 'limewash', seed: 9 }, ts: 2.0 });
  S.mat('shelterDoor', { c: '#c8a27a', r: 0.5, tex: { k: 'grain', vertical: true }, ts: 1.0 });
  S.mat('rugLiving', { c: '#efe8dc', r: 1, tex: 'boucle', ts: 0.5 });
  S.mat('rugBed', { c: '#e2d3bc', r: 1, tex: 'boucle', ts: 0.5 });
  S.mat('rugSage', { c: '#c6ccb8', r: 1, tex: 'boucle', ts: 0.5 });
  S.mat('paperLantern', { c: '#f6efe2', r: 0.9, e: '#ffe1b8', ei: 0.25, ein: 1.6 });
  S.mat('paperRib', { c: '#e2d6c2', r: 0.9 });
  S.mat('coveGlow', { c: '#fff4de', e: '#ffdcaa', ei: 0.35, ein: 2.2 });
  S.mat('sheer', { c: '#f6f1e8', r: 1, o: 0.72, glass: true, ds: true });
  S.mat('blackout', { c: '#dccdb4', r: 0.95, tex: 'fabric', ts: 0.3 });
  S.mat('slatBlind', { c: '#c9a57c', r: 0.6, tex: { k: 'stripes', n: 24, cols: ['#c9a57c', '#a98560'] }, ts: 0.4 });
  S.mat('panel', { c: '#121416', r: 0.2, e: '#d8c9a8', ei: 0.15, ein: 0.4 });
  S.mat('robot', { c: '#f2f1ee', r: 0.3 });
  S.mat('lego1', { c: '#c4281b', r: 0.35 });
  S.mat('lego2', { c: '#f5cd2f', r: 0.35 });
  S.mat('lego3', { c: '#0d69ab', r: 0.35 });

  buildShell(S, baseWalls(), baseFloors(), {
    wall: 'wall', glass: 'glass', frame: 'frame', sill: 'stone', ceil: 'ceil', door: 'door', doorFrame: 'doorFrame',
    handle: 'handle', mainDoor: 'mainDoor', steel: 'shelterDoor', shelter: 'shelter', exterior: 'exterior',
    floors: { default: 'stoneFloor', master: 'oakFloor', masterLow: 'oakFloor', bed2: 'oakFloor', bed3: 'oakFloor', bath1: 'bathFloor', bath2: 'bathFloor', yard: 'bathFloor', shelter: 'stoneFloor' },
  });
  for (const r of [[1190, 530, 1505, 835], [745, 700, 1190, 800], [945, 800, 1190, 950], [378, 413, 640, 700], [648, 413, 906, 688], [918, 413, 1180, 688], [1206, 950, 1360, 1065]]) cove(S, r);

  // ---------------- 01 foyer: one continuous oak wall on the right ----------------
  // The shelter door keeps its own leaf, swing and HDB notice; only its finish
  // is matched to the joinery.
  A(S, 1360, 862, FACE.W, () => {
    S.bb('oak', 0, 0, 0, 0.46, 2.45, 0.4, { col: true }); // tall cabinet north of the shelter door
    S.bb('oak', 0.46, 2.1, 0, 1.33, 2.45, 0.4); // header over the door recess
    for (const x of [0.46, 1.31]) S.bb('oak', x, 0, 0.0, x + 0.02, 2.1, 0.4);
    // bench bay: floating shoe drawers, a cushion, a lit key niche, cabinets above
    S.at(1.33, 0, 0, 0, () => {
      S.bb('oak', 0, 0.14, 0, 0.88, 0.42, 0.4, { col: true });
      for (let i = 0; i < 2; i++) S.bb('oak', 0.01 + i * 0.44, 0.15, 0.4, 0.43 + i * 0.44, 0.41, 0.41);
      S.bb('fabric3', 0.02, 0.42, 0.02, 0.86, 0.48, 0.39, { bev: 0.02 });
      S.bb('led', 0.03, 0.134, 0.3, 0.85, 0.14, 0.33);
      S.bb('oak', 0, 1.25, 0, 0.88, 2.45, 0.35);
      S.bb('led', 0.03, 1.244, 0.26, 0.85, 1.25, 0.29);
      S.bb('oakH', 0.25, 1.0, 0.0, 0.63, 1.02, 0.14); // key tray
      S.cyl([0.36, 1.035, 0.07], 0.05, 0.02, 'ceramic', { seg: 16 });
      S.cyl([0.55, 1.06, 0.07], 0.022, 0.1, 'glassClear', { seg: 12 }); // hand sanitiser
    });
  });
  S.box([mx(1375) - 0.034, 1.5, mz(942)], [0.004, 0.13, 0.19], 'paper'); // the shelter's notice stays visible
  S.light('rect', [mx(1310), 0.13, mz(1022)], { w: 0.8, h: 0.3, rot: [-Math.PI / 2, 0, 0], c: '#ffcf8a', i: 3, night: true });
  A(S, 1206, 1000, FACE.E, () => {
    S.at(0, 1.55, 0, 0, () => K.frame(S, 0.6, 0.8, art(S, { k: 'shore' }), { frame: 'oak', mat: 0.05 }));
    S.bb('panel', -0.62, 1.22, 0.0, -0.52, 1.34, 0.012); // smart-home scene panel
  });
  S.light('point', [mx(1285), 2.3, mz(1010)], { i: 1.8, d: 4, night: true });

  // ---------------- 02 living: the sea is the artwork ----------------
  A(S, 1190, 609, FACE.E, () => {
    for (const sx of [-1, 1]) K.slats(S, 'oak', sx > 0 ? 0.55 : -0.88, 0, sx > 0 ? 0.88 : -0.55, 2.47, { back: 'oak', pitch: 0.05, w: 0.028 });
    K.tv(S, { w: 1.45, y: 1.25 });
    S.bb('oak', -0.75, 0.25, 0.0, 0.75, 0.6, 0.42, { col: true });
    K.slats(S, 'oakH', -0.75, 0.26, 0.75, 0.59, { pitch: 0.04, w: 0.025, d: 0.015 });
    S.bb('led', -0.7, 0.244, 0.32, 0.7, 0.25, 0.36);
    K.tableLamp(S, 0.52, 0.6, 0.22, { lampBase: 'ceramic', shade: 'paperLantern', li: 1.2 });
    S.cyl([-0.5, 0.66, 0.22], 0.06, 0.12, 'sage', { rb: 0.08, seg: 16 });
  });
  A(S, 1505, 690, FACE.W, () => {
    K.lsofa(S, { w: 2.8, d: 1.0, chaise: 1.6, m: 'fabric', cush: 'fabric', backH: 0.72, armH: 0.55, leg: 'oak', round: true, pillows: ['pillow', 'pillow2', 'seaglass', 'pillow2'] });
    S.bb('linen', 0.3, 0.44, 0.35, 1.0, 0.47, 0.95, { rot: [0, 0.2, 0] });
    S.at(0, 1.55, 0, 0, () => K.frame(S, 1.3, 0.75, art(S, { k: 'shore' }), { frame: 'oak', mat: 0.05 }));
  });
  A(S, 1330, 680, 0, () => {
    K.rug(S, 2.6, 3.2, 'rugLiving');
    S.cyl([0, 0.36, 0], 0.5, 0.045, 'oakH', { seg: 48, sc: [0.8, 1, 1.35] });
    S.cyl([0, 0.17, 0], 0.32, 0.34, 'oakH', { seg: 40, sc: [0.8, 1, 1.35] });
    S.bb('paper', -0.12, 0.383, -0.2, 0.12, 0.43, 0.05);
    S.cyl([0.05, 0.44, 0.25], 0.07, 0.12, 'ceramic', { rb: 0.05, seg: 16 });
  });
  A(S, 1478, 548, 0, () => K.plant(S, { kind: 'fig', h: 2.0, pot: 'stone', seed: 33 }));
  A(S, 1330, 533, FACE.S, () => K.curtains(S, 2.05, { m: 'sheer', h: 2.4 }));
  A(S, 1458, 530, FACE.S, () => K.aircon(S, { y: 2.08 }));
  S.at(mx(1340), 0, mz(680), 0, () => K.ceilingFan(S, { m: 'oakH', blade: 'oakH', r: 0.65, light: true }));
  for (const [px, py] of [[1240, 580], [1240, 780], [1440, 580], [1440, 780]]) S.cyl([mx(px), 2.644, mz(py)], 0.09, 0.01, 'vent', { seg: 24 });
  K.cat(S, mx(1450), 0.44, mz(800), 'cat1', 1.2);

  // ---------------- 03 the Titanic, between living and dining ----------------
  // 166 cm sealed low-iron case, dimmable warm LED, drawers below for manuals,
  // spare bricks and the rest of the collection. Well away from the windows.
  A(S, 1100, 700, FACE.S, () => {
    S.bb('oak', -0.9, 0, 0, 0.76, 0.8, 0.45, { col: true });
    S.bb('black', -0.88, 0, 0.36, 0.74, 0.08, 0.41);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
      const x0 = -0.9 + c * 0.553 + 0.004, x1 = x0 + 0.545, y0 = 0.09 + r * 0.355, y1 = y0 + 0.35;
      S.bb('oak', x0, y0, 0.45, x1, y1, 0.462);
      S.bb('wood2', x0 + 0.05, y1 - 0.035, 0.462, x1 - 0.05, y1 - 0.025, 0.466);
    }
    S.bb('stone', -0.91, 0.8, -0.005, 0.77, 0.83, 0.47);
    S.at(-0.07, 0, 0, 0, () => vitrine(S, { L: 1.66, W: 0.42, H: 0.62, y0: 0.83, inset: 0.02, frame: 'oak', lidMat: 'oak', glass: 'glassClear', deck: 'oakH', li: 3 }));
    // floating shelf above with a sea print, ceramics and trailing pothos
    S.bb('oak', -0.9, 1.92, 0, 0.76, 1.96, 0.28);
    S.bb('led', -0.86, 1.914, 0.2, 0.72, 1.92, 0.24);
    S.at(-0.45, 2.22, 0.02, 0, () => K.frame(S, 0.5, 0.36, art(S, { k: 'mountains', sky: '#d9dcd6', seed: 31 }), { frame: 'oak', mat: 0.04 }));
    S.cyl([0.05, 2.04, 0.14], 0.07, 0.16, 'ceramic', { rb: 0.05, seg: 16 });
    S.cyl([0.2, 2.02, 0.14], 0.05, 0.12, 'sandLime', { seg: 16 });
    S.at(0.5, 1.96, 0.14, 0, () => {
      S.cyl([0, 0.08, 0], 0.11, 0.16, 'pot', { rb: 0.08, seg: 18 });
      const R = K.rng(77);
      for (let i = 0; i < 14; i++) {
        const a = R() * Math.PI * 2, len = 0.15 + R() * 0.55;
        const tip = [Math.cos(a) * 0.18, 0.12 - len * (0.6 + R() * 0.4), 0.05 + Math.sin(a) * 0.12];
        S.rod([0, 0.15, 0], tip, 0.004, 'leaf');
        S.box(tip, [0.07, 0.006, 0.06], i % 2 ? 'leaf' : 'leaf2', { rot: [R(), R() * 3, 0.4] });
      }
    });
    // slatted oak return at the corner where this wall meets the TV wall
    K.slats(S, 'oak', 0.78, 0, 0.9, 2.47, { back: 'oak', pitch: 0.04, w: 0.025 });
  });
  S.light('spot', [mx(1080), 2.6, mz(800)], { t: [mx(1090), 1.1, mz(722)], a: 0.4, pen: 0.75, i: 7, d: 6, c: '#fff0d8' });

  // ---------------- 04 dining: four seats, extends to six ----------------
  A(S, 1110, 873, 0, () => {
    S.ext([0, 0.72, 0], roundRect(0.85, 1.4, 0.16), 0.04, 'oakH');
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) S.cyl([sx * 0.3, 0.36, sz * 0.55], 0.025, 0.72, 'oak', { rb: 0.018, seg: 10 });
    S.addCollider({ k: 'box', p: S.wp([0, 0.4, 0]), s: [0.85, 0.8, 1.4], q: [0, 0, 0, 1] }, true);
    S.cyl([0, 0.8, 0], 0.07, 0.16, 'ceramic', { rb: 0.05, seg: 16 });
    for (let i = 0; i < 6; i++) S.sph([Math.cos(i) * 0.04, 0.9 + (i % 3) * 0.02, Math.sin(i) * 0.04], 0.03, 'linen');
    S.cyl([0, 0.762, 0], 0.18, 0.004, 'rattan', { seg: 28 });
  });
  for (const py of [845, 902]) {
    A(S, 1060, py, FACE.E, () => K.chair(S, { m: 'oak', seat: 'fabric3', style: 'cane', cane: 'fabric3' }));
    A(S, 1160, py, FACE.W, () => K.chair(S, { m: 'oak', seat: 'fabric3', style: 'cane', cane: 'fabric3' }));
  }
  lantern(S, mx(1100), mz(860), 0.32, 0.6, 3.2);
  lantern(S, mx(1135), mz(905), 0.2, 0.85, 1.6);
  A(S, 978, 905, 0, () => K.plant(S, { kind: 'fig', h: 1.8, pot: 'stone', seed: 6 }));
  A(S, 945, 850, FACE.E, () => S.at(0, 1.5, 0, 0, () => K.frame(S, 0.45, 0.6, art(S, { k: 'abstract', seed: 11, cols: ['#e2d3bc', '#9aaa8c', '#8fa9a8', '#c8a27a', '#efe6d6'], bg: '#f3ede3' }), { frame: 'oak', mat: 0.04 })));

  // ---------------- 05 kitchen: everything behind its own boundary ----------------
  // Slim black-framed glass sliders fill the existing opening; both panels are
  // parked to the right here so the kitchen is open.
  for (const [x0, x1, dz] of [[1098, 1178, -0.035], [1093, 1173, 0.0]]) {
    const z = mz(950) + dz;
    S.bb('glassClear', mx(x0), 0.02, z - 0.006, mx(x1), 2.4, z + 0.006, { col: true });
    for (const [a, b] of [[x0, x0 + 2], [x1 - 2, x1]]) S.bb('frame', mx(a), 0, z - 0.014, mx(b), 2.42, z + 0.014);
    for (const y of [0.0, 2.4]) S.bb('frame', mx(x0), y, z - 0.014, mx(x1), y + 0.025, z + 0.014);
  }
  S.bb('frame', mx(1010), 2.42, mz(950) - 0.05, mx(1180), 2.45, mz(950) + 0.02);
  S.bb('wall', mx(1010), 2.45, mz(950) - 0.06, mx(1180), 2.65, mz(950) + 0.03);
  A(S, 1180, 952, FACE.W, () => {
    // appliance tower: fridge, then oven and microwave over the robot vacuum's dock
    S.at(0.375, 0, 0, 0, () => K.fridge(S, { w: 0.75, h: 2.05, m: 'oak', handle: 'brass' }));
    S.bb('oak', 0, 2.05, 0, 0.75, 2.45, 0.7);
    S.bb('oak', 0.75, 0.16, 0, 1.35, 2.45, 0.6, { col: true });
    S.bb('black', 0.77, 0, 0.0, 1.33, 0.16, 0.04);
    S.bb('steelDark', 0.77, 0, 0.04, 1.33, 0.005, 0.58);
    S.cyl([1.05, 0.05, 0.3], 0.17, 0.09, 'robot', { seg: 32 });
    S.cyl([1.05, 0.096, 0.3], 0.07, 0.006, 'black', { seg: 24 });
    S.bb('glassDark', 0.78, 0.85, 0.6, 1.32, 1.45, 0.615);
    S.bb('brass', 0.82, 1.38, 0.615, 1.28, 1.392, 0.635);
    S.bb('glassDark', 0.78, 1.5, 0.6, 1.32, 1.86, 0.615);
    // cooking run: induction, deep drawers, a hood behind the upper cabinet
    S.at(1.35, 0, 0, 0, () => {
      K.baseRun(S, 0.93, { body: 'oak', front: 'oak', top: 'stone', handle: 'brass', splash: 'stoneTile' });
      K.hob(S, 0.47, { hood: false });
      K.wallRun(S, 0.93, { body: 'ivoryCab', front: 'ivoryCab', y0: 1.6, y1: 2.45, led: 'led' });
      S.bb('steelDark', 0.17, 1.58, 0.05, 0.77, 1.6, 0.33);
    });
  });
  A(S, 1126, 1180, FACE.N, () => {
    K.baseRun(S, 1.28, { body: 'oak', front: 'oak', top: 'stone', handle: 'brass', splash: 'stoneTile' });
    K.sink(S, 0.95, { tap: 'brass' });
    // open countertop appliance zone, with room to breathe while they run
    S.cyl([0.14, 0.99, 0.32], 0.12, 0.18, 'white', { seg: 24 }); // rice cooker
    S.bb('black', 0.32, 0.9, 0.18, 0.56, 1.22, 0.45, { bev: 0.04 }); // air fryer
    S.cyl([0.66, 1.0, 0.36], 0.07, 0.2, 'steelDark', { rb: 0.08, seg: 18 }); // kettle
    S.bb('steelDark', 0.62, 0.9, 0.06, 0.88, 1.28, 0.32, { bev: 0.02 }); // coffee machine
    S.bb('oak', 0, 1.75, 0, 1.28, 1.785, 0.28);
    S.bb('led', 0.02, 1.744, 0.2, 1.26, 1.75, 0.24);
    for (let i = 0; i < 5; i++) S.cyl([0.12 + i * 0.26, 1.86, 0.14], 0.05, 0.15, ['ceramic', 'sage', 'glassClear', 'ceramic', 'sandLime'][i], { seg: 14 });
  });
  K.downlights(S, [[mx(1095), mz(1010)], [mx(1095), mz(1110)]]);
  S.light('point', [mx(1095), 2.3, mz(1060)], { i: 2.8, d: 4.5, night: true });

  // ---------------- service yard: laundry and cleaning only ----------------
  A(S, 1003, 1018, FACE.W, () => K.washerStack(S, { m: 'white' }));
  A(S, 1003, 1150, FACE.W, () => S.bb('ivoryCab', -0.3, 0, 0, 0.3, 2.1, 0.45, { col: true }));
  A(S, 940, 1180, FACE.N, () => K.litterBox(S));

  // ---------------- corridor ----------------
  S.cyl([mx(880), 2.645, mz(750)], 0.1, 0.03, 'white', { seg: 24 }); // ceiling Wi-Fi access point
  A(S, 860, 700, FACE.S, () => S.at(0, 1.5, 0, 0, () => K.frame(S, 0.45, 0.55, art(S, { k: 'monogram', bg: '#9aaa8c', sub: '21 · 08 · 2027' }), { frame: 'oak', mat: 0.04 })));
  S.light('point', [mx(880), 2.3, mz(750)], { i: 1.4, d: 4, night: true });

  // ---------------- 06 main bedroom: no visible tech ----------------
  A(S, 378, 540, FACE.E, () => {
    K.slats(S, 'oak', -1.08, 0, 1.08, 2.47, { back: 'oak', pitch: 0.055, w: 0.03 });
    S.at(0, 0, 0.04, 0, () => K.bed(S, { w: 1.83, l: 2.05, frame: 'fabric3', head: 'fabric', headStyle: 'channel', hbW: 2.0, hbH: 1.15, duvet: 'linen', throw: 'rugBed', pillow: 'linen', pillow2: 'pillow2', cushion: 'pillow', leg: 'oak' }));
    S.bb('led', -1.0, 1.19, 0.035, 1.0, 1.2, 0.05); // glow behind the headboard
    for (const sx of [-1, 1]) {
      S.bb('oakH', sx * 1.22 - 0.24, 0.48, 0.04, sx * 1.22 + 0.24, 0.52, 0.44); // floating ledge
      S.cyl([sx * 1.22, 0.6, 0.3], 0.05, 0.16, 'ceramic', { rb: 0.04, seg: 14 });
    }
  });
  lantern(S, mx(378) + 0.3, mz(432), 0.13, 1.25, 1.1);
  lantern(S, mx(378) + 0.3, mz(648), 0.13, 1.25, 1.1);
  A(S, 475, 545, 0, () => K.rug(S, 2.3, 2.7, 'rugBed'));
  A(S, 488, 800, FACE.N, () => K.wardrobe(S, { w: 2.36, h: 2.45, d: 0.6, m: 'oak', front: 'oak', doors: 4, handle: 'brass' }));
  A(S, 485, 416, FACE.S, () => { K.curtains(S, 1.9, { m: 'blackout', h: 2.4, open: 0.6 }); S.at(0, 0, 0.08, 0, () => K.curtains(S, 1.9, { m: 'sheer', h: 2.4 })); });
  A(S, 640, 520, FACE.W, () => K.aircon(S, { y: 2.08 }));
  S.at(mx(505), 0, mz(555), 0, () => K.ceilingFan(S, { m: 'oakH', blade: 'oakH', r: 0.6 }));
  S.light('point', [mx(505), 2.3, mz(555)], { c: '#ffd5a0', i: 1.8, d: 4, night: true });
  K.cat(S, mx(470), 0.62, mz(610), 'cat3', 2.2);

  // ---------------- 07 bedroom 2: Aleem's tech sanctuary ----------------
  // Desk on the side wall so the window lights it from the left, not behind the screens.
  A(S, 906, 522, FACE.W, () => {
    K.desk(S, { w: 1.75, d: 0.72, m: 'oakH', leg: 'oak', mat: 'fabric3' });
    armMonitor(S, -0.34, 0.3, 0.62);
    armMonitor(S, 0.34, 0.3, 0.62);
    K.keyboard(S, -0.05, 0.42);
    S.bb('oak', 0.45, 0.55, 0.05, 0.85, 0.7, 0.66); // charging drawer
    S.bb('black', -0.8, 0.6, 0.02, 0.4, 0.64, 0.2); // cable tray
    K.pcTower(S, -0.62, 0.15, { glow: 'seaglass' });
    for (const y of [1.55, 1.95]) {
      S.bb('oakH', -0.85, y, 0, 0.85, y + 0.03, 0.26);
      S.bb('led', -0.82, y - 0.006, 0.18, 0.82, y, 0.22);
    }
    const R = K.rng(64);
    K.books(S, -0.8, 0.1, 1.58, 0.2, R, ['book1', 'book2', 'book3', 'book4', 'book5']);
    for (let i = 0; i < 3; i++) K.ornament(S, 0.25 + i * 0.2, 1.58, 0.13, R, ['lego1', 'lego2', 'lego3', 'ceramic']);
    S.cyl([-0.6, 2.06, 0.13], 0.07, 0.1, 'pot', { seg: 16 });
    for (let i = 0; i < 8; i++) S.box([-0.6 + Math.cos(i) * 0.1, 1.98 - (i % 4) * 0.08, 0.13 + Math.sin(i) * 0.06], [0.06, 0.006, 0.05], i % 2 ? 'leaf' : 'leaf2', { rot: [0.5, i, 0.3] });
  });
  A(S, 845, 522, FACE.E, () => K.officeChair(S, { fab: 'fabric3' }));
  // glass-fronted collection cabinet, lit on every shelf
  A(S, 906, 645, FACE.W, () => {
    S.bb('oak', -0.3, 0, 0, 0.3, 0.02, 0.42, { col: true });
    for (const x of [-0.3, 0.28]) S.bb('oak', x, 0, 0, x + 0.02, 2.2, 0.42);
    S.bb('oak', -0.3, 2.18, 0, 0.3, 2.2, 0.42);
    S.bb('ivoryCab', -0.28, 0, 0, 0.28, 2.2, 0.01);
    for (const y of [0.5, 1.0, 1.5]) {
      S.bb('oak', -0.28, y - 0.02, 0, 0.28, y, 0.4);
      S.bb('led', -0.26, y + 0.43, 0.3, 0.26, y + 0.44, 0.34);
      for (let i = 0; i < 2; i++) S.bb(['lego1', 'lego2', 'lego3'][(i + Math.round(y * 2)) % 3], -0.22 + i * 0.24, y, 0.1, -0.04 + i * 0.24, y + 0.16, 0.3);
    }
    S.bb('glassClear', -0.28, 0.02, 0.41, 0.28, 2.18, 0.415, { col: true });
  });
  A(S, 648, 560, FACE.E, () => K.sofa(S, { w: 1.9, d: 0.85, m: 'fabric2', cush: 'fabric3', backH: 0.65, armH: 0.5, leg: 'oak', pillows: ['pillow2', 'seaglass'] }));
  A(S, 744, 416, FACE.S, () => K.blind(S, 1.4, 2.25, 'slatBlind', { drop: 0.6, box: 'oakH' }));
  A(S, 770, 560, 0, () => K.rug(S, 1.6, 1.8, 'rugSage'));
  S.cyl([mx(780), 2.645, mz(560)], 0.1, 0.03, 'white', { seg: 24 }); // ceiling Wi-Fi access point
  S.light('point', [mx(780), 2.3, mz(550)], { c: '#ffd9a8', i: 1.8, d: 4, night: true });

  // ---------------- 08 bedroom 3: Nurul's dressing and quiet room ----------------
  // Loose, modular pieces, so it can become a nursery later without ripping out carpentry.
  A(S, 918, 515, FACE.E, () => K.wardrobe(S, { w: 1.9, h: 2.45, d: 0.6, m: 'oak', front: 'oak', doors: 4, handle: 'brass' }));
  A(S, 1180, 590, FACE.W, () => {
    // full-length arched mirror
    S.bb('oak', -0.34, 0.05, 0, 0.34, 1.55, 0.03);
    S.cyl([0, 1.55, 0.015], 0.34, 0.03, 'oak', { rot: [Math.PI / 2, 0, 0], seg: 36 });
    S.bb('mirror', -0.31, 0.08, 0.03, 0.31, 1.55, 0.034);
    S.cyl([0, 1.55, 0.032], 0.31, 0.004, 'mirror', { rot: [Math.PI / 2, 0, 0], seg: 36 });
  });
  A(S, 1110, 688, FACE.N, () => {
    // shallow arched niche, lit, with a plant
    S.bb('sandLime', -0.35, 0.9, 0, 0.35, 1.75, 0.015);
    S.cyl([0, 1.75, 0.0075], 0.35, 0.015, 'sandLime', { rot: [Math.PI / 2, 0, 0], seg: 32 });
    S.bb('oakH', -0.33, 1.1, 0, 0.33, 1.13, 0.2);
    S.bb('led', -0.3, 1.94, 0.016, 0.3, 1.96, 0.03);
    S.cyl([0.12, 1.2, 0.1], 0.06, 0.14, 'ceramic', { rb: 0.04, seg: 16 });
    for (let i = 0; i < 6; i++) S.box([-0.12 + Math.cos(i) * 0.05, 1.28 + i * 0.05, 0.1], [0.08, 0.006, 0.05], 'leaf2', { rot: [0.3, i, 0.5] });
  });
  A(S, 1110, 413, FACE.S, () => {
    K.dresser(S, { w: 0.9, m: 'oak', front: 'oak', legs: true, leg: 'oak', stool: 'fabric3' });
    S.cyl([0.25, 0.79, 0.2], 0.05, 0.03, 'brass', { seg: 16 });
    S.cyl([0.25, 0.97, 0.2], 0.14, 0.012, 'mirror', { rot: [Math.PI / 2 - 0.1, 0, 0], seg: 28 });
  });
  A(S, 1010, 413, FACE.S, () => S.bb('ivoryCab', -0.36, 0, 0, 0.36, 0.62, 0.42, { col: true }));
  A(S, 1050, 560, 0, () => K.rug(S, 1.6, 1.6, 'rugBed', { round: true }));
  S.at(mx(1050), 0, mz(560), QIBLA, () => S.bb('sejadah', -0.36, 0.013, -0.6, 0.36, 0.025, 0.6));
  A(S, 1150, 470, 0, () => S.cyl([0, 0.2, 0], 0.24, 0.4, 'fabric3', { seg: 24 }));
  A(S, 1080, 416, FACE.S, () => K.curtains(S, 1.5, { m: 'sheer', h: 2.4 }));
  A(S, 1178, 470, FACE.W, () => K.aircon(S, { y: 2.08, w: 0.8 }));
  lantern(S, mx(1050), mz(560), 0.22, 0.45, 2.2);

  // ---------------- bathrooms: as built, warm stone and sage ----------------
  tileRoom(S, 'sageTile', 'stoneTile', 523, 812, 724, 965, { doors: [[600, 680]], wins: [[600, 668]], shower: 595 });
  A(S, 724, 862, FACE.W, () => K.vanity(S, { w: 0.8, body: 'oak', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass', led: 'led' }));
  A(S, 724, 925, FACE.W, () => K.toilet(S));
  K.showerScreen(S, mx(595), mz(860), mx(597), mz(965), { frame: 'frame' });
  K.rainShower(S, mx(555), mz(900), { m: 'brass' });
  A(S, 523, 860, FACE.E, () => K.towelRail(S, { m: 'brass' }));
  S.light('point', [mx(640), 2.3, mz(890)], { i: 1.6, d: 3, night: true });
  tileRoom(S, 'stoneTile', 'stoneTile', 734, 812, 895, 965, { doors: [[808, 895]], wins: [[745, 795]] });
  S.bb('sageTile', mx(734), 0, mz(895), mx(800), 2.4, mz(965) - 0.009);
  A(S, 734, 860, FACE.E, () => K.vanity(S, { w: 0.65, body: 'oak', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass' }));
  A(S, 852, 965, FACE.N, () => K.toilet(S));
  K.showerScreen(S, mx(734), mz(893), mx(800), mz(895), { frame: 'frame' });
  K.rainShower(S, mx(765), mz(935), { m: 'brass' });
  S.light('point', [mx(815), 2.3, mz(890)], { i: 1.6, d: 3, night: true });

  A(S, 1500, 965, FACE.W, () => K.shelving(S, { w: 1.9, h: 2.2, d: 0.4, m: 'oak', rows: 4, fill: false }));

  labels(S, [['Main bedroom', 500, 600], ['Tech room', 780, 560], ["Nurul's room", 1050, 560], ['Living', 1340, 640], ['Dining', 1110, 873],
    ['Titanic', 1100, 725], ['Kitchen', 1095, 1080], ['Yard', 945, 1080], ['Bath', 620, 890], ['Bath', 815, 890], ['Shelter', 1445, 960], ['Foyer', 1285, 1010]]);

  S.view('01 Foyer', [mx(1248), 1.6, mz(1046)], [mx(1360), 1.15, mz(950)], 'Oak wall, bench, the shelter folded in');
  S.view('02 Living room', [mx(1255), 1.6, mz(870)], [mx(1360), 1.25, mz(545)], 'Low sofa, oval table, the sea');
  S.view('03 The Titanic', [mx(1120), 1.6, mz(812)], [mx(1095), 1.15, mz(720)], 'Sealed case, drawers below');
  S.view('04 Dining', [mx(1235), 1.6, mz(905)], [mx(1090), 0.85, mz(860)], 'Four seats, two lanterns');
  S.view('05 Kitchen', [mx(1030), 1.6, mz(940)], [mx(1115), 1.0, mz(1130)], 'Glass sliders, appliance tower');
  S.view('06 Main bedroom', [mx(622), 1.6, mz(688)], [mx(400), 1.15, mz(540)], 'Oak slats, glow behind the headboard');
  S.view('07 Tech sanctuary', [mx(700), 1.6, mz(650)], [mx(906), 1.25, mz(515)], 'Twin screens on arms, daybed for guests');
  S.view("08 Nurul's room", [mx(965), 1.6, mz(672)], [mx(1130), 1.05, mz(520)], 'Wardrobes, arched mirror, room to pray');
  return S.toJSON();
}
