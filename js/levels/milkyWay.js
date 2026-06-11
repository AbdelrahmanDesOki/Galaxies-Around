// Level 3 — The Milky Way: our barred-spiral galaxy seen from outside.
import * as THREE from 'three';
import { makeSpiralGalaxy } from '../engine/objects.js';
import { dot, marker, pickProxy, pickable } from '../engine/interactive.js';
import { MILKY_WAY } from '../data/galaxies.js';
import { GALACTIC_LANDMARKS } from '../data/stars.js';

const R = 1000; // galaxy disk radius in scene units (= ~50,000 ly)

export function createMilkyWayLevel() {
  const group = new THREE.Group();
  group.add(new THREE.AmbientLight(0xffffff, 0.8));

  const disk = makeSpiralGalaxy({ radius: R, arms: 4, stars: 12000 });
  group.add(disk);

  // glowing core bulge
  const core = dot(R * 0.5, 0xffe6b0);
  group.add(core);

  // whole-galaxy click target
  const galaxyProxy = pickProxy(R * 0.95);
  pickable(galaxyProxy, MILKY_WAY, R * 0.7);
  group.add(galaxyProxy);

  const interactives = [galaxyProxy];

  // Sgr A* at the very centre
  const sgr = GALACTIC_LANDMARKS.find((l) => l.id === 'sgrastar');
  const sgrDot = dot(70, sgr.color);
  pickable(sgrDot, sgr, 35);
  group.add(sgrDot);
  interactives.push(sgrDot);

  // "You are here" — the Sun, ~26,000 ly from the core (≈ 0.52 R)
  const sunPos = new THREE.Vector3(R * 0.52, 0, R * 0.04);
  const sunMark = marker(26, 0x6cc6ff);
  sunMark.position.copy(sunPos);
  group.add(sunMark);
  const sunDot = dot(46, 0xbfe0ff);
  sunDot.position.copy(sunPos);
  pickable(sunDot, {
    id: 'sunhere', name: 'You Are Here', kind: 'marker',
    desc: 'The Sun sits about 26,000 light-years from the galactic centre, on the inner edge of the Orion Arm — one ordinary star among hundreds of billions.',
    stats: { 'Distance from core': '26,000 ly', 'Arm': 'Orion (Local) Arm', 'Orbit period': '~230 million yrs' },
    source: 'https://science.nasa.gov/universe/galaxies/milky-way/',
  }, 30);
  group.add(sunDot);
  interactives.push(sunDot);

  // a few nearby landmarks scattered around the Sun's region
  const others = GALACTIC_LANDMARKS.filter((l) => l.id !== 'sgrastar');
  const offsets = [[60, 14, -40], [-50, -10, 70], [90, 18, 50]];
  others.forEach((l, i) => {
    const d = dot(34, l.color);
    d.position.copy(sunPos).add(new THREE.Vector3(...(offsets[i] || [0, 0, 0])));
    pickable(d, l, 20);
    group.add(d);
    interactives.push(d);
  });

  group.rotation.x = 0.5; // tilt for a 3/4 view

  return {
    id: 'milkyway', name: 'The Milky Way', scaleLabel: '~100,000 light-years across',
    group,
    interactives,
    bounds: { target: new THREE.Vector3(0, 0, 0), minDist: 60, defaultDist: 1700, maxDist: 3400, viewDir: new THREE.Vector3(0.1, 0.7, 1) },
    update(dt) { disk.rotation.y += 0.015 * dt; },
  };
}
