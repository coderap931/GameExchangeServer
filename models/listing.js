const {DataTypes} = require("sequelize");
const db = require("../db");
const Listing = db.define("listing", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    sold: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
    },
    item_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    newInBox: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
    },
    condition: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        unique: false,
    },
    pictureOne: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false,
    },
    pictureTwo: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false,
    },
    pictureThree: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false,
    },
});

module.exports = Listing;