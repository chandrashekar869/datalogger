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


app.post('/thirtydaydata', function(req, res){
    var device_Id=req.body.deviceId;
    var queryid=req.body.param;
    var currdate=new Date();
    var enddate=new Date();
    var query;
    enddate.setDate(currdate.getDate()-30); 
    if(queryid=="true")
        query="SELECT log_time,gas_level FROM device_log_historical WHERE device_id='"+device_Id+"' AND   log_time >= '"+enddate.getFullYear()+"-"+(enddate.getMonth()+1)+"-"+enddate.getDate()+"' AND log_time   <= '"+currdate.getFullYear()+"-"+(currdate.getMonth()+1)+"-"+currdate.getDate()+"' order by log_time";
    if(queryid=="false")
        query="SELECT log_time,gas_detector FROM device_log_historical  WHERE device_id='"+device_Id+"' AND   log_time >= '"+enddate.getFullYear()+"-"+(enddate.getMonth()+1)+"-"+enddate.getDate()+"' AND log_time   <= '"+currdate.getFullYear()+"-"+(currdate.getMonth()+1)+"-"+currdate.getDate()+"' order by log_time";
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
    //console.log("device_id :"+userNmae+"solenoid : "+password);
    connection_callback.query(query, function (err, result, fields){
        console.log(query);
        res.send(result);
    });
     connection_callback.end();     
    });
});




app.post('/users/changePassword', function(req, res){
    var user_id = req.body.user_id;
    var oldpassword = req.body.oldPassword;
    var password = req.body.newPassword;
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
    //console.log("device_id :"+userNmae+"solenoid : "+password);
    connection_callback.query("UPDATE user_details SET password='"+password+"' WHERE user_id='"+user_id+"' and password='"+oldpassword+"'", function (err, result, fields){
    console.log("UPDATE user_details SET password='"+password+"' WHERE user_id='"+user_id+"' and password='"+oldpassword+"'");
    console.log("result:"+result.affectedRows);
    
    if(result.affectedRows>0)
    {
      res.send("0");
    }
    else
      res.send("2");
  
    if (err){ throw err;
      res.send("1");}
     });
     connection_callback.end();     
    });
});

app.post('/device/gaugesInfo', function(req, res){
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
         var device_id = req.body.device_id;
  device_id = device_id.replace( /:/g, "" );
	    var user_id = req.body.user_id;
  console.log(device_id);
//  connection_callback.query("select b.config_password device_password,b.key_location, b.gsm_mobile_number, a.device_Id,a.tank_pressure,a.line_pressure,a.gas_level,a.gas_detector,a.gas_leak,a.low_gas,a.power_level,a.log_time,a.meter1,a.meter2,a.meter3,a.meter4,b.customer_name,a.solenoid log_solenoid, control_data.solenoid control_solenoid ,control_data.device_state_updated from user_device_list c,   device_log_current a inner join devicelist b on a.device_Id=b.device_id  LEFT JOIN control_data ON a.device_Id = control_data.device_id where a.device_Id='"+device_id+"' and c.user_id='"+user_id+"' and  c.device_id=a.device_Id", function (err, result, fields){
    connection_callback.query("select b.config_password device_password,b.key_location, b.gsm_mobile_number, a.device_Id,a.tank_pressure,a.line_pressure,a.gas_level,a.gas_detector,a.gas_leak,a.low_gas,a.power_level,a.log_time,a.meter1,a.meter2,a.meter3,a.meter4,b.customer_name,a.solenoid log_solenoid,d.ang2_threshold,d.ang2_lower_limit,d.ang3_threshold,d.ang3_lower_limit,e.http_post_interval, control_data.solenoid control_solenoid ,control_data.device_state_updated from user_device_list c,   device_log_current a inner join devicelist b on a.device_Id=b.device_id  LEFT JOIN control_data ON a.device_Id = control_data.device_id LEFT JOIN analog d ON a.device_Id = d.device_id LEFT JOIN slave_config e ON a.device_Id = e.device_id  where a.device_Id='"+device_id+"' and c.user_id='"+user_id+"' and  c.device_id=a.device_Id", function (err, result, fields){  
if (err) throw err;
    res.send(result);
   }); 
  console.log("select b.config_password device_password,b.key_location, b.gsm_mobile_number, a.device_Id,a.tank_pressure,a.line_pressure,a.gas_level,a.gas_detector,a.gas_leak,a.low_gas,a.power_level,a.log_time,a.meter1,a.meter2,a.meter3,a.meter4,b.customer_name,a.solenoid log_solenoid, control_data.solenoid control_solenoid ,control_data.device_state_updated from user_device_list c,   device_log_current a inner join devicelist b on a.device_Id=b.device_id  LEFT JOIN control_data ON a.device_Id = control_data.device_id where a.device_Id='"+device_id+"' and c.user_id='"+user_id+"' and  c.device_id=a.device_Id");
connection_callback.end();
});
});

app.get('/getDevices', function(req, res){
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
  connection_callback.query("select distinct device_id from devicelist", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
   }); 
connection_callback.end();  
});  
});

app.post('/userAdmin', function(req, res){
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
  connection_callback.query("select user_id,user_name,email_id,contact_no,role,approved from user_details ORDER BY approved DESC", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
   }); 
connection_callback.end();  
});
});

app.post('/users/deviceList', function(req, res) {
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        } 
  var user_id = req.body.user_id;
  //var token = req.body.password;
  //console.log(sqlFun(user_id,getJson));
 //connection_callback.query("SELECT a.device_id,b.gas_level,b.gas_detector,b.gas_leak,b.low_gas,b.power_level,c.coordinates,log_time FROM user_device_list a,device_log_current b,devicelist c where  a.user_id='"+user_id+"' and a.device_id = b.device_Id and a.device_id = c.device_id", function (err, result, fields) {
    connection_callback.query("SELECT distinct a.device_id,b.gas_level,b.gas_detector,b.gas_leak,b.low_gas,b.power_level,c.coordinates,log_time,d.ang2_threshold,d.ang2_lower_limit,d.ang3_threshold,d.ang3_lower_limit,e.http_post_interval FROM user_device_list a,device_log_current b,devicelist c left join analog d on c.device_id=d.device_id left join slave_config e on c.device_id=e.device_id  where  a.user_id='"+user_id+"' and a.device_id = b.device_Id and a.device_id = c.device_id", function (err, result, fields) {       
 console.log("SELECT a.device_id ,b.gas_leak,b.low_gas,b.power_level,c.coordinates,log_time FROM user_device_list a,device_log_current b,devicelist c where  a.user_id='"+user_id+"' and a.device_id = b.device_Id and a.device_id = c.device_id");
      if (err) throw err;
    res.send(result);
   }); 
connection_callback.end();
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

app.post('/deviceAdmin', function(req, res) {
  var data=req.body.data;
  connection.getConnection(function(err,connection_callback){
    if(err){
        connection_callback.release();
    }
      console.log("select distinct b.device_id,c.customer_name,c.address,c.coordinates,c.gsm_mobile_number from user_device_list b,devicelist c where b.user_id='"+data+"' and b.device_id=c.device_id");
      connection_callback.query("select a.device_id,b.device_id,b.customer_name,b.address,b.coordinates,b.gsm_mobile_number,b.key_location,b.device_password,b.config_password,c.gas_level,c.gas_detector,c.power_level,c.gas_leak,c.low_gas,c.log_time,d.ang2_threshold,d.ang2_lower_limit,d.ang3_threshold,d.ang3_lower_limit,e.http_post_interval from user_device_list a inner join devicelist b ON a.device_id=b.device_id left join device_log_current c on a.device_id=c.device_id left join analog d on a.device_id=d.device_id left join slave_config e on a.device_id=e.device_id where a.user_id='"+data+"'", function (err, result, fields) {
      res.send(result);
    });
connection_callback.end();  
});    
});
  
app.post('/
