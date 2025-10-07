// Mobile Enhancement Script
// Adds touch gestures, swipe navigation, and mobile-specific features

document.addEventListener('DOMContentLoaded', function() {
  
  // Touch Gesture Support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  // Add touch event listeners to product cards
  const productCards = document.querySelectorAll('.product-card, .enhanced-product-card');
  
  productCards.forEach(card => {
    card.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });
    
    card.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    });
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // Swipe right - could show quick actions
        showQuickActions();
      } else {
        // Swipe left - could add to wishlist
        addToWishlistFromSwipe();
      }
    }
  }
  
  // Mobile-specific product interactions
  function showQuickActions() {
    // Show floating action buttons on mobile
    const quickActions = document.createElement('div');
    quickActions.className = 'mobile-quick-actions';
    quickActions.innerHTML = `
      <button class="quick-action-btn wishlist-btn" onclick="addToWishlist()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20.84 4.61C20.32 4.09 19.69 3.69 19 3.44C18.31 3.19 17.58 3.09 16.85 3.15C16.12 3.21 15.42 3.42 14.78 3.78C14.14 4.14 13.58 4.64 13.14 5.25L12 6.75L10.86 5.25C10.42 4.64 9.86 4.14 9.22 3.78C8.58 3.42 7.88 3.21 7.15 3.15C6.42 3.09 5.69 3.19 5 3.44C4.31 3.69 3.68 4.09 3.16 4.61C2.11 5.66 1.5 7.13 1.5 8.66C1.5 10.19 2.11 11.66 3.16 12.71L12 21.55L20.84 12.71C21.89 11.66 22.5 10.19 22.5 8.66C22.5 7.13 21.89 5.66 20.84 4.61Z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
      <button class="quick-action-btn cart-btn" onclick="quickAddToCart()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 17.6 16.6 18 16 18H8C7.4 18 7 17.6 7 17V13" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    `;
    
    document.body.appendChild(quickActions);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (quickActions.parentNode) {
        quickActions.parentNode.removeChild(quickActions);
      }
    }, 3000);
  }
  
  // Add mobile-specific CSS
  const mobileCSS = `
    .mobile-quick-actions {
      position: fixed;
      bottom: 100px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 1000;
      animation: slideInUp 0.3s ease;
    }
    
    .quick-action-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .wishlist-btn {
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
    }
    
    .cart-btn {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    
    .quick-action-btn:hover {
      transform: scale(1.1);
    }
    
    @keyframes slideInUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    /* Mobile-specific product card enhancements */
    @media (max-width: 768px) {
      .product-card, .enhanced-product-card {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      .product-card:hover, .enhanced-product-card:hover {
        transform: none !important;
      }
      
      .product-card:active, .enhanced-product-card:active {
        transform: scale(0.98) !important;
        transition: transform 0.1s ease;
      }
      
      /* Improve button sizes for touch */
      .button, .btn, .action-btn {
        min-height: 44px;
        min-width: 44px;
      }
      
      /* Better spacing for mobile */
      .swatch {
        min-width: 44px;
        min-height: 44px;
      }
    }
    
    /* Mobile navigation enhancements */
    @media (max-width: 768px) {
      .nt-header__link {
        padding: 16px 20px !important;
        font-size: 16px !important;
      }
      
      .nt-header__cart-link {
        padding: 16px 20px !important;
        min-width: 56px !important;
        height: 56px !important;
      }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = mobileCSS;
  document.head.appendChild(styleSheet);
  
  // Add haptic feedback for supported devices
  function addHapticFeedback(element) {
    element.addEventListener('touchstart', function() {
      if ('vibrate' in navigator) {
        navigator.vibrate(10); // Short vibration
      }
    });
  }
  
  // Add haptic feedback to buttons
  document.querySelectorAll('button, .button, .btn').forEach(addHapticFeedback);
  
  // Mobile-specific cart enhancement
  function enhanceMobileCart() {
    const cartButton = document.querySelector('.nt-header__cart-link');
    if (cartButton && window.innerWidth <= 768) {
      // Add cart preview on long press
      let pressTimer;
      
      cartButton.addEventListener('touchstart', function() {
        pressTimer = setTimeout(() => {
          showCartPreview();
        }, 500);
      });
      
      cartButton.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
      });
      
      cartButton.addEventListener('touchmove', function() {
        clearTimeout(pressTimer);
      });
    }
  }
  
  function showCartPreview() {
    // Fetch cart contents and show preview
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        if (cart.item_count > 0) {
          const preview = document.createElement('div');
          preview.className = 'cart-preview-mobile';
          preview.innerHTML = `
            <div class="cart-preview-content">
              <h4>Cart (${cart.item_count} items)</h4>
              <div class="cart-preview-items">
                ${cart.items.slice(0, 3).map(item => `
                  <div class="cart-preview-item">
                    <img src="${item.image}" alt="${item.title}" width="40" height="40">
                    <span>${item.title}</span>
                    <span>${item.quantity}x</span>
                  </div>
                `).join('')}
              </div>
              <div class="cart-preview-total">
                Total: ${(cart.total_price / 100).toFixed(2)}
              </div>
            </div>
          `;
          
          document.body.appendChild(preview);
          
          setTimeout(() => {
            if (preview.parentNode) {
              preview.parentNode.removeChild(preview);
            }
          }, 3000);
        }
      });
  }
  
  // Initialize mobile enhancements
  enhanceMobileCart();
  
  // Add pull-to-refresh functionality
  let startY = 0;
  let pullDistance = 0;
  const pullThreshold = 100;
  
  document.addEventListener('touchstart', function(e) {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY;
    }
  });
  
  document.addEventListener('touchmove', function(e) {
    if (window.scrollY === 0 && startY > 0) {
      pullDistance = e.touches[0].clientY - startY;
      
      if (pullDistance > 0 && pullDistance < pullThreshold) {
        // Show pull-to-refresh indicator
        showPullToRefresh(pullDistance);
      }
    }
  });
  
  document.addEventListener('touchend', function() {
    if (pullDistance >= pullThreshold) {
      // Trigger refresh
      window.location.reload();
    }
    
    startY = 0;
    pullDistance = 0;
    hidePullToRefresh();
  });
  
  function showPullToRefresh(distance) {
    let indicator = document.querySelector('.pull-to-refresh-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'pull-to-refresh-indicator';
      indicator.innerHTML = '↓ Pull to refresh';
      document.body.appendChild(indicator);
    }
    
    const opacity = Math.min(distance / pullThreshold, 1);
    indicator.style.opacity = opacity;
  }
  
  function hidePullToRefresh() {
    const indicator = document.querySelector('.pull-to-refresh-indicator');
    if (indicator) {
      indicator.style.opacity = '0';
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
      }, 300);
    }
  }
});

// Global functions for mobile actions
function addToWishlist() {
  // This would integrate with your existing wishlist functionality
  if (window.addToWishlist) {
    window.addToWishlist();
  }
}

function quickAddToCart() {
  // This would integrate with your existing cart functionality
  alert('Quick add to cart - integrate with your existing cart system');
}

// Add CSS for mobile enhancements
const mobileEnhancementCSS = `
  .cart-preview-mobile {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 10000;
    max-width: 300px;
    width: 90%;
  }
  
  .cart-preview-content h4 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 700;
  }
  
  .cart-preview-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
  
  .cart-preview-item:last-child {
    border-bottom: none;
  }
  
  .cart-preview-item img {
    border-radius: 4px;
  }
  
  .cart-preview-total {
    margin-top: 16px;
    font-weight: 700;
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }
  
  .pull-to-refresh-indicator {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 12px 20px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 1000;
    transition: opacity 0.3s ease;
  }
`;
