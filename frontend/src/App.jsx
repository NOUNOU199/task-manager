import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { LoaderCircle } from 'lucide-react';

const AppLoader = () => (
  <div className="app-loader" role="status" aria-live="polite">
    <LoaderCircle className="spin" size={24} aria-hidden="true" />
    <span>Chargement de votre espace...</span>
  </div>
);

// Composant qui protège les routes privées
// Si pas connecté → redirige vers /login
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;
  return user ? children : <Navigate to="/login" replace />;
};

// Composant qui redirige les utilisateurs déjà connectés
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <AppLoader />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    
    <Route
      path="/register"
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      }
    />
    
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
