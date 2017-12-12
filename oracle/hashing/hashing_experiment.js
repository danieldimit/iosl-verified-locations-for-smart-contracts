var geohashpoly = require('geohash-poly');
const geoarea = require('geo-area')(/*options*/{x: 'lng', y: 'lat'});
var Chart = require("chart.js");


/*
* GENERATE RANDOM GEOFENCES
*
 */

function getDistanceFromLatLonInKm(location1, location2) {
    lat1 = location1[0];
    lon1 = location1[1];
    lat2 = location2[0];
    lon2 = location2[1];

    var R = 6371;
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

function calculateArea(geofence_normal){
    //calculate area for irregular polygon
    var geofence = geofence_normal.reverse();

    var polygon = [];
    for (var t = 0; t < geofence.length; t++) {

        polygon.push({lng: geofence[t][1], lat: geofence[t][0]});
    }
    return geoarea(polygon) / 1000000;
}

function getNewPointFromDistanceBearing(a, distance, bearing) {

    var lat = a[0];
    var lon = a[1];
    var dist = distance / 6371;
    var brng = deg2rad(bearing);

    var lat1 = deg2rad(lat);
    var lon1 = deg2rad(lon);

    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
        Math.cos(lat1),
        Math.cos(dist) - Math.sin(lat1) *
        Math.sin(lat2));

    if (isNaN(lat2) || isNaN(lon2)) return null;

    return [rad2deg(lon2), rad2deg(lat2)];
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function rad2deg(rad) {
    return rad * 180 / Math.PI;
}


function generateRandomGeofence(){

    maxBearing = 45;

    center = [52.520007, 13.404954];

    geofence = [];
    var bearing = 0;

    while(bearing < 360 - maxBearing){
        var newBearing = Math.floor(Math.random() * maxBearing) + bearing;
        while(newBearing > 360) {
            newBearing = Math.floor(Math.random() * maxBearing) + bearing;
        }
        distance = Math.floor(Math.random() * 10) + 10;
        geofence.push(getNewPointFromDistanceBearing(center, distance, newBearing));
        bearing = newBearing;
    }
    return geofence;
}

/*
* GeoHash FUNCTIONS
 */

function hashToString(poly, geohash_cells, geohash_diffs, geohash_area) {

    geofence_area = calculateArea(poly);
    var geohash_geofence = poly;
    geohash_geofence.push(geohash_geofence[0]);
    var g_final = [];
    if(g_final.push(geohash_geofence)){

        geohashpoly({coords: g_final, precision: 6, hashMode: "inside" }, function (err, hashes) {
            geohash_cells.push(hashes.length);
            geohash_diffs.push(geofence_area - hashes.length * 0.72);
            geohash_area.push(geofence_area);


            if(geohash_cells.length == 100){
                console.log("Number of cells " + geohash_cells.reduce(function(a, b) {
                    return a + b;
                }, 0) / 100);
                console.log("Area not covered " + geohash_diffs.reduce(function(a, b) {
                    return a + b;
                }, 0) / 100);
                console.log("Mean area " + geohash_area.reduce(function(a, b) {
                    return a + b;
                }, 0) / 100);
            }
        });
    }
}

/*
* S2 Implementation
* TODO
 */


/*
* Main Function
 */

function main() {

    geohash_cells = [];
    geohash_area_diffs = [];
    geohash_area = [];

    for(i = 0; i < 100; i++){
        geofence = generateRandomGeofence();

        geohash_polygon = hashToString(geofence, geohash_cells, geohash_area_diffs, geohash_area);
    }
}

main()