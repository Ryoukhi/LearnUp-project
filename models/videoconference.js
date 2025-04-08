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

      Videoconference.hasMany(models.SuivieCours, {
        foreignKey: 'videoconferenceId',
        as: 'suivieCours'
      });
      
      Videoconference.belongsToMany(models.User, {
        through: models.SuivieCours,
        foreignKey: 'videoconferenceId',
        otherKey: 'userId',
        as: 'users'
      });
      
      Videoconference.belongsTo(models.SessionFormation, {
        foreignKey: "idSession",
        as: "session",
      });
      
    }
  }
  Videoconference.init({
    titre: {

        type: DataTypes.STRING,

        allowNull: false, // Assuming title should not be null

      },

      description: {

        type: DataTypes.STRING,

        allowNull: true, // Assuming description can be null

      },

      dateHeure: {

        type: DataTypes.DATE,

        allowNull: false, // Assuming date and time should not be null

      },

      lien: {

        type: DataTypes.STRING,

        allowNull: true, // Allowing null for the link

      },

    }, {

      sequelize,

      modelName: 'Videoconference',

    });
  return Videoconference;
};