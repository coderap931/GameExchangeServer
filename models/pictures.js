const {DataTypes} = require("sequelize");
const db = require("../db");
const Pictures = db.define("pictures", {
    picture_one: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    picture_two: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    picture_three: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    picture_four: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    picture_five: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
});

module.exports = Pictures;