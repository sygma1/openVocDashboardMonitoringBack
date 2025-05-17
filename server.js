//server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const WebSocket = require('ws');
const connectDB = require('./config/db');
const { setupWazuhWebSocket } = require('./services/wazuh');

// Initialize Express
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/defectdojo', require('./routes/defectdojo'));
app.use('/api/wazuh', require('./routes/wazuh'));

// Start HTTP server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });
setupWazuhWebSocket(wss);