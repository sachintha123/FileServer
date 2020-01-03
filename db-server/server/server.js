var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path       = require("path");
var mysql      = require('mysql');
var nJwt = require('njwt');
var secureRandom = require('secure-random');
var signingKey = '0123456789012345';//secureRandom(256, {type: 'Buffer'});
const http = require('http');

app.use(cookieParser());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); 

    var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root123",
            database: "teamfluid"
    });

    con.connect(function(err) {
        if (err){
            console.log("SQL Server Not Connected");       
        }
        else
        {
            console.log("SQL Server Connected");       
        }
});	


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



app.get('/health',function(req,res){
    res.status(200).send("Ok");
});


app.post('/adduser',function(req,res){
	
     var first_name   = req.body.first_name;
     var last_name   = req.body.last_name;
     var user_name = req.body.user_name;
     var email   = req.body.email;
     var oging_detcol   = req.body.oging_detcol;

     console.log("Connected!");
     var ins = "INSERT INTO loging_det (first_name,last_name,user_name,email,oging_detcol) VALUES ('"+ first_name +"', '"+ last_name +"','"+user_name+"','"+ email +"','"+ oging_detcol +"')";
     con.query(ins, function (err, result) {
         if (err) throw err;
         console.log("1 record inserted");
     });
        
});

app.get('/userexists/:user_name',function(req,res){
    console.log("wwwww");
    
    try{
        
        var user_name = req.params.user_name;
        var sql;
        console.log('getting user ' +user_name);
     
   

        sql = "SELECT * FROM loging_det WHERE user_name = "+ user_name +"";
 
    

        con.query(sql, function (err, result) {

            console.log("ttttt",result);
            if(result.length != 0){
            //if(typeof result.length !== "Undefined"){
                
                //console.log(result[0]);
                var first_name = result[0].first_name;
                var last_name = result[0].last_name;
                var user_name = result[0].user_name;
                var email = result[0].email;
                var password = result[0].oging_detcol;

                res.send(JSON.stringify({first_name: first_name , last_name:last_name, user_name:user_name, email:email, password:password}));
                console.log("Already Exists");
            }
            else{
                    res.status(404).send('Not Found');
                    console.log("Not Found");
            }
        
           
        
        });
       
           
    }
    catch( err){
        res.status(404).send("error!!!!");
   }

});


app.post('/login',function(req,res){
    
    var obj = {user_namebody : req.body.user_name, passbody : req.body.password};
    console.log(obj.user_namebody + "----------------"+ obj.passbody);
    var sql = "SELECT * FROM loging_det WHERE user_name='"+obj.user_namebody+"'";
    
      try{
       
          con.query(sql, function (err, result) {
              if(err){
                  throw err;
              }
              else{
                    var user_id=result[0].user_id;
                    var user_name=result[0].user_name;
                    var password = result[0].oging_detcol;
                   
                    
                        if(password == obj.passbody){
                            console.log("in the IF");
            
                            var url = 'http://localhost:4000/gentoken';
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
                              
                                   console.log(buff,'buffffffffffffffffffffffffff');
                                   console.log(user_id +" "+ "-----------");
                                   res.status(200).send(JSON.stringify({token:buff,user_id:user_id}));
                        
                              
                                });
                              
                              })
                              .on('error', (e) => {
                                console.log('error')
                                return;
                              });
                             
                        }
                        
                        else{
                            res.status(404).send();
                        }
                    
              }
                               
          });

        
      } catch (err){
          res.status(404).send("error!!!!");
      }

});

app.use(function(req, res, next){
    var url = require('url');
    var token = req.get('Authorization');
    console.log("Authorization" + " " + token);
  
        var options = url.parse('http://localhost:4000/vertokengetuser');
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
        
        req.write(JSON.stringify({token : token}));
        req.end();
    
});

app.post('/getuser',function(req,res){

    try{
        var user_id   = req.body.user_id;
        var sql = "SELECT * FROM loging_det WHERE user_id="+ user_id +"";

           

        con.query(sql, function (err, result) {
           

                console.log(result[0]);
                var first_name=result[0].first_name;
                var last_name=result[0].last_name;
                var user_name=result[0].user_name;
                var email=result[0].email;
                var password=result[0].oging_detcol;                

                res.send(JSON.stringify({first_name: first_name , last_name:last_name, user_name:user_name, email:email, password:password}));
                console.log("Already Exists");

        });
           
    }
catch(err){

}

});

app.listen(3000, function () {
    console.log('Server is running. Point your browser to: http://localhost:3000');
});