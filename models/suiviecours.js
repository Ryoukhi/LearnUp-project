'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SuivieCours extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Association with User
      SuivieCours.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Association with Videoconference
      SuivieCours.belongsTo(models.Videoconference, {
        foreignKey: 'videoconferenceId',
        as: 'videoconference',
        onDelete: 'CASCADE'
      });
    }
  }
  SuivieCours.init({
    userId: DataTypes.INTEGER,
    videoconferenceId: DataTypes.INTEGER,
    dateValidation: {
      type: DataTypes.DATE,
      allowNull: false
    },
    signedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'SuivieCours',
  });
  return SuivieCours;
};