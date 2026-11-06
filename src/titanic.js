// LEGO Icons 10294 Titanic: 1.35 m long, 16 cm wide, 44 cm tall.
// Modelled along local x with the bow at +x and the keel resting on the
// display stands; real-ship proportions scaled 1:200.
import { rng } from './kit.js';

const HALF = [
  [-0.675, 0], [-0.672, 0.026], [-0.664, 0.042], [-0.648, 0.055], [-0.62, 0.064], [-0.57, 0.069], [-0.5, 0.07],
  [0.3, 0.07], [0.4, 0.067], [0.48, 0.058], [0.55, 0.045], [0.61, 0.03], [0.65, 0.016], [0.675, 0],
];

function hull(scaleZ = 1, x0 = -1, x1 = 1) {
  const prof = HALF.filter(([x]) => x >= x0 - 1e-6 && x <= x1 + 1e-6).map(([x, b]) => [x, b * scaleZ]);
  return prof.concat(prof.slice(1, -1).reverse().map(([x, b]) => [x, -b]));
}

export function titanicMats(S) {
  S.mat('t_red', { c: '#7e1d16', r: 0.45 });
  S.mat('t_black', { c: '#151515', r: 0.35 });
  S.mat('t_ports', { c: '#151515', r: 0.35, tex: 'portholes' });
  S.mat('t_white', { c: '#f1eee6', r: 0.4 });
  S.mat('t_windows', { c: '#f1eee6', r: 0.4, tex: 'superwindows' });
  S.mat('t_deck', { c: '#c9a774', r: 0.6, tex: 'deck' });
  S.mat('t_buff', { c: '#c58b38', r: 0.45 });
  S.mat('t_gold', { c: '#d9b04c', r: 0.35, m: 0.6 });
  S.mat('t_mast', { c: '#b88a4a', r: 0.5 });
  S.mat('t_wire', { c: '#2b2b2b', r: 0.6 });
  S.mat('t_boat', { c: '#f6f3ea', r: 0.4 });
  S.mat('t_stand', { c: '#0d0d0f', r: 0.3 });
  S.mat('t_plate', { c: '#0d0d0f', r: 0.3, tex: { k: 'text', text: 'TITANIC', sub: 'R.M.S. · 1912 · LEGO 10294', fg: '#d9b472', bg: '#0d0d0f' } });
  S.mat('t_glow', { c: '#ffd58a', e: '#ffcf7a', ei: 0.0, ein: 2.4 });
}

export function titanic(S, o = {}) {
  const lift = 0.055;
  // display stands and nameplate (the set's own stand)
  for (const x of [-0.33, 0.33]) {
    S.bb('t_stand', x - 0.05, 0, -0.07, x + 0.05, 0.012, 0.07);
    S.bb('t_stand', x - 0.012, 0.012, -0.03, x + 0.012, lift + 0.01, 0.03);
    S.bb('t_stand', x - 0.04, lift - 0.004, -0.045, x + 0.04, lift + 0.012, 0.045);
  }
  if (o.plate !== false) {
    S.bb('t_stand', -0.11, 0, 0.09, 0.11, 0.02, 0.15, { rot: [0, 0, 0] });
    S.box([0, 0.03, 0.125], [0.2, 0.05, 0.004], 't_plate', { rot: [-0.9, 0, 0] });
  }
  S.at(0, lift, 0, 0, () => {
    // underwater hull (narrower, so the sides tumble home), black topsides, gold line
    S.ext([0, 0, 0], hull(0.86, -0.665, 0.66), 0.035, 't_red');
    S.ext([0, 0.035, 0], hull(0.97), 0.018, 't_red');
    S.ext([0, 0.053, 0], hull(1), 0.052, 't_black');
    S.ext([0, 0.105, 0], hull(1.003), 0.002, 't_gold');
    // porthole strakes along the parallel midbody
    for (const sz of [-1, 1]) S.box([-0.08, 0.08, sz * 0.0705], [1.0, 0.036, 0.002], 't_ports');
    // forecastle and poop decks
    S.ext([0, 0.107, 0], hull(1, 0.4, 0.675), 0.016, 't_black');
    S.ext([0, 0.123, 0], hull(0.995, 0.4, 0.675), 0.003, 't_deck');
    S.ext([0, 0.107, 0], hull(1, -0.675, -0.5), 0.016, 't_black');
    S.ext([0, 0.123, 0], hull(0.995, -0.675, -0.5), 0.003, 't_deck');
    // well decks
    S.bb('t_deck', -0.5, 0.105, -0.068, 0.4, 0.108, 0.068);
    // B deck enclosure (white with windows), A deck, boat deck
    S.bb('t_windows', -0.44, 0.107, -0.068, 0.36, 0.13, 0.068);
    S.bb('t_windows', -0.4, 0.13, -0.064, 0.33, 0.15, 0.064);
    S.bb('t_deck', -0.41, 0.15, -0.066, 0.335, 0.153, 0.066);
    // deckhouses on the boat deck
    S.bb('t_windows', 0.16, 0.153, -0.042, 0.33, 0.172, 0.042);
    S.bb('t_windows', -0.36, 0.153, -0.03, 0.12, 0.168, 0.03);
    S.bb('t_white', 0.31, 0.15, -0.07, 0.335, 0.176, 0.07); // bridge front with wing cabs
    S.bb('t_white', 0.315, 0.176, -0.03, 0.33, 0.186, 0.03);
    S.bb('t_windows', -0.47, 0.123, -0.03, -0.41, 0.15, 0.03); // aft docking bridge area
    // funnels: buff with black tops, raked aft
    const fx = [0.23, 0.075, -0.08, -0.235];
    fx.forEach((x, i) => {
      S.at(x, 0.172, 0, 0, () => {
        S.cyl([0, 0.05, 0], 0.019, 0.1, 't_buff', { seg: 18, sc: [1.18, 1, 0.92], rot: [0, 0, 0.09] });
        S.cyl([-0.0026, 0.088 + 0.013, 0], 0.0195, 0.026, 't_black', { seg: 18, sc: [1.18, 1, 0.92], rot: [0, 0, 0.09] });
        if (i === 3) S.cyl([0.0, 0.0, 0], 0.012, 0.004, 't_black', { seg: 12 });
      });
    });
    // masts and rigging
    const fore = [0.47, 0.123, 0], foreTop = [0.455, 0.345, 0];
    const main = [-0.47, 0.123, 0], mainTop = [-0.485, 0.32, 0];
    S.rod(fore, foreTop, 0.0035, 't_mast');
    S.rod(main, mainTop, 0.0035, 't_mast');
    S.box([0.462, 0.23, 0], [0.012, 0.008, 0.012], 't_white');
    S.rod(foreTop, mainTop, 0.0007, 't_wire');
    S.rod(foreTop, [0.675, 0.125, 0], 0.0008, 't_wire');
    S.rod(mainTop, [-0.675, 0.125, 0], 0.0008, 't_wire');
    for (const sz of [-1, 1]) {
      S.rod(foreTop, [0.43, 0.125, sz * 0.06], 0.0006, 't_wire');
      S.rod(mainTop, [-0.45, 0.125, sz * 0.06], 0.0006, 't_wire');
      for (const x of fx) S.rod([x - 0.01, 0.27, 0], [x - 0.03, 0.155, sz * 0.05], 0.0005, 't_wire');
    }
    // lifeboats in their davits, two groups each side
    const boats = [0.29, 0.245, 0.2, 0.155, -0.2, -0.245, -0.29, -0.335];
    for (const sz of [-1, 1]) for (const x of boats) {
      S.bb('t_boat', x - 0.019, 0.156, sz * 0.058 - 0.0055, x + 0.019, 0.166, sz * 0.058 + 0.0055, { bev: 0.003 });
      S.bb('t_deck', x - 0.016, 0.1662, sz * 0.058 - 0.0035, x + 0.016, 0.1668, sz * 0.058 + 0.0035);
      S.rod([x - 0.02, 0.153, sz * 0.064], [x - 0.02, 0.175, sz * 0.058], 0.0009, 't_wire');
      S.rod([x + 0.02, 0.153, sz * 0.064], [x + 0.02, 0.175, sz * 0.058], 0.0009, 't_wire');
    }
    // cargo cranes and the anchor
    for (const x of [0.43, 0.38, -0.46, -0.52]) S.rod([x, 0.107, 0], [x + 0.012, 0.15, 0], 0.0018, 't_black');
    for (const sz of [-1, 1]) S.bb('t_gold', 0.6, 0.085, sz * 0.031 - 0.001, 0.612, 0.097, sz * 0.031 + 0.001);
    // night-time glow from the portholes
    for (const sz of [-1, 1]) S.box([-0.08, 0.08, sz * 0.0712], [1.0, 0.004, 0.0006], 't_glow');
  });
}

// Museum vitrine around the ship. Local frame: centred on x, back at z = 0
// unless o.free, in which case it is centred. Base top at y = o.baseH.
export function vitrine(S, o = {}) {
  const L = o.L ?? 1.62, W = o.W ?? 0.42, Hc = o.H ?? 0.6, y0 = o.y0 ?? 0.95;
  const zc = o.free ? 0 : W / 2 + (o.inset ?? 0.04);
  const glass = o.glass ?? 'glassClear', fr = o.frame ?? 'brass';
  S.at(0, y0, zc, 0, () => {
    S.bb(o.deck ?? 'black', -L / 2, 0, -W / 2, L / 2, 0.03, W / 2);
    if (o.sea) S.bb(o.sea, -L / 2 + 0.02, 0.03, -W / 2 + 0.02, L / 2 - 0.02, 0.034, W / 2 - 0.02);
    titanic(S, { plate: o.plate });
    // glass box with fine metal edges
    S.bb(glass, -L / 2, 0.03, W / 2 - 0.004, L / 2, Hc, W / 2, { col: true });
    S.bb(glass, -L / 2, 0.03, -W / 2, L / 2, Hc, -W / 2 + 0.004);
    S.bb(glass, -L / 2, 0.03, -W / 2, -L / 2 + 0.004, Hc, W / 2);
    S.bb(glass, L / 2 - 0.004, 0.03, -W / 2, L / 2, Hc, W / 2);
    S.bb(glass, -L / 2, Hc - 0.004, -W / 2, L / 2, Hc, W / 2);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) S.bb(fr, sx * L / 2 - 0.006, 0.03, sz * W / 2 - 0.006, sx * L / 2 + 0.006, Hc, sz * W / 2 + 0.006);
    for (const y of [0.03, Hc]) for (const sz of [-1, 1]) S.bb(fr, -L / 2, y - 0.006, sz * W / 2 - 0.006, L / 2, y + 0.006, sz * W / 2 + 0.006);
    for (const y of [0.03, Hc]) for (const sx of [-1, 1]) S.bb(fr, sx * L / 2 - 0.006, y - 0.006, -W / 2, sx * L / 2 + 0.006, y + 0.006, W / 2);
    if (o.lid !== false) {
      S.bb(o.lidMat ?? fr, -L / 2 - 0.01, Hc, -W / 2 - 0.01, L / 2 + 0.01, Hc + 0.05, W / 2 + 0.01);
      S.bb('led', -L / 2 + 0.03, Hc - 0.003, -W / 2 + 0.05, L / 2 - 0.03, Hc - 0.001, W / 2 - 0.05);
    }
    S.light('rect', [0, Hc - 0.01, 0], { w: L - 0.1, h: W - 0.1, rot: [-Math.PI / 2, 0, 0], c: '#fff1d6', i: o.li ?? 5 });
  });
}

// Frosted acrylic iceberg sculpture. Seeded so every render matches.
export function iceberg(S, o = {}) {
  const R = rng(o.seed ?? 1912), m = o.m ?? 'ice', s = o.s ?? 1;
  for (let i = 0; i < 9; i++) {
    const h = (0.25 + R() * 0.5) * s, w = (0.12 + R() * 0.18) * s;
    const x = (R() - 0.5) * 0.35 * s, z = (R() - 0.5) * 0.25 * s;
    S.box([x, h / 2, z], [w, h, w * (0.7 + R() * 0.5)], m, { rot: [(R() - 0.5) * 0.3, R() * Math.PI, (R() - 0.5) * 0.3] });
  }
  S.box([0, 0.55 * s, 0], [0.14 * s, 0.35 * s, 0.12 * s], m, { rot: [0.2, 0.7, -0.15] });
}
