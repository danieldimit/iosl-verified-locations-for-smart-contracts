var geohashpoly = require('geohash-poly');
var geo = require("ngeohash");

// SET LONGITUDE FIRST THEN LANGITUDE
// THIS IS AN OCTAGON AROUND BERLIN
polygon3 = [[[13.143768, 52.389692],[13.668365, 52.327629],[13.448639, 52.720334], [13.143768, 52.389692]]];
polygon4 = [[[13.110809, 52.404775],[13.193207, 52.730315],[13.646393, 52.726988],[13.756256, 52.320914], [13.110809, 52.404775]]];
polygon8 = [[[13.624420, 52.305802],[13.127289, 52.359510],[12.888336, 52.451668],[13.212433, 52.698702],
    [13.190460, 52.741956], [13.544769, 52.658737],[13.791962, 52.551985],[13.932037, 52.362865], [13.624420, 52.305802]]];

polygon16 = [[[13.066864, 52.357833],[13.272858, 52.289005],[13.407440, 52.273882],[13.616180, 52.300764],
    [13.764496, 52.346089],[13.780975, 52.419853],[13.797455, 52.521914],[13.739777, 52.610397],
    [13.660126, 52.675393],[13.536530, 52.726988],[13.330536, 52.730315],[13.154755, 52.726988],
    [13.025665, 52.697037],[12.913055, 52.643740],[12.877350, 52.521914],[12.940521, 52.436601], [13.066864, 52.357833]]];

var hashedPolygon = [];

function hashToString(poly) {
    geohashpoly({coords: poly, precision: 5, hashMode: "extent" }, function (err, hashes) {
        hashedPolygon = hashes;
        //console.log(hashedPolygon);
        var prefix = findCommonPrefix(hashedPolygon);
        var suffixes = [];
        for(i = 0; i < hashedPolygon.length; i++){
            suffixes.push(hashedPolygon[i].substring(prefix.length, hashedPolygon[i].length));
        }

        console.log(suffixes.length)
    });
}



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


//hashToString(polygon16);

var geohash = require("latlon-geohash");

function getPoints(hash) {
    bounds = geohash.bounds(hash);
    lat1 = bounds["sw"]["lat"];
    lon1 = bounds["sw"]["lon"];
    lat2 = bounds["ne"]["lat"];
    lon2 = bounds["ne"]["lon"];

    return [lat1, lon1, lat1, lon2, lat2, lon1, lat2, lon2]
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
        'u', 'v', 'w', 'x', 'y', 'z', '2', '3', '4', '5', '6', '7'];

    for(j = 0; j < 32; j++){
        checkprefix = commonPrefix + base32chars[j];
        c = findWithPrefix(hashes, checkprefix);
        prefix_length = checkprefix.length;
        diff = hashes[0].length - prefix_length;

        if(c == Math.pow(32, diff)){
            compressedCells.push(checkprefix)
        }
        else{
            for(k = 0; k < base32chars; k++){
                checkprefix = checkprefix += base32chars[k];

                c = findWithPrefix(hashes, checkprefix);
                diff = hashes[0].length - prefix_length;
                if(c == Math.pow(32, diff)){
                    compressedCells.push(checkprefix);
                }
            }
        }
    }
    return compressedCells;
}

hashes = ['u33aba', 'u33abb', 'u33abc', 'u33abd', 'u33abe', 'u33abf', 'u33abg', 'u33abj', 'u33abh', 'u33abi', 'u33abk',
    'u33abl', 'u33abm', 'u33abn', 'u33abo', 'u33abp', 'u33abq', 'u33abr', 'u33abs', 'u33abt',
    'u33abu', 'u33abv', 'u33abw', 'u33abx', 'u33aby', 'u33abz', 'u33ab2', 'u33ab3', 'u33ab4', 'u33ab5', 'u33ab6', 'u33ab7', "u33ac8"];

console.log(findCompressedCells(hashes));