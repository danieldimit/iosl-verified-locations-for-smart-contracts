
var fs = require("fs");


function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function rad2deg(rad) {
    return rad * 180 / Math.PI;
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

/*
* GENERATE RANDOM GEOFENCES
*
 */


function generateRandomGeofence(mBearing, randomDistance, baseDistance){

    maxBearing = mBearing;

    center = [52.520007, 13.404954];

    geofence = [];
    var bearing = 0;

    while(bearing < 360 - maxBearing){
        var newBearing = Math.floor(Math.random() * maxBearing) + bearing;
        while(newBearing > 360) {
            newBearing = Math.floor(Math.random() * maxBearing) + bearing;
        }
        distance = Math.floor(Math.random() * randomDistance) + baseDistance;
        geofence.push(getNewPointFromDistanceBearing(center, distance, newBearing));
        bearing = newBearing;
    }
    geofence.push(geofence[0]);

    var s = fs.createWriteStream("output/fences.txt", {'flags': 'a'});s.write(geofence + "\n");s.close();
}


function main(){

    generateRandomGeofence(90, 20, 20);
    generateRandomGeofence(75, 20, 20);
    generateRandomGeofence(60, 20, 20);
    generateRandomGeofence(45, 20, 20);
    generateRandomGeofence(30, 20, 20);
    generateRandomGeofence(15, 20, 20);
    generateRandomGeofence(7.5, 20, 20);
    generateRandomGeofence(3.75, 20, 20);
}

main();