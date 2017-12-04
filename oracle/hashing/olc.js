
var OpenLocationCode = require('open-location-code').OpenLocationCode;
var openLocationCode = new OpenLocationCode();

console.log(openLocationCode.encode(13.5123, 51.12523, 11));