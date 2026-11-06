// Design 1 — Field Notes. The HDB layout exactly as built; furniture,
// carpentry and lighting only.
import { Spec, mx, mz } from '../core.js';
import { baseWalls, baseFloors, buildShell } from '../plan.js';
import * as K from '../kit.js';
import { titanicMats, vitrine } from '../titanic.js';
import { mats, art, labels } from './common.js';

const { FACE } = K;
const A = (S, px, py, ry, fn, y = 0) => S.atPx(px, py, ry, fn, y);

export function build() {
  const S = new Spec({ design: 'd1' });
  mats(S, {
    wall: { c: '#f3eee4', r: 0.93 },
    door: { c: '#efe8dc', r: 0.55 },
    doorFrame: { c: '#efe8dc', r: 0.55 },
    handle: { c: '#c9a25a', r: 0.3, m: 1 },
    mainDoor: { c: '#173d35', r: 0.45 },
    wood: { c: '#c49a6c', r: 0.55, tex: 'grain', ts: 1.0 },
    wood2: { c: '#8c6440', r: 0.5, tex: 'grain', ts: 1.0 },
    fabric: { c: '#e4d9c7', r: 0.97, tex: 'boucle', ts: 0.35 },
    fabric2: { c: '#264d40', r: 0.8, tex: 'fabric', ts: 0.3, cc: 0 },
    fabric3: { c: '#3b4a45', r: 0.95, tex: 'fabric', ts: 0.3 },
    pillow: { c: '#d9b472', r: 0.95, tex: 'fabric', ts: 0.3 },
    pillow2: { c: '#efe6d6', r: 0.95, tex: 'boucle', ts: 0.3 },
    cab: { c: '#f0ebe1', r: 0.55 },
    stone: { c: '#efebe4', r: 0.28, tex: { k: 'marble', vein: 'rgba(140,130,115,0.5)' }, ts: 1.6 },
    shade: { c: '#f2e6cf', r: 0.9, e: '#ffd9a0', ei: 0, ein: 0.8 },
  });
  titanicMats(S);
  S.mat('oakFloor', { c: '#caa67a', r: 0.62, tex: { k: 'wood', planks: 4 }, ts: 1.15 });
  S.mat('terrazzo', { c: '#ece6db', r: 0.45, tex: { k: 'terrazzo', chips: ['#c9b8a4', '#8f9f8a', '#e9e2d6', '#c58b5a', '#173d35'] }, ts: 0.9 });
  S.mat('bathFloor', { c: '#e8e2d7', r: 0.4, tex: { k: 'terrazzo', chips: ['#cfc4b4', '#6f8a7a', '#f2ede4'] }, ts: 0.8 });
  S.mat('green', { c: '#173d35', r: 0.5 });
  S.mat('greenTile', { c: '#1e4a3f', r: 0.25, tex: { k: 'tile', n: 8, m: 8, c: '#1e4a3f', cols: ['#1e4a3f', '#24584a', '#1a4237'], grout: '#d9d2c4', zellige: true, vary: 0.12 }, ts: 0.6, bump: 0.02 });
  S.mat('ivoryTile', { c: '#f1ece2', r: 0.3, tex: { k: 'tile', n: 4, m: 8, c: '#f1ece2', grout: '#d8d0c2' }, ts: 0.6 });
  S.mat('blushTile', { c: '#efc9c9', r: 0.3, tex: { k: 'tile', n: 8, m: 8, c: '#efc9c9', cols: ['#efc9c9', '#f2d2cf', '#eac0c0'], grout: '#efe6dc', zellige: true, vary: 0.08 }, ts: 0.6 });
  S.mat('navy', { c: '#033a4e', r: 0.55 });
  S.mat('navyWall', { c: '#063c50', r: 0.9 });
  S.mat('oak', { c: '#c99f70', r: 0.55, tex: { k: 'grain', vertical: true }, ts: 0.8 });
  S.mat('rugLiving', { c: '#e9dfcd', r: 1, tex: { k: 'stripes', n: 24, cols: ['#e9dfcd', '#e3d7c2', '#e9dfcd', '#d9b472'] }, ts: 1.2 });
  S.mat('rugBed', { c: '#ddd2bf', r: 1, tex: 'boucle', ts: 0.4 });
  S.mat('rugGame', { c: '#26453c', r: 1, tex: 'fabric', ts: 0.5 });
  S.mat('velvet', { c: '#1f4a3c', r: 0.7, tex: 'fabric', ts: 0.3 });
  S.mat('sanitiser', { c: '#e7f2ef', r: 0.1, o: 0.7, glass: true });
  S.mat('vinyl', { c: '#111111', r: 0.3 });
  S.mat('paddle1', { c: '#033a4e', r: 0.4 });
  S.mat('paddle2', { c: '#f4b6c2', r: 0.4 });
  S.mat('ball', { c: '#e9e15a', r: 0.6 });
  S.mat('lego1', { c: '#c4281b', r: 0.35 });
  S.mat('lego2', { c: '#f5cd2f', r: 0.35 });
  S.mat('lego3', { c: '#0d69ab', r: 0.35 });
  S.mat('lego4', { c: '#4b974a', r: 0.35 });

  buildShell(S, baseWalls(), baseFloors(), {
    wall: 'wall', glass: 'glass', frame: 'frame', sill: 'stone', ceil: 'ceil', door: 'door', doorFrame: 'doorFrame',
    handle: 'handle', mainDoor: 'mainDoor', steel: 'steel', shelter: 'shelter', exterior: 'exterior',
    floors: { default: 'oakFloor', foyer: 'terrazzo', kitchen: 'terrazzo', yard: 'terrazzo', bath1: 'bathFloor', bath2: 'bathFloor', shelter: 'terrazzo' },
  });

  // ---------------- foyer ----------------
  A(S, 1206, 1005, FACE.E, () => {
    K.shoeCabinet(S, { w: 1.0, h: 1.0, d: 0.36, m: 'oak', float: true, cane: 'rattan', top: 'stone', led: true });
    S.cyl([0.3, 1.02 + 0.07, 0.2], 0.03, 0.14, 'sanitiser', { seg: 12 }); // the hand sanitiser, always within reach
    S.cyl([0.3, 1.02 + 0.155, 0.2], 0.012, 0.03, 'white', { seg: 8 });
    S.cyl([-0.2, 1.03, 0.18], 0.12, 0.015, 'brass', { seg: 24 });
    S.at(0, 1.62, 0, 0, () => {
      S.cyl([0, 0, 0.012], 0.26, 0.024, 'brass', { rot: [Math.PI / 2, 0, 0], seg: 40 });
      S.cyl([0, 0, 0.026], 0.245, 0.004, 'mirror', { rot: [Math.PI / 2, 0, 0], seg: 40 });
    });
  });
  A(S, 1360, 1022, FACE.W, () => S.at(0, 1.5, 0, 0, () => K.frame(S, 0.64, 0.26, art(S, { k: 'boarding' }), { frame: 'brass', mat: 0.02 })));
  K.downlights(S, [[mx(1290), mz(1010)]]);
  S.light('point', [mx(1290), 2.4, mz(1010)], { i: 2.5, d: 4, night: true });

  // ---------------- the Titanic console ----------------
  // Teal-navy fluted cabinet on the dining wall, facing the front door.
  A(S, 1100, 700, FACE.S, () => {
    S.bb('navyWall', -1.0, 0, 0, 1.0, 2.65, 0.008);
    K.console_(S, { w: 1.86, d: 0.46, h: 0.86, m: 'navy', fluted: true, doors: 4, handle: 'brass', top: 'oak' });
    vitrine(S, { L: 1.62, W: 0.42, H: 0.62, y0: 0.885, inset: 0.02, frame: 'brass', glass: 'glassClear', deck: 'oak', li: 6 });
    // picture light and blueprint above
    S.at(0, 2.05, 0.01, 0, () => K.frame(S, 1.1, 0.55, art(S, { k: 'blueprint' }), { frame: 'brass', mat: 0.03 }));
    S.bb('brass', -0.35, 2.36, 0.01, 0.35, 2.4, 0.12);
    S.box([0, 2.37, 0.14], [0.7, 0.03, 0.05], 'lamp');
  });
  S.light('spot', [mx(1050), 2.6, mz(790)], { t: [mx(1070), 1.1, mz(722)], a: 0.38, pen: 0.7, i: 9, d: 6, c: '#fff0d8' });
  S.light('spot', [mx(1150), 2.6, mz(790)], { t: [mx(1130), 1.1, mz(722)], a: 0.38, pen: 0.7, i: 9, d: 6, c: '#fff0d8' });
  K.downlights(S, [[mx(1050), mz(790)], [mx(1150), mz(790)]]);

  // ---------------- dining ----------------
  A(S, 1162, 882, FACE.E, () => {
    K.diningTable(S, { w: 1.6, d: 0.88, top: 'oak', leg: 'oak', pedestal: true });
    K.pendant(S, { shape: 'linear', len: 1.2, drop: 0.85, m: 'brass', i: 6 });
    S.cyl([0, 0.8, 0], 0.13, 0.08, 'ceramic', { rb: 0.09, seg: 24 });
    for (let i = 0; i < 5; i++) S.sph([Math.cos(i) * 0.06, 0.86, Math.sin(i) * 0.06], 0.035, i % 2 ? 'leaf' : 'leaf2');
  });
  for (const py of [838, 882, 926]) {
    A(S, 1112, py, FACE.E, () => K.chair(S, { m: 'oak', style: 'cane', seat: 'fabric' }));
    A(S, 1212, py, FACE.W, () => K.chair(S, { m: 'oak', style: 'cane', seat: 'fabric' }));
  }
  A(S, 945, 840, FACE.E, () => K.fridge(S, { w: 0.78, m: 'steel' }));
  A(S, 945, 912, FACE.E, () => K.ovenTower(S, { w: 0.58, h: 2.3, body: 'green' }));
  A(S, 945, 800, FACE.E, () => S.bb('green', -0.05, 1.9, 0, 0.05, 2.65, 0.6));

  // ---------------- kitchen ----------------
  A(S, 1180, 952, FACE.W, () => {
    K.baseRun(S, 2.5, { body: 'green', top: 'stone', handle: 'brass', splash: 'ivoryTile' });
    K.hob(S, 1.45, { hood: 'oak' });
    K.wallRun(S, 0.9, { body: 'cab', front: 'cab', y0: 1.55, led: 'led' });
    S.at(2.0, 0, 0, 0, () => K.wallRun(S, 0.5, { body: 'cab', front: 'cab', y0: 1.55 }));
    for (let i = 0; i < 3; i++) S.cyl([0.2 + i * 0.12, 0.98, 0.2], 0.04, 0.16, i % 2 ? 'brass' : 'ceramic', { seg: 16 });
  });
  A(S, 1126, 1180, FACE.N, () => {
    K.baseRun(S, 1.18, { body: 'green', top: 'stone', handle: 'brass', splash: 'ivoryTile' });
    K.sink(S, 0.6, { tap: 'brass' });
    for (const y of [1.65, 2.05]) S.bb('oak', 0, y, 0, 1.18, y + 0.035, 0.28);
    const R = K.rng(4);
    for (let i = 0; i < 7; i++) S.cyl([0.1 + i * 0.15, 1.7 + 0.06, 0.14], 0.045 + R() * 0.02, 0.12, ['ceramic', 'green', 'brass', 'paper'][i % 4], { seg: 14 });
    for (let i = 0; i < 5; i++) S.cyl([0.15 + i * 0.2, 2.1 + 0.08, 0.14], 0.05, 0.16, i % 2 ? 'glassClear' : 'ceramic', { seg: 14 });
  });
  K.downlights(S, [[mx(1095), mz(1010)], [mx(1095), mz(1110)]]);
  S.light('point', [mx(1095), 2.3, mz(1060)], { i: 3, d: 4.5, night: true });

  // ---------------- service yard ----------------
  A(S, 1003, 1018, FACE.W, () => K.washerStack(S));
  A(S, 940, 1180, FACE.N, () => { K.litterBox(S); S.bb('oak', -0.55, 1.5, 0, 0.55, 1.53, 0.3); });
  A(S, 882, 1080, FACE.E, () => S.bb('white', -0.4, 1.2, 0, 0.4, 1.22, 0.25));

  // ---------------- living ----------------
  // TV wall: oak battens, floating console
  A(S, 1190, 609, FACE.E, () => {
    K.slats(S, 'oak', -0.88, 0, 0.88, 2.65, { back: 'wood2', pitch: 0.055, w: 0.03 });
    S.at(0, 0, 0.04, 0, () => {
      K.tv(S, { w: 1.45, y: 1.25 });
      K.console_(S, { w: 1.7, d: 0.4, h: 0.36, float: true, m: 'green', top: 'oak', doors: 3, led: 'led' });
    });
  });
  A(S, 1505, 692, FACE.W, () => {
    K.lsofa(S, { w: 2.8, d: 0.95, chaise: 1.65, m: 'fabric', cush: 'fabric', leg: 'oak', pillows: ['pillow', 'pillow2', 'velvet', 'pillow'] });
    S.at(0, 1.6, 0, 0, () => K.frame(S, 1.6, 0.8, art(S, { k: 'sunset' }), { frame: 'oak', mat: 0.04 }));
  });
  A(S, 1322, 680, 0, () => { K.rug(S, 2.2, 2.7, 'rugLiving'); K.coffeeTable(S, { round: true, r: 0.45, top: 'oak', leg: 'oak', tiered: true }); });
  S.at(mx(1322), 0.42, mz(680), 0, () => { S.bb('paper', -0.12, 0, -0.08, 0.12, 0.04, 0.08); S.cyl([0.2, 0.07, 0.1], 0.05, 0.14, 'ceramic', { seg: 14 }); });
  A(S, 1300, 815, FACE.N, () => K.armchair(S, { m: 'velvet', leg: 'oak', pillow: 'pillow' }));
  A(S, 1478, 548, 0, () => K.plant(S, { kind: 'fig', h: 1.9, pot: 'terrazzo', seed: 3 }));
  A(S, 1228, 570, 0, () => K.catTree(S, { cat: 'cat1', h: 1.5, m: 'oak' }));
  K.cat(S, mx(1420), 0.44, mz(780), 'cat2', 0.8);
  A(S, 1480, 818, 0, () => K.floorLamp(S, { m: 'brass', i: 3 }));
  A(S, 1330, 533, FACE.S, () => K.curtains(S, 1.95, { m: 'sheerLinen', h: 2.5 }));
  A(S, 1458, 530, FACE.S, () => K.aircon(S, { y: 2.25 }));
  S.at(mx(1340), 0, mz(680), 0, () => K.ceilingFan(S, { m: 'white', blade: 'oak', light: true }));
  // our OST: the four songs on a picture ledge
  A(S, 1432, 835, FACE.N, () => {
    S.bb('oak', -0.68, 1.3, 0, 0.68, 1.33, 0.1);
    S.bb('oak', -0.68, 1.33, 0.08, 0.68, 1.37, 0.1);
    const ost = [['Love Story', "Taylor's Version", '#033a4e', '#f4b6c2'], ["It's You", 'HENRY', '#173d35', '#d9b472'], ["It's You", 'Sezairi', '#04121b', '#d9b472'], ['Cinta Luar Biasa', 'Andmesh', '#6e2133', '#efe6d6']];
    ost.forEach(([title, artist, a, b], i) => S.at(-0.5 + i * 0.335, 1.48, 0.05, 0, () => S.box([0, 0, 0], [0.3, 0.3, 0.01], art(S, { k: 'ost', title, artist, a, b }), { rot: [-0.08, 0, 0] })));
  });
  S.mat('sheerLinen', { c: '#f4efe6', r: 1, o: 0.72, glass: true, ds: true });
  K.downlights(S, [[mx(1240), mz(560)], [mx(1240), mz(800)], [mx(1460), mz(560)], [mx(1460), mz(800)]]);
  S.light('point', [mx(1330), 2.3, mz(760)], { i: 3, d: 5, night: true });

  // ---------------- corridor ----------------
  A(S, 778, 700, FACE.S, () => S.at(0, 1.5, 0, 0, () => K.frame(S, 0.45, 0.6, art(S, { k: 'monogram' }), { frame: 'brass' })));
  K.downlights(S, [[mx(800), mz(750)], [mx(950), mz(750)]]);
  S.light('point', [mx(880), 2.3, mz(750)], { i: 1.5, d: 4, night: true });

  // ---------------- master bedroom ----------------
  A(S, 378, 540, FACE.E, () => {
    K.bed(S, { w: 1.83, l: 2.05, frame: 'fabric', head: 'pillow2', headStyle: 'channel', hbW: 2.0, hbH: 1.2, duvet: 'linen', throw: 'velvet', pillow: 'linen', pillow2: 'pillow', cushion: 'velvet', leg: 'oak' });
    S.at(0, 1.78, 0, 0, () => K.frame(S, 1.2, 0.6, art(S, { k: 'sky' }), { frame: 'brass', mat: 0.02, mount: false }));
  });
  A(S, 378, 435, FACE.E, () => K.bedside(S, { m: 'oak', front: 'green', handle: 'brass' }));
  A(S, 378, 645, FACE.E, () => K.bedside(S, { m: 'oak', front: 'green', handle: 'brass' }));
  A(S, 480, 540, 0, () => K.rug(S, 2.3, 2.6, 'rugBed'));
  A(S, 488, 800, FACE.N, () => K.wardrobe(S, { w: 2.36, h: 2.45, d: 0.58, m: 'oak', fluted: true, handle: 'brass' }));
  A(S, 602, 413, FACE.S, () => K.dresser(S, { w: 0.72, m: 'oak', front: 'oak', mirror: true, stool: 'velvet' }));
  A(S, 485, 416, FACE.S, () => K.curtains(S, 1.9, { m: 'sheerLinen', h: 2.5 }));
  A(S, 640, 520, FACE.W, () => K.aircon(S, { y: 2.2 }));
  A(S, 600, 600, FACE.W, () => S.box([0, 0.22, 0], [0.4, 0.44, 1.2], 'fabric', { bev: 0.04 }));
  S.at(mx(505), 0, mz(560), 0, () => K.ceilingFan(S, { m: 'white', blade: 'oak', light: true }));
  K.cat(S, mx(470), 0.62, mz(590), 'cat3', 2.2);

  // ---------------- bedroom 2: the quiet room (prayer, reading, guests) ----------------
  // Qibla from Singapore is about 293 degrees; assuming the plan's top is north
  // the sejadah turns 23 degrees off the west wall.
  A(S, 648, 600, FACE.E, () => {
    K.console_(S, { w: 0.9, d: 0.32, h: 0.42, m: 'oak', front: 'oak', doors: 2, top: 'oak' });
    S.at(0, 1.55, 0, 0, () => K.frame(S, 0.55, 0.75, art(S, { k: 'songket', bg: '#173d35' }), { frame: 'brass', mat: 0.03 }));
    S.cyl([0.3, 0.47, 0.16], 0.04, 0.6, 'sejadah', { rot: [0, 0, Math.PI / 2] });
  });
  S.at(mx(720), 0, mz(586), FACE.E - 0.4, () => {
    S.bb('sejadah', -0.36, 0.002, -0.62, 0.36, 0.014, 0.62);
    S.bb('brass', -0.34, 0.014, -0.6, 0.34, 0.016, -0.56);
  });
  A(S, 906, 525, FACE.W, () => {
    K.sofa(S, { w: 1.95, d: 0.9, m: 'fabric', cush: 'linen', backH: 0.7, armH: 0.5, leg: 'oak', pillows: ['pillow', 'velvet'] });
    S.at(0, 1.55, 0, 0, () => K.frame(S, 1.0, 0.62, art(S, { k: 'mountains', caption: 'Kazakhstan, missing you', seed: 8 }), { frame: 'oak' }));
  });
  A(S, 730, 688, FACE.N, () => K.shelving(S, { w: 1.5, h: 2.1, d: 0.32, m: 'oak', rows: 5, seed: 12, objects: ['ceramic', 'brass', 'green'] }));
  A(S, 700, 455, -0.6, () => K.armchair(S, { m: 'velvet', leg: 'oak' }));
  A(S, 668, 435, 0, () => K.floorLamp(S, { m: 'brass', i: 2.5 }));
  A(S, 744, 416, FACE.S, () => K.blind(S, 1.4, 2.25, 'sheerLinen', { drop: 0.5 }));
  K.downlights(S, [[mx(780), mz(550)]]);

  // ---------------- bedroom 3: Player Two room ----------------
  // Two desks side by side under the window: his rig, her laptop (and a cat).
  A(S, 1050, 413, FACE.S, () => {
    K.desk(S, { w: 2.4, d: 0.7, m: 'oak', leg: 'green', mat: 'fabric3' });
    K.monitor(S, -0.6, 0.12, { w: 0.86, curved: true });
    K.keyboard(S, -0.65, 0.42);
    K.pcTower(S, -1.05, 0.15);
    S.bb('steelDark', 0.35, 0.745, 0.25, 0.7, 0.76, 0.48);
    S.box([0.525, 0.87, 0.25], [0.35, 0.23, 0.01], 'screen', { rot: [-0.25, 0, 0] });
    K.cat(S, 0.9, 0.745, 0.35, 'cat2', -0.4);
    S.cyl([1.05, 0.81, 0.15], 0.06, 0.12, 'ceramic', { seg: 14 });
    for (let i = 0; i < 5; i++) S.sph([1.05 + Math.cos(i * 1.3) * 0.05, 0.9 + i * 0.015, 0.15 + Math.sin(i * 1.3) * 0.05], 0.05, 'leaf2');
    K.tableLamp(S, 0.05, 0.745, 0.15, { lampBase: 'brass', shade: 'shade' });
  });
  A(S, 995, 495, FACE.N, () => K.officeChair(S, { gaming: true, fab: 'fabric3', accent: 'green' }));
  A(S, 1112, 495, FACE.N, () => K.officeChair(S, { fab: 'pillow2' }));
  A(S, 918, 560, FACE.E, () => K.shelving(S, { w: 2.3, h: 2.4, d: 0.34, m: 'oak', rows: 6, cols: 3, seed: 31, books: ['book1', 'book2', 'book4', 'lego1', 'lego2', 'lego3'], objects: ['lego1', 'lego2', 'lego3', 'lego4', 'ceramic'], back: 'green', led: 'led' }));
  A(S, 1180, 610, FACE.W, () => {
    K.sofa(S, { w: 1.6, d: 0.85, m: 'velvet', leg: 'oak', pillows: ['pillow2'] });
    // pickleball paddles
    for (const [i, m] of [[-1, 'paddle1'], [1, 'paddle2']]) S.at(i * 0.22, 1.45, 0.02, 0, () => {
      S.box([0, 0.08, 0], [0.2, 0.26, 0.015], m, { bev: 0.006 });
      S.box([0, -0.12, 0], [0.04, 0.14, 0.02], 'black', { bev: 0.006 });
    });
    S.sph([0, 1.35, 0.04], 0.037, 'ball');
    S.at(-0.55, 1.6, 0, 0, () => K.frame(S, 0.36, 0.45, art(S, { k: 'player2' }), { frame: 'black', mat: 0.02 }));
    S.at(0.55, 1.6, 0, 0, () => K.frame(S, 0.36, 0.45, art(S, { k: 'laps' }), { frame: 'black', mat: 0.02 }));
  });
  A(S, 1050, 600, 0, () => K.rug(S, 1.9, 1.3, 'rugGame'));
  A(S, 1080, 416, FACE.S, () => K.blind(S, 1.5, 2.25, 'sheerLinen', { drop: 0.45 }));
  A(S, 1178, 470, FACE.W, () => K.aircon(S, { y: 2.2, w: 0.8 }));
  K.downlights(S, [[mx(1050), mz(560)]]);
  S.light('point', [mx(1050), 2.3, mz(560)], { i: 2, d: 4, night: true });
  S.light('point', [mx(980), 1.2, mz(440)], { c: '#8f7bff', i: 0.2, d: 1.5 });

  // ---------------- master bath ----------------
  tileRoom(S, 'greenTile', 'ivoryTile', 523, 812, 724, 965, { doors: [[600, 680]], wins: [[600, 668]], shower: 595 });
  A(S, 724, 862, FACE.W, () => K.vanity(S, { w: 0.8, body: 'oak', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass' }));
  A(S, 724, 925, FACE.W, () => K.toilet(S));
  K.showerScreen(S, mx(595), mz(860), mx(597), mz(965));
  K.rainShower(S, mx(555), mz(900), { m: 'brass' });
  A(S, 523, 860, FACE.E, () => K.towelRail(S, { m: 'brass' }));
  S.light('point', [mx(640), 2.3, mz(890)], { i: 1.8, d: 3, night: true });
  K.downlights(S, [[mx(560), mz(900)], [mx(670), mz(880)]]);

  // ---------------- common bath ----------------
  tileRoom(S, 'blushTile', 'ivoryTile', 734, 812, 895, 965, { doors: [[808, 895]], wins: [[745, 795]] });
  A(S, 734, 860, FACE.E, () => K.vanity(S, { w: 0.65, body: 'oak', top: 'stone', roundMirror: true, mirrorFrame: 'brass', tap: 'brass' }));
  A(S, 852, 965, FACE.N, () => K.toilet(S));
  K.showerScreen(S, mx(734), mz(893), mx(800), mz(895));
  K.rainShower(S, mx(765), mz(935), { m: 'brass' });
  S.light('point', [mx(815), 2.3, mz(890)], { i: 1.6, d: 3, night: true });
  K.downlights(S, [[mx(815), mz(890)]]);

  // ---------------- shelter (storage) ----------------
  A(S, 1500, 965, FACE.W, () => K.shelving(S, { w: 1.9, h: 2.2, d: 0.4, m: 'white', rows: 4, fill: false }));

  labels(S, [['Master bedroom', 500, 600], ['Quiet room', 780, 560], ['Player Two room', 1050, 560], ['Living', 1340, 640], ['Dining', 1150, 860],
    ['Titanic', 1100, 730], ['Kitchen', 1095, 1080], ['Yard', 945, 1080], ['Bath', 620, 890], ['Bath', 815, 890], ['Shelter', 1445, 960], ['Foyer', 1285, 1010]]);

  S.view('Front door', [mx(1325), 1.6, mz(1052)], [mx(1100), 1.2, mz(720)], 'The first thing you see');
  S.view('The Titanic', [mx(1120), 1.6, mz(840)], [mx(1100), 1.1, mz(722)], 'Navy console, lit glass case');
  S.view('Living room', [mx(1230), 1.6, mz(790)], [mx(1470), 1.0, mz(620)], 'Sofa, sunset print, cat tree');
  S.view('Kitchen', [mx(1080), 1.6, mz(930)], [mx(1110), 1.0, mz(1160)], 'Forest green and marble');
  S.view('Master bedroom', [mx(622), 1.6, mz(688)], [mx(400), 1.15, mz(540)], 'Summer Triangle above the bed');
  S.view('Quiet room', [mx(820), 1.6, mz(650)], [mx(655), 0.9, mz(560)], 'Prayer corner and reading');
  S.view('Player Two room', [mx(960), 1.6, mz(670)], [mx(1110), 1.0, mz(450)], 'Two desks, one loveseat');
  S.view('Master bath', [mx(645), 1.6, mz(765)], [mx(600), 1.0, mz(930)], 'Green zellige, brass');
  return S.toJSON();
}

// Tiles the inside faces of a bathroom up to 2.4 m. doors: x-ranges left open
// on the north wall; wins: x-ranges on the south wall tiled only to the sill;
// shower: x of the shower screen, west of which the feature tile is used.
export function tileRoom(S, feature, plain, x0, y0, x1, y1, { doors = [], wins = [], shower = null, sill = 1.5 } = {}) {
  const h = 2.4, t = 0.008;
  const pick = (a) => (shower === null || a < shower ? feature : plain);
  const run = (gaps, z, hGap, flip) => {
    let cur = x0;
    for (const [a, b] of [...gaps, [x1, x1]]) {
      const cuts = shower !== null && shower > cur && shower < a ? [cur, shower, a] : [cur, a];
      for (let i = 0; i < cuts.length - 1; i++) if (cuts[i + 1] > cuts[i]) S.bb(pick(cuts[i]), mx(cuts[i]), 0, z - (flip ? t : 0), mx(cuts[i + 1]), h, z + (flip ? 0 : t));
      if (b > a && hGap > 0) S.bb(pick(a), mx(a), 0, z - (flip ? t : 0), mx(b), hGap, z + (flip ? 0 : t));
      cur = b;
    }
  };
  run(doors, mz(y0), 0, false);
  run(wins, mz(y1), sill, true);
  S.bb(shower !== null ? feature : feature, mx(x0), 0, mz(y0), mx(x0) + t, h, mz(y1));
  S.bb(shower !== null ? plain : feature, mx(x1) - t, 0, mz(y0), mx(x1), h, mz(y1));
}
