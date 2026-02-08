// test-shandong-api.js
// Save this in your project root and run: node test-shandong-api.js

const http = require('http');

console.log('🔍 Testing Shandong Restaurant API...\n');

// Test 1: Health Check
function testHealth() {
  return new Promise((resolve) => {
    console.log('1️⃣ Testing Health Endpoint');
    console.log('   GET http://localhost:3000/api/health');

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log('   ✅ Status:', res.statusCode);
            console.log('   ✅ Response:', JSON.stringify(json, null, 2));

            if (json.database === 'connected') {
              console.log('   ✅ Database: CONNECTED\n');
            } else {
              console.log('   ⚠️  Database: NOT CONNECTED\n');
            }
          } catch (err) {
            console.log('   ❌ Invalid JSON response\n');
          }
        } else {
          console.log('   ❌ Status:', res.statusCode);
          console.log('   ❌ Response:', data, '\n');
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log('   ❌ Connection Failed:', err.message);
      console.log('   💡 Make sure backend is running on port 3000\n');
      resolve();
    });

    req.end();
  });
}

// Test 2: Login
function testLogin() {
  return new Promise((resolve) => {
    console.log('2️⃣ Testing Login Endpoint');
    console.log('   POST http://localhost:3000/api/auth/login');
    console.log('   Credentials: admin / admin1234');

    const postData = JSON.stringify({
      username: 'admin',
      password: 'admin1234'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            console.log('   ✅ Status:', res.statusCode);
            console.log('   ✅ Login: SUCCESSFUL');
            console.log('   ✅ Token:', json.token ? 'Generated ✓' : 'Missing ✗');
            console.log('   ✅ User:', json.user?.username || 'N/A', '\n');
          } catch (err) {
            console.log('   ❌ Invalid JSON response\n');
          }
        } else {
          console.log('   ❌ Status:', res.statusCode);
          try {
            const json = JSON.parse(data);
            console.log('   ❌ Error:', json.message || 'Unknown error');
          } catch {
            console.log('   ❌ Response:', data);
          }
          console.log('');
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.log('   ❌ Connection Failed:', err.message);
      console.log('   💡 Login endpoint not implemented yet\n');
      resolve();
    });

    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  await testHealth();
  await testLogin();

  console.log('========================================');
  console.log('📋 Summary');
  console.log('========================================\n');

  console.log('✅ If both tests passed:');
  console.log('   - Your backend is working correctly');
  console.log('   - Frontend should be able to login\n');

  console.log('❌ If health check failed:');
  console.log('   - Start backend: npm run dev');
  console.log('   - Check port 3000 is not in use');
  console.log('   - Verify MongoDB is connected\n');

  console.log('❌ If login failed:');
  console.log('   - Auth endpoint not implemented');
  console.log('   - Use auth-routes.ts file provided');
  console.log('   - Check CORS is enabled\n');

  console.log('🔧 Next Steps:');
  console.log('   1. Fix any failed tests');
  console.log('   2. Try login from frontend');
  console.log('   3. Check browser console for errors\n');
}

runTests();
