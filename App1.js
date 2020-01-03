var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var path       = require("path");

var url = 'http://localhost:3000/health';

const http = require('http');



http.get(url, (responseHandler) => {

    if (responseHandler.statusCode !== 200) {
        console.log('failed') 
        return;
    }

    var buff = '';
    responseHandler.on('data', (chunk) => {
        buff += chunk;
    });

    responseHandler.on('end', () => { 
        
        console.log(buff)


    });

})




.on('error', (e) => {
    console.log('error')
    return;
});  

app.listen(8082, function () {
    console.log('Server is running.Point your browser to: http://localhost:8082')
});