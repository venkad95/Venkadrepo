'use strict';

module.exports = (sequelize, DataTypes) => {
    const ProductMaster = sequelize.define('ProductMaster', {

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
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },

    }, {
        tableName: 'product_master',
        timestamps: true
    });

    ProductMaster.associate = (models) => {
        ProductMaster.belongsTo(models.UserDetails, {
            foreignKey: 'user_id'
        });
    };

    return ProductMaster;
};