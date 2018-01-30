const express = require('express');
const router = express.Router();
const Account = require('../model/accounts').Accounts;
var base = require('../model/callback');
var owner = require('./ownerController');
const Web3 = require('web3');
var config = require('../config');
var _default_Provider = '';
var crypto = require('crypto');
var encrypt_key= 'PPxCzyyg8RL5aadlSUUlYcqkAFpTJoNg';
module.exports = {


    encrypt : function ( key, callback){
         let iv = crypto.randomBytes(16); //for aes always 16
         let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(encrypt_key), iv);
         let encrypted = cipher.update(key);
         encrypted = Buffer.concat([encrypted, cipher.final()]);
         // return iv.toString('hex') + ':' + encrypted.toString('hex');
         callback(iv.toString('hex') + ':' + encrypted.toString('hex'));
    },

     decrypt : function ( key, callback){
        let textParts = key.split(':');
         let iv = new Buffer(textParts.shift(), 'hex');
         let encryptedText = new Buffer(textParts.join(':'), 'hex');
         let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(encrypt_key), iv);
         let decrypted = decipher.update(encryptedText);
         decrypted = Buffer.concat([decrypted, decipher.final()]);
         callback(decrypted.toString());
    },

    setProvider : function (req , provider , callback){

      console.log("Current porvide is :"+provider);

        for(var propName in provider.currentProvider) {
                        var propValue = provider.currentProvider[propName];
                        console.log(propName,propValue);
                    }       
    },

    getProvider : function(callback){
        callback(_default_Provider);
    },

    getAllAccounts : function (req, callback){
		if(global.web3.isConnected()){
			  var json = JSON.stringify(global.web3.eth.accounts);
  			base.successCallback(global.web3.eth.accounts,callback);
		}else{
			var error = {Error: "Provider not connceted"}
			base.errorCallback(error , callback);
		}
    },

    getAddresses : function (address , callback){

    const body = {
        'account_address': address
    };
    
    Account.findOne({ where: body }).then(data => {
            if(data) {
                owner.getAllCarDetails(data.account_address , function(result){
                 return base.successCallback({data , result},callback);
                });
            } else {
                return base.errorCallback({message: "Invalid Account Address"},callback);
            }
});
    } 
}