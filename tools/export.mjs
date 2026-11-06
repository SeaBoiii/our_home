// Writes each design's scene spec to build/<id>.json for the Blender builder,
// plus build/designs_meta.json (sun direction and colour per design).
//   node tools/export.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { DESIGNS } from '../src/designs.js';

const out = new URL('../build/', import.meta.url);
mkdirSync(out, { recursive: true });
const meta = {};
DESIGNS.forEach((d, i) => {
  const spec = d.build();
  const id = spec.meta.design;
  writeFileSync(new URL(`${id}.json`, out), JSON.stringify(spec));
  meta[id] = { name: d.name, sun: d.sun, sunColor: d.sunColor };
  console.log(i + 1, d.name, spec.items.length, 'items');
});
writeFileSync(new URL('designs_meta.json', out), JSON.stringify(meta, null, 2));
