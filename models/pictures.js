const {DataTypes} = require("sequelize");
const db = require("../db");
const User = db.define("pictures", {
    listingid: { //Primary to Listing.ID foreign
        type: DataTypes.NUM,
        allowNull: false,
        unique: true,
    },
    pictureone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    picturetwo: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    picturethree: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    picturefour: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    picturefive: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
});

module.exports = User;