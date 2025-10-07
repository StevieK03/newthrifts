/**
 * Cart Integration for T-shirt Mockup
 * Handles design data persistence in cart line items
 * 
 * Features:
 * - Design metadata storage
 * - Image data compression
 * - Cart line item properties
 * - Design restoration on page load
 */

class CartIntegration {
  constructor() {
    this.designDataKey = 'design_data';
    this.imageDataKey = 'image_data';
    this.maxImageSize = 50000; // 50KB max for cart properties
    this.compressionQuality = 0.7;
    
    this.init();
  }

  init() {
    this.bindCartEvents();
    this.restoreDesignFromCart();
  }

  bindCartEvents() {
    // Listen for cart updates
    document.addEventListener('cart:updated', () => {
      this.handleCartUpdate();
    });

    // Listen for design changes
    document.addEventListener('design:updated', (event) => {
      this.saveDesignToCart(event.detail);
    });

    // Listen for page load
    document.addEventListener('DOMContentLoaded', () => {
      this.restoreDesignFromCart();
    });
  }

  saveDesignToCart(designData) {
    try {
      const cartData = this.prepareCartData(designData);
      
      // Add to cart as line item properties
      this.addToCartWithProperties(cartData);
      
      console.log('✅ Design data saved to cart:', cartData);
    } catch (error) {
      console.error('❌ Failed to save design to cart:', error);
    }
  }

  prepareCartData(designData) {
    const cartData = {
      design_type: 'custom_tshirt',
      design_version: '2.0',
      timestamp: Date.now(),
      placement: {
        top: designData.placementState?.topPct || 45,
        left: designData.placementState?.leftPct || 25,
        width: designData.placementState?.widthPct || 60,
        rotation: designData.placementState?.rotateDeg || 0
      },
      design: {
        text: designData.designState?.text || 'Your Design Here',
        fontSize: designData.designState?.fontSize || 32,
        fontFamily: designData.designState?.fontFamily || "'Bebas Neue', sans-serif",
        textColor: designData.designState?.textColor || '#000000',
        effect: designData.designState?.effect || 'none'
      },
      mockup: {
        view: designData.state?.view || 'front',
        color: designData.state?.color || 'white',
        scale: designData.state?.currentScale || 100
      }
    };

    // Handle uploaded image
    if (designData.hasUploadedDesign && designData.imageData) {
      cartData.uploaded_image = this.compressImageData(designData.imageData);
    }

    return cartData;
  }

  compressImageData(imageData) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions to fit within size limit
        const maxDimension = 200;
        const scale = Math.min(maxDimension / img.width, maxDimension / img.height);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Compress image
        const compressedData = canvas.toDataURL('image/jpeg', this.compressionQuality);
        
        // Check if still too large
        if (compressedData.length > this.maxImageSize) {
          // Further compress
          const furtherCompressed = canvas.toDataURL('image/jpeg', 0.5);
          resolve(furtherCompressed);
        } else {
          resolve(compressedData);
        }
      };
      
      img.src = imageData;
    });
  }

  async addToCartWithProperties(cartData) {
    try {
      const formData = new FormData();
      formData.append('id', this.getProductVariantId());
      formData.append('quantity', 1);
      
      // Add design properties
      Object.entries(cartData).forEach(([key, value]) => {
        if (typeof value === 'object') {
          formData.append(`properties[${key}]`, JSON.stringify(value));
        } else {
          formData.append(`properties[${key}]`, value);
        }
      });

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Added to cart with design data:', result);
        
        // Trigger cart update event
        document.dispatchEvent(new CustomEvent('cart:updated', {
          detail: { cartData, result }
        }));
      } else {
        throw new Error(`Cart add failed: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      throw error;
    }
  }

  getProductVariantId() {
    // Get variant ID from product form or URL
    const variantInput = document.querySelector('input[name="id"]');
    if (variantInput) {
      return variantInput.value;
    }
    
    // Fallback: get from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('variant') || 'default';
  }

  restoreDesignFromCart() {
    try {
      const cartData = this.getDesignFromCart();
      if (cartData) {
        this.applyDesignToMockup(cartData);
        console.log('✅ Design restored from cart:', cartData);
      }
    } catch (error) {
      console.error('❌ Failed to restore design from cart:', error);
    }
  }

  getDesignFromCart() {
    // Check for design data in cart line items
    const cartItems = this.getCartItems();
    const designItem = cartItems.find(item => 
      item.properties && 
      item.properties.design_type === 'custom_tshirt'
    );

    if (designItem && designItem.properties) {
      return this.parseCartData(designItem.properties);
    }

    return null;
  }

  getCartItems() {
    // Get cart data from Shopify
    return fetch('/cart.js')
      .then(response => response.json())
      .then(cart => cart.items)
      .catch(error => {
        console.error('❌ Failed to get cart items:', error);
        return [];
      });
  }

  parseCartData(properties) {
    const designData = {
      placementState: {
        topPct: parseFloat(properties.placement?.top) || 45,
        leftPct: parseFloat(properties.placement?.left) || 25,
        widthPct: parseFloat(properties.placement?.width) || 60,
        rotateDeg: parseFloat(properties.placement?.rotation) || 0
      },
      designState: {
        text: properties.design?.text || 'Your Design Here',
        fontSize: parseInt(properties.design?.fontSize) || 32,
        fontFamily: properties.design?.fontFamily || "'Bebas Neue', sans-serif",
        textColor: properties.design?.textColor || '#000000',
        effect: properties.design?.effect || 'none'
      },
      state: {
        view: properties.mockup?.view || 'front',
        color: properties.mockup?.color || 'white',
        currentScale: parseInt(properties.mockup?.scale) || 100
      },
      hasUploadedDesign: !!properties.uploaded_image
    };

    if (properties.uploaded_image) {
      designData.imageData = properties.uploaded_image;
    }

    return designData;
  }

  applyDesignToMockup(designData) {
    // Dispatch event to mockup engine
    document.dispatchEvent(new CustomEvent('design:restore', {
      detail: designData
    }));
  }

  handleCartUpdate() {
    // Refresh design data when cart is updated
    this.restoreDesignFromCart();
  }

  // Utility methods
  validateDesignData(designData) {
    const required = ['placementState', 'designState', 'state'];
    return required.every(key => designData.hasOwnProperty(key));
  }

  exportDesignData() {
    const designData = this.getDesignFromCart();
    if (designData) {
      const dataStr = JSON.stringify(designData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `design-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  }

  importDesignData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const designData = JSON.parse(e.target.result);
          if (this.validateDesignData(designData)) {
            this.applyDesignToMockup(designData);
            resolve(designData);
          } else {
            reject(new Error('Invalid design data format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

// Initialize cart integration
document.addEventListener('DOMContentLoaded', function() {
  window.cartIntegration = new CartIntegration();
});

// Export for global access
window.CartIntegration = CartIntegration;
