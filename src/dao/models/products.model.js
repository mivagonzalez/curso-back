const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const productsCollection = "Products";

const productsSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
    default: [],
  },
});
productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);
module.exports = productsModel;
