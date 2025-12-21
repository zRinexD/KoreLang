import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Carga las variables de entorno desde el archivo .env actual
    const env = loadEnv(mode, '.', '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0', // Permite acceso desde la red local
      },
      plugins: [react()],
      // Define reemplaza las variables globales en tiempo de compilación/ejecución
      // Esto simula el process.env de Node.js en el navegador para la API Key
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve('./src'), // Asegura resolución correcta de rutas
        }
      }
    };
});