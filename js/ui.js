// DOM / HUD layer: info panel, scale ladder, tooltip, search, help modal.

const $ = (sel) => document.querySelector(sel);

const KIND_LABEL = {
  star: 'Star', planet: 'Planet', moon: 'Moon', galaxy: 'Galaxy',
  blackhole: 'Black hole', nebula: 'Nebula', cluster: 'Star cluster',
  structure: 'Cosmic structure', universe: 'Everything', marker: 'Location',
};

export function buildLadder(levels, onJump) {
  const nav = $('#ladder');
  nav.innerHTML = '';
  levels.forEach((lvl, i) => {
    const btn = document.createElement('button');
    btn.className = 'ladder-item';
    btn.dataset.index = i;
    btn.innerHTML = `<span class="ladder-dot"></span>
      <span class="ladder-label"><b>${lvl.name}</b><span>${lvl.scaleLabel}</span></span>`;
    btn.addEventListener('click', () => onJump(i));
    nav.appendChild(btn);
  });
}

export function setActiveLadder(index) {
  document.querySelectorAll('.ladder-item').forEach((el) => {
    el.classList.toggle('active', Number(el.dataset.index) === index);
  });
}

export function setScaleReadout(name, scale) {
  $('#level-name').textContent = name;
  $('#level-scale').textContent = scale;
}

// Render the info panel for a selected object. `actions` = [{label,onClick,secondary}]
export function showInfo(data, actions = []) {
  const panel = $('#info-panel');
  const el = $('#info-content');
  const kind = KIND_LABEL[data.kind] || (data.spectral ? 'Star' : 'Object');

  const stats = data.stats
    ? `<div class="info-stats">${Object.entries(data.stats)
        .map(([k, v]) => `<div class="stat"><div class="k">${k}</div><div class="v">${v}</div></div>`)
        .join('')}</div>`
    : '';

  const facts = data.facts && data.facts.length
    ? `<ul class="info-facts">${data.facts.map((f) => `<li>${f}</li>`).join('')}</ul>`
    : '';

  const sub = data.type || data.spectral || '';

  el.innerHTML = `
    <div class="info-kicker">${kind}</div>
    <div class="info-title">${data.name}</div>
    ${sub ? `<div class="info-sub">${sub}</div>` : ''}
    <p class="info-desc">${data.desc || ''}</p>
    ${stats}
    ${facts}
    <div class="info-actions"></div>
    ${data.source ? `<div class="info-source">Source: <a href="${data.source}" target="_blank" rel="noopener">NASA</a></div>` : ''}
  `;

  const actBox = el.querySelector('.info-actions');
  actions.forEach((a) => {
    const b = document.createElement('button');
    b.className = 'info-btn' + (a.secondary ? ' secondary' : '');
    b.textContent = a.label;
    b.addEventListener('click', a.onClick);
    actBox.appendChild(b);
  });

  panel.hidden = false;
}

export function hideInfo() { $('#info-panel').hidden = true; }

export function showTooltip(text, x, y) {
  const t = $('#tooltip');
  t.textContent = text;
  t.style.left = x + 'px';
  t.style.top = y + 'px';
  t.hidden = false;
}
export function hideTooltip() { $('#tooltip').hidden = true; }

export function buildSearch(catalog, onPick) {
  const list = $('#search-list');
  list.innerHTML = catalog.map((c) => `<option value="${c.name}"></option>`).join('');
  const input = $('#search');
  const submit = () => {
    const v = input.value.trim().toLowerCase();
    const hit = catalog.find((c) => c.name.toLowerCase() === v)
      || catalog.find((c) => c.name.toLowerCase().includes(v) && v.length > 1);
    if (hit) { onPick(hit); input.blur(); }
  };
  input.addEventListener('change', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
}

export function wireChrome() {
  $('#help-btn').addEventListener('click', () => ($('#help-modal').hidden = false));
  $('#help-close').addEventListener('click', () => ($('#help-modal').hidden = true));
  $('#help-modal').addEventListener('click', (e) => {
    if (e.target.id === 'help-modal') e.currentTarget.hidden = true;
  });
  $('#info-close').addEventListener('click', hideInfo);
}

export function hideLoading() {
  const l = $('#loading');
  l.classList.add('hidden');
  setTimeout(() => (l.hidden = true), 900);
}
