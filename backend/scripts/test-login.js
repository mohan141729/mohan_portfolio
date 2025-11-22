const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const loginData = {
      email: 'admin@example.com',
      password: 'admin123'
    };
    
    console.log('Sending data:', loginData);
    
    const response = await fetch('http://localhost:4000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('✅ Login test successful!');
      console.log('Token received:', data.token ? 'Yes' : 'No');
      console.log('User data:', data.user);
    } else {
      console.log('❌ Login test failed!');
      console.log('Error:', data.error || data.message);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testLogin(); 