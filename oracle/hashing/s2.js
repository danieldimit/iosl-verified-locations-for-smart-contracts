
var s2 = require("s2-geometry").S2;

var lat = 13.12;
var lng = 51.12;
var level = 15;

var key = s2.latLngToKey(lat, lng, level);


console.log(s2.keyToId(key));
console.log(s2.keyToId(key).length);