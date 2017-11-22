var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();
app.post('/',function(req,res){
  res.end("yes");
});
app.listen(3200,function(){
  console.log("Started on PORT 3000");
})
