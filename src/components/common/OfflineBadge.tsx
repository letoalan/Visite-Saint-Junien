import React, { useState, useEffect } from 'react';

export const OfflineBadge: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <span
      className={`badge ${isOnline ? 'badge-online' : 'badge-offline'}`}
      role="status"
      aria-live="polite"
      title={isOnline ? 'Application connectée' : 'Mode autonome hors ligne actif'}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isOnline ? 'var(--color-success)' : 'var(--color-red)'
        }}
      />
      {isOnline ? 'En ligne' : 'Hors ligne'}
    </span>
  );
};
