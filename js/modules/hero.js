/**
 * Hero : titre découpé en lettres, aperçu animé des projets (« reel »),
 * gizmo d'axes qui suit la souris et coordonnées façon viewport.
 */
import { $, $$, esc, imgTag, pad, reducedMotion, lerp } from './dom.js';
import { projects } from '../data/projects.js';

/* ── Titre : chaque lettre devient un <span class="char"> ────────────── */
function splitTitle() {
  $$('[data-split]').forEach((line) => {
    const text = line.textContent;
    line.setAttribute('aria-hidden', 'true');
    line.innerHTML = [...text].map((c, i) => `<span class="char" style="--i:${i}">${esc(c)}</span>`).join('');
  });
}

/* ── Reel : défilement des couvertures des projets complets ──────────── */
function initReel() {
  const reel = $('[data-reel]');
  if (!reel) return;
  const stage = $('.reel__stage', reel);
  const name = $('[data-reel-name]', reel);
  const index = $('[data-reel-index]', reel);
  const items = projects.filter((p) => p.featured && p.cover);

  stage.innerHTML = items
    .map((p, i) => imgTag(p.cover, { sizes: '(max-width: 900px) 360px, 30vw', eager: i < 2, cls: i === 0 ? 'is-active' : '' }))
    .join('');
  const imgs = $$('img', stage);
  let current = 0;

  const show = (next) => {
    imgs.forEach((img) => img.classList.remove('is-leaving'));
    imgs[current].classList.replace('is-active', 'is-leaving');
    imgs[next].classList.add('is-active');
    current = next;
    name.textContent = items[current].title;
    index.textContent = `${pad(current + 1)}/${pad(items.length)}`;
  };
  name.textContent = items[0].title;
  index.textContent = `01/${pad(items.length)}`;

  if (reducedMotion() || items.length < 2) return;
  let timer = setInterval(() => show((current + 1) % items.length), 3200);

  // Pause quand le hero n'est plus visible
  new IntersectionObserver(([e]) => {
    clearInterval(timer);
    if (e.isIntersecting) timer = setInterval(() => show((current + 1) % items.length), 3200);
  }).observe(reel);

  // Clic : aller au projet affiché
  reel.style.cursor = 'pointer';
  reel.dataset.cursor = 'Voir';
  reel.addEventListener('click', () => {
    $(`#projet-${items[current].id}`)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
  });
}

/* ── Gizmo 3D + coordonnées ───────────────────────────────────────────── */
const AXES = [
  { v: [1, 0, 0], c: 'var(--axis-x)', l: 'X' },
  { v: [0, 1, 0], c: 'var(--axis-y)', l: 'Y' },
  { v: [0, 0, 1], c: 'var(--axis-z)', l: 'Z' },
];

function initGizmo() {
  const g = $('[data-gizmo-axes]');
  const coords = $('[data-coords]');
  const reel = $('[data-reel]');
  const hero = $('.hero');
  if (!g) return;

  let yaw = -0.6, pitch = 0.35, tYaw = yaw, tPitch = pitch;
  let mx = 0, my = 0;

  const draw = () => {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const proj = AXES.map((a) => {
      const [x, y, z] = a.v;
      const x1 = x * cy + z * sy;
      const z1 = -x * sy + z * cy;
      const y1 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;
      return { ...a, x: x1 * 34, y: -y1 * 34, z: z2 };
    }).sort((a, b) => a.z - b.z);
    g.innerHTML = proj.map((a) => `
      <line x1="0" y1="0" x2="${a.x.toFixed(1)}" y2="${a.y.toFixed(1)}" stroke="${a.c}" opacity="${a.z < -0.2 ? 0.45 : 1}"/>
      <circle cx="${(a.x * 1.28).toFixed(1)}" cy="${(a.y * 1.28).toFixed(1)}" r="8" fill="${a.c}" opacity="${a.z < -0.2 ? 0.45 : 1}"/>
      <text x="${(a.x * 1.28).toFixed(1)}" y="${(a.y * 1.28).toFixed(1)}" fill="#0b0b0c">${a.l}</text>`).join('');
  };
  draw();
  if (reducedMotion()) return;

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - 0.5;
    my = (e.clientY - r.top) / r.height - 0.5;
    tYaw = -0.6 + mx * 1.6;
    tPitch = 0.35 + my * 0.9;
    coords.innerHTML = `x ${(mx * 10).toFixed(3)} &nbsp;y ${(-my * 10).toFixed(3)} &nbsp;z ${(mx * my * 10).toFixed(3)}`;
  });

  let running = true;
  new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) loop(); }).observe(hero);

  function loop() {
    if (!running) return;
    yaw = lerp(yaw, tYaw, 0.08);
    pitch = lerp(pitch, tPitch, 0.08);
    draw();
    // Léger tilt 3D sur l'aperçu
    if (reel) reel.style.transform = `perspective(900px) rotateY(${mx * -10}deg) rotateX(${my * 8}deg)`;
    requestAnimationFrame(loop);
  }
  loop();
}

export function initHero() {
  splitTitle();
  initReel();
  initGizmo();
}
