import Task from '../models/Task.js';

// GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    // Récupérer SEULEMENT les tâches de l'utilisateur connecté
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      user: req.user._id, // Lier la tâche à l'utilisateur connecté
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // findOneAndUpdate pour trouver ET mettre à jour en une seule opération
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Condition: l'id ET l'user
      { title, description, status },
      { new: true, runValidators: true } // new: retourne le doc mis à jour
    );

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // Sécurité: un user ne peut supprimer que SES tâches
    });

    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json({ success: true, message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};