'use strict';
const bcrypt = require("bcrypt");
const {
  Model,
  Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      
      User.hasMany(models.SessionFormation, {
        foreignKey: "idFormateur",
        as: "sessionsAnimees", // Un formateur peut animer plusieurs sessions
      });

      User.belongsToMany(models.SessionFormation, {
        through: "Inscription", // Table intermédiaire
        foreignKey: "idUser", // Clé étrangère de l'utilisateur
        otherKey: "idSession", // Clé étrangère de la session
        as: "sessionsInscrites", // Alias pour récupérer les sessions d’un utilisateur
      });
      
      User.hasMany(models.Certificat, {
        foreignKey: "idUser",
        as: "certificats",
      });
      
      User.hasMany(models.Paiement, {
        foreignKey: "idUser",
        as: "paiements",
      });
      
      User.hasMany(models.Devoir, {
        foreignKey: "idUser",
        as: "devoirs",
      });
      
    }
  }
  User.init({
    nom: {type: DataTypes.STRING, allowNull: false},
    prenom: {type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telephone: {type: DataTypes.STRING, allowNull: false},
    motDePasse: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.ENUM('admin', 'formateur', 'apprenant'), allowNull: false, defaultValue: 'apprenant'}
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
        // Hacher le mot de passe avant la création
        beforeCreate: async (user) => {
          if (user.motDePasse) {
            user.motDePasse = await bcrypt.hash(user.motDePasse, 10);
          }
        },
      },
  });
  return User;
};