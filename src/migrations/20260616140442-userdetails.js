'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('user_detail', 
      { 
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: true
        },
        mobileNumber: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        accessToken: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        refreshToken: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        inviteId: {
          type: Sequelize.UUID
        },
        role:{
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        }
      });
     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user_detail');
  }
};
