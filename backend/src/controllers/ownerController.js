//Import sol compiler and file system handler
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var base = require('../model/callback');
const Account = require('../model/accounts').Accounts;
const Car = require('../model/accounts').Cars;
var config = require('../config');
var oracleController = require("./oracleController");

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

splitGeofenceInPrefixAndSuffix = (arrOfGeohashes) => {
	var commonPrefix;
	var arraySuffixes = [];
	var stillSame = true;
	var shortestGeohash = 999999;
	var currentSymbolNum = 0;

	// See how long the shortest geohash is and convert it to integer
    for (var j = 0; j < arrOfGeohashes.length; j++) {
    	arrOfGeohashes[j] = parseInt(arrOfGeohashes[j]);
		var temp = String(arrOfGeohashes[j]).length;

		if (temp < shortestGeohash) {
			shortestGeohash = temp;
		}
    }

    // Extract the common prefix
	while (stillSame && currentSymbolNum < shortestGeohash) {
    	var curSymbol = String(arrOfGeohashes[0])[currentSymbolNum];
        for (var i = 1; i < arrOfGeohashes.length; i++) {
            if (curSymbol != String(arrOfGeohashes[i])[currentSymbolNum]) {
                stillSame = false;
			}
        }

        // If the symbols are still the same go check the next one, otherwise stop here
        if (stillSame == true) {
            currentSymbolNum++;
		}
	}

	// Split into prefix and suffixes
	if (currentSymbolNum != -1) {
        commonPrefix = parseInt(String(arrOfGeohashes[0]).substring(0, currentSymbolNum));
	}
    for (var i = 0; i < arrOfGeohashes.length; i++) {
        arraySuffixes.push(parseInt(String(arrOfGeohashes[i]).substring(currentSymbolNum, String(arrOfGeohashes[i]).length)));
    }

	return {
        geofencePrefix: commonPrefix,
        geofenceSuffix: arraySuffixes
	}
}

module.exports = {

    getOwnerContract : function(address, callback){
        const body = {
            'account_address': address
        };

        Account.findOne({ where: body }).then(data => {
            console.log(JSON.stringify(data));
            if(data){
                if(data.car_owner_address){
                    var body = {
                        contractMinedAddress: data.car_owner_address };
                    	base.successCallback(body,callback);
                }else{
                    var body = { Message: "There isn't an owner account for this address yet." };
                    base.errorCallback(body,callback);
                }
            }else{
                var body = { owerContractAddress: null };
                base.errorCallback(body,callback);
            }
        });
    },

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
			    	var body = { Message: "No account found"};
			    	base.errorCallback(body,callback);
			    }	
		}); 
	},

	getAllCarDetails : function (account_address , callback){
		const body = {
        'account_address': account_address
    	};
    	Account.findOne({ where: body }).then(data => {
    		if (data) {
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
			}
    	});
	},

    createNewCar : function (account_address, responsebody , callback){
        const body = {
            'account_address': account_address
        };
        console.log("account_address is :"+account_address);

        console.log("position is :"+responsebody.position);

        Account.findOne({ where: body }).then(data => {
            if(data.car_owner_address){
                var car_owner = owner_contract.at(data.car_owner_address);
                //TODO: need to change the string value to hash value

                var geoSplit = splitGeofenceInPrefixAndSuffix(responsebody.geofence);
				console.log("Predi: ",geoSplit.geofencePrefix);
				console.log("Sled ",geoSplit.geofenceSuffix );

                var addNewCar = car_owner.addNewCar(responsebody.carGSMNum,
                    global.web3.toWei(responsebody.penaltyValue, 'ether'),
                    parseInt(responsebody.position),
                    geoSplit.geofencePrefix,
                    geoSplit.geofenceSuffix,
                    oracleController.getOracleAddressLocal(),
                    {from: account_address, gas: 4700000},
                    (err, result) => {
                        if(err){
                            base.errorCallback(err,callback);
                        }
                        if(result){
                            console.log("result: ", result);
                            var res = { Message : "New car is added", carAddress : result };
                            Car.create({ account_address: account_address,
                                car_address: result,
                                carGSMNum: responsebody.carGSMNum ,
                                penaltyValue: responsebody.penaltyValue,
                                position: responsebody.position,
                                geofence: JSON.stringify(responsebody.geofence)}).then(result => {
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

	deleteCar : function (account_address, car_address , callback){
		const body = {
        'account_address': account_address
    	};
    	Account.findOne({ where: body }).then(data => {
    		
    		console.log("Car Details :"+JSON.stringify(data));

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

    showEarnings : function (account_address , callback){
        const body = {
            'account_address': account_address
        };
        Account.findOne({ where: body }).then(data => {
            if(data.car_owner_address){
                var car_owner = owner_contract.at(data.car_owner_address);
                var car_list = car_owner.showEarnings(
                    {from: account_address, gas: 4700000},
                    (err, result) => {
                        if(err){
                            base.errorCallback(err,callback);
                        }if(result){
                            base.successCallback(global.web3.fromWei(result, 'ether'), callback);
                        }
                    });
            }else{
                var res = { Message : "Create a car owner contract first"};
                base.successCallback(res,callback);
            }
        });
    },

    showFundsLockedInContract : function (account_address , callback){
        const body = {
            'account_address': account_address
        };
        Account.findOne({ where: body }).then(data => {
            if(data.car_owner_address){
                var car_owner = owner_contract.at(data.car_owner_address);
                var car_list = car_owner.showFundsLockedInContract(
                    {from: account_address, gas: 4700000},
                    (err, result) => {
                        if(err){
                            base.errorCallback(err,callback);
                        }if(result){
                            base.successCallback(global.web3.fromWei(result, 'ether'), callback);
                        }
                    });
            }else{
                var res = { Message : "Create a car owner contract first"};
                base.successCallback(res,callback);
            }
        });
    },

	showRentedCarsInfo : function (account_address , callback){
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

	withdrawMoney: function (ownerAddress , callback){
        const body = {
            'account_address': ownerAddress
        };
        Account.findOne({ where: body }).then(data => {
            if(data.car_owner_address){
                var car_owner = owner_contract.at(data.car_owner_address);
                var car_list = car_owner.withdrawEarnings(
                    {from: ownerAddress, gas: 4700000},
                    (err, result) => {
                        if(err){
                            base.errorCallback(err,callback);
                        }if(result){
                            base.successCallback({Message: "Successfully withdrew all funds."}, callback);
                        }
                    });
            }else{
                var res = { Message : "Create a car owner contract first"};
                base.successCallback(res,callback);
            }
        });
	},

	iscarLeftGeofence: function(owner_address ,car_address , callback){
		//Implementation Pending as per ABI
	},

	getPosition : function (owner_address , car_address , callback){
		//Implementation Pending as per ABI
	}

}