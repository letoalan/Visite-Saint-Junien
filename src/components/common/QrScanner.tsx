import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { Button } from './Button';

interface QrScannerProps {
  onScan: (text: string) => void;
  onError?: (error: string) => void;
  placeholderText?: string;
  autoStart?: boolean;
}

export const QrScanner: React.FC<QrScannerProps> = ({
  onScan,
  onError,
  placeholderText = "Placez le QR code d'attestation au centre du cadre",
  autoStart = true
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isScanning, setIsScanning] = useState<boolean>(autoStart);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSuccessFlash, setIsSuccessFlash] = useState<boolean>(false);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [supportsTorch, setSupportsTorch] = useState<boolean>(false);

  // Évite les lectures multiples en rafale (cooldown de 1,5s)
  const lastScannedTimeRef = useRef<number>(0);

  // Signal sonore doux lors de la détection réussie (Web Audio API)
  const playSuccessBeep = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Note La (A5)
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12); // Octave supérieure

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch {
      // Ignorer si les permissions audio sont bloquées par le navigateur
    }
  }, []);

  const handleScanResult = useCallback((text: string) => {
    const now = Date.now();
    if (now - lastScannedTimeRef.current < 1500) {
      return; // Cooldown actif
    }
    lastScannedTimeRef.current = now;

    playSuccessBeep();
    setIsSuccessFlash(true);
    setTimeout(() => setIsSuccessFlash(false), 900);

    onScan(text);
  }, [onScan, playSuccessBeep]);

  // Nettoyage complet des flux média
  const stopCamera = useCallback(() => {
    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
      } catch {
        // Ignorer
      }
      controlsRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      } catch {
        // Ignorer
      }
    }
    setIsTorchOn(false);
    setSupportsTorch(false);
  }, []);

  // Détection des périphériques vidéo disponibles
  const loadVideoDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return;
      }
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);

      // Si aucun appareil sélectionné, privilégier la caméra arrière (environnement)
      if (videoInputs.length > 0 && !selectedDeviceId) {
        const backCam = videoInputs.find((d) =>
          /back|rear|environnement|arrière/i.test(d.label)
        );
        setSelectedDeviceId(backCam ? backCam.deviceId : videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Impossible de lister les caméras :', err);
    }
  }, [selectedDeviceId]);

  // Démarrage du scan en direct via la caméra
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError(
        "L'accès à la caméra n'est pas pris en charge par ce navigateur ou nécessite un contexte sécurisé (HTTPS)."
      );
      if (onError) onError("API Caméra indisponible");
      return;
    }

    try {
      const codeReader = new BrowserQRCodeReader();
      const videoElem = videoRef.current;
      if (!videoElem) return;

      const controls = await codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        videoElem,
        (result, _error, ctrls) => {
          if (result) {
            handleScanResult(result.getText());
          }
          // Stocker la référence vers les contrôles
          if (ctrls && !controlsRef.current) {
            controlsRef.current = ctrls;
          }
        }
      );

      controlsRef.current = controls;

      // Vérifier si la torche (flash) est disponible
      if (controls.switchTorch) {
        setSupportsTorch(true);
      }

      // Recharger les labels des caméras une fois la permission accordée
      loadVideoDevices();
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string };
      console.warn('Erreur activation caméra :', error);
      let message = "Impossible d'accéder à la caméra.";
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        message = "Autorisation d'accès à la caméra refusée. Veuillez autoriser la caméra dans votre navigateur.";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        message = "Aucune caméra détectée sur ce terminal.";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        message = "La caméra est actuellement utilisée par une autre application.";
      }
      setCameraError(message);
      if (onError) onError(message);
    }
  }, [selectedDeviceId, handleScanResult, loadVideoDevices, onError, stopCamera]);

  // Effet pour initialiser et synchroniser la caméra
  useEffect(() => {
    loadVideoDevices();
  }, [loadVideoDevices]);

  useEffect(() => {
    if (isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isScanning, selectedDeviceId, startCamera, stopCamera]);

  // Bascule torche / flash
  const handleToggleTorch = async () => {
    if (controlsRef.current && controlsRef.current.switchTorch) {
      try {
        const nextState = !isTorchOn;
        await controlsRef.current.switchTorch(nextState);
        setIsTorchOn(nextState);
      } catch (err) {
        console.warn('Torche non supportée :', err);
      }
    }
  };

  // Traitement d'un fichier image (upload ou drag-and-drop)
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setCameraError("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
      return;
    }

    setIsProcessingImage(true);
    setCameraError(null);

    const objectUrl = URL.createObjectURL(file);
    try {
      const codeReader = new BrowserQRCodeReader();
      const result = await codeReader.decodeFromImageUrl(objectUrl);
      if (result) {
        handleScanResult(result.getText());
      } else {
        setCameraError("Aucun QR code lisible n'a été détecté sur cette image.");
      }
    } catch {
      setCameraError("Aucun QR code valide détecté sur cette photo. Essayez un cliché plus net.");
    } finally {
      URL.revokeObjectURL(objectUrl);
      setIsProcessingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  return (
    <div className="qr-scanner-wrapper">
      {/* Fenêtre de visée vidéo */}
      <div
        className={`qr-scanner-viewport ${isDraggingOver ? 'qr-scanner-dropzone active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
      >
        {isScanning && !cameraError ? (
          <>
            <video
              ref={videoRef}
              className="qr-scanner-video"
              playsInline
              muted
              autoPlay
            />

            {/* Overlay et Réticule doré */}
            <div className="qr-scanner-overlay">
              <div
                className={`qr-scanner-reticle ${isSuccessFlash ? 'success' : ''}`}
                style={{
                  borderColor: isSuccessFlash ? '#4caf50' : 'var(--color-gold)'
                }}
              >
                <div className="qr-scanner-corner tl" />
                <div className="qr-scanner-corner tr" />
                <div className="qr-scanner-corner bl" />
                <div className="qr-scanner-corner br" />
                <div className="qr-scanner-laser" />
              </div>
            </div>

            {/* Badge état du scan */}
            <div className="qr-scanner-status-tag">
              <span className="qr-scanner-dot" />
              <span>{isSuccessFlash ? '✓ QR Détecté !' : 'Caméra active'}</span>
            </div>
          </>
        ) : (
          <div className="qr-scanner-fallback">
            <div style={{ fontSize: '2.4rem' }}>📷</div>
            {cameraError ? (
              <div>
                <p style={{ fontWeight: 600, color: '#fca5a5', marginBottom: 6 }}>
                  {cameraError}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-parchment-border)' }}>
                  Vous pouvez réactiver la caméra ou importer une photo du QR code ci-dessous.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>
                  Scan caméra en pause
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-parchment-border)' }}>
                  Cliquez sur « Activer la caméra » pour lancer la détection en direct.
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Button
                variant="primary"
                onClick={() => {
                  setIsScanning(true);
                  startCamera();
                }}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                🎥 Activer la caméra
              </Button>
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                🖼 Importer une photo
              </Button>
            </div>
          </div>
        )}
      </div>

      <p className="text-subtle" style={{ fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>
        {placeholderText}
      </p>

      {/* Barre d'outils et commandes */}
      <div className="qr-scanner-controls">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            onClick={() => setIsScanning((prev) => !prev)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            title={isScanning ? 'Mettre la caméra en pause' : 'Reprendre le scan'}
          >
            {isScanning ? '⏸ Mettre en pause' : '▶ Reprendre le scan'}
          </Button>

          {/* Sélecteur de caméra si plusieurs sont disponibles */}
          {devices.length > 1 && (
            <select
              className="qr-scanner-select"
              value={selectedDeviceId || ''}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              title="Choisir l'objectif de caméra"
            >
              {devices.map((device, index) => (
                <option key={device.deviceId || index} value={device.deviceId}>
                  {device.label || `Caméra ${index + 1}`}
                </option>
              ))}
            </select>
          )}

          {supportsTorch && isScanning && (
            <Button
              variant="secondary"
              onClick={handleToggleTorch}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
              title="Allumer / Éteindre le flash"
            >
              {isTorchOn ? '🔦 Flash On' : '💡 Flash'}
            </Button>
          )}
        </div>

        <div>
          {/* Bouton d'import photo / image */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingImage}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            title="Analyser un QR code depuis un fichier photo ou capture d'écran"
          >
            {isProcessingImage ? '⏳ Analyse en cours...' : '📁 Importer une image'}
          </Button>
        </div>
      </div>
    </div>
  );
};
