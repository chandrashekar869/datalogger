/*var http=require('http');
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
        //message=body;    
    }); 
    res.end("response message");
}).listen(8080);*/




var express=require('express');
var body_parser=require('body-parser');
var app=express();
//var qs=require('querystring');
/*app.use(body_parser.urlencoded({
    extended:true
}));*/
app.post("/",function(req,res){
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
    res.send("response message express");/*
    console.log(req.body.message);
    res.send("res message");*/
 });
app.listen(3000);
