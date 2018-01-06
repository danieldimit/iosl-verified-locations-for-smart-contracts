'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Web3 = require('web3');
const cors = require("cors");
//Routes
var routes = require('./routes/routes');
const Account = require('./model/accounts').Accounts;

var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');

// Application config
const LOCAL_APP_PORT = 4000;
const PUBLIC_APP_PORT = process.env.PUBLIC_APP_PORT || LOCAL_APP_PORT;
const ETHEREUM_CLIENT_IP = process.env.ETHEREUM_CLIENT_IP || "http://localhost";
const ETHEREUM_CLIENT_PORT = process.env.ETHEREUM_CLIENT_PORT || "8545";
const ETHEREUM_CLIENT =  ETHEREUM_CLIENT_IP + ':' + ETHEREUM_CLIENT_PORT;

//Set up global RPC connection
global.web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_CLIENT));
if (global.web3.isConnected()){
  console.log('Connected to ethereum RPC client ...');
}else{
  console.log('Not connected to ethereum RPC client ...');
}

app.listen(LOCAL_APP_PORT, function() {
	console.log("Looking for ethereum accounts on address"+ETHEREUM_CLIENT_IP);
    var accounts = global.web3.eth.accounts;
    console.log('Available ethereum accounts: ' + JSON.stringify(accounts,null,4));
    
       // Account.drop().then(function(){
                    Account.sync({force: false}).then(function(){
                         console.log('Table for accounts created ... (Old table is used if it has already existed.)');
                        var body = {'account_address': ''};
                        for (var i = 0; i < accounts.length; i++){
                             var address = accounts[i];
                             body = {'account_address': address};
                             Account.findOrCreate({
                                where: body, defaults: body});
                         }
                    }).catch(function (err){
                        console.log("Error on updating tables"+JSON.stringify(err));
                    });
      //  });
});

// Express middleware
app.use(bodyParser());
app.use(bodyParser.json()); 
app.use(cors());


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//Routes Mapping
app.use('/api/v1',routes);

app.get('/',function (req , res){
res.send('<h1>Hello<//h1> <br>welcome to Blockchain <br><br><h2>Available Accounts Are</h2><br>'
	+JSON.stringify(global.web3.eth.accounts,null,4));
});
