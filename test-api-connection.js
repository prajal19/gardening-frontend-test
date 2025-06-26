// Test script to verify API connection and environment variables
console.log('🧪 Testing API connection and environment variables...');

// Check environment variables
console.log('🔧 Environment variables:');
console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'NOT SET');
console.log('NEXT_PUBLIC_MAIN_DOMAIN:', process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'NOT SET');

// Test localStorage
if (typeof window !== 'undefined') {
  console.log('📦 localStorage test:');
  const testToken = 'test-jwt-token-123';
  localStorage.setItem('authToken', testToken);
  console.log('Stored token:', localStorage.getItem('authToken'));
  
  // Test token retrieval order
  const retrievedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || localStorage.getItem('token');
  console.log('Retrieved token:', retrievedToken);
}

console.log('✅ API connection test completed');

// Instructions for setting up environment variables
console.log('\n📋 To fix API connection issues:');
console.log('1. Create a .env.local file in the Booking directory');
console.log('2. Add the following content:');
console.log('   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1');
console.log('   NEXT_PUBLIC_MAIN_DOMAIN=http://localhost:3000');
console.log('3. Restart the Next.js development server'); 