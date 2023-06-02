const mongoose = require("mongoose");

const collection = "ResetRequests";

const schema = new mongoose.Schema({

  createdAt: { type: mongoose.Schema.Types.Date, default: Date.now },
  expiresAt: { type: mongoose.Schema.Types.Date, default: () => Date.now() + 3600000 },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
});

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const ResetRequestsModel = mongoose.model(collection, schema);
module.exports = ResetRequestsModel;
