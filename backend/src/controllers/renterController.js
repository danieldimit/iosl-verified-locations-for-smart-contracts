//Import sol compiler and file system handler
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var base = require('../model/callback');
const Account = require('../model/accounts').Accounts;


//Added temprory for testing else global.web3 will be used
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//car
var contracts_input = fs.readFileSync('src/smartcontracts/CarSharingContract.sol');
var contracts_output = solc.compile(contracts_input.toString(), 1);

var car_bytecode = contracts_output.contracts[':CarDetails'].bytecode;
var car_abi = JSON.parse(contracts_output.contracts[':CarDetails'].interface);
var car_contract = web3.eth.contract(car_abi);

//renter
var renter_bytecode = contracts_output.contracts[':Owner'].bytecode;
var renter_abi = JSON.parse(contracts_output.contracts[':Owner'].interface);
var renter_contract = web3.eth.contract(renter_abi);



module.exports = {
    
    getAllAvailableCars: function(callback){
        Account.findAll().then(result=>{
            var availableCars = new Array();
            for (var i = 0; i < result.length; i++) {
                if(result[i].car_owner_address){
                        var car_owner = renter_contract.at(result[i].car_owner_address);
                        var available_car = car_owner.ListAvailableCars.call();
                        availableCars.push({ownerContract:result[i].car_owner_address,availableCarContract:available_car});
                }
            }
             base.successCallback(availableCars,callback);
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

    getOwnerContractAsRenter : function(accounts_address, callback){
            base.successCallback({Message : "Implementation is pending"},callback);
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

    returnCar : function (owner_address, ownercontractaddress ,car_contract_address, callback){
        //Implementation Pending as per ABI
        var owner = renter_contract.at(ownercontractaddress);
              var rent_car = owner.returnCar(car_contract_address,
                                { from: account_address, 
                                gas: 4700000},(err, result) => {
                                                            if(err){
                                                                base.errorCallback(err,callback);
                                                            }if(result){
                                                                base.successCallback(result,callback);
                                                            }
             });
    }
}