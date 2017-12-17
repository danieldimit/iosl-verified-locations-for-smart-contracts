const express = require('express');
const router = express.Router();
const Account = require('../model/accounts').Accounts;
const Car = require('../model/accounts').Cars;
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
    
    Account.findOne({ where: body }).then(data => {
            if(data) {
                Car.findAll({ where: body }).then(cars =>{
                        if(cars){
                            console.log("Cars found "+JSON.stringify(cars));
                            var AllCars = new Array();
                            for (var i = 0, len = cars.length; i < len; i++) {
                                if(cars[i].car_address){
                                   AllCars.push(cars[i].car_address);                                    
                                }
                            }
                                return base.successCallback({data,AllCars},callback);
                        }else{
                                 console.log("Cars not found "+JSON.stringify(cars));
                                return base.successCallback({data,cars : "No Car Found"},callback);                            
                        }
                });
            } else {
                console.log('Account with ' + address + ' is not found.');
                return base.errorCallback({message: "Invalid Account Address"},callback);
            }
});
	} 
}