var express = require('express');
var app = express();

const accounts = require('./accounts');
const owner = require('./owner');
var renter = require('./renter');
var oracle = require('./oracle');
var location = require('./location');
var s2 = require('./s2');

//Routes
app.use('/account', accounts);

app.use('/owner', owner);

app.use('/renter', renter);

app.use ('/oracle' , oracle);

app.use ('/location' , location);

app.use ('/s2' , s2);

module.exports = app;

