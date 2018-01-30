//Import sol compiler and file system handler
var base = require('../model/callback');
var oracleAddress = null;
const Account = require('../model/accounts').Accounts;

module.exports = {

	getOracleAddress : function(callback){
		base.successCallback({oracleAddress : oracleAddress}, callback);
	} ,

	setOracleAddress : function(newOracleAddress, callback){
		oracleAddress = newOracleAddress;
		base.successCallback({oracleAddress : oracleAddress}, callback);
	} ,

	getRentedCarsContracts : function(callback){

		 Account.findAll().then(result=>{
            var RentedCars = new Array();
            for (var i = 0; i < result.length; i++) {
                if(result[i].car_owner_address){
                        var car_owner = renter_contract.at(result[i].car_owner_address);
                        var rented_cars = car_owner.AlreadyRentedCars.call();
                            RentedCars.push({ownerContract:result[i].car_owner_address,rented_cars:rented_cars});             
                           }   
                        }
                   
               base.successCallback(RentedCars,callback);
              },
            error=>{
                base.errorCallback(error,callback);
        });
	} ,

	updatePosition : function(car_contract_address , geohash_position ,callback){
		base.successCallback({Message : "Implementation is pending"},callback);
	}

}