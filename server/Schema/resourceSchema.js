const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true 
  },
  total: { type: Number, required: true },
  available: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = { Resource };