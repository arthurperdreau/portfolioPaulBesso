/**
 * Viewer « shading mode » : bascule Clay / Wireframe / Rendu avec un balayage
 * horizontal. Les touches 4 / 5 / 6 (comme dans Maya) pilotent le viewer
 * visible à l'écran.
 */
import { $, $$, reducedMotion } from './dom.js';

function setup(viewer) {
  const buttons = $$('[data-mode]', viewer);
  const layers = $$('[data-layer]', viewer);
  const label = $('[data-viewer-label]', viewer);
  const scan = $('.viewer__scan', viewer);
  let current = layers.findIndex((l) => l.classList.contains('is-active'));

  const show = (i) => {
    if (i === current || !layers[i]) return;
    layers.forEach((l) => l.classList.remove('is-leaving'));
    layers[current].classList.replace('is-active', 'is-leaving');
    layers[i].classList.add('is-active');
    buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    label.textContent = buttons[i].textContent.replace(/^\s*\d/, '').trim();
    current = i;

    if (!reducedMotion()) {
      scan.style.setProperty('--w', `${viewer.querySelector('.viewer__stage').offsetWidth}px`);
      scan.classList.remove('is-running');
      void scan.offsetWidth; // relance l'animation
      scan.classList.add('is-running');
    }
  };

  buttons.forEach((b, i) => b.addEventListener('click', () => show(i)));
  viewer._showKey = (key) => {
    const i = buttons.findIndex((b) => b.dataset.key === key);
    if (i >= 0) show(i);
  };
}

export function initViewers() {
  const viewers = $$('[data-viewer]');
  viewers.forEach(setup);

  const onScreen = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)));
  }, { threshold: 0.4 });
  viewers.forEach((v) => io.observe(v));

  document.addEventListener('keydown', (e) => {
    if (!['4', '5', '6'].includes(e.key) || e.target.closest('input, textarea, dialog[open]')) return;
    onScreen.forEach((v) => v._showKey(e.key));
  });
}
