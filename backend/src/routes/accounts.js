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
	accounts.getAddresses(request, function (result) {
		response.json(result);	
	});
});

module.exports = router;