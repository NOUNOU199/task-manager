import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    // 1. Récupérer le token dans le header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      // "Bearer eyJhbGciOiJ..." → on prend la partie après "Bearer "
    }

    if (!token) {
      return res.status(401).json({ message: 'Non autorisé, token manquant' });
    }

    // 2. Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Si le token est falsifié ou expiré, jwt.verify lance une erreur

    // 3. Récupérer l'utilisateur depuis la DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // 4. Attacher l'utilisateur à la requête pour les controllers suivants
    req.user = user;
    next(); // Passer au prochain middleware ou controller
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

export default protect;