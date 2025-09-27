/**
 * Refined Model Detection System
 * Use this when you want to detect if products have models
 */

class ModelDetector {
  constructor() {
    this.modelIndicators = [
      'model', 'wearing', 'person', 'man', 'woman', 'child', 'baby', 'toddler',
      'portrait', 'lifestyle', 'styled', 'fashion', 'worn', 'wears',
      'male', 'female', 'guy', 'girl', 'boy', 'lady', 'gentleman',
      'human', 'people', 'customer', 'style', 'outfit', 'ensemble'
    ];
    
    this.productOnlyIndicators = [
      'product', 'shirt', 'tee', 'tank', 'mug', 'costume', 'apparel', 'clothing',
      'flat', 'lay', 'item', 'merchandise'
    ];
  }

  /**
   * Check if a product already has a model
   */
  hasModel(productCard) {
    const productImage = productCard.querySelector('.product-card__img');
    if (!productImage) return false;
    
    const imageSrc = productImage.src;
    const imageAlt = productImage.alt;
    const productTitle = productCard.querySelector('h3')?.textContent || '';
    
    // Check alt text for model indicators
    const altText = imageAlt.toLowerCase();
    const hasModelInAlt = this.modelIndicators.some(indicator => 
      altText.includes(indicator)
    );
    
    // Check if image URL suggests a model shot
    const isLifestyleShot = imageSrc.includes('lifestyle') || 
                           imageSrc.includes('model') || 
                           imageSrc.includes('wearing') ||
                           imageSrc.includes('portrait') ||
                           imageSrc.includes('person');
    
    // Check image orientation (models are often portrait)
    const isPortraitOrientation = productImage.naturalHeight > productImage.naturalWidth;
    
    // Check for person-related keywords
    const hasPersonKeywords = this.modelIndicators.some(indicator => 
      altText.includes(indicator) || productTitle.toLowerCase().includes(indicator)
    );
    
    // Check if it's clearly a product-only image
    const isProductOnly = this.productOnlyIndicators.some(indicator => 
      altText.includes(indicator) || productTitle.toLowerCase().includes(indicator)
    ) && !hasPersonKeywords;
    
    const hasModel = hasModelInAlt || isLifestyleShot || isPortraitOrientation || hasPersonKeywords;
    
    console.log(`Model detection for "${productTitle}":`, {
      hasModelInAlt,
      isLifestyleShot,
      isPortraitOrientation,
      hasPersonKeywords,
      isProductOnly,
      hasModel
    });
    
    return hasModel;
  }

  /**
   * Get all products without models
   */
  getProductsWithoutModels() {
    const productCards = document.querySelectorAll('.product-card');
    const productsWithoutModels = [];
    
    productCards.forEach(card => {
      if (!this.hasModel(card)) {
        const productTitle = card.querySelector('h3')?.textContent || '';
        const productId = card.dataset.productId;
        productsWithoutModels.push({
          id: productId,
          title: productTitle,
          element: card
        });
      }
    });
    
    return productsWithoutModels;
  }

  /**
   * Get all products with models
   */
  getProductsWithModels() {
    const productCards = document.querySelectorAll('.product-card');
    const productsWithModels = [];
    
    productCards.forEach(card => {
      if (this.hasModel(card)) {
        const productTitle = card.querySelector('h3')?.textContent || '';
        const productId = card.dataset.productId;
        productsWithModels.push({
          id: productId,
          title: productTitle,
          element: card
        });
      }
    });
    
    return productsWithModels;
  }

  /**
   * Log model detection results
   */
  logModelDetection() {
    const productsWithoutModels = this.getProductsWithoutModels();
    const productsWithModels = this.getProductsWithModels();
    
    console.log('=== MODEL DETECTION RESULTS ===');
    console.log(`Products WITH models (${productsWithModels.length}):`, productsWithModels);
    console.log(`Products WITHOUT models (${productsWithoutModels.length}):`, productsWithoutModels);
    
    return {
      withModels: productsWithModels,
      withoutModels: productsWithoutModels
    };
  }
}

// Initialize global instance
window.ModelDetector = new ModelDetector();

// Auto-run detection on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Model Detector initialized');
  // Uncomment the line below to automatically log detection results
  // window.ModelDetector.logModelDetection();
});

// Export for manual use
window.checkForModels = function() {
  return window.ModelDetector.logModelDetection();
};
