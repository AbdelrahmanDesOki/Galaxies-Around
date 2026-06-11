// Reusable Three.js object factories shared across every cosmic scale.
import * as THREE from 'three';
import {
  rockyTexture, earthTexture, cloudTexture, gasGiantTexture,
  sunTexture, galaxySprite, glowSprite, ringTexture,
} from './textures.js';

// ---------- Real NASA imagery (with procedural fallback) ----------
// Earth & Moon use NASA Blue Marble / Visible Earth derived maps vendored
// in assets/textures/planets. If a map fails to load (e.g. file moved),
// the procedural canvas texture takes over so the app never breaks.
const TEX_BASE = './assets/textures/planets/';
const texLoader = new THREE.TextureLoader();

function realMap(file, { srgb = true, onFail } = {}) {
  const tex = texLoader.load(TEX_BASE + file, undefined, undefined, () => onFail && onFail());
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  return tex;
}

// Photorealistic Earth: 4K day map + terrain relief + glinting oceans +
// real cloud layer + night-side city lights.
function makeRealEarth(data, radius) {
  const mat = new THREE.MeshPhongMaterial({
    specular: new THREE.Color(0x444444),
    shininess: 22,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.65,
  });
  mat.map = realMap('earth_atmos_4096.jpg', {
    onFail: () => { mat.map = earthTexture(); mat.normalMap = mat.specularMap = mat.emissiveMap = null; mat.needsUpdate = true; },
  });
  mat.normalMap = realMap('earth_normal_2048.jpg', { srgb: false });
  mat.normalScale = new THREE.Vector2(0.85, 0.85);
  mat.specularMap = realMap('earth_specular_2048.jpg', { srgb: false });
  mat.emissiveMap = realMap('earth_lights_2048.png');

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 96), mat);
  mesh.rotation.z = THREE.MathUtils.degToRad(data.axialTilt || 0);

  const cloudMat = new THREE.MeshLambertMaterial({ transparent: true, depthWrite: false });
  cloudMat.map = realMap('earth_clouds_2048.png', {
    onFail: () => { cloudMat.map = cloudTexture(); cloudMat.opacity = 0.55; cloudMat.needsUpdate = true; },
  });
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.008, 96, 96), cloudMat);
  clouds.name = 'clouds';
  mesh.add(clouds);
  mesh.add(atmosphere(radius, 0x6cc6ff));
  return mesh;
}

// A solid celestial body (planet / moon). `data` drives which texture to use.
export function makeBody(data, radius) {
  if (data.id === 'earth') return makeRealEarth(data, radius);

  const geo = new THREE.SphereGeometry(radius, 64, 64);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0.0 });
  if (data.id === 'moon') {
    mat.map = realMap('moon_1024.jpg', {
      onFail: () => { mat.map = rockyTexture(data); mat.needsUpdate = true; },
    });
  } else if (data.banded || data.id === 'uranus' || data.id === 'neptune') {
    mat.map = gasGiantTexture(data);
  } else {
    mat.map = rockyTexture(data);
  }
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.z = THREE.MathUtils.degToRad((data.axialTilt || 0) % 180);
  if (data.rings) mesh.add(makeRings(data, radius));
  return mesh;
}

// Thin atmospheric halo (back-side additive shell).
export function atmosphere(radius, color) {
  const mat = new THREE.MeshBasicMaterial({
    color, transparent: true, opacity: 0.18,
    side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
  });
  return new THREE.Mesh(new THREE.SphereGeometry(radius * 1.08, 48, 48), mat);
}

// Planetary ring system (Saturn / Uranus / Neptune).
export function makeRings(data, radius) {
  const inner = radius * 1.4;
  const outer = radius * (data.id === 'saturn' ? 2.3 : 1.9);
  const geo = new THREE.RingGeometry(inner, outer, 96);
  // remap UVs so the band texture runs radially
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const r = (v.length() - inner) / (outer - inner);
    uv.setXY(i, r, (i % 2));
  }
  const mat = new THREE.MeshBasicMaterial({
    map: ringTexture(data.color), side: THREE.DoubleSide,
    transparent: true, opacity: 0.85, depthWrite: false,
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI / 2;
  return ring;
}

// A glowing star (the Sun, or any distant star) = emissive core + glow sprite.
export function makeStar(radius, color, withTexture = false) {
  const group = new THREE.Group();
  const mat = withTexture
    ? new THREE.MeshBasicMaterial({ map: sunTexture() })
    : new THREE.MeshBasicMaterial({ color });
  const core = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat);
  group.add(core);

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowSprite(color), color, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  glow.scale.setScalar(radius * 6);
  group.add(glow);
  return group;
}

// Flat dashed orbit ring in the XZ plane.
export function makeOrbit(radius, color = 0x3a4a78) {
  const seg = 160;
  const pts = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4 });
  return new THREE.LineLoop(geo, mat);
}

// A galaxy/nebula/cluster billboard.
export function makeGalaxyBillboard(size, color = 0xbfd0ff, type = 'spiral') {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: galaxySprite(color, type), color: 0xffffff,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sprite.scale.setScalar(size);
  return sprite;
}

// Background starfield as a Points cloud.
export function makeStarfield(count = 3000, spread = 6000, size = 2) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [
    [1, 1, 1], [0.8, 0.86, 1], [1, 0.9, 0.78], [1, 0.78, 0.66], [0.9, 0.92, 1],
  ];
  for (let i = 0; i < count; i++) {
    // distribute on a shell-ish volume
    const r = spread * (0.6 + Math.random() * 0.4);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
    const c = palette[(Math.random() * palette.length) | 0];
    const b = 0.5 + Math.random() * 0.5;
    col[i * 3] = c[0] * b; col[i * 3 + 1] = c[1] * b; col[i * 3 + 2] = c[2] * b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size, vertexColors: true, transparent: true, opacity: 0.9,
    sizeAttenuation: true, depthWrite: false,
  });
  const points = new THREE.Points(geo, mat);
  points.name = 'starfield';
  return points;
}

// A flat spiral-galaxy disk made of coloured points (used for the Milky Way view).
export function makeSpiralGalaxy({
  stars = 9000, radius = 1000, arms = 4, spin = 4.2, thickness = 40,
  coreColor = 0xffe6b0, armColor = 0x9fc0ff,
} = {}) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(stars * 3);
  const col = new Float32Array(stars * 3);
  const core = new THREE.Color(coreColor);
  const arm = new THREE.Color(armColor);
  for (let i = 0; i < stars; i++) {
    const t = Math.pow(Math.random(), 0.6);     // denser toward centre
    const r = t * radius;
    const armIndex = i % arms;
    const branch = (armIndex / arms) * Math.PI * 2;
    const spinA = r / radius * spin;
    const spread = (1 - t) * 0.6 + 0.04;
    const scatter = () => (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1)) * spread * radius * 0.12;
    const a = branch + spinA;
    const x = Math.cos(a) * r + scatter();
    const z = Math.sin(a) * r + scatter();
    const y = scatter() * (thickness / (radius * 0.12)) * 0.5;
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    const c = core.clone().lerp(arm, t);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: radius * 0.004, vertexColors: true, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

// A point-cloud "cosmic web" of galaxies for the observable-universe view.
export function makeCosmicWeb({ count = 6000, radius = 2400 } = {}) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [new THREE.Color(0xbfd0ff), new THREE.Color(0xffd9b0), new THREE.Color(0xd8c0ff)];
  // cluster galaxies around random nodes to suggest filaments/voids
  const nodes = [];
  for (let i = 0; i < 60; i++) {
    nodes.push(new THREE.Vector3(
      (Math.random() - 0.5) * 2 * radius,
      (Math.random() - 0.5) * 2 * radius,
      (Math.random() - 0.5) * 2 * radius,
    ));
  }
  for (let i = 0; i < count; i++) {
    const n = nodes[(Math.random() * nodes.length) | 0];
    const spread = radius * 0.18 * Math.pow(Math.random(), 2);
    const x = n.x + (Math.random() - 0.5) * spread * 2;
    const y = n.y + (Math.random() - 0.5) * spread * 2;
    const z = n.z + (Math.random() - 0.5) * spread * 2;
    const d = Math.sqrt(x * x + y * y + z * z);
    if (d > radius) { i--; continue; }       // keep within sphere
    pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    const c = palette[(Math.random() * palette.length) | 0];
    const b = 0.5 + Math.random() * 0.5;
    col[i * 3] = c.r * b; col[i * 3 + 1] = c.g * b; col[i * 3 + 2] = c.b * b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: radius * 0.006, vertexColors: true, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}
