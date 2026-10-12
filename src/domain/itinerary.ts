import { SpotLocation, SAINT_JUNIEN_LOCATIONS } from './locations';

/**
 * Coordonnées des points de passage (waypoints) du parcours piétonnier réel
 * à travers les rues, quais et places de Saint-Junien reliant les 5 spots.
 * Format : [latitude, longitude]
 */
export const REAL_WALKING_ROUTE_COORDS: [number, number][] = [
  // Spot 1 : Saint-Amand (Ermitage)
  [45.88722905147311, 0.8898051668525597],
  // Descente et liaison vers la Vienne et le Pont Notre-Dame
  [45.885, 0.892],
  [45.8825, 0.8955],
  [45.8808, 0.898],
  // Spot 2 : Pont Notre-Dame & Chapelle
  [45.88, 0.899],
  // Remontée par la Rue du Pont
  [45.8804, 0.8993],
  [45.882, 0.8998],
  // Rue Lucien Dumas (bas)
  [45.8845, 0.9008],
  [45.8865, 0.9015],
  // Spot 3 : Collégiale Saint-Junien & Place Deffuas
  [45.8873, 0.9021],
  // Parvis et Rue Jean Jaurès
  [45.8876, 0.9018],
  [45.8882, 0.9016],
  // Spot 4 : Maison dite des Consuls (Rue Lucien Dumas)
  [45.887534787213355, 0.9013784381387228],
  // Descente vers l'ouest par le bourg médiéval
  [45.8864, 0.9000],
  // Spot 5 : Remparts (Enceinte médiévale)
  [45.88573699535376, 0.8993002289402143]
];

export function getSpotLocationsWithIndex(): (SpotLocation & { number: number })[] {
  return SAINT_JUNIEN_LOCATIONS.map((spot, index) => ({
    ...spot,
    number: index + 1
  }));
}
