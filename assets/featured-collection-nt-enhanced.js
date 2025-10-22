/**
 * Featured Collection NT - Enhanced JavaScript
 * Handles interactive features and animations
 */

class FeaturedCollectionNT {
  constructor(section) {
    this.section = section;
    this.sectionId = section.dataset.sectionId;
    this.wishlistItems = this.getWishlistFromStorage();
    
    this.init();
  }

  init() {
    this.setupQuickAdd();
    this.setupWishlist();
    this.setupQuickView();
    this.setupSwatchInteractions();
    this.setupIntersectionObserver();
    this.setupKeyboardNavigation();
  }

  /**
   * Quick Add to Cart functionality
   */
  setupQuickAdd() {
    const addButtons = this.section.querySelectorAll('[data-product-id]');
    
    addButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const variantId = button.dataset.productId;
        
        if (!variantId) return;
        
        try {
          button.classList.add('is-loading');
          await this.addToCart(variantId);
          this.showSuccessNotification('Added to cart!');
          this.animateCartIcon();
        } catch (error) {
          this.showErrorNotification('Failed to add item');
          console.error('Add to cart error:', error);
        } finally {
          button.classList.remove('is-loading');
        }
      });
    });
  }

  /**
   * Add item to cart via Shopify API
   */
  async addToCart(variantId, quantity = 1) {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }

    const data = await response.json();
    
    // Trigger custom event for cart updates
    document.dispatchEvent(new CustomEvent('cart:updated', { 
      detail: data 
    }));
    
    return data;
  }

  /**
   * Wishlist functionality
   */
  setupWishlist() {
    const wishlistButtons = this.section.querySelectorAll('[data-wishlist-add]');
    
    wishlistButtons.forEach(button => {
      const productId = button.dataset.wishlistAdd;
      
      // Set initial state
      if (this.wishlistItems.includes(productId)) {
        button.classList.add('is-active');
        button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Add', 'Remove'));
      }
      
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleWishlist(productId, button);
      });
    });
  }

  toggleWishlist(productId, button) {
    const isActive = button.classList.contains('is-active');
    
    if (isActive) {
      this.removeFromWishlist(productId);
      button.classList.remove('is-active');
      button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Remove', 'Add'));
      this.showSuccessNotification('Removed from wishlist');
    } else {
      this.addToWishlist(productId);
      button.classList.add('is-active');
      button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Add', 'Remove'));
      this.showSuccessNotification('Added to wishlist');
      this.animateHeart(button);
    }
  }

  addToWishlist(productId) {
    if (!this.wishlistItems.includes(productId)) {
      this.wishlistItems.push(productId);
      this.saveWishlistToStorage();
      
      // Trigger custom event
      document.dispatchEvent(new CustomEvent('wishlist:updated', {
        detail: { 
          action: 'add',
          productId: productId,
          items: this.wishlistItems 
        }
      }));
    }
  }

  removeFromWishlist(productId) {
    this.wishlistItems = this.wishlistItems.filter(id => id !== productId);
    this.saveWishlistToStorage();
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('wishlist:updated', {
      detail: { 
        action: 'remove',
        productId: productId,
        items: this.wishlistItems 
      }
    }));
  }

  getWishlistFromStorage() {
    try {
      const stored = localStorage.getItem('nt-wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading wishlist:', error);
      return [];
    }
  }

  saveWishlistToStorage() {
    try {
      localStorage.setItem('nt-wishlist', JSON.stringify(this.wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }

  /**
   * Quick View Modal functionality
   */
  setupQuickView() {
    const quickViewButtons = this.section.querySelectorAll('[data-quick-view]');
    
    quickViewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.dataset.quickView;
        this.openQuickView(productId);
      });
    });
  }

  async openQuickView(productId) {
    // Trigger custom event that can be caught by a modal component
    document.dispatchEvent(new CustomEvent('quickview:open', {
      detail: { productId: productId }
    }));
    
    // If no modal component exists, fall back to opening product page
    // This allows the theme to handle quick view if implemented
  }

  /**
   * Color Swatch Interactions
   */
  setupSwatchInteractions() {
    const swatches = this.section.querySelectorAll('.nt-swatch');
    
    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = swatch.closest('.nt-product-card');
        const allSwatches = productCard.querySelectorAll('.nt-swatch');
        
        // Remove active state from all swatches
        allSwatches.forEach(s => s.classList.remove('is-active'));
        
        // Add active state to clicked swatch
        swatch.classList.add('is-active');
        
        // Optionally update product image based on color
        // This would require additional data attributes on swatches
      });
    });
  }

  /**
   * Intersection Observer for scroll animations
   */
  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50); // Stagger animation
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const items = this.section.querySelectorAll('.nt-featured-collection__item');
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(item);
    });
  }

  /**
   * Keyboard Navigation
   */
  setupKeyboardNavigation() {
    const cards = this.section.querySelectorAll('.nt-product-card');
    
    cards.forEach((card, index) => {
      card.addEventListener('keydown', (e) => {
        let nextCard;
        
        switch(e.key) {
          case 'ArrowRight':
            nextCard = cards[index + 1];
            break;
          case 'ArrowLeft':
            nextCard = cards[index - 1];
            break;
          case 'ArrowDown':
            const cols = getComputedStyle(this.section.querySelector('.nt-featured-collection__grid'))
              .getPropertyValue('grid-template-columns').split(' ').length;
            nextCard = cards[index + cols];
            break;
          case 'ArrowUp':
            const colsUp = getComputedStyle(this.section.querySelector('.nt-featured-collection__grid'))
              .getPropertyValue('grid-template-columns').split(' ').length;
            nextCard = cards[index - colsUp];
            break;
        }
        
        if (nextCard) {
          e.preventDefault();
          nextCard.querySelector('a').focus();
        }
      });
    });
  }

  /**
   * Notification System
   */
  showSuccessNotification(message) {
    this.showNotification(message, 'success');
  }

  showErrorNotification(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.nt-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `nt-notification nt-notification--${type}`;
    notification.innerHTML = `
      <div class="nt-notification__content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${type === 'success' 
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
          }
        </svg>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('is-visible'), 10);

    // Auto remove
    setTimeout(() => {
      notification.classList.remove('is-visible');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Animation helpers
   */
  animateCartIcon() {
    const cartIcon = document.querySelector('.header__cart-icon, [data-cart-icon]');
    if (cartIcon) {
      cartIcon.classList.add('animate-bounce');
      setTimeout(() => cartIcon.classList.remove('animate-bounce'), 600);
    }
  }

  animateHeart(button) {
    const svg = button.querySelector('svg');
    if (svg) {
      svg.style.animation = 'heartBeat 0.3s ease';
      setTimeout(() => {
        svg.style.animation = '';
      }, 300);
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFeaturedCollections);
} else {
  initFeaturedCollections();
}

function initFeaturedCollections() {
  const sections = document.querySelectorAll('.nt-featured-collection');
  sections.forEach(section => {
    new FeaturedCollectionNT(section);
  });
}

// Shopify section events
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const section = event.target.querySelector('.nt-featured-collection');
    if (section) {
      new FeaturedCollectionNT(section);
    }
  });
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .nt-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    transform: translateX(400px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nt-notification.is-visible {
    transform: translateX(0);
  }

  .nt-notification__content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .nt-notification--success {
    border-left: 4px solid #10b981;
  }

  .nt-notification--success svg {
    color: #10b981;
  }

  .nt-notification--error {
    border-left: 4px solid #ef4444;
  }

  .nt-notification--error svg {
    color: #ef4444;
  }

  @keyframes heartBeat {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.3); }
    50% { transform: scale(1.1); }
  }

  .animate-bounce {
    animation: bounce 0.6s ease;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (max-width: 640px) {
    .nt-notification {
      left: 20px;
      right: 20px;
      transform: translateY(-100px);
    }
    
    .nt-notification.is-visible {
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(notificationStyles);
