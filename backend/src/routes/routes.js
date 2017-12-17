var express = require('express');
var app = express();

const accounts = require('./accounts');
const owner = require('./owner');
var renter = require('./renter');
var cars = require('./cars');

//Routes
app.use('/account', accounts);

app.use('/owner', owner);

app.use('/renter', renter);

app.use ('/cars' , cars);

module.exports = app;

