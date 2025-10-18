// Supabase Analytics Integration
// Make sure it's global
window.trackPageView = function trackPageView(meta = {}) {
  try {
    console.log('[trackPageView] fired', {
      path: location.pathname + location.search,
      title: document.title,
      ...meta
    });

    // Supabase Analytics
    if (window.supabaseClient) {
      trackSupabasePageView(meta);
    }

    // -------- Example integrations (uncomment the ones you use) --------
    // GA4 via gtag
    // if (typeof gtag === 'function') {
    //   gtag('event', 'page_view', {
    //     page_location: location.href,
    //     page_path: location.pathname + location.search,
    //     page_title: document.title
    //   });
    // }

    // Meta Pixel
    // if (typeof fbq === 'function') {
    //   fbq('track', 'PageView');
    // }

    // TikTok
    // if (typeof ttq !== 'undefined' && ttq.track) {
    //   ttq.track('ViewContent');
    // }

    // Pinterest
    // if (typeof pintrk === 'function') {
    //   pintrk('track', 'pagevisit');
    // }

  } catch (e) {
    console.warn('[trackPageView] error', e);
  }
};

// Supabase Page View Tracking
async function trackSupabasePageView(meta = {}) {
  try {
    if (!window.supabaseClient) {
      console.warn('📊 Supabase client not available');
      return;
    }

    // Use the global Supabase client directly
    const client = window.supabaseClient;
    if (!client) {
      console.log('📊 Supabase client not ready, skipping tracking');
      return;
    }

    // Get additional context
    const isProductPage = window.location.pathname.includes('/products/');
    const isCollectionPage = window.location.pathname.includes('/collections/');
    const isCartPage = window.location.pathname.includes('/cart');
    const isCheckoutPage = window.location.pathname.includes('/checkout');
    
    // Get product info if on product page
    let productInfo = {};
    if (isProductPage) {
      const productTitle = document.querySelector('h1')?.textContent || '';
      const productPrice = document.querySelector('.price')?.textContent || '';
      const productImages = document.querySelectorAll('.product-image img');
      productInfo = {
        product_title: productTitle,
        product_price: productPrice,
        image_count: productImages.length
      };
    }
    
    // Build tracking data object
    const trackingData = {
      page: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
      page_type: isProductPage ? 'product' : isCollectionPage ? 'collection' : isCartPage ? 'cart' : isCheckoutPage ? 'checkout' : 'other',
      source: meta.source || 'analytics.js',
      ...meta
    };
    
    // Add product info if available
    if (productInfo.product_title) trackingData.product_title = productInfo.product_title;
    if (productInfo.product_price) trackingData.product_price = productInfo.product_price;
    if (productInfo.image_count) trackingData.image_count = productInfo.image_count;
    
    // Track event using proper Supabase insert method
    const { data, error } = await window.supabaseClient
      .from('analytics_events')
      .insert([trackingData]);
    
    if (error) {
      console.error('📊 Supabase tracking failed:', error);
      console.error('📊 Error details:', {
        message: error.message,
        code: error.code,
        hint: error.hint
      });
    } else {
      console.log('📊 Page view tracked successfully:', window.location.pathname);
      console.log('📊 Insert result:', data);
    }
  } catch (error) {
    console.error('📊 Page view tracking exception:', error);
    console.error('📊 Error stack:', error.stack);
  }
}

// Fire once after full load
window.addEventListener('load', function () {
  window.trackPageView({source: 'load'});
});

// Track page views on navigation (for SPAs)
let lastUrl = window.location.href;
new MutationObserver(() => {
  const url = window.location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    window.trackPageView({source: 'navigation'});
  }
}).observe(document, { subtree: true, childList: true });

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { trackPageView };
}

