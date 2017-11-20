
const express=require('express');
const app=express();
var qs=require('querystring');
var message='';
app.post("/",function(req,res){
    console.log("Started");
    res.send("Hai");
    var body='';
    req.on('data', function (data) {
        console.log("request");
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            
            if (body.length > 1e6)
                req.connection.destroy();
            console.log(body);
        }); 
        req.on('end', function () {
          var post = qs.parse(body);
        console.log(body);
        });
});
app.listen(3000);
