export interface SpotLocation {
  id: string;
  stageIndex: number;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  address: string;
  description: string;
}

export const SAINT_JUNIEN_LOCATIONS: SpotLocation[] = [
  {
    id: 'saint-amand',
    stageIndex: 0,
    title: 'Saint-Amand',
    subtitle: 'Ancienne abbaye & église primitive',
    lat: 45.88722905147311,
    lng: 0.8898051668525597,
    address: 'Site de l’Ermitage Saint-Amand',
    description: 'Site archéologique majeur révélant les origines du culte monastique et les dénivellations rocheuses de la ville.'
  },
  {
    id: 'pont-chapelle',
    stageIndex: 1,
    title: 'Pont et Notre-Dame-du-Pont',
    subtitle: 'Pont médiéval & oratoire marial',
    lat: 45.88,
    lng: 0.899,
    address: 'Quai des Mégisseries / Rue du Pont',
    description: 'Six arches brisées franchissant la Vienne et chapelle gothique témoignant du mécénat royal et du passage des voyageurs.'
  },
  {
    id: 'collegiale',
    stageIndex: 2,
    title: 'Collégiale et ostensions',
    subtitle: 'Chefd’œuvre roman limousin',
    lat: 45.8873,
    lng: 0.9021,
    address: 'Place Deffuas / Place de la Collégiale',
    description: 'Tombeau de saint Junien, nef majestueuse, fresques du Christ en gloire et mémoire vivante des ostensions septennales.'
  },
  {
    id: 'consuls',
    stageIndex: 3,
    title: 'Maison dite des Consuls',
    subtitle: 'Pouvoir municipal & franchises',
    lat: 45.887534787213355,
    lng: 0.9013784381387228,
    address: 'Rue Lucien Dumas / Angle Rue d’Arsonval',
    description: 'Façade gothique sculptée illustrant l’essor des franchises urbaines et le gouvernement des bourgeois et consuls.'
  },
  {
    id: 'remparts',
    stageIndex: 4,
    title: 'Remparts',
    subtitle: 'Enceinte fortifiée & défenses',
    lat: 45.88573699535376,
    lng: 0.8993002289402143,
    address: 'Secteur des Remparts / Enceinte médiévale',
    description: 'Tracé de l’enceinte médiévale redécouvert lors des fouilles, protégeant jadis la cité contre les assauts extérieurs.'
  }
];

export function getSpotLocation(stageId: string): SpotLocation | undefined {
  return SAINT_JUNIEN_LOCATIONS.find((loc) => loc.id === stageId);
}
