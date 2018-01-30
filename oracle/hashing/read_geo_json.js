
var fs = require('fs');
var readGeoJson = require("read-geo-json");
const geoarea = require('geo-area')(/*options*/{x: 'lng', y: 'lat'});

fileCache   = {};
function readJson(path, cb) {
    if (fileCache[path]) {
        cb(JSON.parse(fileCache[path]));
        return;
    }

    fs.readFile(path, 'utf8', function(err, data) {
        if (err) throw err;

        fileCache[path] = data;

        cb(JSON.parse(data));
    });
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


readJson("germany-geojson/plz3.json", function(json) {
    count = 0;
    readGeoJson(json, {

        eachPolygon: function(polygon, feature, featureCollection) {

            coords = polygon["coordinates"];
            if(calculateArea(coords[0]) > 30){
                var s = fs.createWriteStream("germany-geojson/fences.txt", {'flags': 'a'});s.write(coords[0] + "\n");s.close();
                count +=1}
        }
    });
    console.log(count)
});