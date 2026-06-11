// Helpers for making objects clickable / fly-to-able and adding HUD markers.
import * as THREE from 'three';
import { glowSprite } from './textures.js';

// Tag an object so the picker/search can find it.
//   data   – the info record shown in the panel
//   radius – world-space radius used to frame the camera when flying to it
export function pickable(object, data, radius, extra = {}) {
  object.userData = Object.assign({ pickable: true, info: data, radius }, extra);
  object.userData.focusTarget = object;
  return object;
}

// An invisible sphere used as a generous click/hover target for diffuse
// things (a galaxy made of points, a distant cluster, …).
export function pickProxy(radius) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 16),
    new THREE.MeshBasicMaterial({ visible: false, depthWrite: false })
  );
  return m;
}

// A subtle selection/“you are here” marker ring.
export function marker(radius, color = 0x6cc6ff) {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(radius * 1.4, radius * 1.55, 48),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false })
  );
  ring.lookAt(0, 1, 0);
  g.add(ring);
  g.userData.spin = true;
  return g;
}

// A small always-facing glow used to make faint things visible & clickable.
export function dot(size, color) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowSprite(color), color, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  s.scale.setScalar(size);
  return s;
}
