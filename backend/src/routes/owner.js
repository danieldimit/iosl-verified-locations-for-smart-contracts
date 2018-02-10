const express = require('express');
const router = express.Router();
var owner = require('../controllers/ownerController');



router.post('/:address/createOwnerContract', function (request, response) {
	owner.deployCarOwnerContract(request.params.address, function (result) {
		response.json(result);	
	});
});

router.get('/:address', function (request, response){
    owner.getOwnerContract(request.params.address,function (result){
        response.json(result);
    });
});


router.post('/:address/createCarContract',function (request,response) {
//Body to be sent
// {
//   "carGSMNum": "string",
//   "penaltyValue": 0,
//   "position": "string",
//   "geofence": [
//     "string"
//   ]
// }	
	owner.createNewCar(request.params.address, request.body, function (result) {
		response.json(result);	
	});
});

router.get('/:address/getCarContracts', function (request, response){
	owner.getAllCarDetails(request.params.address,function (result){
		response.json(result);
	});
});


router.get('/:address/showBalance', function (request, response){
	owner.showBalance(request.params.address,function (result){
		response.json(result);
	});
}); 


router.get('/:address/showRentedCarsInfo', function (request, response){
	owner.showRentedCarsInfo(request.params.address,function (result){
		response.json(result);
	});
}); 

router.post('/:address/withdrawMoney' , function(request , response){
	owner.withdrawMoney(request.params.address , function (result){
		response.json(result);
	});
});

router.delete('/:address/:caraddress',function (request,response) {	
	owner.deleteCar(request.params.address,request.params.caraddress, function (result) {
		response.json(result);	
	});
}); 

module.exports = router;