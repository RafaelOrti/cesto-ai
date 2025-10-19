#!/usr/bin/env node

/**
 * Test script to verify user roles and authentication with the backend
 * Tests all user roles: admin, client, buyer, supplier
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3400/api/v1';

// Test users for each role
const testUsers = {
  admin: {
    email: 'admin@cesto.com',
    password: 'Admin123!',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    companyName: 'Cesto Admin'
  },
  client: {
    email: 'client@cesto.com',
    password: 'Client123!',
    role: 'client',
    firstName: 'Client',
    lastName: 'User',
    companyName: 'Client Company'
  },
  buyer: {
    email: 'buyer@cesto.com',
    password: 'Buyer123!',
    role: 'buyer',
    firstName: 'Buyer',
    lastName: 'User',
    companyName: 'Buyer Company',
    businessType: 'Restaurant'
  },
  supplier: {
    email: 'supplier@cesto.com',
    password: 'Supplier123!',
    role: 'supplier',
    firstName: 'Supplier',
    lastName: 'User',
    companyName: 'Supplier Company',
    description: 'Food supplier'
  }
};

// Test endpoints that require different roles
const protectedEndpoints = {
  admin: [
    '/admin/users',
    '/admin/stats',
    '/admin/orders'
  ],
  client: [
    '/orders',
    '/products',
    '/suppliers'
  ],
  buyer: [
    '/orders',
    '/products',
    '/suppliers',
    '/buyers/profile'
  ],
  supplier: [
    '/suppliers/profile',
    '/suppliers/products',
    '/suppliers/orders'
  ]
};

class UserRoleTester {
  constructor() {
    this.results = {
      registration: {},
      login: {},
      roleVerification: {},
      endpointAccess: {}
    };
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testUserRegistration(userData) {
    console.log(`\n🔐 Testing registration for ${userData.role}...`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      this.results.registration[userData.role] = {
        success: true,
        user: response.data.user,
        token: response.data.access_token
      };
      
      console.log(`✅ ${userData.role} registration successful`);
      console.log(`   User ID: ${response.data.user.id}`);
      console.log(`   Role: ${response.data.user.role}`);
      
      return response.data;
    } catch (error) {
      this.results.registration[userData.role] = {
        success: false,
        error: error.response?.data || error.message
      };
      
      console.log(`❌ ${userData.role} registration failed:`, error.response?.data?.message || error.message);
      return null;
    }
  }

  async testUserLogin(userData) {
    console.log(`\n🔑 Testing login for ${userData.role}...`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: userData.email,
        password: userData.password
      });
      
      this.results.login[userData.role] = {
        success: true,
        user: response.data.user,
        token: response.data.access_token
      };
      
      console.log(`✅ ${userData.role} login successful`);
      console.log(`   User: ${response.data.user.firstName} ${response.data.user.lastName}`);
      console.log(`   Role: ${response.data.user.role}`);
      console.log(`   Company: ${response.data.user.companyName}`);
      
      return response.data;
    } catch (error) {
      this.results.login[userData.role] = {
        success: false,
        error: error.response?.data || error.message
      };
      
      console.log(`❌ ${userData.role} login failed:`, error.response?.data?.message || error.message);
      return null;
    }
  }

  async testRoleVerification(userData, token) {
    console.log(`\n🔍 Testing role verification for ${userData.role}...`);
    
    try {
      // Decode JWT token to verify role
      const tokenParts = token.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      
      const expectedRole = userData.role;
      const actualRole = payload.role;
      
      const roleMatch = expectedRole === actualRole;
      
      this.results.roleVerification[userData.role] = {
        success: roleMatch,
        expectedRole,
        actualRole,
        payload
      };
      
      if (roleMatch) {
        console.log(`✅ Role verification successful for ${userData.role}`);
        console.log(`   Expected: ${expectedRole}`);
        console.log(`   Actual: ${actualRole}`);
      } else {
        console.log(`❌ Role verification failed for ${userData.role}`);
        console.log(`   Expected: ${expectedRole}`);
        console.log(`   Actual: ${actualRole}`);
      }
      
      return roleMatch;
    } catch (error) {
      this.results.roleVerification[userData.role] = {
        success: false,
        error: error.message
      };
      
      console.log(`❌ Role verification failed for ${userData.role}:`, error.message);
      return false;
    }
  }

  async testEndpointAccess(userData, token) {
    console.log(`\n🛡️ Testing endpoint access for ${userData.role}...`);
    
    const endpoints = protectedEndpoints[userData.role] || [];
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        results[endpoint] = {
          success: true,
          status: response.status,
          data: response.data
        };
        
        console.log(`✅ Access granted to ${endpoint} for ${userData.role}`);
      } catch (error) {
        results[endpoint] = {
          success: false,
          status: error.response?.status,
          error: error.response?.data || error.message
        };
        
        console.log(`❌ Access denied to ${endpoint} for ${userData.role}: ${error.response?.status}`);
      }
    }
    
    this.results.endpointAccess[userData.role] = results;
    return results;
  }

  async testUnauthorizedAccess(userData, token) {
    console.log(`\n🚫 Testing unauthorized access for ${userData.role}...`);
    
    // Test access to admin endpoints (should be denied for non-admin users)
    const adminEndpoints = protectedEndpoints.admin;
    const results = {};
    
    for (const endpoint of adminEndpoints) {
      if (userData.role !== 'admin') {
        try {
          const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          results[endpoint] = {
            success: false, // This should fail
            status: response.status,
            warning: 'Unauthorized access was granted!'
          };
          
          console.log(`⚠️ WARNING: ${userData.role} gained unauthorized access to ${endpoint}`);
        } catch (error) {
          results[endpoint] = {
            success: true, // This should fail (access denied)
            status: error.response?.status,
            error: error.response?.data || error.message
          };
          
          console.log(`✅ Correctly denied access to ${endpoint} for ${userData.role}`);
        }
      }
    }
    
    return results;
  }

  async runAllTests() {
    console.log('🚀 Starting User Role Authentication Tests\n');
    console.log('=' .repeat(60));
    
    // Test each user role
    for (const [role, userData] of Object.entries(testUsers)) {
      console.log(`\n📋 Testing ${role.toUpperCase()} role`);
      console.log('-'.repeat(40));
      
      // Step 1: Test registration
      const registrationResult = await this.testUserRegistration(userData);
      await this.delay(1000); // Wait 1 second between requests
      
      // Step 2: Test login
      const loginResult = await this.testUserLogin(userData);
      await this.delay(1000);
      
      if (loginResult) {
        // Step 3: Test role verification
        await this.testRoleVerification(userData, loginResult.access_token);
        
        // Step 4: Test authorized endpoint access
        await this.testEndpointAccess(userData, loginResult.access_token);
        
        // Step 5: Test unauthorized access
        await this.testUnauthorizedAccess(userData, loginResult.access_token);
      }
      
      await this.delay(2000); // Wait 2 seconds between users
    }
    
    // Generate summary report
    this.generateSummaryReport();
  }

  generateSummaryReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY REPORT');
    console.log('='.repeat(60));
    
    // Registration summary
    console.log('\n🔐 REGISTRATION RESULTS:');
    for (const [role, result] of Object.entries(this.results.registration)) {
      const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
      console.log(`   ${role.toUpperCase()}: ${status}`);
      if (!result.success) {
        console.log(`      Error: ${result.error?.message || result.error}`);
      }
    }
    
    // Login summary
    console.log('\n🔑 LOGIN RESULTS:');
    for (const [role, result] of Object.entries(this.results.login)) {
      const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
      console.log(`   ${role.toUpperCase()}: ${status}`);
      if (!result.success) {
        console.log(`      Error: ${result.error?.message || result.error}`);
      }
    }
    
    // Role verification summary
    console.log('\n🔍 ROLE VERIFICATION RESULTS:');
    for (const [role, result] of Object.entries(this.results.roleVerification)) {
      const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
      console.log(`   ${role.toUpperCase()}: ${status}`);
      if (result.success) {
        console.log(`      Role: ${result.actualRole}`);
      }
    }
    
    // Endpoint access summary
    console.log('\n🛡️ ENDPOINT ACCESS RESULTS:');
    for (const [role, results] of Object.entries(this.results.endpointAccess)) {
      console.log(`   ${role.toUpperCase()}:`);
      for (const [endpoint, result] of Object.entries(results)) {
        const status = result.success ? '✅' : '❌';
        console.log(`      ${status} ${endpoint}`);
      }
    }
    
    // Overall success rate
    const totalTests = Object.keys(testUsers).length * 4; // registration, login, role verification, endpoint access
    const successfulTests = Object.values(this.results.registration).filter(r => r.success).length +
                           Object.values(this.results.login).filter(r => r.success).length +
                           Object.values(this.results.roleVerification).filter(r => r.success).length;
    
    const successRate = (successfulTests / totalTests) * 100;
    
    console.log('\n📈 OVERALL SUCCESS RATE:');
    console.log(`   ${successfulTests}/${totalTests} tests passed (${successRate.toFixed(1)}%)`);
    
    if (successRate === 100) {
      console.log('🎉 All tests passed! User role authentication is working correctly.');
    } else if (successRate >= 80) {
      console.log('⚠️ Most tests passed, but some issues need attention.');
    } else {
      console.log('❌ Multiple test failures detected. Please check the backend configuration.');
    }
  }
}

// Run the tests
async function main() {
  const tester = new UserRoleTester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    process.exit(1);
  }
}

// Check if axios is available
try {
  require('axios');
} catch (error) {
  console.error('❌ axios is required. Please install it with: npm install axios');
  process.exit(1);
}

// Run the main function
main();

