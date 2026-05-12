import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard'); // Rediriger vers le dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <aside className="auth-aside" aria-hidden="true">
        <span className="eyebrow">Task Manager</span>
        <h1>Reprenez le contrôle de vos priorités.</h1>
        <div className="auth-preview">
          <div className="preview-row complete" />
          <div className="preview-row active" />
          <div className="preview-row" />
        </div>
      </aside>
      <div className="auth-card">
        <div className="auth-header">
          <span className="eyebrow">Bon retour</span>
          <h2>Connexion</h2>
          <p>Accédez à votre tableau de tâches personnel.</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail size={17} aria-hidden="true" />
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="vous@exemple.com"
              inputMode="email"
              autoComplete="email"
              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
              required
            />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-with-icon">
              <LockKeyhole size={17} aria-hidden="true" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Votre mot de passe"
              required
            />
            </div>
          </div>
          
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
        
        <p className="auth-switch">
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
