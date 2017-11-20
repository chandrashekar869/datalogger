
const express=require('express');
const app=express();
var qs=require('querystring');
var message='';
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
            res.set('Content-Type', 'text/plain');
            res.end("54545455&&++&&0&&0&&0000&&0000");
         
        }
        if(message.split("&&")[2]==1){
            var split=message.split("&&");
            var transid=split[split.length-1];
            console.log(transid);
            res.set('Content-Type', 'text/plain');
        res.end("54545455&&++&&1&&0&&"+transid+"&&1001");
          console.log("Periodic message");
        }    
        });
});
app.listen(3000);
