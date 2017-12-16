//Import sol compiler and file system handler
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var base = require('../model/callback');
const Account = require('../model/accounts');


//Added temprory for testing else global.web3 will be used
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//car
var contracts_input = fs.readFileSync('src/smartcontracts/CarSharingContract.sol');
var contracts_output = solc.compile(contracts_input.toString(), 1);

var car_bytecode = contracts_output.contracts[':CarDetails'].bytecode;
var car_abi = JSON.parse(contracts_output.contracts[':CarDetails'].interface);
var car_contract = web3.eth.contract(car_abi);


module.exports = {

	checkPositionInGeofenceGeohash : function(owner_address,car_address, callback){
					var car_details = car_contract.at(owner_address);
					console.log("car deails is:"+JSON.stringify(car_details));
					var car_info = car_details.checkPositionInGeofenceGeohash();
					console.log("geofence is :"+car_info);

			    }	 
}