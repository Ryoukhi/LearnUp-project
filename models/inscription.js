'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Inscription.belongsTo(models.User, {
        foreignKey: 'idUser',
        as: 'user'
      });
      Inscription.belongsTo(models.SessionFormation, {
        foreignKey: 'idSession', 
        as: 'session'
      });
    }
  }
  Inscription.init({
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    idSession: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "SessionFormations",
        key: "id",
      },
    },
    dateInscription: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'Inscription',
  });
  return Inscription;
};