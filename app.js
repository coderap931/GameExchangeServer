require("dotenv").config();
const Express = require("express");
const db = require("./db");
const app = Express();

app.use(require("./middleware/headers"));
const controllers = require("./controllers");

app.use(Express.json());

app.use("/user", controllers.usercontroller);
app.use("/listing", controllers.listingcontroller);
app.use("/order", controllers.ordercontroller);
app.use("/pictures", controllers.picturescontroller);

db.authenticate()
    .then(() => db.sync())
    .then(() => {
        app.listen(process.env.PORT, () =>
        console.log(`[Server: ] App is listening on Port ${process.env.PORT}`));
    })
    .catch((err) => {
        console.log(`[Server: ] Server Crashed. Error: ${err}`);
        console.error(err);
    });