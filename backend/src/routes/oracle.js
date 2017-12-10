const express = require('express');
const router = express.Router();

var oracleAddress = null;

router.get('/', function (req, res) {
    res.json(oracleAddress);
});

router.put('/', function (req, res) {
    oracleAddress = req.body.oracleAddress;
});

module.exports = router;