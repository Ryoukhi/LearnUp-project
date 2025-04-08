'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('SessionFormations', 'nombre_place', {
      type: Sequelize.INTEGER,
      allowNull: true, // Allow null values
    });

    await queryInterface.addColumn('SessionFormations', 'status', {
      type: Sequelize.ENUM('en attente', 'en cours', 'terminée', 'annulée'), // Enum for session status
      defaultValue: 'en attente', // Default value
      allowNull: false,
    });

    await queryInterface.addColumn('SessionFormations', 'certificat_disponible', {
      type: Sequelize.ENUM('oui', 'non'),
      defaultValue: 'oui', // Default value
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('SessionFormations', 'nombre_place');
    await queryInterface.removeColumn('SessionFormations', 'status');
    await queryInterface.removeColumn('SessionFormations', 'certificat_disponible');
  }
};
