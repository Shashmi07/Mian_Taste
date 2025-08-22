const axios = require('axios');

async function testUserManagementAPI() {
  try {
    const response = await axios.get('http://localhost:5000/api/user-management/users');
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

testUserManagementAPI();
