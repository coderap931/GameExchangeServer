const {Sequelize} = require('sequelize');

//!For Local DB, change for deployment
// const db = new Sequelize(`postgres://postgres:${process.env.DATABASE_PASSWORD}@localhost:5432/gameExchange`,{
//     dialect: 'postgres',
// });

//!For Deployment, uncomment this and comment out Local DB connection
const db = new Sequelize(`postgres://postgres:${encodeURIComponent(process.env.PASS)}@localhost/gameExchange`, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = db;