/**
 * Génère le HTML des projets à partir de js/data/projects.js.
 * Aucune donnée de projet n'est écrite en dur dans index.html.
 */
import { $, esc, html, imgTag, pad, PLAY_ICON } from './dom.js';
import { projects, categories, galleryOf } from '../data/projects.js';
import { site } from '../data/site.js';

const tagsTag = (tags) => `<ul class="tags">${tags.map((t) => `<li class="tag">${esc(t)}</li>`).join('')}</ul>`;

/* ── Viewer Clay / Wireframe / Rendu ─────────────────────────────────── */
const viewerTag = (p) => {
  const last = p.shading.length - 1;
  return `
  <div class="viewer" data-viewer data-reveal>
    <div class="viewer__bar">
      <p class="viewer__title mono">Viewport — ${esc(p.title)}</p>
      <div class="viewer__modes" role="group" aria-label="Mode d'affichage">
        ${p.shading.map((s, i) => `
          <button class="viewer__mode" data-mode="${i}" data-key="${esc(s.key)}" aria-pressed="${i === last}">
            <kbd>${esc(s.key)}</kbd>${esc(s.label)}
          </button>`).join('')}
      </div>
    </div>
    <div class="viewer__stage">
      ${p.shading.map((s, i) => `
        <div class="viewer__layer ${i === last ? 'is-active' : ''}" data-layer="${i}">
          ${imgTag(s, { sizes: '(max-width: 900px) 100vw, 58vw' })}
        </div>`).join('')}
      <span class="viewer__scan" aria-hidden="true"></span>
      <span class="viewer__label" data-viewer-label>${esc(p.shading[last].label)}</span>
    </div>
  </div>`;
};

/* ── Lecteur vidéo d'étude de cas ─────────────────────────────────────── */
const playerTag = (p) => `
  <div class="player" data-player data-src="${esc(p.video.src)}" data-type="${esc(p.video.type)}" data-reveal-clip>
    ${imgTag(p.cover, { sizes: '(max-width: 900px) 100vw, 58vw' })}
    <button class="player__btn" data-cursor="Play" aria-label="${esc(p.video.label)} — ${esc(p.title)}">
      <span class="player__icon">${PLAY_ICON}</span>
      <span class="mono">${esc(p.video.label)}</span>
    </button>
  </div>`;

/* ── Étude de cas (projets complets) ──────────────────────────────────── */
const caseTag = (p, i, total) => {
  const gallery = galleryOf(p);
  const cover = p.video
    ? playerTag(p)
    : `<button class="media case__cover" data-gallery="${esc(p.id)}" data-index="0" data-cursor="Voir" data-reveal-clip
         aria-label="Agrandir : ${esc(p.cover.alt)}">
         ${imgTag(p.cover, { sizes: '(max-width: 900px) 100vw, 58vw' })}
         <span class="media__hud"><span>${esc(p.title)} — cam_01</span><span>1/${gallery.length}</span></span>
       </button>`;

  const thumbs = p.media.length
    ? `<div class="case__thumbs">
        ${p.media.map((m, j) => `
          <button class="media" data-gallery="${esc(p.id)}" data-index="${gallery.findIndex((g) => g.src === m.src)}"
                  data-cursor="Voir" data-reveal style="--delay:${j * 0.08}s" aria-label="Agrandir : ${esc(m.alt)}">
            ${imgTag(m, { sizes: '(max-width: 900px) 50vw, 20vw' })}
            <span class="media__hud"><span>${esc(m.caption)}</span></span>
          </button>`).join('')}
       </div>`
    : '';

  return `
  <article class="case" id="projet-${esc(p.id)}" data-key="${esc(p.title)}">
    <div class="case__info">
      <div class="case__sticky">
        <p class="case__index mono" data-reveal><b>${pad(i + 1)}</b><i></i>${pad(total)}</p>
        <p class="case__kicker mono" data-reveal>${esc(p.kicker)}</p>
        <h3 class="case__title" data-reveal style="--len:${p.title.length}">${esc(p.title)}</h3>
        <div data-reveal>${tagsTag(p.tags)}</div>
        <p class="case__desc" data-reveal>${esc(p.description)}</p>
        ${gallery.length > 1 ? `
        <div class="case__actions" data-reveal>
          <button class="btn btn--ghost" data-gallery="${esc(p.id)}" data-index="0" data-cursor="Voir">
            Galerie · ${gallery.length} images <span class="arrow">→</span>
          </button>
        </div>` : ''}
      </div>
    </div>
    <div class="case__visuals">
      ${cover}
      ${p.shading ? viewerTag(p) : ''}
      ${thumbs}
    </div>
  </article>`;
};

/* ── Carte du pipeline ────────────────────────────────────────────────── */
const CARD_SIZE = { batman: 'card--wide', 'smoking-gnome': 'card--half', 'adventure-bag': 'card--half' };

const cardTag = (p, i) => {
  const count = galleryOf(p).length;
  let media;

  if (p.video) {
    media = `
      <button class="media card__media" data-video="${esc(p.id)}" data-cursor="Play"
              aria-label="${esc(p.video.label)} — ${esc(p.title)}">
        <span class="clip" aria-hidden="true">
          <span class="clip__word">${esc(p.category === 'rigging' ? 'Rig' : 'Anim')}</span>
          <span class="clip__bar"></span>
          <span class="clip__play">${PLAY_ICON}</span>
        </span>
        <span class="card__badge card__badge--video">▶ Vidéo</span>
      </button>`;
  } else {
    media = `
      <button class="media card__media" data-gallery="${esc(p.id)}" data-index="0" data-cursor="Voir"
              aria-label="Agrandir : ${esc(p.cover.alt)}">
        ${imgTag(p.cover, { sizes: '(max-width: 640px) 100vw, 40vw' })}
        ${p.hover ? `<span class="card__alt">${imgTag(p.hover, { sizes: '(max-width: 640px) 100vw, 40vw' })}</span>` : ''}
        <span class="card__badge">${p.hover ? 'Survol : Maya → Substance' : `${count} image${count > 1 ? 's' : ''}`}</span>
      </button>`;
  }

  return `
  <article class="card ${CARD_SIZE[p.id] || ''}" data-category="${esc(p.category)}" data-reveal
           style="--delay:${(i % 3) * 0.08}s; view-transition-name: card-${esc(p.id)}">
    ${media}
    <div class="card__meta">
      <h3 class="card__title">${esc(p.title)}</h3>
      <p class="card__kicker mono">${esc(p.kicker)}</p>
    </div>
    <p class="card__desc">${esc(p.description)}</p>
  </article>`;
};

/* ── Points d'entrée ──────────────────────────────────────────────────── */
export function renderAll() {
  const featured = projects.filter((p) => p.featured);
  const pipeline = projects.filter((p) => !p.featured);

  $('[data-mount="featured"]').append(html(featured.map((p, i) => caseTag(p, i, featured.length)).join('')));
  $('[data-mount="pipeline"]').append(html(pipeline.map(cardTag).join('')));

  // Filtres avec compteur
  const counts = (id) => (id === 'all' ? pipeline.length : pipeline.filter((p) => p.category === id).length);
  $('[data-mount="filters"]').append(html(categories
    .filter((c) => counts(c.id) > 0)
    .map((c) => `<button class="filter" data-filter="${c.id}" aria-pressed="${c.id === 'all'}">
      ${esc(c.label)}<sup>${pad(counts(c.id))}</sup></button>`).join('')));

  // Statistiques calculées à partir des données
  const images = new Set(projects.flatMap((p) => [...galleryOf(p), ...(p.shading || [])].map((m) => m.src))).size;
  const videos = projects.filter((p) => p.video).length;
  const stats = [
    [projects.length, 'Projets'],
    [images, 'Images'],
    [videos, 'Vidéos'],
    [categories.length - 1, 'Disciplines'],
  ];
  $('[data-mount="stats"]').append(html(stats.map(([n, label], i) => `
    <div class="stat" data-reveal style="--delay:${i * 0.08}s">
      <dt class="mono">${label}</dt><dd data-count="${n}">0</dd>
    </div>`).join('')));

  // Contact
  const actions = [];
  if (site.email) {
    actions.push(`<a class="btn btn--solid" href="mailto:${esc(site.email)}" data-cursor="Mail">${esc(site.email)} <span class="arrow">→</span></a>`);
  }
  site.links.forEach((l) => actions.push(
    `<a class="btn btn--ghost" href="${esc(l.url)}" target="_blank" rel="noopener" data-cursor="Go">${esc(l.label)} <span class="arrow">↗</span></a>`,
  ));
  if (!actions.length) {
    actions.push('<p class="contact__note">Ouvert aux stages, alternances et collaborations sur des projets 3D.</p>');
  }
  $('[data-mount="contact"]').append(html(actions.join('')));
}
