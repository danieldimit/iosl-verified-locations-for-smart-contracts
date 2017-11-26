var Web3 = require('web3');
var geo = require('geo-hash');
var web3;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

oracleAccount = "0x8ead2d9305536ebdde184cea020063d2de3665c7";

contractAddress = '0x28ec68fbd908b4c6ba6342e40a5d5f24d4b06397';

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
}, {
    name: 'getPositionInt',
    type: 'function',
    constant: true,
    inputs: [],
    outputs: [{name: 'positionInt', type: 'int128' }]
}, {
    name: 'updatePositionInt',
    type: 'function',
    constant: false,
    inputs: [{ name: 'curPos', type: 'int128' }],
    outputs: []
}, {
    name: 'hasLeftGeofence',
    type: 'function',
    constant: true,
    inputs: [],
    outputs: [{name: 'leftGeofence', type: 'bool' }]
}];

// creation of contract object
var contract = web3.eth.contract(abi);


function testGeoHashBerlin() {

    inside1 = "";
    inside2 = "";
    outside1 = "";
    outside2 = "";

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

    var res = contractInstance.hasLeftGeofence();
    console.log(res.toString())
}

function updatePositionInt(newPosition) {
    var contractInstance = contract.at(contractAddress);

    contractInstance.updatePositionInt(newPosition);

    var r = contractInstance.getPositionInt();
    console.log(r.toString());

    var res = contractInstance.hasLeftGeofence();
    console.log(res.toString())
}


function testRandomUpdate() {
    for (i = 0; i < 5; i++) {
        updatePosition(generateGeoHash())
    }
}

function testRealUpdate() {

    //Check inside
    pos1 = "u33h232";
    updatePosition(pos1);

    // Check inside prefix outside suffix
    pos2 = "u33l123";
    updatePosition(pos2);

    // Check outside prefix, but inside suffix
    pos3 = "u32h232";
    updatePosition(pos3);

    // Outside both prefix and suffix
    pos4 = "u32l232";
    updatePosition(pos4);
}

function testRealUpdateInt() {
    //Check inside
    pos1 = 855152;
    updatePositionInt(pos1);

    // Check outside
    pos2 = 855153;
    updatePositionInt(pos2);
}

//testRandomUpdate()
//testRealUpdate();
testRealUpdateInt();