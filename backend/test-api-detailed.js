const axios = require('axios');

async function testUserManagementAPI() {
  try {
    const response = await axios.get('http://localhost:5000/api/user-management/users');
    console.log('API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    console.log('\n--- User Details ---');
    response.data.data.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName || user.username} (${user.role}) - ${user.email} - ${user.userType}`);
    });
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

testUserManagementAPI();
