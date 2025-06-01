//services/defectdojo.js

const axios = require('axios');

const defectDojoClient = axios.create({
  baseURL: process.env.DEFECT_DOJO_URL,
  headers: {
    Authorization: `Token ${process.env.DEFECT_DOJO_API_KEY}`,
  },
});

// Fetch active vulnerabilities
export async function getActiveFindings() {
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

export async function createEngagement(name, startDate = new Date()) {
  const payload = {
    name,
    product: "productId", // Replace with actual product ID
    target_start: startDate.toISOString().split('T')[0],
    target_end: startDate.toISOString().split('T')[0],
    status: 'In Progress',
  };

  const res = await dojoAPI.post('/engagements/', payload);
  return res.data.id;
}
