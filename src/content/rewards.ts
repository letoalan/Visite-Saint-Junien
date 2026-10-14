export interface HeritageReward {
  id: string;
  title: string;
  filename: string;
  description: string;
  theme: string;
}

export const HERITAGE_REWARDS: HeritageReward[] = [
  {
    id: 'chapelle-notre-dame-pont',
    title: 'Chapelle Notre-Dame-du-Pont',
    filename: 'Chapelle_Notre-Dame-du-Pont_de_Saint-Junien(1).png',
    description: 'Édifiée au bord de la Vienne, étape et refuge emblématique des pèlerins franchissant le pont médiéval.',
    theme: 'Architecture & Ponts'
  },
  {
    id: 'abbaye-saint-amand-1',
    title: "Histoire de l'Abbaye Saint-Amand (Planche I)",
    filename: 'Histoire_de_l_Abbaye_Saint-Amand(1).png',
    description: "Les origines monastiques et le rayonnement spirituel de l'abbaye au fil des siècles.",
    theme: 'Monastères & Abbayes'
  },
  {
    id: 'abbaye-saint-amand-2',
    title: "Histoire de l'Abbaye Saint-Amand (Planche II)",
    filename: 'Histoire_de_l_Abbaye_Saint-Amand(2).png',
    description: "L'architecture claustrale et les précieux trésors séculaires conservés à Saint-Amand.",
    theme: 'Monastères & Abbayes'
  },
  {
    id: 'abbaye-saint-amand-3',
    title: "Histoire de l'Abbaye Saint-Amand (Planche III)",
    filename: 'Histoire_de_l_Abbaye_Saint-Amand(3).png',
    description: "Évolution du domaine abbatial et chroniques historiques médiévales du site.",
    theme: 'Monastères & Abbayes'
  },
  {
    id: 'abbaye-saint-amand-general',
    title: "Histoire de l'Abbaye Saint-Amand",
    filename: 'Histoire_de_l_abbaye_Saint-Amand.png',
    description: "Panorama historique complet de l'abbaye et de son inscription au cœur du paysage junien.",
    theme: 'Monastères & Abbayes'
  },
  {
    id: 'collegiale-histoire',
    title: 'Histoire de la Collégiale Saint-Junien',
    filename: 'Histoire_de_la_Collégiale_Saint-Junien.png',
    description: "Bâtie autour du tombeau de l'ermite Junien, chef-d'œuvre de l'art roman limousin.",
    theme: 'Collégiale & Ermitage'
  },
  {
    id: 'collegiale-vue',
    title: 'La Collégiale de Saint-Junien',
    filename: 'La_Collégiale_de_Saint-Junien.png',
    description: "Élévation majestueuse, nef romane et voûtes séculaires de la Collégiale.",
    theme: 'Collégiale & Ermitage'
  },
  {
    id: 'histoire-patrimoine-1',
    title: 'Histoire et Patrimoine de Saint-Junien (Planche I)',
    filename: 'Histoire_et_patrimoine_de_Saint-Junien.png',
    description: 'Chronologie du bourg, de la cité canoniale originelle à la ville industrieuse moderne.',
    theme: 'Cité & Traditions'
  },
  {
    id: 'histoire-patrimoine-2',
    title: 'Histoire et Patrimoine de Saint-Junien (Planche II)',
    filename: 'Histoire_et_patrimoine_de_Saint-Junien(1).png',
    description: "Les grandes figures et événements qui ont façonné l'identité remarquable de Saint-Junien.",
    theme: 'Cité & Traditions'
  },
  {
    id: 'patrimoine-historique-1',
    title: 'Patrimoine Historique de Saint-Junien (Planche I)',
    filename: 'Patrimoine_historique_de_Saint-Junien.png',
    description: 'Monuments, venelles et témoins architecturaux de la cité médiévale et de ses faubourgs.',
    theme: 'Monuments & Mémoire'
  },
  {
    id: 'patrimoine-historique-2',
    title: 'Patrimoine Historique de Saint-Junien (Planche II)',
    filename: 'Patrimoine_historique_de_Saint-Junien(1).png',
    description: 'Héritage artisanal, mégisseries, ganteries et savoir-faire d’exception au fil de la Vienne.',
    theme: 'Monuments & Mémoire'
  },
  {
    id: 'ostensions-saint-junien',
    title: 'Les Ostensions Septennales de Saint-Junien',
    filename: 'Ostensions_de_Saint-Junien.png',
    description: 'Célébration séculaire inscrite au Patrimoine Culturel Immatériel de l’UNESCO.',
    theme: 'Fêtes & Traditions'
  },
  {
    id: 'archeologie-saint-amand',
    title: 'Révélations Archéologiques à Saint-Amand',
    filename: 'Révélations_archéologiques_à_Saint-Amand.png',
    description: 'Fouilles et découvertes révélant les fondations antiques et carolingiennes du site.',
    theme: 'Archéologie & Recherches'
  }
];

export function getRewardImageUrl(filename: string): string {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}media/${filename}`;
}

export function pickReward(seed?: string): HeritageReward {
  if (!seed) {
    const idx = Math.floor(Math.random() * HERITAGE_REWARDS.length);
    return HERITAGE_REWARDS[idx];
  }
  // Tirage déterministe basé sur le hash du seed (ex: sessionId)
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const idx = Math.abs(hash >>> 0) % HERITAGE_REWARDS.length;
  return HERITAGE_REWARDS[idx];
}

export function findRewardById(id: string): HeritageReward | undefined {
  return HERITAGE_REWARDS.find((r) => r.id === id);
}
