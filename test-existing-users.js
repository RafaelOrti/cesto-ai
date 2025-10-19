#!/usr/bin/env node

/**
 * Script to test existing users with common passwords
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3400/api/v1';

// Common passwords to try
const commonPasswords = [
  'password',
  'Password123',
  'Test123!',
  'Admin123!',
  'Client123!',
  'Buyer123!',
  'Supplier123!',
  '123456',
  'password123',
  'admin',
  'test'
];

// Test users
const testUsers = [
  'admin@cesto.com',
  'client@cesto.com',
  'buyer@cesto.com',
  'supplier@cesto.com'
];

async function testLogin(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    return { success: true, user: response.data.user, token: response.data.access_token };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

async function findWorkingCredentials() {
  console.log('🔍 Testing existing users with common passwords\n');
  console.log('=' .repeat(60));
  
  const results = {};
  
  for (const email of testUsers) {
    console.log(`\n📧 Testing user: ${email}`);
    console.log('-'.repeat(40));
    
    let found = false;
    
    for (const password of commonPasswords) {
      console.log(`   Trying password: ${password}`);
      const result = await testLogin(email, password);
      
      if (result.success) {
        console.log(`   ✅ SUCCESS! Password: ${password}`);
        console.log(`   User: ${result.user.firstName} ${result.user.lastName}`);
        console.log(`   Role: ${result.user.role}`);
        console.log(`   Company: ${result.user.companyName}`);
        
        results[email] = {
          success: true,
          password,
          user: result.user,
          token: result.token
        };
        
        found = true;
        break;
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }
      
      // Wait 100ms between attempts
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (!found) {
      console.log(`   ❌ No working password found for ${email}`);
      results[email] = { success: false };
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS SUMMARY');
  console.log('='.repeat(60));
  
  for (const [email, result] of Object.entries(results)) {
    if (result.success) {
      console.log(`✅ ${email}: ${result.password}`);
    } else {
      console.log(`❌ ${email}: No working password found`);
    }
  }
  
  const successCount = Object.values(results).filter(r => r.success).length;
  console.log(`\n📈 Found credentials for ${successCount}/${Object.keys(results).length} users`);
  
  return results;
}

// Run the test
findWorkingCredentials().catch(console.error);

