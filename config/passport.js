const passport = require("passport"); // Importe la bibliothèque Passport.js pour l'authentification.
const LocalStrategy = require("passport-local").Strategy; // Importe la stratégie d'authentification locale de Passport.
const { User } = require("../models"); // Importe le modèle User depuis le fichier "../models".
const bcrypt = require("bcrypt"); // Importe la bibliothèque bcrypt pour la comparaison des mots de passe.

// Configure la stratégie d'authentification locale de Passport.
passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Recherche l'utilisateur en base
          const user = await User.findOne({ where: { email } });
  
          if (!user) return done(null, false, { message: "Email non trouvé" });
  
          // Vérification du mot de passe
          const isMatch = await bcrypt.compare(password, user.motDePasse);
  
          if (!isMatch) return done(null, false, { message: "Mot de passe incorrect" });
  
          // Authentification réussie
          return done(null, user);
        } catch (error) {
          console.error("Erreur lors de l'authentification :", error);
          return done(error);
        }
      }
    )
  );
  

// Configure la sérialisation de l'utilisateur pour les sessions.
passport.serializeUser((user, done) => done(null, user.id)); // Stocke l'ID de l'utilisateur dans la session.

// Configure la désérialisation de l'utilisateur pour les sessions.
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      if (!user) return done(null, false, { message: "Utilisateur introuvable" });
  
      return done(null, user);
    } catch (error) {
      console.error("Erreur lors de la désérialisation :", error);
      return done(error);
    }
  });
  

// Exporte l'instance de Passport configurée.
module.exports = passport;