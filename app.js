require("dotenv").config();
const Express = require("express");
const app = Express();
const cors = require('cors');

app.use(require("./middleware/headers"));
app.use(cors());
const dbConnection = require("./db");
const controllers = require("./controllers");
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