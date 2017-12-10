var express = require('express');
var app = express();

const accounts = require('./accounts');
const owner = require('./owner');
const oracle = require('./oracle');
var renter = require('./renter');

//Routes
app.use('/account', accounts);

app.use('/owner', owner);

app.use('/oracle', oracle);

app.use('/renter', renter);


module.exports = app;

