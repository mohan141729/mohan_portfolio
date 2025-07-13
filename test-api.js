const fetch = require('node-fetch');

const possibleBackendUrls = [
  'https://mohan-portfolio-5g5k.onrender.com',
  'https://mohan-portfolio-6x14.onrender.com',
  'http://localhost:4000'
];

async function testBackendHealth() {
  console.log('🔍 Testing Backend Health...\n');
  
  for (const baseUrl of possibleBackendUrls) {
    try {
      console.log(`Testing backend: ${baseUrl}`);
      
      // Test health endpoint first
      const healthResponse = await fetch(`${baseUrl}/api/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log(`✅ Health check passed: ${JSON.stringify(healthData)}`);
        
        // Test a few key endpoints
        const endpoints = ['/api/projects', '/api/skills', '/api/public/hero'];
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(`${baseUrl}${endpoint}`);
            if (response.ok) {
              console.log(`✅ ${endpoint} - Working`);
            } else {
              console.log(`⚠️  ${endpoint} - Status: ${response.status}`);
            }
          } catch (error) {
            console.log(`❌ ${endpoint} - Error: ${error.message}`);
          }
        }
        
        console.log(`\n🎯 Found working backend: ${baseUrl}\n`);
        return baseUrl;
      } else {
        console.log(`❌ Health check failed: ${healthResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('❌ No working backend found!');
  return null;
}

async function testAPIEndpoints() {
  console.log('🧪 Testing API Endpoints...\n');
  
  const workingBackend = await testBackendHealth();
  
  if (!workingBackend) {
    console.log('❌ Cannot test endpoints - no working backend found');
    return;
  }
  
  const endpoints = [
    '/api/projects',
    '/api/skills', 
    '/api/certifications',
    '/api/public/hero',
    '/api/public/about',
    '/api/public/contact',
    '/api/public/resume'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      const response = await fetch(`${workingBackend}${endpoint}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint} - Status: ${response.status} - Data: ${Array.isArray(data) ? `${data.length} items` : 'Object'}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ ${endpoint} - Status: ${response.status} - Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Network Error: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🎯 API Testing Complete!');
}

testAPIEndpoints(); 