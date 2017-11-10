const mysql=require('mysql');
const express=require('express');
const body_parser=require('body-parser');
const app=express();
var connection;
app.use(body_parser.json())
app.use(body_parser.urlencoded({
    extended:true
}));

app.use(function (req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://40.71.199.63:8080');
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
  connection.query("select b.device_password, a.device_Id,a.tank_pressure,a.line_pressure,a.gas_level,a.gas_detector,a.gas_leak,a.low_gas,a.power_level,a.log_time,a.meter1,a.meter2,a.meter3,a.meter4,a.customer_name,a.solenoid log_solenoid, control_data.solenoid control_solenoid ,control_data.device_state_updated from  device_log_current a inner join user_device_list b on a.device_Id=b.device_id  LEFT JOIN control_data ON a.device_Id = control_data.device_id where a.device_Id='"+device_id+"' and b.user_id='1234'", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
   }); 
  console.log("SELECT device_Id,gas_pressureA,gas_pressureB,gas_level,gas_detector,alarm,beacon,power_level,log_time,meter1,meter2,meter3,meter4,solenoid FROM data_log_current where device_Id='"+device_id+"'");
});
});

app.get('/getDevices', function(req, res){
  connection=createConnection();
 connection.connect(function(err){
  connection.query("select distinct device_id from user_device_list", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
   }); 
  });  
});

app.get('/userAdmin', function(req, res){
  connection=createConnection();
 connection.connect(function(err){
  connection.query("select user_name,email_id,contact_no,role from user_details", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
   }); 
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

function getServerDate(){
  //get server date in datetime format
      var server_date=new Date();
      var month=server_date.getMonth()+1;
      month=function(){
          return month<10? "0"+month : ""+month;
      }();
      var server_datetime=server_date.getFullYear()+"-"+month+"-"+server_date.getDate()+" "+server_date.getHours()+":"+server_date.getMinutes()+":"+server_date.getSeconds();
      console.log("Server_date"+server_datetime);
      return server_datetime;
  }

app.post('/addUsers', function(req, res) {
  var time=getServerDate();
  connection=createConnection();
  var data=req.body.data;
  console.log("data",data);
  var user_id=Math.floor(Math.random()*89999+10000);
  connection.connect(function(err){
  connection.query("INSERT into user_details(user_id,password,user_name,email_id,role,contact_no,address,last_update_time,approved) VALUES ('"+user_id+"','"+data.password+"','"+data.username+"','"+data.email+"','"+data.role+"','"+data.phone+"','"+data.address+"','"+time+"','0')", function (err, result, fields) {});
  data.assigned.map(function(temp_device_id){
   connection.query("INSERT INTO user_device_list(user_id,device_id,device_password,session_id) VALUES ('"+user_id+"','"+temp_device_id+"','"+data.password+"','00000111')", function (err, result, fields) {});
  });
      });
  
});

app.post('/delete', function(req, res) {
  var data=req.body.data;
  connection=createConnection();
  connection.connect(function(err){
    connection.query("Delete from user_device_list where user_id IN (Select user_id from user_details where email_id='"+data.email_id+"')");
    connection.query("Delete from user_details where name='"+data.user_name+"' email_id='"+data.email_id+"'", function (err, result, fields) {});
    console.log("Delete from user_details where user_id IN (Select user_id from user_details where email_id='"+data.email_id+"')");
  });
  
});

app.post('/device/updateSolenoid', function(req, res){
  var device_id = req.body.device_id;
  device_id = device_id.replace( /:/g, "" );
  var solenoid = req.body.solenoid;
  console.log("device_id :"+device_id+"solenoid : "+solenoid);
  connection=createConnection();
  connection.connect(function(err){
  connection.query("INSERT INTO control_data (device_id, solenoid, last_updated, device_state_updated) VALUES('"+device_id+"','"+solenoid+"','"+date+"','1') ON DUPLICATE KEY UPDATE solenoid = '"+solenoid+"', last_updated='"+date+"',device_state_updated='1'", function (err, result, fields){
  if (err) throw err;
    res.send("1");
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
        database:"data_logger_db"
    }
    );
}
