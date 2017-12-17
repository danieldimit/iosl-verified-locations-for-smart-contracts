const express = require('express');
const router = express.Router();
const Account = require('../model/accounts');
var base = require('../model/callback');

module.exports = {

	getAllAccounts : function (req, callback){

		if(global.web3.isConnected()){
			  var json = JSON.stringify(global.web3.eth.accounts);
  			base.successCallback(global.web3.eth.accounts,callback);
		}else{
			var error = {Error: "Testrpc not connceted"}
			base.errorCallback(error , callback);
		}

	},

	getAddresses : function (req , callback){

	var address = req.params.address;
    const body = {
        'account_address': address
    };
    
    return Account.findOne({ where: body }).then(data => {
            if(!data) {
        return Account.create(body)
                .then(newAccount => {
                console.log(`New account for address ${address} has been created.`);
       	return base.successCallback(newAccount,callback);
    });
    } else {
        console.log('Account with ' + address + ' is found.');
        return base.successCallback(data,callback);
    }
});
	} 
}