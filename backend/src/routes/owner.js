const express = require('express');
const router = express.Router();
var owner = require('../controllers/ownerController');



router.get('/:address', function (request, response) {
	owner.deployCarOwnerContract(request.params.address, function (result) {
		response.json(result);	
	});
});


router.get('/:address/:cargsm',function (request,response) {
	owner.createNewCar(request.params.address,request.params.cargsm, function (result) {
		response.json(result);	
	});
});


module.exports = router;