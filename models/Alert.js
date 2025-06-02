//models/Alert.js

const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  wazuhAlertId: { type: String, required: true, unique: true },
  ruleId: { type: String, required: true },
  severity: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  vulnerabilityId: { type: String, default: null },
});

module.exports = mongoose.model('Alert', AlertSchema);