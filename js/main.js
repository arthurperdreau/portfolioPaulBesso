/**
 * Point d'entrée. L'ordre compte : on génère d'abord le HTML des projets,
 * puis on branche les comportements dessus.
 */
import { renderAll } from './modules/render.js';
import { initHero } from './modules/hero.js';
import { initLoader } from './modules/loader.js';
import { initReveal, initParallax } from './modules/reveal.js';
import { initViewers } from './modules/viewer.js';
import { initPlayers } from './modules/video.js';
import { initLightbox } from './modules/lightbox.js';
import { initNav, initFilters, initCursor, initTimeline } from './modules/ui.js';

renderAll();
initHero();
initNav();
initFilters();
initViewers();
initPlayers();
initLightbox();
initCursor();
initTimeline();

initLoader().then(() => {
  initReveal();
  initParallax();
});
