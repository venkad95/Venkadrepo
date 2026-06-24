'use strict';

module.exports = (sequelize, DataTypes) => {
    const ProductDetails = sequelize.define('ProductDetails', {
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
        morning_qty: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        evening_qty: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        buying_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        perliter_rate: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
        },
        total_liters: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        purchased_liter_amount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
        },
        total_amount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true
        },
        amount_paid_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'product_detail',
        timestamps: true
    });

    ProductDetails.associate = (models) => {
        ProductDetails.belongsTo(models.UserDetails, {
            foreignKey: 'user_id',
            as: 'UserDetails' // Alias for UserDetails
        });
    };

    return ProductDetails;
};