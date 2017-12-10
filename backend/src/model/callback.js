module.exports = {
	
	successCallback : function (data, cb) {
		cb({
			success: true,
			data: data
		});
	},

	errorCallback : function (error, cb) {
		cb({
			success: false,
			error: error
		});
	}
};