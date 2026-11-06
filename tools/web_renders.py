"""Converts the Blender PNG renders into web-sized JPEGs for the walkthrough's
gallery (renders/png/<id>_<view>.png -> renders/<id>_<view>.jpg)."""
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = ROOT / 'renders' / 'png'
out = ROOT / 'renders'
for png in sorted(src.glob('d[0-9]_*.png')):
    im = Image.open(png).convert('RGB')
    im.thumbnail((1600, 1000))
    im.save(out / f'{png.stem}.jpg', quality=82, optimize=True, progressive=True)
    print(png.stem)
