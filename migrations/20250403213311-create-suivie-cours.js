'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SuivieCours', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
     userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Name of the users table
          key: 'id',
        },
        onDelete: 'CASCADE', // Delete entries if the user is deleted
        onUpdate: 'CASCADE',
      },
      videoconferenceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Videoconferences', // Name of the videoconferences table
          key: 'id',
        },
        onDelete: 'CASCADE', // Delete entries if the videoconference is deleted
        onUpdate: 'CASCADE',
      },
      signedIn: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default to false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SuivieCours');
  }
};