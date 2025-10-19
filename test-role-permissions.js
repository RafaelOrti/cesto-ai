#!/usr/bin/env node

/**
 * Comprehensive test script for role-based permissions
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

// Endpoints to test for each role
const roleEndpoints = {
  admin: [
    { method: 'GET', path: '/admin/users', description: 'List all users' },
    { method: 'GET', path: '/admin/stats', description: 'Admin statistics' },
    { method: 'GET', path: '/users', description: 'User management' },
    { method: 'GET', path: '/orders', description: 'All orders' },
    { method: 'GET', path: '/products', description: 'All products' },
    { method: 'GET', path: '/suppliers', description: 'All suppliers' }
  ],
  client: [
    { method: 'GET', path: '/orders', description: 'Client orders' },
    { method: 'GET', path: '/products', description: 'Browse products' },
    { method: 'GET', path: '/suppliers', description: 'View suppliers' },
    { method: 'GET', path: '/clients/profile', description: 'Client profile' }
  ],
  buyer: [
    { method: 'GET', path: '/orders', description: 'Buyer orders' },
    { method: 'GET', path: '/products', description: 'Browse products' },
    { method: 'GET', path: '/suppliers', description: 'View suppliers' },
    { method: 'GET', path: '/buyers/profile', description: 'Buyer profile' }
  ],
  supplier: [
    { method: 'GET', path: '/suppliers/profile', description: 'Supplier profile' },
    { method: 'GET', path: '/suppliers/products', description: 'Supplier products' },
    { method: 'GET', path: '/suppliers/orders', description: 'Supplier orders' },
    { method: 'GET', path: '/products', description: 'Browse products' }
  ]
};

// Endpoints that should be restricted for each role
const restrictedEndpoints = {
  admin: [], // Admin has access to everything
  client: [
    { method: 'GET', path: '/admin/users', description: 'Admin users' },
    { method: 'GET', path: '/admin/stats', description: 'Admin stats' },
    { method: 'GET', path: '/suppliers/profile', description: 'Supplier profile' },
    { method: 'GET', path: '/buyers/profile', description: 'Buyer profile' }
  ],
  buyer: [
    { method: 'GET', path: '/admin/users', description: 'Admin users' },
    { method: 'GET', path: '/admin/stats', description: 'Admin stats' },
    { method: 'GET', path: '/suppliers/profile', description: 'Supplier profile' },
    { method: 'GET', path: '/clients/profile', description: 'Client profile' }
  ],
  supplier: [
    { method: 'GET', path: '/admin/users', description: 'Admin users' },
    { method: 'GET', path: '/admin/stats', description: 'Admin stats' },
    { method: 'GET', path: '/buyers/profile', description: 'Buyer profile' },
    { method: 'GET', path: '/clients/profile', description: 'Client profile' }
  ]
};

async function login(role, credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return { success: true, token: response.data.access_token, user: response.data.user };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || error.message };
  }
}

async function testEndpoint(method, path, token, description) {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${path}`,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return {
      success: true,
      status: response.status,
      data: response.data,
      description
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      error: error.response?.data?.message || error.message,
      description
    };
  }
}

async function testRolePermissions(role, credentials) {
  console.log(`\n🔐 Testing ${role.toUpperCase()} permissions`);
  console.log('=' .repeat(50));
  
  // Login
  const loginResult = await login(role, credentials);
  if (!loginResult.success) {
    console.log(`❌ Login failed: ${loginResult.error}`);
    return { success: false };
  }
  
  console.log(`✅ Login successful: ${loginResult.user.firstName} ${loginResult.user.lastName}`);
  console.log(`   Role: ${loginResult.user.role}`);
  console.log(`   Company: ${loginResult.user.companyName}`);
  
  const token = loginResult.token;
  const results = { login: true, allowed: {}, denied: {} };
  
  // Test allowed endpoints
  console.log(`\n🟢 Testing ALLOWED endpoints for ${role}:`);
  const allowedEndpoints = roleEndpoints[role] || [];
  
  for (const endpoint of allowedEndpoints) {
    const result = await testEndpoint(endpoint.method, endpoint.path, token, endpoint.description);
    
    if (result.success) {
      console.log(`   ✅ ${endpoint.method} ${endpoint.path} - ${result.description}`);
      results.allowed[endpoint.path] = result;
    } else {
      console.log(`   ❌ ${endpoint.method} ${endpoint.path} - ${result.description} (${result.status})`);
      results.denied[endpoint.path] = result;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Test restricted endpoints
  console.log(`\n🔴 Testing RESTRICTED endpoints for ${role}:`);
  const restricted = restrictedEndpoints[role] || [];
  
  for (const endpoint of restricted) {
    const result = await testEndpoint(endpoint.method, endpoint.path, token, endpoint.description);
    
    if (result.success) {
      console.log(`   ⚠️  ${endpoint.method} ${endpoint.path} - ${result.description} (SHOULD BE DENIED!)`);
      results.denied[endpoint.path] = { ...result, shouldBeDenied: true };
    } else {
      console.log(`   ✅ ${endpoint.method} ${endpoint.path} - ${result.description} (Correctly denied)`);
      results.allowed[endpoint.path] = result;
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return results;
}

async function runAllTests() {
  console.log('🚀 Starting Role-Based Permission Tests\n');
  console.log('=' .repeat(60));
  
  const allResults = {};
  
  for (const [role, credentials] of Object.entries(testCredentials)) {
    const results = await testRolePermissions(role, credentials);
    allResults[role] = results;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Generate summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 PERMISSION TEST SUMMARY');
  console.log('='.repeat(60));
  
  for (const [role, results] of Object.entries(allResults)) {
    if (results.success === false) {
      console.log(`\n❌ ${role.toUpperCase()}: Login failed`);
      continue;
    }
    
    console.log(`\n${role.toUpperCase()}:`);
    
    const allowedCount = Object.keys(results.allowed).length;
    const deniedCount = Object.keys(results.denied).length;
    const shouldBeDeniedCount = Object.values(results.denied).filter(r => r.shouldBeDenied).length;
    
    console.log(`   ✅ Allowed endpoints: ${allowedCount}`);
    console.log(`   ❌ Denied endpoints: ${deniedCount}`);
    
    if (shouldBeDeniedCount > 0) {
      console.log(`   ⚠️  Security issues: ${shouldBeDeniedCount} endpoints that should be denied were allowed`);
    }
    
    // Check for security issues
    const securityIssues = Object.entries(results.denied)
      .filter(([path, result]) => result.shouldBeDenied)
      .map(([path, result]) => path);
    
    if (securityIssues.length > 0) {
      console.log(`   🚨 Security violations: ${securityIssues.join(', ')}`);
    }
  }
  
  // Overall security assessment
  const totalSecurityIssues = Object.values(allResults)
    .filter(r => r.success !== false)
    .reduce((sum, r) => sum + Object.values(r.denied).filter(d => d.shouldBeDenied).length, 0);
  
  console.log(`\n🔒 Overall Security Assessment:`);
  if (totalSecurityIssues === 0) {
    console.log('   ✅ No security issues found. Role-based permissions are working correctly.');
  } else {
    console.log(`   ⚠️  ${totalSecurityIssues} security issues found. Please review role-based access control.`);
  }
}

// Run the tests
runAllTests().catch(console.error);

