const mongoose = require('mongoose');
const item = require("../model/itemmodel");
const Seller = require('../model/sellermodel');


const createitem = async(req,res) => {
    try{
    console.log(req.file);
    const {category ,description,price,name} = req.body;
    const seller =  req.cookies.seller;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;
    const newitem = new item({category,description,price,name, image: imagePath,SellerID:seller._id});
    await newitem.save();
    await Seller.findOneAndUpdate(
        {_id:seller._id},
        {$push:{products: newitem._id}},
        {new: true}
    );
    res.redirect("/");
    } catch (error) {
     console.log(req.cookies.seller)
     
     res.status(500).json({ error : error.message });
  }
}

module.exports = {createitem}