const mongoose = require("mongoose");
const cartsCollection = "Carts";

const cartsSchema = new mongoose.Schema({
  cartId: {
    type: String,
    required: true,
    unique: true,
  },
  products: {
    type: [
      {
        quantity: Number,
        productId: String,
        product:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products"
        }
      }
    ],
    default: [],
  },
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);
module.exports = cartsModel;
