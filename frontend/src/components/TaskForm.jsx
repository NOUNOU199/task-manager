import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Save, Timer, X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'À faire', Icon: Circle },
  { value: 'in-progress', label: 'En cours', Icon: Timer },
  { value: 'done', label: 'Terminé', Icon: CheckCircle2 },
];

const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo',
  }));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Remonter les données au parent
    // Reset du formulaire si pas en mode édition
    if (!initialData) {
      setFormData({ title: '', description: '', status: 'todo' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor={initialData ? 'edit-task-title' : 'task-title'}>Titre *</label>
        <input
          type="text"
          id={initialData ? 'edit-task-title' : 'task-title'}
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex. Préparer la livraison"
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={initialData ? 'edit-task-description' : 'task-description'}>
          Description
        </label>
        <textarea
          id={initialData ? 'edit-task-description' : 'task-description'}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Contexte, détails ou prochaine action"
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="form-group">
        <span className="field-label">Statut</span>
        <div className="status-picker" role="radiogroup" aria-label="Statut de la tâche">
          {STATUS_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              className={formData.status === value ? 'is-selected' : ''}
              onClick={() => setFormData((current) => ({ ...current, status: value }))}
              role="radio"
              aria-checked={formData.status === value}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {initialData ? <Save size={18} /> : <Plus size={18} />}
          {initialData ? 'Mettre à jour' : 'Créer la tâche'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            <X size={17} />
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
