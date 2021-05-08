const express=require("express")
const bodyParser = require("body-parser")
const date=require(__dirname+"/date.js")
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true, useCreateIndex: true})

const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set('view engine','ejs')

const itemSchema={
  name:String
}

const Item = mongoose.model("Item",itemSchema)

const item1= new Item({
  name:"Welcome to ToDo List!"
})

const item2= new Item({
  name:"To add new task press + button"
})

const item3= new Item({
  name:"<-- press this to delete this task"
})

const defaultItems=[item1,item2,item3]




let work=[]
app.get("/",function(req,res){
  let day=date()
  Item.find({},function(err,items){
    if(items.length==0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Default items added successfully");
        }
      })
      res.redirect("/")
    }else{
      res.render("list",{listTitle:day,listItems:items})
    }

  })

})

app.get("/work",function(req,res){
  res.render("list",{listTitle:"Work",listItems:work})
})

app.post("/",function(req,res){
  if(req.body.button==="Work"){
    work.push(req.body.newItem)
    res.redirect("/work")
  }else{
    const itemName=req.body.newItem
    const newItem= new Item({
      name:itemName
    })
    newItem.save().catch(function(err){
      if(err){
        console.log(err);
      }else{
        console.log("New item added");
      }
    })
    res.redirect("/")
  }


})

app.listen(process.env.PORT||3000,function(){
  console.log("Server is running");
})
