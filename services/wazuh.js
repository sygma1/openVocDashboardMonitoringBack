//services/wazuh.js

const axios = require('axios');
const https = require('https');
const WebSocket = require('ws');
const Alert = require('../models/Alert');

const ELASTIC_URL = process.env.ELASTICSEARCH_URL;
const ELASTIC_USER = process.env.ELASTICSEARCH_USER;
const ELASTIC_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

const setupWazuhWebSocket = (wss) => {
  let lastSeenTimestamp = 0;

  setInterval(async () => {
    try {
      const response = await axios.post(
        `${ELASTIC_URL}/wazuh-alerts-*/_search`,
        {
          size: 10,
          sort: [{ "@timestamp": { order: "desc" } }]
        },
        {
          auth: {
            username: ELASTIC_USER,
            password: ELASTIC_PASSWORD
          },
          headers: {
            'Content-Type': 'application/json'
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        }
      );

      const hits = response.data.hits.hits;

      for (const hit of hits.reverse()) {
        const alert = hit._source;
        const ts = new Date(alert['@timestamp']).getTime();

        if (ts > lastSeenTimestamp) {
          lastSeenTimestamp = ts;

          const filteredAlert = {
            ruleId: alert.rule?.id,
            description: alert.rule?.description || 'No description',
            severity:
              alert.rule?.level <= 5 ? 'low' :
              alert.rule?.level <= 10 ? 'medium' : 'high',
            agentName: alert.agent?.name || 'unknown',
            timestamp: new Date(alert['@timestamp'])
          };

          // Don't save to MongoDB, just send to clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(filteredAlert));
            }
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(newAlert));
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching alerts from Elasticsearch:', error.message);
    }
  }, 10000); // every 10 seconds
};

module.exports = { setupWazuhWebSocket };