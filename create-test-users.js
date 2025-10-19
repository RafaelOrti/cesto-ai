#!/usr/bin/env node

/**
 * Script to create test users with different roles
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3400/api/v1';

// Test users to create
const testUsers = [
  {
    email: 'admin@cesto.com',
    password: 'Admin123!',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    companyName: 'Cesto Admin'
  },
  {
    email: 'client@cesto.com',
    password: 'Client123!',
    role: 'client',
    firstName: 'Client',
    lastName: 'User',
    companyName: 'Client Company'
  },
  {
    email: 'buyer@cesto.com',
    password: 'Buyer123!',
    role: 'buyer',
    firstName: 'Buyer',
    lastName: 'User',
    companyName: 'Buyer Company',
    businessType: 'Restaurant'
  },
  {
    email: 'supplier@cesto.com',
    password: 'Supplier123!',
    role: 'supplier',
    firstName: 'Supplier',
    lastName: 'User',
    companyName: 'Supplier Company',
    description: 'Food supplier'
  }
];

async function createUser(userData) {
  console.log(`\n🔐 Creating ${userData.role} user: ${userData.email}`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    console.log(`✅ ${userData.role} user created successfully`);
    console.log(`   User ID: ${response.data.user.id}`);
    console.log(`   Role: ${response.data.user.role}`);
    console.log(`   Company: ${response.data.user.companyName}`);
    
    return { success: true, user: response.data.user };
  } catch (error) {
    console.log(`❌ Failed to create ${userData.role} user:`, error.response?.data?.message || error.message);
    
    // If user already exists, try to login instead
    if (error.response?.status === 409) {
      console.log(`   User already exists, testing login...`);
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: userData.email,
          password: userData.password
        });
        
        console.log(`✅ ${userData.role} user login successful`);
        return { success: true, user: loginResponse.data.user };
      } catch (loginError) {
        console.log(`❌ Login also failed:`, loginError.response?.data?.message || loginError.message);
        return { success: false, error: loginError.response?.data || loginError.message };
      }
    }
    
    return { success: false, error: error.response?.data || error.message };
  }
}

async function createAllUsers() {
  console.log('🚀 Creating Test Users\n');
  console.log('=' .repeat(50));
  
  const results = {};
  
  for (const userData of testUsers) {
    const result = await createUser(userData);
    results[userData.role] = result;
    
    // Wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 CREATION SUMMARY');
  console.log('='.repeat(50));
  
  for (const [role, result] of Object.entries(results)) {
    const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
    console.log(`${role.toUpperCase()}: ${status}`);
  }
  
  const successCount = Object.values(results).filter(r => r.success).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n📈 Success Rate: ${successCount}/${totalCount} (${(successCount/totalCount*100).toFixed(1)}%)`);
  
  if (successCount === totalCount) {
    console.log('🎉 All test users created successfully!');
  } else {
    console.log('⚠️ Some users failed to create. Check the errors above.');
  }
}

// Run the script
createAllUsers().catch(console.error);

