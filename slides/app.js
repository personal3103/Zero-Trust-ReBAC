// Document-Slide Controller, Outline Rail & OpenFGA Docker Store Auto-Connector
const slides = Array.from(document.querySelectorAll('.slide'));
let currentSlide = 0;
let cachedStoreId = '';

function renderOutline() {
  const container = document.getElementById('outlineList');
  let html = '';
  let lastGroup = '';
  slides.forEach((s, i) => {
    const group = s.dataset.group || '';
    if (group && group !== lastGroup) {
      html += `<div class="outline-group">${group}</div>`;
      lastGroup = group;
    }
    html += `
      <button class="outline-item ${i === currentSlide ? 'active' : ''}" onclick="goToSlide(${i})">
        <span class="outline-num">${String(i + 1).padStart(2, '0')}</span>
        <span>${s.dataset.title}</span>
      </button>
    `;
  });
  container.innerHTML = html;
}

function updateUI() {
  if (document.body.classList.contains('iframe-expanded') && currentSlide !== 12) {
    setIframeExpanded(false);
  }
  slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
  document.getElementById('slideCounter').textContent =
    String(currentSlide + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  const pct = ((currentSlide + 1) / slides.length) * 100;
  document.getElementById('progressLine').style.width = pct + '%';

  const items = document.querySelectorAll('.outline-item');
  items.forEach((el, idx) => el.classList.toggle('active', idx === currentSlide));
  items[currentSlide]?.scrollIntoView({ block: 'nearest' });
}

function nextSlide() { if (currentSlide < slides.length - 1) { currentSlide++; updateUI(); } }
function prevSlide() { if (currentSlide > 0) { currentSlide--; updateUI(); } }
function goToSlide(idx) { currentSlide = Math.max(0, Math.min(slides.length - 1, idx)); updateUI(); }

function toggleOutline() {
  const el = document.getElementById('outlineRail');
  const btn = document.getElementById('outlineBtn');
  el.classList.toggle('collapsed');
  btn.classList.toggle('active', !el.classList.contains('collapsed'));
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.getElementById('outlineRail').classList.add('collapsed');
    document.getElementById('outlineBtn')?.classList.remove('active');
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function copyFullDsl(btn) {
  const txt = document.getElementById('dslBlock1').innerText + '\n\n' + document.getElementById('dslBlock2').innerText;
  navigator.clipboard?.writeText(txt);
  const old = btn.innerHTML;
  btn.textContent = 'Copied';
  setTimeout(() => btn.innerHTML = old, 1400);
}

function isHttpsPage() {
  return window.location.protocol === 'https:';
}

function isLocalDockerHost() {
  return !isHttpsPage() && (
    window.location.protocol === 'file:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
}

function buildPlaygroundUrl(storeName) {
  const base = 'http://localhost:3011/sandbox/?fga_api_scheme=http&fga_api_host=localhost%3A8092&fga_api_token=';
  return storeName ? `${base}&store=${encodeURIComponent(storeName)}` : base;
}

async function initOpenFgaIframe() {
  const frame = document.getElementById('openfgaFrame');
  const statusEl = document.getElementById('openfgaDockerStatus');
  const urlEl = document.getElementById('openfgaFrameUrl');
  const openExt = document.getElementById('openfgaExternalLink');
  const bPlay = document.getElementById('btnFramePlay');
  const bLocal = document.getElementById('btnFrameLocal');
  if (!frame) return;

  // On GitHub Pages (HTTPS), play.fga.dev cannot load our local ekila-lms-b2c store
  // (api.playground-us1.fga.dev returns 403 and cross-origin localhost PNA is blocked),
  // so default directly to Ekila OpenFGA Studio (openfga-local.html) with full in-browser
  // model/tuples/Check/Graph/Assertions + optional live Docker :8092 sync.
  if (isHttpsPage()) {
    if (bPlay) bPlay.style.display = 'none';
    switchOpenFgaFrame('local');
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('http://localhost:8092/stores', { signal: controller.signal });
      clearTimeout(t);
      const data = await res.json();
      const store = (data.stores || []).find(s => s.name === 'ekila-lms-b2c') || (data.stores || [])[0];
      if (store && statusEl) {
        cachedStoreId = store.name || store.id;
        statusEl.textContent = `Docker :8092 CONNECTED (${store.name})`;
        statusEl.className = 'badge p2';
        return;
      }
    } catch (_) {}
    if (statusEl) {
      statusEl.textContent = 'In-Browser Engine • ekila-lms-b2c (15 Tuples)';
      statusEl.className = 'badge p2';
    }
    return;
  }

  try {
    const res = await fetch('http://localhost:8092/stores');
    const data = await res.json();
    const store = (data.stores || []).find(s => s.name === 'ekila-lms-b2c') || (data.stores || [])[0];
    if (store) {
      cachedStoreId = store.name || store.id;
      const playUrl = buildPlaygroundUrl(cachedStoreId);
      frame.src = playUrl;
      if (urlEl) urlEl.textContent = `OpenFGA Playground • Store: ${store.name} (${store.id})`;
      if (openExt) openExt.href = playUrl;
      if (statusEl) {
        statusEl.textContent = `Docker :8092 CONNECTED (${store.name})`;
        statusEl.className = 'badge p2';
      }
      return;
    }
  } catch (err) {
    // Docker offline or unreachable
  }

  switchOpenFgaFrame('local');
  if (bPlay) bPlay.classList.remove('active');
  if (bLocal) bLocal.classList.add('active');
  if (statusEl) {
    statusEl.textContent = 'In-Browser Engine (Docker :8092 Offline)';
    statusEl.className = 'badge p2';
  }
}

function switchOpenFgaFrame(mode) {
  const frame = document.getElementById('openfgaFrame');
  const urlEl = document.getElementById('openfgaFrameUrl');
  const openExt = document.getElementById('openfgaExternalLink');
  const bPlay = document.getElementById('btnFramePlay');
  const bLocal = document.getElementById('btnFrameLocal');
  if (!frame) return;

  if (mode === 'local' || isHttpsPage()) {
    frame.src = 'openfga-local.html';
    if (urlEl) urlEl.textContent = 'Ekila OpenFGA Studio • Store: ekila-lms-b2c (15 Tuples, Interactive Check & Graph)';
    if (openExt) openExt.href = 'openfga-local.html';
    bPlay?.classList.remove('active');
    bLocal?.classList.add('active');
  } else {
    const playUrl = buildPlaygroundUrl(cachedStoreId || 'ekila-lms-b2c');
    frame.src = playUrl;
    if (urlEl) urlEl.textContent = cachedStoreId
      ? `OpenFGA Playground • Store: ekila-lms-b2c (${cachedStoreId})`
      : 'OpenFGA Playground (:3011)';
    if (openExt) openExt.href = playUrl;
    bLocal?.classList.remove('active');
    bPlay?.classList.add('active');
  }
}

function setIframeExpanded(expanded) {
  document.body.classList.toggle('iframe-expanded', expanded);
  const btn = document.getElementById('btnToggleIframeExpand');
  if (!btn) return;
  if (expanded) {
    btn.classList.add('active');
    btn.innerHTML = `<svg class="ico-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg> Thu nhỏ (Esc)`;
  } else {
    btn.classList.remove('active');
    btn.innerHTML = `<svg class="ico-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg> Phóng to Iframe`;
  }
}

function toggleIframeExpand() {
  setIframeExpanded(!document.body.classList.contains('iframe-expanded'));
}

document.addEventListener('keydown', (e) => {
  if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (e.key === 'Escape' && document.body.classList.contains('iframe-expanded')) {
    setIframeExpanded(false);
    return;
  }
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
  else if (e.key.toLowerCase() === 'm') toggleOutline();
  else if (e.key.toLowerCase() === 'f') toggleFullscreen();
});

renderOutline();
updateUI();
initOpenFgaIframe();
