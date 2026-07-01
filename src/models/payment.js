'use strict';

module.exports = (sequelize, DataTypes) => {
    const Payments = sequelize.define('Payments', {

        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: true
          },
          perliter_rate: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
          },
          from_date: {
            type: DataTypes.DATE,
            allowNull: true
          },
          to_date: {
            type: DataTypes.DATE,
            allowNull: true
          },
          total_liter: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
          },
          total_amount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
          },
          advance_payment: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
          },
          final_amount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
          },
          partial_payment: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
          },
          full_payment: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
          },
          payment_status: {
            type: DataTypes.ENUM('pending', 'completed'),
            allowNull: false,
            defaultValue: 'pending'
          },
          paid_by: {
            type: DataTypes.UUID,
            allowNull: true
          },

    }, {
        tableName: 'payment',
        timestamps: true
    });

    Payments.associate = (models) => {
        Payments.belongsTo(models.UserDetails, {
            foreignKey: 'user_id'
        });
    };

    return Payments;
};