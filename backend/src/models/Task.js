import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [100, 'Maximum 100 caractères'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Maximum 500 caractères'],
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'], // Seules ces valeurs sont acceptées
      default: 'todo',
    },
    // Référence vers le User — comme une clé étrangère en SQL
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Pointe vers le modèle 'User'
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;