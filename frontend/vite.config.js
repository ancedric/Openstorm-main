import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  server: {
    port: 5174,
    strictPort: true,
    cors: true, 
    hmr: {             // <--- Doit être ICI
      protocol: 'ws',
      host: 'localhost',
      port: 5174,
    },
    headers: {
      "Access-Control-Allow-Origin": "*", // Autorise tout le monde (pour le dev/test)
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  },
  preview: { // C'est souvent ce que Render utilise pour servir le build
    port: 5174,
    strictPort: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  },
  },
  plugins: [
    react(),
    federation({
      name: 'OpenStorm',
      filename: 'remoteEntry.js', // Le fichier "carte d'identité" du module
      exposes: {
        './OpenStormModule': './src/main.jsx', // On expose toute l'app Stock
      },
      shared: ['react', 'react-dom'] // On partage les librairies de base
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});