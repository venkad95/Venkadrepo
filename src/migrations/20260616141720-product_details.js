'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('product_detail', 
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
        product_name: {
          type: Sequelize.STRING,
          allowNull: true
        },
        product_qty: {
          type: Sequelize.FLOAT,
          allowNull: true
        },
        buying_date:{
          type: Sequelize.DATEONLY,
          allowNull: true
        },
        perliter_rate: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        total_liters: {
          type: Sequelize.FLOAT,
          allowNull: true
        },
        total_days: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        total_amount: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        amount_paid_status: {
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
    await queryInterface.dropTable('product_detail');
  }
};
