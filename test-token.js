// Test script to verify token storage and retrieval
console.log('🧪 Testing token storage and retrieval...');

// Test localStorage
const testToken = 'test-jwt-token-123';
localStorage.setItem('authToken', testToken);

console.log('📦 Stored token in localStorage:', localStorage.getItem('authToken'));

// Test sessionStorage
sessionStorage.setItem('authToken', testToken);
console.log('📦 Stored token in sessionStorage:', sessionStorage.getItem('authToken'));

// Test retrieval order
const retrievedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || localStorage.getItem('token');
console.log('🔍 Retrieved token:', retrievedToken);

// Test with different token key
localStorage.setItem('token', 'different-token-key');
const retrievedToken2 = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || localStorage.getItem('token');
console.log('🔍 Retrieved token (with fallback):', retrievedToken2);

console.log('✅ Token test completed'); 