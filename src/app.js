"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongodb_1 = require("mongodb");
var secrets_1 = require("./config/secrets");
var app = express();
mongodb_1.MongoClient.connect(secrets_1.MONGODB_URI, { useNewUrlParser: true }).then(function (client) {
    var db = client.db(secrets_1.dbName);
    console.log('SUCCESSFULLY CONNECTED TO MONGODB SERVER');
}).catch(function (error) {
    console.log('MongoDB connection error: ' + error);
});
app.set('port', process.env.PORT || 3000);
app.get('/', function (req, res) {
    res.send('Hello World!');
});
exports.default = app;
