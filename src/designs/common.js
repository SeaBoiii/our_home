// Shared materials and helpers for the three designs.
import { mx, mz } from '../core.js';

export const P = (px, py) => [mx(px), mz(py)];
export { mx, mz };

// Generic materials used by the kit and the shell. Designs override by name.
const DEFAULTS = {
  wall: { c: '#f3efe7', r: 0.92 },
  ceil: { c: '#f7f5f0', r: 0.95 },
  shelter: { c: '#ece8e0', r: 0.92 },
  frame: { c: '#3c3f42', r: 0.45, m: 0.5 },
  glass: { c: '#d6ecf2', o: 0.07, r: 0.02, glass: true, env: 0.7 },
  glassClear: { c: '#f2f8f8', o: 0.045, r: 0.02, glass: true, env: 0.45 },
  glassDark: { c: '#0e1114', r: 0.1, m: 0.3 },
  glassFluted: { c: '#e8eef0', o: 0.55, r: 0.25, glass: true, tex: { k: 'stripes', vertical: true, n: 16, cols: ['#f4f8f9', '#d8e2e5'] }, ts: 0.3 },
  sill: { c: '#d6d0c6', r: 0.4 },
  door: { c: '#efe9df', r: 0.6 },
  doorFrame: { c: '#efe9df', r: 0.6 },
  handle: { c: '#b9b9b9', r: 0.3, m: 0.9 },
  steel: { c: '#8f9396', r: 0.5, m: 0.6 },
  mainDoor: { c: '#6a4a32', r: 0.5, tex: { k: 'grain', vertical: true }, ts: 1.2 },
  exterior: { c: '#d8d4cc', r: 0.95 },
  white: { c: '#f4f2ee', r: 0.5 },
  black: { c: '#17181a', r: 0.45 },
  chrome: { c: '#dcdfe2', r: 0.15, m: 1 },
  brass: { c: '#c9a25a', r: 0.28, m: 1 },
  steelDark: { c: '#55595d', r: 0.35, m: 0.8 },
  vent: { c: '#c9c9c9', r: 0.6 },
  screen: { c: '#0a0c10', r: 0.12, e: '#1d2f45', ei: 0.25, ein: 0.6 },
  lamp: { c: '#fff6e5', e: '#ffe2b0', ei: 0.5, ein: 3 },
  led: { c: '#ffe7c0', e: '#ffd99a', ei: 1.2, ein: 3.2 },
  ceramic: { c: '#f6f5f2', r: 0.12 },
  water: { c: '#b7d3dc', r: 0.05, o: 0.55 },
  mirror: { c: '#e4eaee', r: 0.02, m: 1 },
  stone: { c: '#ebe7e0', r: 0.3, tex: 'marble', ts: 1.4 },
  paper: { c: '#f8f3ea', r: 0.9 },
  soil: { c: '#3b2a1e', r: 1 },
  bark: { c: '#5a4632', r: 0.9 },
  leaf: { c: '#3d6b39', r: 0.55, ds: true },
  leaf2: { c: '#5a8b47', r: 0.55, ds: true },
  pot: { c: '#d8cfc2', r: 0.8 },
  shade: { c: '#f3e9d6', r: 0.9, e: '#ffd9a0', ei: 0, ein: 0.8 },
  rgb: { c: '#7a5cff', e: '#7a5cff', ei: 1.2, ein: 2.4 },
  towel: { c: '#efe7da', r: 1, tex: 'fabric', ts: 0.3 },
  sisal: { c: '#c8a97a', r: 1, tex: 'rattan', ts: 0.08 },
  sejadah: { c: '#6e2133', r: 0.9, tex: { k: 'songket', bg: '#6e2133', fg: '#d9b472' }, ts: 0.5 },
  ice: { c: '#e2f3fb', r: 0.12, o: 0.82, glass: true, env: 2 },
  cab: { c: '#f0ece4', r: 0.5 },
  linen: { c: '#f7f4ee', r: 0.9, tex: 'fabric', ts: 0.4 },
  duvet: { c: '#efe8dc', r: 0.95, tex: 'fabric', ts: 0.4 },
  pillow: { c: '#e9dfcf', r: 0.95, tex: 'fabric', ts: 0.3 },
  pillow2: { c: '#d9b472', r: 0.95, tex: 'fabric', ts: 0.3 },
  fabric: { c: '#d8d0c3', r: 0.95, tex: 'fabric', ts: 0.4 },
  fabric2: { c: '#b9a68a', r: 0.95, tex: 'boucle', ts: 0.3 },
  fabric3: { c: '#45484c', r: 0.95, tex: 'fabric', ts: 0.3 },
  wood: { c: '#b58a5c', r: 0.55, tex: 'grain', ts: 1.0 },
  wood2: { c: '#7a5338', r: 0.5, tex: 'grain', ts: 1.0 },
  rattan: { c: '#c7a670', r: 0.8, tex: 'rattan', ts: 0.15 },
  book1: { c: '#033a4e', r: 0.8 },
  book2: { c: '#d9b472', r: 0.7 },
  book3: { c: '#efe6d6', r: 0.8 },
  book4: { c: '#173d35', r: 0.8 },
  book5: { c: '#8a3b2e', r: 0.8 },
  cat1: { c: '#e8e2d8', r: 1 },
  cat2: { c: '#6b6460', r: 1 },
  cat3: { c: '#c98a4a', r: 1 },
  ext_unit: { c: '#d9d9d6', r: 0.6 },
};

export function mats(S, over = {}) {
  for (const [k, v] of Object.entries(DEFAULTS)) S.mat(k, over[k] ? { ...v, ...over[k] } : v);
  for (const [k, v] of Object.entries(over)) if (!DEFAULTS[k]) S.mat(k, v);
}

// One-off art material (canvas recipe) for frames and panels. Numbered per
// spec so names match however many times a design is built.
export function art(S, tex, o = {}) {
  S.artN = (S.artN || 0) + 1;
  const name = `art_${S.artN}`;
  S.mat(name, { c: '#ffffff', r: o.r ?? 0.7, tex, ...o });
  return name;
}

// Room labels for the dollhouse view.
export function labels(S, list) {
  for (const [text, px, py] of list) S.label(text, [mx(px), 1.5, mz(py)]);
}
