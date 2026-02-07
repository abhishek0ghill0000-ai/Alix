const axios = require('axios');

async function testUser() {
  try {
    console.log('🔄 Testing NEW user signup...');
    
    const response = await axios.post('https://alix-api.onrender.com/authRoutes/signup', {
      username: 'fakeuser_' + Date.now(),
      password: 'fakepass123',
      latitude: 28.6139,
      longitude: 77.2090
    });
    
    console.log('✅ SUCCESS:', response.data);
    console.log('👤 Username:', response.data.user?.username);
    console.log('🗝️  Token:', response.data.token?.substring(0, 20) + '...');
    
    // Test login
    const loginRes = await axios.post('https://alix-api.onrender.com/authRoutes/login', {
      username: response.data.user.username,
      password: 'fakepass123'
    });
    
    console.log('✅ LOGIN OK:', loginRes.data.success);
    
  } catch (error) {
    console.error('❌ ERROR:', error.response?.data || error.message);
  }
}

testUser();
