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
  connection_callback.query("select b.config_password device_password,b.gsm_mobile_number, a.device_Id,a.tank_pressure,a.line_pressure,a.gas_level,a.gas_detector,a.gas_leak,a.low_gas,a.power_level,a.log_time,a.meter1,a.meter2,a.meter3,a.meter4,b.customer_name,a.solenoid log_solenoid, control_data.solenoid control_solenoid ,control_data.device_state_updated from user_device_list c,   device_log_current a inner join devicelist b on a.device_Id=b.device_id  LEFT JOIN control_data ON a.device_Id = control_data.device_id where a.device_Id='"+device_id+"' and c.user_id='"+user_id+"' and  c.device_id=a.device_Id", function (err, result, fields){
    if (err) throw err;
    res.send(result);
   }); 
  console.log("select b.config_password device_password,b.gsm_mobile_number, a.device_Id,a.tank_pressure,a.line_pressure,a.gas_level,a.gas_detector,a.gas_leak,a.low_gas,a.power_level,a.log_time,a.meter1,a.meter2,a.meter3,a.meter4,b.customer_name,a.solenoid log_solenoid, control_data.solenoid control_solenoid ,control_data.device_state_updated from user_device_list c,   device_log_current a inner join devicelist b on a.device_Id=b.device_id  LEFT JOIN control_data ON a.device_Id = control_data.device_id where a.device_Id='"+device_id+"' and c.user_id='"+user_id+"' and  c.device_id=a.device_Id");
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
      connection_callback.query("select a.device_id,b.device_id,b.customer_name,b.address,b.coordinates,b.gsm_mobile_number,b.key_location,b.config_password,c.power_level,c.gas_leak,c.low_gas,c.log_time from user_device_list a inner join devicelist b ON a.device_id=b.device_id left join device_log_current c on a.device_id=c.device_id where a.user_id='"+data+"'", function (err, result, fields) {
      if(err)throw err;
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
         var query="Insert into devicelist(device_id,device_password,session_id,customer_name,coordinates,address,config_password,gsm_mobile_number,key_location) VALUES ('"+data.device_id+"','"+data.loginpassword+"','00000000','"+data.username+"','"+data.coordinates+"','"+data.address+"','"+data.configpassword+"','"+data.gsmmobilenumber+"','"+data.key_location+"') ON DUPLICATE KEY UPDATE device_id='"+data.device_id+"',device_password='"+data.loginpassword+"',customer_name='"+data.username+"',address='"+data.address+"',coordinates='"+data.coordinates+"',session_id='00000000',config_password='"+data.configpassword+"',gsm_mobile_number='"+data.gsmmobilenumber+"',key_location='"+data.key_location+"'";
        console.log(query);
        connection_callback.query(query, function (err, result, fields) {
            if(err)
                res.send("ERR");
            else if(data.editDevice==true)
            res.send("DONE");
            else if(data.editDevice==false){
                query="Insert into user_device_list(user_id,device_id) VALUES ('"+data.user_id+"','"+data.device_id+"')"
                connection_callback.query(query, function (err, result, fields) {
                    if(err)
                        res.send("ERR");
                    else
                    res.send("DONE");
                });
            }
        });
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
    if(err) {
        console.log("err-code",err.code);
          if(err.code=='ER_DUP_ENTRY'){
              res.send("DUP_KEY");
          }
          else{
              res.send("I_ERR");
          }
      }
      else{
        res.send("DONE");
	user_id=result.insertId;
  data.assigned.map(function(temp_device_id){
   connection_callback.query("INSERT INTO user_device_list(user_id,device_id) VALUES ('"+user_id+"','"+temp_device_id+"')", function (err, result, fields) {});
  });
}
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
  connection_callback.query("Update user_details set user_name='"+data.username+"',password='"+data.password+"',email_id='"+data.email+"',role='"+data.role+"',contact_no='"+data.phone+"',address='"+data.address+"',last_update_time='"+time+"',approved='0' where user_id='"+data.user_id+"'", function (err, result, fields) {
    if(err) {
        console.log("err-code",err.code);
          if(err.code=='ER_DUP_ENTRY'){
		  res.send("DUP_KEY");
          }
          else{
		  res.send("I_ERR");
          }
      }
  console.log("delete from user_device_list where user_id IN (select distinct user_id from user_details where user_name='"+data.username+"' and password='"+data.password+"' and emai_id='"+data.email+"' and role='"+data.role+"' and contact_no='"+data.phone+"' and address='"+data.address+"')");
  connection_callback.query("delete from user_device_list where user_id='"+data.user_id+"'", function (err, result, fields) { 
      if(err){
	      	 res.send("I_ERR");
      }
  }); 
	  var count=0;
   data.assigned.map(function(temp_device_id,i){
  console.log("INSERT INTO user_device_list(user_id,device_id) VALUES ('"+data.user_id+"','"+temp_device_id+"')");
    connection_callback.query("INSERT INTO user_device_list(user_id,device_id) VALUES ('"+data.user_id+"','"+temp_device_id+"')", function (err, result, fields) {
        if(err){
           count++;
        }
        if(i==data.assigned.length-1)
            {
                if(count>0)
                    res.send("I_ERR");
                else
                    res.send("DONE");
            }
    });
  });
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
  var date=getServerDate();
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


  app.post('/getconfig', function(req, res){
    var deviceId=req.body.device_id;
    var currentpage=req.body.currentpage
    var datadbnames={"home":[0,"home_config"],"network":[1,"network_config"],"serial":[2,"serial_config"],"server":[3,"server_config"],"slave":[4,"slave_config"],"analog":[5,"analog"],"datetime":[6,"date_time_config"],"digitalcount":[7,"digital_count_config"]};
    var query="Select * from "+datadbnames[currentpage][1]+" where device_id='"+deviceId+"'";
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




  app.post('/device/networkConfig', function(req, res){
      function query_config(current,quer){
        connection.getConnection(function(err,connection_callback){
            if(err){
                connection_callback.release();
            }
                    connection_callback.query(quer, function (err, result, fields){
                        if(err)res.send("ERR");
                      else{
                          quer="Select config_changes from config_change where device_id='"+logindevid+"'";
                       connection_callback.query(quer, function (err, result, fields){
                        if(err)res.send("ERR");
                        else{
                        result=result[0].config_changes;
                        if(result.length==0)
                            quer="INSERT INTO config_change(device_id,"+datadbnames[currentpage][1]+",config_changes) values ('"+logindevid+"','1','1') ON DUPLICATE KEY UPDATE device_id='"+logindevid+"',"+datadbnames[currentpage][1]+"='1',config_changes='1'";                                               
                           else
                            quer="INSERT INTO config_change(device_id,"+datadbnames[currentpage][1]+",config_changes) values ('"+logindevid+"','1','"+(Number(result)+1)+"') ON DUPLICATE KEY UPDATE device_id='"+logindevid+"',"+datadbnames[currentpage][1]+"='1',config_changes='"+(Number(result)+1)+"'";                                                                                    
                           connection_callback.query(quer, function (err, result, fields){
                               if(err)res.send("ERR");
                               else
                                res.send("DONE");
                           });
                        }
                        });
                      }  
                    });
          connection_callback.end();
        });
      }
      logindevid=req.body.device_id;
      var currentpage=req.body.currentpage;
      var data=req.body.obj[currentpage];
      console.log("device_id",logindevid);
      console.log("data",data);
      var datadb={
        "home_config":["mac","fw-version","prodectmodel","bootloader"],
        "network_config":["ip","subnet","gateway","dns","network_interface","dhcp"],
        "serial_config":["232baudrate","232dataparameter","232parity","232stopbits","232flowcontrol","232charwaittime","485baudrate","485dataparameter","485parity","485stopbits","485charwaittime"],
        "server_config":["ipfilter","serverconnecttime","remoteip","remoteport","connectioninactivetime","defeatlongack","restartlosslink","telnetIAC","retainrelaystatus","databackup","timestamp","serverconnectivitytimeout","serverconnectivityrelay","relayinitialstate","relaynextduration","loginuser","loginpassword","SFD","DLM","packettry","responsetimeout","gsm","gsmapn","gsmuserid","gsmpassword"],
        "slave_config":["postinterval","unitid","remotedatapath","serverpath","upsquery","httpmethod"],
        "digital_count_config":["digital1pulse","digital2pulse","digital3pulse","digital4pulse","digital5pulse","digital6pulse","digital7pulse","digital8pulse","digital9pulse","digital10pulse","digital11pulse","digital12pulse"],
        "analog":["analog1offset","analog1threshold","analog1upperlimit","analog1lowerlimit","analog1method","analog1relay","analog2offset","analog2threshold","analog2upperlimit","analog2lowerlimit","analog2method","analog2relay","analog3offset","analog3threshold","analog3upperlimit","analog3lowerlimit","analog3method","analog3relay","analog4offset","analog4threshold","analog4upperlimit","analog4lowerlimit","analog4method","analog4relay","analog5offset","analog5threshold","analog5upperlimit","analog5lowerlimit","analog5method","analog5relay","analog6offset","analog6threshold","analog6upperlimit","analog6lowerlimit","analog6method","analog6relay","analog7offset","analog7threshold","analog7upperlimit","analog7lowerlimit","analog7method","analog7relay","analog8offset","analog8threshold","analog8upperlimit","analog8lowerlimit","analog8method","analog8relay","masternumber","phonenumber1","phonenumber2","phonenumber3","phonenumber4","phonenumber5","phonenumber6","phonenumber7","phonenumber8","phonenumber9","phonenumber10"],
        "date_time_config":["ntp","ntpip","ntpport","ntptimezone","ntpupdateinterval","rtcdate","rtctime"]
       };
       var dbcolnames={
        "home_config":["mac_address","firmware_version","product_model","boot_loader"],
        "network_config":["ip_address","netMask","gateWay","dns_ip_address","network_interface","dhcp"],
        "serial_config":["rs232_baud_rate","rs232_data_bits","rs232_parity","rs232_stop_bits","rs232_flow_control","rs232_c_timeout","rs485_baud_rate","rs485_data_bits","rs485_parity","rs485_stop_bits","rs485_c_timeout"],
        "server_config":["ipfiltering","server_connect_wait_time","remote_ip","remote_port_no","connection_inactive_timeout","defeat_long_ack","restart_on_loss_of_link","telnet_IAC","retain_relay_status","data_backup","time_stamp","server_connectivity_timeout","server_connectivity_timeout_related_relay","Relay_initial_state","relay_next_state_duration","login_user_id","login_password","SFD","DLM","packet_try","response_timeout","GSM","APN","gsm_user_id","gsm_password"],
        "slave_config":["device_id","http_post_interval","unit_id","remote_data_path","server_path","ups_query","http_method"],
        "digital_count_config":["digi1_pulse_count","digi1_digital_change","digi1_pulse_count_number","digi2_pulse_count","digi2_digital_change","digi2_pulse_count_number","digi3_pulse_count","digi3_digital_change","digi3_pulse_count_number","digi4_pulse_count","digi4_digital_change","digi4_pulse_count_number","digi5_pulse_count","digi5_digital_change","digi5_pulse_count_number","digi6_pulse_count","digi6_digital_change","digi6_pulse_count_number","digi7_pulse_count","digi7_digital_change","digi7_pulse_count_number","digi8_pulse_count","digi8_digital_change","digi8_pulse_count_number","digi9_pulse_count","digi9_digital_change","digi9_pulse_count_number","digi10_pulse_count","digi10_digital_change","digi10_pulse_count_number","digi11_pulse_count","digi11_digital_change","digi11_pulse_count_number","digi12_pulse_count","digi12_digital_change","digi12_pulse_count_number"],
        "analog":["ang1_offset","ang1_threshold","ang1_upper_limit","ang1_lower_limit","ang1_method","ang1_relay","ang2_offset","ang2_threshold","ang2_upper_limit","ang2_lower_limit","ang2_method","ang2_relay","ang3_offset","ang3_threshold","ang3_upper_limit","ang3_lower_limit","ang3_method","ang3_relay","ang4_offset","ang4_threshold","ang4_upper_limit","ang4_lower_limit","ang4_method","ang4_relay","ang5_offset","ang5_threshold","ang5_upper_limit","ang5_lower_limit","ang5_method","ang5_relay","ang6_offset","ang6_threshold","ang6_upper_limit","ang6_lower_limit","ang6_method","ang6_relay","ang7_offset","ang7_threshold","ang7_upper_limit","ang7_lower_limit","ang7_method","ang7_relay","ang8_offset","ang8_threshold","ang8_upper_limit","ang8_lower_limit","ang8_method","ang8_relay","master_phone_number","phone_number_1","phone_number_2","phone_number_3","phone_number_4","phone_number_5","phone_number_6","phone_number_7","phone_number_8","phone_number_9","phone_number_10"],
        "date_time_config":["enable_ntp","ntp_server_ip","ntp_port_no","time_zone","ntp_update_time_interval","rtc_current_date","rtc_current_time"],
        };
      var queries=["INSERT INTO home_config (device_id,mac_address,firmware_version,product_model,boot_loader) VALUES('"+logindevid+"',","INSERT INTO data_logger.network_config(device_id,ip_address,netMask,gateWay,dns_ip_address,network_interface,dhcp) VALUES('"+logindevid+"',","INSERT INTO serial_config(device_id,rs232_baud_rate,rs232_data_bits,rs232_parity,rs232_stop_bits,rs232_flow_control,rs232_c_timeout,rs485_baud_rate,rs485_data_bits,rs485_parity,rs485_stop_bits,rs485_c_timeout)VALUES('"+logindevid+"',","INSERT INTO data_logger.server_config(device_id,ipfiltering,server_connect_wait_time,remote_ip,remote_port_no,connection_inactive_timeout,defeat_long_ack,restart_on_loss_of_link,telnet_IAC,retain_relay_status,data_backup,time_stamp,server_connectivity_timeout,server_connectivity_timeout_related_relay,Relay_initial_state,relay_next_state_duration,login_user_id,login_password,SFD,DLM,packet_try,response_timeout,GSM,APN,gsm_user_id,gsm_password)VALUES('"+logindevid+"',","INSERT INTO data_logger.slave_config(device_id,http_post_interval,unit_id,remote_data_path,server_path,ups_query,http_method)VALUES('"+logindevid+"',","INSERT INTO data_logger.analog(device_id,ang1_offset,ang1_threshold,ang1_upper_limit,ang1_lower_limit,ang1_method,ang1_relay,ang2_offset,ang2_threshold,ang2_upper_limit,ang2_lower_limit,ang2_method,ang2_relay,ang3_offset,ang3_threshold,ang3_upper_limit,ang3_lower_limit,ang3_method,ang3_relay,ang4_offset,ang4_threshold,ang4_upper_limit,ang4_lower_limit,ang4_method,ang4_relay,ang5_offset,ang5_threshold,ang5_upper_limit,ang5_lower_limit,ang5_method,ang5_relay,ang6_offset,ang6_threshold,ang6_upper_limit,ang6_lower_limit,ang6_method,ang6_relay,ang7_offset,ang7_threshold,ang7_upper_limit,ang7_lower_limit,ang7_method,ang7_relay,ang8_offset,ang8_threshold,ang8_upper_limit,ang8_lower_limit,ang8_method,ang8_relay,master_phone_number,phone_number_1,phone_number_2,phone_number_3,phone_number_4,phone_number_5,phone_number_6,phone_number_7,phone_number_8,phone_number_9,phone_number_10)VALUES('"+logindevid+"',","INSERT INTO data_logger.date_time_config(device_id,enable_ntp,ntp_server_ip,ntp_port_no,time_zone,ntp_update_time_interval,rtc_current_date,rtc_current_time)VALUES('"+logindevid+"',","INSERT INTO data_logger.digital_count_config(device_id,digi1_pulse_count,digi1_digital_change,digi1_pulse_count_number,digi2_pulse_count,digi2_digital_change,digi2_pulse_count_number,digi3_pulse_count,digi3_digital_change,digi3_pulse_count_number,digi4_pulse_count,digi4_digital_change,digi4_pulse_count_number,digi5_pulse_count,digi5_digital_change,digi5_pulse_count_number,digi6_pulse_count,digi6_digital_change,digi6_pulse_count_number,digi7_pulse_count,digi7_digital_change,digi7_pulse_count_number,digi8_pulse_count,digi8_digital_change,digi8_pulse_count_number,digi9_pulse_count,digi9_digital_change,digi9_pulse_count_number,digi10_pulse_count,digi10_digital_change,digi10_pulse_count_number,digi11_pulse_count,digi11_digital_change,digi11_pulse_count_number,digi12_pulse_count,digi12_digital_change,digi12_pulse_count_number)VALUES('"+logindevid+"',"]; 
      var datadbnames={"home":[0,"home_config"],"network":[1,"network_config"],"serial":[2,"serial_config"],"server":[3,"server_config"],"slave":[4,"slave_config"],"analog":[5,"analog"],"datetime":[6,"date_time_config"],"digitalcount":[7,"digital_count_config"]};
      var tabledata=datadbnames[currentpage];
      var tableid=tabledata[0];
      switch(tableid){
          case 1:datadb[tabledata[1]].map(function(value,j){
              if(typeof(data[value])=='object'){
                if(j!=datadb[tabledata[1]].length-1)
                    queries[tableid]=queries[tableid].concat("'"+data[value].join('.')+"',");
                if(j==datadb[tabledata[1]].length-1){
                queries[tableid]=queries[tableid].concat("'"+data[value]+"') ON DUPLICATE KEY UPDATE ");
                dbcolnames[tabledata[1]].map(function(dupdata,i){
                    console.log("dup");
                    if(typeof(data[datadb[tabledata[1]][i]])=='object')
                    queries[tableid]=queries[tableid].concat(dupdata+"='"+data[datadb[tabledata[1]][i]].join('.')+"',");
                    else
                    queries[tableid]=queries[tableid].concat(dupdata+"='"+data[datadb[tabledata[1]][i]]+"',");   
                });
            }
            }
            else{
                if(j!=datadb[tabledata[1]].length-1)
                    queries[tableid]=queries[tableid].concat("'"+data[value]+"',");
                    if(j==datadb[tabledata[1]].length-1){
                    queries[tableid]=queries[tableid].concat("'"+data[value]+"') ON DUPLICATE KEY UPDATE ");
                    dbcolnames[tabledata[1]].map(function(dupdata,i){
                        //console.log("dup",data[datadb[tabledata[1]][i]]);
                        if(i!=dbcolnames[tabledata[1]].length-1){
                        if(typeof(data[datadb[tabledata[1]][i]])=='object')
                        queries[tableid]=queries[tableid].concat(dupdata+"='"+data[datadb[tabledata[1]][i]].join('.')+"',");
                        else
                        queries[tableid]=queries[tableid].concat(dupdata+"='"+data[datadb[tabledata[1]][i]]+"',");
                    }   
                    if(i==dbcolnames[tabledata[1]].length-1){
                        if(typeof(data[datadb[tabledata[1]][i]])=='object')
                        queries[tableid]=queries[tableid].concat(dupdata+"='"+data[datadb[tabledata[1]][i]].join('.')+"',");
                        else
                        queries[tableid]=queries[tableid].concat(dupdata+"='"+data[datadb[tabledata[1]][i]]+"'");
                    }   
                    });
                }
            }  
        });
        query_config(currentpage,queries[tableid]);
        console.log(queries[tableid]);
         break; 
         case 2:var query=queries[tableid];
         query=query.concat("'"+data["rs232"]["baud_rate"]+"',");
         query=query.concat("'"+data["rs232"]["data_bits"]+"',");
         query=query.concat("'"+data["rs232"]["parity"]+"',");
         query=query.concat("'0',");            
         query=query.concat("'"+data["rs232"]["flow_control"]+"',");
         query=query.concat("'"+data["rs232"]["character_wait_timeout"]+"',");
         query=query.concat("'"+data["rs485"]["baud_rate"]+"',");
         query=query.concat("'"+data["rs485"]["data_bits"]+"',");
         query=query.concat("'"+data["rs485"]["parity"]+"',");
         query=query.concat("'0',");            
         query=query.concat("'"+data["rs485"]["character_wait_timeout"]+"') ON DUPLICATE KEY UPDATE ");
         query=query.concat("rs232_baud_rate='"+data["rs232"]["baud_rate"]+"',");
         query=query.concat("rs232_data_bits='"+data["rs232"]["data_bits"]+"',");
         query=query.concat("rs232_parity='"+data["rs485"]["parity"]+"',");
         query=query.concat("rs232_stop_bits='0',");
         query=query.concat("rs232_flow_control='"+data["rs232"]["flow_control"]+"',");
         query=query.concat("rs232_c_timeout='"+data["rs232"]["character_wait_timeout"]+"',");  
         query=query.concat("rs485_baud_rate='"+data["rs485"]["baud_rate"]+"',");
         query=query.concat("rs485_data_bits='"+data["rs485"]["data_bits"]+"',");
         query=query.concat("rs485_parity='"+data["rs485"]["parity"]+"',");
         query=query.concat("rs485_stop_bits='0',");
         query=query.concat("rs485_c_timeout='"+data["rs485"]["character_wait_timeout"]+"'");  
         query_config(currentpage,query);
         console.log(query);
      break;
      case 3:var query=queries[tableid];
      query=query.concat("'"+data["ip_filtering"]["ip1"].join(".")+","+data["ip_filtering"]["ip2"].join(".")+","+data["ip_filtering"]["ip3"].join(".")+","+data["ip_filtering"]["ip4"].join(".")+","+data["ip_filtering"]["ip5"].join(".")+"',");
      query=query.concat("'"+data["server_connect_waittime"]+"',");
      query=query.concat("'"+data["remote_ip"]+"',");
      query=query.concat("'"+data["remote_port_no"]+"',");
      query=query.concat("'"+data["connection_inactive_timeout"]+"',");
      query=query.concat("'"+data["defeat_long_ack"]+"',");
      query=query.concat("'"+data["restart_on_loss_link"]+"',");
      query=query.concat("'"+data["telnet_IAC"]+"',");
      query=query.concat("'"+data["retain_relay_status"]+"',");
      query=query.concat("'"+data["data_backup"]+"',");
      query=query.concat("'"+data["time_stamp"]+"',");      
      query=query.concat("'"+data["server_connectivity_timeout"]+"',");
      query=query.concat("'"+data["server_connectivity_timeout_related_relay"]+"',");
      query=query.concat("'OFF',");
      query=query.concat("'"+data["relay_next_state_duration"]+"',");
      query=query.concat("'"+data["login_user_id"]+"',");
      query=query.concat("'"+data["login_password"]+"',");
      query=query.concat("'"+data["sfd"]+"',");
      query=query.concat("'"+data["dlm"]+"',");
      query=query.concat("'"+data["packet_try"]+"',");
      query=query.concat("'"+data["response_timeout"]+"',");
      query=query.concat("'"+data["gsm"]["gsm"]+"',");
      query=query.concat("'"+data["gsm"]["apn"]+"',");
      query=query.concat("'"+data["gsm"]["user_id"]+"',");
      query=query.concat("'"+data["gsm"]["password"]+"') ON DUPLICATE KEY UPDATE ");
      query=query.concat("ipfiltering='"+data["ip_filtering"]["ip1"].join(".")+","+data["ip_filtering"]["ip2"].join(".")+","+data["ip_filtering"]["ip3"].join(".")+","+data["ip_filtering"]["ip4"].join(".")+","+data["ip_filtering"]["ip5"].join(".")+"',");
      query=query.concat("server_connect_wait_time='"+data["server_connect_waittime"]+"',");
      query=query.concat("remote_ip='"+data["remote_ip"]+"',");
      query=query.concat("remote_port_no='"+data["remote_port_no"]+"',");
      query=query.concat("connection_inactive_timeout='"+data["connection_inactive_timeout"]+"',");
      query=query.concat("defeat_long_ack='"+data["defeat_long_ack"]+"',");
      query=query.concat("restart_on_loss_of_link='"+data["restart_on_loss_link"]+"',");
      query=query.concat("telnet_IAC='"+data["telnet_IAC"]+"',");
      query=query.concat("retain_relay_status='"+data["retain_relay_status"]+"',");
      query=query.concat("data_backup='"+data["data_backup"]+"',");
      query=query.concat("time_stamp='"+data["time_stamp"]+"',");
      query=query.concat("server_connectivity_timeout='"+data["server_connectivity_timeout"]+"',");
      query=query.concat("server_connectivity_timeout_related_relay='"+data["server_connectivity_timeout_related_relay"]+"',");
      query=query.concat("Relay_initial_state='"+data["relay_initial_state"]+"',");
      query=query.concat("relay_next_state_duration='"+data["relay_next_state_duration"]+"',");
      query=query.concat("login_user_id='"+data["login_user_id"]+"',");
      query=query.concat("login_password='"+data["login_password"]+"',");
      query=query.concat("SFD='"+data["sfd"]+"',");
      query=query.concat("DLM='"+data["dlm"]+"',");
      query=query.concat("packet_try='"+data["packet_try"]+"',");
      query=query.concat("response_timeout='"+data["response_timeout"]+"',");
      query=query.concat("GSM='"+data["gsm"]["gsm"]+"',");
      query=query.concat("APN='"+data["gsm"]["apn"]+"',");
      query=query.concat("gsm_user_id='"+data["gsm"]["user_id"]+"',");
      query=query.concat("gsm_password='"+data["gsm"]["password"]+"'");
      query_config(currentpage,query);
      console.log(query);
      break;
      case 4:var query=queries[tableid];
      query=query.concat("'"+data["http_post_interval"]+"',");
      query=query.concat("'"+data["unit_id"]+"',");
      query=query.concat("'"+data["remote_data_path"]+"',");
      query=query.concat("'"+data["server_path"]+"',");
      query=query.concat("'"+data["ups_query"]+"',");
      query=query.concat("'"+data["http_method"]+"') ON DUPLICATE KEY UPDATE ");
      query=query.concat("http_post_interval='"+data["http_post_interval"]+"',");
      query=query.concat("unit_id='"+data["unit_id"]+"',");
      query=query.concat("remote_data_path='"+data["remote_data_path"]+"',");
      query=query.concat("server_path='"+data["server_path"]+"',");
      query=query.concat("ups_query='"+data["ups_query"]+"',");
      query=query.concat("http_method='"+data["http_method"]+"'");
      query_config(currentpage,query);
      console.log(query);
      break;
      case 5:var query=queries[tableid];
      var params=["offset","threshold","upperLimit","lowerLimit","method","relay"];
      for(var i=1;i<=8;i++){
          params.map(function(value){    
            query=query.concat("'"+data["analog"+i][value]+"',");  
        });
      }
      query=query.concat("'"+data["numbers"]["masterNum"]+"',");
      for(var i=1;i<=10;i++){
          if(i!=10)
            query=query.concat("'"+data["numbers"]["num"+i]+"',");
          if(i==10)
            query=query.concat("'"+data["numbers"]["num"+i]+"') ON DUPLICATE KEY UPDATE ");
      }
      var j=0;
        for(var i=1;i<=8;i++){
            params.map(function(value){
                query=query.concat(dbcolnames.analog[j]+"='"+data["analog"+i][value]+"',");  
                j++;        
            });
        }
        j++;
       query=query.concat("master_phone_number='"+data["numbers"]["masterNum"]+"',");
       for(var i=1;i<=10;i++,j++){
            if(i!=10)
              query=query.concat(dbcolnames.analog[j]+"='"+data["numbers"]["num"+i]+"',");
            if(i==10)
              query=query.concat(dbcolnames.analog[j]+"='"+data["numbers"]["num"+i]+"'");
        }       
        query_config(currentpage,query);
      console.log(query);
      break;
      case 6:var query=queries[tableid];
      query=query.concat("'"+data["enableNTP"]+"',");  
      query=query.concat("'");  
           for(var i=1;i<=3;i++){
          if(data["ntpServerIP"]["ntp"+i].length>0 && i!=1 ){
            query=query.concat(","+data["ntpServerIP"]["ntp"+i].join('.'));
          }
          if(data["ntpServerIP"]["ntp"+i].length>0 && i==1 ){
            query=query.concat(data["ntpServerIP"]["ntp"+i].join('.'));
          }
        }
        query=query.concat("',");  
      query=query.concat("'"+data["ntpPortNum"]+"',");
      query=query.concat("'"+data["timeZone"]+"',");
      query=query.concat("'"+data["ntpInterval"]+"',");
      query=query.concat("'"+data["rtcDate"].split("/").reverse().join("-")+"',");
      query=query.concat("'"+data["rtcTime"]+"') ON DUPLICATE KEY UPDATE ");
      var j=0;
      query=query.concat(dbcolnames.date_time_config[j]+"='"+data["enableNTP"]+"',");j++;
      //query=query.concat(dbcolnames.date_time_config[j]+"='"+data["ntpServerIP"]["ntp1"].join('.')+","+data["ntpServerIP"]["ntp1"].join('.')+","+data["ntpServerIP"]["ntp1"].join('.')+","+data["ntpServerIP"]["ntp1"].join('.')+"',");j++;
      query=query.concat(dbcolnames.date_time_config[j]+"='");  
      for(var i=1;i<=3;i++){
     if(data["ntpServerIP"]["ntp"+i].length>0 && i!=1 ){
       query=query.concat(","+data["ntpServerIP"]["ntp"+i].join('.'));
     }
     if(data["ntpServerIP"]["ntp"+i].length>0 && i==1 ){
       query=query.concat(data["ntpServerIP"]["ntp"+i].join('.'));
     }
   }
   j++;
   query=query.concat("',");  
      query=query.concat(dbcolnames.date_time_config[j]+"='"+data["ntpPortNum"]+"',");j++;
      query=query.concat(dbcolnames.date_time_config[j]+"='"+data["timeZone"]+"',");j++;
      query=query.concat(dbcolnames.date_time_config[j]+"='"+data["ntpInterval"]+"',");j++;
      query=query.concat(dbcolnames.date_time_config[j]+"='"+data["rtcDate"].split("/").reverse().join("-")+"',");j++;
      query=query.concat(dbcolnames.date_time_config[j]+"='"+data["rtcTime"]+"'");      
      query_config(currentpage,query);
      console.log(query);      
      break;
      case 7:var query=queries[tableid];
      var params=["pluseCount","digitalChange","pluseCountNum"];
      for(var i=1;i<=12;i++){
        params.map(function(value,j){
            if(i!=12)
            query=query.concat("'"+data["digita"+i][value]+"',");              
            if(i==12){
                if(j!=2)
                    query=query.concat("'"+data["digita"+i][value]+"',");
                if(j==2)
                query=query.concat("'"+data["digita"+i][value]+"') ON DUPLICATE KEY UPDATE ");
        }
        });
      }
      var j=0;
      for(var i=1;i<=12;i++){
        params.map(function(value,k){
            if(i!=12)
            query=query.concat(dbcolnames.digital_count_config[j]+"='"+data["digita"+i][value]+"',");
            if(i==12){
                if(k!=2)
                    query=query.concat(dbcolnames.digital_count_config[j]+"='"+data["digita"+i][value]+"',");
                if(k==2)
                    query=query.concat(dbcolnames.digital_count_config[j]+"='"+data["digita"+i][value]+"'");
            }
            j++;
        });
      }
      query_config(currentpage,query);
      console.log(query);
      break;
    }
    });


app.listen(3200);

var connection=mysql.createPool(
    {
        connectionLimit:100,
        user:"root",
        host:"localhost",
        password:"root",
        database:"data_logger",
        debug:false
    }
    );
