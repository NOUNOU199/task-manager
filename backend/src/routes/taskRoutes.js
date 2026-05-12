import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes tasks sont protégées
// protect s'exécute AVANT chaque controller
router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);

export default router;