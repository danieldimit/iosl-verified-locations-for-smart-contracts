var base = require('../model/callback');
// var oracleAddress = null;
const Account = require('../model/accounts').Accounts;
//Added temprory for testing else global.web3 will be used
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var config = require('../config');
var web3 = new Web3(new Web3.providers.HttpProvider(config.testrpcAddress));
//car
var contracts_input = fs.readFileSync('src/smartcontracts/CarSharingContract.sol');
var contracts_output = solc.compile(contracts_input.toString(), 1);
var oracle_bytecode = contracts_output.contracts[':CarDetails'].bytecode;
var oracle_abi = JSON.parse(contracts_output.contracts[':CarDetails'].interface);
var oracle_contract = web3.eth.contract(oracle_abi);
var oracleAddress = null;
var owner_abi = JSON.parse(contracts_output.contracts[':Owner'].interface);
var owner_contract = web3.eth.contract(owner_abi);
var Web3Utils = require('web3-utils');

module.exports = {

	getOracleAddress : function(callback){
		base.successCallback({oracleAddress : oracleAddress}, callback);		
        // Account.findAll().then(data => {
        //             	base.successCallback(data,callback);
        // });
	} ,

	setOracleAddress : function(address, callback){
		oracleAddress = address;
		base.successCallback({oracleAddress : oracleAddress}, callback);
		// const body = {
  //       	'account_address': address
  //   	};

  //   	Account.findOne({ where: body }).then(data => {
  //   		console.log("data"+JSON.stringify(data));
		//     if(data.oracle_address){
		//     			var body = {
		//     				Message : "You already have Oracle owner contract", 
		//     						  contract_address: data.oracle_address };
		//     			   base.successCallback(body,callback);
		//     			}
		//     		else{
		// 			    	var contract_balance = web3.fromWei(web3.eth.getBalance(address), 'ether');
		// 					var oracle = oracle_contract.new(
		// 			                {
		// 			                    from: address,
		// 			                    data: oracle_bytecode,
		// 			                    gas: '4700000'
		// 			                }, function (e, contract){
		// 			                if (typeof contract.address !== 'undefined') {
		// 			                    console.log('Contract mined! address: ' + contract.address +
		// 			                        ' transactionHash: ' + contract.transactionHash);
		// 			                    data.updateAttributes({oracle_address : contract.address});
		// 			                  	  var oracle_set = oracle_contract.at(contract.address);
		// 					    		  oracle_set.setOracleAddress(contract.address,
		// 						    			{from: address, gas: 4700000},
		// 						                    (err, result) => {
		// 						                    	if(err){
		// 						                    		base.errorCallback(err,callback);
		// 						                    	}if(result){
		// 						                    		// base.successCallback(result,callback);
		// 						                    		var res = {contractMinedAddress: contract.address , 
		// 								                    		   transactionHash : contract.transactionHash,
		// 								                               contract_balance : web3.fromWei(web3.eth.getBalance(contract.address), 'ether') + " ether",
		// 								                               created: true,
		// 								                               account_balance: acccount_balance + " ether"};
		// 			                    			 				   base.successCallback(res,callback);
		// 						                    	}
		// 						                    });
		// 			                }
		// 					});
		// 			}
		// }); 
	} ,

	getRentedCarsContracts : function(callback){

        Account.findAll().then(result=>{
                var car_response = new Array();
                result.forEachDone(function(item){
                    if(item.car_owner_address){
                        var car_owner = renter_contract.at(item.car_owner_address);
                        var rented_car = car_owner.alreadyRentedCarByUser(accounts_address, {from: item.car_owner_address, gas: 4700000},
                            (err, carResult) => {if(carResult){
                                var rented_car_result = new Array();
                                console.log("POSITION: ", web3.toDecimal(carResult));
                                if (web3.toDecimal(carResult) != 0) {
                                    var car_address = car_contract.at(carResult);

                                    car_address.GetCarDetails({from: item.car_owner_address, gas: 4700000},
                                        (err, result) => {if(result){
                                            var geofence = geofencePrefAndSufToGeofence(result[3], result[4]);
                                            console.log("POSITION: ", result[2], " ", removeZeros(result[2]));
                                            rented_car_result.push({
                                                carContractAddress: carResult,
                                                carDetails:
                                                    {penaltyValue: result[0],
                                                        carGSMNum: result[1],
                                                        position: web3.toDecimal(String(result[2]).substring(0, 18)),
                                                        geofence: geofence
                                                    }});
                                            car_response.push({ownerContract:item.car_owner_address,availableCarContract:rented_car_result});
                                        }});
                                }

                            }});
                    }
                }, function(){
                    setTimeout(function() {
                        console.log('done');
                        base.successCallback(car_response,callback);
                    }, 1000);
                });
            },
            error=>{
                base.errorCallback(error,callback);
            });

		 Account.findAll().then(result=>{
            var car_response = new Array();
            result.forEachDone(function(item){
                if(item.car_owner_address){
                     var car_owner = owner_contract.at(item.car_owner_address);
                        var available_car = car_owner.alreadyRentedCars.call();
                        var available_car_result = new Array();
                        available_car.forEachDone(function(car_){
                             car_owner.GetCarDetails(car_, {from: item.account_address, gas: 4700000},
                                                    (err, result) => {if(result){
                                                                            available_car_result.push({carContractAddress:car_,
                                                                                carDetails:{penaltyValue:result[0],
                                                                                            carGSMNum:Web3Utils.hexToUtf8(result[1]),
                                                                                            position:Web3Utils.hexToUtf8(result[2]),
                                                                                            geofence:result[3]
                                                                                            }});
                                                                    }});
                        },function(){
                            setTimeout(function() {
                              car_response.push({ownerContract:item.car_owner_address,availableCarContract:available_car_result});
                            }, 1000);
                        });
                }
            }, function(){
                setTimeout(function() {
                        console.log('done');
                         base.successCallback(car_response,callback);
                }, 1000);
            });
        },
            error=>{
                base.errorCallback(error,callback);
        });
	} ,

	updatePosition : function(car_contract_address , geohash_position ,callback){
		base.successCallback({Message : "Implementation is pending"},callback);
	}

}