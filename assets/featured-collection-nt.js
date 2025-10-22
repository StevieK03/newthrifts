/**
 * Featured Collection (NT) - Interactive JavaScript
 * Handles quick view, wishlist, and add to cart functionality
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initQuickAdd();
    initQuickView();
    initWishlist();
  }

  /**
   * Quick Add to Cart
   */
  function initQuickAdd() {
    const addButtons = document.querySelectorAll('.nt-product-card__add-btn[data-product-id]');
    
    addButtons.forEach(button => {
      button.addEventListener('click', handleQuickAdd);
    });
  }

  async function handleQuickAdd(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const variantId = button.dataset.productId;
    
    if (!variantId || button.disabled) return;

    // Visual feedback
    const originalHTML = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 0.6s linear infinite;">
        <circle cx="12" cy="12" r="10" opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
      </svg>
      <span>Adding...</span>
    `;

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: variantId,
          quantity: 1
        })
      });

      if (!response.ok) throw new Error('Failed to add to cart');

      const data = await response.json();
      
      // Success feedback
      button.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Added!</span>
      `;
      button.style.background = 'var(--nt-accent)';
      button.style.color = '#0F172A';

      // Update cart count if element exists
      updateCartCount();

      // Trigger cart drawer if available
      if (window.theme && window.theme.cart && window.theme.cart.open) {
        setTimeout(() => window.theme.cart.open(), 300);
      }

      // Reset button after delay
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.background = '';
        button.style.color = '';
      }, 2000);

    } catch (error) {
      console.error('Add to cart error:', error);
      
      // Error feedback
      button.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>Error</span>
      `;

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
      }, 2000);
    }
  }

  /**
   * Update cart count in header
   */
  async function updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      const cartCountElements = document.querySelectorAll('[data-cart-count], .cart-count');
      cartCountElements.forEach(el => {
        el.textContent = cart.item_count;
        if (cart.item_count > 0) {
          el.style.display = '';
        }
      });

      // Trigger cart update event
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  }

  /**
   * Quick View Modal
   */
  function initQuickView() {
    const quickViewButtons = document.querySelectorAll('[data-quick-view]');
    
    quickViewButtons.forEach(button => {
      button.addEventListener('click', handleQuickView);
    });
  }

  async function handleQuickView(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const productId = button.dataset.quickView;
    
    if (!productId) return;

    // Visual feedback
    button.style.transform = 'scale(1.1) rotate(360deg)';
    setTimeout(() => button.style.transform = '', 300);

    try {
      // Fetch product data
      const response = await fetch(`/products/${productId}.js`);
      const product = await response.json();
      
      // Create or show quick view modal
      showQuickViewModal(product);
    } catch (error) {
      console.error('Quick view error:', error);
      // Fallback: navigate to product page
      window.location.href = `/products/${productId}`;
    }
  }

  function showQuickViewModal(product) {
    // Check if modal already exists
    let modal = document.getElementById('nt-quick-view-modal');
    
    if (!modal) {
      modal = createQuickViewModal();
      document.body.appendChild(modal);
    }

    // Populate modal content
    const modalContent = modal.querySelector('.nt-quick-view__content');
    modalContent.innerHTML = `
      <button class="nt-quick-view__close" aria-label="Close quick view">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="nt-quick-view__product">
        <div class="nt-quick-view__image">
          <img src="${product.featured_image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="nt-quick-view__details">
          <h3>${product.title}</h3>
          <div class="nt-quick-view__price">
            ${product.compare_at_price > product.price ? `<span class="price-compare">${formatMoney(product.compare_at_price)}</span>` : ''}
            <span class="price-current">${formatMoney(product.price)}</span>
          </div>
          <p>${product.description ? product.description.substring(0, 200) + '...' : ''}</p>
          <a href="${product.url}" class="nt-quick-view__cta">View Full Details</a>
        </div>
      </div>
    `;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Setup close handlers
    const closeBtn = modal.querySelector('.nt-quick-view__close');
    const overlay = modal.querySelector('.nt-quick-view__overlay');
    
    closeBtn.addEventListener('click', () => closeQuickView(modal));
    overlay.addEventListener('click', () => closeQuickView(modal));
    
    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeQuickView(modal);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  function createQuickViewModal() {
    const modal = document.createElement('div');
    modal.id = 'nt-quick-view-modal';
    modal.className = 'nt-quick-view';
    modal.innerHTML = `
      <div class="nt-quick-view__overlay"></div>
      <div class="nt-quick-view__content"></div>
      <style>
        .nt-quick-view {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .nt-quick-view.active {
          opacity: 1;
          pointer-events: all;
        }
        .nt-quick-view__overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
        }
        .nt-quick-view__content {
          position: relative;
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          background: var(--nt-surface);
          border-radius: 20px;
          padding: 32px;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(39, 225, 193, 0.2);
        }
        .nt-quick-view__close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--nt-border);
          border-radius: 50%;
          color: var(--nt-text);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        .nt-quick-view__close:hover {
          background: var(--nt-accent);
          color: #0F172A;
          border-color: var(--nt-accent);
        }
        .nt-quick-view__product {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        .nt-quick-view__image img {
          width: 100%;
          border-radius: 12px;
        }
        .nt-quick-view__details h3 {
          margin: 0 0 16px 0;
          font-size: 28px;
          color: var(--nt-text);
        }
        .nt-quick-view__price {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 24px;
          font-weight: 700;
        }
        .nt-quick-view__price .price-current {
          color: var(--nt-accent);
        }
        .nt-quick-view__price .price-compare {
          color: var(--nt-text-dim);
          text-decoration: line-through;
          font-size: 18px;
        }
        .nt-quick-view__details p {
          color: var(--nt-text-dim);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .nt-quick-view__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--nt-accent);
          color: #0F172A;
          text-decoration: none;
          font-weight: 600;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .nt-quick-view__cta:hover {
          box-shadow: 0 0 20px rgba(39, 225, 193, 0.5);
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .nt-quick-view__product {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;
    return modal;
  }

  function closeQuickView(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * Wishlist functionality
   */
  function initWishlist() {
    const wishlistButtons = document.querySelectorAll('[data-wishlist-add]');
    
    wishlistButtons.forEach(button => {
      // Check if already in wishlist
      const productId = button.dataset.wishlistAdd;
      if (isInWishlist(productId)) {
        button.dataset.active = 'true';
      }

      button.addEventListener('click', handleWishlist);
    });
  }

  function handleWishlist(e) {
    e.preventDefault();
    const button = e.currentTarget;
    const productId = button.dataset.wishlistAdd;
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      button.dataset.active = 'false';
    } else {
      addToWishlist(productId);
      button.dataset.active = 'true';
    }

    // Animation feedback
    button.style.transform = 'scale(1.2)';
    setTimeout(() => button.style.transform = '', 200);
  }

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('nt-wishlist') || '[]');
    } catch {
      return [];
    }
  }

  function isInWishlist(productId) {
    return getWishlist().includes(String(productId));
  }

  function addToWishlist(productId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(String(productId))) {
      wishlist.push(String(productId));
      localStorage.setItem('nt-wishlist', JSON.stringify(wishlist));
      document.dispatchEvent(new CustomEvent('wishlist:updated', { detail: wishlist }));
    }
  }

  function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(id => id !== String(productId));
    localStorage.setItem('nt-wishlist', JSON.stringify(wishlist));
    document.dispatchEvent(new CustomEvent('wishlist:updated', { detail: wishlist }));
  }

  /**
   * Utility: Format money
   */
  function formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    return `$${amount}`;
  }

  /**
   * Add spin animation for loading states
   */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

})();

