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
var qs=require('querystring');
/*app.use(body_parser.urlencoded({
    extended:true
}));*/
var flag=1;
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
    req.on('end', function () {
          var post = qs.parse(body);
        if(message.split("&&")[2]==0){
            //login message
            console.log("Login message");
            console.log("Login response=12121212&&++&&0&&0&&0000&&1000");
         res.end("12121212&&++&&0&&0&&0000&&1000");
        }
        if(message.split("&&")[2]==1){
            console.log("Periodic message");
            var split=message.split("&&");
            var transid=split[5];
            console.log("transid:"+transid);
            console.log("response=12121212&&++&&1&&0&&"+transid+"&&1001");
            if(split[0]=="12121212"){
            res.end("12121212&&++&&1&&0&&"+transid+"&&1001");
            console.log("response sent sessionid matched",split[0]);
            }
            else{
                if(flag<=2){
                res.end("12121212&&++&&1&&0&&"+transid+"&&1001");
                    console.log("device excused response sent");
                flag++;
                }
                else if(flag>2){
            console.log("response not sent sessionid not matched",split[0]);
                flag=1;
                }
            }
        }    
        });
 });
app.listen(3000);
