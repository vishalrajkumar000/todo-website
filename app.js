const express=require("express")
const bodyParser = require("body-parser")
const date=require(__dirname+"/date.js")


const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set('view engine','ejs')

let items=["Wash Clothes","Study"]
let work=[]
app.get("/",function(req,res){
  let day=date()
  res.render("list",{listTitle:day,newListitems:items})
})

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work",newListitems:work})
})

app.post("/",function(req,res){
  if(req.body.button==="Work"){
    work.push(req.body.newItem)
    res.redirect("/work")
  }else{
    items.push(req.body.newItem)
    res.redirect("/")
  }


})

app.listen(process.env.PORT||3000,function(){
  console.log("Server is running");
})
