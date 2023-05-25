const mongoose = require("mongoose");

const collection = "RestoreRequests";

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 3600000
  },  // Expire after 1 hour
});

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const restoreRequestsModel = mongoose.model(collection, schema);
module.exports = restoreRequestsModel;
