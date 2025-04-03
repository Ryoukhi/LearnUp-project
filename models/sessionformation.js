'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SessionFormation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Relation avec User (Admin)
     

      // Relation avec User (Formateur)
      SessionFormation.belongsTo(models.User, {
        foreignKey: "idFormateur",
        as: "formateur",
      });

      SessionFormation.belongsToMany(models.User, {
        through: "Inscription",
        foreignKey: "idSession",
        otherKey: "idUser",
        as: "apprenants",
      });

      SessionFormation.hasMany(models.Devoir, {
        foreignKey: "idSession",
        as: "devoirs",
      });
      

      SessionFormation.hasMany(models.Certificat, {
        foreignKey: "idSession",
        as: "certificats",
      });
        
      SessionFormation.hasMany(models.Videoconference, {
        foreignKey: "idSession",
        as: "videoconferences",
      });

      SessionFormation.hasMany(models.RessourcePedagogique, {
        foreignKey: "idSession",
        as: "ressources",
      });
      
      SessionFormation.hasOne(models.Forum, {
        foreignKey: "idSession",
        as: "forum",
      });
      
      SessionFormation.hasMany(models.Paiement, {
        foreignKey: "idSession",
        as: "paiements",
      });
      
    }
  }
  SessionFormation.init({
    titre: DataTypes.STRING,
    description: DataTypes.TEXT,
    dateDebut: DataTypes.DATE,
    dateFin: DataTypes.DATE,
    idFormateur: DataTypes.INTEGER,
    montant: DataTypes.FLOAT,
    
  }, {
    sequelize,
    modelName: 'SessionFormation',
  });
  return SessionFormation;
};

