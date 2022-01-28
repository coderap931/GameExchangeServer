const {DataTypes} = require("sequelize");
const db = require("../db");
const User = db.define("user", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
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
        required: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        required: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
    },
    role: {
        type: DataTypes.ENUM('Admin', 'Client'),
        allowNull: false,
        unique: false,
    },
});

module.exports = User;