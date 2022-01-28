const {DataTypes} = require("sequelize");
const db = require("../db");
const Order = db.define("order", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        unique: false,
    },
    date_time: {
        type: DataTypes.DATE,
        allowNull: false,
        unique: false,
    },
    shipping_address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
});

module.exports = Order;