'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RessourcePedagogique extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RessourcePedagogique.belongsTo(models.SessionFormation, {
        foreignKey: "idSession",
        as: "session",
      });
      
    }
  }
  RessourcePedagogique.init({
    titre: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    lien: DataTypes.STRING,
    idSession: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RessourcePedagogique',
  });
  return RessourcePedagogique;
};