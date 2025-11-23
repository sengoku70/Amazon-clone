const express = require("express");
const app = express();
const connectdb = require("./config/db");
const path = require('path')
const multer = require('multer');
const itemroutes = require('./routes/itemsRoute')
const authroutes = require('./routes/authroute')
const items = require('./model/itemmodel');



connectdb();
app.use(express.json())
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}))
const cookieParser = require("cookie-parser");
const { mongo, default: mongoose } = require("mongoose");
app.use(cookieParser());


app.get("/" ,async(req,res) =>{
    const itemsarray = await items.find();
    const token = req.cookies.token;
    const User =  req.cookies.user;
    const seller =  req.cookies.seller;
    if(User){
      res.render("homepage",{itemsarray,token,User})
    }else{
      res.render("homepage",{itemsarray,token,seller})
    }
   
} )
app.get("/logout", (req, res) => {

  res.clearCookie("token");
  res.clearCookie("user");
  res.clearCookie("seller");
  res.redirect("/");
  console.log("logged out")
});

app.use("/products",itemroutes);
app.use("/auth",authroutes);

app.get("/login",(req,res)=>{
    res.render("login");
})
 
app.get("/signup", (req, res) => {
  const role = req.query.role || null; // "user" or "seller"
  res.render("signup", { role });
});

app.use('/uploads', express.static('uploads'));

app.get("/createitem",(req,res)=>{
    res.render('createitem')
})

app.get("/itempreview/:id",async(req,res)=>{
    const item = await items.findById(req.params.id);
    //console.log("hello");
    res.render('itempreview',{item});
})

app.listen(3000,()=>{
    console.log("server started at port:3000");
})