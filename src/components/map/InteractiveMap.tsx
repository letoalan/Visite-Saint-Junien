import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SAINT_JUNIEN_LOCATIONS } from '../../domain/locations';
import { REAL_WALKING_ROUTE_COORDS } from '../../domain/itinerary';
import { UserSession } from '../../domain/types';
import { createSpotDivIcon } from './SpotMarkerIcon';
import { SpotDetailsCard } from './SpotDetailsCard';

interface InteractiveMapProps {
  session: UserSession;
  onSelectStage: (stageId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  session,
  onSelectStage
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const [selectedSpotId, setSelectedSpotId] = useState<string>('saint-amand');
  const [geoError, setGeoError] = useState<string | null>(null);

  const selectedSpot =
    SAINT_JUNIEN_LOCATIONS.find((s) => s.id === selectedSpotId) ||
    SAINT_JUNIEN_LOCATIONS[0];
  const stageState = session.stages[selectedSpot.id];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [45.8845, 0.896],
      zoom: 14,
      zoomControl: true
    });
    mapInstanceRef.current = map;

    // Tuiles libres d'accès OpenStreetMap (libre accès test / standard GitHub)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      className: 'stylized-parchment-tiles',
      maxZoom: 19
    }).addTo(map);

    // Tracé de l'itinéraire piéton réel reliant les 5 spots
    const routePolyline = L.polyline(REAL_WALKING_ROUTE_COORDS, {
      color: '#B5904D',
      weight: 4,
      dashArray: '6, 8',
      opacity: 0.95
    }).addTo(map);

    map.fitBounds(routePolyline.getBounds(), { padding: [28, 28] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Mise à jour des marqueurs selon l'état de session et le spot sélectionné
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    SAINT_JUNIEN_LOCATIONS.forEach((spot, idx) => {
      const isCompleted = session.stages[spot.id]?.status === 'completed';
      const isActive = session.stages[spot.id]?.status === 'active';
      const isSelected = selectedSpotId === spot.id;

      const icon = createSpotDivIcon({
        number: idx + 1,
        isCompleted,
        isActive,
        isSelected,
        title: spot.title
      });

      const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(map);
      marker.on('click', () => {
        setSelectedSpotId(spot.id);
        map.panTo([spot.lat, spot.lng]);
      });

      markersRef.current.push(marker);
    });
  }, [session, selectedSpotId]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError('Géolocalisation non supportée sur cet appareil.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const map = mapInstanceRef.current;
        if (!map) return;

        if (userMarkerRef.current) userMarkerRef.current.remove();

        const circle = L.circleMarker([latitude, longitude], {
          radius: 8,
          fillColor: '#2F4553',
          color: '#ffffff',
          weight: 2,
          fillOpacity: 0.9
        }).addTo(map);
        circle.bindPopup('Votre position actuelle').openPopup();
        userMarkerRef.current = circle;

        map.setView([latitude, longitude], 16);
        setGeoError(null);
      },
      () => setGeoError('Position GPS indisponible ou autorisation refusée.')
    );
  };

  return (
    <div className="map-card-wrapper">
      <div className="map-header">
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
          🗺️ Plan réel & Itinéraire piéton
        </span>
        <button
          type="button"
          onClick={handleLocateMe}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', minHeight: '36px' }}
          title="Afficher ma position GPS en direct"
        >
          📍 Ma position
        </button>
      </div>

      <div ref={mapContainerRef} className="leaflet-map-container" />

      {geoError && (
        <div style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--color-red)', background: 'var(--color-red-bg)' }}>
          {geoError}
        </div>
      )}

      <SpotDetailsCard
        spot={selectedSpot}
        stageState={stageState}
        onEnterStage={onSelectStage}
      />
    </div>
  );
};
