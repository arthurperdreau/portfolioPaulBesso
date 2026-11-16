# Portfolio — Paul Besso

Portfolio d'artiste 3D, en HTML/CSS/JS natifs, sans dépendance ni build.

## Lancer en local

Le site utilise des modules ES : il faut l'ouvrir via un serveur, pas en double-cliquant sur `index.html`.

- WebStorm : clic droit sur `index.html` → *Open in Browser*
- ou `npm start` (http://localhost:3000)

## Architecture

```
index.html              structure des sections (aucun projet en dur)
css/
  base.css              tokens, reset, loader, nav, curseur, time slider, reveals
  components.css        boutons, tags, études de cas, viewer, cartes, lightbox
  sections.css          hero, marquee, à propos, contact, footer
js/
  main.js               point d'entrée
  data/projects.js      ← tous les projets (source unique)
  data/site.js          ← email et liens sociaux
  modules/              render, hero, loader, reveal, viewer, video, lightbox, ui
assets/projects/<id>/   médias optimisés (WebP 1920px + 960px « -sm »)
_sources/               fichiers originaux du Drive (ignorés par git)
```

## Ajouter un projet

1. Exporter les images en WebP : `nom.webp` (1920px) et `nom-sm.webp` (960px) dans `assets/projects/<id>/`.
2. Ajouter une entrée dans `js/data/projects.js` :
   - `featured: true` → grande étude de cas dans « Projets »
   - sinon → carte dans « Pipeline », filtrée par `category`
   - `shading: [...]` → active le viewer Clay / Wireframe / Rendu (touches 4 · 5 · 6)
   - `video: { src, type }` → lecteur vidéo

## Vidéos

Les navigateurs ne lisent que le H.264 / MP4. Pour convertir un `.mov` :

```
ffmpeg -i entree.mov -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -movflags +faststart sortie.mp4
```
