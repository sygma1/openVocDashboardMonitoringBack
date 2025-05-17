//routes/wazuh.js

const express = require('express');
const { getAlerts } = require('../controllers/wazuh');

const router = express.Router();
router.get('/alerts', getAlerts);
module.exports = router;