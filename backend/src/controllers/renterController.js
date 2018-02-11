//Import sol compiler and file system handler
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var base = require('../model/callback');
const Account = require('../model/accounts').Accounts;
var config = require('../config');
var Web3Utils = require('web3-utils');


//Added temprory for testing else global.web3 will be used
var web3 = new Web3(new Web3.providers.HttpProvider(config.testrpcAddress));
//car
var contracts_input = fs.readFileSync('src/smartcontracts/CarSharingContract.sol');
var contracts_output = solc.compile(contracts_input.toString(), 1);

var car_bytecode = contracts_output.contracts[':CarDetails'].bytecode;
var car_abi = JSON.parse(contracts_output.contracts[':CarDetails'].interface);
var car_contract = web3.eth.contract(car_abi);
const Car = require('../model/accounts').Cars;
//renter
var renter_bytecode = contracts_output.contracts[':Owner'].bytecode;
var renter_abi = JSON.parse(contracts_output.contracts[':Owner'].interface);
var renter_contract = web3.eth.contract(renter_abi);

//Object forEachDone
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

Object.defineProperty(Array.prototype, "forEachDone", {
    enumerable: false,
    value: function(task, cb){
        var counter = 0;
        this.forEach(function(item, index, array){
            task(item, index, array);
            if(array.length === ++counter){
                if(cb) cb();
            }
        });
    }
});


//Array forEachDone

Object.defineProperty(Object.prototype, "forEachDone", {
    enumerable: false,
    value: function(task, cb){
        var obj = this;
        var counter = 0;
        Object.keys(obj).forEach(function(key, index, array){
            task(obj[key], key, obj);
            if(array.length === ++counter){
                if(cb) cb();
            }
        });
    }
});


module.exports = {

    getAllAvailableCars: function(callback){
        // {
        //     ownerContract   string
        //                 availableCarContract    [{
        //                 carContractAddress  string
        //                 carDetails  CarContractConstructor{
        //                 carGSMNum   string
        //                 penaltyValue    integer($int32)
        //                 position    string
        //                 geofence    [string]
        //                 }
        //                 }]
        // }
        Account.findAll().then(result=>{
            var car_response = new Array();
            result.forEachDone(function(item){
                if(item.car_owner_address){
                     var car_owner = renter_contract.at(item.car_owner_address);
                    console.log(">?>>>>>>>>>>>>> BEFORE THE CALL ", item.car_owner_address);
                        var available_car = car_owner.ListAvailableCars.call();
                        var available_car_result = new Array();
                        available_car.forEachDone(function(_car){
                            console.log(_car);
                            var car_address = car_contract.at(_car);

                            car_address.GetCarDetails({from: item.car_owner_address, gas: 4700000},
                                                    (err, result) => {if(result){
                                                        var geofence = geofencePrefAndSufToGeofence(result[3], result[4]);
                                                        console.log("POSITION: ", result[2], " ", removeZeros(result[2]));
                                                        available_car_result.push({carContractAddress:_car,
                                                            carDetails:{penaltyValue:result[0],
                                                                        carGSMNum: result[1],
                                                                        position: web3.toDecimal(removeZeros(result[2])),
                                                                        geofence: geofence
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
    },

    deployRenterContract : function (account_address, callback){

        const body = {
        'account_address': account_address
        };

        Account.findOne({ where: body }).then(data => {
            console.log(JSON.stringify(data));
            if(data){
                    if(data.renter_address){
                        var body = {
                            Message : "You already have car renter contract", 
                                      contract_address: data.renter_address };
                           base.successCallback(body,callback);
                        }
                    else{
                            var acccount_balance = web3.fromWei(web3.eth.getBalance(account_address), 'ether');
                            var renter = renter_contract.new(
                                    {
                                        from: account_address,
                                        data: renter_bytecode,
                                        gas: '4700000'
                                    }, function (e, contract){
                                    if (typeof contract.address !== 'undefined') {
                                        console.log('Contract mined! address: ' + contract.address +
                                            ' transactionHash: ' + contract.transactionHash);
                                        data.updateAttributes({renter_address : contract.address});
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

    getRentedCars : function(accounts_address, callback){

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
                                                    position: web3.toDecimal(removeZeros(result[2])),
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


                const body = {
                             'account_address': accounts_address
                             };
    },

    rentCar : function (account_address, ownercontractaddress ,car_contract_address, callback){
        //Implementation Pending as per ABI 
      
              var owner = renter_contract.at(ownercontractaddress);
              var rent_car = owner.rentCar.sendTransaction(car_contract_address,
                                { from: account_address, 
                                gas: 4700000,
                                  value: web3.toWei(10,'ether')},(err, result) => {
                                                            if(err){
                                                                base.errorCallback(err,callback);
                                                            }if(result){
                                                                base.successCallback(result,callback);
                                                            }
             });
                
    },

    returnCar : function (renter_address, ownercontractaddress ,car_contract_address, callback){
        //Implementation Pending as per ABI
        var owner = renter_contract.at(ownercontractaddress);
              var rent_car = owner.returnCar(car_contract_address,
                                { from: renter_address,
                                gas: 4700000},(err, result) => {
                                                            if(err){
                                                                base.errorCallback(err,callback);
                                                            }if(result){
                                                                base.successCallback(result,callback);
                                                            }
             });
    }
}