// Level 0 — Earth: spin the globe, watch the Moon, zoom to the surface.
import * as THREE from 'three';
import { makeBody, makeStar } from '../engine/objects.js';
import { pickable } from '../engine/interactive.js';
import { PLANETS, MOON } from '../data/solarSystem.js';

export function createEarthLevel() {
  const group = new THREE.Group();
  const earthData = PLANETS.find((p) => p.id === 'earth');

  // sunlight from one side; ambient kept low so the night side stays dark
  // and the real city-lights map can glow against it
  const sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.position.set(8, 3, 6);
  group.add(sun);
  group.add(new THREE.AmbientLight(0x223355, 0.35));

  const earth = makeBody(earthData, 1);
  pickable(earth, { ...earthData, hasSurface: true }, 1, { spinSpeed: 0.06 });
  group.add(earth);

  // The Moon orbiting (distance compressed for a nice frame).
  const moonPivot = new THREE.Group();
  const moon = makeBody({ ...MOON, axialTilt: 0 }, MOON.radiusKm / earthData.radiusKm);
  moon.position.set(6, 0, 0);
  pickable(moon, MOON, MOON.radiusKm / earthData.radiusKm);
  moonPivot.add(moon);
  group.add(moonPivot);

  // a little Sun glow far off to give context
  const sunGlow = makeStar(0.6, 0xffd27a);
  sunGlow.position.set(40, 14, 28);
  group.add(sunGlow);

  return {
    id: 'earth', name: 'Earth', scaleLabel: '12,742 km across',
    group,
    interactives: [earth, moon],
    bounds: { target: new THREE.Vector3(0, 0, 0), minDist: 1.25, defaultDist: 3.2, maxDist: 9, viewDir: new THREE.Vector3(0.4, 0.25, 1) },
    update(dt) {
      earth.rotation.y += earth.userData.spinSpeed * dt;
      const clouds = earth.getObjectByName('clouds');
      if (clouds) clouds.rotation.y += 0.08 * dt;
      moonPivot.rotation.y += 0.18 * dt;
    },
  };
}
