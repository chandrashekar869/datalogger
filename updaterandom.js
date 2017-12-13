var mysql=require('mysql');
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

   function getRandom(){
       return Math.floor(Math.random()*(5-0+1))+0;
   }

    var connection=createConnection();
    var query="";
    connection.connect(function(err){
    for(var i=1;i<=91;i++){
        query="update device_log_historical set gas_detector='"+getRandom()+"' where _id='"+i+"'";
            if(err) throw err;
            connection.query(query, function (err, result, fields){
            }); 
    }
});