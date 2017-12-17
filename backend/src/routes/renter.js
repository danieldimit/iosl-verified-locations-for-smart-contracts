const express = require('express');
const router = express.Router();
var renter = require('../controllers/renterController');


router.get('/getAllAvailableCars', function (request, response) {
	renter.getAllAvailableCars(function(result){
		response.json(result);
	});
});

module.exports = router;