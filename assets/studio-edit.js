// assets/studio-edit.js
// Advanced editing operations for Custom T-Shirt Studio
// Integrates with Fabric.js canvas and ensures all transforms stay within print-area

window.studio = window.studio || {};

(function () {
  'use strict';

  // ---------- Canvas bootstrap ----------
  const getCanvas = () => {
    const id = 'design-canvas';
    if (studio.fabricCanvas) return studio.fabricCanvas;
    const el = document.getElementById(id);
    if (!el) return null;
    studio.fabricCanvas = new fabric.Canvas(id, { selection: false });
    return studio.fabricCanvas;
  };

  // ---------- PRINT-AREA ADAPTER ----------
  // We support two sources for the "safe print area":
  // A) Fabric overlay object named 'print-area' (preferred)
  // B) DOM overlay with #print-area (or data attributes) we convert to canvas coords
  // Fallback: a centered rect with 80% canvas width, 65% height.
  function getPrintAreaRect() {
    const c = getCanvas(); 
    if (!c) return null;

    // A) Fabric object named 'print-area'
    const fa = c.getObjects().find(o => o.name === 'print-area' || o.id === 'print-area');
    if (fa) {
      const br = fa.getBoundingRect(true);
      return { x: br.left, y: br.top, w: br.width, h: br.height };
    }

    // B) DOM overlay → canvas coords
    const dom = document.getElementById('print-area') || document.querySelector('[data-print-area]');
    if (dom) {
      // DOM rect relative to canvas element
      const canvasEl = c.getElement();
      const cr = canvasEl.getBoundingClientRect();
      const dr = dom.getBoundingClientRect();
      const scaleX = c.getWidth()  / cr.width;
      const scaleY = c.getHeight() / cr.height;
      return {
        x: (dr.left - cr.left) * scaleX,
        y: (dr.top  - cr.top)  * scaleY,
        w:  dr.width * scaleX,
        h:  dr.height * scaleY
      };
    }

    // Fallback rectangle (centered, padded)
    const pad = 0.1;
    const w = c.getWidth();
    const h = c.getHeight();
    return {
      x: w * pad,
      y: h * (pad + 0.05),
      w: w * (1 - pad * 2),
      h: h * (1 - pad * 2 - 0.05)
    };
  }

  // Draw a dashed helper while the Edit modal is open (not your Placement Guide button)
  function showEditGuide(show) {
    const c = getCanvas(); 
    if (!c) return;
    
    // remove old
    const old = c.getObjects('rect').find(o => o._editGuide);
    if (old) c.remove(old);

    if (show) {
      const r = getPrintAreaRect(); 
      if (!r) return;
      const guide = new fabric.Rect({
        left: r.x, top: r.y, width: r.w, height: r.h,
        fill: 'rgba(0,0,0,0)', 
        stroke: '#27e1c1', 
        strokeWidth: 2,
        strokeDashArray: [8,6],
        selectable: false, 
        evented: false, 
        opacity: 0.8
      });
      guide._editGuide = true;
      c.add(guide); 
      c.sendToBack(guide); 
      c.requestRenderAll();
    } else {
      c.requestRenderAll();
    }
  }

  // ---------- SNAP / CONSTRAIN ----------
  function constrainToRect(obj, rect, pad = 2) {
    // Prevent overflow after transforms
    const c = getCanvas(); 
    if (!c || !obj || !rect) return;
    
    // get bounding box **after** transform
    const br = obj.getBoundingRect(true);

    let dx = 0, dy = 0;
    if (br.left < rect.x + pad)                      dx = (rect.x + pad) - br.left;
    if (br.top  < rect.y + pad)                      dy = (rect.y + pad) - br.top;
    if (br.left + br.width  > rect.x + rect.w - pad) dx = (rect.x + rect.w - pad) - (br.left + br.width);
    if (br.top  + br.height > rect.y + rect.h - pad) dy = (rect.y + rect.h - pad) - (br.top + br.height);

    if (dx || dy) {
      obj.left += dx; 
      obj.top += dy; 
      obj.setCoords();
    }
  }

  function autoFitIntoRect(obj, rect, paddingRatio = 0.04) {
    if (!obj || !rect) return;
    const padW = rect.w * (1 - paddingRatio * 2);
    const padH = rect.h * (1 - paddingRatio * 2);
    const ow = obj.width  * (obj.scaleX || 1);
    const oh = obj.height * (obj.scaleY || 1);
    const scale = Math.min(padW / ow, padH / oh);

    obj.scaleX = (obj.scaleX || 1) * scale;
    obj.scaleY = (obj.scaleY || 1) * scale;
    centerInRect(obj, rect);
  }

  function centerInRect(obj, rect) {
    if (!obj || !rect) return;
    const ow = obj.width  * (obj.scaleX || 1);
    const oh = obj.height * (obj.scaleY || 1);
    obj.left = rect.x + (rect.w - ow) / 2;
    obj.top  = rect.y + (rect.h - oh) / 2;
    obj.setCoords();
  }

  // ---------- DPI / QUALITY ----------
  // If you know the mockup canvas PPI, set it here. Otherwise 300 is a good target.
  const CANVAS_PPI = 300;
  
  function dpiAtPrintSize(obj, rect) {
    if (!obj || !rect) return null;
    const pxAtPrint = obj.width * (obj.scaleX || 1);     // pixel width of the design on canvas
    const inches    = rect.w / CANVAS_PPI;               // printed width in inches (approx)
    return Math.round(pxAtPrint / Math.max(inches, 0.01));
  }

  // ---------- CROP OPERATIONS ----------
  let cropState = null;

  function initCrop() {
    const obj = studio.currentDesignObj;
    if (!obj) return false;

    const c = getCanvas();
    const br = obj.getBoundingRect(true);
    
    cropState = {
      original: {
        left: obj.left,
        top: obj.top,
        width: obj.width,
        height: obj.height,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        cropX: obj.cropX || 0,
        cropY: obj.cropY || 0
      },
      cropBox: new fabric.Rect({
        left: br.left + 10,
        top: br.top + 10,
        width: br.width - 20,
        height: br.height - 20,
        fill: 'rgba(0,0,0,0)',
        stroke: '#27e1c1',
        strokeWidth: 2,
        cornerColor: '#27e1c1',
        cornerSize: 10,
        transparentCorners: false,
        lockRotation: true
      })
    };

    c.add(cropState.cropBox);
    c.setActiveObject(cropState.cropBox);
    c.requestRenderAll();
    return true;
  }

  function applyCrop() {
    if (!cropState) return false;
    const obj = studio.currentDesignObj;
    const box = cropState.cropBox;
    if (!obj || !box) return false;

    const c = getCanvas();
    const cropRect = box.getBoundingRect(true);
    const objRect = obj.getBoundingRect(true);

    // Calculate crop coordinates relative to original image
    const cropX = (cropRect.left - objRect.left) / obj.scaleX;
    const cropY = (cropRect.top - objRect.top) / obj.scaleY;
    const cropW = cropRect.width / obj.scaleX;
    const cropH = cropRect.height / obj.scaleY;

    obj.set({
      cropX: cropX,
      cropY: cropY,
      width: cropW,
      height: cropH
    });

    obj.setCoords();
    c.remove(box);
    cropState = null;
    c.requestRenderAll();
    return true;
  }

  function cancelCrop() {
    if (!cropState) return;
    const c = getCanvas();
    c.remove(cropState.cropBox);
    cropState = null;
    c.requestRenderAll();
  }

  // ---------- BACKGROUND OPERATIONS ----------
  let originalImageSrc = null;

  function removeBackground(color = '#ffffff', tolerance = 30) {
    const obj = studio.currentDesignObj;
    if (!obj || obj.type !== 'image') return false;

    if (!originalImageSrc) {
      originalImageSrc = obj.getSrc();
    }

    const imgEl = obj.getElement();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imgEl.width;
    canvas.height = imgEl.height;
    ctx.drawImage(imgEl, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Parse target color
    const target = hexToRgb(color);
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      const diff = Math.abs(r - target.r) + Math.abs(g - target.g) + Math.abs(b - target.b);
      if (diff < tolerance * 3) {
        data[i + 3] = 0; // Make transparent
      }
    }

    ctx.putImageData(imageData, 0, 0);
    
    obj.setSrc(canvas.toDataURL(), () => {
      getCanvas().requestRenderAll();
    });

    return true;
  }

  function revertBackground() {
    const obj = studio.currentDesignObj;
    if (!obj || !originalImageSrc) return false;

    obj.setSrc(originalImageSrc, () => {
      getCanvas().requestRenderAll();
    });
    return true;
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  // ---------- ADJUST OPERATIONS ----------
  function applyFilter(filterType, value) {
    const obj = studio.currentDesignObj;
    if (!obj) return false;

    obj.filters = obj.filters || [];
    
    // Remove existing filter of same type
    obj.filters = obj.filters.filter(f => f.type !== filterType);

    // Add new filter
    switch(filterType) {
      case 'brightness':
        obj.filters.push(new fabric.Image.filters.Brightness({ brightness: value }));
        break;
      case 'contrast':
        obj.filters.push(new fabric.Image.filters.Contrast({ contrast: value }));
        break;
      case 'grayscale':
        if (value) obj.filters.push(new fabric.Image.filters.Grayscale());
        break;
    }

    obj.applyFilters();
    getCanvas().requestRenderAll();
    return true;
  }

  function setOpacity(value) {
    const obj = studio.currentDesignObj;
    if (!obj) return false;
    obj.set('opacity', Math.max(0, Math.min(1, value)));
    getCanvas().requestRenderAll();
    return true;
  }

  function addOutline(width, color = '#000000') {
    const obj = studio.currentDesignObj;
    if (!obj) return false;
    obj.set({
      stroke: width > 0 ? color : null,
      strokeWidth: width
    });
    getCanvas().requestRenderAll();
    return true;
  }

  // ---------- PUBLIC API used by the Edit modal ----------
  studio.editOps = {
    open() {
      showEditGuide(true);
    },
    
    close() {
      showEditGuide(false);
      cancelCrop();
      getCanvas()?.requestRenderAll();
    },
    
    // Transform operations
    nudge(dx, dy, step = 2) {
      const obj = studio.currentDesignObj; 
      if (!obj) return;
      obj.left += dx * step; 
      obj.top += dy * step; 
      obj.setCoords();
      constrainToRect(obj, getPrintAreaRect());
      getCanvas().requestRenderAll();
    },
    
    rotate(deg) {
      const obj = studio.currentDesignObj; 
      if (!obj) return;
      obj.rotate(deg); 
      obj.setCoords();
      constrainToRect(obj, getPrintAreaRect());
      getCanvas().requestRenderAll();
    },
    
    scale(percent) {
      const obj = studio.currentDesignObj; 
      if (!obj) return;
      const s = Math.max(0.02, percent / 100);
      obj.scale(s); 
      obj.setCoords();
      constrainToRect(obj, getPrintAreaRect());
      getCanvas().requestRenderAll();
    },
    
    flipX() { 
      const o = studio.currentDesignObj; 
      if (!o) return; 
      o.set('flipX', !o.flipX); 
      o.setCoords(); 
      getCanvas().requestRenderAll(); 
    },
    
    flipY() { 
      const o = studio.currentDesignObj; 
      if (!o) return; 
      o.set('flipY', !o.flipY); 
      o.setCoords(); 
      getCanvas().requestRenderAll(); 
    },
    
    center() {
      const obj = studio.currentDesignObj; 
      if (!obj) return;
      centerInRect(obj, getPrintAreaRect()); 
      getCanvas().requestRenderAll();
    },
    
    autoFit() {
      const obj = studio.currentDesignObj; 
      if (!obj) return;
      autoFitIntoRect(obj, getPrintAreaRect()); 
      getCanvas().requestRenderAll();
    },
    
    // Crop operations
    initCrop: initCrop,
    applyCrop: applyCrop,
    cancelCrop: cancelCrop,
    
    // Background operations
    removeBackground: removeBackground,
    revertBackground: revertBackground,
    
    // Adjust operations
    setOpacity: setOpacity,
    setBrightness: (v) => applyFilter('brightness', v),
    setContrast: (v) => applyFilter('contrast', v),
    setGrayscale: (v) => applyFilter('grayscale', v),
    addOutline: addOutline,
    
    // Quality info
    qualityInfo() {
      const d = dpiAtPrintSize(studio.currentDesignObj, getPrintAreaRect());
      return {
        dpi: d,
        level: d >= 300 ? 'excellent' : d >= 150 ? 'ok' : d >= 100 ? 'low' : 'poor'
      };
    }
  };

  console.log('✅ Studio Edit Operations loaded');
})();

