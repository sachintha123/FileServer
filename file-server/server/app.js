var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var path       = require("path");
var cookieParser = require('cookie-parser');



var url = require('url');
const http = require('http');

app.use(cookieParser());
app.get('/healthz',function(req,res){
  res.status(200).send("Ok")
})

app.get('/test', function(req, res, next){
  res.status(200).send("Test");

});

app.use(function(req,res,next){
 
  var token = req.cookies.currentsession;
 //var token = 'My test token'; 
  // console.log(token);
  

  if(req.originalUrl === '/tasks.html'){
    
    if (typeof token !== 'undefined') {

      var options = url.parse('http://localhost:4000/vertoken');
      options.method = 'post';
      options.headers = {'Content-Type':'application/json'};
      
      var req = http.request(options, function(res) {
      
          console.log('Status: ' + res.statusCode);
          if(res.statusCode === 200){
            next();
          }
      

          
      });
      
      req.on('error', function(e) {
         res.status(404).send("Auth server not found");
      });
      
      req.write(JSON.stringify({token:token}));
      req.end();
      
    }
    else{ 

      res.status(403).send('Unauthorized');
      
    }
  }
  else if(req.originalUrl === '/' || req.originalUrl === '/index.html' ){

    if (typeof token !== 'undefined') {

        console.log("user exists");
        res.redirect('/tasks.html');

    }

    else {

        console.log("no exist");
        next();

    } 

}

else {
    next();
}
  
});




app.use(express.static(path.join(__dirname, '../public')));

app.listen(8081, function () {
  console.log('Server is running.Point your browser to: http://localhost:8081')
});