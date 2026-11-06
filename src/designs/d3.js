// Design 3 — Summer Triangle. Imagination first, rulebook second:
//  - bedroom 3 is gone; its floor becomes a raised teak stargazing deck
//  - the Titanic gets its own island, The Crossing, where that wall stood
//  - bedroom 2 is the Player Two room behind a black-framed glass wall
//  - the living room and master sleep under the Summer Triangle
import { Spec, mx, mz } from '../core.js';
import { baseWalls, baseFloors, buildShell, editWalls, W, win, open } from '../plan.js';
import * as K from '../kit.js';
import { titanicMats, vitrine, iceberg } from '../titanic.js';
import { mats, art, labels } from './common.js';
import { tileRoom } from './d1.js';

const { FACE } = K;
const A = (S, px, py, ry, fn, y = 0) => S.atPx(px, py, ry, fn, y);
const DECK = 0.3;

export function walls() {
  return editWalls(baseWalls(), {
    remove: ['b3S', 'b3E', 'dB3r', 'b2S', 'dB2r'],
    add: [
      W('b2Sm', 640, 688, 745, 700),
      win('glassP2', 745, 688, 815, 700, { sill: 0, head: 2.4 }),
      open('doorP2', 815, 688, 906, 700, { head: 2.4 }),
    ],
  });
}

export function floors() {
  return baseFloors().concat([
    { id: 'b3gapS', r: [918, 688, 1190, 700], room: 'living' },
    { id: 'b3gapE', r: [1180, 530, 1190, 688], room: 'living' },
  ]);
}

export function build() {
  const S = new Spec({
    design: 'd3',
    platforms: [
      [mx(918), mz(413), mx(1180), mz(688), DECK],
      [mx(918), mz(688), mx(975), mz(712), DECK / 2],
      [mx(1180), mz(530), mx(1205), mz(688), DECK / 2],
    ],
  });
  mats(S, {
    wall: { c: '#f3eee6', r: 0.93 },
    ceil: { c: '#f6f2ea', r: 0.95 },
    door: { c: '#0b2230', r: 0.5 },
    doorFrame: { c: '#0b2230', r: 0.5 },
    handle: { c: '#d9b472', r: 0.25, m: 1 },
    mainDoor: { c: '#04121b', r: 0.4 },
    frame: { c: '#15171a', r: 0.4, m: 0.5 },
    brass: { c: '#d9b472', r: 0.25, m: 1 },
    wood: { c: '#a8774a', r: 0.5, tex: 'grain', ts: 1.0 },
    fabric: { c: '#efe6d6', r: 0.97, tex: 'boucle', ts: 0.35 },
    fabric2: { c: '#033a4e', r: 0.75, tex: 'fabric', ts: 0.3 },
    fabric3: { c: '#1a2a33', r: 0.9, tex: 'fabric', ts: 0.3 },
    pillow: { c: '#f4b6c2', r: 0.9, tex: 'fabric', ts: 0.3 },
    pillow2: { c: '#d9b472', r: 0.85, tex: 'fabric', ts: 0.3 },
    linen: { c: '#f8f3ea', r: 0.9, tex: 'fabric', ts: 0.4 },
    duvet: { c: '#0d2c3b', r: 0.9, tex: 'fabric', ts: 0.4 },
    cab: { c: '#04121b', r: 0.4 },
    stone: { c: '#0e2230', r: 0.25, tex: { k: 'starTerrazzo', c: '#0e2230' }, ts: 1.0, cc: 0.5 },
    shade: { c: '#f6e7cc', r: 0.85, e: '#ffd28a', ei: 0.05, ein: 1.0 },
    led: { c: '#ffe2b0', e: '#ffcf80', ei: 1.4, ein: 3.4 },
  });
  titanicMats(S);
  S.mat('starFloor', { c: '#0b1c27', r: 0.3, tex: { k: 'starTerrazzo', c: '#0d2230' }, ts: 1.2, cc: 0.35 });
  S.mat('teak', { c: '#9a6a3c', r: 0.5, tex: { k: 'wood', planks: 8 }, ts: 1.4 });
  S.mat('carpet', { c: '#14303d', r: 1, tex: 'boucle', ts: 0.5 });
  S.mat('skyCeil', { c: '#ffffff', r: 0.9, tex: { k: 'sky' }, emap: true, e: '#ffffff', ei: 0.35, ein: 1.0 });
  S.mat('skyCeil2', { c: '#ffffff', r: 0.9, tex: { k: 'sky', labels: false }, emap: true, e: '#ffffff', ei: 0.35, ein: 1.0 });
  S.mat('sunsetWall', { c: '#ffffff', r: 0.9, tex: { k: 'sunset' }, emap: true, e: '#ffffff', ei: 0.12, ein: 0.35 });
  S.mat('midnight', { c: '#04121b', r: 0.45 });
  S.mat('tealLac', { c: '#033a4e', r: 0.3, cc: 0.6 });
  S.mat('blushLac', { c: '#f4b6c2', r: 0.3, cc: 0.6 });
  S.mat('blushZel', { c: '#f1bcc4', r: 0.25, tex: { k: 'tile', n: 8, m: 8, c: '#f1bcc4', cols: ['#f1bcc4', '#f4c7cd', '#eab0b9'], grout: '#f6ece4', zellige: true, vary: 0.1 }, ts: 0.6, bump: 0.02 });
  S.mat('nightTile', { c: '#0d2230', r: 0.2, tex: { k: 'starTerrazzo', c: '#0d2230' }, ts: 0.8, cc: 0.5 });
  S.mat('ivoryTile', { c: '#f4efe6', r: 0.3, tex: { k: 'tile', n: 4, m: 8, c: '#f4efe6', grout: '#dcd3c5' }, ts: 0.6 });
  S.mat('seaGlow', { c: '#ffffff', r: 0.2, tex: { k: 'caustics', c: '#063a52' }, ts: 0.6, emap: true, e: '#ffffff', ei: 0.8, ein: 1.6 });
  S.mat('lavaRug', { c: '#ffffff', r: 1, tex: { k: 'lava' }, ts: 1.8 });
  S.mat('neonSign', { c: '#ffffff', r: 0.5, tex: { k: 'text', text: 'SIN  →  FOREVER', sub: 'AN2108 · 21.08.2027 · CROWNE PLAZA CHANGI', fg: '#ffd27a', bg: '#04121b', size: 110 }, emap: true, e: '#ffffff', ei: 0.9, ein: 1.8 });
  S.mat('neon404', { c: '#ffffff', r: 0.5, tex: { k: 'notfound' }, emap: true, e: '#ffffff', ei: 0.7, ein: 1.4 });
  S.mat('board', { c: '#ffffff', r: 0.5, tex: { k: 'splitflap' }, emap: true, e: '#ffffff', ei: 0.7, ein: 1.3 });
  S.mat('screenWhite', { c: '#f4f2ee', r: 0.9 });
  S.mat('copper', { c: '#b8734a', r: 0.3, m: 1 });
  S.mat('grill', { c: '#1b1b1b', r: 0.5, m: 0.6 });
  S.mat('paperPlane', { c: '#fbf8f2', r: 0.8, ds: true });
  S.mat('rope', { c: '#c8a97a', r: 1 });
  S.mat('neonPink', { c: '#f4b6c2', e: '#ff8fb0', ei: 1.4, ein: 2.6 });
  S.mat('neonTeal', { c: '#7fe0c9', e: '#53e0c0', ei: 1.4, ein: 2.6 });
  S.mat('lego1', { c: '#c4281b', r: 0.35 });
  S.mat('lego2', { c: '#f5cd2f', r: 0.35 });
  S.mat('lego3', { c: '#0d69ab', r: 0.35 });
  S.mat('sheer', { c: '#f6f1e8', r: 1, o: 0.7, glass: true, ds: true });
  S.mat('tubeGlass', { c: '#e8f4f6', r: 0.05, o: 0.35, glass: true, env: 1.2 });
  S.mat('water1', { c: '#f4b6c2', r: 0.1, o: 0.85, glass: true });
  S.mat('water2', { c: '#2aa7a0', r: 0.1, o: 0.85, glass: true });
  S.mat('water3', { c: '#e2b04f', r: 0.1, o: 0.85, glass: true });
  S.mat('water4', { c: '#2c6e49', r: 0.1, o: 0.85, glass: true });
  S.mat('water5', { c: '#3f5fbf', r: 0.1, o: 0.85, glass: true });

  buildShell(S, walls(), floors(), {
    wall: 'wall', glass: 'glass', frame: 'frame', sill: 'stone', ceil: 'ceil', door: 'door', doorFrame: 'doorFrame',
    handle: 'handle', mainDoor: 'mainDoor', steel: 'steel', shelter: 'shelter', exterior: 'exterior',
    ceils: { living: 'skyCeil', master: 'skyCeil', bed3: 'skyCeil2', corridor: 'skyCeil2', b3gapS: 'skyCeil2', b3gapE: 'skyCeil2' },
    floors: { default: 'starFloor', master: 'carpet', masterLow: 'carpet', bed2: 'carpet', bed3: 'teak', kitchen: 'starFloor', bath1: 'nightTile', bath2: 'stone', shelter: 'stone' },
  });

  // ---------------- foyer: departures ----------------
  A(S, 1360, 1022, FACE.W, () => {
    S.bb('black', -0.56, 1.45, 0, 0.56, 1.95, 0.06);
    S.box([0, 1.7, 0.062], [1.06, 0.4, 0.004], 'board');
  });
  A(S, 1206, 1005, FACE.E, () => {
    K.shoeCabinet(S, { w: 1.0, h: 0.95, d: 0.36, m: 'midnight', float: true, fluted: true, front: 'tealLac', top: 'brass', led: true });
    S.cyl([0.3, 1.04, 0.2], 0.03, 0.14, 'glassClear', { seg: 12 });
  });
  // paper planes on a dashed gold flight path across the ceiling, door to deck
  const path = [[1300, 1060], [1290, 960], [1250, 860], [1180, 790], [1080, 760], [980, 700], [940, 600]];
  for (let i = 0; i < path.length - 1; i++) {
    const [a, b] = [path[i], path[i + 1]];
    const n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 22);
    for (let k = 0; k < n; k++) {
      const t = (k + 0.25) / n, x = mx(a[0] + (b[0] - a[0]) * t), z = mz(a[1] + (b[1] - a[1]) * t);
      S.box([x, 2.643, z], [0.1, 0.004, 0.025], 'brass', { rot: [0, -Math.atan2(mz(b[1]) - mz(a[1]), mx(b[0]) - mx(a[0])), 0] });
    }
  }
  [[1290, 1010, 2.15], [1270, 930, 2.3], [1235, 860, 2.05], [1160, 790, 2.25]].forEach(([px, py, y], i) => {
    S.at(mx(px), y, mz(py), 2.3 + i * 0.3, () => {
      S.rod([0, 0, 0], [0, 2.65 - y, 0], 0.0015, 'black');
      S.ext([0, -0.002, 0], [[0.16, 0], [-0.1, 0.08], [-0.06, 0], [-0.1, -0.08]], 0.004, 'paperPlane', { rot: [0, 0, 0.12] });
    });
  });
  S.light('point', [mx(1290), 2.3, mz(1000)], { i: 2.2, d: 4, night: true });

  // ---------------- The Crossing: the Titanic's island ----------------
  A(S, 1080, 722, 0, () => {
    S.bb('midnight', -1.15, 0, -0.31, 1.15, 0.92, 0.31, { col: true });
    S.bb('brass', -1.16, 0.88, -0.32, 1.16, 0.9, 0.32);
    S.bb('seaGlow', -1.13, 0.9, -0.29, 1.13, 0.905, 0.29);
    S.bb('glassClear', -1.15, 0.905, -0.31, 1.15, 0.925, 0.31);
    for (const x of [-1.15, 1.15]) S.bb('brass', x - 0.01, 0, -0.31, x + 0.01, 0.92, 0.31);
    S.bb('led', -1.1, 0.06, 0.31, 1.1, 0.075, 0.315);
    S.at(0.25, 0.925, 0, 0, () => vitrine(S, { free: true, L: 1.6, W: 0.42, H: 0.58, y0: 0, frame: 'brass', glass: 'glassClear', deck: 'midnight', sea: 'seaGlow', li: 6 }));
    // the iceberg, which misses this time
    S.at(-0.85, 0.925, -0.05, 0, () => iceberg(S, { s: 0.55 }));
    S.at(-0.85, 0.925, 0.24, 0, () => S.box([0, 0.02, 0], [0.2, 0.04, 0.004], 't_plate', { rot: [-0.5, 0, 0] }));
  });
  for (const px of [1040, 1130]) A(S, px, 772, 0, () => K.stool(S, { h: 0.72, m: 'brass', seat: 'fabric2' }));
  S.light('spot', [mx(1100), 2.6, mz(800)], { t: [mx(1100), 1.1, mz(722)], a: 0.4, pen: 0.7, i: 8, d: 6, c: '#fff0d8' });

  // ---------------- the stargazing deck (old bedroom 3) ----------------
  S.bb('teak', mx(918), 0, mz(413), mx(1180), DECK, mz(688));
  S.bb('teak', mx(918), 0, mz(688), mx(975), DECK / 2, mz(712));
  S.bb('teak', mx(1180), 0, mz(530), mx(1205), DECK / 2, mz(688));
  S.bb('brass', mx(918), DECK - 0.01, mz(686), mx(1180), DECK + 0.005, mz(690));
  S.at(0, DECK, 0, 0, () => {
    // telescope at the window, pointed at Altair and Vega
    A(S, 1060, 470, 0, () => {
      for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; S.rod([0, 1.05, 0], [Math.cos(a) * 0.3, 0, Math.sin(a) * 0.3], 0.012, 'brass'); }
      S.cyl([0, 1.25, -0.05], 0.06, 0.9, 'midnight', { rot: [-1.0, 0, 0], seg: 18 });
      S.cyl([0, 1.53, -0.29], 0.07, 0.06, 'brass', { rot: [-1.0, 0, 0], seg: 18 });
    });
    A(S, 990, 520, 0, () => { S.cyl([0, 0.15, 0], 0.4, 0.3, 'fabric2', { seg: 28, rb: 0.42 }); S.cyl([0, 0.32, 0], 0.36, 0.06, 'pillow', { seg: 28 }); });
    A(S, 1080, 600, 0, () => { S.cyl([0, 0.13, 0], 0.36, 0.26, 'fabric', { seg: 28, rb: 0.38 }); });
    A(S, 960, 630, 0, () => S.sph([0, 0.22, 0], 0.45, 'pillow2', { sc: [1, 0.5, 1] }));
    A(S, 1150, 455, 0, () => K.catTree(S, { cat: 'cat1', h: 1.75, m: 'wood' }));
    A(S, 1030, 640, 0, () => K.rug(S, 1.4, 0.9, 'fabric3'));
    // hanging egg chair
    A(S, 1135, 610, 0, () => {
      S.rod([0, 2.65 - DECK, 0], [0, 1.45, 0], 0.012, 'brass');
      S.sph([0, 0.95, 0], 0.5, 'rattan', { sc: [1, 1.15, 1] });
      S.sph([0, 0.78, 0.1], 0.38, 'pillow', { sc: [1, 0.5, 1] });
      S.box([0, 1.0, 0.22], [0.42, 0.3, 0.1], 'fabric', { bev: 0.04 });
    });
    K.cat(S, mx(985), 0.36, mz(515), 'cat2', 1.2);
  });
  A(S, 1080, 416, FACE.S, () => K.curtains(S, 1.5, { m: 'sheer', h: 2.45, open: 0.6 }));
  S.light('point', [mx(1050), 2.3, mz(560)], { c: '#ffd5a0', i: 1.6, d: 4, night: true });

  // ---------------- living: the sunset wall and the Player Two sofa ----------------
  A(S, 1505, 682, FACE.W, () => {
    S.bb('sunsetWall', -1.52, 0, 0, 1.52, 2.65, 0.012);
    S.bb('screenWhite', -0.95, 0.75, 0.05, 0.95, 1.82, 0.055);
    K.console_(S, { w: 2.2, d: 0.4, h: 0.32, m: 'midnight', front: 'tealLac', doors: 4, top: 'brass', float: true, led: 'led' });
  });
  for (let i = 0; i < 5; i++) A(S, 1505, 560 + i * 60, FACE.W, () => K.catShelf(S, 0.4, 2.15 + (i % 2) * 0.17, 'wood', 'fabric2'));
  K.cat(S, mx(1480), 2.2, mz(620), 'cat3', -1.6);
  // U-shaped modular sofa facing the screen
  A(S, 1250, 680, FACE.E, () => {
    K.sofa(S, { w: 3.0, d: 1.0, m: 'fabric', cush: 'fabric', leg: 'brass', plinth: 'midnight', round: true, pillows: ['pillow', 'fabric2', 'pillow2', 'pillow'] });
    for (const sx of [-1, 1]) S.at(sx * 1.5, 0, 1.55, sx > 0 ? -Math.PI / 2 : Math.PI / 2, () => K.sofa(S, { w: 1.1, d: 0.95, m: 'fabric', cush: 'fabric', plinth: 'midnight', noArms: true, n: 1, round: true, pillows: [] }));
  });
  A(S, 1380, 680, 0, () => {
    K.rug(S, 2.4, 2.6, 'fabric2', { round: true });
    S.cyl([0, 0.2, 0], 0.5, 0.4, 'pillow2', { seg: 36 });
    S.bb('black', -0.08, 0.4, -0.05, 0.08, 0.45, 0.05, { bev: 0.02 });
    S.bb('neonPink', 0.12, 0.4, -0.05, 0.28, 0.45, 0.05, { bev: 0.02 });
  });
  S.at(mx(1380), 0, mz(600), 0, () => S.bb('black', -0.15, 2.5, -0.15, 0.15, 2.62, 0.15));
  A(S, 1432, 835, FACE.N, () => S.at(0, 1.6, 0.02, 0, () => S.box([0, 0, 0], [1.4, 0.35, 0.01], 'neonSign')));
  A(S, 1225, 548, 0, () => K.plant(S, { kind: 'monstera', h: 1.1, pot: 'midnight', seed: 12 }));
  A(S, 1478, 548, 0, () => K.plant(S, { kind: 'fig', h: 1.9, pot: 'brass', seed: 5 }));
  A(S, 1330, 533, FACE.S, () => K.curtains(S, 2.1, { m: 'sheer', h: 2.5, open: 0.55 }));
  A(S, 1458, 530, FACE.S, () => K.aircon(S, { y: 2.3 }));
  K.downlights(S, [[mx(1240), mz(800)], [mx(1460), mz(800)]], { ring: 'brass' });
  S.light('point', [mx(1350), 2.3, mz(700)], { c: '#ffc98a', i: 3, d: 6, night: true });
  S.light('point', [mx(1490), 1.3, mz(682)], { c: '#ff9d5c', i: 1.2, d: 3 });

  // ---------------- dining: yakiniku, like the first meeting ----------------
  A(S, 1095, 893, 0, () => {
    K.diningTable(S, { round: true, r: 0.62, top: 'stone', leg: 'brass' });
    S.cyl([0, 0.762, 0], 0.2, 0.01, 'grill', { seg: 32 });
    for (let i = -3; i <= 3; i++) S.bb('chrome', i * 0.05 - 0.004, 0.768, -0.18, i * 0.05 + 0.004, 0.772, 0.18);
    S.cyl([0, 1.75, 0], 0.32, 0.4, 'copper', { rb: 0.12, seg: 32 });
    S.cyl([0, 2.2, 0], 0.08, 0.9, 'copper', { seg: 16 });
    S.cyl([0, 1.55, 0], 0.3, 0.01, 'lamp', { seg: 28 });
    S.light('point', [0, 1.45, 0], { c: '#ffcf96', i: 3.5, d: 4, night: true });
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      S.at(Math.cos(a) * 0.82, 0, Math.sin(a) * 0.82, -a - Math.PI / 2, () => K.chair(S, { m: 'midnight', seat: 'fabric2', style: 'wishbone' }));
    }
  });
  A(S, 945, 840, FACE.E, () => K.fridge(S, { w: 0.76, m: 'blushLac', handle: 'brass' }));
  A(S, 945, 912, FACE.E, () => K.ovenTower(S, { w: 0.58, h: 2.3, body: 'midnight' }));
  A(S, 945, 800, FACE.E, () => S.bb('midnight', -0.05, 1.9, 0, 0.05, 2.65, 0.6));

  // ---------------- kitchen ----------------
  A(S, 1180, 952, FACE.W, () => {
    K.baseRun(S, 2.5, { body: 'midnight', top: 'stone', handle: 'brass', splash: 'blushZel', fluted: true });
    K.hob(S, 1.45, { hood: 'brass' });
    K.wallRun(S, 0.95, { body: 'tealLac', front: 'tealLac', y0: 1.55, led: 'led' });
    S.at(2.0, 0, 0, 0, () => K.wallRun(S, 0.5, { body: 'tealLac', front: 'tealLac', y0: 1.55 }));
  });
  A(S, 1126, 1180, FACE.N, () => {
    K.baseRun(S, 1.18, { body: 'midnight', top: 'stone', handle: 'brass', splash: 'blushZel', fluted: true });
    K.sink(S, 0.6, { tap: 'brass' });
    S.bb('brass', 0.05, 1.7, 0, 1.13, 1.715, 0.24);
  });
  S.light('point', [mx(1095), 2.3, mz(1060)], { i: 2.5, d: 4.5, night: true });
  K.downlights(S, [[mx(1095), mz(1010)], [mx(1095), mz(1110)]], { ring: 'brass' });
  A(S, 1003, 1018, FACE.W, () => K.washerStack(S));
  A(S, 940, 1180, FACE.N, () => K.litterBox(S));

  // ---------------- corridor: Sort of Us ----------------
  // a rack of water-sort tubes, the game made for Nurul
  A(S, 802, 800, FACE.N, () => {
    S.bb('wood', -0.05, 1.12, 0, 1.25, 1.15, 0.12);
    const R = K.rng(24);
    for (let t = 0; t < 9; t++) {
      const x = 0.05 + t * 0.135;
      S.cyl([x, 1.3, 0.06], 0.03, 0.3, 'tubeGlass', { seg: 14 });
      const layers = 1 + Math.floor(R() * 4);
      for (let l = 0; l < layers; l++) S.cyl([x, 1.18 + l * 0.058, 0.06], 0.026, 0.056, `water${1 + Math.floor(R() * 5)}`, { seg: 14 });
    }
  });
  S.light('point', [mx(800), 2.3, mz(750)], { c: '#ffd9a0', i: 1.4, d: 4, night: true });

  // ---------------- Player Two room (bedroom 2) ----------------
  A(S, 778, 413, FACE.S, () => {
    K.desk(S, { w: 2.6, d: 0.65, m: 'midnight', leg: 'brass' });
    K.monitor(S, -0.62, 0.1, { w: 0.7 });
    K.monitor(S, 0.62, 0.1, { w: 0.7 });
    K.keyboard(S, -0.65, 0.4, { glow: 'neonTeal' });
    K.keyboard(S, 0.58, 0.4, { glow: 'neonPink' });
    K.pcTower(S, -1.15, 0.12, { glow: 'neonTeal' });
    K.pcTower(S, 1.15, 0.12, { glow: 'neonPink' });
    K.ledStrip(S, -1.3, 1.3, 0.72, 'neonTeal', 0.62);
  });
  A(S, 725, 492, FACE.N, () => K.officeChair(S, { gaming: true, fab: 'fabric3', accent: 'neonTeal' }));
  A(S, 835, 492, FACE.N, () => K.officeChair(S, { gaming: true, fab: 'pillow', accent: 'midnight' }));
  // racing seat for go-kart rematches (he lapped her twice)
  A(S, 790, 600, FACE.E, () => {
    S.bb('black', -0.35, 0, -0.25, 0.35, 0.08, 0.9, { col: true });
    S.box([0, 0.38, 0.0], [0.5, 0.25, 0.5], 'pillow', { bev: 0.08 });
    S.box([0, 0.75, -0.22], [0.5, 0.7, 0.14], 'pillow', { bev: 0.06, rot: [-0.35, 0, 0] });
    S.rod([0, 0.08, 0.75], [0, 0.72, 0.62], 0.025, 'black');
    S.tor([0, 0.78, 0.6], 0.15, 0.018, 'black', { rot: [1.1, 0, 0] });
    S.bb('chrome', -0.12, 0.08, 0.78, 0.12, 0.12, 0.84);
  });
  A(S, 906, 600, FACE.W, () => {
    K.tv(S, { w: 1.2, y: 1.3 });
    S.at(0, 1.95, 0, 0, () => S.box([0, 0, 0.01], [0.62, 0.38, 0.01], 'neon404'));
    for (const [i, m] of [[-1, 'tealLac'], [1, 'blushLac']]) S.at(i * 0.85, 1.45, 0.02, 0, () => {
      S.box([0, 0.08, 0], [0.2, 0.26, 0.015], m, { bev: 0.006 });
      S.box([0, -0.12, 0], [0.04, 0.14, 0.02], 'black', { bev: 0.006 });
    });
  });
  A(S, 790, 600, 0, () => K.rug(S, 2.1, 1.7, 'lavaRug'));
  A(S, 652, 560, FACE.E, () => K.shelving(S, { w: 1.6, h: 2.3, d: 0.3, m: 'midnight', rows: 6, cols: 2, seed: 81, books: ['lego1', 'lego2', 'lego3', 'book1', 'book2'], objects: ['lego1', 'lego2', 'lego3', 'brass'], led: 'neonTeal' }));
  S.light('point', [mx(780), 1.0, mz(450)], { c: '#7fe0c9', i: 0.8, d: 2.5 });
  S.light('point', [mx(860), 2.2, mz(600)], { c: '#ff9ab8', i: 1.2, d: 3.5, night: true });

  // ---------------- master: Vega and Altair ----------------
  A(S, 505, 555, 0, () => {
    // round bed under the stars, curved channel headboard against the west wall
    for (let i = 0; i < 11; i++) {
      const a = Math.PI / 2 + (i - 5) * 0.17;
      S.box([-Math.sin(a) * 1.18, 0.75, Math.cos(a) * 1.18], [0.24, 1.1, 0.12], 'fabric2', { bev: 0.05, rot: [0, Math.PI - a, 0] });
    }
    S.cyl([0, 0.17, 0], 1.08, 0.34, 'fabric2', { seg: 48, col: true });
    S.cyl([0, 0.44, 0], 1.02, 0.2, 'linen', { seg: 48 });
    S.cyl([0, 0.565, 0.05], 1.0, 0.06, 'duvet', { seg: 48 });
    for (const z of [-0.35, 0.35]) S.box([-0.72, 0.66, z], [0.18, 0.4, 0.6], 'linen', { bev: 0.07, rot: [0, 0, 0.5] });
    S.box([-0.6, 0.66, 0], [0.14, 0.32, 0.45], 'pillow', { bev: 0.06, rot: [0, 0, 0.4] });
  });
  for (const py of [437, 673]) A(S, 450, py, 0, () => K.sideTable(S, { m: 'brass', h: 0.5, r: 0.2 }));
  A(S, 488, 800, FACE.N, () => K.wardrobe(S, { w: 2.36, h: 2.45, d: 0.58, m: 'midnight', fluted: true, front: 'tealLac', handle: 'brass' }));
  // prayer niche: arched alcove with the songket pucuk rebung panel
  A(S, 660, 800, FACE.N, () => {
    S.bb('wall', -0.42, 0, 0, 0.42, 2.65, 0.1);
    S.bb(art(S, { k: 'songket', bg: '#033a4e' }), -0.32, 0.4, 0.1, 0.32, 1.7, 0.104);
    S.cyl([0, 1.7, 0.102], 0.32, 0.004, art(S, { k: 'songket', bg: '#033a4e' }), { rot: [Math.PI / 2, 0, 0], seg: 32 });
    S.bb('brass', -0.34, 0.38, 0.1, 0.34, 0.4, 0.13);
  });
  S.at(mx(660), 0, mz(750), FACE.E - 0.4, () => S.bb('sejadah', -0.36, 0.002, -0.55, 0.36, 0.014, 0.55));
  A(S, 485, 416, FACE.S, () => K.curtains(S, 1.9, { m: 'sheer', h: 2.5 }));
  S.light('point', [mx(505), 2.2, mz(560)], { c: '#ffd7a0', i: 1.8, d: 4, night: true });
  S.light('point', [mx(450), 0.8, mz(437)], { c: '#ffd29a', i: 0.6, d: 2, night: true });
  S.light('point', [mx(450), 0.8, mz(673)], { c: '#ffd29a', i: 0.6, d: 2, night: true });
  K.cat(S, mx(560), 0.6, mz(520), 'cat3', 0.5);

  // ---------------- baths ----------------
  tileRoom(S, 'nightTile', 'ivoryTile', 523, 812, 724, 965, { doors: [[600, 680]], wins: [[600, 668]], shower: 595 });
  A(S, 724, 862, FACE.W, () => K.vanity(S, { w: 0.8, body: 'midnight', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass', led: 'led' }));
  A(S, 724, 925, FACE.W, () => K.toilet(S));
  K.showerScreen(S, mx(595), mz(860), mx(597), mz(965), { frame: 'brass' });
  K.rainShower(S, mx(555), mz(900), { m: 'brass' });
  S.light('point', [mx(640), 2.3, mz(890)], { i: 1.6, d: 3, night: true });
  tileRoom(S, 'blushZel', 'ivoryTile', 734, 812, 895, 965, { doors: [[808, 895]], wins: [[745, 795]] });
  A(S, 734, 860, FACE.E, () => K.vanity(S, { w: 0.65, body: 'midnight', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass' }));
  A(S, 852, 965, FACE.N, () => K.toilet(S));
  K.showerScreen(S, mx(734), mz(893), mx(800), mz(895), { frame: 'brass' });
  K.rainShower(S, mx(765), mz(935), { m: 'brass' });
  S.light('point', [mx(815), 2.3, mz(890)], { i: 1.6, d: 3, night: true });

  A(S, 1500, 965, FACE.W, () => K.shelving(S, { w: 1.9, h: 2.2, d: 0.4, m: 'white', rows: 4, fill: false }));

  labels(S, [['Vega & Altair suite', 500, 600], ['Player Two', 780, 560], ['Stargazing deck', 1050, 540], ['The Crossing', 1080, 722], ['Living', 1380, 640],
    ['Yakiniku table', 1095, 885], ['Kitchen', 1095, 1080], ['Yard', 945, 1080], ['Bath', 620, 890], ['Bath', 815, 890], ['Shelter', 1445, 960], ['Departures', 1285, 1010]]);

  S.view('Front door', [mx(1325), 1.6, mz(1052)], [mx(1110), 1.4, mz(722)], 'Departures board, flight path overhead');
  S.view('The Crossing', [mx(1215), 1.6, mz(795)], [mx(1090), 1.05, mz(722)], 'Titanic island; the iceberg misses');
  S.view('Stargazing deck', [mx(960), 1.6 + DECK, mz(470)], [mx(1150), 1.0, mz(735)], 'Teak deck, telescope, egg chair');
  S.view('Sunset wall', [mx(1218), 1.6, mz(700)], [mx(1505), 1.3, mz(682)], 'Kallang at golden hour, cat highway');
  S.view('Yakiniku table', [mx(1230), 1.6, mz(930)], [mx(1095), 0.8, mz(885)], 'Grill built into the table');
  S.view('Player Two', [mx(860), 1.6, mz(730)], [mx(760), 1.0, mz(520)], 'His and hers rigs, floor is lava');
  S.view('Vega & Altair suite', [mx(625), 1.6, mz(688)], [mx(450), 1.5, mz(540)], 'Round bed under the Summer Triangle');
  S.view('Sort of Us', [mx(800), 1.6, mz(730)], [mx(800), 1.2, mz(800)], 'Water-sort tubes in the corridor');
  return S.toJSON();
}
