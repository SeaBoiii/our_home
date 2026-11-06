// Design 2 — White Star. Ocean-liner deco, with walls moved:
//  - bedroom 2 joins the master as a dressing lounge (its corridor door sealed)
//  - the master bath grows into the old wardrobe corner, with a freestanding tub
//  - bedroom 3 becomes The Bridge, behind a bookcase door in the library wall
//  - the Titanic sits in a glass opening between The Bridge and the living room
import { Spec, mx, mz } from '../core.js';
import { baseWalls, baseFloors, buildShell, editWalls, W, door, open } from '../plan.js';
import * as K from '../kit.js';
import { titanicMats, titanic } from '../titanic.js';
import { mats, art, labels } from './common.js';
import { tileRoom } from './d1.js';

const { FACE } = K;
const A = (S, px, py, ry, fn, y = 0) => S.atPx(px, py, ry, fn, y);

export function walls() {
  return editWalls(baseWalls(), {
    remove: ['p12', 'b2S', 'dB2r', 'mS', 'dB1', 'dB3r', 'b3E'],
    add: [
      W('b2Sx', 735, 688, 906, 700), // bedroom 2's door is sealed
      W('mS1', 378, 800, 523, 812),
      W('annexN', 378, 690, 600, 700),
      W('annexE', 600, 690, 610, 800),
      W('bJamb', 600, 800, 612, 812),
      door('dB1', 612, 800, 680, 812, { leaf: { hinge: 'L', into: 'S', open: 75 } }),
      open('secret', 918, 688, 1010, 700),
      W('b3E1', 1180, 530, 1190, 536),
      open('titanicWin', 1180, 536, 1190, 684, { sill: 0.92, head: 1.6 }),
      W('b3E2', 1180, 684, 1190, 688),
    ],
  });
}

export function floors() {
  const f = baseFloors().filter((x) => x.id !== 'masterLow');
  return f.concat([
    { id: 'annex', r: [378, 700, 600, 800], room: 'bath1' },
    { id: 'annexLink', r: [523, 800, 600, 812], room: 'bath1' },
    { id: 'vest', r: [610, 700, 735, 800], room: 'master' },
    { id: 'p12gap', r: [640, 413, 648, 700], room: 'master' },
    { id: 'b2gap', r: [648, 688, 735, 700], room: 'master' },
  ]);
}

export function build() {
  const S = new Spec({ design: 'd2' });
  mats(S, {
    wall: { c: '#efe8da', r: 0.93 },
    ceil: { c: '#f4efe4', r: 0.95 },
    door: { c: '#4a2f1f', r: 0.45, tex: { k: 'grain', vertical: true }, ts: 1.2 },
    doorFrame: { c: '#3d271a', r: 0.45 },
    handle: { c: '#c9a25a', r: 0.25, m: 1 },
    mainDoor: { c: '#3d271a', r: 0.45, tex: { k: 'grain', vertical: true }, ts: 1.2 },
    frame: { c: '#2a2b2d', r: 0.4, m: 0.6 },
    wood: { c: '#5c3b26', r: 0.4, tex: 'grain', ts: 1.0, cc: 0.3 },
    wood2: { c: '#3d271a', r: 0.45, tex: 'grain', ts: 1.0 },
    fabric: { c: '#0f3d4f', r: 0.75, tex: 'fabric', ts: 0.3 },
    fabric2: { c: '#d9b472', r: 0.7, tex: 'fabric', ts: 0.3 },
    fabric3: { c: '#2a2a2c', r: 0.9, tex: 'fabric', ts: 0.3 },
    pillow: { c: '#d9b472', r: 0.8, tex: 'fabric', ts: 0.3 },
    pillow2: { c: '#efe6d6', r: 0.9, tex: 'fabric', ts: 0.3 },
    linen: { c: '#f4efe6', r: 0.9, tex: 'fabric', ts: 0.4 },
    duvet: { c: '#f1ebdf', r: 0.95, tex: 'fabric', ts: 0.4 },
    cab: { c: '#efe9dc', r: 0.45 },
    stone: { c: '#f1eee8', r: 0.2, tex: { k: 'marble', vein: 'rgba(110,105,100,0.55)', veins: 14 }, ts: 1.3, cc: 0.4 },
    shade: { c: '#f6ead2', r: 0.85, e: '#ffd9a0', ei: 0.05, ein: 1.0 },
    leaf: { c: '#2f5e35', r: 0.5, ds: true },
  });
  titanicMats(S);
  S.mat('parquet', { c: '#8f5f3b', r: 0.45, tex: 'herring', ts: 1.1, cc: 0.25 });
  S.mat('checker', { c: '#f1eee8', r: 0.2, tex: { k: 'tile', n: 4, m: 4, c: '#f1eee8', checker: '#16181a', grout: '#9a9690', g: 2 }, ts: 0.9, cc: 0.4 });
  S.mat('hexFloor', { c: '#f3f1ec', r: 0.3, tex: { k: 'tile', n: 12, m: 12, c: '#f3f1ec', grout: '#cfcac0', g: 3, cols: ['#f3f1ec', '#f3f1ec', '#f3f1ec', '#1b1d1f'] }, ts: 0.6 });
  S.mat('subway', { c: '#f6f4ef', r: 0.15, tex: { k: 'tile', n: 4, m: 12, c: '#f6f4ef', grout: '#d6d1c7', g: 3 }, ts: 0.6, cc: 0.5 });
  S.mat('tealTile', { c: '#0d4a5c', r: 0.15, tex: { k: 'tile', n: 4, m: 12, c: '#0d4a5c', cols: ['#0d4a5c', '#0f5266', '#0b4354'], grout: '#d9cfb8', g: 3, vary: 0.06 }, ts: 0.6, cc: 0.5 });
  S.mat('walnut', { c: '#5a3a25', r: 0.4, tex: { k: 'grain', vertical: true }, ts: 0.9, cc: 0.35 });
  S.mat('walnutH', { c: '#5a3a25', r: 0.4, tex: { k: 'grain' }, ts: 0.9, cc: 0.35 });
  S.mat('navyVelvet', { c: '#0b3a4c', r: 0.7, tex: 'fabric', ts: 0.25 });
  S.mat('teal', { c: '#033a4e', r: 0.5 });
  S.mat('decoPanel', { c: '#ffffff', r: 0.6, tex: { k: 'deco', bg: '#0f2f3c', fg: '#c9a25a' }, ts: 0.9 });
  S.mat('leather', { c: '#6b3a22', r: 0.45, cc: 0.4 });
  S.mat('blush', { c: '#e9b7bf', r: 0.75, tex: 'fabric', ts: 0.3 });
  S.mat('rugLounge', { c: '#0f3a4a', r: 1, tex: { k: 'deco', bg: '#0f3a4a', fg: '#b8935a' }, ts: 1.0 });
  S.mat('rugBed', { c: '#e7dcc7', r: 1, tex: 'boucle', ts: 0.4 });
  S.mat('rugBridge', { c: '#5b2430', r: 1, tex: { k: 'stripes', n: 20, cols: ['#5b2430', '#5b2430', '#6a2b38', '#c9a25a'] }, ts: 1.0 });
  S.mat('screenBig', { c: '#0a0c10', r: 0.1, e: '#0d2233', ei: 0.35, ein: 0.9, tex: { k: 'blueprint' }, emap: true });
  S.mat('chart', { c: '#ffffff', r: 0.8, tex: { k: 'mountains', sky: '#c9b88f', seed: 21, caption: 'North Atlantic, 1912' } });
  S.mat('redBook', { c: '#8e1b1b', r: 0.6, e: '#3a0505', ei: 0.3, ein: 0.6 });
  S.mat('lego1', { c: '#c4281b', r: 0.35 });
  S.mat('lego2', { c: '#f5cd2f', r: 0.35 });
  S.mat('lego3', { c: '#0d69ab', r: 0.35 });
  S.mat('sheer', { c: '#f4efe6', r: 1, o: 0.7, glass: true, ds: true });
  S.mat('drape', { c: '#0d3b4c', r: 0.95, tex: 'fabric', ts: 0.3 });
  S.mat('sea', { c: '#06324a', r: 0.3, tex: { k: 'caustics', c: '#06324a' }, ts: 0.5, e: '#0a5a7a', ei: 0.4, ein: 0.9, emap: true });

  buildShell(S, walls(), floors(), {
    wall: 'wall', glass: 'glass', frame: 'frame', sill: 'stone', ceil: 'ceil', door: 'door', doorFrame: 'doorFrame',
    handle: 'handle', mainDoor: 'mainDoor', steel: 'steel', shelter: 'shelter', exterior: 'exterior',
    floors: { default: 'parquet', foyer: 'checker', kitchen: 'checker', yard: 'hexFloor', bath1: 'hexFloor', bath2: 'hexFloor', shelter: 'hexFloor' },
  });

  // ---------------- foyer: a liner's entrance ----------------
  A(S, 1206, 1005, FACE.E, () => {
    K.shoeCabinet(S, { w: 1.0, h: 1.0, d: 0.36, m: 'walnut', float: true, top: 'stone', led: true });
    S.cyl([0.3, 1.09, 0.2], 0.03, 0.14, 'glassClear', { seg: 12 });
    porthole(S, 0, 1.62, 0.3);
  });
  A(S, 1360, 1022, FACE.W, () => S.at(0, 1.5, 0, 0, () => K.frame(S, 0.64, 0.26, art(S, { k: 'boarding', flight: 'AN2108', to: 'FOREVER' }), { frame: 'brass', mat: 0.02 })));
  globe(S, mx(1290), mz(1010), 0.32);

  // ---------------- dining + library wall with the secret door ----------------
  // Full-height walnut library along the bedroom-3 wall; one bay is a door.
  A(S, 1099, 700, FACE.S, () => {
    K.shelving(S, { w: 1.78, h: 2.55, d: 0.34, m: 'walnut', rows: 7, cols: 2, seed: 41, back: 'teal', books: ['book1', 'book2', 'book3', 'book5', 'walnut'], objects: ['brass', 'ceramic'], led: 'led' });
  });
  S.group('secret', [mx(1004), 0, mz(700)], () => {
    A(S, 963, 700, FACE.S, () => {
      K.shelving(S, { w: 0.9, h: 2.08, d: 0.3, m: 'walnut', rows: 6, cols: 1, seed: 77, back: 'teal', books: ['book1', 'book2', 'book3', 'book5'] });
      S.bb('redBook', 0.12, 1.05, 0.04, 0.16, 1.32, 0.29, { col: false });
      S.tor([0, 0.18, 0.305], 0.12, 0.012, 'brass'); // a porthole the cats can use
      S.bb('wood2', -0.45, 2.08, 0, 0.45, 2.55, 0.34);
    });
  }, { open: 1.45, at: [mx(963), 0, mz(745)], r: 1.8, prompt: 'Pull the red book', promptClose: 'Close the bookcase' });
  // the passage behind the bookcase needs a lintel cover on the library side
  A(S, 963, 700, FACE.S, () => S.bb('walnut', -0.47, 2.55, 0, 0.47, 2.65, 0.34));

  A(S, 1150, 880, FACE.E, () => {
    K.diningTable(S, { w: 1.6, d: 0.9, top: 'walnutH', leg: 'walnut', pedestal: true });
    for (let i = -1; i <= 1; i++) S.at(i * 0.45, 0, 0, 0, () => K.pendant(S, { shape: 'globe', r: 0.13, drop: 0.85, m: 'brass', i: 2.5 }));
    S.cyl([0, 0.8, 0], 0.11, 0.08, 'brass', { rb: 0.08, seg: 24 });
  });
  for (const py of [836, 880, 924]) {
    A(S, 1098, py, FACE.E, () => decoChair(S));
    A(S, 1202, py, FACE.W, () => decoChair(S));
  }
  A(S, 945, 840, FACE.E, () => K.fridge(S, { w: 0.78, m: 'steel', handle: 'brass' }));
  A(S, 945, 912, FACE.E, () => K.ovenTower(S, { w: 0.58, h: 2.3, body: 'walnut' }));
  A(S, 945, 800, FACE.E, () => S.bb('walnut', -0.05, 1.9, 0, 0.05, 2.65, 0.6));

  // ---------------- kitchen: the galley ----------------
  A(S, 1180, 952, FACE.W, () => {
    K.baseRun(S, 2.5, { body: 'walnut', top: 'stone', handle: 'brass', splash: 'subway' });
    K.hob(S, 1.45, { hood: 'brass' });
    K.wallRun(S, 0.95, { body: 'cab', front: 'cab', y0: 1.55, glass: 'glassClear', led: 'led' });
    S.at(2.0, 0, 0, 0, () => K.wallRun(S, 0.5, { body: 'cab', front: 'cab', y0: 1.55 }));
  });
  A(S, 1126, 1180, FACE.N, () => {
    K.baseRun(S, 1.18, { body: 'walnut', top: 'stone', handle: 'brass', splash: 'subway' });
    K.sink(S, 0.6, { tap: 'brass' });
    S.bb('brass', 0.05, 1.7, 0, 1.13, 1.715, 0.24);
    for (let i = 0; i < 6; i++) S.cyl([0.15 + i * 0.17, 1.8, 0.12], 0.05, 0.17, i % 2 ? 'ceramic' : 'teal', { seg: 14 });
  });
  globe(S, mx(1095), mz(1060), 0.4);

  // ---------------- service yard ----------------
  A(S, 1003, 1018, FACE.W, () => K.washerStack(S));
  A(S, 940, 1180, FACE.N, () => K.litterBox(S));

  // ---------------- living: the first-class lounge ----------------
  // West wall: walnut panelling around the glass opening where the Titanic sits.
  A(S, 1190, 610, FACE.E, () => {
    S.bb('walnut', -0.92, 0, 0, -0.75, 2.65, 0.03);
    S.bb('walnut', 0.75, 0, 0, 0.92, 2.65, 0.03);
    S.bb('walnut', -0.92, 0, 0, 0.92, 0.92, 0.03);
    S.bb('decoPanel', -0.92, 1.6, 0, 0.92, 2.65, 0.02);
    for (const y of [0.92, 1.6]) S.bb('brass', -0.76, y - 0.01, 0.02, 0.76, y + 0.01, 0.04);
    for (const x of [-0.76, 0.76]) S.bb('brass', x - 0.01, 0.92, 0.02, x + 0.01, 1.6, 0.04);
    S.bb('brass', -0.6, 0.6, 0.03, 0.6, 0.62, 0.04);
  });
  // the Titanic itself, centred in the wall, seen from both rooms
  S.at(mx(1185), 0.92, mz(610), FACE.E, () => {
    S.bb('walnutH', -0.76, 0, -0.2, 0.76, 0.03, 0.2);
    S.bb('sea', -0.74, 0.03, -0.18, 0.74, 0.034, 0.18);
    S.at(0, 0.034, 0, 0, () => titanic(S, { plate: false }), 0.98);
    S.bb('glassClear', -0.76, 0.03, 0.2, 0.76, 0.68, 0.204, { col: true });
    S.bb('glassClear', -0.76, 0.03, -0.204, 0.76, 0.68, -0.2, { col: true });
    S.light('rect', [0, 0.66, 0], { w: 1.4, h: 0.3, rot: [-Math.PI / 2, 0, 0], c: '#fff1d6', i: 6 });
    S.bb('led', -0.72, 0.665, -0.12, 0.72, 0.668, 0.12);
  });
  A(S, 1190, 610, FACE.E, () => S.at(0, 0.62, 0.04, 0, () => S.box([0, 0, 0], [0.5, 0.1, 0.01], 't_plate')));
  S.light('spot', [mx(1290), 2.6, mz(610)], { t: [mx(1188), 1.2, mz(610)], a: 0.45, pen: 0.7, i: 8, d: 6, c: '#fff0d8' });
  // conversation lounge: curved sofa facing the ship, two tub chairs
  A(S, 1505, 640, FACE.W, () => {
    for (const [a, xx] of [[0.42, -1], [0, 0], [-0.42, 1]]) S.at(xx * 0.97, 0, Math.abs(xx) * 0.2, a, () => K.sofa(S, { w: 1.0, d: 0.95, m: 'navyVelvet', cush: 'navyVelvet', leg: 'brass', noArms: true, n: 1, round: true, pillows: xx === 0 ? ['pillow'] : xx < 0 ? ['blush'] : ['pillow2'] }));
    S.at(0, 1.55, 0, 0, () => sunburstMirror(S));
  });
  A(S, 1335, 530, FACE.S + 0.35, () => K.armchair(S, { m: 'rattan', cush: 'pillow2', leg: 'walnut', pillow: 'blush' }));
  A(S, 1335, 752, FACE.N - 0.35, () => K.armchair(S, { m: 'rattan', cush: 'pillow2', leg: 'walnut', pillow: 'navyVelvet' }));
  A(S, 1350, 640, 0, () => { K.rug(S, 2.4, 2.4, 'rugLounge', { round: true }); K.coffeeTable(S, { round: true, r: 0.4, top: 'stone', leg: 'brass' }); });
  S.at(mx(1350), 0.4, mz(640), 0, () => { S.cyl([0, 0.08, 0], 0.07, 0.16, 'brass', { rb: 0.05, seg: 16 }); for (let i = 0; i < 6; i++) S.sph([Math.cos(i) * 0.05, 0.2, Math.sin(i) * 0.05], 0.04, 'blush'); });
  // wicker chairs and palms, after the ship's Palm Court
  A(S, 1232, 805, 0, () => K.plant(S, { kind: 'palm', h: 1.8, pot: 'brass', seed: 4 }));
  A(S, 1478, 545, 0, () => K.plant(S, { kind: 'palm', h: 1.7, pot: 'brass', seed: 9 }));
  A(S, 1330, 533, FACE.S, () => { K.curtains(S, 2.1, { m: 'drape', h: 2.55, open: 0.7 }); });
  A(S, 1458, 530, FACE.S, () => K.aircon(S, { y: 2.25 }));
  // gramophone console with the four songs
  A(S, 1432, 835, FACE.N, () => {
    K.console_(S, { w: 1.3, d: 0.42, h: 0.62, m: 'walnut', fluted: true, doors: 3, top: 'stone', handle: 'brass' });
    S.cyl([-0.3, 0.68, 0.2], 0.16, 0.04, 'black', { seg: 32 });
    S.cyl([-0.3, 0.705, 0.2], 0.15, 0.006, 'black', { seg: 32 });
    S.rod([-0.12, 0.7, 0.32], [-0.22, 0.72, 0.18], 0.006, 'brass');
    const ost = [['Love Story', "Taylor's Version", '#033a4e', '#f4b6c2'], ["It's You", 'HENRY', '#173d35', '#d9b472'], ["It's You", 'Sezairi', '#04121b', '#d9b472'], ['Cinta Luar Biasa', 'Andmesh', '#6e2133', '#efe6d6']];
    ost.forEach(([title, artist, a, b], i) => S.at(-0.5 + i * 0.335, 1.4, 0.02, 0, () => K.frame(S, 0.31, 0.31, art(S, { k: 'ost', title, artist, a, b }), { frame: 'brass', mat: 0, mount: false })));
  });
  S.at(mx(1350), 0, mz(650), 0, () => chandelier(S));
  cove(S, 1200, 540, 1500, 830);
  K.cat(S, mx(1300), 0.5, mz(790), 'cat1', 2.2);

  // ---------------- corridor: portholes ----------------
  for (const px of [785, 860]) A(S, px, 700, FACE.S, () => porthole(S, 0, 1.55, 0.2));
  K.downlights(S, [[mx(800), mz(750)], [mx(960), mz(750)]], { ring: 'brass' });
  S.light('point', [mx(880), 2.3, mz(750)], { i: 1.5, d: 4, night: true });

  // ---------------- The Bridge (old bedroom 3) ----------------
  A(S, 918, 530, FACE.E, () => {
    S.bb('walnut', -1.3, 0, 0, 1.0, 1.0, 0.02);
    K.tv(S, { w: 1.45, y: 1.4, screen: 'screenBig' });
    K.console_(S, { w: 1.55, d: 0.4, h: 0.5, m: 'walnut', top: 'brass', doors: 3, led: 'led', float: true });
    for (const sx of [-1, 1]) S.at(sx * 1.0, 0, 0, 0, () => K.shelving(S, { w: 0.4, h: 2.4, d: 0.3, m: 'walnut', rows: 6, cols: 1, seed: 50 + sx, books: ['lego1', 'lego2', 'lego3', 'book1'], objects: ['lego1', 'lego2', 'lego3', 'brass'], led: 'led' }));
  });
  A(S, 1158, 560, FACE.W, () => {
    K.sofa(S, { w: 2.0, d: 0.95, m: 'leather', cush: 'leather', leg: 'brass', pillows: ['navyVelvet', 'pillow'] });
  });
  A(S, 1040, 560, 0, () => { K.rug(S, 2.2, 1.8, 'rugBridge'); S.at(-0.15, 0, 0, Math.PI / 2, () => K.coffeeTable(S, { w: 0.9, d: 0.45, top: 'walnutH', leg: 'brass' })); });
  // telegraph: Full Speed Ahead
  S.at(mx(1025), 0.4, mz(530), 0, () => {
    S.cyl([0, 0.15, 0], 0.03, 0.3, 'brass');
    S.cyl([0, 0.36, 0], 0.11, 0.08, 'brass', { rot: [Math.PI / 2, 0, 0], seg: 28 });
    S.cyl([0, 0.36, 0.041], 0.095, 0.004, 'paper', { rot: [Math.PI / 2, 0, 0], seg: 28 });
  });
  A(S, 1040, 413, FACE.S, () => {
    K.desk(S, { w: 1.9, d: 0.68, m: 'walnutH', leg: 'brass', mat: 'leather' });
    K.monitor(S, -0.35, 0.1, { w: 0.86, curved: true });
    K.keyboard(S, -0.4, 0.4, { glow: 'rgb' });
    K.pcTower(S, 0.72, 0.12);
    K.tableLamp(S, 0.45, 0.745, 0.15, { lampBase: 'brass', shade: 'shade' });
  });
  A(S, 1000, 490, FACE.N, () => K.officeChair(S, { gaming: true, fab: 'leather', accent: 'teal' }));
  A(S, 1080, 416, FACE.S, () => K.blind(S, 1.5, 2.25, 'drape', { drop: 0.5 }));
  A(S, 920, 440, FACE.E, () => shipWheel(S, 0, 1.75, 0.04));
  A(S, 1178, 470, FACE.W, () => { K.catShelf(S, 0.6, 1.5, 'walnut', 'navyVelvet'); K.catShelf(S, 0.6, 1.9, 'walnut', 'navyVelvet'); K.cat(S, 0, 1.95, 0.15, 'cat2', -1.4); });
  A(S, 1178, 455, FACE.W, () => K.aircon(S, { y: 2.25, w: 0.8 }));
  K.downlights(S, [[mx(1000), mz(620)], [mx(1100), mz(620)]], { ring: 'brass' });
  S.light('point', [mx(1050), 2.3, mz(580)], { c: '#ffc98a', i: 2.2, d: 4, night: true });
  S.light('point', [mx(940), 0.6, mz(560)], { c: '#ffb46a', i: 0.8, d: 2 });

  // ---------------- master suite: sleeping zone ----------------
  A(S, 378, 540, FACE.E, () => {
    K.bed(S, { w: 1.83, l: 2.05, frame: 'navyVelvet', head: 'navyVelvet', headStyle: 'wing', hbW: 2.0, hbH: 1.35, duvet: 'duvet', throw: 'fabric2', pillow: 'linen', pillow2: 'pillow', cushion: 'blush', leg: 'brass' });
    S.at(0, 1.95, 0, 0, () => K.frame(S, 0.5, 0.5, art(S, { k: 'monogram', bg: '#0b3a4c' }), { frame: 'brass', mat: 0, mount: false }));
  });
  for (const py of [435, 645]) A(S, 378, py, FACE.E, () => K.bedside(S, { m: 'walnut', handle: 'brass', lampBase: 'brass', shade: 'shade' }));
  A(S, 480, 540, 0, () => K.rug(S, 2.3, 2.6, 'rugBed'));
  A(S, 485, 416, FACE.S, () => K.curtains(S, 1.9, { m: 'drape', h: 2.5, open: 0.65 }));
  S.at(mx(505), 0, mz(555), 0, () => K.ceilingFan(S, { m: 'brass', blade: 'walnut', light: true }));
  A(S, 500, 690, FACE.N, () => S.bb('walnut', -1.1, 0, 0, 1.1, 1.0, 0.02));

  // ---------------- master suite: dressing lounge (old bedroom 2) ----------------
  A(S, 790, 688, FACE.N, () => K.wardrobe(S, { w: 1.2, h: 2.45, d: 0.6, m: 'walnut', glass: 'glassDark', handle: 'brass' }));
  A(S, 906, 560, FACE.W, () => K.wardrobe(S, { w: 2.2, h: 2.45, d: 0.6, m: 'walnut', handle: 'brass' }));
  A(S, 760, 413, FACE.S, () => {
    K.dresser(S, { w: 1.0, m: 'walnut', front: 'walnut', stool: 'blush' });
    S.cyl([0.25, 0.79, 0.2], 0.06, 0.03, 'brass', { seg: 16 });
    S.cyl([0.25, 0.98, 0.2], 0.15, 0.015, 'mirror', { rot: [Math.PI / 2 - 0.1, 0, 0], seg: 28 });
    S.tor([0.25, 0.98, 0.2], 0.15, 0.01, 'brass', { rot: [-0.1, 0, 0] });
  });
  A(S, 740, 560, 0, () => {
    S.bb('walnut', -0.55, 0, -0.3, 0.55, 0.85, 0.3, { col: true });
    S.bb('stone', -0.57, 0.85, -0.32, 0.57, 0.88, 0.32);
    S.bb('glassClear', -0.5, 0.6, -0.31, 0.5, 0.8, 0.31);
  });
  A(S, 744, 416, FACE.S, () => K.curtains(S, 1.4, { m: 'sheer', h: 2.45 }));
  // qibla line inlaid in brass in the parquet (assumes the plan's top is north)
  S.at(mx(640), 0, mz(480), FACE.E - 0.4, () => {
    S.bb('brass', -0.004, 0.0005, -0.7, 0.004, 0.003, 0.5);
    S.ext([0, 0.0005, -0.7], [[0, -0.08], [0.05, 0], [-0.05, 0]], 0.0025, 'brass');
    S.bb('sejadah', -0.35, 0.001, -0.6, 0.35, 0.012, 0.6);
  });
  A(S, 832, 440, 0, () => { S.cyl([0, 0.2, 0], 0.18, 0.4, 'rattan', { seg: 20 }); S.cyl([0, 0.42, 0], 0.07, 0.6, 'sejadah', { rot: [0, 0, Math.PI / 2] }); });
  S.at(mx(780), 0, mz(560), 0, () => K.pendant(S, { shape: 'globe', r: 0.18, drop: 0.7, m: 'brass', i: 3 }));

  // ---------------- master bath: the spa ----------------
  tileRoom(S, 'subway', 'tealTile', 523, 812, 724, 965, { doors: [[523, 600], [612, 680]], wins: [[600, 668]], shower: 640 });
  S.bb('subway', mx(378), 0, mz(700), mx(600), 2.4, mz(700) + 0.008);
  S.bb('tealTile', mx(378), 0, mz(700), mx(378) + 0.008, 2.4, mz(800));
  S.bb('subway', mx(378), 0, mz(800) - 0.008, mx(523), 2.4, mz(800));
  S.bb('subway', mx(600) - 0.008, 0, mz(700), mx(600), 2.4, mz(800));
  A(S, 490, 752, 0, () => K.bathtub(S, { l: 1.6, w: 0.78, tap: 'brass' }));
  A(S, 378, 752, FACE.E, () => { S.bb('stone', -0.5, 0.0, 0.0, 0.5, 0.42, 0.25); for (let i = 0; i < 3; i++) S.cyl([-0.3 + i * 0.15, 0.48, 0.12], 0.035, 0.08 + i * 0.03, 'lamp', { seg: 12 }); });
  A(S, 724, 862, FACE.W, () => K.vanity(S, { w: 0.8, body: 'teal', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass', led: 'led' }));
  A(S, 560, 965, FACE.N, () => K.toilet(S));
  K.showerScreen(S, mx(640), mz(895), mx(642), mz(965), { frame: 'brass' });
  K.rainShower(S, mx(685), mz(930), { m: 'brass' });
  S.light('point', [mx(490), 2.3, mz(750)], { i: 1.8, d: 3, night: true });
  S.light('point', [mx(640), 2.3, mz(880)], { i: 1.6, d: 3, night: true });
  K.downlights(S, [[mx(490), mz(750)], [mx(640), mz(880)]], { ring: 'brass' });

  // ---------------- common bath ----------------
  tileRoom(S, 'subway', 'subway', 734, 812, 895, 965, { doors: [[808, 895]], wins: [[745, 795]] });
  A(S, 734, 860, FACE.E, () => K.vanity(S, { w: 0.65, body: 'walnut', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass' }));
  A(S, 852, 965, FACE.N, () => K.toilet(S));
  K.showerScreen(S, mx(734), mz(893), mx(800), mz(895), { frame: 'brass' });
  K.rainShower(S, mx(765), mz(935), { m: 'brass' });
  S.light('point', [mx(815), 2.3, mz(890)], { i: 1.6, d: 3, night: true });

  A(S, 1500, 965, FACE.W, () => K.shelving(S, { w: 1.9, h: 2.2, d: 0.4, m: 'white', rows: 4, fill: false }));

  labels(S, [['Master suite', 500, 600], ['Dressing lounge', 780, 600], ['The Bridge', 1050, 560], ['Lounge', 1360, 640], ['Library + dining', 1150, 860],
    ['Spa bath', 500, 760], ['Kitchen', 1095, 1080], ['Yard', 945, 1080], ['Bath', 815, 890], ['Shelter', 1445, 960], ['Foyer', 1285, 1010], ['Secret door', 963, 740]]);

  S.view('Front door', [mx(1325), 1.6, mz(1052)], [mx(1188), 1.25, mz(615)], 'Checker marble and portholes');
  S.view('The Titanic', [mx(1360), 1.6, mz(640)], [mx(1186), 1.15, mz(612)], 'Seen from the lounge');
  S.view('The library door', [mx(1068), 1.6, mz(815)], [mx(985), 1.2, mz(700)], 'Press F: pull the red book');
  S.view('The Bridge', [mx(960), 1.6, mz(660)], [mx(1170), 1.1, mz(560)], 'Mancave, with the Titanic behind');
  S.view('Master suite', [mx(700), 1.6, mz(712)], [mx(420), 1.1, mz(560)], 'Bedroom 2 folded in');
  S.view('Dressing lounge', [mx(620), 1.6, mz(470)], [mx(880), 1.0, mz(620)], 'Wardrobes, vanity, qibla inlay');
  S.view('Spa bath', [mx(588), 1.6, mz(765)], [mx(420), 0.75, mz(750)], 'Freestanding tub');
  S.view('Palm Court lounge', [mx(1440), 1.6, mz(800)], [mx(1250), 1.0, mz(560)], 'Wicker, palms and the gramophone');
  return S.toJSON();
}

// ---------- White Star pieces ----------
function porthole(S, x, y, r) {
  S.at(x, y, 0, 0, () => {
    S.tor([0, 0, 0.03], r, r * 0.16, 'brass', { rot: [0, 0, 0] });
    S.cyl([0, 0, 0.02], r, 0.01, 'mirror', { rot: [Math.PI / 2, 0, 0], seg: 32 });
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; S.sph([Math.cos(a) * r * 1.12, Math.sin(a) * r * 1.12, 0.05], 0.012, 'brass'); }
  });
}

function globe(S, x, z, drop) {
  S.at(x, 0, z, 0, () => K.pendant(S, { shape: 'globe', r: 0.16, drop, m: 'brass', i: 2.5 }));
}

function decoChair(S) {
  for (const sx of [-1, 1]) for (const z of [-0.18, 0.18]) S.cyl([sx * 0.19, 0.22, z], 0.018, 0.44, 'walnut', { seg: 8, rb: 0.012 });
  S.bb('navyVelvet', -0.23, 0.44, -0.22, 0.23, 0.51, 0.22, { bev: 0.03 });
  S.cyl([0, 0.78, -0.2], 0.23, 0.06, 'navyVelvet', { rot: [Math.PI / 2 - 0.1, 0, 0], seg: 24, sc: [1, 1, 1.25] });
}

function sunburstMirror(S) {
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2, l = i % 2 ? 0.2 : 0.3;
    S.box([Math.cos(a) * (0.3 + l / 2), Math.sin(a) * (0.3 + l / 2), 0.02], [l, 0.012, 0.012], 'brass', { rot: [0, 0, a] });
  }
  S.cyl([0, 0, 0.02], 0.3, 0.03, 'brass', { rot: [Math.PI / 2, 0, 0], seg: 36 });
  S.cyl([0, 0, 0.036], 0.27, 0.004, 'mirror', { rot: [Math.PI / 2, 0, 0], seg: 36 });
}

function shipWheel(S, x, y, z) {
  S.at(x, y, z, 0, () => {
    S.tor([0, 0, 0.03], 0.32, 0.025, 'walnut');
    S.cyl([0, 0, 0.03], 0.07, 0.08, 'brass', { rot: [Math.PI / 2, 0, 0], seg: 16 });
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      S.rod([0, 0, 0.03], [Math.cos(a) * 0.44, Math.sin(a) * 0.44, 0.03], 0.016, 'walnut');
      S.sph([Math.cos(a) * 0.44, Math.sin(a) * 0.44, 0.03], 0.025, 'walnut');
    }
  });
}

function chandelier(S) {
  S.cyl([0, 2.6, 0], 0.12, 0.08, 'brass', { seg: 24 });
  S.cyl([0, 2.3, 0], 0.01, 0.55, 'brass');
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    S.rod([0, 2.08, 0], [Math.cos(a) * 0.35, 2.12, Math.sin(a) * 0.35], 0.01, 'brass');
    S.sph([Math.cos(a) * 0.35, 2.2, Math.sin(a) * 0.35], 0.07, 'lamp');
  }
  S.sph([0, 2.05, 0], 0.12, 'lamp');
  S.light('point', [0, 2.1, 0], { c: '#ffd9a0', i: 5, d: 6, night: true });
}

function cove(S, x0, y0, x1, y1) {
  const t = 0.12;
  for (const [a, b, c, d] of [[x0, y0, x1, y0 + 10], [x0, y1 - 10, x1, y1], [x0, y0, x0 + 10, y1], [x1 - 10, y0, x1, y1]]) {
    S.bb('ceil', mx(a), 2.65 - t, mz(b), mx(c), 2.65 - t + 0.03, mz(d));
  }
  S.bb('led', mx(x0) + 0.1, 2.645, mz(y0) + 0.1, mx(x1) - 0.1, 2.648, mz(y0) + 0.12);
  S.bb('led', mx(x0) + 0.1, 2.645, mz(y1) - 0.12, mx(x1) - 0.1, 2.648, mz(y1) - 0.1);
}
