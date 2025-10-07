// Cache Buster Script - v4.0
// This script forces a complete refresh of all JavaScript

console.log('🔄 Cache buster script loaded - v4.0');

// Override any problematic global functions
if (typeof window !== 'undefined') {
  // Clear any cached quick view functions
  if (window.loadQuickViewProduct) {
    delete window.loadQuickViewProduct;
  }
  
  // Ensure clean state
  document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Cache buster: DOM loaded, ensuring clean JavaScript state');
    
    // Remove any orphaned event listeners
    const quickViewModal = document.getElementById('quick-view-modal');
    if (quickViewModal) {
      // Clone and replace to clear any cached event listeners
      const newModal = quickViewModal.cloneNode(true);
      quickViewModal.parentNode.replaceChild(newModal, quickViewModal);
    }
  });
}

console.log('✅ Cache buster script initialized successfully');
