//Import sol compiler and file system handler
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var base = require('../model/callback');


//Added temprory for testing else global.web3 will be used
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//car
var contracts_input = fs.readFileSync('src/smartcontracts/CarSharingContract.sol');
var contracts_output = solc.compile(contracts_input.toString(), 1);
var car_abi = JSON.parse(contracts_output.contracts[':carDetails'].interface);
var car_contract = web3.eth.contract(car_abi);

//Project Owner
var renter_bytecode = contracts_output.contracts[':SmartCarSharing'].bytecode;
var renter_abi = JSON.parse(contracts_output.contracts[':SmartCarSharing'].interface);
var renter_contract = global.web3.eth.contract(renter_abi);


module.exports = {

	deployRenterContract : function(address, callback){
	 var acccount_balance = web3.fromWei(web3.eth.getBalance(address), 'ether');
		var renter = renter.new(
                {
                    from: address,
                    data: renter_abi,
                    gas: '4700000'
                }, function (e, contract){
                if (typeof contract.address !== 'undefined') {
                    console.log('Contract mined! address: ' + contract.address +
                        ' transactionHash: ' + contract.transactionHash);
                    var res = {contractMinedAddress: contract.address , 
                    		   transactionHash : contract.transactionHash,
                               contract_balance : web3.fromWei(web3.eth.getBalance(contract.address), 'ether') + " ether",
                               created: true,
                               account_balance: acccount_balance + " ether"};
                     base.successCallback(res,callback);
                }
		});
	},

	rentCar : function (account_address, CGSMKey , callback){
		//Implementation Pending as per ABI		
	},

	returnCar : function (owner_address, car_address , callback){
		//Implementation Pending as per ABI
	}
}