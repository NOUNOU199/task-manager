import { useEffect, useState } from 'react';
import {
	AlertCircle,
	CheckCircle2,
	ClipboardList,
	ListTodo,
	LogOut,
	Plus,
	Search,
	Timer,
	X,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const STATUS_FILTERS = [
	{ value: 'all', label: 'Toutes' },
	{ value: 'todo', label: 'À faire' },
	{ value: 'in-progress', label: 'En cours' },
	{ value: 'done', label: 'Terminées' },
];

const Dashboard = () => {
	const { user, logout } = useAuth();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [editingTask, setEditingTask] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [activeFilter, setActiveFilter] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		let ignore = false;

		const loadTasks = async () => {
			try {
				const { data } = await api.get('/tasks');

				if (!ignore) {
					setTasks(data.tasks || []);
				}
			} catch (err) {
				if (!ignore) {
					setError(err.response?.data?.message || 'Erreur de chargement');
				}
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		loadTasks();

		return () => {
			ignore = true;
		};
	}, []);

	const handleCreate = async (formData) => {
		setError('');
		try {
			const { data } = await api.post('/tasks', formData);
			setTasks((prev) => [data.task, ...prev]);
		} catch (err) {
			setError(err.response?.data?.message || 'Erreur de creation');
		}
	};

	const handleEdit = (task) => {
		setEditingTask(task);
		setShowModal(true);
	};

	const handleUpdate = async (formData) => {
		if (!editingTask) return;
		setError('');

		try {
			const { data } = await api.put(`/tasks/${editingTask._id}`, formData);
			setTasks((prev) =>
				prev.map((task) => (task._id === data.task._id ? data.task : task))
			);
			setShowModal(false);
			setEditingTask(null);
		} catch (err) {
			setError(err.response?.data?.message || 'Erreur de mise a jour');
		}
	};

	const handleDelete = async (taskId) => {
		setError('');
		try {
			await api.delete(`/tasks/${taskId}`);
			setTasks((prev) => prev.filter((task) => task._id !== taskId));
		} catch (err) {
			setError(err.response?.data?.message || 'Erreur de suppression');
		}
	};

	const closeModal = () => {
		setShowModal(false);
		setEditingTask(null);
	};

	const normalizedSearch = searchTerm.trim().toLowerCase();
	const filteredTasks = tasks.filter((task) => {
		const matchesStatus = activeFilter === 'all' || task.status === activeFilter;
		const searchable = `${task.title} ${task.description || ''}`.toLowerCase();
		return matchesStatus && searchable.includes(normalizedSearch);
	});

	const stats = {
		total: tasks.length,
		todo: tasks.filter((task) => task.status === 'todo').length,
		inProgress: tasks.filter((task) => task.status === 'in-progress').length,
		done: tasks.filter((task) => task.status === 'done').length,
	};

	return (
		<div className="app-shell">
			<nav className="navbar">
				<div className="brand-mark" aria-hidden="true">
					<ClipboardList size={22} />
				</div>
				<div className="brand-copy">
					<span className="eyebrow">Workspace</span>
					<h1>Task Manager</h1>
				</div>
				<div className="nav-right">
					<div className="user-chip" title={user?.email || 'Utilisateur'}>
						<span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
						<strong>{user?.name || 'Utilisateur'}</strong>
					</div>
					<button type="button" className="icon-button" onClick={logout} aria-label="Se déconnecter">
						<LogOut size={18} />
					</button>
				</div>
			</nav>

			<main className="main-content">
				<section className="dashboard-hero">
					<div>
						<span className="eyebrow">Aujourd'hui</span>
						<h2>Bonjour {user?.name?.split(' ')[0] || 'à vous'}, clarifions la journée.</h2>
						<p>
							Créez, filtrez et suivez vos tâches sans perdre le fil.
						</p>
					</div>
					<button
						type="button"
						className="btn-primary hero-action"
						onClick={() => document.getElementById('task-title')?.focus()}
					>
						<Plus size={18} />
						Nouvelle tâche
					</button>
				</section>

				<section className="stats-grid" aria-label="Résumé des tâches">
					<div className="stat-tile">
						<ClipboardList size={20} />
						<span>Total</span>
						<strong>{stats.total}</strong>
					</div>
					<div className="stat-tile accent-warm">
						<ListTodo size={20} />
						<span>À faire</span>
						<strong>{stats.todo}</strong>
					</div>
					<div className="stat-tile accent-cool">
						<Timer size={20} />
						<span>En cours</span>
						<strong>{stats.inProgress}</strong>
					</div>
					<div className="stat-tile accent-good">
						<CheckCircle2 size={20} />
						<span>Terminées</span>
						<strong>{stats.done}</strong>
					</div>
				</section>

				{error && (
					<div className="error-message">
						<AlertCircle size={18} />
						<span>{error}</span>
						<button type="button" className="mini-icon-button" onClick={() => setError('')} aria-label="Fermer l'alerte">
							<X size={16} />
						</button>
					</div>
				)}

				<section className="workspace-grid">
					<div className="form-container">
						<div className="section-heading">
							<span className="eyebrow">Capture rapide</span>
							<h3>Ajouter une tâche</h3>
						</div>
						<TaskForm onSubmit={handleCreate} />
					</div>

					<section className="tasks-panel">
						<div className="tasks-toolbar">
							<div className="section-heading">
								<span className="eyebrow">{filteredTasks.length} résultat{filteredTasks.length > 1 ? 's' : ''}</span>
								<h3>Mes tâches</h3>
							</div>
							<label className="search-field" htmlFor="task-search">
								<Search size={17} aria-hidden="true" />
								<input
									id="task-search"
									type="search"
									value={searchTerm}
									onChange={(event) => setSearchTerm(event.target.value)}
									placeholder="Rechercher"
								/>
							</label>
						</div>

						<div className="segmented-control" role="tablist" aria-label="Filtrer les tâches">
							{STATUS_FILTERS.map((filter) => (
								<button
									key={filter.value}
									type="button"
									role="tab"
									aria-selected={activeFilter === filter.value}
									className={activeFilter === filter.value ? 'is-active' : ''}
									onClick={() => setActiveFilter(filter.value)}
								>
									{filter.label}
								</button>
							))}
						</div>

						{loading ? (
							<div className="loading-state">
								<div className="skeleton-card" />
								<div className="skeleton-card" />
								<div className="skeleton-card" />
							</div>
						) : filteredTasks.length === 0 ? (
							<div className="empty-state">
								<ClipboardList size={34} />
								<h3>Aucune tâche trouvée</h3>
								<p>
									{tasks.length === 0
										? 'Ajoutez votre première tâche pour démarrer proprement.'
										: 'Essayez un autre filtre ou une recherche plus courte.'}
								</p>
							</div>
						) : (
							<div className="tasks-grid">
								{filteredTasks.map((task) => (
									<TaskCard
										key={task._id}
										task={task}
										onEdit={handleEdit}
										onDelete={handleDelete}
									/>
								))}
							</div>
						)}
					</section>
				</section>
			</main>

			{showModal && (
				<div className="modal-overlay" onClick={closeModal}>
					<div className="modal" onClick={(event) => event.stopPropagation()}>
						<div className="modal-header">
							<div>
								<span className="eyebrow">Mise à jour</span>
								<h3>Modifier la tâche</h3>
							</div>
							<button type="button" className="mini-icon-button" onClick={closeModal} aria-label="Fermer">
								<X size={18} />
							</button>
						</div>
						<TaskForm
							onSubmit={handleUpdate}
							initialData={editingTask}
							onCancel={closeModal}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
