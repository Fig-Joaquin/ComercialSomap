import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

// Cargar variables de entorno desde `.env`
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puedes ajustar el puerto aquí
  },
  define: {
    'process.env': process.env, // Inyectar variables de entorno
  },
});
