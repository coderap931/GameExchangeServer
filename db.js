const {Sequelize} = require('sequelize');

//!For Local DB, change for deployment
// const db = new Sequelize(`postgresql://postgres:${process.env.DATABASE_PASSWORD}@localhost:5432/gameExchange`,{
//     dialect: 'postgres',
// });

//!For Deployment, uncomment this and comment out Local DB connection
const db = new Sequelize(`postgresql://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/${process.env.DBNAME}`, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

module.exports = db;