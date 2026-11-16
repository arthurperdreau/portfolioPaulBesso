/** Petits utilitaires DOM partagés par tous les modules. */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => window.matchMedia('(pointer: fine)').matches;

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** Échappe une valeur avant de l'insérer dans un template HTML. */
export const esc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ESC[c]);

/** Transforme une chaîne HTML en fragment DOM. */
export const html = (str) => document.createRange().createContextualFragment(str);

export const pad = (n, len = 2) => String(n).padStart(len, '0');
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Balise <img> responsive à partir d'un média de projects.js. */
export const imgTag = (m, { sizes = '100vw', eager = false, cls = '' } = {}) => `
  <img src="${esc(m.srcSm)}"
       srcset="${esc(m.srcSm)} 960w, ${esc(m.src)} 1920w"
       sizes="${esc(sizes)}"
       alt="${esc(m.alt)}"
       ${cls ? `class="${esc(cls)}"` : ''}
       loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;

export const PLAY_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z"/></svg>';
