var express = require('express');
var router = express.Router();
var s2 = require('../controllers/s2Controller');

router.get('/getNearestCellPositionInLatLonAndS2Cell', function (request, response) {
	s2.getNearestCellPositionInLatLonAndS2Cell(request,function (response) {
		response.json(response);	
	});
});

router.get('/convertS2ToBoundingLatLonPolygon', function (request, response) {
	location.convertS2ToBoundingLatLonPolygon(request, function (location) {
		response.json(location);
	});
});

router.get('/convertGeofenceToS2Polygons', function (request, response) {
	location.convertGeofenceToS2Polygons(request, function (location) {
		response.json(location);
	});
});


module.exports = router;