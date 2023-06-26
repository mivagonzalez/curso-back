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
  documents: {
    type: [
      {
        name: String,
        reference: String,
      }
    ],
    default: [],
  },
  age: Number,
  address: String,
  password: String,
  role: String,
  cart:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts"
  },
  last_connection: {
    type: String,
    required: true
  },
});

const userModel = mongoose.model(collection, schema);
module.exports = userModel;
