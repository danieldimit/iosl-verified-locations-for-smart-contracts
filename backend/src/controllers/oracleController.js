var base = require('../model/callback');
// var oracleAddress = null;
const Account = require('../model/accounts').Accounts;
const Oracle = require('../model/accounts').Oracle;

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
var car_contract = web3.eth.contract(oracle_abi);

var owner_abi = JSON.parse(contracts_output.contracts[':Owner'].interface);
var owner_contract = web3.eth.contract(owner_abi);
var Web3Utils = require('web3-utils');

var oracleAddress = null;

function geofencePrefAndSufToGeofence(prefix, suffix) {
    var pref = web3.toDecimal(removeZeros(prefix));
    var suf = [];
    for (var i = 0; i < suffix.length; i++) {
        var tempSuf = web3.toDecimal(removeZeros(suffix[i]));
        suf.push(parseInt(String(pref).concat(String(tempSuf))));
    }
    return suf;
}

function removeZeros(hex) {
    var newHex = hex;
    while (newHex.substring(newHex.length - 1) == '0' && newHex[newHex.length - 2] != 'x') {
        newHex = newHex.substring(0, newHex.length - 1);
    }
    return newHex;
}

module.exports = {

    getOracleAddressLocal : function() {
        return oracleAddress;
    },

	getOracleAddress : function(callback){
		base.successCallback({oracleAddress : oracleAddress}, callback);
	} ,

	setOracleAddress : function(address, callback){
	    if (oracleAddress == null) {
            oracleAddress = address;
            base.successCallback({oracleAddress : oracleAddress}, callback);
        } else {
            base.errorCallback({Message: "There already is an oracle address set."}, callback);
        }
	} ,

	getRentedCarsContracts : function(callback){

        Account.findAll().then(result=>{
                var car_response = new Array();
                result.forEachDone(function(item){
                    if(item.car_owner_address) {
                        var car_owner = owner_contract.at(item.car_owner_address);
                        console.log(">?>>>>>>>>>>>>> BEFORE THE CALL ", item.car_owner_address);
                        var rentedCars = car_owner.getRentedCars.call();
                        var rentedCarsResult = new Array();
                        rentedCars.forEachDone(function(_car){
                            if (_car != "0x0000000000000000000000000000000000000000") {
                                console.log(_car);
                                var car_address = car_contract.at(_car);

                                car_address.GetCarDetails({from: item.car_owner_address, gas: 4700000},
                                    (err, result) => {if(result){
                                        var geofence = geofencePrefAndSufToGeofence(result[3], result[4]);
                                        console.log("POSITION: ", result[2], " ", removeZeros(result[2]));
                                        rentedCarsResult.push({carContractAddress:_car,
                                            carDetails:{penaltyValue:result[0],
                                                carGSMNum: result[1],
                                                position: web3.toDecimal(String(result[2]).substring(0, 18)),
                                                geofence: geofence
                                            }});
                                    }});
                            }
                        },function(){
                            setTimeout(function() {
                                car_response.push({
                                    ownerContract:item.car_owner_address,
                                    availableCarContract:rentedCarsResult});
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

	updatePosition : function(carContractAddress, geohashPosition, callback){
	    if (carContractAddress != undefined) {

            //Implementation Pending as per ABI
            console.log("updating position...");


            console.log("Contract: ", carContractAddress, " pos: ", geohashPosition);
            var selectedCar = car_contract.at(carContractAddress);
            var rent_car = selectedCar.updatePosition(geohashPosition,
                { from: oracleAddress,
                    gas: 4700000},(err, result) => {
                    if (err) {
                        base.errorCallback(err,callback);
                        console.log(err);
                    } if (result) {
                        console.log("succ: ", result);
                        base.successCallback(result, callback);
                    }
                });
        } else {
	        base.errorCallback({Message : "Car address is undefined. Cannot update position of undefined car!"}, callback)
        }
	}
}