//models/Alert.js

const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  ruleId: { type: Number, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  agentName: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Alert', AlertSchema);