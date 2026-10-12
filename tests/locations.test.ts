import { describe, it, expect } from 'vitest';
import { SAINT_JUNIEN_LOCATIONS, getSpotLocation } from '../src/domain/locations';
import { REAL_WALKING_ROUTE_COORDS, getSpotLocationsWithIndex } from '../src/domain/itinerary';

describe('Localisations et Coordonnées GPS des 5 Spots', () => {
  it('contient exactement 5 spots géolocalisés', () => {
    expect(SAINT_JUNIEN_LOCATIONS).toHaveLength(5);
  });

  it('vérifie que chaque spot possède des coordonnées GPS valides dans le secteur de Saint-Junien', () => {
    SAINT_JUNIEN_LOCATIONS.forEach((spot) => {
      // Latitude Saint-Junien ~ 45.88°
      expect(spot.lat).toBeGreaterThan(45.87);
      expect(spot.lat).toBeLessThan(45.90);

      // Longitude Saint-Junien ~ 0.89° - 0.91°
      expect(spot.lng).toBeGreaterThan(0.88);
      expect(spot.lng).toBeLessThan(0.92);

      expect(spot.title).toBeTruthy();
      expect(spot.address).toBeTruthy();
      expect(spot.description).toBeTruthy();
    });
  });

  it('permet de récupérer un spot par son ID', () => {
    const collegiale = getSpotLocation('collegiale');
    expect(collegiale).toBeDefined();
    expect(collegiale?.title).toBe('Collégiale et ostensions');
  });

  it('valide le tracé de l’itinéraire piéton réel et la numérotation de 1 à 5', () => {
    const spotsWithIndex = getSpotLocationsWithIndex();
    expect(spotsWithIndex).toHaveLength(5);
    spotsWithIndex.forEach((s, idx) => {
      expect(s.number).toBe(idx + 1);
    });

    // L'itinéraire réel doit comporter plusieurs waypoints dans Saint-Junien
    expect(REAL_WALKING_ROUTE_COORDS.length).toBeGreaterThanOrEqual(5);
    REAL_WALKING_ROUTE_COORDS.forEach(([lat, lng]) => {
      expect(lat).toBeGreaterThan(45.87);
      expect(lat).toBeLessThan(45.90);
      expect(lng).toBeGreaterThan(0.88);
      expect(lng).toBeLessThan(0.92);
    });
  });

  it('vérifie les coordonnées exactes du spot 1 (Saint-Amand)', () => {
    const saintAmand = getSpotLocation('saint-amand');
    expect(saintAmand).toBeDefined();
    expect(saintAmand?.lat).toBe(45.88722905147311);
    expect(saintAmand?.lng).toBe(0.8898051668525597);
  });

  it('vérifie les coordonnées exactes du spot 4 (Maison des Consuls)', () => {
    const consuls = getSpotLocation('consuls');
    expect(consuls).toBeDefined();
    expect(consuls?.lat).toBe(45.887534787213355);
    expect(consuls?.lng).toBe(0.9013784381387228);
  });

  it('vérifie les coordonnées exactes du spot 5 (Remparts)', () => {
    const remparts = getSpotLocation('remparts');
    expect(remparts).toBeDefined();
    expect(remparts?.lat).toBe(45.88573699535376);
    expect(remparts?.lng).toBe(0.8993002289402143);
  });
});
