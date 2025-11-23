const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");
const Seller = require("../model/sellermodel") 

const SECRET_KEY = "secretkey";


const Usersignup = async(req,res) => {
    const {username,password,email} = req.body;
    const founduser = await User.findOne({username});
    if(founduser) return res.status(400).json({error: "user alredy exist"});
    const newuser = new User({username,password,email})
    await newuser.save();
    const token = jwt.sign({id: newuser._id,username: newuser.username},SECRET_KEY,{expiresIn:"1h"});
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.cookie("user", newuser.username, { maxAge: 3600000 });
    
    res.redirect("/");
}   

const Sellersignup = async(req,res) => {
    
    const {shopName,email,password} = req.body;
    const founduser = await User.findOne({shopname : shopName});
    
    if(founduser) return res.status(400).json({error : "user alredy exist"});

    const newSeller = new Seller({email,password,shopname:shopName});
    await newSeller.save();
    
    const token = jwt.sign({id: newSeller._id, shopname: newSeller.shopname},SECRET_KEY,{expiresIn:"1h"})
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    res.cookie("user", newSeller, { maxAge: 3600000 });
    res.redirect("/");
}   


const login = async(req,res)=>{
     const {username,password} = req.body;
     const founduser = await User.findOne({username});
     const foundseller =  await Seller.findOne({shopname:username});
     if(founduser && founduser.password === password) {
        const token = jwt.sign({id: founduser._id,username: founduser.username},SECRET_KEY,{expiresIn:"1h"})
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.cookie("user", founduser.username, { maxAge: 3600000 });
        res.redirect("/")
     }
     if(foundseller && foundseller.password === password) {
        const token = jwt.sign({id: foundseller._id,shopname: foundseller.shopname},SECRET_KEY,{expiresIn:"1h"})
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
        res.cookie("seller", foundseller, { maxAge: 3600000 });
        console.log(req.cookies.seller)
        res.redirect("/")
     }
}


module.exports = {login,Sellersignup,Usersignup}