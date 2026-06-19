'use strict';

module.exports = (sequelize, DataTypes) => {
    const UserDetails = sequelize.define('UserDetails', {

        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },

        lastName: {
            type: DataTypes.STRING,
            allowNull: true
        },

        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            unique: true
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        accessToken: DataTypes.STRING,
        refreshToken: DataTypes.STRING,
        password: DataTypes.STRING,
        inviteId: DataTypes.UUID,
        role: DataTypes.STRING

    }, {
        tableName: 'user_detail',
        timestamps: true
    });

    UserDetails.associate = (models) => {
        UserDetails.hasMany(models.ProductDetails, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
    };

    return UserDetails;
};