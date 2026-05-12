import axios from 'axios';

// Créer une instance axios configurée une fois pour toutes
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // L'URL de base de ton API
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTEUR DE REQUÊTE
// S'exécute avant chaque requête axios
api.interceptors.request.use(
  (config) => {
    // Récupérer le token stocké localement
    const token = localStorage.getItem('token');
    
    if (token) {
      // Ajouter le token dans le header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTEUR DE RÉPONSE
// S'exécute après chaque réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token est expiré/invalide → déconnecter l'utilisateur
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;