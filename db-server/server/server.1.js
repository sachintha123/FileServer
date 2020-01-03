
var express = require('express'),
app = express(),
bodyParser = require('body-parser'),
path    = require("path");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.get('/health',function(req,res){
   res.status(200).send("Ok")
})


app.get('/test',function(req, res){
	
   

    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root123"
        
    });

    con.connect(function(err) {
        if (err){
            res.status(403).send("Not Connected");       
        };
        {
            res.status(200).send("Connected");       
        }
    });	
});

app.get('/testuser',function(req, res){
	
    
    var username= req.body.username;
    var password = req.body.password;

    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root123",
        database: "teamfluid"
    });

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT user_id FROM user_table WHERE user_name=[username]", function (err, result, fields) {
          if (err){
            throw err;
            console.log(result);
          } 
          else{
            if(results.length >0){
                if([0].password == password){
                  res.send({
                    "code":200,
                    "success":"login sucessfull"
                      });
                }
                else{
                    res.send({
                      "code":204,
                      "success":"Username and password does not match"
                        });
                }
            }
            else{
                res.send({
                  "code":204,
                  "success":"User does not exits"
                    });
              }
        }
        });
      });
});

app.get('/insert',function(req,res){
    var user_id= req.body.user_id;
    var user_name = req.body.user_name;
    var password = req.body.password;
    var reg_date = req.body.reg_date;
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root123",
        database: "teamfluid"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = "INSERT INTO user_table(user_ID,user_Name,password,email,reg_date) VALUES ([user_id],[user_name],[password],[reg_date])";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
});

app.get('/delete',function(req,res){
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root123",
        database: "teamfluid"
    });

    con.connect(function(err) {
        if (err) throw err;
        var sql = "DELETE FROM user_table WHERE user_id = '1'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Number of records deleted: " + result.affectedRows);
        });
      });

});

app.get('/update',function(req,res){
    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root123",
        database: "teamfluid"
    });

    con.connect(function(err) {
        if (err) throw err;
        var sql = "UPDATE user_table SET username = 'Nayanajith' WHERE user_id = '1'";
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log(result.affectedRows + " record(s) updated");
        });
      });  
})

app.listen(3000, function () {
    console.log('Server is running. Point your browser to: http://localhost:3000');
  });