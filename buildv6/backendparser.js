var mysql=require('mysql');
var configparser=require('./workconfigv1.js');
var fs = require('fs');
var util = require('util');
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});
try{
var log_file = fs.createWriteStream(__dirname + '/logs.txt', {flags : 'a'});
}
catch(err){
    console.log('error',err);
}
var log_stdout = process.stdout;
try{
console.log = function(a,d) { //
  log_file.write(new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString()+":"+a+d+ '\n');
  log_stdout.write(a+d + '\n');
};
}
catch(err){
    console.log('error',err);
}

var device_id="";
var address="temp address";
var ip_address="temp ip address2";
var configuration_file_location="temp config file location";
var sim_detail="temp sim detail";
var customer_name="flintoff";
var bulk_status=0;
var periodic_status=0;
//message to be parsed
var message="";
var temp_device_id;

var sfdPattern="++";
var dlmPattern="&&";
var breakdown=message.split(dlmPattern);
var tokenisedobj={};
var params=["msgid","data","time","transid"];
var params_bulk=["data","time"];
var flag=1;
i=0;
var sessid_rem;

var mysql=require('mysql');
var username="";
var password="";

const express=require('express');
const body_parser=require('body-parser');
const app=express();
var qs=require('querystring');
/*
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended:true
}));*/



app.get("/",function(req,res){
   console.log("Server running");
    res.sendFile("core.html",{root:__dirname});
});



app.post("/",function(req,res){
    console.log("Started");
    var body='';
     req.on('data', function (data) {
        // console.log("request");
             body += data;
             // Too much POST data, kill the connection!
             // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
             
             if (body.length > 1e6)
                 req.connection.destroy();
            // console.log(body);
         message=body;    
     }); 
     req.on('end', function () {
        var post = qs.parse(body);
    breakdown=message.split(dlmPattern);
      if(message.split("&&")[2]==0){
          //login message
          console.log("login_message_recieved");
          try{
          validateDevice(res);
        }
          catch(err)
          {
              console.log(err);
          }
        //  console.log("98989898&&++&&0&&0&&0000&&1000");
         //res.end("98989898&&++&&0&&0&&0000&&1000");
      }
      if(message.split("&&")[2]==1){
          console.log("Periodic message recieved");
            console.log(message);
          // var split=message.split("&&");
          //var transid=split[5];
          //console.log("transid:"+transid);
          //console.log("response=98989898&&++&&1&&0&&"+transid+"&&1001");
          //res.end("98989898&&++&&1&&0&&"+transid+"&&1001");
          try{
          get_state_updated(res,periodic_message_variable);}
          catch(err){
              console.log(err);
          }
      }    
      });
});



app.listen(3000);


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

   function getServerDate(){
    //get server date in datetime format
        var server_date=new Date();
        var month=server_date.getMonth()+1;
        month=function(){
            return month<10? "0"+month : ""+month;
        }();
        var server_datetime=server_date.getFullYear()+"-"+month+"-"+server_date.getDate()+" "+server_date.getHours()+":"+server_date.getMinutes()+":"+server_date.getSeconds();
       // console.log("Server_date"+server_datetime);
        return server_datetime;
    }

//Checks if device exists and hence the session id is verified and calls the update_device_list to generate a new random session id and update in db
function validateDevice(res){
    var loginmessage=message;
    var login_breakdown=loginmessage.split(dlmPattern);
    //params of login message
    var loginparams=["dummy_session_id","sfd","msgid","uid","pwd","devid","fw_version","Trans_Id"];
    var login_tokenised_message={};
    loginparams.map(function(param){
        login_tokenised_message[param]=login_breakdown.shift();
    });
        connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
           console.log("Connected");
        var device_id_query="Select * from devicelist where device_id='"+login_tokenised_message.devid+"' AND device_password='"+login_tokenised_message.pwd+"'";
        //console.log(device_id_query);
        connection_callback.query(device_id_query,function(err,result,fields){
            console.log("validateDevice",result.length);
            var returnreq_id=Math.floor(Math.random()*8999+1000);
            if(result.length==0){   
                res.end(login_tokenised_message.dummy_session_id+dlmPattern+login_tokenised_message.sfd+dlmPattern+login_tokenised_message.msgid+dlmPattern+1+dlmPattern+returnreq_id+dlmPattern+login_tokenised_message.Trans_Id);                    
                console.log("login response=",login_tokenised_message.dummy_session_id+dlmPattern+login_tokenised_message.sfd+dlmPattern+login_tokenised_message.msgid+dlmPattern+1+dlmPattern+returnreq_id+dlmPattern+login_tokenised_message.Trans_Id);
                console.log("sessid=",login_tokenised_message.dummy_session_id);
            }
            else{
                var sessid_new=Math.floor(Math.random()*89999999+10000000);
                sessid_rem=sessid_new;
                try{
                update_device_list(sessid_new,login_tokenised_message.devid);
                insertconfigchange(login_tokenised_message.devid);
                insertconfigdata(login_tokenised_message.devid);
            }
            catch(err)
            {
                console.log(err);
            }
                res.end(sessid_new+dlmPattern+login_tokenised_message.sfd+dlmPattern+login_tokenised_message.msgid+dlmPattern+0+dlmPattern+returnreq_id+dlmPattern+login_tokenised_message.Trans_Id);
                console.log("login response=",sessid_new+dlmPattern+login_tokenised_message.sfd+dlmPattern+login_tokenised_message.msgid+dlmPattern+0+dlmPattern+returnreq_id+dlmPattern+login_tokenised_message.Trans_Id);
                console.log("sessid=",sessid_new);    
            }
        });
    connection_callback.end();  
    }); 
}

//Function below generates new session id and updates the device session id in database table devicelist
function update_device_list(sessid_new_recieve,dev_id_recieve){
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
           console.log("Connected");
       var sess_id_query="Update devicelist set session_id='"+sessid_new_recieve+"',server_gen_reqid='0000' where device_id='"+dev_id_recieve+"'";
       //console.log(sess_id_query);
       connection_callback.query(sess_id_query,function(err,result,fields){
          console.log("devicelist updated");
       });
       connection_callback.end();
    }); 
}


//Gets the device_id from devicelist and checks control_data table from database to check if the device solenoid has been updated through front end 
function get_state_updated(res,exec){   
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
       console.log("Connected");
       var device_id_query="Select device_id,server_gen_reqid from devicelist where session_id='"+message.split(dlmPattern)[0]+"'";
      // console.log(device_id_query);
      var server_gen_reqid; 
      connection_callback.query(device_id_query,function(err,result,fields){
        if(result.length==0)
           {
               //if session id not found then sends a periodic response with status 1
            var resmessage=exec(false,"");
             // res.send(resmessage); //if mismatch in sessid no response should be provided
           } 
        else{    
        temp_device_id=result[0].device_id;
        server_gen_reqid=result[0].server_gen_reqid;
        server_gen_reqid=Number(server_gen_reqid);
        server_gen_reqid++;
        server_gen_reqid="000"+server_gen_reqid.toString();
        server_gen_reqid=server_gen_reqid.substr(server_gen_reqid.length-4,server_gen_reqid.length);
        device_id_query="Select device_state_updated,solenoid,relay_changes from control_data where device_id='"+temp_device_id+"'";
        connection_callback.query(device_id_query,function(err,result,fields){
        // console.log(device_id_query);
       //  console.log("result",result);   
         if(result.length==0)
                {
                    console.log("NO control_data entry");
                    var resmessage=exec(true,server_gen_reqid);
                    //res.end(resmessage);
                    new configparser(res,temp_device_id,function(configdata,res){
                        var finalres=resmessage+configdata;
                        res.end(finalres);
                        console.log(finalres);
                    });             
                }
            else{    
            result=result[0];
                
                if(result.device_state_updated==1){
                    var solenoidstart=message.indexOf("RS:");
                    var msolenoid=message.substring(solenoidstart,solenoidstart+11).replace("RS:","");
                    if(result.solenoid==msolenoid){
                        console.log(msolenoid+"Device sent updated value");
                        connection_callback.query("UPDATE control_data SET device_state_updated='0' WHERE device_id='"+temp_device_id+"'",function(err,result,fields){
                            var resmessage=exec(true,server_gen_reqid);
                            res.end(resmessage);
                        });              
                    }else{
                    console.log("control_data entry found value 1");
                    console.log(result.solenoid);
                    var rs_split_msg=message.split(dlmPattern);
//                    res.end(rs_split_msg[0]+dlmPattern+rs_split_msg[1]+dlmPattern+rs_split_msg[2]+"&&0&&"+rs_split_msg.pop()+"&&1001&&RS:"+result.solenoid+"&&1000");
                    new configparser(res,temp_device_id,function(configdata,res){
                        var relay_change=result.relay_changes;
                        relay_change="000"+Number(relay_change).toString().substr(relay_change.length-4,relay_change.length);
                        var finalres=rs_split_msg[0]+dlmPattern+rs_split_msg[1]+dlmPattern+rs_split_msg[2]+"&&0&&"+message.split("&&").pop()+"&&"+server_gen_reqid+"&&RS:"+result.solenoid+"&&"+relay_change+configdata;
                        res.end(finalres);
                        console.log(finalres);
                    });
                    console.log(rs_split_msg[0]+dlmPattern+rs_split_msg[1]+dlmPattern+rs_split_msg[2]+"&&0&&"+rs_split_msg.pop()+"&&"+server_gen_reqid+"&&RS:"+result.solenoid+"&&1000");
                    }// res.end(rs_split_msg[0]+dlmPattern+rs_split_msg[1]+dlmPattern+rs_split_msg[2]+"&&a1="+result.solenoid+"&&a2=999&&a3=100&&"+rs_split_msg.pop());
                    //Changes the device_state-updated once a new periodic message comes up.
                }
                else{
                    console.log("control_data entry found value 0");
                    var resmessage=exec(true,server_gen_reqid);
                    //res.end(resmessage);
                    new configparser(res,temp_device_id,function(configdata,res){
                        var finalres=resmessage+configdata;
                        res.end(finalres);
                        console.log(finalres);
                    });
                }
            }
       //Not required to handle table empty constraint as table is prepopulated 
        });
        connection_callback.query("Update devicelist set server_gen_reqid='"+server_gen_reqid+"',device_req_id='"+message.split("&&").pop()+"' where device_id='"+temp_device_id+"'",function(err,result,fields){});
        }
        });
        connection_callback.end();
    }); 
}



var periodic_message_variable=function periodic_message(flag,server_gen_reqiddata){
tokenisedobj.sessid=breakdown[0];
tokenisedobj.sfd=breakdown[1];
breakdown.shift();
breakdown.shift();
for(i=0;i<=breakdown.length;i++){
if(i===4 && flag!=false){
    getDeviceId();
}
if(i<4){
if(i===1){
// console.log("breakdown"+breakdown);
 tokenisedobj[params[i]]=parsedata(breakdown[i]);
}
else
tokenisedobj[params[i]]=breakdown[i];
}
}
//console.log(tokenisedobj);
var periodic_response;
if(flag==true){
  periodic_response=tokenisedobj.sessid+dlmPattern+tokenisedobj.sfd+dlmPattern+tokenisedobj.msgid+dlmPattern+0+"&&"+tokenisedobj.transid+"&&"+server_gen_reqiddata;
  //    periodic_response="89898989"+dlmPattern+tokenisedobj.sfd+dlmPattern+tokenisedobj.msgid+dlmPattern+0+"&&"+tokenisedobj.transid+"&&1001";
    console.log("periodic response:",periodic_response);
}
//    periodic_response=tokenisedobj.sessid+dlmPattern+tokenisedobj.sfd+dlmPattern+tokenisedobj.msgid+dlmPattern+0+"&&req_tid&&"+tokenisedobj.transid+"&&++&&ReqType&&RequestMessage&&ReqId&&++&&ReqType&&RequestMessage&&ReqId";
else if(flag==false){
     periodic_response=tokenisedobj.sessid+dlmPattern+tokenisedobj.sfd+dlmPattern+tokenisedobj.msgid+dlmPattern+0+"&&"+tokenisedobj.transid+"&&"+server_gen_reqiddata;
//    periodic_response="89898989"+dlmPattern+tokenisedobj.sfd+dlmPattern+tokenisedobj.msgid+dlmPattern+0+"&&"+tokenisedobj.transid+"&&1001";
//    periodic_response=tokenisedobj.sessid+dlmPattern+tokenisedobj.sfd+dlmPattern+tokenisedobj.msgid+dlmPattern+1+"&&req_tid&&"+tokenisedobj.transid+"&&++&&ReqType&&RequestMessage&&ReqId&&++&&ReqType&&RequestMessage&&ReqId";
console.log("periodic response:",periodic_response);}
return periodic_response;
}


function getDeviceId(){
    //no need to check session id coz we get the device id only if the sesssion id matches
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
       console.log("Connected");
       var device_id_query="Select device_id,device_password,customer_name,address,config_password,coordinates from devicelist where session_id='"+tokenisedobj.sessid+"'";
      // console.log(device_id_query);
       connection_callback.query(device_id_query,function(err,result,fields){
           if(result.length==0)
               return 1;
           else{    
           result=result[0];
               //result=result.device_id;
               device_id=temp_device_id;
               try{
               insertIntoraw_table(result.address,result.config_password,result.customer_name,result.device_password);
               Update_data_log_current(result.customer_name,result.address,result.coordinates);
               insertIntodevice_log_historical(result.customer_name,result.address,result.coordinates);
               insert_session_log();
            }
            catch(err)
            {
                console.log(err);
            }
           }
       });
       connection_callback.end();
   }); 
   }


   var bulk_message_variable=function bulk_message(flag){
    var breakdown_sm=message.split("DD");
    var header=breakdown_sm.shift().split("&&");
    var tokenisedobj_array=[];   
    var sessid=header.shift();
        var sfd=header.shift();
        var msgid=header.shift();
        var totalrecord=header.shift();
        var transid=breakdown_sm[breakdown_sm.length-1].split("&&").pop();
        breakdown_sm[breakdown_sm.length-1]=breakdown_sm[breakdown_sm.length-1].split("&&");
        breakdown_sm[breakdown_sm.length-1].pop();
        breakdown_sm[breakdown_sm.length-1]=breakdown_sm[breakdown_sm.length-1].join("&&")+"&&";
        breakdown_sm=breakdown_sm.map(function(message){
            return "DD"+message.substring(0,message.length-2);
        });
        
        tokenisedobj_array.length=totalrecord;
        for(var j=0;j<breakdown_sm.length;j++){
            var message_breakdown=breakdown_sm[j].split("&&");
            for(var k=0;k<message_breakdown.length;k++){
                if(k<2){
                    if(k===0){
                        tokenisedobj[params_bulk[k]]=parsedata(message_breakdown[k]);
                    }
                    else
                    tokenisedobj[params_bulk[k]]=message_breakdown[k];
                }
            }
            tokenisedobj_array[j]=tokenisedobj;
            tokenisedobj={};
        }   
        tokenisedobj.sessid=sessid;
        tokenisedobj.sfd=sfd;
        tokenisedobj.msgid=msgid;
        tokenisedobj.transid=transid;  
        if(flag!=false){
            try{
        getDeviceId_bulk(tokenisedobj_array,{"sessid":sessid,"sfd":sfd,"msgid":msgid,"transid":transid});
    } 
    catch(err){
        console.log(err);
    }   
    }
    if(flag==true){
    var bulk_response=tokenisedobj.sessid+"&&"+tokenisedobj.sfd+"&&"+tokenisedobj.msgid+"&&"+0+"&&req_tid&&"+tokenisedobj.transid;}
    if(flag==false){
    var bulk_response=tokenisedobj.sessid+"&&"+tokenisedobj.sfd+"&&"+tokenisedobj.msgid+"&&"+1+"&&req_tid&&"+tokenisedobj.transid;}
    
    console.log(bulk_response);
    return bulk_response;
    }


    function getDeviceId_bulk(tokenisedobj_array_copy,msg_data){
        //getDeviceId();
        //no need to check session id coz we get the device id only if the sesssion id matches
        connection.getConnection(function(err,connection_callback){
            if(err){
                connection_callback.release();
            }
           console.log("Connected");
           var device_id_query="Select device_id,device_password,customer_name,address,config_password,coordinates from devicelist where session_id='"+tokenisedobj.sessid+"'";
           console.log(device_id_query);
           connection_callback.query(device_id_query,function(err,result,fields){
               if(result.length==0)
                   return 1;
               else{    
               result=result[0];
               device_id=temp_device_id;
               console.log("result bulk",result);
                for(var j=0;j<tokenisedobj_array_copy.length;j++){
                console.log(tokenisedobj_array_copy[j]);  
                tokenisedobj=tokenisedobj_array_copy[j];
                tokenisedobj.sessid=msg_data.sessid;
                tokenisedobj.sfd=msg_data.sfd;
                tokenisedobj.msgid=msg_data.msgid;
                tokenisedobj.transid=msg_data.transid;  
            try
                {insertIntoraw_table(result.address,result.config_password,result.customer_name,result.device_password);
                Update_data_log_current(result.customer_name,result.address,result.coordinates);
                insertIntodevice_log_historical(result.customer_name,result.address,result.coordinates);
                }
                catch(err){
                    console.log(err);
                }
            }
                insert_session_log();
               }
                   //Not required to handle table empty constraint as table is prepopulated 
           });
           connection_callback.end();
       }); 
       }



//parser to parse data into appropriate fields and build a object with individual fields as key

function parsedata(data){
    var tempdataarray=data.split(",");
    var i=0;
    var tempdataobj={
        DD:{},
        AD:{},
        RS:{},
        TH:{},
        DC:{}
    };
    tempdataarray.map(function(individualdata){
        switch(i){
            case 0:individualdata=individualdata.replace("DD:","");
            tempdataobj.DD["full"]=individualdata;
            var digitCount=1;
            while(digitCount<=12){
                tempdataobj.DD["ch"+digitCount]=individualdata.charAt(digitCount-1);
                digitCount++;
            }
            break;
            case 1:var tempchannel=individualdata.replace("AD:","").split("&");
            tempdataobj.AD["full"]=individualdata;
            var chCount=0;
                    var analogParams=["Gas Leak","channel2","Tank Level","Tank Pressure","Line Pressure","Battery Level","channel 7","channel 8"];
                    tempchannel.map(function(individualAnalogChannel){
                        tempdataobj.AD[analogParams[chCount]]=individualAnalogChannel;
                        chCount++;
                    });
            break;
            case 2:individualdata=individualdata.replace("RS:","");
            tempdataobj.RS["full"]=individualdata;
            var RelayParams=["Ignore 1","Solenoid 1","Solenoid 2","Solenoid 3","Solenoid 4","Vaporizer","Ignore 2","Ignore 3"];
            var digitCount=0;
            while(digitCount<8){
                tempdataobj.RS[RelayParams[digitCount]]=individualdata.charAt(digitCount);
                digitCount++;
            } 
            break;
            case 3:individualdata=individualdata.replace("TH:","");
            tempdataobj.TH["full"]=individualdata;
            var ThreshHoldParams=["Gas Leak","Ignore 2","Ignore 3","Ignore 4","Tank Level","Ignore 6","Ignore 7","Ignore 8"];
            var digitCount=0;
            while(digitCount<8){
                tempdataobj.TH[ThreshHoldParams[digitCount]]=individualdata.charAt(digitCount);
                digitCount++;
            }
            break;
            case 4:var tempchannel=individualdata.replace("DC:","").split("&");
            tempdataobj.DC["full"]=individualdata;
            var DCParams=["Ignore 1","Ignore 2","Ignore 3","Ignore 4","Gas Meter 1","Gas Meter 2","Gas Meter 3","Gas Meter 4","Ignore 9","Ignore 10","Ignore 11","Ignore 12"];
            var chCount=0;
            tempchannel.map(function(individualAnalogChannel){
                tempdataobj.DC[DCParams[chCount]]=individualAnalogChannel;
                chCount++;
            });
            break;
        }
        i++;
    });
return tempdataobj;
}

//Inserts into raw_table
function insertIntoraw_table(locationLL,configuration_password,device_user,pwd){
var sql="INSERT INTO raw_table(device_id,device_user,pwd,analog_ch1,analog_ch2,analog_ch3,analog_ch4,analog_ch5,analog_ch6,analog_ch7,analog_ch8,digital,capture_time,state,alarm,threshold,gas_level,Relay,DC_OCH1,DC_OCH2,DC_OCH3,DC_OCH4,DC_CH1,DC_CH2,DC_CH3,DC_CH4,DC_OCH9,DC_OCH10,DC_OCH11,DC_OCH12,address,locationLL,ip_address,configuration_file_location,configuration_password,device_transaction_id,server_transaction_id) VALUES(";
sql=sql.concat("'"+temp_device_id+"',");//temp value set
sql=sql.concat("'"+device_user+"',");//temp value set
sql=sql.concat("'"+pwd+"',");//temp value set
sql=sql.concat("'"+tokenisedobj.data.AD["Gas Leak"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["channel2"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["Tank Pressure"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["Line Pressure"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["Tank Level"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["Battery Level"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["channel 7"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["channel 8"]+"',");
sql=sql.concat("'00000001',");//temp value set
var dtemp=tokenisedobj["time"].split(",");
var datetime=dtemp[0].split("/").reverse().join("-")+" "+dtemp[1];
//console.log(datetime);
sql=sql.concat("'"+datetime+"',");
sql=sql.concat("'01',");//state needs to be verified 
sql=sql.concat("'"+tokenisedobj.data.TH["Gas Leak"]+"',");
sql=sql.concat("'"+tokenisedobj.data.TH["full"]+"',");
sql=sql.concat("'"+tokenisedobj.data.TH["Tank Level"]+"',");
sql=sql.concat("'"+tokenisedobj.data.RS["full"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Ignore 1"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Ignore 2"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Ignore 3"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Ignore 4"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Gas Meter 1"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Gas Meter 2"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Gas Meter 3"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Gas Meter 4"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Ignore 9"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Ignore 10"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Ignore 11"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Ignore 12"]+"',");
sql=sql.concat("'"+address+"',");//temp value set
sql=sql.concat("'"+locationLL+"',");//temp value set
sql=sql.concat("'"+ip_address+"',");//temp value set
sql=sql.concat("'"+configuration_file_location+"',");//temp value set
sql=sql.concat("'"+configuration_password+"',");//temp value set
sql=sql.concat("'"+tokenisedobj["transid"]+"',");//temp value set
sql=sql.concat("'"+tokenisedobj["sessid"]+"')");//temp value set
//console.log(sql);
connection.getConnection(function(err,connection_callback){
    if(err){
        connection_callback.release();
    }
    console.log("Connected");
    connection_callback.query(sql,function(err,result,fields){
        if(err) throw err;
        if(result[0]==null){
            console.log("empty result");
        }
     });
connection_callback.end();
});
}


//updates device in device_log_current table
function Update_data_log_current(customer_name,locationLL,coordinates){
    var sql_device_log_current_update="INSERT INTO device_log_current(device_id,tank_pressure,line_pressure,gas_level,gas_detector,meter1,meter2,meter3,meter4,log_time,solenoid,power_level,customer_name,device_location,gas_leak,low_gas,coordinates) VALUES (";
    sql_device_log_current_update=sql_device_log_current_update.concat("'"+temp_device_id);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Tank Pressure"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Line Pressure"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Tank Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["channel2"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.DC["Gas Meter 1"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.DC["Gas Meter 2"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.DC["Gas Meter 3"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.DC["Gas Meter 4"]);
    var dtemp=tokenisedobj["time"].split(",");
    var datetime=dtemp[0].split("/").reverse().join("-")+" "+dtemp[1];
    //console.log(datetime);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+datetime);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.RS["full"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Battery Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+customer_name);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+locationLL);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.TH["Gas Leak"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.TH["Tank Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+coordinates+"')");
    sql_device_log_current_update=sql_device_log_current_update.concat(" ON DUPLICATE KEY UPDATE ");
    sql_device_log_current_update=sql_device_log_current_update.concat("device_id='"+temp_device_id);    
    sql_device_log_current_update=sql_device_log_current_update.concat("',tank_pressure='"+tokenisedobj.data.AD["Tank Pressure"]);    
    sql_device_log_current_update=sql_device_log_current_update.concat("',line_pressure='"+tokenisedobj.data.AD["Line Pressure"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',gas_level='"+tokenisedobj.data.AD["Tank Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',gas_detector='"+tokenisedobj.data.AD["channel2"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',meter1='"+tokenisedobj.data.DC["Gas Meter 1"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',meter2='"+tokenisedobj.data.DC["Gas Meter 2"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',meter3='"+tokenisedobj.data.DC["Gas Meter 3"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',meter4='"+tokenisedobj.data.DC["Gas Meter 4"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',log_time='"+datetime);
    sql_device_log_current_update=sql_device_log_current_update.concat("',solenoid='"+tokenisedobj.data.RS["full"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',power_level='"+tokenisedobj.data.AD["Battery Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',customer_name='"+customer_name);
    sql_device_log_current_update=sql_device_log_current_update.concat("',device_location='"+locationLL);
    sql_device_log_current_update=sql_device_log_current_update.concat("',gas_leak='"+tokenisedobj.data.TH["Gas Leak"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',low_gas='"+tokenisedobj.data.TH["Tank Level"]+"',coordinates='"+coordinates+"'");
    //console.log(sql_device_log_current_update);
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
        console.log("Connected");
        connection_callback.query(sql_device_log_current_update,function(err,result,fields){
            if(err) throw err;
      //     console.log(result);
         });
         connection_callback.end();
    });
}


//To insert into table device_log_historical
function insertIntodevice_log_historical(customer_name,locationLL,coordinates){
    var sql_device_log_historical="INSERT INTO device_log_historical(device_id,tank_pressure,line_pressure,gas_level,gas_detector,meter1,meter2,meter3,meter4,log_time,solenoid,power_level,customer_name,device_location,gas_leak,low_gas,coordinates) VALUES (";
    sql_device_log_historical=sql_device_log_historical.concat("'"+temp_device_id);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.AD["Tank Pressure"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.AD["Line Pressure"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.AD["Tank Level"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.AD["channel2"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.DC["Gas Meter 1"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.DC["Gas Meter 2"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.DC["Gas Meter 3"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.DC["Gas Meter 4"]);
    var dtemp=tokenisedobj["time"].split(",");
    var datetime=dtemp[0].split("/").reverse().join("-")+" "+dtemp[1];
    //console.log(datetime);
    sql_device_log_historical=sql_device_log_historical.concat("','"+datetime);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.RS["full"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.AD["Battery Level"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+customer_name);
    sql_device_log_historical=sql_device_log_historical.concat("','"+locationLL);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.TH["Gas Leak"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+tokenisedobj.data.TH["Tank Level"]);
    sql_device_log_historical=sql_device_log_historical.concat("','"+coordinates+"')");
//console.log(sql_device_log_historical);
connection.getConnection(function(err,connection_callback){
    if(err){
        connection_callback.release();
    }
    console.log("Connected");
    connection_callback.query(sql_device_log_historical,function(err,result,fields){
        if(err) throw err;
        //console.log(result);
     });
     connection_callback.end();
});
}

//insert raw message into session_log
function insert_session_log(){
  var sql_session_log="INSERT INTO session_log(device_id,log_time,data) VALUES (";
    var sql_session_log=sql_session_log.concat("'"+temp_device_id+"',");
    var sql_session_log=sql_session_log.concat("'"+getServerDate()+"',");
    var sql_session_log=sql_session_log.concat("'"+message+"')");
    //console.log(sql_session_log);
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
        console.log("Connected");
        connection_callback.query(sql_session_log,function(err,result,fields){
            if(err) {throw err};
            console.log("Error in Inserting data");
           // console.log(result);
            return 0;
            
         });
         connection_callback.end();
        });
}
function insertconfigchange(logindevid){
    connection.getConnection(function(err,connection_callback){
    if(err)
    connection_callback.release;
    connection_callback.query("INSERT INTO config_change(device_id,config_changes) VALUES('"+logindevid+"','0') ON DUPLICATE KEY UPDATE analog='0',date_time_config='0',digital_count_config='0',home_config='0',network_config='0',serial_config='0',server_config='0',slave_config='0',ssl_config='0'",function(err,result,fields){
        console.log("configchanges updated");
    });    
connection_callback.end();
});
}
function insertconfigdata(logindevid){
    var messageconfig=message.split(dlmPattern);
    var temp_config=[];
    temp_config.unshift(messageconfig.pop());
    temp_config.unshift(messageconfig.pop());
    messageconfig.push(temp_config.join("&&"));
    var parser=require('./xmlparser.js');
    var datadb={
        "home_config":["mac","fw-version","prodectmodel","bootloader"],
        "network_config":["ip","netmask","gateway","dnsip","networkinterface","dhcp"],
        "serial_config":["232baudrate","232dataparameter","232parity","232stopbits","232flowcontrol","232charwaittime","485baudrate","485dataparameter","485parity","485stopbits","485charwaittime"],
        "server_config":["ipfilter","serverconnecttime","remoteip","remoteport","serverpath","connectioninactivetime","defeatlongack","restartlosslink","telnetIAC","retainrelaystatus","databackup","timestamp","serverconnectivitytimeout","serverconnectivityrelay","relayinitialstate","relaynextduration","loginuser","loginpassword","SFD","DLM","packettry","responsetimeout","gsm","gsmapn","gsmuserid","gsmpassword"],
        "slave_config":["postinterval","unitid","remotedatapath","upsquery","httpmethod"],
        "digital_count_config":["digital1pulse","digital2pulse","digital3pulse","digital4pulse","digital5pulse","digital6pulse","digital7pulse","digital8pulse"],
        "analog":["analog1offset","analog1threshold","analog1upperlimit","analog1lowerlimit","analog1method","analog1relay","analog2offset","analog2threshold","analog2upperlimit","analog2lowerlimit","analog2method","analog2relay","analog3offset","analog3threshold","analog3upperlimit","analog3lowerlimit","analog3method","analog3relay","analog4offset","analog4threshold","analog4upperlimit","analog4lowerlimit","analog4method","analog4relay","analog5offset","analog5threshold","analog5upperlimit","analog5lowerlimit","analog5method","analog5relay","analog6offset","analog6threshold","analog6upperlimit","analog6lowerlimit","analog6method","analog6relay","analog7offset","analog7threshold","analog7upperlimit","analog7lowerlimit","analog7method","analog7relay","analog8offset","analog8threshold","analog8upperlimit","analog8lowerlimit","analog8method","analog8relay","masternumber","phonenumber1","phonenumber2","phonenumber3","phonenumber4","phonenumber5","phonenumber6","phonenumber7","phonenumber8","phonenumber9","phonenumber10"],
        "date_time_config":["ntp","ntpip","ntpport","ntptimezone","ntpupdateinterval","rtcdate","rtctime"]
    };
    var dbcolnames={
        "home_config":["mac_address","firmware_version","product_model","boot_loader"],
        "network_config":["ip_address","netMask","gateWay","dns_ip_address","network_interface","dhcp"],
        "serial_config":["rs232_baud_rate","rs232_data_bits","rs232_parity","rs232_stop_bits","rs232_flow_control","rs232_c_timeout","rs485_baud_rate","rs485_data_bits","rs485_parity","rs485_stop_bits","rs485_c_timeout"],
        "server_config":["ipfiltering","server_connect_wait_time","remote_ip","remote_port_no","server_path","connection_inactive_timeout","defeat_long_ack","restart_on_loss_of_link","telnet_IAC","retain_relay_status","data_backup","time_stamp","server_connectivity_timeout","server_connectivity_timeout_related_relay","Relay_initial_state","relay_next_state_duration","login_user_id","login_password","SFD","DLM","packet_try","response_timeout","GSM","APN","gsm_user_id","gsm_password"],
        "slave_config":["http_post_interval","unit_id","remote_data_path","ups_query","http_method"],
        "digital_count_config":["digi1_pulse_count","digi1_digital_change","digi1_pulse_count_number","digi1_set_pulse_count","digi2_pulse_count","digi2_digital_change","digi2_pulse_count_number","digi2_set_pulse_count","digi3_pulse_count","digi3_digital_change","digi3_pulse_count_number","digi3_set_pulse_count","digi4_pulse_count","digi4_digital_change","digi4_pulse_count_number","digi4_set_pulse_count","digi5_pulse_count","digi5_digital_change","digi5_pulse_count_number","digi5_set_pulse_count","digi6_pulse_count","digi6_digital_change","digi6_pulse_count_number","digi6_set_pulse_count","digi7_pulse_count","digi7_digital_change","digi7_pulse_count_number","digi7_set_pulse_count","digi8_pulse_count","digi8_digital_change","digi8_pulse_count_number","digi8_set_pulse_count"],
        "analog":["ang1_offset","ang1_threshold","ang1_upper_limit","ang1_lower_limit","ang1_method","ang1_relay","ang2_offset","ang2_threshold","ang2_upper_limit","ang2_lower_limit","ang2_method","ang2_relay","ang3_offset","ang3_threshold","ang3_upper_limit","ang3_lower_limit","ang3_method","ang3_relay","ang4_offset","ang4_threshold","ang4_upper_limit","ang4_lower_limit","ang4_method","ang4_relay","ang5_offset","ang5_threshold","ang5_upper_limit","ang5_lower_limit","ang5_method","ang5_relay","ang6_offset","ang6_threshold","ang6_upper_limit","ang6_lower_limit","ang6_method","ang6_relay","ang7_offset","ang7_threshold","ang7_upper_limit","ang7_lower_limit","ang7_method","ang7_relay","ang8_offset","ang8_threshold","ang8_upper_limit","ang8_lower_limit","ang8_method","ang8_relay","master_phone_number","phone_number_1","phone_number_2","phone_number_3","phone_number_4","phone_number_5","phone_number_6","phone_number_7","phone_number_8","phone_number_9","phone_number_10"],
        "date_time_config":["enable_ntp","ntp_server_ip","ntp_port_no","time_zone","ntp_update_time_interval","rtc_current_date","rtc_current_time"],
    };
    var datadbnames=["home_config","network_config","serial_config","server_config","slave_config","analog","date_time_config","digital_count_config"];
    var queries=["INSERT INTO home_config (device_id,mac_address,firmware_version,product_model,boot_loader) VALUES('"+logindevid+"',","INSERT INTO data_logger.network_config(device_id,ip_address,netMask,gateWay,dns_ip_address,network_interface,dhcp) VALUES('"+logindevid+"',","INSERT INTO serial_config(device_id,rs232_baud_rate,rs232_data_bits,rs232_parity,rs232_stop_bits,rs232_flow_control,rs232_c_timeout,rs485_baud_rate,rs485_data_bits,rs485_parity,rs485_stop_bits,rs485_c_timeout)VALUES('"+logindevid+"',","INSERT INTO data_logger.server_config(device_id,ipfiltering,server_connect_wait_time,remote_ip,remote_port_no,server_path,connection_inactive_timeout,defeat_long_ack,restart_on_loss_of_link,telnet_IAC,retain_relay_status,data_backup,time_stamp,server_connectivity_timeout,server_connectivity_timeout_related_relay,Relay_initial_state,relay_next_state_duration,login_user_id,login_password,SFD,DLM,packet_try,response_timeout,GSM,APN,gsm_user_id,gsm_password)VALUES('"+logindevid+"',","INSERT INTO data_logger.slave_config(device_id,http_post_interval,unit_id,remote_data_path,ups_query,http_method)VALUES('"+logindevid+"',","INSERT INTO data_logger.analog(device_id,ang1_offset,ang1_threshold,ang1_upper_limit,ang1_lower_limit,ang1_method,ang1_relay,ang2_offset,ang2_threshold,ang2_upper_limit,ang2_lower_limit,ang2_method,ang2_relay,ang3_offset,ang3_threshold,ang3_upper_limit,ang3_lower_limit,ang3_method,ang3_relay,ang4_offset,ang4_threshold,ang4_upper_limit,ang4_lower_limit,ang4_method,ang4_relay,ang5_offset,ang5_threshold,ang5_upper_limit,ang5_lower_limit,ang5_method,ang5_relay,ang6_offset,ang6_threshold,ang6_upper_limit,ang6_lower_limit,ang6_method,ang6_relay,ang7_offset,ang7_threshold,ang7_upper_limit,ang7_lower_limit,ang7_method,ang7_relay,ang8_offset,ang8_threshold,ang8_upper_limit,ang8_lower_limit,ang8_method,ang8_relay,master_phone_number,phone_number_1,phone_number_2,phone_number_3,phone_number_4,phone_number_5,phone_number_6,phone_number_7,phone_number_8,phone_number_9,phone_number_10)VALUES('"+logindevid+"',","INSERT INTO data_logger.date_time_config(device_id,enable_ntp,ntp_server_ip,ntp_port_no,time_zone,ntp_update_time_interval,rtc_current_date,rtc_current_time)VALUES('"+logindevid+"',","INSERT INTO data_logger.digital_count_config(device_id,digi1_pulse_count,digi1_digital_change,digi1_pulse_count_number,digi1_set_pulse_count,digi2_pulse_count,digi2_digital_change,digi2_pulse_count_number,digi2_set_pulse_count,digi3_pulse_count,digi3_digital_change,digi3_pulse_count_number,digi3_set_pulse_count,digi4_pulse_count,digi4_digital_change,digi4_pulse_count_number,digi4_set_pulse_count,digi5_pulse_count,digi5_digital_change,digi5_pulse_count_number,digi5_set_pulse_count,digi6_pulse_count,digi6_digital_change,digi6_pulse_count_number,digi6_set_pulse_count,digi7_pulse_count,digi7_digital_change,digi7_pulse_count_number,digi7_set_pulse_count,digi8_pulse_count,digi8_digital_change,digi8_pulse_count_number,digi8_set_pulse_count) VALUES ('"+logindevid+"',"];
    try{
    var result=new parser(messageconfig[messageconfig.length-1]);
    }
    catch(err){
        console.log(err);
    }
    result["232stopbits"]=["0"];
    result["485stopbits"]=["0"];
    result["232parity"]=["NONE"];
    result["485parity"]=["NONE"];
    result["relayinitialstate"]=["OFF"];
    result["rtcdate"][0]=result["rtcdate"][0].split("/").reverse().join("-");
    connection.getConnection(function(err,connection_callback){
        if(err){
            connection_callback.release();
        }
    datadbnames.map(function(valueouter,j){
        datadb[valueouter].map(function(value,i){
            if(i!=datadb[valueouter].length-1 && j!=datadbnames.length-1){
                queries[j]=queries[j].concat("'"+result[value][0]+"',");
        }
            if(i==datadb[valueouter].length-1 && j!=datadbnames.length-1){
                queries[j]=queries[j].concat("'"+result[value][0]+"') ON DUPLICATE KEY UPDATE ");
                datadb[valueouter].map(function(valuedup,k){
                    queries[j]=queries[j].concat(dbcolnames[valueouter][k]+"='"+result[valuedup][0]+"'");
                    if(k!=datadb[valueouter].length-1)
                        queries[j]=queries[j].concat(",");
                });
                
        }
            if(i!=datadb[valueouter].length-1 && j==datadbnames.length-1){
                var tempdigcount=result[value][0].split(",");
                queries[j]=queries[j].concat("'"+tempdigcount[0]+"',");
                queries[j]=queries[j].concat("'"+tempdigcount[1]+"',");
                queries[j]=queries[j].concat("'"+tempdigcount[2]+"',");        
                queries[j]=queries[j].concat("'"+tempdigcount[3]+"',");
            }
            if(i==datadb[valueouter].length-1 && j==datadbnames.length-1){
                var tempdigcount=result[value][0].split(",");
                queries[j]=queries[j].concat("'"+tempdigcount[0]+"',");
                queries[j]=queries[j].concat("'"+tempdigcount[1]+"',");
                queries[j]=queries[j].concat("'"+tempdigcount[2]+"',");
                queries[j]=queries[j].concat("'"+tempdigcount[3]+"') ON DUPLICATE KEY UPDATE ");
                var i=0;
                datadb[valueouter].map(function(valuedup,k){
                    tempdigcount=result[valuedup][0].split(",");
                    queries[j]=queries[j].concat(dbcolnames[valueouter][i]+"='"+tempdigcount[0]+"',");
                    queries[j]=queries[j].concat(dbcolnames[valueouter][i+1]+"='"+tempdigcount[1]+"',");    
                    queries[j]=queries[j].concat(dbcolnames[valueouter][i+2]+"='"+tempdigcount[2]+"',");    
                    queries[j]=queries[j].concat(dbcolnames[valueouter][i+3]+"='"+tempdigcount[3]+"'");
                    i+=4;
                    if(k!=datadb[valueouter].length-1)
                        queries[j]=queries[j].concat(",");
                });
        }  
        });
      console.log(valueouter+":\n"+queries[j]+"\n");
        connection_callback.query(queries[j], function (err, result, fields){});    
    });
    connection_callback.end();
    });
    }
