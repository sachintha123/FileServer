
var bodyParser = require('body-parser');
var path       = require("path");
var url = require('url');

const http = require('http');


var options = url.parse('http://localhost:3000/token');
options.method = 'post';

var req = http.request(options, function(res) {

    console.log('Status: ' + res.statusCode);
 

    res.on('data', function (d) {
        console.log(String(d));
    });

});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});


req.end();

console.log('Working');
     