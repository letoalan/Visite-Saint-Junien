import React from 'react';
import { OfflineBadge } from './OfflineBadge';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  hasActiveSession: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  hasActiveSession
}) => {
  return (
    <header className="app-header">
      <div
        className="app-logo"
        role="button"
        tabIndex={0}
        onClick={() => onNavigate('#home')}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('#home')}
        style={{ cursor: 'pointer' }}
      >
        <span style={{ color: 'var(--color-gold)', fontSize: '1.4rem' }}>✦</span>
        <span>Saint-Junien</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <OfflineBadge />
        <nav className="app-nav" aria-label="Navigation principale">
          {hasActiveSession && (
            <>
              <button
                type="button"
                className={`nav-link ${currentRoute === '#stages' || currentRoute.startsWith('#quiz') ? 'active' : ''}`}
                onClick={() => onNavigate('#stages')}
              >
                Parcours
              </button>
              <button
                type="button"
                className={`nav-link ${currentRoute === '#carnet' ? 'active' : ''}`}
                onClick={() => onNavigate('#carnet')}
              >
                Carnet
              </button>
            </>
          )}
          <button
            type="button"
            className={`nav-link ${currentRoute === '#validateur' ? 'active' : ''}`}
            onClick={() => onNavigate('#validateur')}
            title="Espace réservé au médiateur pour contrôler les QR"
          >
            Médiateur
          </button>
        </nav>
      </div>
    </header>
  );
};
