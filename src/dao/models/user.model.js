const mongoose = require("mongoose");

const collection = "Users";

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    index: true
  },
  age: Number,
  address: String,
  password: String,
  cart:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts"
  }
});

const userModel = mongoose.model(collection, schema);
module.exports = userModel;
