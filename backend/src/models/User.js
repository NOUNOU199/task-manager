import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Le schéma définit la STRUCTURE du document dans MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true, // Supprime les espaces en début/fin
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true, // Pas deux users avec le même email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Minimum 6 caractères'],
      select: false, // Ne jamais renvoyer le mot de passe dans les requêtes
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// MIDDLEWARE MONGOOSE (pre-save hook)
// S'exécute AVANT chaque sauvegarde
userSchema.pre('save', async function (next) {
  // Si le mot de passe n'a pas été modifié, on passe
  if (!this.isModified('password')) return next();
  
  // Sinon, on le hash avec bcrypt (coût 12 = très sécurisé)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// MÉTHODE D'INSTANCE
// Disponible sur chaque document user
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;