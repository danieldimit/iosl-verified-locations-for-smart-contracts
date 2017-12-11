//Import sol compiler and file system handler
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var base = require('../../model/callback');


//Added temprory for testing else global.web3 will be used
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//car
var contracts_input = fs.readFileSync('src/smartcontracts/CarSharing1Contract.sol');
var contracts_output = solc.compile(contracts_input.toString(), 1);
var car_abi = JSON.parse(contracts_output.contracts[':carDetails'].interface);
var car_contract = web3.eth.contract(car_abi);

// //owner
var owner_bytecode = contracts_output.contracts[':carOwner'].bytecode;
var owner_abi = JSON.parse(contracts_output.contracts[':carOwner'].interface);
var owner_contract = web3.eth.contract(owner_abi);


module.exports = {

	deployCarOwnerContract : function(address, callback){
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
                    var res = {contractMinedAddress: contract.address , 
                    		   transactionHash : contract.transactionHash,
                               contract_balance : web3.fromWei(web3.eth.getBalance(contract.address), 'ether') + " ether",
                               created: true,
                               account_balance: acccount_balance + " ether"};
                     base.successCallback(res,callback);
                }
		});
	},

	createNewCar : function (account_address, CGSMKey , callback){
		var owner = owner_contract.at(account_address);
		owner.addNewCar(CGSMKey,
			{from: account_address,
            gas: '4700000'},(err,result) =>{
            	if(result){
            		console.log("hrere");
            		base.successCallback(result,callback);
            	}else {
            			            		console.log("hreredsadsadsad");

            		base.successCallback(err,callback);
            	}
            }
		);
	},

	deleteCar : function (owner_address, car_address , callback){

		//Implementation Pending as per ABI
	},

	withdrawPenalties: function (owner_address , callback){
		//Implementation Pending as per ABI
	},

	iscarLeftGeofence: function(owner_address ,car_address , callback){
		//Implementation Pending as per ABI
	},

	getAllCarDetails : function (owner_address , callback){
		//Implementation Pending as per ABI
	} ,

	getPosition : function (owner_address , car_address , callback){
		//Implementation Pending as per ABI
	}

}