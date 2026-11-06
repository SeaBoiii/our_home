"""Builds a .blend from a design's scene spec and renders its tour views.

    blender -b -P tools/blender_build.py -- build/d1.json [--render] [--views 0,1,2] [--samples 192]

Reads build/<id>.json (written by tools/export.mjs) and the canvas textures in
build/tex/<id>_<material>.png (exported from the walkthrough), saves
blender/<id>.blend with everything packed, and with --render writes
renders/png/<id>_<view>.png plus a top-down plan render
(tools/web_renders.py then makes the JPEGs the page shows).

The spec is Three.js space (y up, metres); everything is built there and
rotated into Blender space (z up) by one matrix at the end.
"""
import json
import math
import os
import sys

import bpy
from mathutils import Matrix, Quaternion, Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TO_BLENDER = Matrix.Rotation(math.radians(90), 4, 'X')  # (x, y, z) -> (x, -z, y)


def args():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    out = {'spec': argv[0], 'render': '--render' in argv, 'views': None, 'samples': 192, 'night': '--night' in argv}
    for i, a in enumerate(argv):
        if a == '--views':
            out['views'] = [int(v) for v in argv[i + 1].split(',')]
        if a == '--samples':
            out['samples'] = int(argv[i + 1])
    return out


# ---------------------------------------------------------------- geometry

class Bucket:
    """Accumulates vertices, faces and UVs for one merged object."""

    def __init__(self):
        self.verts, self.faces, self.uvs = [], [], []

    def add(self, verts, faces, uvs, M):
        base = len(self.verts)
        self.verts.extend((M @ Vector(v)).to_tuple() for v in verts)
        for f, uv in zip(faces, uvs):
            self.faces.append([base + i for i in f])
            self.uvs.append(uv)


def mat_of(it):
    p = Vector(it['p'])
    x, y, z, w = it['q']
    return Matrix.Translation(p) @ Quaternion((w, x, y, z)).to_matrix().to_4x4()


def box(it, ts):
    w, h, d = it['s']
    hx, hy, hz = w / 2, h / 2, d / 2
    faces, uvs, verts = [], [], []
    # each face: normal axis, sign, u axis, v axis (local coordinates)
    spec = [(0, 1, 2, 1), (0, -1, 2, 1), (1, 1, 0, 2), (1, -1, 0, 2), (2, 1, 0, 1), (2, -1, 0, 1)]
    half = (hx, hy, hz)
    for axis, sign, ua, va in spec:
        quad = []
        for su, sv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
            v = [0.0, 0.0, 0.0]
            v[axis] = sign * half[axis]
            v[ua] = su * half[ua]
            v[va] = sv * half[va]
            quad.append(v)
        if (sign > 0) if axis in (0, 1) else (sign < 0):  # keep outward winding
            quad = quad[::-1]
        n = len(verts)
        verts.extend(quad)
        faces.append([n, n + 1, n + 2, n + 3])
        if ts:
            uvs.append([((q[ua] + half[ua]) / ts, (q[va] + half[va]) / ts) for q in quad])
        else:
            uvs.append([((q[ua] + half[ua]) / (2 * half[ua] or 1), (q[va] + half[va]) / (2 * half[va] or 1)) for q in quad])
    return verts, faces, uvs


def cylinder(it, ts):
    r, rb, h, seg = it['r'], it.get('rb', it['r']), it['h'], it.get('seg', 20)
    verts, faces, uvs = [], [], []
    for i in range(seg):
        a = 2 * math.pi * i / seg
        verts.append((math.sin(a) * rb, -h / 2, math.cos(a) * rb))
        verts.append((math.sin(a) * r, h / 2, math.cos(a) * r))
    circ = 2 * math.pi * max(r, rb)
    for i in range(seg):
        j = (i + 1) % seg
        faces.append([2 * i, 2 * j, 2 * j + 1, 2 * i + 1])
        u0, u1 = (i / seg, (i + 1) / seg)
        if ts:
            uvs.append([(u0 * circ / ts, 0), (u1 * circ / ts, 0), (u1 * circ / ts, h / ts), (u0 * circ / ts, h / ts)])
        else:
            uvs.append([(u0, 0), (u1, 0), (u1, 1), (u0, 1)])
    for top in (0, 1):
        ring = [2 * i + top for i in range(seg)]
        faces.append(ring[::-1] if top == 0 else ring)
        rr = r if top else rb
        uvs.append([(0.5 + verts[k][0] / (2 * rr or 1), 0.5 + verts[k][2] / (2 * rr or 1)) for k in faces[-1]])
    return verts, faces, uvs


def sphere(it, us=18, vs=12):
    r = it['r']
    verts, faces, uvs = [], [], []
    for j in range(vs + 1):
        t = math.pi * j / vs
        for i in range(us):
            a = 2 * math.pi * i / us
            verts.append((r * math.sin(t) * math.sin(a), r * math.cos(t), r * math.sin(t) * math.cos(a)))
    for j in range(vs):
        for i in range(us):
            a, b = j * us + i, j * us + (i + 1) % us
            faces.append([a, a + us, b + us, b])
            uvs.append([(i / us, 1 - j / vs), (i / us, 1 - (j + 1) / vs), ((i + 1) / us, 1 - (j + 1) / vs), ((i + 1) / us, 1 - j / vs)])
    sc = it.get('sc')
    if sc:
        verts = [(v[0] * sc[0], v[1] * sc[1], v[2] * sc[2]) for v in verts]
    return verts, faces, uvs


def torus(it, us=28, vs=8):
    R, r = it['R'], it['r']
    verts, faces, uvs = [], [], []
    for i in range(us):
        u = 2 * math.pi * i / us
        for j in range(vs):
            v = 2 * math.pi * j / vs
            verts.append(((R + r * math.cos(v)) * math.cos(u), (R + r * math.cos(v)) * math.sin(u), r * math.sin(v)))
    for i in range(us):
        for j in range(vs):
            a, b = i * vs + j, ((i + 1) % us) * vs + j
            c, d = ((i + 1) % us) * vs + (j + 1) % vs, i * vs + (j + 1) % vs
            faces.append([a, b, c, d])
            uvs.append([(i / us, j / vs), ((i + 1) / us, j / vs), ((i + 1) / us, (j + 1) / vs), (i / us, (j + 1) / vs)])
    return verts, faces, uvs


def prism(it, ts):
    pts, h = it['pts'], it['h']
    n = len(pts)
    # orientation: make the bottom face point down
    area = sum(pts[i][0] * pts[(i + 1) % n][1] - pts[(i + 1) % n][0] * pts[i][1] for i in range(n))
    if area < 0:
        pts = pts[::-1]
    verts = [(x, 0.0, z) for x, z in pts] + [(x, h, z) for x, z in pts]
    s = ts or 1.0
    faces = [list(range(n)), list(range(2 * n - 1, n - 1, -1))]
    uvs = [[(x / s, z / s) for x, z in pts], [(pts[k - n][0] / s, pts[k - n][1] / s) for k in range(2 * n - 1, n - 1, -1)]]
    for i in range(n):
        j = (i + 1) % n
        faces.append([i, n + i, n + j, j])
        L = math.dist(pts[i], pts[j])
        uvs.append([(0, 0), (0, h / s), (L / s, h / s), (L / s, 0)])
    return verts, faces, uvs


def panel(it):
    w, h = it['s']
    verts = [(-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0)]
    return verts, [[0, 1, 2, 3]], [[(0, 0), (1, 0), (1, 1), (0, 1)]]


# ---------------------------------------------------------------- materials

def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def rgba(hexstr, a=1.0):
    hexstr = hexstr.lstrip('#')
    return tuple(srgb_to_linear(int(hexstr[i:i + 2], 16) / 255) for i in (0, 2, 4)) + (a,)


def make_material(design, name, d, night):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes['Principled BSDF']
    bsdf.inputs['Roughness'].default_value = d.get('r', 0.6)
    bsdf.inputs['Metallic'].default_value = d.get('m', 0.0)
    if d.get('cc'):
        bsdf.inputs['Coat Weight'].default_value = d['cc']
        bsdf.inputs['Coat Roughness'].default_value = 0.12
    img_node = None
    tex_path = os.path.join(ROOT, 'build', 'tex', f'{design}_{name}.png')
    if d.get('tex') and os.path.exists(tex_path):
        img_node = nt.nodes.new('ShaderNodeTexImage')
        img_node.image = bpy.data.images.load(tex_path, check_existing=True)
        img_node.interpolation = 'Cubic'
        nt.links.new(img_node.outputs['Color'], bsdf.inputs['Base Color'])
    else:
        bsdf.inputs['Base Color'].default_value = rgba(d.get('c', '#cccccc'))
    if d.get('e'):
        strength = d.get('ein', d.get('ei', 1.0)) if night else d.get('ei', 1.0)
        if name == 'screen':
            strength *= 0.12  # screens read as off, not glowing blue
        bsdf.inputs['Emission Strength'].default_value = strength * 3.0
        if img_node is not None and d.get('emap'):
            nt.links.new(img_node.outputs['Color'], bsdf.inputs['Emission Color'])
        else:
            bsdf.inputs['Emission Color'].default_value = rgba(d['e'])
    o = d.get('o', 1.0)
    if o < 1.0:
        if d.get('glass') and o <= 0.3:
            bsdf.inputs['Transmission Weight'].default_value = 1.0
            bsdf.inputs['IOR'].default_value = 1.45
            bsdf.inputs['Roughness'].default_value = min(d.get('r', 0.02), 0.08)
            bsdf.inputs['Base Color'].default_value = rgba(d.get('c', '#ffffff'))
        else:
            bsdf.inputs['Alpha'].default_value = o
    return m


# ---------------------------------------------------------------- build

def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def build(spec, design, night):
    buckets = {}
    for it in spec['items']:
        d = spec['mats'].get(it['m'])
        if d is None:
            continue
        ts = d.get('ts')
        k = it['k']
        if k == 'box':
            geo = box(it, ts)
        elif k == 'cyl':
            geo = cylinder(it, ts)
        elif k == 'sph':
            geo = sphere(it)
        elif k == 'tor':
            geo = torus(it)
        elif k == 'ext':
            geo = prism(it, ts)
        elif k == 'pnl':
            geo = panel(it)
        else:
            continue
        key = (it['m'], it.get('L', 0), it.get('g', ''))
        buckets.setdefault(key, Bucket()).add(*geo, TO_BLENDER @ mat_of(it))

    cols = {}
    for name in ('Shell and furniture', 'Ceiling', 'Moving parts', 'Lights', 'Cameras'):
        c = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(c)
        cols[name] = c
    mats = {}
    for (mname, layer, gid), b in buckets.items():
        if mname not in mats:
            mats[mname] = make_material(design, mname, spec['mats'][mname], night)
        me = bpy.data.meshes.new(f'{mname}')
        me.from_pydata(b.verts, [], b.faces)
        uv = me.uv_layers.new(name='UVMap')
        i = 0
        for poly, fuv in zip(me.polygons, b.uvs):
            for li, co in zip(poly.loop_indices, fuv):
                uv.data[li].uv = co
            i += 1
        me.materials.append(mats[mname])
        me.validate()
        ob = bpy.data.objects.new(f'{mname}' + (f' [{gid}]' if gid else ''), me)
        col = cols['Ceiling'] if layer == 1 else cols['Moving parts'] if gid else cols['Shell and furniture']
        col.objects.link(ob)
    return cols


def add_lights(spec, cols, design_meta, night):
    for i, l in enumerate(spec['lights']):
        # by day the lamps are on at half power, as they would be in a photo shoot
        scale = 0.3 if night else (0.5 if l.get('night') else 0.7)
        loc = TO_BLENDER @ Vector(l['p'])
        col = rgba(l['c'])[:3]
        if l['k'] == 'point':
            ld = bpy.data.lights.new(f'point {i}', 'POINT')
            ld.energy = l['i'] * 18 * scale
            ld.shadow_soft_size = 0.08
        elif l['k'] == 'spot':
            ld = bpy.data.lights.new(f'spot {i}', 'SPOT')
            ld.energy = l['i'] * 12 * scale
            ld.spot_size = l.get('a', 0.5) * 2
            ld.spot_blend = l.get('pen', 0.6)
            ld.shadow_soft_size = 0.05
        else:
            ld = bpy.data.lights.new(f'panel {i}', 'AREA')
            ld.shape = 'RECTANGLE'
            ld.size, ld.size_y = l['w'], l['h']
            ld.energy = l['i'] * 3.5 * scale
        ld.color = col
        ob = bpy.data.objects.new(ld.name, ld)
        ob.location = loc
        if l['k'] == 'spot':
            t = TO_BLENDER @ Vector(l['t'])
            ob.rotation_euler = (t - loc).to_track_quat('-Z', 'Y').to_euler()
        elif l['k'] == 'rect':
            x, y, z, w = l['q']
            q = TO_BLENDER.to_quaternion() @ Quaternion((w, x, y, z))
            ob.rotation_euler = q.to_euler()
        cols['Lights'].objects.link(ob)

    # sun, through the windows
    sd = design_meta.get('sun', [-0.45, 0.7, -0.95])
    d = (TO_BLENDER.to_3x3() @ Vector(sd)).normalized()
    sun = bpy.data.lights.new('Sun', 'SUN')
    sun.energy = 0.3 if night else 4.5
    sun.angle = math.radians(1.2)
    sun.color = rgba('#9fb5ff' if night else design_meta.get('sunColor', '#fff1dc'))[:3]
    ob = bpy.data.objects.new('Sun', sun)
    ob.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
    cols['Lights'].objects.link(ob)

    world = bpy.data.worlds.new('Sky')
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes['Background']
    if night:
        bg.inputs['Color'].default_value = (0.004, 0.008, 0.02, 1)
        bg.inputs['Strength'].default_value = 1.0
    else:
        sky = nt.nodes.new('ShaderNodeTexSky')
        try:
            sky.sky_type = 'NISHITA'
            sky.sun_elevation = math.asin(max(0.05, d.z))
            sky.sun_rotation = math.atan2(d.x, d.y) + math.pi
            sky.altitude = 40
        except (AttributeError, TypeError):
            pass
        nt.links.new(sky.outputs['Color'], bg.inputs['Color'])
        bg.inputs['Strength'].default_value = 1.0


def add_cameras(spec, cols):
    cams = []
    for i, v in enumerate(spec['views']):
        cd = bpy.data.cameras.new(f'{i} {v["name"]}')
        cd.lens = 20
        cd.clip_start = 0.05
        ob = bpy.data.objects.new(cd.name, cd)
        p = TO_BLENDER @ Vector(v['p'])
        t = TO_BLENDER @ Vector(v['look'])
        ob.location = p
        ob.rotation_euler = (t - p).to_track_quat('-Z', 'Y').to_euler()
        cols['Cameras'].objects.link(ob)
        cams.append(ob)
    # top-down plan, orthographic, ceilings hidden when rendered
    cd = bpy.data.cameras.new('Plan (top down)')
    cd.type = 'ORTHO'
    cd.ortho_scale = 15.2
    ob = bpy.data.objects.new(cd.name, cd)
    ob.location = (7.0, -4.7, 12.0)
    cols['Cameras'].objects.link(ob)
    cams.append(ob)
    return cams


def setup_render(samples):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 8
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.render.resolution_x, sc.render.resolution_y = 1600, 1000
    sc.render.film_transparent = False
    sc.view_settings.view_transform = 'AgX' if 'AgX' in [v.identifier for v in sc.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'
    sc.view_settings.exposure = 1.8
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for kind in ('OPTIX', 'CUDA'):
        try:
            prefs.compute_device_type = kind
            prefs.get_devices()
            if any(d.type == kind for d in prefs.devices):
                for d in prefs.devices:
                    d.use = d.type == kind
                sc.cycles.device = 'GPU'
                print('render device', kind)
                break
        except TypeError:
            continue


def main():
    a = args()
    spec_path = os.path.join(ROOT, a['spec']) if not os.path.isabs(a['spec']) else a['spec']
    spec = json.load(open(spec_path, encoding='utf-8'))
    design = spec['meta']['design']
    meta = json.load(open(os.path.join(ROOT, 'build', 'designs_meta.json'), encoding='utf-8')).get(design, {})
    clear()
    cols = build(spec, design, a['night'])
    add_lights(spec, cols, meta, a['night'])
    cams = add_cameras(spec, cols)
    setup_render(a['samples'])
    bpy.context.scene.camera = cams[0]
    os.makedirs(os.path.join(ROOT, 'blender'), exist_ok=True)
    if not a['night']:
        bpy.ops.file.pack_all()
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'blender', f'{design}.blend'))
    if a['render']:
        os.makedirs(os.path.join(ROOT, 'renders', 'png'), exist_ok=True)
        views = a['views'] if a['views'] is not None else list(range(len(cams)))
        suffix = '_night' if a['night'] else ''
        for i in views:
            cam = cams[i]
            plan = cam.data.type == 'ORTHO'
            cols['Ceiling'].hide_render = plan
            bpy.context.scene.camera = cam
            bpy.context.scene.view_settings.exposure = (0.2 if plan else 1.8) if not a['night'] else (-1.6 if plan else -0.7)
            name = 'plan' if plan else f'v{i}'
            bpy.context.scene.render.filepath = os.path.join(ROOT, 'renders', 'png', f'{design}_{name}{suffix}.png')
            bpy.ops.render.render(write_still=True)
            print('rendered', bpy.context.scene.render.filepath)
        cols['Ceiling'].hide_render = False


main()
