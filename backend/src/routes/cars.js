const express = require('express');
const router = express.Router();
var car = require('../controllers/carController');


router.get('/:address/:caraddress', function (request, response) {
	car.checkPositionInGeofenceGeohash(request.params.address,request.params.caraddress, function (result) {
		response.json(result);	
	});
});


module.exports = router;