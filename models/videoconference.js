'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Videoconference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Videoconference.belongsTo(models.SessionFormation, {
        foreignKey: "idSession",
        as: "session",
      });
      
    }
  }
  Videoconference.init({
    titre: DataTypes.STRING,
    description: DataTypes.STRING,
    dateHeure: DataTypes.DATE,
    lien: DataTypes.STRING,
    idSession: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Videoconference',
  });
  return Videoconference;
};