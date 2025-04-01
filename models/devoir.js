'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Devoir extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Devoir.belongsTo(models.User, {
        foreignKey: "idUser",
        as: "apprenant",
      });
      
      Devoir.belongsTo(models.SessionFormation, {
        foreignKey: "idSession",
        as: "session",
      });
      
    }
  }
  Devoir.init({
    idUser: DataTypes.INTEGER,
    idSession: DataTypes.INTEGER,
    titre: DataTypes.STRING,
    description: DataTypes.STRING,
    fichier: DataTypes.STRING,
    dateSoumission: DataTypes.DATE,
    note: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Devoir',
  });
  return Devoir;
};