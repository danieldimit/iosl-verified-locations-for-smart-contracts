const express = require('express');
const router = express.Router();
var oracle = require('../controllers/oracleController');


router.get('/', function (request, response) {
	oracle.getOracleAddress(function(result){
		response.json(result);
	});
});

router.put('/', function (request, response) {
    oracle.setOracleAddress(request.body.oracleAddress, function(result){
        response.json(result);
    });
});

router.get('/getRentedCarsContracts', function (request, response) {
	oracle.getRentedCarsContracts(function(result){
		response.json(result);
	});
});


router.put('/updatePosition', function (request, response) {
	oracle.updatePosition(request.query.carContractAddress, request.query.geohashPosition,function(result){
		response.json(result);
	});
});


module.exports = router;