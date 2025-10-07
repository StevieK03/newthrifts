/* swatch.js — robust version with correct closures */

// Signal CSS that JS is running (hides only the Color select)
document.documentElement.classList.add('swatch-ready');

(function () {
  const NAME_TO_HEX = {
    black: '#000', white: '#fff', red: '#e11d48', blue: '#2563eb', green: '#16a34a',
    yellow: '#eab308', orange: '#f97316', purple: '#7c3aed', pink: '#ec4899',
    gray: '#6b7280', grey: '#6b7280', brown: '#92400e', beige: '#f5f5dc', navy: '#0f172a'
  };

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  function setSelectValueForOptionIndex(form, optIndex, value) {
    const sel = form.querySelector(`.single-option-selector[data-index="option${optIndex + 1}"]`);
    if (!sel) return;
    sel.value = value;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function refreshState(group, activeValue) {
    $$('[data-swatch]', group).forEach((btn) => {
      const available = btn.getAttribute('data-available') === 'true';
      btn.classList.toggle('is-selected', btn.getAttribute('data-value') === activeValue);
      btn.classList.toggle('is-soldout', !available);
    });
  }

  function handleSwatchClick(evt) {
    console.log('[swatch] handleSwatchClick called');
    const btn = evt.currentTarget;
    const form = btn.closest('form');
    
    const optIndex  = parseInt(btn.getAttribute('data-option-index'), 10);
    const value     = btn.getAttribute('data-value');
    const variantId = btn.getAttribute('data-variant-id');
    const available = btn.getAttribute('data-available') === 'true';
    const mediaId   = btn.getAttribute('data-media-id') || null;
    const thumb     = btn.getAttribute('data-img') || null;
    const priceStr  = btn.getAttribute('data-price') || null;
    
    console.log('[swatch] Swatch data:', { value, variantId, available, thumb, priceStr, hasForm: !!form });

    // Handle form-based swatches (product pages)
    if (form) {
      // 1) Drive the native select (triggers existing inline handler)
      setSelectValueForOptionIndex(form, optIndex, value);

      // 2) Let the syncVariant function handle variant ID selection
      // (Don't override variant ID here - let the proper variant matching logic work)
      
      // 3) Update price/button will be handled by syncVariant function
      console.log('[swatch] Color selected:', value, 'Letting syncVariant handle variant matching');
    } else {
      // Handle homepage swatches (no form context)
      // Update price in the same product card
      const card = btn.closest('.product-card');
      if (card) {
        const priceEl = card.querySelector('[data-product-price]');
        if (priceEl && priceStr) priceEl.textContent = priceStr;
      }
    }

    // 4) Swap image (prefer data-media-id; fallback to #MainProductImage or #ProductImage-*)
    if (thumb) {
      console.log('[swatch] Attempting to swap image:', thumb);
      if (mediaId) {
        console.log('[swatch] Has mediaId:', mediaId);
        const mediaEl = document.querySelector(`[data-media-id="${mediaId}"] img`) || document.getElementById('MainProductImage');
        if (mediaEl) {
          console.log('[swatch] Found media element, updating src');
          mediaEl.src = thumb;
        } else {
          console.log('[swatch] No media element found for mediaId:', mediaId, 'falling back to product card logic');
          // Fall back to product card logic when mediaId doesn't work
          const card = btn.closest('.product-card');
          if (card) {
            const cardImg = card.querySelector('img.product-card__img');
            if (cardImg) {
              console.log('[swatch] Found product card image, updating src');
              cardImg.src = thumb;
            } else {
              console.log('[swatch] No product card image found, available images:', card.querySelectorAll('img'));
            }
          } else {
            console.log('[swatch] No product card found');
          }
        }
      } else {
        // Try MainProductImage first (product pages)
        const mainImg = document.getElementById('MainProductImage');
        if (mainImg) {
          console.log('[swatch] Found MainProductImage, updating src');
          mainImg.src = thumb;
        } else {
          // For homepage product cards, find the image in the same card
          const card = btn.closest('.product-card');
          if (card) {
            const cardImg = card.querySelector('img.product-card__img');
            if (cardImg) {
              console.log('[swatch] Found product card image, updating src');
              cardImg.src = thumb;
            } else {
              console.log('[swatch] No product card image found, available images:', card.querySelectorAll('img'));
            }
          } else {
            console.log('[swatch] No product card found');
          }
        }
      }
    }

    // 5) Update URL (?variant=…) - only for product pages with forms
    if (form && variantId) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variantId);
      history.replaceState({}, '', url);
    }

    // 6) Visual state
    const group = btn.closest('[data-swatch-group]');
    if (group) refreshState(group, value);
  }

  // Wire up product-page swatches
  document.addEventListener('DOMContentLoaded', () => {
    const groups = $$('[data-swatch-group]');
    if (groups.length) {
      console.log('[swatch] groups found:', groups.length);
    }
    groups.forEach((group) => {
      const swatches = $$('[data-swatch]', group);
      console.log('[swatch] Found', swatches.length, 'swatches in group');
      swatches.forEach((btn) => {
        console.log('[swatch] Adding click listener to:', btn.getAttribute('data-value'));
        btn.addEventListener('click', (e) => {
          console.log('[swatch] Clicked swatch:', btn.getAttribute('data-value'));
          e.preventDefault();
          e.stopPropagation();
          handleSwatchClick(e);
        });
        // Optional solid-color fill (kept off by default)
        const label = (btn.getAttribute('data-value') || '').toLowerCase();
        const chip  = btn.querySelector('[data-swatch-chip]');
        if (chip && NAME_TO_HEX[label]) {
          // chip.style.backgroundImage = 'none';
          // chip.style.backgroundColor = NAME_TO_HEX[label];
        }
      });
    });

    // Collection-card mini swatches (support <a> and <button>)
document.querySelectorAll('[data-mini-swatch], .mini-swatch').forEach(el => {
  el.addEventListener('click', (e) => {
    const url = el.getAttribute('data-url') || el.getAttribute('href');
    if (!url) return;           // nothing to do
    e.preventDefault();         // prevent default link if any
    window.location.assign(url);
  });
});

  });
})();
