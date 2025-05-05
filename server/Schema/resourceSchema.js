const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    generalBeds: {
      total: { type: Number, required: true },
      available: { type: Number, required: true },
    },
    emergencyBeds: {
      total: { type: Number, required: true },
      available: { type: Number, required: true },
    },
    icuBeds: {
      total: { type: Number, required: true },
      available: { type: Number, required: true },
    },
    ventilators: {
      total: { type: Number, required: true },
      available: { type: Number, required: true },
    },
    lastUpdated: { type: Date, default: Date.now }
  });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = { Resource };