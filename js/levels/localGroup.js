// Level 4 — The Local Group: the Milky Way, Andromeda and their companions.
import * as THREE from 'three';
import { makeGalaxyBillboard } from '../engine/objects.js';
import { pickable, marker } from '../engine/interactive.js';
import { LOCAL_GROUP } from '../data/galaxies.js';

const MLY = 260; // scene units per million light-years

export function createLocalGroupLevel() {
  const group = new THREE.Group();
  group.add(new THREE.AmbientLight(0xffffff, 0.9));

  const interactives = [];
  for (const g of LOCAL_GROUP) {
    const [x, y, z] = g.pos;
    const size = Math.max(40, (g.diameterLy / 220000) * 130);
    const bill = makeGalaxyBillboard(size, g.color, g.galaxyType);
    bill.position.set(x * MLY, y * MLY, z * MLY);
    pickable(bill, g, size * 0.4);
    group.add(bill);
    interactives.push(bill);
    if (g.id === 'milkyway') {
      const m = marker(size * 0.5, 0x6cc6ff);
      m.position.copy(bill.position);
      group.add(m);
    }
  }

  return {
    id: 'localgroup', name: 'The Local Group', scaleLabel: '~10 million light-years across',
    group,
    interactives,
    bounds: { target: new THREE.Vector3(MLY * 1.2, 0, 0), minDist: 60, defaultDist: 1100, maxDist: 2600, viewDir: new THREE.Vector3(0.2, 0.5, 1) },
    update() {},
  };
}
