
var fs = require('fs');
var readGeoJson = require("read-geo-json");

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


readJson("germany-geojson/plz1.geojson", function(json) {
    count = 0;
    readGeoJson(json, {

        eachPolygon: function(polygon, feature, featureCollection) {

            coords = polygon["coordinates"];
            for(i = 0; i < coords.length; i++){
                var s = fs.createWriteStream("germany-geojson/fences.txt", {'flags': 'a'});s.write(coords[0] + "\n");s.close();
            }
            count +=1
        }
    });
    console.log(count)
});