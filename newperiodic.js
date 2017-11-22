var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendfile("index.html");
});
app.post('/',function(req,res){
  res.end("yes");
});
app.listen(3200,function(){
  console.log("Started on PORT 3000");
})
