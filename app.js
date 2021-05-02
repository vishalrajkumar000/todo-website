const express=require("express")
const bodyParser = require("body-parser")

const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs')

var items=[]

app.get("/",function(req,res){
  var today = new Date()
  var options={
    weekday:"long",
    day:"numeric",
    month:"long"
  }
  var day=today.toLocaleDateString("en-US",options)
  res.render("list",{today:day,newListitem:items})
})

app.post("/",function(req,res){
  items.push(req.body.task)
  res.redirect("/")
})

app.listen(process.env.PORT||3000,function(){
  console.log("Server is running");
})
