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
  connection_callback.query("select b.device_password,b.gsm_mobile_number, a.device_Id,a.tank_pressure,a.line_pressure,a.gas_level,a.gas_detector,a.gas_leak,a.low_gas,a.power_level,a.log_time,a.meter1,a.meter2,a.meter3,a.meter4,b.customer_name,a.solenoid log_solenoid, control_data.solenoid control_solenoid ,control_data.device_state_updated from user_device_list c,   device_log_current a inner join devicelist b on a.device_Id=b.device_id  LEFT JOIN control_data ON a.device_Id = control_data.device_id where a.device_Id='"+device_id+"' and c.user_id='"+user_id+"' and  c.device_id=a.device_Id", function (err, result, fields){
    if (err) throw err;
    res.send(result);
   }); 
  console.log("select b.device_password,b.gsm_mobile_number, a.device_Id,a.tank_pressure,a.line_pressure,a.gas_level,a.gas_detector,a.gas_leak,a.low_gas,a.power_level,a.log_time,a.meter1,a.meter2,a.meter3,a.meter4,b.customer_name,a.solenoid log_solenoid, control_data.solenoid control_solenoid ,control_data.device_state_updated from user_device_list c,   device_log_current a inner join devicelist b on a.device_Id=b.device_id  LEFT JOIN control_data ON a.device_Id = control_data.device_id where a.device_Id='"+device_id+"' and c.user_id='"+user_id+"' and  c.device_id=a.device_Id");
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
 connection_callback.query("SELECT a.device_id,b.gas_level,b.gas_detector,b.gas_leak,b.low_gas,b.power_level,c.coordinates,log_time FROM user_device_list a,device_log_current b,devicelist c where  a.user_id='"+user_id+"' and a.device_id = b.device_Id and a.device_id = c.device_id", function (err, result, fields) {
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
      connection_callback.query("select a.device_id,b.device_id,b.customer_name,b.address,b.coordinates,b.gsm_mobile_number,c.power_level,c.gas_leak,c.low_gas,c.log_time from user_device_list a inner join devicelist b ON a.device_id=b.device_id left join device_log_current c on a.device_id=c.device_id where a.user_id='"+data+"'", function (err, result, fields) {
      res.send(result);
    });
connection_callback.end();  
});    
});
  
app.post('/addDevice', function(req, res) {
 var data=req.body.data;
 connection.getConnection(function(err,connection_callback){
    if(err){
        connection_callback.release();
    }
         var query="Insert into devicelist(device_id,device_password,session_id,customer_name,coordinates,address,config_password,gsm_mobile_number) VALUES ('"+data.device_id+"','"+data.loginpassword+"','00000000','"+data.username+"','"+data.coordinates+"','"+data.address+"','"+data.configpassword+"','"+data.gsmmobilenumber+"') ON DUPLICATE KEY UPDATE device_id='"+data.device_id+"',device_password='"+data.loginpassword+"',customer_name='"+data.username+"',address='"+data.address+"',coordinates='"+data.coordinates+"',session_id='00000000',config_password='"+data.configpassword+"',gsm_mobile_number='"+data.gsmmobilenumber+"'";
        console.log(query);
        connection_callback.query(query, function (err, result, fields) {
      });
      if(data.editDevice==false){
      query="Insert into user_device_list(user_id,device_id) VALUES ('"+data.user_id+"','"+data.device_id+"')"
      connection_callback.query(query, function (err, result, fields) {
      });
    }
connection_callback.end();    
});
  });

app.post('/deletedevices', function(req, res) {
    var data=req.body.data;
    var user_id=req.body.user_id; 
    console.log(req.body.data);
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
    connection_callback.query("Delete from user_device_list where device_id='"+data.device_id+"'", function (err, result, fields) {});
    connection_callback.query("Delete from devicelist where device_id='"+data.device_id+"'", function (err, result, fields) {});
connection_callback.end();  
});    
});
 

app.post('/addUsers', function(req, res) {
  var time=getServerDate();
  var data=req.body.data;
  console.log("data",data);
  //var user_id=Math.floor(Math.random()*89999+10000);
  connection.getConnection(function(err,connection_callback){
    if(err){
        connection_callback.release();
    }
    var user_id;
console.log("INSERT into user_details(password,user_name,email_id,role,contact_no,address,last_update_time,approved) VALUES ('"+data.password+"','"+data.username+"','"+data.email+"','"+data.role+"','"+data.phone+"','"+data.address+"','"+time+"','0')");
 connection_callback.query("INSERT into user_details(password,user_name,email_id,role,contact_no,address,last_update_time,approved) VALUES ('"+data.password+"','"+data.username+"','"+data.email+"','"+data.role+"','"+data.phone+"','"+data.address+"','"+time+"','0')", function (err, result, fields) {

	user_id=result.insertId;
  data.assigned.map(function(temp_device_id){
   connection_callback.query("INSERT INTO user_device_list(user_id,device_id) VALUES ('"+user_id+"','"+temp_device_id+"')", function (err, result, fields) {});
  });
});
connection_callback.end();
  });
});

app.post('/updateUsers', function(req, res) {
var data=req.body.data;
var time=getServerDate();
connection.getConnection(function(err,connection_callback){
    if(err){
        connection_callback.release();
    }
  console.log("Update user_details set user_name='"+data.username+"',password='"+data.password+"',email_id='"+data.email+"',role='"+data.role+"',contact_no='"+data.phone+"',address='"+data.address+"',last_update_time='"+time+"' where user_id='"+data.user_id+"'");
  connection_callback.query("Update user_details set user_name='"+data.username+"',password='"+data.password+"',email_id='"+data.email+"',role='"+data.role+"',contact_no='"+data.phone+"',address='"+data.address+"',last_update_time='"+time+"',approved='0' where user_id='"+data.user_id+"'", function (err, result, fields) {});
  if(err) throw err;
  console.log("delete from user_device_list where user_id IN (select distinct user_id from user_details where user_name='"+data.username+"' and password='"+data.password+"' and emai_id='"+data.email+"' and role='"+data.role+"' and contact_no='"+data.phone+"' and address='"+data.address+"')");
  connection_callback.query("delete from user_device_list where user_id='"+data.user_id+"'", function (err, result, fields) {}); 
  data.assigned.map(function(temp_device_id){
  console.log("INSERT INTO user_device_list(user_id,device_id) VALUES ('"+data.user_id+"','"+temp_device_id+"')");
    connection_callback.query("INSERT INTO user_device_list(user_id,device_id) VALUES ('"+data.user_id+"','"+temp_device_id+"')", function (err, result, fields) {});
  });
connection_callback.end();
});
  console.log(data);
});


app.post('/getUserData', function(req, res) {
 var data=req.body.data;
 var response={user_details:"",user_device_list:"",non_assigned_device_list:""};
 connection.getConnection(function(err,connection_callback){
    if(err){
        connection_callback.release();
    }
    connection_callback.query("Select * from user_details where user_name='"+data.user_name+"' AND email_id='"+data.email_id+"' AND contact_no='"+data.contact_no+"' AND role='"+data.role+"'", function (err, result1, fields){
  if (err) throw err;
    response.user_details=result1[0];
    connection_callback.query("Select device_id from user_device_list where user_id='"+response.user_details.user_id+"'", function (err, result2, fields){
      if (err) throw err;
      response.user_device_list=result2;
      console.log(response);
      connection_callback.query("select device_id from devicelist where not device_id in (select device_id from user_device_list where user_id ='"+response.user_details.user_id+"')", function (err, result3, fields){
        if (err) throw err;
        response.non_assigned_device_list=result3;
        console.log(response);
        res.send(response);
      }); 
    });
  });
connection_callback.end();
});
});


app.post('/delete', function(req, res) {
  var data=req.body.data;
  console.log("Running");
  console.log(data);
  connection.getConnection(function(err,connection_callback){
    if(err){
        connection_callback.release();
    }
    connection_callback.query("Delete from user_device_list where user_id='"+data.user_id+"'");
    connection_callback.query("Delete from user_details where user_id='"+data.user_id+"'", function (err, result, fields) {});
connection_callback.end();  
});
});


app.post('/device/updateSolenoid', function(req, res){
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
  var device_id = req.body.device_id;
  device_id = device_id.replace( /:/g, "" );
  var solenoid = req.body.solenoid;
  console.log("device_id :"+device_id+"solenoid : "+solenoid);
  connection_callback.query("INSERT INTO control_data (device_id, solenoid, last_updated, device_state_updated) VALUES('"+device_id+"','"+solenoid+"','"+date+"','1') ON DUPLICATE KEY UPDATE solenoid = '"+solenoid+"', last_updated='"+date+"',device_state_updated='1'", function (err, result, fields){
  if (err) throw err;
    res.send("1");
   });
connection_callback.end();
});
});

app.post('/users/register', function(req, res){
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
  var userNmae = req.body.name;
  //device_id = device_id.replace( /:/g, "" );
  var date=getServerDate();	    
  var password = req.body.password;
  var email_id = req.body.email;
  var mobile_num = req.body.mobile;
  var address = req.body.address;
  connection_callback.query("Insert into user_details (user_name,email_id, contact_no,address,last_update_time,password)VALUES('"+userNmae+"','"+email_id+"','"+mobile_num+"','"+address+"','"+date+"','"+password+"')", function (err, result, fields){
  console.log("Insert into user_details (user_name,email_id, contact_no,address,last_update_time,password)VALUES('"+userNmae+"','"+email_id+"','"+mobile_num+"','"+address+"','"+date+"','"+password+"')");
  if (err){

    if(err.code == 'ER_DUP_ENTRY'){
      res.send("1");
    }
    else
      res.send("2");
      console.log("error code is :" + err.code);}
  else
      res.send("0");
   });
connection_callback.end();
});
});

app.post('/users/login', function(req, res){
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
        var username = req.body.username;
  var password = req.body.password;
  connection_callback.query("SELECT * FROM user_details where user_name ='"+username+"' and password = '"+password+"'", function (err, result, fields){
  if (err){throw err;}
  if(result.length>0){
      res.send(result);
      console.log("device_id :"+username+"solenoid : "+password+" Record exists");
   } 
   else{res.send("0");}
  }); 
connection_callback.end();  
});
});

app.post('/reporting', function(req, res){
    var queryid=req.body.param;
    var deviceId=req.body.deviceId;
    console.log(queryid);
    var query="";
    if(queryid=="true")
        query="SELECT log_time,gas_level FROM device_log_historical where device_id='"+deviceId+"' order by log_time";
    if(queryid=="false")
        query="SELECT log_time,gas_detector FROM device_log_historical where device_id='"+deviceId+"' order by log_time";
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
                connection_callback.query(query, function (err, result, fields){
                if (err){throw err;}
                if(result.length>0){
                    res.send(result);
                 } 
                 else{res.send("0");}
                });
      connection_callback.end();
            });
  });

app.listen(3200);

var connection=mysql.createPool(
    {
        connectionLimit:100,
        user:"root",
        host:"localhost",
        password:"root",
        database:"data_logger_db",
        debug:false
    }
    );
