var express = require('express');
var router = express.Router();
var location = require('../controllers/locationController');

router.get('/', function (request, response) {
	location.geAllLocation(function (location) {
		response.json(location);	
	});
});

router.get('/:id', function (request, response) {
	location.getLocationId(request.params.id, function (location) {
		response.json(location);
	});
});

router.post('/', function (request, response) {
	location.save(request.body, function (result) {
		response.json(result);
	});
});

router.put('/', function (request, response) {
	location.update(request.body.id, request.body, function (result) {
		response.json(result);
	});
});

router.delete('/', function (request, response) {
	location.delete(request.body.id, function (result) {
		response.json(result);
	});
});


module.exports = router;