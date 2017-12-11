const express = require('express');
const router = express.Router();

const getAllAccounts = (req, res, next) => {
    // show all accounts
	res.json(global.web3.eth.accounts);
};

// Routes

//Show All the Accounts
router.get('/', getAllAccounts);

module.exports = router;