var http=require('http');
var qs=require('querystring');
var message='';
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
    //       console.log("req",body);
      message=body;
        }); 
        req.on('end', function () {
            var post = qs.parse(body);
        console.log(body);
        if(message.split("&&")[2]==0){
                //login message
                console.log("Login message");  
            res.setHeader('Content-Type', 'text/plain');
            res.send("98989898&&++&&0&&0&&0000&&0000");
            }
            if(message.split("&&")[2]==1){
            res.setHeader('Content-Type', 'text/plain');
            res.send("98989898&&++&&1&&0&&0001&&1001&&++&&2&&relay1=1&&0001&&++&&2&&relay2=1&&0001&&++&&2&&config=/server/path&&0001");
            console.log("Periodic message");
            }
            //console.log(body);
            // use post['blah'], etc.
        });
}).listen(3000);
