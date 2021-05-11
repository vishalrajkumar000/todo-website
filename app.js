const express=require("express")
const bodyParser = require("body-parser")
const date=require(__dirname+"/date.js")
const mongoose = require("mongoose")
const _=require("lodash")

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify: false, useCreateIndex: true})

const app=express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set('view engine','ejs')

let day=date()

const itemSchema={
  name:String
};

const listSchema={
  name:String,
  items:[itemSchema]
};

const List=mongoose.model("List",listSchema)

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





app.get("/",function(req,res){

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

app.get("/:customListName",function(req,res){
  const listName=_.capitalize(req.params.customListName);

  List.findOne({name:listName},function(err,foundList){
    if(!err){
      if(!foundList){
          const list = new List({
                name:listName,
                items:defaultItems
              });
          list.save().then(function(){
            res.redirect("/"+listName)
          })

      }else{
        res.render("list",{listTitle:foundList.name,listItems:foundList.items})
      }
    }
  })

})

app.post("/",function(req,res){

    const itemName=req.body.newItem
    const listName=req.body.list

    const newItem= new Item({
      name:itemName
    })
    if(listName==day){
      newItem.save().then(function(){
        res.redirect("/")
      })
    }else{
      List.findOne({name:listName},function(err,foundList){
        foundList.items.push(newItem)
        foundList.save().then(function(){
          res.redirect("/"+listName)
        })
      })
    }

})

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox
  const listName=req.body.listName

  if(listName===day){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("successfully deleted");
        res.redirect("/")
      }
    })
  }else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName)
      }
    })
  }


})

app.listen(process.env.PORT||3000,function(){
  console.log("Server is running");
})
