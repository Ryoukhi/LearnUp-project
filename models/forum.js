'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Forum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Forum.belongsTo(models.SessionFormation, {
        foreignKey: "idSession",
        as: "session",
      });

    }
  }
  Forum.init({
    titre: DataTypes.STRING,
    description: DataTypes.STRING,
    idSession: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Forum',
  });
  return Forum;
};