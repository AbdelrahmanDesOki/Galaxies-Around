// Level 5 — The Observable Universe: the cosmic web out to the edge of sight.
import * as THREE from 'three';
import { makeCosmicWeb } from '../engine/objects.js';
import { dot, pickProxy, pickable } from '../engine/interactive.js';
import { COSMIC_STRUCTURES, OBSERVABLE_UNIVERSE } from '../data/galaxies.js';

const R = 2400;

export function createObservableUniverseLevel() {
  const group = new THREE.Group();
  group.add(new THREE.AmbientLight(0xffffff, 0.9));

  const web = makeCosmicWeb({ count: 7000, radius: R });
  group.add(web);

  // The CMB shell = the visible edge of the universe.
  const cmb = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.02, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0xffb877, transparent: true, opacity: 0.05, side: THREE.BackSide, depthWrite: false })
  );
  group.add(cmb);

  const interactives = [];

  // whole-universe click target (innermost-priority handled by raycaster order)
  const universeProxy = pickProxy(R * 1.4);
  pickable(universeProxy, OBSERVABLE_UNIVERSE, R);
  group.add(universeProxy);
  interactives.push(universeProxy);

  // labelled large-scale structures
  const placements = {
    localgroup: [0, 0, 0],
    virgo: [R * 0.18, R * 0.05, -R * 0.1],
    laniakea: [R * 0.45, -R * 0.2, R * 0.2],
    cmb: [0, R * 0.92, 0],
  };
  for (const s of COSMIC_STRUCTURES) {
    const pos = placements[s.id] || [0, 0, 0];
    const size = s.id === 'cmb' ? 120 : s.id === 'localgroup' ? 70 : 110;
    const d = dot(size, s.color);
    d.position.set(...pos);
    pickable(d, s, size * 0.4);
    group.add(d);
    interactives.push(d);
  }

  return {
    id: 'universe', name: 'Observable Universe', scaleLabel: '93 billion light-years across',
    group,
    interactives,
    bounds: { target: new THREE.Vector3(0, 0, 0), minDist: 90, defaultDist: 4200, maxDist: 9000, viewDir: new THREE.Vector3(0.2, 0.35, 1) },
    update(dt) { web.rotation.y += 0.006 * dt; },
  };
}
