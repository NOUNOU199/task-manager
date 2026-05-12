import { CalendarDays, CheckCircle2, Circle, Pencil, Timer, Trash2 } from 'lucide-react';

const STATUS_LABELS = {
  'todo': 'À faire',
  'in-progress': 'En cours',
  'done': 'Terminé',
};

const STATUS_ICONS = {
  'todo': Circle,
  'in-progress': Timer,
  'done': CheckCircle2,
};

const TaskCard = ({ task, onDelete, onEdit }) => {
  const StatusIcon = STATUS_ICONS[task.status] || Circle;
  const createdDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
      })
    : 'Aujourd’hui';

  return (
    <article className={`task-card task-card-${task.status || 'todo'}`}>
      <div className="task-header">
        <span className="status-badge">
          <StatusIcon size={14} aria-hidden="true" />
          {STATUS_LABELS[task.status]}
        </span>
        <div className="task-actions">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="icon-button subtle"
            aria-label={`Modifier ${task.title}`}
            title="Modifier"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task._id)}
            className="icon-button danger"
            aria-label={`Supprimer ${task.title}`}
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3>{task.title}</h3>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-footer">
        <span className="task-date" title="Date de création">
          <CalendarDays size={15} aria-hidden="true" />
          {createdDate}
        </span>
      </div>
    </article>
  );
};

export default TaskCard;
