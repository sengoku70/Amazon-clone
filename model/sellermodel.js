const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
    shopname: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    products: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Item"},
    ]
})

module.exports = mongoose.model("Seller",sellerSchema);