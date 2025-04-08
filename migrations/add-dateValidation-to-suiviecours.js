'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SuivieCours', 'dateValidation', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now') // Set default to current timestamp
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SuivieCours', 'dateValidation');
  }
};
