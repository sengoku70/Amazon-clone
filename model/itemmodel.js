const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,    
    },
    description: {
        type: String,    
    },
    name: {
        type: String,
        required: true,    
    },
    price: {
        type: Number,
        required: true,    
    },
    SellerID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required : true
           
    },
    image : {
        type:  String 
    }
},{timestamps:true});

module.exports = mongoose.model("Item",itemSchema);

   
 