'use strict';

const path = require('path');
const express = require('express');
const router = express.Router();
const clientAppApi = require('./api/clientApp');

router.get('/*', clientAppApi.reactRouterHandle);

module.exports = router;
