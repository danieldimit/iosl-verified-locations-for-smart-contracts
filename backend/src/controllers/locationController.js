var locations = require('../model/accounts.js');
var base = require('../model/base');

module.exports = {
	geAllLocation: function (callback) {
		locations.findAll().then(function (locations) {
			base.successCallback(locations, callback);	
		})
		.error(function (error) {
			base.errorCallback(error, callback);
		});
	},

	getLocationId: function (id, callback) {
		locations.findOne({where: {id: id}}).then(function (locations) {
			base.successCallback(locations, callback);
		})
		.error(function (error) {
			base.errorCallback(error, callback);
		});
	},

	save: function (locations, callback) {
		locations.create(locations).then(function (result){
				base.successCallback(result, callback);
				})
				.error(function (error) {
					base.errorCallback(error, callback);	
				});
	},

<<<<<<< HEAD
	update: function (id, locations, callback) {
=======
	locations: function (id, locations, callback) {
>>>>>>> c5a1e7146780f70362755e4d5fb85eb109629ca6
		project.update(locations, {where: {id: id}}).then(function (result) {
			base.successCallback(result, callback);
		})
		.error(function (error) {
			base.errorCallback(error, callback)
		});
	},

	delete: function (id, callback) {
		locations.destroy({where: {id: id}}).then(function (result) {
			base.successCallback(result, callback);
		})
		.error(function (error) {
			base.errorCallback(error, callback);
		});
	}
}