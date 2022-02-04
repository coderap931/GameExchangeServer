require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");

app.use(require("./middleware/headers"));
const controllers = require("./controllers");

app.use(Express.json());

app.use("/user", controllers.usercontroller);
app.use("/listing", controllers.listingcontroller);
app.use("/order", controllers.ordercontroller);
app.use("/pictures", controllers.picturescontroller);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.DATABASE_PORT, () =>
        console.log(`[Server: ] App is listening on Port ${process.env.DATABASE_PORT}`));
    })
    .catch((err) => {
        console.log(`[Server: ] Server Crashed. Error: ${err}`);
        console.error(err);
    });