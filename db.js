const {Sequelize} = require('sequelize');

//!For Local DB, change for deployment
const db = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD,{
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
});

//!For Deployment, uncomment this and comment out Local DB connection
// const db = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false
//         }
//     }
// });

module.exports = db;