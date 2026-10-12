import React from 'react';

interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  hasActiveSession: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRoute,
  onNavigate,
  hasActiveSession
}) => {
  const isHome = currentRoute === '#home' || currentRoute === '';
  const isStages = currentRoute === '#stages' || currentRoute.startsWith('#quiz');
  const isCarnet = currentRoute === '#carnet' || currentRoute === '#final' || currentRoute === '#qr';
  const isMediateur = currentRoute === '#validateur';

  return (
    <nav className="mobile-dock" aria-label="Navigation principale mobile">
      <div className="mobile-dock-inner">
        <button
          type="button"
          className={`dock-tab ${isHome ? 'active' : ''}`}
          onClick={() => onNavigate('#home')}
          aria-label="Accueil"
        >
          <span className="dock-icon">🏛️</span>
          <span className="dock-label">Accueil</span>
        </button>

        <button
          type="button"
          className={`dock-tab ${isStages ? 'active' : ''}`}
          onClick={() => onNavigate(hasActiveSession ? '#stages' : '#home')}
          aria-label="Parcours des étapes"
        >
          <span className="dock-icon">📍</span>
          <span className="dock-label">Parcours</span>
        </button>

        <button
          type="button"
          className={`dock-tab ${isCarnet ? 'active' : ''}`}
          onClick={() => onNavigate(hasActiveSession ? '#carnet' : '#home')}
          aria-label="Carnet de visite"
        >
          <span className="dock-icon">📖</span>
          <span className="dock-label">Carnet</span>
        </button>

        <button
          type="button"
          className={`dock-tab ${isMediateur ? 'active' : ''}`}
          onClick={() => onNavigate('#validateur')}
          aria-label="Espace Médiateur"
        >
          <span className="dock-icon">🛡️</span>
          <span className="dock-label">Médiateur</span>
        </button>
      </div>
    </nav>
  );
};
