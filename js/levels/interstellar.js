// Level 2 — The Solar Neighbourhood: the Sun and the nearest stars (≤ 25 ly).
import * as THREE from 'three';
import { dot, pickable } from '../engine/interactive.js';
import { NEARBY_STARS } from '../data/stars.js';

const LY = 4.2; // scene units per light-year

export function createInterstellarLevel() {
  const group = new THREE.Group();
  group.add(new THREE.AmbientLight(0xffffff, 0.6));

  const interactives = [];
  for (const s of NEARBY_STARS) {
    const [x, y, z] = s.pos;
    const size = s.id === 'sol' ? 9 : 6 + Math.max(0, (6 - (s.distanceLy || 6)) * 0.4);
    const star = dot(size, s.color);
    star.position.set(x * LY, y * LY, z * LY);
    pickable(star, s, size * 0.18);
    group.add(star);
    interactives.push(star);
  }

  // faint connecting glow at the Sun to read as "home"
  return {
    id: 'interstellar', name: 'Solar Neighbourhood', scaleLabel: '~50 light-years across',
    group,
    interactives,
    bounds: { target: new THREE.Vector3(0, 0, 0), minDist: 9, defaultDist: 95, maxDist: 240, viewDir: new THREE.Vector3(0.3, 0.4, 1) },
    update() {},
  };
}
