/**
 * Source unique de vérité du portfolio.
 * Pour ajouter un projet : déposer les médias dans assets/projects/<id>/
 * puis ajouter une entrée ci-dessous. Le rendu HTML est généré automatiquement.
 *
 * category : 'complet' | 'modeling' | 'texturing' | 'rigging' | 'animation'
 * featured : true  → affiché en grande étude de cas dans « Projets »
 * shading  : modes du viewer (Clay / Wireframe / Rendu…), optionnel
 * video    : { src, type, poster } optionnel
 */

const ROOT = 'assets/projects';

/** Construit les chemins d'une image optimisée (1920px + 960px). */
const img = (id, name, alt, caption = '') => ({
  type: 'image',
  src: `${ROOT}/${id}/${name}.webp`,
  srcSm: `${ROOT}/${id}/${name}-sm.webp`,
  alt,
  caption,
});

export const categories = [
  { id: 'all', label: 'Tout' },
  { id: 'modeling', label: 'Modeling' },
  { id: 'texturing', label: 'Texturing' },
  { id: 'rigging', label: 'Rigging' },
  { id: 'animation', label: 'Animation' },
];

export const projects = [
  /* ───────────── PROJETS COMPLETS ───────────── */
  {
    id: 'starry',
    title: 'Starry',
    kicker: 'Environnement — Live house',
    category: 'complet',
    featured: true,
    tags: ['Modeling', 'Lighting', 'Rendu'],
    description:
      "Une salle de concert underground plongée dans la pénombre : scène, batterie, guitares, bar et affiches. Un travail d'ambiance où la lumière de scène découpe chaque objet.",
    cover: img('starry', 'scene-01', 'Scène du live house Starry, guitares et batterie sous les projecteurs'),
    media: [
      img('starry', 'detail-02', 'Guitare noire et or devant le logo Starry', 'Gros plan — guitare'),
      img('starry', 'detail-01', 'Batterie vue de dessus éclairée en bleu', 'Gros plan — batterie'),
      img('starry', 'detail-03', 'Basse blanche devant un ampli', 'Gros plan — basse'),
      img('starry', 'scene-02', 'Bar du live house avec affiches et écran', "Plan d'ensemble — bar"),
      img('starry', 'scene-03', 'Régie derrière un grillage, structure métallique rouge', "Plan d'ensemble — régie"),
    ],
    shading: [
      { label: 'Wireframe', key: '4', ...img('starry', 'wire-02', 'Topologie du bar dans Maya') },
      { label: 'Rendu', key: '6', ...img('starry', 'scene-02', 'Rendu final du bar') },
    ],
  },
  {
    id: 'gto-250',
    title: 'GTO 250',
    kicker: 'Objet — Intégration photo',
    category: 'complet',
    featured: true,
    tags: ['Modeling', 'Texturing', 'Compositing'],
    description:
      "Une lampe-sculpture en bois inspirée d'une GT des années 60, intégrée dans de vraies photos de chambre. Bois, métal brossé et badge doré « Chat Noir — Guest Edition ».",
    cover: img('gto-250', 'render-01', 'Lampe en bois en forme de voiture intégrée dans une chambre'),
    media: [
      img('gto-250', 'render-02', 'La lampe GTO 250 au premier plan devant un lit', 'Vue trois-quarts'),
      img('gto-250', 'render-03', 'Vue plongeante sur la lampe et son socle', 'Vue plongeante'),
      img('gto-250', 'render-04', 'Badge doré Chat Noir sur le socle en bois', 'Détail — badge'),
    ],
  },
  {
    id: 'bakery',
    title: 'Bakery',
    kicker: 'Environnement — Stylisé',
    category: 'complet',
    featured: true,
    tags: ['Modeling', 'Texturing', 'Rendu'],
    description:
      "Une boulangerie cartoon aux formes généreuses : arches violettes, four à pain et bûches empilées. Du blocking clay au rendu final, chaque étape est visible dans le viewer.",
    cover: img('bakery', 'render', 'Rendu final de la boulangerie stylisée'),
    media: [
      img('bakery', 'view-01', 'Boulangerie en clay, vue de trois-quarts', 'Clay — vue 01'),
      img('bakery', 'view-02', 'Boulangerie en clay, vue de face', 'Clay — vue 02'),
    ],
    shading: [
      { label: 'Clay', key: '5', ...img('bakery', 'view-01', 'Boulangerie en clay') },
      { label: 'Wireframe', key: '4', ...img('bakery', 'wire', 'Topologie de la boulangerie dans Maya') },
      { label: 'Rendu', key: '6', ...img('bakery', 'render', 'Rendu final de la boulangerie') },
    ],
  },
  {
    id: 'cauchemar',
    title: 'Cauchemart',
    kicker: 'Court métrage — Projet collectif',
    category: 'complet',
    featured: true,
    tags: ['Character', 'Animation', 'Film'],
    description:
      'Court métrage réalisé en équipe entre 1re et 3e année. Une créature à pois, une gueule démesurée et des pattes trop longues pour un cauchemar en images de synthèse.',
    cover: img('cauchemar', 'monstre', 'La créature du court métrage Cauchemart'),
    media: [],
    video: {
      src: `${ROOT}/cauchemar/film.mp4`,
      type: 'video/mp4',
      poster: `${ROOT}/cauchemar/monstre.webp`,
      label: 'Lire le court métrage',
    },
  },
  {
    id: 'nisekoi',
    title: 'Nisekoi',
    kicker: 'Props — Hard surface',
    category: 'complet',
    featured: true,
    tags: ['Modeling', 'Shading', 'Rendu'],
    description:
      "Trois clés et un pendentif-serrure inspirés de l'anime Nisekoi. Un exercice de précision sur les silhouettes et les métaux : argent, cuivre et or.",
    cover: img('nisekoi', 'render', 'Trois clés et un pendentif en métal'),
    media: [],
  },

  /* ───────────── MODELING ───────────── */
  {
    id: 'batman',
    title: 'Batman',
    kicker: 'Character modeling',
    category: 'modeling',
    tags: ['Character', 'Clay render'],
    description: "Modélisation d'un personnage au style animé, présentée en clay sous trois angles.",
    cover: img('batman', 'render', 'Modélisation de Batman en clay sous trois angles'),
    media: [],
  },
  {
    id: 'diorama',
    title: 'Diorama',
    kicker: 'Sculpt',
    category: 'modeling',
    tags: ['Sculpt', 'Organique'],
    description: "Sculpt d'une formation organique et de rochers, pensée comme base de diorama.",
    cover: img('diorama', 'sculpt', 'Sculpt organique de diorama avec rochers'),
    media: [],
  },

  /* ───────────── TEXTURING ───────────── */
  {
    id: 'adventure-bag',
    title: 'Adventure Bag',
    kicker: 'Texturing PBR',
    category: 'texturing',
    tags: ['Substance Painter', 'Cuir', 'Métal'],
    description:
      "Sac d'aventurier : cuir usé, boucles oxydées, lanterne, casque et bottes. Une étude de matières et d'usure.",
    cover: img('adventure-bag', 'render-02', "Sac d'aventurier texturé avec lanterne et casque"),
    media: [
      img('adventure-bag', 'render-01', 'Sac vu de profil avec rondin et bottes', 'Profil'),
      img('adventure-bag', 'render-03', 'Dos du sac avec bretelles en cuir', 'Dos'),
      img('adventure-bag', 'render-04', 'Gros plan sur la lanterne et le casque', 'Détail — lanterne'),
    ],
  },
  {
    id: 'smoking-gnome',
    title: 'Smoking Gnome',
    kicker: 'Texturing — Character',
    category: 'texturing',
    tags: ['Substance Painter', 'Maya', 'Skin'],
    description:
      "Un gnome bougon à la pipe, kimono à vagues dorées. Le même personnage rendu dans Maya puis dans Substance.",
    cover: img('smoking-gnome', 'maya', 'Gnome à la pipe et lunettes noires, rendu Maya'),
    hover: img('smoking-gnome', 'substance', 'Gnome à la pipe, rendu Substance'),
    media: [img('smoking-gnome', 'substance', 'Gnome à la pipe, rendu Substance', 'Rendu Substance')],
  },

  /* ───────────── RIGGING ───────────── */
  {
    id: 'biped-rig',
    title: 'Biped Rig',
    kicker: 'Rigging & skinning',
    category: 'rigging',
    tags: ['Rig', 'Skinning', 'Contrôleurs'],
    description: 'Rig bipède complet avec skinning, testé en mouvement.',
    cover: null,
    media: [],
    video: { src: `${ROOT}/biped-rig/rig.mov`, type: 'video/quicktime', label: 'Voir le rig' },
  },

  /* ───────────── ANIMATION ───────────── */
  {
    id: 'fight',
    title: 'Fight',
    kicker: 'Animation 3D',
    category: 'animation',
    tags: ['Animation', 'Combat', 'Timing'],
    description: 'Séquence de combat animée : poids, impacts et timing.',
    cover: null,
    media: [],
    video: { src: `${ROOT}/fight/fight.mov`, type: 'video/quicktime', label: "Voir l'animation" },
  },
];

/** Toutes les images d'un projet (couverture + galerie), dédoublonnées. */
export const galleryOf = (project) => {
  const all = [project.cover, ...project.media].filter(Boolean);
  return all.filter((m, i) => all.findIndex((o) => o.src === m.src) === i);
};
