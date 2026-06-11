// Procedural textures generated on a <canvas> so the simulator is fully
// self-contained (no external image downloads). Each body gets a believable
// look derived from its NASA base colour.
import * as THREE from 'three';

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function hex(color) {
  const c = new THREE.Color(color);
  return `rgb(${(c.r * 255) | 0},${(c.g * 255) | 0},${(c.b * 255) | 0})`;
}

function shade(color, amt) {
  const c = new THREE.Color(color);
  c.offsetHSL(0, 0, amt);
  return hex(c);
}

// Simple value-noise splatter used for rocky/cloudy surfaces.
function splatter(ctx, w, h, color, count, rMin, rMax, alpha) {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const r = rMin + Math.random() * (rMax - rMin);
    ctx.beginPath();
    ctx.globalAlpha = alpha * (0.4 + Math.random() * 0.6);
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

const cache = new Map();
function texture(key, builder) {
  if (cache.has(key)) return cache.get(key);
  const canvas = builder();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}

// Rocky / terrestrial body (Mercury, Mars, Moon…).
export function rockyTexture(body) {
  return texture('rock-' + body.id, () => {
    const w = 1024, h = 512;
    const c = makeCanvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = hex(body.color);
    ctx.fillRect(0, 0, w, h);
    splatter(ctx, w, h, shade(body.color, -0.12), 1400, 2, 9, 0.5);
    splatter(ctx, w, h, shade(body.color, 0.1), 1000, 2, 7, 0.4);
    // craters
    for (let i = 0; i < 90; i++) {
      const x = Math.random() * w, y = Math.random() * h;
      const r = 3 + Math.random() * 18;
      ctx.beginPath();
      ctx.fillStyle = shade(body.color, -0.18);
      ctx.globalAlpha = 0.5;
      ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = shade(body.color, 0.12);
      ctx.globalAlpha = 0.4;
      ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.7, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    return c;
  });
}

// Earth-like: oceans, continents, ice caps.
export function earthTexture() {
  return texture('earth', () => {
    const w = 1024, h = 512;
    const c = makeCanvas(w, h);
    const ctx = c.getContext('2d');
    const ocean = ctx.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, '#13325e');
    ocean.addColorStop(0.5, '#1f63b8');
    ocean.addColorStop(1, '#13325e');
    ctx.fillStyle = ocean; ctx.fillRect(0, 0, w, h);
    // continents as green/brown blobs
    const land = ['#2f7d3a', '#3d8c43', '#6b8f3a', '#8a7a45'];
    for (let i = 0; i < 26; i++) {
      const cx = Math.random() * w;
      const cy = h * 0.2 + Math.random() * h * 0.6;
      ctx.fillStyle = land[(Math.random() * land.length) | 0];
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      const pts = 8 + ((Math.random() * 6) | 0);
      for (let p = 0; p <= pts; p++) {
        const a = (p / pts) * Math.PI * 2;
        const rr = 30 + Math.random() * 70;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr * 0.7;
        p === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // ice caps
    ctx.fillStyle = '#eef4ff';
    ctx.fillRect(0, 0, w, 22);
    ctx.fillRect(0, h - 26, w, 26);
    return c;
  });
}

// Cloud overlay for Earth.
export function cloudTexture() {
  return texture('clouds', () => {
    const w = 1024, h = 512;
    const c = makeCanvas(w, h);
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    splatter(ctx, w, h, '#ffffff', 700, 6, 26, 0.5);
    return c;
  });
}

// Banded gas/ice giant (Jupiter, Saturn, Uranus, Neptune).
export function gasGiantTexture(body) {
  return texture('gas-' + body.id, () => {
    const w = 1024, h = 512;
    const c = makeCanvas(w, h);
    const ctx = c.getContext('2d');
    const base = new THREE.Color(body.color);
    let y = 0;
    while (y < h) {
      const band = 8 + Math.random() * 34;
      const l = (Math.random() - 0.5) * 0.22;
      const col = base.clone(); col.offsetHSL(0, 0, l);
      ctx.fillStyle = hex(col.getHex());
      ctx.fillRect(0, y, w, band + 1);
      y += band;
    }
    // soften with horizontal swirl streaks
    splatter(ctx, w, h, shade(body.color, 0.08), 400, 3, 10, 0.25);
    // Jupiter's Great Red Spot
    if (body.id === 'jupiter') {
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#b5462f';
      ctx.beginPath();
      ctx.ellipse(w * 0.7, h * 0.62, 48, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    return c;
  });
}

// The Sun's glowing surface.
export function sunTexture() {
  return texture('sun', () => {
    const w = 1024, h = 512;
    const c = makeCanvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffcf66'; ctx.fillRect(0, 0, w, h);
    splatter(ctx, w, h, '#ff9a2e', 1200, 3, 12, 0.4);
    splatter(ctx, w, h, '#fff4c4', 900, 2, 8, 0.5);
    splatter(ctx, w, h, '#ff7a14', 200, 4, 16, 0.3);
    return c;
  });
}

// Galaxy / nebula billboard sprite (radial spiral glow).
export function galaxySprite(color = 0xbfd0ff, type = 'spiral') {
  return texture('galaxy-' + color + '-' + type, () => {
    const s = 256;
    const c = makeCanvas(s, s);
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    const col = hex(color);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.18, col);
    g.addColorStop(0.55, col.replace('rgb', 'rgba').replace(')', ',0.35)'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    if (type === 'spiral') {
      ctx.translate(s / 2, s / 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 4;
      for (let arm = 0; arm < 2; arm++) {
        ctx.beginPath();
        for (let t = 0; t < 6; t += 0.05) {
          const r = t * 9;
          const a = t + arm * Math.PI;
          const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.5;
          t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    return c;
  });
}

// Soft round star/glow sprite used for point lights and labels.
export function glowSprite(color = 0xffffff) {
  return texture('glow-' + color, () => {
    const s = 128;
    const c = makeCanvas(s, s);
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    const col = hex(color);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, col);
    g.addColorStop(0.5, col.replace('rgb', 'rgba').replace(')', ',0.4)'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    return c;
  });
}

// Saturn / Uranus ring band texture (transparent edges).
export function ringTexture(color = 0xe3c98f) {
  return texture('ring-' + color, () => {
    const w = 512, h = 16;
    const c = makeCanvas(w, h);
    const ctx = c.getContext('2d');
    for (let x = 0; x < w; x++) {
      const t = x / w;
      const a = 0.15 + 0.6 * Math.abs(Math.sin(t * 40)) * (1 - Math.abs(t - 0.5) * 1.4);
      const col = new THREE.Color(color); col.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);
      ctx.fillStyle = col.getStyle();
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillRect(x, 0, 1, h);
    }
    ctx.globalAlpha = 1;
    return c;
  });
}
