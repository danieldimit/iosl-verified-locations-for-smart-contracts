const express = require('express');
const router = express.Router();


router.get('/:address', function (req, res) {
	console.log("eheregegreg");
    res.json("ger");
});

module.exports = router;