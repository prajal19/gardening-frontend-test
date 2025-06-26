const axios = require('axios');

// Test login and redirection for different user roles
async function testLoginRedirect() {
  const baseURL = 'http://localhost:5000/api/v1';
  
  console.log('🧪 Testing Login and Redirection Flow...\n');

  // Test super admin login
  try {
    console.log('1️⃣ Testing Super Admin Login...');
    const superAdminResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'superadmin@landscaping.com',
      password: 'superadmin123'
    });
    
    if (superAdminResponse.data.success) {
      const token = superAdminResponse.data.token;
      const decoded = require('jsonwebtoken').decode(token);
      console.log('✅ Super Admin Login Success');
      console.log('   Role:', decoded.role);
      console.log('   Expected Redirect: /super-admin');
      console.log('   Token:', token.substring(0, 50) + '...');
    }
  } catch (error) {
    console.log('❌ Super Admin Login Failed:', error.response?.data?.message || error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test tenant admin login (if you have a tenant created)
  try {
    console.log('2️⃣ Testing Tenant Admin Login...');
    console.log('   Note: You need to create a tenant first using the super admin');
    console.log('   Then use the tenant admin credentials');
    
    // This would be the tenant admin credentials from when you created a tenant
    const tenantAdminResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'grassinform@gmail.com', // Replace with actual tenant admin email
      password: 'password123' // Replace with actual tenant admin password
    });
    
    if (tenantAdminResponse.data.success) {
      const token = tenantAdminResponse.data.token;
      const decoded = require('jsonwebtoken').decode(token);
      console.log('✅ Tenant Admin Login Success');
      console.log('   Role:', decoded.role);
      console.log('   Expected Redirect: /admin');
      console.log('   Token:', token.substring(0, 50) + '...');
    }
  } catch (error) {
    console.log('❌ Tenant Admin Login Failed:', error.response?.data?.message || error.message);
    console.log('   This is expected if no tenant has been created yet');
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test customer login
  try {
    console.log('3️⃣ Testing Customer Login...');
    console.log('   Note: You need to create a customer account first');
    
    const customerResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'customer@example.com', // Replace with actual customer email
      password: 'password123' // Replace with actual customer password
    });
    
    if (customerResponse.data.success) {
      const token = customerResponse.data.token;
      const decoded = require('jsonwebtoken').decode(token);
      console.log('✅ Customer Login Success');
      console.log('   Role:', decoded.role);
      console.log('   Expected Redirect: /customers');
      console.log('   Token:', token.substring(0, 50) + '...');
    }
  } catch (error) {
    console.log('❌ Customer Login Failed:', error.response?.data?.message || error.message);
    console.log('   This is expected if no customer account exists');
  }

  console.log('\n' + '='.repeat(50) + '\n');
  console.log('📋 Summary of Expected Redirects:');
  console.log('   superAdmin → /super-admin');
  console.log('   tenantAdmin → /admin');
  console.log('   admin → /admin');
  console.log('   customer → /customers');
  console.log('   professional → /professional');
  console.log('\n🎯 Next Steps:');
  console.log('   1. Make sure your backend server is running on port 5000');
  console.log('   2. Create a tenant using the super admin dashboard');
  console.log('   3. Test the tenant admin login with the created credentials');
  console.log('   4. Check that the frontend redirects to the correct dashboard');
}

// Run the test
testLoginRedirect().catch(console.error); 