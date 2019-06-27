import express = require("express");
import {MongoClient} from "mongodb";
import {dbName, MONGODB_URI} from "./config/secrets";
import bodyParser = require("body-parser");
import flash from "express-flash";
import * as passport from "passport";
import * as userController from "./controllers/user";

const app: express.Application = express();
/*Launch the database*/
MongoClient.connect(MONGODB_URI, { useNewUrlParser: true}).then((client) => {
    const db = client.db(dbName);
    console.log('SUCCESSFULLY CONNECTED TO MONGODB SERVER');
}).catch(error => {
    console.log('MongoDB connection error: ' + error);
});

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(passport.initialize()); //To manage authentification
app.use(flash()); //creating flash messages of all types for Express apps

//ROUTES
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);
app.post("/signup", userController.postSignup);

export default app; //To make app visible for all components
