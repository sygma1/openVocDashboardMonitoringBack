//services/defectdojo.js

const axios = require('axios');

const defectDojoClient = axios.create({
  baseURL: process.env.DEFECT_DOJO_URL,
  headers: {
    Authorization: `Token ${process.env.DEFECT_DOJO_API_KEY}`,
  },
});

// Fetch active vulnerabilities
const getActiveFindings = async () => {
  let findings = [];
  let nextUrl = '/findings/?active=true';
  
  try {
    while (nextUrl) {
      const response = await defectDojoClient.get(nextUrl);
      findings = findings.concat(response.data.results);
      nextUrl = response.data.next
        ? response.data.next.replace(process.env.DEFECT_DOJO_URL, '')
        : null;
    }
    return findings;
  } catch (error) {
    console.error('DefectDojo API error:', error.message);
    return [];
  }
};

module.exports = { getActiveFindings };