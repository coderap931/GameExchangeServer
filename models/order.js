const {DataTypes} = require("sequelize");
const db = require("../db");
const User = db.define("order", {
    listingid: { //Primary to Listing.ID foreign
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: true,
    },
    buyerid: { //Primary to User.ID foreign
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
    },
    totalprice: {
        type: DataTypes.NUMBER,
        allowNull: false,
        unique: false,
    },
    datetime: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    shippingaddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
});

module.exports = Order;