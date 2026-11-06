# Our Home

A walkable 3D mock-up of our Bayshore Oasis 4-room flat (90 m²), in four designs, with the LEGO Titanic (10294) as the centrepiece of each.

| | Design | Layout |
|---|---|---|
| 1 | **Field Notes**: warm ivory, oak, forest green; the Titanic on a navy console facing the front door | Exactly as HDB built it |
| 2 | **White Star**: 1912 ocean-liner deco; bookcase door into The Bridge mancave; the Titanic in a glass opening seen from two rooms | Bedroom 2 merged into the master, bigger master bath with a tub, bedroom 3 becomes the mancave |
| 3 | **Summer Triangle**: star ceilings, a teak stargazing deck, the Titanic on its own island, yakiniku table | Bedroom 3 removed, bedroom 2 behind glass |
| 4 | **Shoreline**: calm sandy beach house; the Titanic at the front door; island instead of a dining table; TV wall with surround sound and a cat playground; cove lighting | Master and bedroom 2 merged into one room to sleep, work and pray; bathrooms untouched; bedroom 3 kept for a future child |

Live: **https://seaboiii.github.io/our_home/** (GitHub Pages serves this folder as it is; there is no build step).

## Walk through it

```bash
python tools/serve.py
```

Open http://127.0.0.1:8765. Click to look around, `W A S D` to walk, `Shift` to run, `F` to use the secret bookcase in design 2, `N` for night, `1` to `4` to switch designs, **Dollhouse** for the overview. On a phone: left thumbstick to walk, drag to look.

## Blender

The same scene description drives Blender, so the renders match the walkthrough.

1. `node tools/export.mjs` writes `build/d1.json` to `d4.json`.
2. Canvas textures (wood, herringbone, art, the star ceiling) are exported from the running page into `build/tex/` (run `await __home.textures(i)` in the browser console; `tools/serve.py` accepts them at `/tex`).
3. Build and render:

```bash
blender -b --factory-startup -P tools/blender_build.py -- build/d1.json --render
```

That saves `blender/d1.blend` (textures packed; open it, pick a camera from the Cameras collection, or press Shift and the backtick key in the viewport to walk around) and renders every tour view plus a top-down plan into `renders/png/`. Add `--night` for night renders, then run `python tools/web_renders.py` to make the JPEGs the page's Renders gallery shows (`renders/*.jpg`).

## Layout

- `src/core.js`: the scene spec (boxes, cylinders, prisms, lights, cameras), shared by both renderers
- `src/plan.js`: walls, windows, doors and floors traced from `bayshore_oasis_4rm.jpg` at 1.12 cm per plan pixel
- `src/kit.js`, `src/titanic.js`: furniture, joinery, cats, and the Titanic (1.35 m, real-ship proportions)
- `src/designs/`: the three designs
- `src/app.js`, `index.html`: the walkthrough (Three.js, loaded from jsDelivr)
- `tools/artifact_page.py`: writes the same page without its HTML skeleton, for publishing as a claude.ai artifact

Wall changes in designs 2 and 3 need an HDB permit and an HDB-registered contractor; the household shelter cannot be altered. The prayer corners assume the top of the plan faces north, so check the qibla on site.
