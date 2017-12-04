'use strict';

//load modules
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const basicAuth = require('basic-auth');
const handlebars = require('express-handlebars');
const express = require('express');
const app = express();
const routes = require('./routes/index.js');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const compression = require('compression');

//load env vars if .env exists
if(fs.existsSync(path.join(__dirname, '../../.env'))){
    dotenv.load();
}

//port and views depending on Node Env
let port;
if (process.env.NODE_ENV === 'production') {
    app.set('views', path.join(__dirname, '../../public/build/'));
    port = process.env.PORT || 3000;
} else {
    app.set('views', path.join(__dirname, './views'));
    port = process.env.DEV_PORT || 3000;
}

if (process.env.BASIC_AUTH && process.env.BASIC_AUTH === 'true') {
    //basic auth
    app.use(function(req, res, next) {
        function unauthorized(res) {
            res.set(
                'WWW-Authenticate',
                'Basic realm=Authorization Required'
            );
            return res.send(401);
        }

        let user = basicAuth(req);

        if (!user || !user.name || !user.pass) {
            return unauthorized(res);
        }

        if (
            user.name === process.env.BASIC_AUTH_NAME &&
            user.pass === process.env.BASIC_AUTH_PASSWORD
        ) {
            return next();
        } else {
            return unauthorized(res);
        }
    });
}

//handlebars config
const hbs = handlebars.create({
    extname: '.hbs'
});

//use handlebars with config above
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

//public files
app.use(express.static(path.join(__dirname, '../../public')));

//webpack dev server and hot middleware
if (process.env.NODE_ENV !== 'production') {
    let config = require('../../webpack.dev.config');
    let compiler = webpack(config);

    app.use(
        webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath,
            stats: { color: true }
        })
    );

    app.use(
        webpackHotMiddleware(compiler, {
            log: console.log
        })
    );
}

//middleware
app.use(compression());

//routes
app.use(routes);

//listen
app.listen(port, function() {
    console.log('Server is listening on port ' + port + '!');
});
