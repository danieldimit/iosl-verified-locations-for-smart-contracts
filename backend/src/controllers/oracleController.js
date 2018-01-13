//Import sol compiler and file system handler
var base = require('../model/callback');
var oracleAddress = null;

module.exports = {

	getOracleAddress : function(callback){
		base.successCallback({oracleAddress : oracleAddress}, callback);
	} ,

	setOracleAddress : function(newOracleAddress, callback){
		oracleAddress = newOracleAddress;
		base.successCallback({oracleAddress : oracleAddress}, callback);
	} ,

	getRentedCarsContracts : function(callback){
		base.successCallback({Message : "Implementation is pending"},callback);
	} ,

	updatePosition : function(car_contract_address , geohash_position ,callback){
		base.successCallback({Message : "Implementation is pending"},callback);
	}

}