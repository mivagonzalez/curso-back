const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const ticketsCollection = "Ticket";

const ticketsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  purchase_datetime: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  }
});
ticketsSchema.plugin(mongoosePaginate);
const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
module.exports = ticketsModel;
