var Web3 = require('web3');
var geo = require('geo-hash');
var web3;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

oracleAccount = "0xa1c89a074a6bba9f69fa2b294396e942094e0c8d";

contractAddress = '0x2a4b903419893e8fdce05fa34a1c608b8d75a9b1';

// ORACLE ACCOUNT
web3.eth.defaultAccount = oracleAccount;

// contract abi
var abi = [{
    name: 'getPosition',
    type: 'function',
    constant: true,
    inputs: [],
    outputs: [{name: 'position', type: 'string' }]
}, {
    name: 'updatePosition',
    type: 'function',
    constant: false,
    inputs: [{ name: 'curPos', type: 'string' }],
    outputs: []
}];

// creation of contract object
var contract = web3.eth.contract(abi);

for (i = 0; i < 5; i++) {
    updatePosition(generateGeoHash())
}

function generateGeoHash() {
    lat = Math.random() * 100;
    long = Math.random() * 100;

    return geo.encode(lat, long)
}

function updatePosition(newPosition) {
    var contractInstance = contract.at(contractAddress);

    contractInstance.updatePosition(newPosition);

    var r = contractInstance.getPosition();
    console.log(r.toString());
}




