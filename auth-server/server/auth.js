var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var path        = require("path");
var nJwt        = require('njwt');
var secureRandom = require('secure-random');
var signingKey = '0123456789012345';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).send();
    } else {
        next();
    }
};


app.use(allowCrossDomain);

app.get('/gentoken',function(req,res){
  
    var claims = {
        
                             
    }

    var jwt = nJwt.create(claims, signingKey);
    var token = jwt.compact();

    //console.log(token);

    res.status(200).send(token);
	
});


app.post('/vertoken',function(req,res){

    var token = req.body.token;

    console.log("Token", token);
    

    nJwt.verify(token, signingKey, function(err, verifiedJwt){

        if(err){

          console.log(err); // Token has expired, has been tampered with, etc
          res.status(403).send('Verification Faliled');
          console.log('Verification Faliled');

        }
        
        else{

          console.log(verifiedJwt); // Will contain the header and body
          res.status(200).send();
          console.log('Verification Succeded'); 
        }

      });
});

app.post('/vertokengetuser',function(req,res){

    var token = req.body.token;

    console.log("Token--------------------", token);
    

    nJwt.verify(token, signingKey, function(err, verifiedJwt){

        if(err){

          console.log(err); // Token has expired, has been tampered with, etc
          res.status(403).send('Verification Faliled');
          console.log('Verification Faliled');

        }
        
        else{

          console.log(verifiedJwt); // Will contain the header and body
          res.status(200).send();
          console.log('Verification Succeded'); 
        }

      });
});

app.listen(4000, function () {
    console.log('Server is running. Point your browser to: http://localhost:4000');
});