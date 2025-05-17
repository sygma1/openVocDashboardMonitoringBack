//routes/defectdojo.js

const express = require('express');
const { getVulnerabilities } = require('../controllers/defectdojo');

const router = express.Router();
router.get('/vulnerabilities', getVulnerabilities);
module.exports = router;