// Level 1 — The Solar System: the Sun and eight planets on compressed orbits.
import * as THREE from 'three';
import { makeBody, makeStar, makeOrbit } from '../engine/objects.js';
import { pickable } from '../engine/interactive.js';
import { SUN, PLANETS } from '../data/solarSystem.js';

// Compress real AU distances and real radii so everything is visible at once.
const orbitDist = (au) => 18 * Math.pow(au, 0.62);
const bodyRadius = (km) => 0.5 + 1.7 * (Math.log10(km) - 3.3);

export function createSolarSystemLevel() {
  const group = new THREE.Group();
  group.add(new THREE.AmbientLight(0x404a66, 0.6));
  const sunLight = new THREE.PointLight(0xfff2cc, 3.2, 0, 0.6);
  group.add(sunLight);

  // Sun
  const sun = makeStar(5, 0xffd27a, true);
  pickable(sun, SUN, 5);
  group.add(sun);

  const planetNodes = [];
  for (const p of PLANETS) {
    const dist = orbitDist(p.distanceAU);
    const radius = bodyRadius(p.radiusKm);
    group.add(makeOrbit(dist));

    const pivot = new THREE.Group();
    pivot.rotation.y = Math.random() * Math.PI * 2;
    const mesh = makeBody(p, radius);
    mesh.position.set(dist, 0, 0);
    pickable(mesh, p, radius, { spinSpeed: (p.dayLengthHr < 0 ? -1 : 1) * 0.4 });
    pivot.add(mesh);
    group.add(pivot);
    // angular speed ∝ 1/period, scaled up so motion is visible
    planetNodes.push({ pivot, mesh, speed: 1.6 / Math.sqrt(p.distanceAU) * 0.15 });
  }

  return {
    id: 'solar', name: 'Solar System', scaleLabel: '~9 billion km across',
    group,
    interactives: [sun, ...planetNodes.map((n) => n.mesh)],
    bounds: { target: new THREE.Vector3(0, 0, 0), minDist: 7, defaultDist: 150, maxDist: 360, viewDir: new THREE.Vector3(0.2, 0.5, 1) },
    update(dt) {
      sun.children[0].rotation.y += 0.04 * dt;
      for (const n of planetNodes) {
        n.pivot.rotation.y += n.speed * dt;
        n.mesh.rotation.y += n.mesh.userData.spinSpeed * dt;
      }
    },
  };
}
