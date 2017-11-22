/*
const express=require('express');
var http=require('http');
const app=express();
var qs=require('querystring');
var message='';
http.createServer("/",function(req,res){
    console.log("Started");
    var body='';
    req.on('data', function (data) {
        console.log("request");
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            
            if (body.length > 1e6)
                req.connection.destroy();
            console.log(body);
        message=body;    
    }); 
        req.on('end', function () {
          var post = qs.parse(body);
        if(message.split("&&")[2]==0){
            //login message
            console.log("Login message");
       //     res.header('Content-Type', 'text/plain');
            res.end("12121212&&++&&0&&0&&0000&&0000");
         
        }
        if(message.split("&&")[2]==1){
            var split=message.split("&&");
            var transid=split[split.length-1];
            console.log(transid);
            res.set('Content-Type', 'text/plain');
        res.end("12121212&&++&&1&&0&&"+transid+"&&1001");
          console.log("Periodic message");
        }    
        });
})
    app.listen(3000);


var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var qs = require("querystring");
app.post('/',function(req,res){
   var body='';
  
console.log(req.body.message);       
    res.end("yes");
    
});
app.listen(3200,function(){
  console.log("Started on PORT 3000");
})
*/
var http=require('http');
http.createServer(function(req,res){
     var body='';
    req.on('data', function (data) {
        console.log("request");
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            
            if (body.length > 1e6)
                req.connection.destroy();
            console.log(body);
        message=body;    
    }); 
res.writeHead(200,{'Content-type':'text/plain'});
    res.end("hello");
}).listen(3200);






