var base = require('../model/callback');
var s2 = require("s2-geometry").S2;
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');

module.exports = {
	getNearestCellPositionInLatLonAndS2Cell: function (request,callback) {
		console.log(""+request.query.lon+"/  "+request.query.lat);
				findNearestTower(request.query.lon, request.query.lat)
					        .then(function(cellTower) {
					            console.log("cellTower is :"+cellTower);
					        })
					        .catch(function(v) {
					          console.log("cellTower error :"+v);
					        });

					        console.log("getS2KeyID :"+getS2KeyID(request.query.lon, request.query.lat , 15));
	},
	convertS2ToBoundingLatLonPolygon: function (request,callback) {
		// locations.findAll().then(function (locations) {
		// 	base.successCallback(locations, callback);	
		// })
		// .error(function (error) {
		// 	base.errorCallback(error, callback);
		// });
	},
	convertGeofenceToS2Polygons: function (request,callback) {
		// locations.findAll().then(function (locations) {
		// 	base.successCallback(locations, callback);	
		// })
		// .error(function (error) {
		// 	base.errorCallback(error, callback);
		// });
	},
}

function findNearestTower(lon, lat) {
    return new Promise(function(resolve, reject) {
        var stream = fs.createReadStream(path.join(__dirname+'/../cell_tower_data/cell_towers_de_berlin_o2.csv'));
        var shortest = 100000000;
        var dist = 0;
        var nearest = [];
        var csvStream = csv
            .parse()
            .on("data", function(row){
                dist = Math.abs(lon - parseFloat(row[6])) + Math.abs(lat - parseFloat(row[7]));
                if (dist < shortest) {
                    shortest = dist;
                    nearest = row;
                }
            })
            .on("end", function(){
                return resolve(nearest);
            });
        stream.pipe(csvStream);
    });
}

function getS2KeyID( lat , lng , lvl){

var key = s2.latLngToKey(lat, lng, lvl);
	return  s2.keyToId(key);
}

