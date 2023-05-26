const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const productsCollection = "Products";
const { ROLES } = require('../../helpers')
const productsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  code: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  status: {
    type: mongoose.Schema.Types.Boolean,
    required: true,
  },
  stock: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  thumbnails: {
    type: [mongoose.Schema.Types.String],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.String,
    default: ROLES.ADMIN
  }
});
productsSchema.plugin(mongoosePaginate);
const productsModel = mongoose.model(productsCollection, productsSchema);
module.exports = productsModel;
