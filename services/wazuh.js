//services/wazuh.js

const axios = require('axios');
const https = require('https');
const WebSocket = require('ws');
const Alert = require('../models/Alert');

const ELASTIC_URL = process.env.ELASTICSEARCH_URL;
const ELASTIC_USER = process.env.ELASTICSEARCH_USER;
const ELASTIC_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

async function fetchRecentWazuhAlertsFromMongo() {
  try {
    const alerts = await Alert.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .lean(); // Use lean() to get plain JavaScript objects

    return alerts.map((alert) => ({
      ruleId: alert.ruleId,
      description: 'No description', // Placeholder; can be added to schema later
      severity:
        alert.severity <= 5 ? 'low' :
        alert.severity <= 10 ? 'medium' : 'high',
      agentName: 'unknown', // Placeholder; add to schema if needed
      timestamp: alert.timestamp
    }));
  } catch (error) {
    console.error('Error fetching alerts from MongoDB:', error.message);
    return [];
  }
}

module.exports = {
  fetchRecentWazuhAlertsFromMongo
};
