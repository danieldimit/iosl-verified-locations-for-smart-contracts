var geohashpoly = require('geohash-poly');
const geoarea = require('geo-area')(/*options*/{x: 'lng', y: 'lat'});
var Chart = require("chart.js");
var fs = require("fs");
var geohash = require("latlon-geohash");
var readline = require('readline');

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

function calculateAreaOfCell(lat1, lon1, lat2, lon2) {
    l1 = [lat1, lon1];
    l2 = [lat1, lon2];
    l3 = [lat2, lon1];
    a = getDistanceFromLatLonInKm(l1, l2);
    b = getDistanceFromLatLonInKm(l1, l3);
    return a*b;
}

function calculateArea(geofence_normal){
    //calculate area for irregular polygon
    var geofence = geofence_normal.reverse();

    var polygon = [];
    for (var t = 0; t < geofence.length; t++) {

        polygon.push({lng: geofence[t][0], lat: geofence[t][1]});
    }
    return geoarea(polygon) / 1000000;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function rad2deg(rad) {
    return rad * 180 / Math.PI;
}

function getPointsFromHash(hashes) {
    points = [];
    area = 0.0;

    for(i=0; i < hashes.length; i++){

        bounds = geohash.bounds(hashes[i]);
        lat1 = bounds["sw"]["lat"];
        lon1 = bounds["sw"]["lon"];
        lat2 = bounds["ne"]["lat"];
        lon2 = bounds["ne"]["lon"];

        points.push(lat1);points.push(lon1);points.push(lat2);points.push(lon1);
        points.push(lat2);points.push(lon2);points.push(lat1);points.push(lon2);

        area += calculateAreaOfCell(lat1, lon1, lat2, lon2);
    }


    return [area, points]
}

function findCommonPrefix(hashes, length) {

    if(hashes[0] == undefined) return "";
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
base32chars = ['b', 'c', 'd', 'e', 'f', 'g', 'j', 'h', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function createPermuations(hashes, prefix, original_length, length, compressed, point) {


    if(length > 1){

        if(point == 31){
            if(findWithPrefix(hashes, prefix + base32chars[point]) == Math.pow(32, length - 1)){
                compressed.push(prefix + base32chars[point]);
            }
            else{
                for(c in base32chars){
                    createPermuations(hashes, prefix + c,original_length, length - 1, compressed, 0);
                }

            }
        }
        else{
            if(findWithPrefix(hashes, prefix + base32chars[point]) == Math.pow(32, length - 1)){
                compressed.push(prefix + base32chars[point]);
            }
            else{
                createPermuations(hashes, prefix, original_length, length, compressed, point + 1);
            }
        }
    }
}

function findCompressedCells(hashes) {

    if(hashes[0] == undefined) return hashes;
    compressedCells = [];

    prefix = findCommonPrefix(hashes);
    rest = hashes[0].length - prefix.length;

    createPermuations(hashes, prefix, hashes[0].length, rest, compressedCells, 0);

    console.log(compressedCells);

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
    return [hashes, compressedCells.length];
}

var sync = require("sync");

/*
* GeoHash FUNCTIONS
 */


function hashToString(poly, only_area) {

    if(only_area){
        a = calculateArea(poly);
        var stream_info = fs.createWriteStream("output/f_info.txt", {'flags': 'a'});
        stream_info.write(a + "\n");
        stream_info.end();
    }

    var geohash_geofence = poly;
    geohash_geofence.push(geohash_geofence[0]);
    var g_final = [];
    if(g_final.push(geohash_geofence)){

        geohashpoly({coords: g_final, precision: 3, hashMode: "inside" }, function (err, hashes) {
            if(hashes && hashes.length) {
                console.log(hashes.length);
                o = findCompressedCells(hashes);
                hashes = o[0];
                compressed_count = o[1];

                geofence_area = calculateArea(poly);
                hashes_count = hashes.length;
                bits_needed = (hashes.length - compressed_count) * 24 + compressed_count * 20;
                fence_edges = poly.length;

                /*var stream_hashed = fs.createWriteStream("output/hashed_fences.txt", {'flags': 'a'});
                stream_hashed.once('open', function(fd) {
                    stream_hashed.write(hashes + "\n");
                    stream_hashed.end();
                });*/

                calc = getPointsFromHash(hashes);
                area_covered = calc[0];

                /*var stream_points = fs.createWriteStream("output/fences_points.txt", {'flags': 'a'});
                stream_points.once('open', function (fd) {
                    stream_points.write(calc[1] + "\n");
                    stream_points.end();
                });*/

                var stream_info = fs.createWriteStream("output/fences_info.txt", {'flags': 'a'});
                stream_info.write(hashes_count + ", " + area_covered + ", " + bits_needed +
                    ", " + geofence_area + ", " + fence_edges + "\n");
                stream_info.end();

                console.log("Number of cells " + hashes_count);
                console.log("Area covered " + area_covered);
                console.log("Bits needed " + bits_needed);
                console.log("Real Area covered " + geofence_area);
                console.log("Fence Edges " + fence_edges);
            }
            });
    }
}

/*
* Main Function
 */

function main() {

    num_geofences = 10;

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
        geohash_polygon = hashToString(new_fence, false);
    });
}

main();
