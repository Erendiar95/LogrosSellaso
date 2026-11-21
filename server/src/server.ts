import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import friendsRoutes from './routes/friendsRoutes.js';
import achievementsRoutes from './routes/achievementsRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: '*', // En desarrollo permitir clientes
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos subidos
const uploadsPath = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/notifications', notificationsRoutes);

// Manejador 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error no controlado:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de Logros escuchando en http://localhost:${PORT}`);
  console.log(`📁 Directorio de uploads: ${uploadsPath}`);
});

export default app;
