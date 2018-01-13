//Import sol compiler and file system handler
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var base = require('../model/callback');
const Account = require('../model/accounts').Accounts;
const Car = require('../model/accounts').Cars;
var config = require('../config');

//Added temprory for testing else global.web3 will be used
var web3 = new Web3(new Web3.providers.HttpProvider(config.testrpcAddress));
//car
var contracts_input = fs.readFileSync('src/smartcontracts/CarSharingContract.sol');
var contracts_output = solc.compile(contracts_input.toString(), 1);
var car_bytecode = contracts_output.contracts[':CarDetails'].bytecode;
var car_abi = JSON.parse(contracts_output.contracts[':CarDetails'].interface);
var car_contract = web3.eth.contract(car_abi);

//owner
var owner_bytecode = contracts_output.contracts[':Owner'].bytecode;
var owner_abi = JSON.parse(contracts_output.contracts[':Owner'].interface);
var owner_contract = web3.eth.contract(owner_abi);


module.exports = {

	deployCarOwnerContract : function(address, callback){
		const body = {
        'account_address': address
    	};

    	Account.findOne({ where: body }).then(data => {
    		console.log(JSON.stringify(data));
    		if(data){
		    		if(data.car_owner_address){
		    			var body = {
		    				Message : "You already have car owner contract", 
		    						  contract_address: data.car_owner_address };
		    			   base.successCallback(body,callback);
		    			}
		    		else{
					    	var acccount_balance = web3.fromWei(web3.eth.getBalance(address), 'ether');
							var owner = owner_contract.new(
					                {
					                    from: address,
					                    data: owner_bytecode,
					                    gas: '4700000'
					                }, function (e, contract){
					                if (typeof contract.address !== 'undefined') {
					                    console.log('Contract mined! address: ' + contract.address +
					                        ' transactionHash: ' + contract.transactionHash);
					                    data.updateAttributes({car_owner_address : contract.address});
					                    var res = {contractMinedAddress: contract.address , 
					                    		   transactionHash : contract.transactionHash,
					                               contract_balance : web3.fromWei(web3.eth.getBalance(contract.address), 'ether') + " ether",
					                               created: true,
					                               account_balance: acccount_balance + " ether"};
					                     base.successCallback(res,callback);
					                }
							});
					    }
			    }else{
			    	var body = { Message: "No account founc"};
			    	base.errorCallback(body,callback);
			    }	
		}); 
	},

	createNewCar : function (account_address, responsebody , callback){
		//Requested Body
			//{
			//   "carGSMNum": "string",
			//   "penaltyValue": 0,
			//   "geofencePrefix": "string",
			//   "geofenceSuffix": "string"
			// }	
		const body = {
        'account_address': account_address
    	};
    	console.log("account_address is :"+account_address);

    	console.log("cargms is :"+responsebody.carGSMNum);

    	Account.findOne({ where: body }).then(data => {
    		if(data.car_owner_address){
    			var car_owner = owner_contract.at(data.car_owner_address);
    			var addNewCar = car_owner.addNewCar(responsebody.carGSMNum,
    				responsebody.penaltyValue,
    				responsebody.position,
    				responsebody.geofencePrefix,
    				responsebody.geofenceSuffix,
                    {from: account_address, gas: 4700000},
                    (err, result) => {
                    	if(err){
                    		base.errorCallback(err,callback);
                    	}
                    	if(result){
                    		var res = { Message : "New car is added", car_address : result };
                    		Car.create({ account_address:account_address ,car_address:result}).then(result => {
                    			base.successCallback(res,callback);
                    		});
                    	}
                    });
    		}else{
    			var res = { Message : "Create a car owner contract first"};
    			base.errorCallback(res,callback);
    		}
    	});
	},

	getAllCarDetails : function (account_address , callback){
		const body = {
        'account_address': account_address
    	};
    	Account.findOne({ where: body }).then(data => {
    		if(data.car_owner_address){
    			var car_owner = owner_contract.at(data.car_owner_address);
    			var car_list = car_owner.showCars(
	    			{from: account_address, gas: 4700000},
	                    (err, result) => {
	                    	if(err){
	                    		base.errorCallback(err,callback);
	                    	}if(result){
	                    		base.successCallback(result,callback);
	                    	}
	                    });
    		}else{
    			var res = { Message : "Create a car owner contract first"};
    			base.errorCallback(res,callback);
    		}
    	});
	},

	deleteCar : function (account_address, car_address , callback){
		const body = {
        'account_address': account_address
    	};
    	Account.findOne({ where: body }).then(data => {
    		if(data.car_owner_address){
    			var car_owner = owner_contract.at(data.car_owner_address);
    			var car_list = car_owner.deleteCar(car_address,
	    			{from: account_address, gas: 4700000},
	                    (err, result) => {
	                    	if(err){
	                    		base.errorCallback(err,callback);
	                    	}if(result){
	                    		base.successCallback(result,callback);
	                    	}
	                    });
    		}else{
    			var res = { Message : "Create a car owner contract first"};
    			base.successCallback(res,callback);
    		}
    	});
	},

	showBalance : function (account_address , callback){
				const body = {
		        'account_address': account_address
		    	};
		    	Account.findOne({ where: body }).then(data => {
		    		if(data.car_owner_address){
		    			var car_owner = owner_contract.at(data.car_owner_address);
		    			var car_list = car_owner.showBalance(
			    			{from: account_address, gas: 4700000},
			                    (err, result) => {
			                    	if(err){
			                    		base.errorCallback(err,callback);
			                    	}if(result){
			                    		base.successCallback(result,callback);
			                    	}
			                    });
		    		}else{
		    			var res = { Message : "Create a car owner contract first"};
		    			base.successCallback(res,callback);
		    		}
		    	});
	},

	showRenters : function (account_address , callback){
				const body = {
		        'account_address': account_address
		    	};
		    	Account.findOne({ where: body }).then(data => {
		    		if(data.car_owner_address){
		    			var car_owner = owner_contract.at(data.car_owner_address);
		    			var car_list = car_owner.showRenters(
			    			{from: account_address, gas: 4700000},
			                    (err, result) => {
			                    	if(err){
			                    		base.errorCallback(err,callback);
			                    	}if(result){
			                    		base.successCallback(result,callback);
			                    	}
			                    });
		    		}else{
		    			var res = { Message : "Create a car owner contract first"};
		    			base.successCallback(res,callback);
		    		}
		    	});
	},

	withdrawMoney: function (owner_address , callback){
		base.successCallback({Message : "Implementation is pending"},callback);
	},

	iscarLeftGeofence: function(owner_address ,car_address , callback){
		//Implementation Pending as per ABI
	},

	getPosition : function (owner_address , car_address , callback){
		//Implementation Pending as per ABI
	}

}