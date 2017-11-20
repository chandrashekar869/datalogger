var mysql=require('mysql');
var message="";
var qs=require('querystring');
var sfdPattern="++";
var dlmPattern="&&";
var breakdown=message.split(dlmPattern);
var tokenisedobj={};
var params=["msgid","data","time","transid"];
var params_bulk=["data","time"];
i=0;
const express=require('express');
const body_parser=require('body-parser');
const app=express();

app.use(body_parser.urlencoded({
    extended:true
}));
 
app.post("/",function(req,res){
    var body = '';
    req.on('data', function (data) {
        body += data;
        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        console.log(body);
        if (body.length > 1e6)
            req.connection.destroy();
    
    
        if(body==undefined){
            console.log("req no message param",req);
            res.send("Hi from medlynk server");
        }
        else{
        console.log("req",body);
        message=body;
        if(message.split("&&")[2]==0){
            //login message
            console.log("Login message");
            res.send("98989898&&++&&0&&0&&0000&&0000");
        }
        if(message.split("&&")[2]==1){
        res.send("98989898&&++&&1&&0&&0001&&1001&&++&&2&&relay1=1&&0001&&++&&2&&relay2=1&&0001&&++&&2&&config=/server/path&&0001");
        console.log("Periodic message");
        }
        }
    });
    req.on('end', function () {
        var post = qs.parse(body);
        // use post['blah'], etc.
    });

    //breakdown=message.split(dlmPattern);
    /*
    if(message.split("&&")[2]==0){
        //login message
        validateDevice(res);
    }
    if(message.split("&&")[2]==1){
        console.log("periodic");
    //var resmessage=periodic_message();
     //   res.send(resmessage);
    get_state_updated(res,periodic_message_variable);
    }
    if(message.split("&&")[2]==2){
        //bulk message
       // var resmessage=bulk_message();
        //res.send(resmessage);
        get_state_updated(res,bulk_message_variable);
    }
    */
});
app.listen(3000);

