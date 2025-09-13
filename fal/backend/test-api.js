const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 Testing API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);

    // Test admin login
    console.log('\n2. Testing admin login...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@falplatform.com',
        password: 'admin123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('✅ Login:', loginData.success ? 'Success' : 'Failed');

    if (loginData.success && loginData.data.token) {
      const token = loginData.data.token;
      console.log('🔑 Token received');

      // Test admin users endpoint
      console.log('\n3. Testing admin users endpoint...');
      const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = await usersResponse.json();
      console.log('✅ Admin users:', usersData.success ? 'Success' : 'Failed');
      if (usersData.success) {
        console.log(`📊 Found ${usersData.data.users.length} users`);
      }

      // Test admin stats endpoint
      console.log('\n4. Testing admin stats endpoint...');
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();
      console.log('✅ Admin stats:', statsData.success ? 'Success' : 'Failed');
      if (statsData.success) {
        console.log('📈 Stats:', statsData.data.stats);
      }

      // Test posts endpoint
      console.log('\n5. Testing posts endpoint...');
      const postsResponse = await fetch('http://localhost:5000/api/posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const postsData = await postsResponse.json();
      console.log('✅ Posts:', postsData.success ? 'Success' : 'Failed');
      if (postsData.success) {
        console.log(`📝 Found ${postsData.data.posts.length} posts`);
      }

    } else {
      console.log('❌ Login failed:', loginData.message);
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
