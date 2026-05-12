import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

// ===== CORS EXPLIQUÉ =====
// Par défaut, les navigateurs bloquent les requêtes vers un autre domaine/port.
// React tourne sur localhost:5173, Express sur localhost:3001.
// Le navigateur voit deux "origines" différentes → bloque la requête.
// CORS (Cross-Origin Resource Sharing) permet d'autoriser ces requêtes.
app.use(
  cors({
    origin: 'http://localhost:5173', // Autoriser SEULEMENT React en dev
    credentials: true, // Autoriser les cookies/headers d'auth
  })
);

// Middleware pour lire le JSON dans req.body
// Sans ça, req.body serait undefined pour les POST/PUT
app.use(express.json());

// Middleware pour lire les données de formulaires HTML
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====
// Toutes les routes /api/auth/* → authRoutes
app.use('/api/auth', authRoutes);
// Toutes les routes /api/tasks/* → taskRoutes
app.use('/api/tasks', taskRoutes);

// Route de test (health check)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API en marche' });
});

// Middleware de gestion des erreurs (doit être EN DERNIER)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur interne' });
});

export default app;