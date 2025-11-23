const mongoose = require('mongoose');

const connectdb = async() => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/amazondatabase")
        console.log("mongoose connected");
    }catch(err){
        console.log("didnt connect to database ",err);
        process.exit(1)
    }
}

module.exports = connectdb;