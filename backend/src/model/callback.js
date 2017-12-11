module.exports = {
	
	successCallback : function (data, cb) {
		console.log("callback success ", data);
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