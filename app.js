require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");

const controllers = require("./controllers");
const cors = require('cors');

let whitelist=['http://localhost:3001', 'https://amp-gameexchange.herokuapp.com/', 'http://localhost:3000'];
app.use(cors({origin: whitelist, credentials: true}));
app.use(Express.json());

app.use("/user", controllers.usercontroller);
app.use("/listing", controllers.listingcontroller);
app.use("/order", controllers.ordercontroller);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () =>
        console.log(`[Server: ] App is listening on Port ${process.env.PORT}`));
    })
    .catch((err) => {
        console.log(`[Server: ] Server Crashed. Error: ${err}`);
        console.error(err);
    });