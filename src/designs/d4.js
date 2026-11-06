// Design 4 — Shoreline. Aleem's brief:
//  - master and bedroom 2 become one room: sleep, work from home for two,
//    a little mancave, and space to pray together (imam in front, makmum behind)
//  - bathrooms exactly as built; bedroom 3 stays a bedroom for a future child
//  - fridge and appliances in the kitchen, a robot-vacuum dock, induction hob,
//    an island to eat at instead of a dining table
//  - a proper TV wall with surround sound and a cat playground above it
//  - the Titanic by the front door; cove lighting; a calm, sandy beach house
import { Spec, mx, mz } from '../core.js';
import { baseWalls, baseFloors, buildShell, editWalls, W } from '../plan.js';
import * as K from '../kit.js';
import { titanicMats, vitrine } from '../titanic.js';
import { mats, art, labels } from './common.js';
import { tileRoom } from './d1.js';

const { FACE } = K;
const A = (S, px, py, ry, fn, y = 0) => S.atPx(px, py, ry, fn, y);
const QIBLA = FACE.E - 0.4; // ~293 degrees, assuming the plan's top is north

export function walls() {
  return editWalls(baseWalls(), {
    remove: ['p12', 'b2S', 'dB2r'],
    add: [W('b2Sx', 640, 688, 906, 700)], // bedroom 2's corridor door is sealed
  });
}

export function floors() {
  return baseFloors().concat([{ id: 'p12gap', r: [640, 413, 648, 688], room: 'master' }]);
}

// Cove lighting: a 0.3 m bulkhead round the room, 0.18 m deep, with a warm
// glow washing the recessed ceiling just inside it.
function cove(S, [x1, y1, x2, y2], o = {}) {
  const w = o.w ?? 0.3, top = 2.65, by = top - 0.18;
  const X1 = mx(x1), X2 = mx(x2), Z1 = mz(y1), Z2 = mz(y2);
  S.onLayer(1, () => {
    S.bb('ceil', X1, by, Z1, X2, top, Z1 + w);
    S.bb('ceil', X1, by, Z2 - w, X2, top, Z2);
    S.bb('ceil', X1, by, Z1 + w, X1 + w, top, Z2 - w);
    S.bb('ceil', X2 - w, by, Z1 + w, X2, top, Z2 - w);
    const g = 0.1, y = top - 0.004;
    S.bb('coveGlow', X1 + w, y, Z1 + w, X2 - w, top - 0.002, Z1 + w + g);
    S.bb('coveGlow', X1 + w, y, Z2 - w - g, X2 - w, top - 0.002, Z2 - w);
    S.bb('coveGlow', X1 + w, y, Z1 + w + g, X1 + w + g, top - 0.002, Z2 - w - g);
    S.bb('coveGlow', X2 - w - g, y, Z1 + w + g, X2 - w, top - 0.002, Z2 - w - g);
  });
}

// Wall-hung cat house: a box with a round doorway.
function catHouse(S, x, y, z, m = 'wood') {
  S.bb(m, x - 0.19, y, z, x + 0.19, y + 0.34, z + 0.36);
  S.cyl([x, y + 0.16, z + 0.362], 0.1, 0.004, 'black', { rot: [Math.PI / 2, 0, 0], seg: 24 });
  S.bb('fabric3', x - 0.16, y + 0.02, z + 0.02, x + 0.16, y + 0.05, z + 0.34);
}

export function build() {
  const S = new Spec({ design: 'd4' });
  mats(S, {
    wall: { c: '#efe8dc', r: 0.95, tex: { k: 'limewash' }, ts: 3 },
    ceil: { c: '#f6f2eb', r: 0.95 },
    shelter: { c: '#efe8dc', r: 0.95, tex: { k: 'limewash', seed: 5 }, ts: 2.4 },
    frame: { c: '#ece8e0', r: 0.4, m: 0.2 },
    door: { c: '#e7dfd1', r: 0.6 },
    doorFrame: { c: '#e7dfd1', r: 0.6 },
    handle: { c: '#c9a25a', r: 0.35, m: 1 },
    brass: { c: '#c9a25a', r: 0.35, m: 1 },
    mainDoor: { c: '#cdb796', r: 0.55, tex: { k: 'grain', vertical: true }, ts: 1.2 },
    wood: { c: '#d3bc98', r: 0.6, tex: 'grain', ts: 1.0 },
    wood2: { c: '#b4a389', r: 0.6, tex: 'grain', ts: 1.0 },
    fabric: { c: '#e4d8c4', r: 0.97, tex: 'fabric', ts: 0.35 },
    fabric2: { c: '#9db8b0', r: 0.95, tex: 'fabric', ts: 0.3 },
    fabric3: { c: '#d9c7a7', r: 0.97, tex: 'boucle', ts: 0.3 },
    pillow: { c: '#9db8b0', r: 0.95, tex: 'fabric', ts: 0.3 },
    pillow2: { c: '#efe6d6', r: 0.95, tex: 'boucle', ts: 0.3 },
    linen: { c: '#f5f0e7', r: 0.95, tex: 'fabric', ts: 0.4 },
    duvet: { c: '#ede4d4', r: 0.95, tex: 'fabric', ts: 0.4 },
    cab: { c: '#ece4d6', r: 0.5 },
    stone: { c: '#e2d5bf', r: 0.4, tex: { k: 'travertine', c: '#e2d5bf', n: 1 }, ts: 1.4 },
    shade: { c: '#efe4cf', r: 0.9, e: '#ffd9a0', ei: 0, ein: 0.9 },
    leaf: { c: '#7d8f6a', r: 0.6, ds: true },
    leaf2: { c: '#9aa883', r: 0.6, ds: true },
    pot: { c: '#c9b79a', r: 0.85 },
    book1: { c: '#9db8b0', r: 0.8 },
    book2: { c: '#d9b472', r: 0.7 },
    book3: { c: '#efe6d6', r: 0.8 },
    book4: { c: '#c58b6b', r: 0.8 },
    book5: { c: '#033a4e', r: 0.8 },
  });
  titanicMats(S);
  S.mat('oakFloor', { c: '#d9c6a6', r: 0.6, tex: { k: 'wood', planks: 3 }, ts: 1.5 });
  S.mat('travFloor', { c: '#e2d6c1', r: 0.45, tex: { k: 'travertine', c: '#e2d6c1', n: 2 }, ts: 1.2 });
  S.mat('bathFloor', { c: '#ddd0ba', r: 0.45, tex: { k: 'travertine', c: '#ddd0ba', n: 4 }, ts: 1.0 });
  S.mat('seaTile', { c: '#a9c3bc', r: 0.25, tex: { k: 'tile', n: 8, m: 8, c: '#a9c3bc', cols: ['#a9c3bc', '#9db8b0', '#b4ccc5'], grout: '#efe8dc', zellige: true, vary: 0.1 }, ts: 0.6, bump: 0.02 });
  S.mat('sandTile', { c: '#ece4d6', r: 0.3, tex: { k: 'tile', n: 4, m: 8, c: '#ece4d6', grout: '#d9cdb8' }, ts: 0.6 });
  S.mat('limeDeep', { c: '#dccbae', r: 0.95, tex: { k: 'limewash', seed: 12 }, ts: 2.0 });
  S.mat('oak', { c: '#cdb48d', r: 0.55, tex: { k: 'grain', vertical: true }, ts: 0.8 });
  S.mat('jute', { c: '#c9b18b', r: 1, tex: 'boucle', ts: 0.4 });
  S.mat('clay', { c: '#c58b6b', r: 0.8 });
  S.mat('seaglass', { c: '#9db8b0', r: 0.45 });
  S.mat('teal', { c: '#033a4e', r: 0.5 });
  S.mat('speaker', { c: '#2b2926', r: 0.7, tex: 'fabric', ts: 0.2 });
  S.mat('robot', { c: '#f2f1ee', r: 0.3 });
  S.mat('coveGlow', { c: '#fff4de', e: '#ffdcaa', ei: 0.45, ein: 2.4 });
  S.mat('sheer', { c: '#f6f1e8', r: 1, o: 0.72, glass: true, ds: true });
  S.mat('sanitiser', { c: '#e7f2ef', r: 0.1, o: 0.7, glass: true });
  S.mat('lego1', { c: '#c4281b', r: 0.35 });
  S.mat('lego2', { c: '#f5cd2f', r: 0.35 });
  S.mat('lego3', { c: '#0d69ab', r: 0.35 });
  S.mat('paddle1', { c: '#033a4e', r: 0.4 });
  S.mat('paddle2', { c: '#f4b6c2', r: 0.4 });

  buildShell(S, walls(), floors(), {
    wall: 'wall', glass: 'glass', frame: 'frame', sill: 'stone', ceil: 'ceil', door: 'door', doorFrame: 'doorFrame',
    handle: 'handle', mainDoor: 'mainDoor', steel: 'steel', shelter: 'shelter', exterior: 'exterior',
    floors: { default: 'oakFloor', foyer: 'travFloor', kitchen: 'travFloor', yard: 'travFloor', bath1: 'bathFloor', bath2: 'bathFloor', shelter: 'travFloor' },
  });
  for (const r of [[1190, 530, 1505, 835], [745, 700, 1190, 800], [945, 800, 1190, 950], [378, 413, 906, 688], [918, 413, 1180, 688], [1206, 950, 1360, 1065]]) cove(S, r);

  // ---------------- foyer: the Titanic is the first thing at the door ----------------
  // No window here, so the LEGO is out of direct sun and won't fade.
  A(S, 1206, 990, FACE.E, () => {
    S.bb('limeDeep', -0.8, 0, 0, 0.8, 2.47, 0.008);
    // floating fluted oak plinth, lit underneath, with key drawers
    S.bb('oak', -0.73, 0.3, 0, 0.73, 0.9, 0.4, { col: true });
    K.flutes(S, 'oak', -0.73, 0.31, 0.4, 0.73, 0.89, 0.035, 0.012);
    S.bb('led', -0.68, 0.294, 0.3, 0.68, 0.3, 0.33);
    vitrine(S, { L: 1.44, W: 0.37, H: 0.56, y0: 0.9, inset: 0.025, frame: 'brass', glass: 'glassClear', deck: 'oak', li: 5 });
    S.at(0, 1.98, 0.01, 0, () => K.frame(S, 0.9, 0.45, art(S, { k: 'blueprint' }), { frame: 'oak', mat: 0.03 }));
    S.bb('brass', -0.3, 2.3, 0.01, 0.3, 2.33, 0.1);
    S.box([0, 2.31, 0.12], [0.6, 0.025, 0.04], 'lamp');
  });
  S.light('spot', [mx(1290), 2.45, mz(990)], { t: [mx(1215), 1.15, mz(990)], a: 0.45, pen: 0.7, i: 7, d: 5, c: '#fff0d8' });
  A(S, 1360, 1022, FACE.W, () => {
    K.shoeCabinet(S, { w: 0.85, h: 0.95, d: 0.32, m: 'oak', float: true, cane: 'rattan', top: 'stone', led: true });
    S.cyl([0.25, 1.04, 0.16], 0.03, 0.14, 'sanitiser', { seg: 12 }); // hand sanitiser, within reach
    S.cyl([0.25, 1.125, 0.16], 0.012, 0.03, 'white', { seg: 8 });
    S.cyl([-0.15, 0.975, 0.16], 0.1, 0.012, 'clay', { seg: 20 });
    S.at(0, 1.62, 0, 0, () => {
      S.cyl([0, 0, 0.012], 0.27, 0.024, 'rattan', { rot: [Math.PI / 2, 0, 0], seg: 40 });
      S.cyl([0, 0, 0.026], 0.24, 0.004, 'mirror', { rot: [Math.PI / 2, 0, 0], seg: 40 });
    });
  });
  S.light('point', [mx(1290), 2.3, mz(1020)], { i: 2, d: 4, night: true });

  // ---------------- island (eat here) and the open fridge niche ----------------
  A(S, 1070, 852, 0, () => {
    S.bb('cab', -0.67, 0, -0.1, 0.67, 0.88, 0.38, { col: true });
    K.flutes(S, 'oak', -0.67, 0.08, -0.1, 0.67, 0.86, 0.035, 0.012);
    S.bb('black', -0.64, 0, -0.08, 0.64, 0.08, 0.36);
    S.bb('stone', -0.72, 0.88, -0.38, 0.72, 0.92, 0.4);
    S.cyl([0.3, 0.98, 0.05], 0.14, 0.1, 'clay', { rb: 0.08, seg: 24 });
    for (let i = 0; i < 4; i++) S.sph([0.3 + Math.cos(i * 1.6) * 0.06, 1.04, 0.05 + Math.sin(i * 1.6) * 0.06], 0.04, i % 2 ? 'leaf' : 'leaf2');
  });
  for (const px of [1032, 1070, 1108]) A(S, px, 800, 0, () => K.stool(S, { h: 0.66, m: 'oak', seat: 'rattan' }));
  for (const px of [1040, 1100]) S.at(mx(px), 0, mz(852), 0, () => K.pendant(S, { shape: 'dome', r: 0.2, drop: 0.85, shade: 'rattan', m: 'rattan', i: 3 }));
  A(S, 978, 905, 0, () => K.plant(S, { kind: 'fig', h: 1.9, pot: 'clay', seed: 21 }));
  A(S, 945, 860, FACE.E, () => S.at(0, 1.5, 0, 0, () => K.frame(S, 0.48, 0.66, art(S, { k: 'abstract', seed: 4, cols: ['#d9c7a7', '#9db8b0', '#c58b6b', '#efe6d6', '#b4a389'], bg: '#f3eee6' }), { frame: 'oak', mat: 0.03 })));

  // ---------------- kitchen: fridge, oven, robot dock, induction ----------------
  A(S, 1180, 952, FACE.W, () => {
    S.at(0.375, 0, 0, 0, () => K.fridge(S, { w: 0.75, h: 2.05, m: 'cab', handle: 'brass' }));
    S.bb('cab', 0, 2.05, 0, 0.75, 2.45, 0.7);
    // tall unit: oven and microwave, with the robot vacuum's garage underneath
    S.bb('cab', 0.75, 0.16, 0, 1.35, 2.45, 0.6, { col: true });
    S.bb('black', 0.77, 0, 0.0, 1.33, 0.16, 0.04);
    S.bb('steelDark', 0.77, 0, 0.04, 1.33, 0.005, 0.58);
    S.cyl([1.05, 0.05, 0.3], 0.17, 0.09, 'robot', { seg: 32 });
    S.cyl([1.05, 0.096, 0.3], 0.07, 0.006, 'black', { seg: 24 });
    S.bb('black', 0.95, 0.005, 0.03, 1.15, 0.14, 0.12);
    S.bb('glassDark', 0.78, 0.85, 0.6, 1.32, 1.45, 0.615);
    S.bb('brass', 0.82, 1.38, 0.615, 1.28, 1.392, 0.635);
    S.bb('glassDark', 0.78, 1.5, 0.6, 1.32, 1.86, 0.615);
    S.at(1.35, 0, 0, 0, () => {
      K.baseRun(S, 0.93, { body: 'cab', front: 'cab', top: 'stone', handle: 'brass', splash: 'sandTile' });
      K.hob(S, 0.47, { hood: false });
      K.wallRun(S, 0.93, { body: 'cab', front: 'oak', y0: 1.6, y1: 2.45, led: 'led' });
      S.bb('steelDark', 0.17, 1.58, 0.05, 0.77, 1.6, 0.33);
    });
  });
  A(S, 1126, 1180, FACE.N, () => {
    K.baseRun(S, 1.28, { body: 'cab', front: 'oak', top: 'stone', handle: 'brass', splash: 'sandTile' });
    K.sink(S, 0.75, { tap: 'brass' });
    for (const y of [1.65, 2.05]) S.bb('oak', 0, y, 0, 1.28, y + 0.035, 0.26);
    const R = K.rng(9);
    for (let i = 0; i < 7; i++) S.cyl([0.1 + i * 0.17, 1.75, 0.13], 0.045 + R() * 0.02, 0.14, ['ceramic', 'clay', 'seaglass', 'paper'][i % 4], { seg: 14 });
    for (let i = 0; i < 5; i++) S.cyl([0.15 + i * 0.24, 2.15, 0.13], 0.05, 0.16, i % 2 ? 'glassClear' : 'ceramic', { seg: 14 });
  });
  K.downlights(S, [[mx(1095), mz(1010)], [mx(1095), mz(1110)]], { ring: 'brass' });
  S.light('point', [mx(1095), 2.3, mz(1060)], { i: 2.8, d: 4.5, night: true });

  // ---------------- service yard ----------------
  A(S, 1003, 1018, FACE.W, () => K.washerStack(S));
  A(S, 940, 1180, FACE.N, () => { K.litterBox(S); S.bb('oak', -0.55, 1.5, 0, 0.55, 1.53, 0.3); });

  // ---------------- living: the screen, the sound, the cats ----------------
  A(S, 1505, 682, FACE.W, () => {
    S.bb('limeDeep', -1.62, 0, 0, 1.62, 2.47, 0.01);
    // floating console with cane doors; the subwoofer hides in the end bay
    S.bb('oak', -1.35, 0.22, 0.01, 1.35, 0.64, 0.46, { col: true });
    for (let i = 0; i < 5; i++) {
      const x0 = -1.35 + i * 0.54 + 0.005, x1 = x0 + 0.53;
      S.bb('oak', x0, 0.23, 0.46, x1, 0.63, 0.47);
      S.bb('rattan', x0 + 0.04, 0.27, 0.47, x1 - 0.04, 0.59, 0.473);
    }
    S.bb('led', -1.3, 0.214, 0.38, 1.3, 0.22, 0.4);
    K.tv(S, { w: 1.89, y: 1.26 });
    S.bb('speaker', -0.55, 0.645, 0.15, 0.55, 0.715, 0.27, { bev: 0.02 }); // soundbar
    for (const sx of [-1, 1]) S.bb('speaker', sx * 1.18 - 0.1, 0.64, 0.12, sx * 1.18 + 0.1, 1.0, 0.35, { bev: 0.015 }); // front left/right
    // cat playground over the TV: steps up from the console, a walkway,
    // two houses, a plank bridge and a hammock
    for (const [x, y] of [[-1.45, 1.0], [-1.25, 1.38], [-1.45, 1.76], [1.45, 1.0], [1.25, 1.38], [1.45, 1.76]]) S.at(x, 0, 0, 0, () => K.catShelf(S, 0.34, y, 'oak', 'fabric3'));
    S.bb('oak', -1.25, 2.05, 0, -0.3, 2.085, 0.3);
    S.bb('oak', 0.45, 2.05, 0, 1.25, 2.085, 0.3);
    for (let i = 0; i < 6; i++) S.bb('wood2', -0.28 + i * 0.123, 2.06, 0.02, -0.18 + i * 0.123, 2.08, 0.28);
    S.rod([-0.3, 2.25, 0.29], [0.45, 2.25, 0.29], 0.006, 'rattan');
    catHouse(S, -0.95, 2.085, 0, 'oak');
    catHouse(S, 0.95, 2.085, 0, 'oak');
    S.bb('fabric3', 0.3, 1.86, 0.02, 0.62, 1.88, 0.3);
    for (const x of [0.3, 0.62]) S.rod([x, 1.88, 0.15], [x, 2.05, 0.15], 0.004, 'brass');
    K.cat(S, -1.45, 1.795, 0.15, 'cat1', 1.4);
    K.cat(S, 0.05, 2.08, 0.15, 'cat2', 0);
    K.cat(S, 0.95, 2.17, 0.18, 'cat3', -1.5);
  });
  // rear surrounds and height channels in the ceiling
  for (const [px, py] of [[1240, 575], [1240, 785], [1350, 600], [1350, 760]]) S.cyl([mx(px), 2.644, mz(py)], 0.1, 0.01, 'vent', { seg: 24 });
  A(S, 1196, 665, FACE.E, () => K.lsofa(S, { w: 2.8, d: 0.98, chaise: 1.6, m: 'fabric', cush: 'fabric', leg: 'oak', pillows: ['pillow', 'pillow2', 'fabric3', 'pillow'] }));
  A(S, 1350, 700, 0, () => {
    K.rug(S, 2.4, 3.0, 'jute');
    K.coffeeTable(S, { round: true, r: 0.42, top: 'stone', leg: 'stone' });
  });
  S.at(mx(1350), 0.4, mz(700), 0, () => { S.bb('paper', -0.15, 0, -0.1, 0.12, 0.05, 0.1); S.cyl([0.2, 0.06, 0.08], 0.06, 0.12, 'clay', { seg: 16 }); });
  A(S, 1252, 812, 0, () => { K.sideTable(S, { m: 'oak', r: 0.2 }); });
  A(S, 1212, 812, 0, () => K.floorLamp(S, { m: 'brass', shade: 'shade', i: 2.5 }));
  A(S, 1484, 545, 0, () => K.plant(S, { kind: 'palm', h: 1.7, pot: 'clay', seed: 14 }));
  A(S, 1330, 533, FACE.S, () => K.curtains(S, 2.05, { m: 'sheer', h: 2.4 }));
  A(S, 1458, 530, FACE.S, () => K.aircon(S, { y: 2.08 }));
  A(S, 1190, 609, FACE.E, () => S.at(0, 1.55, 0, 0, () => K.frame(S, 1.4, 0.7, art(S, { k: 'shore' }), { frame: 'oak', mat: 0.04 })));
  S.at(mx(1350), 0, mz(690), 0, () => K.ceilingFan(S, { m: 'white', blade: 'oak', r: 0.6 }));
  S.light('point', [mx(1350), 2.3, mz(690)], { c: '#ffd9a8', i: 3, d: 6, night: true });

  // ---------------- corridor: a short gallery on the sealed door ----------------
  A(S, 860, 700, FACE.S, () => {
    S.at(-0.45, 1.5, 0, 0, () => K.frame(S, 0.4, 0.5, art(S, { k: 'monogram', bg: '#9db8b0', sub: '21 · 08 · 2027' }), { frame: 'oak', mat: 0.03 }));
    S.at(0.05, 1.5, 0, 0, () => K.frame(S, 0.5, 0.36, art(S, { k: 'sunset' }), { frame: 'oak', mat: 0.03 }));
    S.at(0.55, 1.5, 0, 0, () => K.frame(S, 0.44, 0.2, art(S, { k: 'boarding' }), { frame: 'oak', mat: 0.02 }));
  });
  S.light('point', [mx(880), 2.3, mz(750)], { i: 1.4, d: 4, night: true });

  // ---------------- master: sleep ----------------
  A(S, 378, 540, FACE.E, () => {
    K.bed(S, { w: 1.83, l: 2.05, frame: 'fabric', head: 'fabric3', headStyle: 'channel', hbW: 2.0, hbH: 1.2, duvet: 'linen', throw: 'fabric2', pillow: 'linen', pillow2: 'pillow2', cushion: 'pillow', leg: 'oak' });
    S.at(0, 1.8, 0, 0, () => K.frame(S, 1.2, 0.6, art(S, { k: 'sky' }), { frame: 'oak', mat: 0.02, mount: false }));
  });
  for (const py of [435, 645]) A(S, 378, py, FACE.E, () => K.bedside(S, { m: 'oak', float: true, lampBase: 'clay', shade: 'shade' }));
  A(S, 475, 540, 0, () => K.rug(S, 2.3, 2.6, 'jute'));
  A(S, 488, 800, FACE.N, () => K.wardrobe(S, { w: 2.36, h: 2.4, d: 0.58, m: 'cab', front: 'cab', doors: 4, handle: 'brass' }));
  A(S, 485, 416, FACE.S, () => K.curtains(S, 1.9, { m: 'sheer', h: 2.4 }));
  S.at(mx(640), 0, mz(550), 0, () => K.ceilingFan(S, { m: 'white', blade: 'oak', r: 0.6 }));
  S.light('point', [mx(640), 2.3, mz(560)], { c: '#ffd9a8', i: 2.5, d: 5, night: true });
  K.cat(S, mx(470), 0.62, mz(600), 'cat3', 2.2);

  // ---------------- master: pray together ----------------
  // Two sejadah on the qibla line: Aleem leads in front, Nurul a step behind.
  for (const [px, py] of [[630, 500], [729, 542]]) S.at(mx(px), 0, mz(py), QIBLA, () => {
    S.bb('sejadah', -0.36, 0.013, -0.6, 0.36, 0.025, 0.6);
    S.bb('brass', -0.34, 0.025, -0.58, 0.34, 0.027, -0.54);
  });
  A(S, 622, 413, FACE.S, () => {
    S.bb('oak', -0.5, 0.35, 0, 0.5, 0.75, 0.3);
    K.flutes(S, 'oak', -0.5, 0.36, 0.3, 0.5, 0.74, 0.03, 0.01);
    S.bb('sejadah', -0.4, 0.75, 0.05, -0.05, 0.8, 0.25);
    S.bb('linen', 0.05, 0.75, 0.05, 0.4, 0.82, 0.25); // telekung, folded
    S.at(0, 1.45, 0, 0, () => K.frame(S, 0.45, 0.6, art(S, { k: 'songket', bg: '#9db8b0', fg: '#f6f1e8' }), { frame: 'oak', mat: 0.03 }));
  });

  // ---------------- master: work from home, and the mancave corner ----------------
  A(S, 906, 553, FACE.W, () => {
    K.desk(S, { w: 2.6, d: 0.65, m: 'oak', leg: 'oak', mat: 'fabric3' });
    K.monitor(S, -0.65, 0.08, { w: 0.86, curved: true }); // Aleem
    K.keyboard(S, -0.7, 0.38);
    K.pcTower(S, -1.15, 0.1, { glow: 'rgb' });
    K.monitor(S, 0.65, 0.08, { w: 0.6 }); // Nurul
    S.bb('steelDark', 0.45, 0.745, 0.32, 0.8, 0.755, 0.55);
    S.box([0.625, 0.86, 0.32], [0.35, 0.23, 0.01], 'screen', { rot: [-0.3, 0, 0] });
    S.cyl([1.1, 0.8, 0.15], 0.05, 0.11, 'clay', { seg: 14 });
    for (let i = 0; i < 5; i++) S.sph([1.1 + Math.cos(i) * 0.04, 0.88 + i * 0.012, 0.15 + Math.sin(i) * 0.04], 0.04, 'leaf2');
    K.tableLamp(S, 0.0, 0.745, 0.12, { lampBase: 'clay', shade: 'shade' });
    // display shelves above: a few LEGO builds, the paddles, Player 2
    for (const y of [1.45, 1.85]) S.bb('oak', -1.25, y, 0, 1.25, y + 0.03, 0.26);
    const R = K.rng(31);
    for (let i = 0; i < 6; i++) K.ornament(S, -1.0 + i * 0.4, 1.48, 0.13, R, ['lego1', 'lego2', 'lego3', 'seaglass', 'clay']);
    S.at(0.95, 2.05, 0.01, 0, () => K.frame(S, 0.3, 0.38, art(S, { k: 'player2' }), { frame: 'oak', mat: 0.02 }));
    for (const [i, m] of [[-1, 'paddle1'], [1, 'paddle2']]) S.at(-0.9 + i * 0.15, 2.1, 0.02, 0, () => {
      S.box([0, 0.06, 0], [0.18, 0.24, 0.015], m, { bev: 0.006 });
      S.box([0, -0.12, 0], [0.04, 0.12, 0.02], 'black', { bev: 0.006 });
    });
  });
  A(S, 840, 495, FACE.E, () => K.officeChair(S, { fab: 'fabric3' }));
  A(S, 840, 611, FACE.E, () => K.officeChair(S, { fab: 'fabric2' }));
  A(S, 740, 688, FACE.N, () => {
    K.console_(S, { w: 1.7, d: 0.42, h: 0.72, m: 'oak', front: 'cab', doors: 4, top: 'oak', handle: 'brass' });
    for (const y of [1.35, 1.75]) S.bb('oak', -0.85, y, 0, 0.85, y + 0.03, 0.24);
    const R = K.rng(52);
    K.books(S, -0.8, 0.0, 1.38, 0.2, R, ['book1', 'book2', 'book3', 'book4', 'book5']);
    for (let i = 0; i < 3; i++) K.ornament(S, 0.15 + i * 0.25, 1.38, 0.12, R, ['lego1', 'lego2', 'lego3', 'clay']);
  });
  A(S, 744, 416, FACE.S, () => K.blind(S, 1.4, 2.25, 'sheer', { drop: 0.45 }));
  A(S, 622, 413, FACE.S, () => K.aircon(S, { y: 2.08 }));

  // ---------------- bedroom 3: ready for a child later ----------------
  A(S, 1180, 642, FACE.W, () => K.bed(S, { w: 0.92, l: 1.9, frame: 'oak', head: 'oak', hbH: 0.9, hbW: 0.96, plinth: 'oak', duvet: 'fabric2', pillow: 'linen', throw: 'pillow2' }));
  A(S, 918, 505, FACE.E, () => K.wardrobe(S, { w: 1.6, h: 2.4, d: 0.58, m: 'cab', front: 'cab', doors: 3, handle: 'brass' }));
  A(S, 1080, 413, FACE.S, () => {
    K.desk(S, { w: 1.2, d: 0.55, m: 'oak', leg: 'oak' });
    K.tableLamp(S, 0.4, 0.745, 0.15, { lampBase: 'clay', shade: 'shade' });
  });
  A(S, 1080, 480, FACE.N, () => K.chair(S, { m: 'oak', seat: 'fabric2' }));
  A(S, 1060, 560, 0, () => { K.rug(S, 1.5, 1.5, 'fabric3', { round: true }); S.cyl([0.35, 0.15, -0.2], 0.22, 0.3, 'rattan', { seg: 20 }); S.cyl([-0.4, 0.13, 0.15], 0.25, 0.26, 'fabric2', { seg: 24 }); });
  A(S, 1080, 416, FACE.S, () => K.blind(S, 1.5, 2.25, 'sheer', { drop: 0.45 }));
  A(S, 1178, 470, FACE.W, () => K.aircon(S, { y: 2.08, w: 0.8 }));
  A(S, 1180, 642, FACE.W, () => S.at(0, 1.45, 0, 0, () => K.frame(S, 0.7, 0.35, art(S, { k: 'shore' }), { frame: 'oak', mat: 0.03 })));
  S.at(mx(1050), 0, mz(550), 0, () => K.pendant(S, { shape: 'globe', r: 0.2, drop: 0.55, shade: 'lamp', m: 'oak', i: 2.2 }));

  // ---------------- bathrooms: layout untouched, sandy finishes ----------------
  tileRoom(S, 'seaTile', 'sandTile', 523, 812, 724, 965, { doors: [[600, 680]], wins: [[600, 668]], shower: 595 });
  A(S, 724, 862, FACE.W, () => K.vanity(S, { w: 0.8, body: 'oak', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass' }));
  A(S, 724, 925, FACE.W, () => K.toilet(S));
  K.showerScreen(S, mx(595), mz(860), mx(597), mz(965), { frame: 'brass' });
  K.rainShower(S, mx(555), mz(900), { m: 'brass' });
  A(S, 523, 860, FACE.E, () => K.towelRail(S, { m: 'brass' }));
  S.light('point', [mx(640), 2.3, mz(890)], { i: 1.6, d: 3, night: true });
  tileRoom(S, 'sandTile', 'sandTile', 734, 812, 895, 965, { doors: [[808, 895]], wins: [[745, 795]] });
  S.bb('seaTile', mx(734), 0, mz(895), mx(800), 2.4, mz(965) - 0.009);
  A(S, 734, 860, FACE.E, () => K.vanity(S, { w: 0.65, body: 'oak', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass' }));
  A(S, 852, 965, FACE.N, () => K.toilet(S));
  K.showerScreen(S, mx(734), mz(893), mx(800), mz(895), { frame: 'brass' });
  K.rainShower(S, mx(765), mz(935), { m: 'brass' });
  S.light('point', [mx(815), 2.3, mz(890)], { i: 1.6, d: 3, night: true });

  A(S, 1500, 965, FACE.W, () => K.shelving(S, { w: 1.9, h: 2.2, d: 0.4, m: 'oak', rows: 4, fill: false }));

  labels(S, [['Master: sleep, work, pray', 640, 600], ['Future kids', 1050, 560], ['Living', 1350, 640], ['Island', 1070, 852],
    ['Titanic', 1225, 990], ['Kitchen', 1095, 1080], ['Yard', 945, 1080], ['Bath', 620, 890], ['Bath', 815, 890], ['Shelter', 1445, 960], ['Cat wall', 1480, 682]]);

  S.view('Front door', [mx(1325), 1.6, mz(1062)], [mx(1222), 1.2, mz(975)], 'The Titanic greets you');
  S.view('The Titanic', [mx(1305), 1.6, mz(990)], [mx(1212), 1.15, mz(990)], 'Lit case, out of the sun');
  S.view('Living room', [mx(1250), 1.6, mz(880)], [mx(1505), 1.35, mz(700)], 'TV wall, surround, cove light');
  S.view('Cat playground', [mx(1330), 1.6, mz(760)], [mx(1505), 2.05, mz(670)], 'Steps, houses and a bridge over the TV');
  S.view('Island and kitchen', [mx(1185), 1.6, mz(760)], [mx(1065), 0.95, mz(990)], 'Eat at the island; fridge and robot dock inside');
  S.view('Bed and prayer space', [mx(800), 1.6, mz(640)], [mx(470), 0.8, mz(500)], 'Two sejadah on the qibla line');
  S.view('Work from home', [mx(690), 1.6, mz(620)], [mx(906), 1.1, mz(553)], 'A desk for two, LEGO above');
  S.view('Future kids’ room', [mx(965), 1.6, mz(672)], [mx(1130), 1.0, mz(500)], 'Bedroom 3, kept simple');
  return S.toJSON();
}
