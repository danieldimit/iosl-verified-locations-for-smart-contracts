const express = require('express');
const router = express.Router();
const Account = require('../model/accounts').Accounts;
var base = require('../model/callback');
var owner = require('./ownerController');

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
    
    Account.findOne({ where: body }).then(data => {
            if(data) {
                owner.getAllCarDetails(address , function(result){
                 return base.successCallback({data , result},callback);
                });
            } else {
                return base.errorCallback({message: "Invalid Account Address"},callback);
            }
});
	} 
}