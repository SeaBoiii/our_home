// Procedural canvas textures. Each recipe draws into a canvas from the
// material definition; app.js wraps the canvas in a THREE.CanvasTexture.
import { rng } from './kit.js';

const cv = (w, h = w) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
};

function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function shade(c, f) {
  const [r, g, b] = hex(c);
  const k = (v) => Math.max(0, Math.min(255, Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f))));
  return `rgb(${k(r)},${k(g)},${k(b)})`;
}

function noise(ctx, w, h, amt, R, size = 1) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y += size) for (let x = 0; x < w; x += size) {
    const n = (R() - 0.5) * amt;
    for (let yy = 0; yy < size; yy++) for (let xx = 0; xx < size; xx++) {
      const i = ((y + yy) * w + (x + xx)) * 4;
      d[i] += n; d[i + 1] += n; d[i + 2] += n;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function grain(ctx, x, y, w, h, base, R, vertical = false) {
  ctx.fillStyle = base;
  ctx.fillRect(x, y, w, h);
  const lines = Math.round((vertical ? w : h) / 3);
  for (let i = 0; i < lines; i++) {
    ctx.strokeStyle = `rgba(60,35,15,${0.03 + R() * 0.08})`;
    ctx.lineWidth = 0.5 + R() * 1.4;
    ctx.beginPath();
    if (!vertical) {
      const yy = y + R() * h, amp = R() * 3;
      ctx.moveTo(x, yy);
      for (let xx = x; xx <= x + w; xx += 16) ctx.lineTo(xx, yy + Math.sin(xx * 0.02 + i) * amp);
    } else {
      const xx = x + R() * w, amp = R() * 3;
      ctx.moveTo(xx, y);
      for (let yy = y; yy <= y + h; yy += 16) ctx.lineTo(xx + Math.sin(yy * 0.02 + i) * amp, yy);
    }
    ctx.stroke();
  }
}

const R0 = (s) => rng(s);

export const recipes = {
  wood(def) {
    const [c, x] = cv(512), R = R0(11);
    const rows = def.planks ?? 4;
    for (let i = 0; i < rows; i++) {
      const y = (512 / rows) * i, off = R() * 512;
      for (const seg of [[-off, 512 * 0.9], [-off + 512 * 0.9, 512 * 1.1]]) grain(x, seg[0], y, seg[1], 512 / rows, shade(def.c, (R() - 0.5) * 0.18), R);
      x.fillStyle = 'rgba(40,25,10,0.45)';
      x.fillRect(0, y, 512, 1.5);
      x.fillRect(((-off + 512 * 0.9) % 512 + 512) % 512, y, 1.5, 512 / rows);
    }
    noise(x, 512, 512, 10, R);
    return c;
  },
  grain(def) {
    const [c, x] = cv(512), R = R0(5);
    grain(x, 0, 0, 512, 512, def.c, R, def.vertical);
    noise(x, 512, 512, 8, R);
    return c;
  },
  herring(def) {
    // planks at 45 degrees; lattice (W,W) and (-L,L) maps onto a 512px tile
    const [c, x] = cv(512);
    const W = 32 / Math.SQRT2, L = 4 * W;
    x.fillStyle = shade(def.c, -0.3);
    x.fillRect(0, 0, 512, 512);
    x.save();
    x.rotate(-Math.PI / 4);
    for (let i = -28; i <= 28; i++) for (let j = -10; j <= 10; j++) {
      const R = R0(((i % 16) + 16) % 16 * 7 + (((j % 4) + 4) % 4) * 131 + 3);
      const px = i * W - j * L, py = i * W + j * L;
      for (const [dx, dy, w, h] of [[0, 0, L, W], [0, W, W, L]]) {
        x.save();
        x.translate(px + dx, py + dy);
        grain(x, 0, 0, w, h, shade(def.c, (R() - 0.5) * 0.22), R, h > w);
        x.strokeStyle = 'rgba(40,25,10,0.45)';
        x.lineWidth = 1.2;
        x.strokeRect(0, 0, w, h);
        x.restore();
      }
    }
    x.restore();
    return c;
  },
  marble(def) {
    const [c, x] = cv(512), R = R0(31);
    x.fillStyle = def.c;
    x.fillRect(0, 0, 512, 512);
    noise(x, 512, 512, 6, R, 2);
    for (let v = 0; v < (def.veins ?? 9); v++) {
      let px = R() * 512, py = R() * 512, a = R() * Math.PI * 2;
      x.strokeStyle = def.vein ?? 'rgba(120,110,100,0.35)';
      x.globalAlpha = 0.25 + R() * 0.45;
      x.lineWidth = 0.6 + R() * 2.2;
      x.beginPath();
      x.moveTo(px, py);
      for (let s = 0; s < 60; s++) {
        a += (R() - 0.5) * 0.6;
        px += Math.cos(a) * 12; py += Math.sin(a) * 12;
        x.lineTo(px, py);
      }
      x.stroke();
    }
    x.globalAlpha = 1;
    return c;
  },
  terrazzo(def) {
    const [c, x] = cv(512), R = R0(41);
    x.fillStyle = def.c;
    x.fillRect(0, 0, 512, 512);
    const chips = def.chips ?? ['#c9b8a4', '#8a7a6a', '#e9e2d6', '#b45c46'];
    for (let i = 0; i < 900; i++) {
      x.fillStyle = chips[Math.floor(R() * chips.length)];
      x.beginPath();
      const px = R() * 512, py = R() * 512, r = 1 + R() * (R() < 0.1 ? 9 : 4);
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2, rr = r * (0.6 + R() * 0.6);
        x.lineTo(px + Math.cos(a) * rr, py + Math.sin(a) * rr);
      }
      x.fill();
    }
    return c;
  },
  tile(def) {
    const [c, x] = cv(512), R = R0(51), n = def.n ?? 4, m = def.m ?? n, g = def.g ?? 3;
    x.fillStyle = def.grout ?? '#cfcac2';
    x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
      const cols = def.cols ?? [def.c];
      let col = cols[(i + j) % cols.length];
      if (def.checker) col = (i + j) % 2 ? def.checker : def.c;
      x.fillStyle = shade(col, (R() - 0.5) * (def.vary ?? 0.05));
      x.fillRect((512 / n) * i + g / 2, (512 / m) * j + g / 2, 512 / n - g, 512 / m - g);
    }
    if (def.zellige) noise(x, 512, 512, 18, R, 4);
    return c;
  },
  fabric(def) {
    const [c, x] = cv(256), R = R0(61);
    x.fillStyle = def.c;
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 2) {
      x.fillStyle = `rgba(0,0,0,${0.03 + R() * 0.03})`;
      x.fillRect(0, i, 256, 1);
      x.fillStyle = `rgba(255,255,255,${0.02 + R() * 0.03})`;
      x.fillRect(i, 0, 1, 256);
    }
    noise(x, 256, 256, 12, R);
    return c;
  },
  boucle(def) {
    const [c, x] = cv(256), R = R0(62);
    x.fillStyle = def.c;
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) {
      x.fillStyle = R() < 0.5 ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)';
      x.beginPath();
      x.arc(R() * 256, R() * 256, 1 + R() * 2, 0, Math.PI * 2);
      x.fill();
    }
    return c;
  },
  rattan(def) {
    const [c, x] = cv(256);
    x.fillStyle = shade(def.c, -0.45);
    x.fillRect(0, 0, 256, 256);
    x.strokeStyle = def.c;
    x.lineWidth = 3;
    for (let i = -256; i < 512; i += 16) {
      x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 256, 256); x.stroke();
      x.beginPath(); x.moveTo(i, 256); x.lineTo(i + 256, 0); x.stroke();
    }
    x.lineWidth = 2;
    for (let i = 0; i < 256; i += 16) {
      x.beginPath(); x.moveTo(i + 8, 0); x.lineTo(i + 8, 256); x.stroke();
      x.beginPath(); x.moveTo(0, i + 8); x.lineTo(256, i + 8); x.stroke();
    }
    return c;
  },
  stripes(def) {
    const [c, x] = cv(256);
    const cols = def.cols ?? [def.c, shade(def.c, -0.15)];
    const n = def.n ?? 8;
    for (let i = 0; i < n; i++) {
      x.fillStyle = cols[i % cols.length];
      if (def.vertical) x.fillRect((256 / n) * i, 0, 256 / n, 256);
      else x.fillRect(0, (256 / n) * i, 256, 256 / n);
    }
    return c;
  },
  portholes() {
    const [c, x] = cv(1024, 64);
    x.fillStyle = '#151515';
    x.fillRect(0, 0, 1024, 64);
    for (let row = 0; row < 2; row++) for (let i = 0; i < 90; i++) {
      x.fillStyle = '#e8d9b0';
      x.beginPath();
      x.arc(6 + i * 11.3 + row * 4, 18 + row * 24, 2.1, 0, Math.PI * 2);
      x.fill();
    }
    return c;
  },
  superwindows() {
    const [c, x] = cv(512, 64);
    x.fillStyle = '#f1eee6';
    x.fillRect(0, 0, 512, 64);
    x.fillStyle = '#3a3a3a';
    for (let i = 0; i < 64; i++) x.fillRect(4 + i * 8, 22, 4, 16);
    x.fillStyle = 'rgba(0,0,0,0.15)';
    x.fillRect(0, 60, 512, 4);
    return c;
  },
  deck() {
    const [c, x] = cv(256), R = R0(71);
    x.fillStyle = '#c9a774';
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 6) {
      x.fillStyle = `rgba(90,60,30,${0.25 + R() * 0.2})`;
      x.fillRect(0, i, 256, 1);
    }
    return c;
  },
  text(def) {
    const [c, x] = cv(1024, 256);
    x.fillStyle = def.bg ?? '#0d0d0f';
    x.fillRect(0, 0, 1024, 256);
    x.fillStyle = def.fg ?? '#d9b472';
    x.textAlign = 'center';
    x.font = `${def.size ?? 120}px "Instrument Serif", Georgia, serif`;
    x.fillText(def.text, 512, def.sub ? 150 : 170);
    if (def.sub) {
      x.font = '34px "Instrument Sans", Arial, sans-serif';
      x.fillText(def.sub, 512, 215);
    }
    return c;
  },
  sky(def) {
    // night-sky ceiling with the Summer Triangle: Vega (Nurul), Altair (Aleem),
    // Deneb (the bridge between them), and a soft Milky Way between the two.
    const [c, x] = cv(2048, 1024), R = R0(1996);
    const g = x.createLinearGradient(0, 0, 2048, 1024);
    g.addColorStop(0, '#020a12'); g.addColorStop(1, '#04121b');
    x.fillStyle = g;
    x.fillRect(0, 0, 2048, 1024);
    x.save();
    x.translate(1024, 512); x.rotate(-0.5);
    for (let i = 0; i < 2200; i++) {
      const px = (R() - 0.5) * 2600, py = (R() + R() + R() - 1.5) * 160;
      x.fillStyle = `rgba(200,210,255,${R() * 0.16})`;
      x.fillRect(px, py, 2, 2);
    }
    x.restore();
    for (let i = 0; i < 900; i++) {
      const r = R() < 0.95 ? 0.6 + R() * 0.9 : 1.6 + R() * 1.4;
      x.fillStyle = `rgba(255,${235 + R() * 20},${200 + R() * 55},${0.4 + R() * 0.6})`;
      x.beginPath(); x.arc(R() * 2048, R() * 1024, r, 0, Math.PI * 2); x.fill();
    }
    const star = (px, py, r, name, col) => {
      const gl = x.createRadialGradient(px, py, 0, px, py, r * 7);
      gl.addColorStop(0, col); gl.addColorStop(0.2, col.replace('1)', '0.5)')); gl.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gl; x.beginPath(); x.arc(px, py, r * 7, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
      if (name) {
        x.fillStyle = 'rgba(217,180,114,0.85)';
        x.font = 'italic 30px "Instrument Serif", Georgia, serif';
        x.fillText(name, px + 18, py - 14);
      }
    };
    const vega = [760, 300], altair = [1340, 760], deneb = [1260, 210];
    x.strokeStyle = 'rgba(217,180,114,0.35)';
    x.setLineDash([6, 10]);
    x.lineWidth = 2;
    x.beginPath(); x.moveTo(...vega); x.lineTo(...deneb); x.lineTo(...altair); x.closePath(); x.stroke();
    x.setLineDash([]);
    star(...vega, 5, def.labels === false ? '' : 'Vega · Nurul', 'rgba(205,225,255,1)');
    star(...altair, 4.5, def.labels === false ? '' : 'Altair · Aleem', 'rgba(255,245,225,1)');
    star(...deneb, 4, def.labels === false ? '' : 'Deneb · the bridge', 'rgba(230,235,255,1)');
    return c;
  },
  caustics(def) {
    const [c, x] = cv(512), R = R0(81);
    x.fillStyle = def.c ?? '#06324a';
    x.fillRect(0, 0, 512, 512);
    x.strokeStyle = 'rgba(120,220,255,0.35)';
    for (let i = 0; i < 140; i++) {
      x.lineWidth = 1 + R() * 3;
      x.beginPath();
      const px = R() * 512, py = R() * 512;
      x.ellipse(px, py, 20 + R() * 40, 10 + R() * 25, R() * Math.PI, 0, Math.PI * (0.6 + R()));
      x.stroke();
    }
    return c;
  },
  sunset() {
    // the Kallang River pier at sunset, where "maybe" became "us"
    const [c, x] = cv(1024, 512);
    const g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#033a4e'); g.addColorStop(0.42, '#b9774a'); g.addColorStop(0.58, '#f0b765');
    g.addColorStop(0.6, '#d9b472'); g.addColorStop(1, '#04121b');
    x.fillStyle = g;
    x.fillRect(0, 0, 1024, 512);
    x.fillStyle = 'rgba(255,214,140,0.9)';
    x.beginPath(); x.arc(620, 300, 46, Math.PI, 0); x.fill();
    for (let i = 0; i < 22; i++) {
      x.fillStyle = `rgba(255,214,140,${0.55 - i * 0.022})`;
      x.fillRect(620 - 60 + i * 2.5 + Math.sin(i) * 6, 312 + i * 9, 120 - i * 5, 3);
    }
    x.fillStyle = 'rgba(4,18,27,0.85)';
    x.fillRect(0, 330, 420, 10);
    for (let i = 0; i < 9; i++) x.fillRect(20 + i * 48, 330, 5, 60);
    x.fillRect(0, 300, 1024, 2);
    return c;
  },
  monogram(def) {
    const [c, x] = cv(512);
    x.fillStyle = def.bg ?? '#033a4e';
    x.fillRect(0, 0, 512, 512);
    x.strokeStyle = '#d9b472';
    x.lineWidth = 3;
    x.beginPath(); x.arc(256, 256, 170, 0, Math.PI * 2); x.stroke();
    x.lineWidth = 1;
    x.beginPath(); x.arc(256, 256, 182, 0, Math.PI * 2); x.stroke();
    x.fillStyle = '#d9b472';
    x.textAlign = 'center';
    x.font = '170px "Instrument Serif", Georgia, serif';
    x.fillText('A&N', 256, 315);
    x.font = '22px "Instrument Sans", Arial, sans-serif';
    x.fillText(def.sub ?? '21 · 08 · 2027', 256, 380);
    return c;
  },
  boarding(def) {
    const [c, x] = cv(1024, 400);
    x.fillStyle = '#f8f3ea';
    x.fillRect(0, 0, 1024, 400);
    x.fillStyle = '#033a4e';
    x.fillRect(0, 0, 1024, 70);
    x.fillStyle = '#d9b472';
    x.font = '34px "Instrument Sans", Arial, sans-serif';
    x.fillText('BOARDING PASS · ' + (def.flight ?? 'AN2108'), 30, 46);
    x.fillStyle = '#033a4e';
    x.font = '120px "Instrument Serif", Georgia, serif';
    x.fillText('SIN', 40, 220);
    x.fillText(def.to ?? 'FOREVER', 380, 220);
    x.font = '60px serif';
    x.fillText('✈', 280, 200);
    x.font = '26px "Instrument Sans", Arial, sans-serif';
    x.fillText('PASSENGERS  ALEEM & NURUL AIN', 40, 300);
    x.fillText('DATE  21 AUG 2027      GATE  CROWNE PLAZA CHANGI', 40, 345);
    x.setLineDash([8, 8]);
    x.strokeStyle = '#033a4e';
    x.beginPath(); x.moveTo(820, 80); x.lineTo(820, 400); x.stroke();
    return c;
  },
  blueprint() {
    const [c, x] = cv(1024, 512);
    x.fillStyle = '#0b2c4a';
    x.fillRect(0, 0, 1024, 512);
    x.strokeStyle = 'rgba(255,255,255,0.12)';
    for (let i = 0; i < 1024; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 512); x.stroke(); }
    for (let i = 0; i < 512; i += 32) { x.beginPath(); x.moveTo(0, i); x.lineTo(1024, i); x.stroke(); }
    x.strokeStyle = 'rgba(235,245,255,0.9)';
    x.lineWidth = 2.5;
    x.beginPath();
    x.moveTo(80, 300); x.lineTo(940, 300); x.lineTo(980, 230); x.lineTo(900, 232); x.lineTo(120, 232); x.lineTo(60, 250); x.closePath(); x.stroke();
    x.strokeRect(260, 200, 520, 32);
    for (const fx of [330, 450, 570, 690]) { x.beginPath(); x.moveTo(fx, 200); x.lineTo(fx - 14, 90); x.lineTo(fx + 22, 90); x.lineTo(fx + 36, 200); x.stroke(); }
    x.beginPath(); x.moveTo(850, 232); x.lineTo(845, 40); x.moveTo(140, 232); x.lineTo(135, 55); x.moveTo(845, 40); x.lineTo(135, 55); x.stroke();
    x.fillStyle = 'rgba(235,245,255,0.9)';
    x.font = '34px "Instrument Serif", Georgia, serif';
    x.fillText('R.M.S. TITANIC — PROFILE', 60, 400);
    x.font = '20px "Instrument Sans", Arial, sans-serif';
    x.fillText('LENGTH 882 FT 9 IN · BEAM 92 FT 6 IN · HARLAND & WOLFF, BELFAST · YARD No. 401', 60, 440);
    return c;
  },
  ost(def) {
    const [c, x] = cv(512);
    const g = x.createLinearGradient(0, 0, 512, 512);
    g.addColorStop(0, def.a ?? '#033a4e'); g.addColorStop(1, def.b ?? '#d9b472');
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 512);
    x.fillStyle = 'rgba(4,18,27,0.85)';
    x.beginPath(); x.arc(256, 230, 150, 0, Math.PI * 2); x.fill();
    x.fillStyle = def.b ?? '#d9b472';
    x.beginPath(); x.arc(256, 230, 40, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#f8f3ea';
    x.textAlign = 'center';
    x.font = '44px "Instrument Serif", Georgia, serif';
    x.fillText(def.title, 256, 440);
    x.font = '22px "Instrument Sans", Arial, sans-serif';
    x.fillText(def.artist, 256, 478);
    return c;
  },
  mountains(def) {
    const [c, x] = cv(1024, 640), R = R0(def.seed ?? 3);
    const g = x.createLinearGradient(0, 0, 0, 640);
    g.addColorStop(0, def.sky ?? '#9fc3d6'); g.addColorStop(1, '#f2efe8');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 640);
    for (let layer = 0; layer < 3; layer++) {
      x.fillStyle = ['#7b93a3', '#4f6b78', '#2c4450'][layer];
      x.beginPath(); x.moveTo(0, 640);
      let y = 300 + layer * 80;
      for (let px = 0; px <= 1024; px += 32) { y += (R() - 0.5) * 70; y = Math.max(150 + layer * 60, Math.min(520, y)); x.lineTo(px, y); }
      x.lineTo(1024, 640); x.fill();
      if (layer === 0) { x.fillStyle = 'rgba(255,255,255,0.7)'; x.fillRect(0, 0, 0, 0); }
    }
    if (def.caption) {
      x.fillStyle = '#f8f3ea';
      x.font = 'italic 38px "Instrument Serif", Georgia, serif';
      x.fillText(def.caption, 40, 600);
    }
    return c;
  },
  abstract(def) {
    const [c, x] = cv(512, 640), R = R0(def.seed ?? 9);
    const cols = def.cols ?? ['#033a4e', '#d9b472', '#efe6d6', '#173d35', '#f4b6c2'];
    x.fillStyle = def.bg ?? '#f8f3ea';
    x.fillRect(0, 0, 512, 640);
    for (let i = 0; i < 7; i++) {
      x.fillStyle = cols[i % cols.length];
      x.globalAlpha = 0.85;
      x.beginPath();
      const px = 60 + R() * 390, py = 60 + R() * 520, r = 40 + R() * 150;
      if (R() < 0.5) x.arc(px, py, r, R() * 6, R() * 6 + Math.PI * (1 + R()));
      else x.ellipse(px, py, r, r * 0.5, R() * 3, 0, Math.PI * 2);
      x.fill();
    }
    x.globalAlpha = 1;
    return c;
  },
  songket(def) {
    // pucuk rebung (bamboo shoot) triangles: growth and new beginnings
    const [c, x] = cv(512);
    x.fillStyle = def.bg ?? '#033a4e';
    x.fillRect(0, 0, 512, 512);
    x.strokeStyle = def.fg ?? '#d9b472';
    x.fillStyle = def.fg ?? '#d9b472';
    x.lineWidth = 2;
    for (let row = 0; row < 4; row++) for (let i = 0; i < 8; i++) {
      const bx = i * 64, by = row * 128;
      x.beginPath(); x.moveTo(bx + 4, by + 124); x.lineTo(bx + 32, by + 8); x.lineTo(bx + 60, by + 124); x.closePath(); x.stroke();
      x.beginPath(); x.moveTo(bx + 18, by + 118); x.lineTo(bx + 32, by + 50); x.lineTo(bx + 46, by + 118); x.closePath(); x.fill();
      x.fillRect(bx + 30, by + 20, 4, 18);
    }
    return c;
  },
  deco(def) {
    // ocean-liner fan motif
    const [c, x] = cv(512);
    x.fillStyle = def.bg ?? '#0f2a35';
    x.fillRect(0, 0, 512, 512);
    x.strokeStyle = def.fg ?? '#c9a25a';
    x.lineWidth = 2;
    for (let row = 0; row < 5; row++) for (let i = -1; i < 5; i++) {
      const cx = i * 128 + (row % 2 ? 64 : 0), cy = row * 128;
      for (let r = 20; r <= 64; r += 11) { x.beginPath(); x.arc(cx + 64, cy + 64, r, Math.PI, 0); x.stroke(); }
    }
    return c;
  },
  splitflap() {
    const [c, x] = cv(1024, 384);
    x.fillStyle = '#0b0d10';
    x.fillRect(0, 0, 1024, 384);
    x.font = 'bold 40px "IBM Plex Mono", monospace';
    const rows = [['TIME', 'FLIGHT', 'DESTINATION', 'STATUS'], ['10:00', 'AN2108', 'FOREVER', 'BOARDING'], ['12:00', 'AN2208', 'HOME', 'ON TIME'], ['--:--', 'AN0001', 'NEW ZEALAND', 'SOON']];
    const xs = [30, 200, 400, 760];
    rows.forEach((r, i) => r.forEach((t, j) => {
      x.fillStyle = i === 0 ? '#8a8f96' : j === 3 ? '#e9c46a' : '#f3f1ea';
      for (let k = 0; k < t.length; k++) {
        if (i > 0) { x.fillStyle = '#1a1d22'; x.fillRect(xs[j] + k * 28 - 2, 70 + i * 80 - 36, 26, 44); x.fillStyle = j === 3 ? '#e9c46a' : '#f3f1ea'; }
        x.fillText(t[k], xs[j] + k * 28, 70 + i * 80);
      }
    }));
    return c;
  },
  player2() {
    const [c, x] = cv(512, 640);
    x.fillStyle = '#0d1b2a';
    x.fillRect(0, 0, 512, 640);
    x.fillStyle = '#f4b6c2';
    x.font = 'bold 54px "IBM Plex Mono", monospace';
    x.textAlign = 'center';
    x.fillText('PLAYER 2', 256, 200);
    x.fillStyle = '#7fe0c9';
    x.fillText('READY', 256, 280);
    x.fillStyle = '#d9b472';
    x.font = '26px "IBM Plex Mono", monospace';
    x.fillText('forever', 256, 340);
    for (let i = 0; i < 9; i++) for (let j = 0; j < 7; j++) if ((i + j * 3) % 5 === 0) { x.fillStyle = 'rgba(244,182,194,0.25)'; x.fillRect(40 + i * 50, 400 + j * 30, 18, 18); }
    return c;
  },
  laps() {
    const [c, x] = cv(512, 640);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 10; j++) { x.fillStyle = (i + j) % 2 ? '#111' : '#f3f1ea'; x.fillRect(i * 64, j * 64, 64, 64); }
    x.fillStyle = 'rgba(17,17,17,0.85)';
    x.fillRect(30, 200, 452, 240);
    x.fillStyle = '#e9c46a';
    x.textAlign = 'center';
    x.font = 'bold 44px "IBM Plex Mono", monospace';
    x.fillText('JB KARTING', 256, 270);
    x.fillStyle = '#f3f1ea';
    x.font = '30px "IBM Plex Mono", monospace';
    x.fillText('P1  ALEEM', 256, 330);
    x.fillText('P2  NURUL  +2 LAPS', 256, 380);
    return c;
  },
  notfound() {
    const [c, x] = cv(640, 400);
    x.fillStyle = '#0d1117';
    x.fillRect(0, 0, 640, 400);
    x.fillStyle = '#7ee787';
    x.font = '30px "IBM Plex Mono", monospace';
    x.fillText('$ curl life --without nurul', 30, 80);
    x.fillStyle = '#ff7b72';
    x.font = 'bold 72px "IBM Plex Mono", monospace';
    x.fillText('404', 30, 190);
    x.fillStyle = '#e6edf3';
    x.font = '30px "IBM Plex Mono", monospace';
    x.fillText('life without you', 30, 250);
    x.fillText('not found', 30, 295);
    return c;
  },
  studs(def) {
    const [c, x] = cv(256);
    x.fillStyle = def.c;
    x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      x.fillStyle = 'rgba(0,0,0,0.25)';
      x.beginPath(); x.arc(i * 32 + 17, j * 32 + 17, 10, 0, Math.PI * 2); x.fill();
      x.fillStyle = shade(def.c, 0.15);
      x.beginPath(); x.arc(i * 32 + 16, j * 32 + 16, 10, 0, Math.PI * 2); x.fill();
    }
    return c;
  },
  windows(def) {
    const [c, x] = cv(256, 512), R = R0(def.seed ?? 5);
    x.fillStyle = def.c ?? '#e8e4dc';
    x.fillRect(0, 0, 256, 512);
    for (let j = 0; j < 32; j++) for (let i = 0; i < 6; i++) {
      x.fillStyle = def.lit ? (R() < 0.45 ? '#ffcf86' : '#1b2430') : (R() < 0.5 ? '#6d7f8c' : '#94a6b2');
      x.fillRect(12 + i * 40, 8 + j * 16, 26, 9);
    }
    return c;
  },
  lava() {
    // the floor is lava (JB, first full-day date): step on the stones only
    const [c, x] = cv(512), R = R0(2108);
    const g = x.createRadialGradient(256, 256, 40, 256, 256, 360);
    g.addColorStop(0, '#ffb23e'); g.addColorStop(0.5, '#e8521c'); g.addColorStop(1, '#7a1408');
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 60; i++) {
      x.strokeStyle = `rgba(255,${180 + R() * 60},80,${0.3 + R() * 0.4})`;
      x.lineWidth = 2 + R() * 5;
      x.beginPath();
      let px = R() * 512, py = R() * 512;
      x.moveTo(px, py);
      for (let k = 0; k < 6; k++) { px += (R() - 0.5) * 80; py += (R() - 0.5) * 80; x.lineTo(px, py); }
      x.stroke();
    }
    for (let i = 0; i < 9; i++) {
      const px = 50 + (i % 3) * 160 + R() * 40, py = 50 + Math.floor(i / 3) * 160 + R() * 40;
      x.fillStyle = '#3b3633';
      x.beginPath(); x.ellipse(px, py, 34 + R() * 12, 26 + R() * 10, R() * 3, 0, Math.PI * 2); x.fill();
      x.fillStyle = 'rgba(255,255,255,0.12)';
      x.beginPath(); x.ellipse(px - 6, py - 6, 18, 10, 0.4, 0, Math.PI * 2); x.fill();
    }
    return c;
  },
  starTerrazzo(def) {
    const [c, x] = cv(512), R = R0(2401);
    x.fillStyle = def.c ?? '#0b1c27';
    x.fillRect(0, 0, 512, 512);
    noise(x, 512, 512, 8, R, 2);
    for (let i = 0; i < 700; i++) {
      x.fillStyle = R() < 0.25 ? '#d9b472' : R() < 0.5 ? '#2a4a5a' : R() < 0.8 ? '#16303d' : '#efe6d6';
      x.beginPath();
      x.arc(R() * 512, R() * 512, 0.8 + R() * (R() < 0.08 ? 5 : 2.2), 0, Math.PI * 2);
      x.fill();
    }
    return c;
  },
  limewash(def) {
    // soft, cloudy brushed plaster
    const [c, x] = cv(512), R = R0(def.seed ?? 77);
    x.fillStyle = def.c;
    x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 260; i++) {
      const px = R() * 512, py = R() * 512, r = 30 + R() * 90;
      const g = x.createRadialGradient(px, py, 0, px, py, r);
      const a = 0.01 + R() * 0.018;
      g.addColorStop(0, R() < 0.5 ? `rgba(255,252,244,${a * 1.4})` : `rgba(160,130,95,${a})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.fillRect(px - r, py - r, r * 2, r * 2);
    }
    noise(x, 512, 512, 3, R);
    return c;
  },
  travertine(def) {
    // large format tiles with the stone's horizontal banding and pores
    const [c, x] = cv(512), R = R0(def.seed ?? 33), n = def.n ?? 2;
    x.fillStyle = def.grout ?? '#cdbfa8';
    x.fillRect(0, 0, 512, 512);
    const s = 512 / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      x.fillStyle = shade(def.c, (R() - 0.5) * 0.06);
      x.fillRect(i * s + 1.5, j * s + 1.5, s - 3, s - 3);
      for (let k = 0; k < 22; k++) {
        x.fillStyle = `rgba(150,120,85,${0.04 + R() * 0.06})`;
        x.fillRect(i * s + 1.5, j * s + R() * s, s - 3, 1 + R() * 4);
      }
      for (let k = 0; k < 60; k++) {
        x.fillStyle = 'rgba(120,95,65,0.25)';
        x.beginPath();
        x.ellipse(i * s + R() * s, j * s + R() * s, 1 + R() * 3, 0.6 + R(), 0, 0, Math.PI * 2);
        x.fill();
      }
    }
    return c;
  },
  shore() {
    // calm abstract shoreline: sky, sea-glass water, a line of foam, sand
    const [c, x] = cv(1024, 512), R = R0(8);
    const g = x.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#e9e4da'); g.addColorStop(0.42, '#dfe3dc');
    g.addColorStop(0.43, '#a9c2bb'); g.addColorStop(0.6, '#8fb0aa');
    g.addColorStop(0.61, '#f3efe6'); g.addColorStop(0.64, '#e6d8bf'); g.addColorStop(1, '#d6c19e');
    x.fillStyle = g;
    x.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 900; i++) {
      x.fillStyle = `rgba(255,255,255,${R() * 0.25})`;
      x.fillRect(R() * 1024, 220 + R() * 90, 10 + R() * 40, 1);
    }
    x.strokeStyle = 'rgba(255,255,255,0.8)';
    x.lineWidth = 3;
    x.beginPath();
    for (let px = 0; px <= 1024; px += 16) x.lineTo(px, 312 + Math.sin(px * 0.012) * 6 + Math.sin(px * 0.05) * 2);
    x.stroke();
    noise(x, 1024, 512, 6, R, 2);
    return c;
  },
  sea() {
    const [c, x] = cv(512), R = R0(91);
    x.fillStyle = '#2f6f86';
    x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 1400; i++) {
      x.fillStyle = `rgba(255,255,255,${R() * 0.18})`;
      x.fillRect(R() * 512, R() * 512, 6 + R() * 14, 1);
    }
    return c;
  },
};

export function makeCanvas(def) {
  const t = typeof def.tex === 'string' ? { k: def.tex } : def.tex;
  const fn = recipes[t.k];
  if (!fn) return null;
  return fn({ c: def.c ?? '#888888', ...t });
}
