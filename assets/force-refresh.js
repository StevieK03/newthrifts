// Force Refresh Script - v7.0
// This script forces a complete page refresh to clear all cache

console.log('🔄 Force refresh script loaded - v7.0');

// Force immediate refresh if this is a cached version
if (performance.navigation.type === 1) {
  console.log('✅ Fresh page load detected');
} else {
  console.log('🔄 Cached page detected - forcing refresh');
  
  // Clear all possible caches
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
  
  // Force refresh after a short delay
  setTimeout(function() {
    window.location.reload(true);
  }, 1000);
}

// Override any problematic functions immediately
window.loadQuickViewProduct = function(productHandle) {
  console.log('✅ Clean quick view function loaded for:', productHandle);
  // Simple implementation without try-catch
  fetch(`/products/${productHandle}.js`)
    .then(response => response.json())
    .then(product => {
      console.log('Product loaded:', product);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

console.log('✅ Force refresh script completed');
