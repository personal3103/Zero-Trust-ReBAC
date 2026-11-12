// Document-Slide Controller, Outline Rail & OpenFGA Playground Viewer
const slides = Array.from(document.querySelectorAll('.slide'));
let currentSlide = 0;

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

function initOpenFgaIframe() {
  const frame = document.getElementById('openfgaFrame');
  const openExt = document.getElementById('openfgaExternalLink');
  if (!frame) return;
  if (!frame.getAttribute('src') || frame.getAttribute('src') === 'about:blank') {
    frame.src = 'openfga-playground.html';
  }
  if (openExt) openExt.href = 'openfga-playground.html';
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
