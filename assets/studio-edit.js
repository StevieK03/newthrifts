// assets/studio-edit.js
// Advanced editing operations for Custom T-Shirt Studio (DOM-based)
// Works with CSS transform positioning instead of Fabric.js

window.studio = window.studio || {};

(function () {
  'use strict';

  // Track current design state
  let designState = {
    scale: 100,
    rotation: 0,
    flipH: false,
    flipV: false,
    opacity: 1,
    brightness: 0,
    contrast: 0,
    grayscale: false
  };

  // Get the overlay element (the design container)
  function getOverlay() {
    // Try multiple selection methods
    const overlays = document.querySelectorAll('[id*="nt-overlay"]');
    if (overlays.length > 0) return overlays[0];
    
    const overlay = document.querySelector('.nt-mockup__overlay');
    if (overlay) return overlay;
    
    console.warn('⚠️ Could not find design overlay element');
    return null;
  }

  // Get the design image inside the overlay
  function getDesignImage() {
    const overlay = getOverlay();
    if (!overlay) return null;
    
    const img = overlay.querySelector('img');
    if (img) return img;
    
    console.warn('⚠️ No image found in overlay');
    return null;
  }

  // Apply all transforms to the overlay
  function applyTransforms() {
    const overlay = getOverlay();
    if (!overlay) return;

    const img = getDesignImage();
    
    // Build transform string
    const transforms = [];
    
    // Base positioning (keep the translateX(-50%) for centering)
    transforms.push('translateX(-50%)');
    
    // Rotation
    if (designState.rotation !== 0) {
      transforms.push(`rotate(${designState.rotation}deg)`);
    }
    
    // Flip
    const scaleX = designState.flipH ? -1 : 1;
    const scaleY = designState.flipV ? -1 : 1;
    const scale = designState.scale / 100;
    transforms.push(`scale(${scaleX * scale}, ${scaleY * scale})`);
    
    // Apply to overlay
    overlay.style.transform = transforms.join(' ');
    
    // Apply image filters if image exists
    if (img) {
      const filters = [];
      
      if (designState.brightness !== 0) {
        filters.push(`brightness(${1 + designState.brightness})`);
      }
      
      if (designState.contrast !== 0) {
        filters.push(`contrast(${1 + designState.contrast})`);
      }
      
      if (designState.grayscale) {
        filters.push('grayscale(100%)');
      }
      
      img.style.filter = filters.length > 0 ? filters.join(' ') : 'none';
      img.style.opacity = designState.opacity;
    }
    
    console.log('🔄 Transforms applied:', designState);
  }

  // Nudge the design position
  function nudgePosition(dx, dy, step = 5) {
    const overlay = getOverlay();
    if (!overlay) return;
    
    // Get current position
    const currentTop = parseFloat(overlay.style.top) || 30;
    const currentLeft = parseFloat(overlay.style.left) || 50;
    
    // Update position
    overlay.style.top = `${currentTop + dy * step}%`;
    overlay.style.left = `${currentLeft + dx * step}%`;
    
    console.log(`📍 Position: ${overlay.style.left}, ${overlay.style.top}`);
  }

  // Center the design
  function centerDesign() {
    const overlay = getOverlay();
    if (!overlay) return;
    
    overlay.style.top = '30%';
    overlay.style.left = '50%';
    
    console.log('🎯 Design centered');
  }

  // Auto-fit design to safe area
  function autoFitDesign() {
    const overlay = getOverlay();
    if (!overlay) return;
    
    // Reset to optimal size for print area
    designState.scale = 80;
    designState.rotation = 0;
    applyTransforms();
    centerDesign();
    
    console.log('📐 Design auto-fitted');
  }

  // Get DPI/quality info
  function getQualityInfo() {
    const img = getDesignImage();
    if (!img) return { dpi: 0, level: 'unknown' };
    
    const naturalWidth = img.naturalWidth || 0;
    const displayWidth = img.offsetWidth || 1;
    const scale = designState.scale / 100;
    
    // Estimate DPI based on print size (assuming 8" wide print area)
    const printWidthInches = 8;
    const effectivePixels = naturalWidth * scale;
    const dpi = Math.round(effectivePixels / printWidthInches);
    
    let level = 'poor';
    if (dpi >= 300) level = 'excellent';
    else if (dpi >= 200) level = 'good';
    else if (dpi >= 150) level = 'ok';
    else if (dpi >= 100) level = 'low';
    
    return { dpi, level };
  }

  // ---------- PUBLIC API used by the Edit modal ----------
  studio.editOps = {
    open() {
      console.log('📝 Edit mode opened');
      // Could add visual indicators here
    },
    
    close() {
      console.log('✅ Edit mode closed');
    },
    
    // Transform operations
    nudge(dx, dy, step = 5) {
      nudgePosition(dx, dy, step);
    },
    
    rotate(deg) {
      designState.rotation = parseFloat(deg) || 0;
      applyTransforms();
    },
    
    scale(percent) {
      designState.scale = Math.max(10, Math.min(500, parseFloat(percent) || 100));
      applyTransforms();
    },
    
    flipX() {
      designState.flipH = !designState.flipH;
      applyTransforms();
    },
    
    flipY() {
      designState.flipV = !designState.flipV;
      applyTransforms();
    },
    
    center() {
      centerDesign();
    },
    
    autoFit() {
      autoFitDesign();
    },
    
    // Adjust operations
    setOpacity(value) {
      designState.opacity = Math.max(0, Math.min(1, parseFloat(value)));
      applyTransforms();
    },
    
    setBrightness(value) {
      designState.brightness = Math.max(-1, Math.min(1, parseFloat(value)));
      applyTransforms();
    },
    
    setContrast(value) {
      designState.contrast = Math.max(-1, Math.min(1, parseFloat(value)));
      applyTransforms();
    },
    
    setGrayscale(enabled) {
      designState.grayscale = !!enabled;
      applyTransforms();
    },
    
    addOutline(width, color = '#000000') {
      const img = getDesignImage();
      if (!img) return;
      
      if (width > 0) {
        img.style.filter = `${img.style.filter || ''} drop-shadow(0 0 ${width}px ${color})`;
      }
    },
    
    // Quality info
    qualityInfo() {
      return getQualityInfo();
    },
    
    // Get current state (for preview updates)
    getState() {
      return { ...designState };
    }
  };

  // Initialize with current overlay state if it exists
  function initFromDOM() {
    const overlay = getOverlay();
    if (!overlay) return;
    
    // Try to read existing transform values
    const transform = window.getComputedStyle(overlay).transform;
    console.log('🎨 Initialized edit operations for DOM-based design');
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFromDOM);
  } else {
    initFromDOM();
  }

  console.log('✅ Studio Edit Operations loaded (DOM mode)');
})();
