// assets/studio-edit.js
// Advanced editing operations for Custom T-Shirt Studio (DOM-based)
// Works with CSS transform positioning instead of Fabric.js

window.studio = window.studio || {};

(function () {
  'use strict';

  // Track current design state
  let designState = {
    scale: 100,
    baseWidth: 37,  // Base width percentage (matching Perfect Fit default)
    baseHeight: 42, // Base height percentage (matching Perfect Fit default)
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

  // Get the canvas container (for CSS variable manipulation)
  function getCanvasContainer() {
    // Try multiple selection methods
    const containers = document.querySelectorAll('[id*="nt-mockup-canvas"]');
    if (containers.length > 0) return containers[0];
    
    const container = document.querySelector('.nt-mockup__canvas');
    if (container) return container;
    
    console.warn('⚠️ Could not find canvas container element');
    return null;
  }

  // Apply all transforms to the overlay
  function applyTransforms() {
    const overlay = getOverlay();
    if (!overlay) return;

    const img = getDesignImage();
    
    // Build transform string (rotation and flip only, NOT scale)
    const transforms = [];
    
    // Base positioning (keep the translateX(-50%) for centering)
    transforms.push('translateX(-50%)');
    
    // Rotation
    if (designState.rotation !== 0) {
      transforms.push(`rotate(${designState.rotation}deg)`);
    }
    
    // Flip (without affecting scale - scale is handled by width/height)
    const scaleX = designState.flipH ? -1 : 1;
    const scaleY = designState.flipV ? -1 : 1;
    if (scaleX !== 1 || scaleY !== 1) {
      transforms.push(`scale(${scaleX}, ${scaleY})`);
    }
    
    // Apply transform (rotation and flip only)
    // Scale is handled separately in the scale() function
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
    const canvasContainer = getCanvasContainer();
    if (!overlay || !canvasContainer) return;
    
    // Use Perfect Fit dimensions (same as main canvas Perfect Fit button)
    const perfectDimensions = {
      topPct: 29.142857142856876,   // Exact optimal top position
      leftPct: 49.96,                // Adjusted left position
      widthPct: 37,                  // Optimal width for design proportions
      heightPct: 42,                 // Optimal height for design proportions
      rotateDeg: 0                   // No rotation for perfect fit
    };
    
    // Apply the perfect dimensions via CSS variables
    canvasContainer.style.setProperty('--overlay-top', `${perfectDimensions.topPct}%`);
    canvasContainer.style.setProperty('--overlay-left', `${perfectDimensions.leftPct}%`);
    canvasContainer.style.setProperty('--overlay-width', `${perfectDimensions.widthPct}%`);
    canvasContainer.style.setProperty('--overlay-height', `${perfectDimensions.heightPct}%`);
    canvasContainer.style.setProperty('--overlay-rotate', `${perfectDimensions.rotateDeg}deg`);
    
    // Apply dimensions directly to overlay
    overlay.style.top = `${perfectDimensions.topPct}%`;
    overlay.style.left = `${perfectDimensions.leftPct}%`;
    overlay.style.width = `${perfectDimensions.widthPct}%`;
    overlay.style.height = `${perfectDimensions.heightPct}%`;
    
    // Update internal state to match - these are now the new BASE dimensions
    designState.baseWidth = perfectDimensions.widthPct;
    designState.baseHeight = perfectDimensions.heightPct;
    designState.rotation = perfectDimensions.rotateDeg;
    designState.scale = 100; // Reset scale to 100% since we're at the base dimensions
    
    // Add animation effect
    overlay.style.transition = 'transform 0.3s ease';
    overlay.style.transform = `translateX(-50%) rotate(${perfectDimensions.rotateDeg}deg) scale(1.05)`;
    setTimeout(() => {
      overlay.style.transform = `translateX(-50%) rotate(${perfectDimensions.rotateDeg}deg) scale(1)`;
    }, 200);
    
    console.log('✨ Perfect Fit applied via Auto-Fit! New base: ' + designState.baseWidth + '% × ' + designState.baseHeight + '%');
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
      
      // Capture current overlay dimensions as base dimensions
      const overlay = getOverlay();
      if (overlay) {
        const currentWidth = parseFloat(overlay.style.width) || 37;
        const currentHeight = parseFloat(overlay.style.height) || 42;
        designState.baseWidth = currentWidth;
        designState.baseHeight = currentHeight;
        console.log(`📏 Base dimensions set: ${currentWidth}% × ${currentHeight}%`);
      }
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
      const overlay = getOverlay();
      if (!overlay) return;
      
      // Convert percent to a direct width/height adjustment (like main canvas resize)
      // Percent 100 = base dimensions, 200 = double size, 50 = half size
      const scaleFactor = (parseFloat(percent) || 100) / 100;
      const newWidth = designState.baseWidth * scaleFactor;
      const newHeight = designState.baseHeight * scaleFactor;
      
      // Apply directly to overlay (same as main canvas)
      overlay.style.width = newWidth + '%';
      overlay.style.height = newHeight + '%';
      
      // Update internal state
      designState.scale = percent;
      
      console.log(`📏 Scale: ${percent}% → ${newWidth.toFixed(1)}% × ${newHeight.toFixed(1)}%`);
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
