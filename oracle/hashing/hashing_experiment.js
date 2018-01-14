var geohashpoly = require('geohash-poly');
const geoarea = require('geo-area')(/*options*/{x: 'lng', y: 'lat'});
var Chart = require("chart.js");
var fs = require("fs");
var geohash = require("latlon-geohash");
var readline = require('readline');

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

function getPointsFromHash(hashes) {
    points = [];

    for(i=0; i < hashes.length; i++){

        bounds = geohash.bounds(hashes[i]);
        lat1 = bounds["sw"]["lat"];
        lon1 = bounds["sw"]["lon"];
        lat2 = bounds["ne"]["lat"];
        lon2 = bounds["ne"]["lon"];

        points.push(lat1);points.push(lon1);points.push(lat2);points.push(lon1);
        points.push(lat2);points.push(lon2);points.push(lat1);points.push(lon2);
    }


    return points
}

function findCommonPrefix(hashes, length) {
    prefix = "";
    minLength = hashes[0].length;
    for(i = 0; i < hashes.length; i++){
        if(minLength < hashes[i].length){
            minLength = hashes[i].length
        }
    }

    for (j = 0; j < minLength; j++) {
        newPrefix = true;
        for(i = 0; i < hashes.length - 1; i++){
            if (hashes[i].charAt(j) != hashes[i + 1].charAt(j)) {
                newPrefix = false;
            }
        }
        if(newPrefix) prefix = hashes[0].substring(0, j+1);
    }

    return prefix;
}

function findWithPrefix(hashes, prefix) {

    prefixLenght = prefix.length;
    count = 0;
    for(i = 0; i < hashes.length; i++){
       if(hashes[i].substring(0, prefixLenght) == prefix){
           count += 1;
       }
    }
    return count;
}

function findCompressedCells(hashes) {

    compressedCells = [];

    commonPrefix = findCommonPrefix(hashes);
    rest = 6 - commonPrefix.length;
    base32chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'j', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for(j = 0; j < 36; j++){
        checkprefix = commonPrefix + base32chars[j];
        c = findWithPrefix(hashes, checkprefix);
        prefix_length = checkprefix.length;
        diff = hashes[0].length - prefix_length - 1;

        if(c == Math.pow(32, diff)){
            compressedCells.push(checkprefix)
        }
        else{
            for(m = 0; m < 36; m++){
                new_prefix = checkprefix + base32chars[m];
                c = findWithPrefix(hashes, new_prefix);

                diff = hashes[0].length - prefix_length - 1;
                if(c == Math.pow(32, diff)){
                    compressedCells.push(new_prefix);
                }
            }
        }
    }

    removable = [];
    for(i = 0; i < compressedCells.length; i++){
        compressed = compressedCells[i];
        for(j = 0; j < hashes.length; j++){
            hash = hashes[j];
            if(hash.substring(0, compressed.length) == compressed){
                removable.push(hash);
            }
        }
        hashes.push(compressed);
    }
    for(i = 0; i < removable.length; i++){
        const index = hashes.indexOf(removable[i]);
        hashes.splice(index, 1);
    }
    return hashes;
}

var sync = require("sync");

/*
* GeoHash FUNCTIONS
 */

function hashToString(poly, num_geofences, geohash_cells, geohash_diffs, geohash_area, stream_points) {

    geofence_area = calculateArea(poly);
    var geohash_geofence = poly;
    //geohash_geofence.push(geohash_geofence[0]);
    var g_final = [];
    if(g_final.push(geohash_geofence)){

        geohashpoly({coords: g_final, precision: 6, hashMode: "inside" }, function (err, hashes) {
            hashes = findCompressedCells(hashes);

            geohash_cells.push(hashes.length);
            geohash_diffs.push(geofence_area - hashes.length * 0.72);
            geohash_area.push(geofence_area);


            var stream_hashed = fs.createWriteStream("output/hashed_fences.txt", {'flags': 'a'});
            stream_hashed.once('open', function(fd) {
                stream_hashed.write(hashes + "\n");
                stream_hashed.end();
            });
            var stream_points = fs.createWriteStream("output/fences_points.txt", {'flags': 'a'});
            stream_points.once('open', function(fd) {
                stream_points.write(getPointsFromHash(hashes) + "\n");
                stream_points.end();
            });

            if(geohash_cells.length == num_geofences){
                console.log("Number of cells " + geohash_cells.reduce(function(a, b) {
                    return a + b;
                }, 0) / num_geofences);
                console.log("Area not covered " + geohash_diffs.reduce(function(a, b) {
                    return a + b;
                }, 0) / num_geofences);
                console.log("Mean area " + geohash_area.reduce(function(a, b) {
                    return a + b;
                }, 0) / num_geofences);
            }
        });
    }
}

/*
* Main Function
 */

function main() {

    num_geofences = 100;

    geohash_cells = [];
    geohash_area_diffs = [];
    geohash_area = [];

    var rd = readline.createInterface({
        input: fs.createReadStream('output/fences.txt'),
        output: process.stdout,
        console: false
    });

    fences = [];
    rd.on('line', function(line) {
        cords = line.split(",");
        for(i = 0; i < cords.length; i++){
            cords[i] = parseFloat(cords[i])
        }
        new_fence = [];
        for(i = 0; i < cords.length; i += 2){
            new_fence.push([cords[i], cords[i+1]])
        }
        geohash_polygon = hashToString(new_fence, num_geofences, geohash_cells, geohash_area_diffs, geohash_area);
    });
}

function createNewFrences(num_geofences){

    /*for(c = 0; c < 100; c++){
        generateRandomGeofence();
    }*/

    generateRandomGeofence(45, 10, 10);
    generateRandomGeofence(30, 10, 10);
    generateRandomGeofence(15, 10, 10);
    generateRandomGeofence(7.5, 10, 10);
    generateRandomGeofence(3.75, 10, 10);

    generateRandomGeofence(45, 20, 20);
    generateRandomGeofence(30, 20, 20);
    generateRandomGeofence(15, 20, 20);
    generateRandomGeofence(7.5, 20, 20);
    generateRandomGeofence(3.75, 20, 20);
}

main();
//createNewFrences(100);