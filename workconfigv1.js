var async=require('async');
var mysql=require('mysql');
var js2xmlparser = require("js2xmlparser");
var datadb={
    "home_config":["mac","fw-version","prodectmodel","bootloader"],
    "network_config":["ip","subnet","gateway","dns","network_interface","dhcp"],
    "serial_config":["c232baudrate","c232dataparameter","c232flowcontrol","c232charwaittime","c485baudrate","c485dataparameter","c485charwaittime"],
    "server_config":["ipfilter","serverconnecttime","remoteip","remoteport","connectioninactivetime","defeatlongack","restartlosslink","telnetIAC","retainrelaystatus","databackup","timestamp","serverconnectivitytimeout","serverconnectivityrelay","relaynextduration","loginuser","loginpassword","SFD","DLM","packettry","responsetimeout","gsm","gsmapn","gsmuserid","gsmpassword"],
    "slave_config":["postinterval","unitid","remotedatapath","serverpath","upsquery","httpmethod"],
    "digital_count_config":["digital1pulse","digital2pulse","digital3pulse","digital4pulse","digital5pulse","digital6pulse","digital7pulse","digital8pulse","digital9pulse","digital10pulse","digital11pulse","digital12pulse"],
    "analog":["analog1offset","analog1threshold","analog1upperlimit","analog1lowerlimit","analog1method","analog1relay","analog2offset","analog2threshold","analog2upperlimit","analog2lowerlimit","analog2method","analog2relay","analog3offset","analog3threshold","analog3upperlimit","analog3lowerlimit","analog3method","analog3relay","analog4offset","analog4threshold","analog4upperlimit","analog4lowerlimit","analog4method","analog4relay","analog5offset","analog5threshold","analog5upperlimit","analog5lowerlimit","analog5method","analog5relay","analog6offset","analog6threshold","analog6upperlimit","analog6lowerlimit","analog6method","analog6relay","analog7offset","analog7threshold","analog7upperlimit","analog7lowerlimit","analog7method","analog7relay","analog8offset","analog8threshold","analog8upperlimit","analog8lowerlimit","analog8method","analog8relay","masternumber","phonenumber1","phonenumber2","phonenumber3","phonenumber4","phonenumber5","phonenumber6","phonenumber7","phonenumber8","phonenumber9","phonenumber10"],
    "date_time_config":["ntp","ntpip","ntpport","ntptimezone","ntpupdateinterval","rtcdate","rtctime"]
   };
   var dbcolnames={
    "home_config":["mac_address","firmware_version","product_model","boot_loader"],
    "network_config":["ip_address","netMask","gateWay","dns_ip_address","network_interface","dhcp"],
    "serial_config":["rs232_baud_rate","rs232_data_bits","rs232_flow_control","rs232_c_timeout","rs485_baud_rate","rs485_data_bits","rs485_c_timeout"],
    "server_config":["ipfiltering","server_connect_wait_time","remote_ip","remote_port_no","connection_inactive_timeout","defeat_long_ack","restart_on_loss_of_link","telnet_IAC","retain_relay_status","data_backup","time_stamp","server_connectivity_timeout","server_connectivity_timeout_related_relay","relay_next_state_duration","login_user_id","login_password","SFD","DLM","packet_try","response_timeout","GSM","APN","gsm_user_id","gsm_password"],
    "slave_config":["http_post_interval","unit_id","remote_data_path","server_path","ups_query","http_method"],
    "digital_count_config":["digital1pulse","digital2pulse","digital3pulse","digital4pulse","digital5pulse","digital6pulse","digital7pulse","digital8pulse","digital9pulse","digital10pulse","digital11pulse","digital12pulse"],
    "analog":["ang1_offset","ang1_threshold","ang1_upper_limit","ang1_lower_limit","ang1_method","ang1_relay","ang2_offset","ang2_threshold","ang2_upper_limit","ang2_lower_limit","ang2_method","ang2_relay","ang3_offset","ang3_threshold","ang3_upper_limit","ang3_lower_limit","ang3_method","ang3_relay","ang4_offset","ang4_threshold","ang4_upper_limit","ang4_lower_limit","ang4_method","ang4_relay","ang5_offset","ang5_threshold","ang5_upper_limit","ang5_lower_limit","ang5_method","ang5_relay","ang6_offset","ang6_threshold","ang6_upper_limit","ang6_lower_limit","ang6_method","ang6_relay","ang7_offset","ang7_threshold","ang7_upper_limit","ang7_lower_limit","ang7_method","ang7_relay","ang8_offset","ang8_threshold","ang8_upper_limit","ang8_lower_limit","ang8_method","ang8_relay","master_phone_number","phone_number_1","phone_number_2","phone_number_3","phone_number_4","phone_number_5","phone_number_6","phone_number_7","phone_number_8","phone_number_9","phone_number_10"],
    "date_time_config":["enable_ntp","ntp_server_ip","ntp_port_no","time_zone","ntp_update_time_interval","rtc_current_date","rtc_current_time"],
    };
    var dbnames=Object.keys(dbcolnames);
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
    jsonToXml=function(res,device_id,exec){
        var xml="";
        var configarray=[];        
        console.log("started1");
        var query="";
        connection.getConnection(function(err,connection_callback){
            if(err){
                connection_callback.release();
            }
            query="Select * from config_change where device_id='"+device_id+"'";
        connection_callback.query(query,function(err,result,fields){
            
            console.log("resultcheck",result)
           if(result.length!=0)
            {
                console.log("check1");
                result=result[0];
                configarray=result;
              async.eachSeries(dbnames,function corelogic(db_name,callback){
            if(configarray[db_name]==1){  
            var query="Select * from "+db_name+" where device_id='"+device_id+"'";
            if(db_name=="digital_count_config")
                query="SELECT CONCAT(digi1_pulse_count,', ',digi1_digital_change,', ',digi1_pulse_count_number) AS digital1pulse,CONCAT(digi2_pulse_count,', ',digi2_digital_change,', ',digi2_pulse_count_number) AS digital2pulse,CONCAT(digi3_pulse_count,', ',digi3_digital_change,', ',digi3_pulse_count_number) AS digital3pulse,CONCAT(digi4_pulse_count,', ',digi4_digital_change,', ',digi4_pulse_count_number) AS digital4pulse,CONCAT(digi5_pulse_count,', ',digi5_digital_change,', ',digi5_pulse_count_number) AS digital5pulse,CONCAT(digi6_pulse_count,', ',digi6_digital_change,', ',digi6_pulse_count_number) AS digital6pulse,CONCAT(digi7_pulse_count,', ',digi7_digital_change,', ',digi7_pulse_count_number) AS digital7pulse,CONCAT(digi8_pulse_count,', ',digi8_digital_change,', ',digi8_pulse_count_number) AS digital8pulse,CONCAT(digi9_pulse_count,', ',digi9_digital_change,', ',digi9_pulse_count_number) AS digital9pulse,CONCAT(digi10_pulse_count,', ',digi10_digital_change,', ',digi10_pulse_count_number) AS digital10pulse,CONCAT(digi11_pulse_count,', ',digi11_digital_change,', ',digi11_pulse_count_number) AS digital11pulse,CONCAT(digi12_pulse_count,', ',digi12_digital_change,', ',digi12_pulse_count_number) AS digital12pulse FROM digital_count_config where device_id='"+device_id+"'";
            if(db_name=="serial_config")
                query="SELECT device_id,rs232_baud_rate,rs232_data_bits,rs232_flow_control,rs232_c_timeout,rs485_baud_rate,rs485_data_bits,rs485_c_timeout from serial_config where device_id='"+device_id+"'";
            connection_callback.query(query,function(err,result1,fields){
                result1=result1[0];
                if(db_name=="date_time_config"){
                result1.rtc_current_date=new Date(result1["rtc_current_date"]).toLocaleDateString().split("-").reverse().join("/");    
                }
                xml+=js2xmlparser.parse("config",result1);
                dbcolnames[db_name].map(function(value,i){   
                xml=xml.replace(value,datadb[db_name][i]);
                xml=xml.replace(value,datadb[db_name][i]); 
                xml=xml.replace("<?xml version='1.0'?>","");
                xml=xml.replace("<config>","");
                xml=xml.replace("</config>","");
                xml=xml.replace("<"+db_name+">","");
                xml=xml.replace("</"+db_name+">",""); 
                xml=xml.replace("<device_id>"+device_id+"</device_id>","");
                xml=xml.replace(/<\/*c232/g,'<232');
                xml=xml.replace(/<\/*c485/g,'<485');
                xml=xml.replace(/\s/g,'');
                if(i==dbcolnames[db_name].length-1) 
                    callback();
              });
            });
            }
        else{
            console.log("check7");
            callback();
        }
    },function(){
        if(xml=="")
            {
                xml="";
               // console.log("done",xml);
                console.log("check2");
                connection_callback.query("Select config_changes from config_change where device_id='"+device_id+"'",function(err,result,fields){
                    if(result.length==0){
                        console.log("check3");
                        connection_callback.query("INSERT INTO data_logger.config_change(device_id,analog,date_time_config,digital_count_config,home_config,network_config,serial_config,server_config,slave_config,ssl_config,config_changes)VALUES('"+device_id+"','0','0','0','0','0','0','0','0','0','0') ON DUPLICATE KEY UPDATE analog='0',date_time_config='0',digital_count_config='0',home_config='0',network_config='0',serial_config='0',server_config='0',slave_config='0',ssl_config='0'",function(err,result,fields){
                           exec("",res);                        
                        });
                    }
                    else{
                       // console.log("check4",xml);
                    connection_callback.query("INSERT INTO data_logger.config_change(device_id,analog,date_time_config,digital_count_config,home_config,network_config,serial_config,server_config,slave_config,ssl_config,config_changes)VALUES('"+device_id+"','0','0','0','0','0','0','0','0','0','"+result[0].config_changes+"') ON DUPLICATE KEY UPDATE analog='0',date_time_config='0',digital_count_config='0',home_config='0',network_config='0',serial_config='0',server_config='0',slave_config='0',ssl_config='0',config_changes='"+result[0].config_changes+"'",function(err,result1,fields){
                        var appenddata=""+xml;
                        exec(appenddata,res);
                });    
                }
                });
            
            }
        else{
            console.log("done",xml);
        xml="<config>"+xml+"</config>";
                              console.log("check2");
                connection_callback.query("Select config_changes from config_change where device_id='"+device_id+"'",function(err,result,fields){
                    if(result.length==0){
                        console.log("check3");
                        connection_callback.query("INSERT INTO data_logger.config_change(device_id,analog,date_time_config,digital_count_config,home_config,network_config,serial_config,server_config,slave_config,ssl_config,config_changes)VALUES('"+device_id+"','0','0','0','0','0','0','0','0','0','0') ON DUPLICATE KEY UPDATE analog='0',date_time_config='0',digital_count_config='0',home_config='0',network_config='0',serial_config='0',server_config='0',slave_config='0',ssl_config='0'",function(err,result,fields){
                           exec("&&"+xml+"&&0",res);                        
                        });
                    }
                    else{
                       // console.log("check4",xml);
                    connection_callback.query("INSERT INTO data_logger.config_change(device_id,analog,date_time_config,digital_count_config,home_config,network_config,serial_config,server_config,slave_config,ssl_config,config_changes)VALUES('"+device_id+"','0','0','0','0','0','0','0','0','0','"+result[0].config_changes+"') ON DUPLICATE KEY UPDATE analog='0',date_time_config='0',digital_count_config='0',home_config='0',network_config='0',serial_config='0',server_config='0',slave_config='0',ssl_config='0',config_changes='"+result[0].config_changes+"'",function(err,result1,fields){
                        var appenddata="&&"+xml+"&&"+result[0].config_changes;
                        exec(appenddata,res);
                });    
                }
                });
            }
                });
        }
            else{
                console.log("check5");
                exec("",res);
                connection_callback.query("Select config_changes from config_change where device_id='"+device_id+"'",function(err,result,fields){
                    if(result.length==0){
                        connection_callback.query("INSERT INTO data_logger.config_change(device_id,analog,date_time_config,digital_count_config,home_config,network_config,serial_config,server_config,slave_config,ssl_config,config_changes)VALUES('"+device_id+"','0','0','0','0','0','0','0','0','0','0') ON DUPLICATE KEY UPDATE analog='0',date_time_config='0',digital_count_config='0',home_config='0',network_config='0',serial_config='0',server_config='0',slave_config='0',ssl_config='0',config_changes='0'",function(err,result,fields){});
                    }
                    else
                    connection_callback.query("INSERT INTO data_logger.config_change(device_id,analog,date_time_config,digital_count_config,home_config,network_config,serial_config,server_config,slave_config,ssl_config,config_changes)VALUES('"+device_id+"','0','0','0','0','0','0','0','0','0','"+result[0].config_changes+"') ON DUPLICATE KEY UPDATE analog='0',date_time_config='0',digital_count_config='0',home_config='0',network_config='0',serial_config='0',server_config='0',slave_config='0',ssl_config='0',config_changes='"+result[0].config_changes+"'",function(err,result,fields){});
                });
            }
            });
            connection_callback.end();
    });
    
    }

    
    
    module.exports=jsonToXml;
    
