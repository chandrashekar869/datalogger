const express=require('express');
const body_parser=require('body-parser');
const app=express();

app.use(body_parser.json())
app.use(body_parser.urlencoded({
    extended:true
}));

app.use(function (req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});



app.post('/device/gaugesInfo', function(req, res){
  connection=createConnection();
 connection.connect(function(err){
  var device_id = req.body.device_id;
  device_id = device_id.replace( /:/g, "" );
  console.log(device_id);
  connection.query("SELECT device_id,tank_pressure,line_pressure,gas_level,gas_detector,gas_leak,low_gas,power_level,log_time,meter1,meter2,meter3,meter4,customer_name,solenoid FROM device_log_current where device_Id='"+device_id+"'", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
   }); 
  console.log("SELECT device_Id,gas_pressureA,gas_pressureB,gas_level,gas_detector,alarm,beacon,power_level,log_time,meter1,meter2,meter3,meter4,solenoid FROM data_log_current where device_Id='"+device_id+"'");
});
});

app.post('/users/deviceList', function(req, res) {
	  connection=createConnection();
 connection.connect(function(err){
  var user_id = req.body.username;
	var token = req.body.password;
  //console.log(sqlFun(user_id,getJson));
  connection.query("SELECT a.device_id ,gas_leak,low_gas,coordinates,log_time FROM user_device_list a,device_log_current b where  a.user_id='1234' and a.device_id = b.device_Id", function (err, result, fields) {
    console.log("SELECT a.device_id ,alarm,beacon,coordinates,log_time FROM user_device_list a,data_log_current b where  a.user_id='1234' and a.device_id = b.device_Id");
    if (err) throw err;
    res.send(result);
    });
   }); 
});

app.listen(3200);

function createConnection(){
 //creates or init mysql connection
    return mysql.createConnection(
    {
        user:"root",
        host:"localhost",
        password:"root",
        database:"data_logger"
    }
    );
}
