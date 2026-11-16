/**
 * Lightbox plein écran : galeries d'images (flèches, clavier, swipe) et
 * lecture des vidéos du pipeline.
 */
import { $, esc, pad } from './dom.js';
import { projects, galleryOf } from '../data/projects.js';
import { createVideo } from './video.js';

export function initLightbox() {
  const dialog = $('.lightbox');
  const stage = $('[data-lb-stage]', dialog);
  const title = $('[data-lb-title]', dialog);
  const count = $('[data-lb-count]', dialog);
  const caption = $('[data-lb-caption]', dialog);
  const prev = $('[data-lb-prev]', dialog);
  const next = $('[data-lb-next]', dialog);

  let items = [];
  let index = 0;
  let opener = null;

  const render = () => {
    const m = items[index];
    stage.innerHTML = `<img src="${esc(m.src)}" alt="${esc(m.alt)}">`;
    count.textContent = items.length > 1 ? `${pad(index + 1)} / ${pad(items.length)}` : '';
    caption.textContent = m.caption || m.alt;
    prev.hidden = next.hidden = items.length < 2;
    // Précharge la suivante
    if (items.length > 1) new Image().src = items[(index + 1) % items.length].src;
  };

  const go = (step) => {
    if (items.length < 2) return;
    index = (index + step + items.length) % items.length;
    render();
  };

  const open = (project, start = 0) => {
    opener = document.activeElement;
    title.textContent = project.title;
    if (project.video && !project.cover) {
      items = [];
      count.textContent = '';
      caption.textContent = project.description;
      prev.hidden = next.hidden = true;
      stage.innerHTML = '';
      stage.append(createVideo(project.video.src, { onFail: (markup) => { stage.innerHTML = markup; } }));
    } else {
      items = galleryOf(project);
      index = start;
      render();
    }
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  };

  const close = () => dialog.close();

  dialog.addEventListener('close', () => {
    stage.innerHTML = ''; // stoppe la vidéo éventuelle
    document.documentElement.style.overflow = '';
    opener?.focus?.();
  });
  $('[data-lb-close]', dialog).addEventListener('click', close);
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  dialog.addEventListener('click', (e) => { if (e.target === stage) close(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });

  // Swipe mobile
  let x0 = null;
  stage.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    x0 = null;
  });

  // Délégation : tout élément [data-gallery] ou [data-video] ouvre la lightbox
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-gallery], [data-video]');
    if (!trigger) return;
    const id = trigger.dataset.gallery || trigger.dataset.video;
    const project = projects.find((p) => p.id === id);
    if (project) open(project, Number(trigger.dataset.index || 0));
  });
}
