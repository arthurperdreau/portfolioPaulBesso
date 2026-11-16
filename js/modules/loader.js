/**
 * Écran « Rendering… » : progression réelle basée sur le chargement des
 * premières images, avec une durée minimale pour l'effet et un plafond.
 */
import { $, $$, pad, reducedMotion } from './dom.js';

const MIN_MS = 900;
const MAX_MS = 2600;

export function initLoader() {
  const el = $('.loader');
  const done = () => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
  };

  if (!el || reducedMotion() || sessionStorage.getItem('pb-loaded')) {
    el?.remove();
    requestAnimationFrame(done);
    return Promise.resolve();
  }

  const count = $('[data-loader-count]');
  const bar = $('[data-loader-bar]');
  const samples = $('[data-loader-samples]');

  // Images à attendre : celles visibles au-dessus de la ligne de flottaison.
  const imgs = $$('.reel img').slice(0, 2);
  let loaded = 0;
  imgs.forEach((img) => {
    if (img.complete) { loaded++; return; }
    const onDone = () => { loaded++; };
    img.addEventListener('load', onDone, { once: true });
    img.addEventListener('error', onDone, { once: true });
  });

  const start = performance.now();
  let shown = 0;

  return new Promise((resolve) => {
    const tick = (now) => {
      const t = now - start;
      const real = imgs.length ? loaded / imgs.length : 1;
      const timed = Math.min(1, t / MIN_MS);
      const target = t > MAX_MS ? 1 : Math.min(real, timed);
      shown += (target - shown) * 0.12;
      if (target === 1 && shown > 0.995) shown = 1;

      count.textContent = pad(Math.round(shown * 100), 3);
      bar.style.transform = `scaleX(${shown})`;
      samples.textContent = Math.round(shown * 512);

      if (shown < 1) return requestAnimationFrame(tick);

      sessionStorage.setItem('pb-loaded', '1');
      el.classList.add('is-done');
      setTimeout(done, 250);
      el.addEventListener('transitionend', () => el.remove(), { once: true });
      resolve();
    };
    requestAnimationFrame(tick);
  });
}
