var geohashpoly = require('geohash-poly');
var geo = require("ngeohash");

// SET LONGITUDE FIRST THEN LANGITUDE
// THIS IS AN OCTAGON AROUND BERLIN
polygon = [[[13.624420, 52.305802],[13.127289, 52.359510],[12.888336, 52.451668],[13.212433, 52.698702],
   [13.190460, 52.741956], [13.544769, 52.658737],[13.791962, 52.551985],[13.932037, 52.362865], [13.624420, 52.305802]]];

var hashedPolygon = [];

geohashpoly({coords: polygon, precision: 4, hashMode: "extent" }, function (err, hashes) {
    hashedPolygon = hashes;
    //console.log(hashedPolygon);
    var prefix = findCommonPrefix(hashedPolygon);
    var suffixes = [];
    for(i = 0; i < hashedPolygon.length; i++){
        suffixes.push(hashedPolygon[i].substring(prefix.length, hashedPolygon[i].length));
    }
    console.log(prefix);
    //console.log(suffixes);
});


function findCommonPrefix(hashes) {
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

geohashpoly({coords: polygon, precision: 20, integerMode: true, hashMode: "extent" }, function (err, hashes) {
    console.log(hashes);

    min = hashes[0];
    max = hashes[0];
    for(i = 0; i < hashes.length; i++){
        if(min > hashes[i]){
            min = hashes[i]
        }
        if(max < hashes[i]){
            max = hashes[i]
        }
    }

    lat = 52.520008;
    longi = 13.404954;

    c = geo.encode_int(lat, longi, 29);

    console.log(c >> 9);
});