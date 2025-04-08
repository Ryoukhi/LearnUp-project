'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Inscriptions', 'status', {
      type: Sequelize.ENUM('pending', 'active', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Inscriptions', 'status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Inscriptions_status";');
  }
};
