var express = require('express');
var app = express();

const accounts = require('./accounts');
<<<<<<< HEAD
// const owner = require('./owner');
// var renter = require('./renter');
// var oracle = require('./oracle');
// var location = require('./location');
=======
const owner = require('./owner');
var renter = require('./renter');
var oracle = require('./oracle');
var location = require('./location');
>>>>>>> c5a1e7146780f70362755e4d5fb85eb109629ca6

//Routes
app.use('/account', accounts);

// app.use('/owner', owner);

// app.use('/renter', renter);

// app.use ('/oracle' , oracle);

// app.use ('/location' , location);

app.use ('/location' , location);

module.exports = app;

