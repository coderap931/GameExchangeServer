const db = require('../db');

const User = require('./user');
const Listing = require('./listing');
const Order = require('./order');
const Pictures = require('./pictures');

//DB table associations
User.hasMany(Listing);
User.hasMany(Order);

Listing.belongsTo(User);
Listing.hasOne(Order);
Listing.hasOne(Pictures);

Order.belongsTo(User);
Order.belongsTo(Listing);

Pictures.belongsTo(Listing);

module.exports = {
    dbConnection: db,
    models: {
        User,
        Listing,
        Order,
        Pictures,
    }
};