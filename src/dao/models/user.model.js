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
});

const userModel = mongoose.model(collection, schema);
module.exports = userModel;
