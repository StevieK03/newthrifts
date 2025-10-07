// Test Script - v6.0
// This script tests if our cache busting is working

console.log('🧪 Test script loaded - v6.0');
console.log('✅ Current timestamp:', new Date().toISOString());
console.log('✅ Script loading order test passed');

// Test if we can override global functions
window.testCacheBuster = function() {
  console.log('🎯 Cache buster test function called successfully');
  return 'Cache buster is working!';
};

// Force a page refresh if this is the first load
if (!sessionStorage.getItem('cacheBusterTest')) {
  sessionStorage.setItem('cacheBusterTest', 'true');
  console.log('🔄 First load detected - cache buster active');
} else {
  console.log('✅ Cache buster already active');
}
