const express = require('express');
const router = express.Router();
var renter = require('../controllers/renterController');


router.get('/getAllAvailableCars', function (request, response) {
	renter.getAllAvailableCars(function(result){
		response.json(result);
	});
});

router.get('/:address/getRentedCars', function (request, response) {
	renter.getRentedCars(request.params.address,function(result){
		response.json(result);
	});
});

router.post('/:address/createRenterContract', function (request, response) {
	renter.deployRenterContract(request.params.address, function (result) {
		response.json(result);	
	});
});

router.post('/:address/:ownercontractaddress/:car_contract_address/rentCar', function (request, response) {
	renter.rentCar(request.param.address,request.param.ownercontractaddress,request.param.car_contract_address,function(result){
		response.json(result);
	});
});

router.post('/:address/:ownercontractaddress/:car_contract_address/returnCar', function (request, response) {
	renter.returnCar(request.param.address,request.param.ownercontractaddress,request.param.car_contract_address,function(result){
		response.json(result);
	});
});




module.exports = router;