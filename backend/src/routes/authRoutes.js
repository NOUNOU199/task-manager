import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Routes publiques (pas besoin d'être connecté)
router.post('/register', register);
router.post('/login', login);

// Route protégée (le middleware protect s'exécute avant getMe)
router.get('/me', protect, getMe);

export default router;