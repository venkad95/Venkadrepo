'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('acknowledge', 
      { 
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        user_id:{
          type: Sequelize.UUID,
          allowNull: false,
          references:{
            model: 'user_detail',
            key: 'uuid'
          },
          onDelete: 'CASCADE'
        },
        otp: {
          type: Sequelize.STRING,
          allowNull: true
        },
        otpExpiresAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        acknowledge_type: {
          type: Sequelize.STRING,
          allowNull: true
        },
        isAcknowledged: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
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
    await queryInterface.dropTable('acknowledge');
  }
};
