/**
 * Vidéos : création d'un <video> à la demande (rien n'est téléchargé avant
 * le clic) et message de secours si le navigateur ne sait pas décoder le
 * fichier (ex. .mov encodé en MPEG-4 Part 2).
 */
import { esc } from './dom.js';

/** Crée un élément vidéo + gère l'erreur de format. */
export function createVideo(src, { autoplay = true, onFail } = {}) {
  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.src = src;

  const fail = () => onFail?.(fallbackTag(src));
  video.addEventListener('error', fail, { once: true });
  // Certains navigateurs lisent l'audio sans image : on vérifie la piste vidéo.
  video.addEventListener('loadedmetadata', () => {
    if (video.videoWidth === 0) fail();
  }, { once: true });

  if (autoplay) video.play().catch(() => {});
  return video;
}

export const fallbackTag = (src) => `
  <div class="video-fallback">
    <p class="mono">Format non lisible ici</p>
    <p>Ce navigateur ne peut pas lire cette vidéo directement. Tu peux la télécharger pour la regarder.</p>
    <a class="btn btn--ghost" href="${esc(src)}" download>Télécharger la vidéo ↓</a>
  </div>`;

/** Lecteurs intégrés aux études de cas (Cauchemart). */
export function initPlayers(root = document) {
  root.querySelectorAll('[data-player]').forEach((player) => {
    const btn = player.querySelector('.player__btn');
    btn.addEventListener('click', () => {
      const video = createVideo(player.dataset.src, {
        onFail: (markup) => player.insertAdjacentHTML('beforeend', markup),
      });
      player.append(video);
      player.classList.add('is-playing');
      video.focus();
    });
  });
}
