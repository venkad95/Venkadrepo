'use strict';

module.exports = (sequelize, DataTypes) => {
    const AcknowledgeDetails = sequelize.define('AcknowledgeDetails', {

        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'user_detail',
                key: 'uuid'
            },
            onDelete: 'CASCADE'
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // otpExpiresAt: {
        //     type: DataTypes.DATE,
        //     allowNull: false
        //   },
        acknowledge_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isAcknowledged: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

    }, {
        tableName: 'acknowledge',
        timestamps: true
    });

    AcknowledgeDetails.associate = (models) => {
        AcknowledgeDetails.belongsTo(models.UserDetails, {
            foreignKey: 'user_id'
        });
    };

    return AcknowledgeDetails;
};