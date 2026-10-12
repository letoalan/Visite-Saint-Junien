import L from 'leaflet';

export interface MarkerStateOptions {
  number: number;
  isCompleted: boolean;
  isActive: boolean;
  isSelected: boolean;
  title: string;
}

export function createSpotDivIcon(options: MarkerStateOptions): L.DivIcon {
  const { number, isCompleted, isActive, isSelected, title } = options;

  let bgClass = 'pin-locked';
  if (isCompleted) bgClass = 'pin-completed';
  else if (isActive) bgClass = 'pin-active';

  const selectedClass = isSelected ? 'pin-selected' : '';

  const html = `
    <div class="custom-leaflet-pin ${bgClass} ${selectedClass}" title="${number}. ${title}" aria-label="Spot ${number}: ${title}">
      <span class="pin-badge">${isCompleted ? '✓' : number}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-pin-container',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
}
