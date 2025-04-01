'use strict';
//const { SessionFormation } = require('../models/sessionformation'); 

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Certificat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Certificat.belongsTo(models.SessionFormation, {
        foreignKey: "idSession",
        as: "session",
      });
      
      Certificat.belongsTo(models.User, {
        foreignKey: "idUser",
        as: "apprenant",
      });
      
    }
  }
  Certificat.init({
    numero: DataTypes.STRING,
    dateDelivrance: DataTypes.DATE,
    idSession: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Certificat',
  });
  return Certificat;
};