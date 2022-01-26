const {DataTypes} = require("sequelize");
const db = require("../db");
const User = db.define("order", {
    listing_id: { //Primary to Listing.ID foreign
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: true,
    },
    buyer_id: { //Primary to User.ID foreign
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
    },
    total_price: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
    },
    date_time: {
        type: DataTypes.STRING,
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