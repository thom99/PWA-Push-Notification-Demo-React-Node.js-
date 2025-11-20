import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configurazione del proxy per reindirizzare le chiamate API al server Node.js
    proxy: {
      // Ogni richiesta che inizia con /api (es. /api/subscribe)
      "/api": {
        target: "http://localhost:3000", // L'indirizzo del tuo server Node.js
        changeOrigin: true, // Necessario per gli host virtuali
        secure: false, // Se usi HTTP (non HTTPS)
        // Per assicurarsi che la richiesta vada a /subscribe e non /api/subscribe sul backend
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
