#!/usr/bin/env node

/**
 * Simple test script to verify user authentication with the backend
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3400/api/v1';

// Test credentials
const testCredentials = {
  admin: { email: 'admin@cesto.com', password: 'password123' },
  client: { email: 'client@cesto.com', password: 'password123' },
  buyer: { email: 'buyer@cesto.com', password: 'password123' },
  supplier: { email: 'supplier@cesto.com', password: 'password123' }
};

async function testLogin(role, credentials) {
  console.log(`\n🔑 Testing login for ${role}...`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    
    console.log(`✅ ${role} login successful`);
    console.log(`   User: ${response.data.user.firstName} ${response.data.user.lastName}`);
    console.log(`   Role: ${response.data.user.role}`);
    console.log(`   Company: ${response.data.user.companyName}`);
    
    // Test JWT token
    const token = response.data.access_token;
    const tokenParts = token.split('.');
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    console.log(`   Token Role: ${payload.role}`);
    console.log(`   Token Email: ${payload.email}`);
    
    return { success: true, token, user: response.data.user };
  } catch (error) {
    console.log(`❌ ${role} login failed:`, error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function testProtectedEndpoint(role, token) {
  console.log(`\n🛡️ Testing protected endpoint for ${role}...`);
  
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log(`✅ ${role} can access protected endpoint`);
    console.log(`   Profile data received`);
    return { success: true };
  } catch (error) {
    console.log(`❌ ${role} cannot access protected endpoint:`, error.response?.status);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Tests\n');
  console.log('=' .repeat(50));
  
  const results = {};
  
  for (const [role, credentials] of Object.entries(testCredentials)) {
    console.log(`\n📋 Testing ${role.toUpperCase()}`);
    console.log('-'.repeat(30));
    
    const loginResult = await testLogin(role, credentials);
    results[role] = { login: loginResult };
    
    if (loginResult.success) {
      await testProtectedEndpoint(role, loginResult.token);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  
  for (const [role, result] of Object.entries(results)) {
    const status = result.login.success ? '✅ SUCCESS' : '❌ FAILED';
    console.log(`${role.toUpperCase()}: ${status}`);
  }
}

// Check if axios is available
try {
  require('axios');
} catch (error) {
  console.error('❌ axios is required. Please install it with: npm install axios');
  process.exit(1);
}

// Run tests
runTests().catch(console.error);
