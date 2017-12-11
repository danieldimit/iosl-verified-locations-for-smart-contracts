const express = require('express');
const router = express.Router();
var owner = require('../controllers/oneContract/contractController');

router.post('/:address/create_contract', function (req, res) {
	owner.deployCarSharingContract(req.params.address, req.body.carGSMNumber, function (result) {
        res.json(result);
	});
});

// /:address/contract?ca=....
router.get('/contract', function (req, res) {
	console.log('query: ',req.query.ca);
    owner.getContract(req.query.ca, function (result) {
        res.json(result);
    });
});


router.get('/', function (req, res) {
    owner.createMappings();
});

module.exports = router;