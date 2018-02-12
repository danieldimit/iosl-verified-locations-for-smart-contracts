const express = require('express');
const router = express.Router();
var accounts = require('../controllers/accountController');
// Routes

//Show All the Accounts

router.get('/', function (request, response) {
	accounts.getAllAccounts(request, function (result) {
		response.json(result);	
	});
});


router.get('/:address', function (request, response) {
	accounts.getAddress(request.params.address, function (result) {
		response.json(result);	
	});
});
router.get('/encrypt/:key', function (request, response) {
	accounts.encrypt(request.params.key, function (result) {
		response.json(result);	
	});
});

router.get('/decrypt/:key', function (request, response) {
	accounts.decrypt(request.params.key, function (result) {
		response.json(result);	
	});
});

router.post('/setPorviders', function (request, response) {
	// accounts.decrypt("f16353c4d3909a289689d18bfff98991:0a8f9315b3dad2b6d072a216b0388900", function (result) {
	// 		console.log(JSON.stringify(result));
	// });

		// console.log("request.params.praam :"+JSON.stringify(request.params));
			console.log("request.params.body :"+JSON.stringify(request.body));

		// console.log("request.params.provider :"+JSON.stringify(request.body.web3));
	// accounts.setProvider(request,request.params.provider, function (result) {
	// 	response.json(result);	
	// });
});

module.exports = router;