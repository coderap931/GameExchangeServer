const db = require('../db');
const User = require('./user');
const Listing = require('./listing');
const Order = require('./order');

//DB table associations
User.hasMany(Listing);
User.hasMany(Order);

Listing.belongsTo(User);
Listing.hasOne(Order);

Order.belongsTo(User);
Order.belongsTo(Listing);

module.exports = {
    dbConnection: db,
    models: {
        User,
        Listing,
        Order,
    }
};