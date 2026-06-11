// Galaxies Around — a universe simulator from Earth to the observable universe.
// Engine: renderer, shared camera, scale-level management, picking, fly-to.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { makeStarfield } from './engine/objects.js';
import {
  buildLadder, setActiveLadder, setScaleReadout, showInfo, hideInfo,
  showTooltip, hideTooltip, buildSearch, wireChrome, hideLoading,
} from './ui.js';

import { createEarthLevel } from './levels/earth.js';
import { createSolarSystemLevel } from './levels/solarSystem.js';
import { createInterstellarLevel } from './levels/interstellar.js';
import { createMilkyWayLevel } from './levels/milkyWay.js';
import { createLocalGroupLevel } from './levels/localGroup.js';
import { createObservableUniverseLevel } from './levels/observableUniverse.js';

// ---------- Renderer / scene / camera ----------
const viewport = document.getElementById('viewport');
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
viewport.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.02, 5e7);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.7;
controls.zoomSpeed = 1.1;

// global faint backdrop of stars (always behind every scale)
scene.add(makeStarfield(2600, 9000, 6));

// ---------- Levels (innermost → outermost) ----------
const levels = [
  createEarthLevel(),
  createSolarSystemLevel(),
  createInterstellarLevel(),
  createMilkyWayLevel(),
  createLocalGroupLevel(),
  createObservableUniverseLevel(),
];
levels.forEach((lvl) => { lvl.group.visible = false; scene.add(lvl.group); });

let current = 0;

// Global searchable catalog: name → {levelIndex, id}
const catalog = [];
const levelIds = levels.map((l) => l.id);
levels.forEach((lvl, i) => {
  lvl.interactives.forEach((o) => {
    const info = o.userData.info;
    if (info && info.name) catalog.push({ name: info.name, levelIndex: i, id: info.id });
    // if an object represents a deeper scale we can dive into, remember it
    const target = levelIds.indexOf(info && info.id);
    if (target >= 0 && target < i) o.userData.proxyLevel = target;
  });
});

// ---------- Camera framing helpers ----------
const tmp = new THREE.Vector3();

function frameLevel(lvl, entryDist) {
  controls.target.copy(lvl.bounds.target);
  const dir = lvl.bounds.viewDir.clone().normalize();
  camera.position.copy(lvl.bounds.target).addScaledVector(dir, entryDist);
  // keep the camera just outside the central body's surface
  controls.minDistance = lvl.bounds.minDist * 0.9;
  controls.maxDistance = lvl.bounds.maxDist;
  controls.update();
}

// direction: 'default' | 'fromInner' (zoomed out of a smaller scale, arrive zoomed-in)
//            | 'fromOuter' (zoomed into a bigger scale, arrive zoomed-out)
function enterLevel(index, direction = 'default') {
  index = Math.max(0, Math.min(levels.length - 1, index));
  levels[current].group.visible = false;
  current = index;
  const lvl = levels[current];
  lvl.group.visible = true;

  const { minDist, maxDist, defaultDist } = lvl.bounds;
  let dist = defaultDist;
  if (direction === 'fromInner') dist = minDist + (maxDist - minDist) * 0.22;
  if (direction === 'fromOuter') dist = minDist + (maxDist - minDist) * 0.72;
  frameLevel(lvl, dist);

  setActiveLadder(current);
  setScaleReadout(lvl.name, lvl.scaleLabel);
  cancelFly();
}

// ---------- Fly-to animation ----------
const fly = { active: false, t: 0, dur: 1.4, fromPos: new THREE.Vector3(), toPos: new THREE.Vector3(), fromTgt: new THREE.Vector3(), toTgt: new THREE.Vector3() };
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
function cancelFly() { fly.active = false; }

function flyTo(object, radius, factor = 3.2) {
  object.getWorldPosition(fly.toTgt);
  // keep current viewing direction for a natural sweep
  tmp.copy(camera.position).sub(controls.target);
  if (tmp.lengthSq() < 1e-6) tmp.copy(levels[current].bounds.viewDir);
  tmp.normalize();
  const dist = radius * factor;
  fly.toPos.copy(fly.toTgt).addScaledVector(tmp, dist);
  fly.fromPos.copy(camera.position);
  fly.fromTgt.copy(controls.target);
  fly.t = 0; fly.active = true;
  // let the camera wheel right down to (but never through) this object's surface
  controls.minDistance = Math.max(radius * 1.05, 1e-3);
}

function updateFly(dt) {
  if (!fly.active) return;
  fly.t = Math.min(1, fly.t + dt / fly.dur);
  const k = easeInOut(fly.t);
  camera.position.lerpVectors(fly.fromPos, fly.toPos, k);
  controls.target.lerpVectors(fly.fromTgt, fly.toTgt, k);
  if (fly.t >= 1) fly.active = false;
}

// ---------- Selection ----------
function select(object) {
  const data = object.userData.info;
  if (!data) return;
  const radius = object.userData.radius || 1;
  flyTo(object, radius);

  const actions = [];
  const surfaceKinds = ['planet', 'moon', 'star'];
  if (data.hasSurface || surfaceKinds.includes(data.kind) || data.spectral) {
    actions.push({ label: 'Zoom to surface', onClick: () => flyTo(object, radius, 1.25) });
  }
  if (object.userData.proxyLevel != null) {
    actions.push({ label: `Fly inside ${data.name} ↗`, onClick: () => enterLevel(object.userData.proxyLevel, 'default') });
  }
  showInfo(data, actions);
}

function focusById(levelIndex, id) {
  if (levelIndex !== current) enterLevel(levelIndex, 'default');
  const lvl = levels[current];
  const obj = lvl.interactives.find((o) => o.userData.info && o.userData.info.id === id);
  if (obj) setTimeout(() => select(obj), 60);
}

// ---------- Picking ----------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let down = null;

function setPointer(e) {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function intersect() {
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(levels[current].interactives, true);
  // bubble up to the pickable ancestor
  for (const h of hits) {
    let o = h.object;
    while (o && !(o.userData && o.userData.pickable)) o = o.parent;
    if (o) return o;
  }
  return null;
}

renderer.domElement.addEventListener('pointerdown', (e) => {
  down = { x: e.clientX, y: e.clientY, t: performance.now() };
});
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  const quick = performance.now() - down.t < 400;
  down = null;
  if (moved < 6 && quick) {
    setPointer(e);
    const obj = intersect();
    if (obj) select(obj);
  }
});

let hoverRAF = 0;
renderer.domElement.addEventListener('pointermove', (e) => {
  if (hoverRAF) return;
  hoverRAF = requestAnimationFrame(() => {
    hoverRAF = 0;
    setPointer(e);
    const obj = intersect();
    if (obj && obj.userData.info) {
      showTooltip(obj.userData.info.name, e.clientX, e.clientY);
      renderer.domElement.style.cursor = 'pointer';
    } else {
      hideTooltip();
      renderer.domElement.style.cursor = 'grab';
    }
  });
});

// ---------- Zoom-driven scale transitions ----------
let transitionLock = 0;
function maybeTransition(zoomingOut) {
  if (performance.now() < transitionLock) return;
  const lvl = levels[current];
  const dist = camera.position.distanceTo(controls.target);
  if (zoomingOut && dist >= lvl.bounds.maxDist - 1e-3 && current < levels.length - 1) {
    transitionLock = performance.now() + 700;
    enterLevel(current + 1, 'fromInner');
  } else if (!zoomingOut && dist <= lvl.bounds.minDist + 1e-3 && current > 0) {
    // only dive to the inner scale when focused on the level's own centre —
    // when orbiting a clicked planet, zooming in just approaches its surface
    if (controls.target.distanceTo(lvl.bounds.target) > lvl.bounds.minDist * 0.5) return;
    transitionLock = performance.now() + 700;
    enterLevel(current - 1, 'fromOuter');
  }
}
let lastWheelDir = 0, lastWheelTime = 0;
renderer.domElement.addEventListener('wheel', (e) => {
  lastWheelDir = e.deltaY > 0 ? 1 : -1;
  lastWheelTime = performance.now();
}, { passive: true });

// ---------- Zoom buttons ----------
function dolly(factor) {
  cancelFly();
  tmp.copy(camera.position).sub(controls.target);
  const d = THREE.MathUtils.clamp(tmp.length() * factor, controls.minDistance, controls.maxDistance);
  camera.position.copy(controls.target).addScaledVector(tmp.normalize(), d);
  controls.update();
  maybeTransition(factor > 1);
}
document.getElementById('zoom-in').addEventListener('click', () => dolly(0.6));
document.getElementById('zoom-out').addEventListener('click', () => dolly(1.7));
document.getElementById('reset-view').addEventListener('click', () => {
  enterLevel(current, 'default'); hideInfo();
});

// ---------- HUD wiring ----------
buildLadder(levels, (i) => { hideInfo(); enterLevel(i, 'default'); });
buildSearch(catalog, (hit) => focusById(hit.levelIndex, hit.id));
wireChrome();

// ---------- Resize ----------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- Animation loop ----------
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  levels[current].update(dt, clock.elapsedTime);
  // spin any "you are here" markers
  levels[current].group.traverse((o) => { if (o.userData && o.userData.spin) o.rotation.z += dt * 0.6; });
  updateFly(dt);
  controls.update();
  // once OrbitControls has applied the latest zoom, see if we crossed a scale edge
  if (lastWheelTime && performance.now() - lastWheelTime < 140) maybeTransition(lastWheelDir > 0);
  renderer.render(scene, camera);
}

// ---------- Boot ----------
enterLevel(0, 'default');
animate();
setTimeout(hideLoading, 500);

// expose a tiny API for debugging / the console
window.GalaxiesAround = { enterLevel, focusById, levels };
