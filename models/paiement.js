'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paiement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Paiement.belongsTo(models.User, {
        foreignKey: "idUser",
        as: "etudiant",
      });
      
      Paiement.belongsTo(models.SessionFormation, {
        foreignKey: "idSession",
        as: "session",
      });
      
    }
  }
  Paiement.init({
    idUser: DataTypes.INTEGER,
    idSession: DataTypes.INTEGER,
    montant: DataTypes.FLOAT,
    statut: DataTypes.STRING,
    datePaiement: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Paiement',
  });
  return Paiement;
};