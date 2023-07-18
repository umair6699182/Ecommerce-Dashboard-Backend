const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema({
    name: String,
    price: String,
    catogory: String,
    userid: String,
    company: String
})

module.exports = mongoose.model("products",productSchema);