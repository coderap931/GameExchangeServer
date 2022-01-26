const {DataTypes} = require("sequelize");
const db = require("../db");
const User = db.define("user", {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    rating: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
});

module.exports = User;