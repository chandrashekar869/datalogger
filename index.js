var mysql=require('mysql');
var device_id="";
var device_user="temp user name2";
var pwd="temp password2";
var address="temp address2";
var locationLL="temp Location";
var ip_address="temp ip address2";
var configuration_file_location="temp config file location";
var configuration_password="temp config password";
var sim_detail="temp sim detail";
var customer_name="flintoff";
var bulk_status=0;
var periodic_status=0;
//message to be parsed
var message="";

var sfdPattern="++";
var dlmPattern="&&";
var breakdown=message.split(dlmPattern);
var tokenisedobj={};
var params=["msgid","data","time","transid"];
var params_bulk=["data","time"];
i=0;


var mysql=require('mysql');
var username="";
var password="";

const express=require('express');
const body_parser=require('body-parser');
const app=express();
app.use(body_parser.urlencoded({
    extended:true
}));

app.get("/",function(req,res){
    console.log("Server running");
    res.sendFile("core.html",{root:__dirname});
 }); 
app.post("/medlynkdevicelistener",function(req,res){
    console.log("req",req.body.message);
    
    if(message.split("&&")[2]==0){
        //login message
        console.log("Login message");
        res.send("98989898&&++&&0&&0&&0000&&1000");
    }
    if(message.split("&&")[2]==1){
    res.send("98989898&&++&&1&&0&&0001&&1001&&++&&2&&relay1=1&&0001&&++&&2&&relay2=1&&0001&&++&&2&&config=/server/path&&0001");
    console.log("Periodic message");
    }
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

function get_state_updated(res,exec){   
    connection=createConnection();
    connection.connect(function(err){
       if(err) throw err;
       console.log("Connected");
       var device_id_query="Select device_id from user_device_list where session_id='"+message.split("&&")[0]+"'";
       console.log(device_id_query);
       var temp_device_id;
       connection.query(device_id_query,function(err,result,fields){
        if(result.length==0)
            return " ";
        else{    
        temp_device_id=result[0].device_id;
        device_id_query="Select device_state_updated,solenoid from control_data where device_id='"+temp_device_id+"'";
        connection.query(device_id_query,function(err,result,fields){
         console.log(device_id_query);
         console.log("result",result);   
         if(result.length==0)
                {
                    var resmessage=exec(res);
                    res.send(resmessage);
           
                }
            else{    
            result=result[0];
                
                if(result.device_state_updated==1){
                    console.log(result.solenoid);
                    var rs_split_msg=message.split("&&");
                    res.send("<br /><br /><br /><br /><h2 align='center'>DATA LOGGER TEST PAGE</h2><br /><br /><br /><br /><h3 align='center'>Message:Device Data Logged successfully</h3><h4 align='center'>Response:"+rs_split_msg[0]+"&&"+rs_split_msg[1]+"&&"+rs_split_msg[2]+"&&a1="+result.solenoid+"&&a2=999&&a3=100&&"+rs_split_msg.pop()+"</h4>");
                }
                else{
                    var resmessage=exec();
                    res.send("<br /><br /><br /><br /><h2 align='center'>DATA LOGGER TEST PAGE</h2><br /><br /><br /><br /><h3 align='center'>Message:Device Data Logged successfully</h3><h4 align='center'>Response:"+resmessage+"</h4>");
                }
            }
                //Not required to handle table empty constraint as table is prepopulated 
        });
    
        }
        });
    }); 
    }


function validateDevice(res){
    var loginmessage=message;
    var login_breakdown=loginmessage.split("&&");
    var loginparams=["dummy_session_id","sfd","msgid","uid","pwd","devid","fw_version","Trans_Id"];
    var login_tokenised_message={};
    loginparams.map(function(param){
        login_tokenised_message[param]=login_breakdown.shift();
    });
    var connection=createConnection();
    connection.connect(function(err){
        if(err) throw err;
        console.log("Connected");
        var device_id_query="Select * from user_device_list where device_id='"+login_tokenised_message.devid+"' AND device_password='"+login_tokenised_message.pwd+"'";
        console.log(device_id_query);
        connection.query(device_id_query,function(err,result,fields){
            if(result.length==0){
                res.send("<br /><br /><br /><br /><h2 align='center'>DATA LOGGER TEST PAGE</h2><br /><br /><br /><br /><h2 align='center'>Message:Authentication Failed</h2>"+"<br /><br /><h3 align='center'>Response:"+login_tokenised_message.dummy_session_id+"&&"+login_tokenised_message.sfd+"&&"+login_tokenised_message.msgid+"&&"+1+"&&req_id&&"+login_tokenised_message.Trans_Id+"</h3>");                    
            }
            else{
                    var sessid_new=Math.floor(Math.random()*89999999+10000000);
                    update_user_device_list(sessid_new,login_tokenised_message.devid);
                    res.send("<br /><br /><br /><br /><h2 align='center'>DATA LOGGER TEST PAGE</h2><br /><br /><br /><br /><h2 align='center'>Message:Authentication Successfull</h2>"+"<br /><br /><h3 align='center'>Response:"+sessid_new+"&&"+login_tokenised_message.sfd+"&&"+login_tokenised_message.msgid+"&&"+0+"&&req_id&&"+login_tokenised_message.Trans_Id+"</h3>");    
                    
                }
        });
    }); 
    }



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

function getDeviceId(){
 //getDeviceId();
 //no need to check session id coz we get the device id only if the sesssion id matches
 connection=createConnection();
 connection.connect(function(err){
    if(err) throw err;
    console.log("Connected");
    var device_id_query="Select device_id from user_device_list where session_id='"+tokenisedobj.sessid+"'";
    console.log(device_id_query);
    connection.query(device_id_query,function(err,result,fields){
        if(result.length==0)
            return 1;
        else{    
        result=result[0];
            result=result.device_id;
            device_id=result;
            insertIntoraw_table();
            Update_data_log_current();
            insertIntodevice_log_historical();
            var periodic_response;
            //if(
                insert_session_log()
              //  ==0)
              //  periodic_response=tokenisedobj.sessid+"&&"+tokenisedobj.sfd+"&&"+tokenisedobj.msgid+"&&"+0+"&&req_tid&&"+tokenisedobj.transid+"&&++&&ReqType&&RequestMessage&&ReqId&&++&&ReqType&&RequestMessage&&ReqId";
                //else
                  //  periodic_response=tokenisedobj.sessid+"&&"+tokenisedobj.sfd+"&&"+tokenisedobj.msgid+"&&"+1+"&&req_tid&&"+tokenisedobj.transid+"&&++&&ReqType&&RequestMessage&&ReqId&&++&&ReqType&&RequestMessage&&ReqId";
        }
            //Not required to handle table empty constraint as table is prepopulated 
    });
}); 
}


function getDeviceId_bulk(){
    //getDeviceId();
    //no need to check session id coz we get the device id only if the sesssion id matches
    connection=createConnection();
    connection.connect(function(err){
       if(err) throw err;
       console.log("Connected");
       var device_id_query="Select device_id from user_device_list where session_id='"+tokenisedobj.sessid+"'";
       console.log(device_id_query);
       connection.query(device_id_query,function(err,result,fields){
           if(result.length==0)
               return " ";
           else{    
           result=result[0];
               result=result.device_id;
               device_id=result;
               insert_session_log();
           return result;
           }
               //Not required to handle table empty constraint as table is prepopulated 
       });
   }); 
   }




var bulk_message_variable=function bulk_message(){
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
        getDeviceId_bulk();
        for(var j=0;j<tokenisedobj_array.length;j++){
            console.log(tokenisedobj_array[j]);  
            tokenisedobj=tokenisedobj_array[j];
            tokenisedobj.sessid=sessid;
            tokenisedobj.sfd=sfd;
            tokenisedobj.msgid=msgid;
            tokenisedobj.transid=transid;  
            insertIntoraw_table();
            Update_data_log_current();
            insertIntodevice_log_historical();
        }
  
       // bulk_status=insert_session_log();
    //if(
      //  insert_session_log()==0
    //)
    var bulk_response=tokenisedobj.sessid+"&&"+tokenisedobj.sfd+"&&"+tokenisedobj.msgid+"&&"+0+"&&req_tid&&"+tokenisedobj.transid;
    //else
    //var bulk_response=tokenisedobj.sessid+"&&"+tokenisedobj.sfd+"&&"+tokenisedobj.msgid+"&&"+1+"&&req_tid&&"+tokenisedobj.transid;
    
    console.log(bulk_response);
    return bulk_response;
    }


    var periodic_message_variable=function periodic_message(){
    if(!tokenisedobj.sfd){
tokenisedobj.sessid=breakdown[0];
tokenisedobj.sfd=breakdown[1];
breakdown.shift();
breakdown.shift();
}
breakdown.map(function(temp){
    if(i<4){
        if(i===1){
            tokenisedobj[params[i]]=parsedata(temp);
        }
        else
        tokenisedobj[params[i]]=temp;
    }
    i++;
});
console.log(tokenisedobj);
getDeviceId();
var periodic_response;
periodic_response=periodic_response=tokenisedobj.sessid+"&&"+tokenisedobj.sfd+"&&"+tokenisedobj.msgid+"&&"+0+"&&req_tid&&"+tokenisedobj.transid+"&&++&&ReqType&&RequestMessage&&ReqId&&++&&ReqType&&RequestMessage&&ReqId";

//periodic_status=insert_session_log();
//if(status==false){

console.log(periodic_response);
return periodic_response;
/*}

if(status==true){
    periodic_response=tokenisedobj.sessid+"&&"+tokenisedobj.sfd+"&&"+tokenisedobj.msgid+"&&"+1+"&&req_tid&&"+tokenisedobj.transid+"&&++&&ReqType&&RequestMessage&&ReqId&&++&&ReqType&&RequestMessage&&ReqId";
    console.log(periodic_response);
    res.send("<h1>Successfull</h1><br /><h2> Response </h2><br /> <h3>"+periodic_response+"</h3>");
}*/
}


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
                    var analogParams=["Gas Leak","channel 2","Tank Pressure","Line Pressure","Tank Level","Battery Level","channel 7","channel 8"];
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

function update_user_device_list(sessid_new_recieve,dev_id_recieve){
    connection=createConnection();
    connection.connect(function(err){
       if(err) throw err;
       console.log("Connected");
       var sess_id_query="Update user_device_list set session_id='"+sessid_new_recieve+"' where device_id='"+dev_id_recieve+"'";
       console.log(sess_id_query);
       connection.query(sess_id_query,function(err,result,fields){
          console.log("user_device_list updated");
       });
   }); 
}


function insertIntoraw_table(){
    connection=createConnection();
var sql="INSERT INTO raw_table(device_id,device_user,pwd,analog_ch1,analog_ch2,analog_ch3,analog_ch4,analog_ch5,analog_ch6,analog_ch7,analog_ch8,digital,capture_time,state,alarm,threshold,gas_level,Relay,DC_CH1,DC_CH2,DC_CH3,DC_CH4,address,locationLL,ip_address,configuration_file_location,configuration_password,device_transaction_id,server_transaction_id) VALUES(";
sql=sql.concat("'"+device_id+"',");//temp value set
sql=sql.concat("'"+device_user+"',");//temp value set
sql=sql.concat("'"+pwd+"',");//temp value set
sql=sql.concat("'"+tokenisedobj.data.AD["Gas Leak"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["channel 2"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["Tank Pressure"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["Line Pressure"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["Tank Level"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["Battery Level"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["channel 7"]+"',");
sql=sql.concat("'"+tokenisedobj.data.AD["channel 8"]+"',");
sql=sql.concat("'00000001',");//temp value set
var dtemp=tokenisedobj["time"].split(",");
var datetime=dtemp[0].split("/").reverse().join("-")+" "+dtemp[1];
console.log(datetime);
sql=sql.concat("'"+datetime+"',");
sql=sql.concat("'01',");//state needs to be verified 
sql=sql.concat("'"+tokenisedobj.data.TH["Gas Leak"]+"',");
sql=sql.concat("'"+tokenisedobj.data.TH["full"]+"',");
sql=sql.concat("'"+tokenisedobj.data.TH["Tank Level"]+"',");
sql=sql.concat("'"+tokenisedobj.data.RS["full"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Gas Meter 1"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Gas Meter 2"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Gas Meter 3"]+"',");
sql=sql.concat("'"+tokenisedobj.data.DC["Gas Meter 4"]+"',");
sql=sql.concat("'"+address+"',");//temp value set
sql=sql.concat("'"+locationLL+"',");//temp value set
sql=sql.concat("'"+ip_address+"',");//temp value set
sql=sql.concat("'"+configuration_file_location+"',");//temp value set
sql=sql.concat("'"+configuration_password+"',");//temp value set
sql=sql.concat("'"+tokenisedobj["transid"]+"',");//temp value set
sql=sql.concat("'"+tokenisedobj["sessid"]+"')");//temp value set
console.log(sql);
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected");
    connection.query(sql,function(err,result,fields){
        if(err) throw err;
        if(result[0]==null){
            console.log("empty result");
        }
     });
});}

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



//To insert into table device_log_historical
function insertIntodevice_log_historical(){
    connection=createConnection();
var sql_device_log_historical="INSERT INTO device_log_historical(device_id,tank_pressure,line_pressure,gas_level,gas_detector,meter1,meter2,meter3,meter4,log_time,solenoid,sim_detail,ip_address,power_level) VALUES(";
sql_device_log_historical=sql_device_log_historical.concat("'"+device_id+"',");//temp value set
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.AD["Tank Pressure"]+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.AD["Line Pressure"]+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.AD["Tank Level"]+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.AD["Gas Leak"]+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.DC["Gas Meter 1"]+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.DC["Gas Meter 2"]+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.DC["Gas Meter 3"]+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.DC["Gas Meter 4"]+"',");
var dtemp=tokenisedobj["time"].split(",");
var datetime=dtemp[0].split("/").reverse().join("-")+" "+dtemp[1];
console.log(datetime);
sql_device_log_historical=sql_device_log_historical.concat("'"+datetime+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+((""+tokenisedobj.data.RS["full"]).substring(1,6))+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+sim_detail+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+ip_address+"',");
sql_device_log_historical=sql_device_log_historical.concat("'"+tokenisedobj.data.AD["Battery Level"]+"')");
console.log(sql_device_log_historical);
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected");
    connection.query(sql_device_log_historical,function(err,result,fields){
        if(err) throw err;
        console.log("Error in Inserting data");
        console.log(result);
     });
});
}



function Update_data_log_current(){
    connection=createConnection();
    var sql_device_log_current_update="INSERT INTO device_log_current(device_id,tank_pressure,line_pressure,gas_level,gas_detector,meter1,meter2,meter3,meter4,log_time,solenoid,power_level,customer_name,device_location) VALUES (";
    sql_device_log_current_update=sql_device_log_current_update.concat("'"+device_id);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Tank Pressure"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Line Pressure"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Tank Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Gas Leak"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.DC["Gas Meter 1"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.DC["Gas Meter 2"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.DC["Gas Meter 3"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.DC["Gas Meter 4"]);
    var dtemp=tokenisedobj["time"].split(",");
    var datetime=dtemp[0].split("/").reverse().join("-")+" "+dtemp[1];
    console.log(datetime);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+datetime);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+((""+tokenisedobj.data.RS["full"]).substring(1,6)));
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+tokenisedobj.data.AD["Battery Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+customer_name);
    sql_device_log_current_update=sql_device_log_current_update.concat("','"+locationLL+"')");
    sql_device_log_current_update=sql_device_log_current_update.concat(" ON DUPLICATE KEY UPDATE ");
    sql_device_log_current_update=sql_device_log_current_update.concat("device_id='"+device_id);    
    sql_device_log_current_update=sql_device_log_current_update.concat("',tank_pressure='"+tokenisedobj.data.AD["Tank Pressure"]);    
    sql_device_log_current_update=sql_device_log_current_update.concat("',line_pressure='"+tokenisedobj.data.AD["Line Pressure"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',gas_level='"+tokenisedobj.data.AD["Tank Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',gas_detector='"+tokenisedobj.data.AD["Gas Leak"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',meter1='"+tokenisedobj.data.DC["Gas Meter 1"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',meter2='"+tokenisedobj.data.DC["Gas Meter 2"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',meter3='"+tokenisedobj.data.DC["Gas Meter 3"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',meter4='"+tokenisedobj.data.DC["Gas Meter 4"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',log_time='"+datetime);
    sql_device_log_current_update=sql_device_log_current_update.concat("',solenoid='"+((""+tokenisedobj.data.RS["full"]).substring(1,6)));
    sql_device_log_current_update=sql_device_log_current_update.concat("',power_level='"+tokenisedobj.data.AD["Battery Level"]);
    sql_device_log_current_update=sql_device_log_current_update.concat("',customer_name='"+customer_name);
    sql_device_log_current_update=sql_device_log_current_update.concat("',device_location='"+locationLL+"'");
    console.log(sql_device_log_current_update);
    connection.connect(function(err){
        if(err) throw err;
        console.log("Connected");
        connection.query(sql_device_log_current_update,function(err,result,fields){
            if(err) throw err;
            console.log(result);
         });
    });
}

function insert_session_log(){
    connection=createConnection();
    var sql_session_log="INSERT INTO session_log(device_id,log_time,data) VALUES (";
    var sql_session_log=sql_session_log.concat("'"+device_id+"',");
    var sql_session_log=sql_session_log.concat("'"+getServerDate()+"',");
    var sql_session_log=sql_session_log.concat("'"+message+"')");
    console.log(sql_session_log);
    connection.connect(function(err){
        if(err){ throw err};
        console.log("Connected");
        connection.query(sql_session_log,function(err,result,fields){
            if(err) {throw err};
            console.log("Error in Inserting data");
            console.log(result);
            return 0;
            
         });
    });
}
