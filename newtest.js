var http=require('http');
var queryData="";
var qs=require('querystring');
http.createServer(function(request, response) {
    request.on('data', function(data) {
        queryData += data;
     });
     request.on('end', function () {
        var POST = qs.parse(queryData); 
        if(queryData.split("AA")[2]==0){
            //login message
            console.log("Login message");
         res.end("98989898AA++AA0AA0AA0000AA1000");
        }
    });
    console.log(queryData);   
    response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
    response.end("recieved");
}).listen(3000);
