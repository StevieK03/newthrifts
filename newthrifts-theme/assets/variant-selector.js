/**
 * Universal Variant Selector for Shopify
 * Handles variant selection, validation, and cart functionality
 * Ensures correct variants are always added to cart
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    debug: true,
    validation: {
      requireAllOptions: true,
      checkAvailability: true,
      showAlerts: true
    }
  };

  // Utility functions
  function log(message, data = null) {
    if (CONFIG.debug) {
      console.log('[VariantSelector]', message, data || '');
    }
  }

  function showAlert(message, type = 'error') {
    if (CONFIG.validation.showAlerts) {
      alert(message);
    }
    log(`Alert: ${message}`, { type });
  }

  // Main VariantSelector class
  class VariantSelector {
    constructor(form, productData) {
      this.form = form;
      this.productData = productData;
      this.selectors = form.querySelectorAll('.single-option-selector');
      this.variantIdInput = form.querySelector('input[name="id"]');
      this.submitButton = form.querySelector('button[type="submit"]');
      this.priceElement = form.querySelector('[data-product-price]');
      
      this.init();
    }

    init() {
      log('Initializing VariantSelector', {
        form: this.form.id,
        selectors: this.selectors.length,
        variants: this.productData.variants.length
      });

      this.setupEventListeners();
      this.syncVariant();
    }

    setupEventListeners() {
      // Listen for option changes
      this.selectors.forEach(selector => {
        selector.addEventListener('change', () => {
          log('Option changed', { selector: selector.id, value: selector.value });
          this.syncVariant();
        });
      });

      // Listen for form submission
      this.form.addEventListener('submit', (e) => {
        if (!this.validateBeforeSubmit()) {
          e.preventDefault();
          return false;
        }
      });

      // Listen for swatch clicks
      this.form.addEventListener('click', (e) => {
        if (e.target.closest('[data-swatch]')) {
          this.handleSwatchClick(e);
        }
      });
    }

    handleSwatchClick(event) {
      const swatch = event.target.closest('[data-swatch]');
      const optionIndex = parseInt(swatch.dataset.optionIndex);
      const value = swatch.dataset.value;
      
      log('Swatch clicked', { optionIndex, value });

      // Update the corresponding selector
      const selector = this.form.querySelector(`select[data-index="option${optionIndex + 1}"]`);
      if (selector) {
        selector.value = value;
        selector.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    getSelectedOptions() {
      const selected = [];
      this.selectors.forEach(selector => {
        const index = this.getOptionIndex(selector);
        if (index !== -1) {
          selected[index] = selector.value;
        }
      });
      return selected;
    }

    getOptionIndex(selector) {
      const indexAttr = selector.getAttribute('data-index') || '';
      const match = indexAttr.match(/option(\d+)/i);
      return match ? parseInt(match[1], 10) - 1 : -1;
    }

    findMatchingVariant(selectedOptions) {
      return this.productData.variants.find(variant => {
        return variant.options.every((option, index) => {
          return option === selectedOptions[index];
        });
      });
    }

    syncVariant() {
      const selectedOptions = this.getSelectedOptions();
      const variant = this.findMatchingVariant(selectedOptions);

      log('Syncing variant', { selectedOptions, variant: variant ? variant.id : 'none' });

      if (variant) {
        this.updateVariant(variant);
      } else {
        this.handleNoVariant(selectedOptions);
      }
    }

    updateVariant(variant) {
      // Update variant ID
      if (this.variantIdInput) {
        this.variantIdInput.value = variant.id;
      }

      // Update price
      if (this.priceElement) {
        this.priceElement.textContent = this.formatPrice(variant.price);
      }

      // Update submit button
      if (this.submitButton) {
        this.submitButton.disabled = !variant.available;
        this.submitButton.textContent = variant.available ? 'Add to cart' : 'Sold out';
      }

      // Update URL
      this.updateURL(variant.id);

      log('Variant updated', { id: variant.id, available: variant.available });
    }

    handleNoVariant(selectedOptions) {
      log('No matching variant found', { selectedOptions });

      if (this.submitButton) {
        this.submitButton.disabled = true;
        this.submitButton.textContent = 'Select options';
      }

      // Check for missing options
      const missingOptions = [];
      selectedOptions.forEach((option, index) => {
        if (!option || option === '') {
          missingOptions.push(this.productData.options[index]);
        }
      });

      if (missingOptions.length > 0) {
        log('Missing options detected', { missingOptions });
      }
    }

    validateBeforeSubmit() {
      const selectedOptions = this.getSelectedOptions();
      
      // Check for missing options
      if (CONFIG.validation.requireAllOptions) {
        const missingOptions = [];
        selectedOptions.forEach((option, index) => {
          if (!option || option === '') {
            missingOptions.push(this.productData.options[index]);
          }
        });

        if (missingOptions.length > 0) {
          showAlert('Please select: ' + missingOptions.join(', '));
          return false;
        }
      }

      // Check variant ID
      if (!this.variantIdInput || !this.variantIdInput.value) {
        showAlert('Please select all product options');
        return false;
      }

      // Check variant availability
      if (CONFIG.validation.checkAvailability) {
        const variant = this.productData.variants.find(v => 
          String(v.id) === String(this.variantIdInput.value)
        );

        if (!variant) {
          showAlert('Selected options are not available');
          return false;
        }

        if (!variant.available) {
          showAlert('This variant is sold out');
          return false;
        }
      }

      log('Form validation passed');
      return true;
    }

    formatPrice(price) {
      try {
        return (price / 100).toLocaleString(undefined, {
          style: 'currency',
          currency: window.Shopify?.currency || 'USD'
        });
      } catch (e) {
        return (price / 100).toFixed(2);
      }
    }

    updateURL(variantId) {
      if (window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variantId);
        window.history.replaceState({}, '', url);
      }
    }
  }

  // Auto-initialize for existing forms
  function initializeForms() {
    const forms = document.querySelectorAll('form[action*="/cart/add"]');
    
    forms.forEach(form => {
      const productData = window.productData || getProductDataFromForm(form);
      
      if (productData && productData.variants) {
        new VariantSelector(form, productData);
        log('Initialized form', { formId: form.id });
      }
    });
  }

  function getProductDataFromForm(form) {
    // Try to extract product data from the form or page
    const script = document.querySelector('script[type="application/json"][data-product-json]');
    if (script) {
      try {
        return JSON.parse(script.textContent);
      } catch (e) {
        log('Error parsing product data', e);
      }
    }
    return null;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForms);
  } else {
    initializeForms();
  }

  // Export for manual initialization
  window.VariantSelector = VariantSelector;

})();

