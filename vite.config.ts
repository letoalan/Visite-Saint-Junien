import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'assets/*.png', 'assets/*.svg'],
      manifest: {
        name: 'Visite de Saint-Junien : Bâtir la foi, gouverner la ville',
        short_name: 'Visite St-Junien',
        description: 'Parcours historique interactif de Saint-Junien en 5 spots et 25 énigmes.',
        theme_color: '#252923',
        background_color: '#F3E8D0',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}']
      }
    })
  ],
  test: {
    globals: true,
    environment: 'node'
  }
});
