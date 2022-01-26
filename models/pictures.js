const {DataTypes} = require("sequelize");
const db = require("../db");
const User = db.define("pictures", {
    listing_id: { //Primary to Listing.ID foreign
        type: DataTypes.NUM,
        allowNull: false,
        unique: true,
    },
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

module.exports = User;