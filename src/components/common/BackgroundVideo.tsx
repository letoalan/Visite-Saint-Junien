import React, { useState, useEffect } from 'react';

interface BackgroundVideoProps {
  videoId?: string;
  videoUrl?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoId = '04m7o63oVQM',
  videoUrl = 'https://youtu.be/04m7o63oVQM?si=5MB5y89pZCh5b0-N'
}) => {
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
    <div className="landing-video-bg" aria-hidden="true">
      {isOnline && (
        <iframe
          className="landing-video-iframe"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1&modestbranding=1`}
          title="Vidéo d'arrière-plan de Saint-Junien"
          tabIndex={-1}
          loading="lazy"
          allow="autoplay; encrypted-media"
        />
      )}
      <div className="landing-video-overlay" />
      <div className="landing-video-badge">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Consulter la vidéo originale sur YouTube"
        >
          ✦ Vidéo d’ambiance : Saint-Junien ↗
        </a>
      </div>
    </div>
  );
};
