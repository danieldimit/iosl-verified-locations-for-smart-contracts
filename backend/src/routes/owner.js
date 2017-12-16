const express = require('express');
const router = express.Router();
var owner = require('../controllers/ownerController');



router.get('/:address', function (request, response) {
	owner.deployCarOwnerContract(request.params.address, function (result) {
		response.json(result);	
	});
});


router.post('/:address',function (request,response) {
//Body to be sent
//{cargsm : cargmid}	
	owner.createNewCar(request.params.address,request.body.cargsm, function (result) {
		response.json(result);	
	});
});

router.delete('/:address',function (request,response) {	
	//body to be sent
	//{caraddress : caraddress}
	owner.deleteCar(request.params.address,request.body.caraddress, function (result) {
		response.json(result);	
	});
});

router.get('/getcars/:address', function (request, response){
	owner.getAllCarDetails(request.params.address,function (result){
		response.json(result);
	});
}); 

module.exports = router;