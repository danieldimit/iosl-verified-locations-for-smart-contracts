const express = require('express');
const router = express.Router();
var oracle = require('../controllers/oracleController');


router.get('/', function (request, response) {
	oracle.getOracleAddress(function(result){
		response.json(result);
	});
});

router.get('/getRentedCarsContracts', function (request, response) {
	oracle.getRentedCarsContracts(request.param.address,function(result){
		response.json(result);
	});
});


router.put('/updatePosition', function (request, response) {
	oracle.updatePosition(request.query.car_contract_address.request.query.geohash_position,function(result){
		response.json(result);
	});
});


module.exports = router;