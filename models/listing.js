const {DataTypes} = require("sequelize");
const db = require("../db");
const User = db.define("listing", {
    sellerid: { //Primary to User.ID foreign
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
    },
    sold: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    new: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
    },
    condition: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    price: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
    },
    pictures: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
    },
});

module.exports = Listing;