/**
 * Animations liées au scroll : apparition des éléments, parallaxe des
 * images d'étude de cas et compteurs animés.
 */
import { $$, reducedMotion } from './dom.js';

function countUp(el) {
  const end = Number(el.dataset.count);
  if (reducedMotion()) { el.textContent = end; return; }
  const dur = 1400;
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('is-in');
      if (el.hasAttribute('data-reveal-clip')) setTimeout(() => el.classList.add('is-settled'), 1800);
      $$('[data-count]', el).forEach(countUp);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  $$('[data-reveal], [data-reveal-clip]').forEach((el) => io.observe(el));
  return io;
}

/** Parallaxe : l'image se décale légèrement dans son cadre. */
export function initParallax() {
  if (reducedMotion()) return;
  const items = $$('[data-reveal-clip]');
  const visible = new Set();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
  });
  items.forEach((el) => io.observe(el));

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    visible.forEach((el) => {
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2 - vh / 2) / vh; // -1 → 1 environ
      el.style.setProperty('--py', `${(p * -6).toFixed(2)}%`);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}
