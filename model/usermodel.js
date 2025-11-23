const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    email: {type: String, require: true},
    cart : [{type:mongoose.Schema.Types.ObjectId,
        ref:"item"
    }] ,
    fevourites : [{type:mongoose.Schema.Types.ObjectId,
        ref:"item"
    }] 
   
        
    
})

module.exports = mongoose.model("User",UserSchema);