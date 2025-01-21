import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { authMiddleware } from './middleware/authMiddleware';
import { AppDataSource } from './config/data-source';
import multer from 'multer';
import privateRoutes from './routes/PrivateRoutes';
import publicRoutes from './routes/PublicRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// Ruta pública para servir imágenes
console.log('Serving static files from:', path.join(__dirname, 'uploads/imagenes'));
app.use('/uploads/imagenes', express.static(path.join(__dirname, 'uploads/imagenes')));

// Rutas públicas
app.use('/api', publicRoutes);

// Middleware global para autenticación
app.use(authMiddleware);

// Rutas privadas
app.use('/api', privateRoutes);

// Middleware para manejar errores de multer y otros errores
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Error al subir la imagen: ${err.message}` });
  }
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => console.log('Error during Data Source initialization:', error));
