//Import sol compiler and file system handler
const solc = require('solc');
const fs = require('fs');
const Web3 = require('web3');
var config = require('../../config');
var base = require('../../model/callback');

//Added temprory for testing else global.web3 will be used
var web3 = new Web3(new Web3.providers.HttpProvider(config.testrpcAddress));
//car
var contract_input = fs.readFileSync('./src/smartcontracts/CarSharing1Contract.sol');
var contract_output = solc.compile(contract_input.toString(), 1);

var carContract_bytecode = contract_output.contracts[':CarSharingContract'].bytecode;
var carContract_abi = JSON.parse(contract_output.contracts[':CarSharingContract'].interface);
var carContract = web3.eth.contract(carContract_abi);


//// Create a one to one mapping from address to contract address
var mapAccToContract = {};

module.exports = {

    deployCarSharingContract: function (address, carGSMNumber, callback) {

        // This creates the mapping between addresess and contract addresses if they are not already created
        if (Object.keys(mapAccToContract).length === 0) {
            var accounts = global.web3.eth.accounts;
            for (var i = 0; i < accounts.length; i++) {
                mapAccToContract[accounts[i]] = null;
            }
        }

        // Check if the user doesn't already have a contract in his name (Only one contract per user allowed for simplicity)
        if (mapAccToContract[address] == null) {
            var acccount_balance = web3.fromWei(web3.eth.getBalance(address), 'ether');
            var car = carContract.new(address, web3.fromAscii(carGSMNumber, 16),
                {
                    from: address,
                    data: carContract_bytecode,
                    gas: '4700000'
                }, function (err, contract) {
                    console.log("IN HERE ", err);
                    if(!err) {
                        // NOTE: The callback will fire twice!
                        // Once the contract has the transactionHash property set and once its deployed on an address.

                        // e.g. check tx hash on the first call (transaction send)
                        if (!contract.address) {
                            console.log("Hash: ",contract.transactionHash) // The hash of the transaction, which deploys the contract

                            // check address on the second call (contract deployed)
                        } else {
                            mapAccToContract[address] = contract.address;
                            console.log("Address: ",contract.address) // the contract address
                            var res = {contractMinedAddress: contract.address ,
                                transactionHash : contract.transactionHash,
                                contract_balance : web3.fromWei(web3.eth.getBalance(contract.address), 'ether') + " ether",
                                created: true,
                                account_balance: acccount_balance + " ether"};
                            base.successCallback(res,callback);
                        }
                    }
                });
        }

    },

    getContract: function (address, callback) {
        var tempCarContract = carContract.at(address);
        var a = web3.toAscii(tempCarContract.getGSM.call());
        var res = {number: a};
        base.successCallback(res, callback);
    },

    createMappings: function () {
        console.log(mapAccToContract);
    }
}