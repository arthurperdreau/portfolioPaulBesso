/**
 * Interface globale : navigation, menu mobile, filtres du pipeline,
 * curseur viewport et time slider.
 */
import { $, $$, pad, clamp, lerp, reducedMotion, finePointer } from './dom.js';

/* ── Navigation ───────────────────────────────────────────────────────── */
export function initNav() {
  const nav = $('.nav');
  const toggle = $('.nav__toggle');
  const menu = $('#menu');
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && menu.hidden);
    lastY = y;
  }, { passive: true });

  const setMenu = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fermer' : 'Menu';
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  // Lien actif selon la section visible
  const links = $$('.nav__links a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle('is-current', a.hash === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[id]').forEach((s) => io.observe(s));

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}

/* ── Filtres du pipeline ──────────────────────────────────────────────── */
export function initFilters() {
  const buttons = $$('[data-filter]');
  const cards = $$('.card');

  const apply = (cat) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === cat)));
    cards.forEach((c) => {
      c.hidden = cat !== 'all' && c.dataset.category !== cat;
      c.classList.add('is-in');
    });
  };

  buttons.forEach((b) => b.addEventListener('click', () => {
    const cat = b.dataset.filter;
    if (document.startViewTransition && !reducedMotion()) document.startViewTransition(() => apply(cat));
    else apply(cat);
  }));
}

/* ── Curseur viewport ─────────────────────────────────────────────────── */
export function initCursor() {
  if (!finePointer() || reducedMotion()) return;
  const cursor = $('.cursor');
  const label = $('.cursor__label');
  document.body.classList.add('has-cursor');

  let x = -100, y = -100, cx = x, cy = y;
  document.addEventListener('pointermove', (e) => {
    x = e.clientX; y = e.clientY;
    const target = e.target.closest('[data-cursor]');
    cursor.classList.toggle('is-active', !!target);
    if (target) label.textContent = target.dataset.cursor;
  });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));

  // La lightbox (top layer) passe au-dessus du curseur : on revient au curseur natif.
  const dialog = $('.lightbox');
  new MutationObserver(() => document.body.classList.toggle('has-cursor', !dialog.open))
    .observe(dialog, { attributes: true, attributeFilter: ['open'] });

  const loop = () => {
    cx = lerp(cx, x, 0.22);
    cy = lerp(cy, y, 0.22);
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* ── Time slider : le scroll = la timeline d'une animation ────────────── */
const FRAMES = 240;

export function initTimeline() {
  const track = $('[data-track]');
  const head = $('[data-head]');
  const frame = $('[data-frame]');
  const keysEl = $('[data-keys]');
  const play = $('[data-play]');
  const sections = $$('[data-key]');

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

  // Keyframes = une par section / étude de cas
  const buildKeys = () => {
    const max = maxScroll();
    keysEl.innerHTML = '';
    sections.forEach((s) => {
      const top = s.getBoundingClientRect().top + window.scrollY;
      const p = clamp(top / max, 0, 1);
      const key = document.createElement('button');
      key.className = 'timeline__key';
      key.style.left = `${p * 100}%`;
      key.dataset.p = p;
      if (s.matches('.case')) key.classList.add('timeline__key--minor');
      key.setAttribute('aria-label', `Aller à : ${s.dataset.key}`);
      key.innerHTML = `<span>${s.dataset.key} · f${pad(Math.round(p * (FRAMES - 1)) + 1, 3)}</span>`;
      key.addEventListener('click', (e) => {
        e.stopPropagation();
        stopPlay();
        s.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
      });
      keysEl.append(key);
    });
  };

  const update = () => {
    const p = clamp(window.scrollY / (maxScroll() || 1), 0, 1);
    head.style.transform = `translateX(${p * track.offsetWidth}px)`;
    frame.textContent = pad(Math.round(p * (FRAMES - 1)) + 1, 4);
    $$('.timeline__key', keysEl).forEach((k) => k.classList.toggle('is-passed', Number(k.dataset.p) <= p + 0.001));
  };

  // Scrub : cliquer / glisser sur la piste
  let scrubbing = false;
  const scrubTo = (clientX) => {
    const r = track.getBoundingClientRect();
    const p = clamp((clientX - r.left) / r.width, 0, 1);
    window.scrollTo({ top: p * maxScroll(), behavior: 'auto' });
  };
  track.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.timeline__key')) return;
    scrubbing = true; stopPlay();
    document.documentElement.style.scrollBehavior = 'auto';
    track.setPointerCapture(e.pointerId);
    scrubTo(e.clientX);
  });
  track.addEventListener('pointermove', (e) => scrubbing && scrubTo(e.clientX));
  track.addEventListener('pointerup', () => { scrubbing = false; document.documentElement.style.scrollBehavior = ''; });

  // Lecture automatique : la page « joue » comme une animation
  let playing = false;
  let last = 0;
  const step = (now) => {
    if (!playing) return;
    const dt = last ? now - last : 16;
    last = now;
    window.scrollBy(0, dt * 0.22);
    if (window.scrollY >= maxScroll() - 1) return stopPlay();
    requestAnimationFrame(step);
  };
  function stopPlay() {
    playing = false;
    play.setAttribute('aria-pressed', 'false');
    document.documentElement.style.scrollBehavior = '';
  }
  play.addEventListener('click', () => {
    if (playing) return stopPlay();
    if (window.scrollY >= maxScroll() - 1) window.scrollTo({ top: 0, behavior: 'auto' });
    playing = true; last = 0;
    document.documentElement.style.scrollBehavior = 'auto';
    play.setAttribute('aria-pressed', 'true');
    requestAnimationFrame(step);
  });
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, () => playing && stopPlay(), { passive: true }));

  window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  const refresh = () => { buildKeys(); update(); };
  window.addEventListener('resize', refresh);
  new ResizeObserver(refresh).observe(document.body);
  refresh();
}
