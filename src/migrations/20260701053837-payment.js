'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('payment', 
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
        perliter_rate: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        from_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        to_date: {
          type: Sequelize.DATE,
          allowNull: true
        },
        total_liter: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        total_amount: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        advance_payment: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        final_amount: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        partial_payment: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        full_payment: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true
        },
        payment_status: {
          type: Sequelize.ENUM('pending', 'completed'),
          allowNull: false,
          defaultValue: 'pending'
        },
        paid_by: {
          type: Sequelize.UUID,
          allowNull: true
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
    await queryInterface.dropTable('payment');
  }
};
