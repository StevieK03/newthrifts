// assets/text-engine.js
// New Thrifts Text Design Engine - SVG-based text system for Custom T-Shirt Studio
// Version: 1.0.0

(function() {
  'use strict';

  // Feature flag
  window.NT_FEATURE_TEXT_ENGINE = true;

  // ===========================================
  // DATA MODEL & TYPES
  // ===========================================

  /**
   * @typedef {Object} OpenTypeToggles
   * @property {boolean} liga - Standard ligatures
   * @property {boolean} dlig - Discretionary ligatures
   * @property {boolean} calt - Contextual alternates
   * @property {boolean} ss01 - Stylistic set 1
   * @property {boolean} ss02 - Stylistic set 2
   * @property {boolean} tnum - Tabular numbers
   * @property {boolean} pnum - Proportional numbers
   * @property {boolean} zero - Slashed zero
   */

  /**
   * @typedef {Object.<string, number>} VariableAxes
   */

  /**
   * @typedef {Object} NTTextObject
   * @property {string} id - Unique identifier
   * @property {string} content - Text content
   * @property {string} fontFamily - Font family name
   * @property {number} sizePx - Font size in pixels
   * @property {Object} color - Color configuration
   * @property {Object} outline - Outline/stroke configuration
   * @property {Object} shadow - Shadow configuration
   * @property {string} align - Text alignment
   * @property {number} tracking - Letter spacing
   * @property {number} leading - Line height
   * @property {string} case - Text case transformation
   * @property {OpenTypeToggles} opentype - OpenType features
   * @property {VariableAxes} variableAxes - Variable font axes
   * @property {Object} path - Curved text path configuration
   * @property {Object} transform - Position and transformation
   * @property {boolean} locked - Lock state
   * @property {boolean} hidden - Visibility state
   */

  // ===========================================
  // TEXT ENGINE CLASS
  // ===========================================

  class TextEngine {
    constructor(canvasId, overlayId) {
      this.canvasId = canvasId;
      this.overlayId = overlayId; // Overlay element represents the print area
      this.textObjects = [];
      this.selectedId = null;
      this.svgContainer = null;
      this.defsContainer = null;
      this.guidesContainer = null;
      this.fontsLoaded = new Set();
      this.undoStack = [];
      this.redoStack = [];
      this.snapThreshold = 6; // pixels
      
      this.init();
    }

    init() {
      console.log('🎨 Initializing Text Engine...');
      this.createSVGLayer();
      this.bindKeyboardShortcuts();
      console.log('✅ Text Engine initialized');
    }

    // ===========================================
    // SVG LAYER SETUP
    // ===========================================

    createSVGLayer() {
      const canvas = document.getElementById(this.canvasId);
      if (!canvas) {
        console.error('❌ Canvas not found:', this.canvasId);
        return;
      }

      // Create SVG container
      this.svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svgContainer.setAttribute('class', 'nt-text-layer');
      this.svgContainer.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
      `;

      // Create defs for gradients, patterns, etc.
      this.defsContainer = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      this.svgContainer.appendChild(this.defsContainer);

      // Create guides container
      this.guidesContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      this.guidesContainer.setAttribute('class', 'nt-guides');
      this.svgContainer.appendChild(this.guidesContainer);

      canvas.appendChild(this.svgContainer);
      console.log('✅ SVG text layer created');
    }

    // ===========================================
    // TEXT OBJECT MANAGEMENT
    // ===========================================

    createTextObject(initialContent = 'Your Text') {
      const printArea = this.getPrintAreaBounds();
      
      // Use Perfect Fit dimensions (same as the main design canvas)
      const perfectDimensions = {
        topPct: 29.142857142856876,     // Exact optimal top position
        leftPct: 49.96,                 // Adjusted left position
        widthPct: 37,                   // Optimal width for design proportions
        heightPct: 42,                  // Optimal height for design proportions
        rotateDeg: 0                    // No rotation for perfect fit
      };
      
      // Calculate position based on percentages relative to print area
      const xPos = printArea.x + (perfectDimensions.leftPct / 100) * printArea.width;
      const yPos = printArea.y + (perfectDimensions.topPct / 100) * printArea.height;
      
      // Calculate font size based on height percentage (adjust for text readability)
      const targetHeight = (perfectDimensions.heightPct / 100) * printArea.height;
      const fontSize = Math.max(24, Math.min(72, targetHeight * 0.4)); // Scale font to ~40% of target height
      
      const textObj = {
        id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: initialContent,
        fontFamily: 'Inter',
        sizePx: fontSize,
        color: { mode: 'solid', value: '#000000' },
        outline: null,
        shadow: null,
        align: 'center',
        tracking: 0,
        leading: 1.2,
        case: 'normal',
        opentype: { liga: true },
        variableAxes: {},
        path: { type: 'none' },
        transform: {
          x: xPos,
          y: yPos,
          scale: 1,
          rotateDeg: perfectDimensions.rotateDeg
        },
        locked: false,
        hidden: false
      };

      this.textObjects.push(textObj);
      this.selectedId = textObj.id;
      this.saveState();
      this.render();
      
      console.log('✅ Created text object with Perfect Fit positioning:', textObj.id);
      return textObj;
    }

    getTextObject(id) {
      return this.textObjects.find(obj => obj.id === id);
    }

    updateTextObject(id, updates) {
      const obj = this.getTextObject(id);
      if (!obj) return;

      Object.assign(obj, updates);
      this.saveState();
      this.render();
    }

    deleteTextObject(id) {
      const index = this.textObjects.findIndex(obj => obj.id === id);
      if (index === -1) return;

      this.textObjects.splice(index, 1);
      if (this.selectedId === id) {
        this.selectedId = this.textObjects.length > 0 ? this.textObjects[0].id : null;
      }
      this.saveState();
      this.render();
    }

    duplicateTextObject(id) {
      const obj = this.getTextObject(id);
      if (!obj) return;

      const duplicate = JSON.parse(JSON.stringify(obj));
      duplicate.id = `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      duplicate.transform.x += 20;
      duplicate.transform.y += 20;

      this.textObjects.push(duplicate);
      this.selectedId = duplicate.id;
      this.saveState();
      this.render();
      return duplicate;
    }

    reorderTextObject(id, newIndex) {
      const currentIndex = this.textObjects.findIndex(obj => obj.id === id);
      if (currentIndex === -1) return;

      const [obj] = this.textObjects.splice(currentIndex, 1);
      this.textObjects.splice(newIndex, 0, obj);
      this.saveState();
      this.render();
    }

    // ===========================================
    // RENDERING
    // ===========================================

    render() {
      // Clear existing text elements (keep defs and guides)
      const existingTexts = this.svgContainer.querySelectorAll('g.nt-text');
      existingTexts.forEach(el => el.remove());

      // Render each text object
      this.textObjects.forEach(obj => {
        if (obj.hidden) return;
        this.renderTextObject(obj);
      });

      // Update selection handles
      if (this.selectedId) {
        this.renderSelectionHandles(this.selectedId);
      }
    }

    renderTextObject(obj) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'nt-text');
      g.setAttribute('data-id', obj.id);
      g.setAttribute('transform', `translate(${obj.transform.x}, ${obj.transform.y}) scale(${obj.transform.scale}) rotate(${obj.transform.rotateDeg})`);

      // Create text element
      let textEl;
      if (obj.path.type === 'arc') {
        textEl = this.renderCurvedText(obj);
      } else {
        textEl = this.renderStraightText(obj);
      }

      g.appendChild(textEl);
      this.svgContainer.appendChild(g);
    }

    renderStraightText(obj) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      
      // Apply styles
      text.style.fontFamily = obj.fontFamily;
      text.style.fontSize = `${obj.sizePx}px`;
      text.style.letterSpacing = `${obj.tracking}px`;
      text.style.lineHeight = obj.leading;
      text.style.pointerEvents = obj.locked ? 'none' : 'auto';
      
      // Text anchor
      text.setAttribute('text-anchor', obj.align === 'center' ? 'middle' : obj.align === 'right' ? 'end' : 'start');
      text.setAttribute('dominant-baseline', 'middle');

      // Color
      if (obj.color.mode === 'solid') {
        text.setAttribute('fill', obj.color.value);
      } else if (obj.color.mode === 'gradient') {
        const gradId = this.createGradient(obj);
        text.setAttribute('fill', `url(#${gradId})`);
      }

      // Outline
      if (obj.outline) {
        text.setAttribute('stroke', obj.outline.color);
        text.setAttribute('stroke-width', obj.outline.width);
        text.setAttribute('stroke-linejoin', obj.outline.join || 'miter');
        text.setAttribute('paint-order', 'stroke fill');
      }

      // Shadow (using filter)
      if (obj.shadow) {
        const filterId = this.createShadowFilter(obj);
        text.setAttribute('filter', `url(#${filterId})`);
      }

      // OpenType features
      if (obj.opentype) {
        const features = this.buildFontFeatureSettings(obj.opentype);
        if (features) text.style.fontFeatureSettings = features;
      }

      // Variable axes
      if (obj.variableAxes && Object.keys(obj.variableAxes).length > 0) {
        const settings = this.buildFontVariationSettings(obj.variableAxes);
        text.style.fontVariationSettings = settings;
      }

      // Text case
      let content = obj.content;
      if (obj.case === 'upper') content = content.toUpperCase();
      else if (obj.case === 'lower') content = content.toLowerCase();
      else if (obj.case === 'smallcaps') text.style.fontVariant = 'small-caps';

      // Handle multi-line
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = line;
        tspan.setAttribute('x', 0);
        tspan.setAttribute('dy', i === 0 ? 0 : obj.sizePx * obj.leading);
        text.appendChild(tspan);
      });

      return text;
    }

    renderCurvedText(obj) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Create arc path
      const radius = obj.path.radius || 100;
      const invert = obj.path.invert || false;
      const pathId = `path-${obj.id}`;
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const sweep = invert ? 1 : 0;
      path.setAttribute('id', pathId);
      path.setAttribute('d', `M ${-radius},0 A ${radius},${radius} 0 0,${sweep} ${radius},0`);
      path.setAttribute('fill', 'none');
      
      g.appendChild(path);

      // Create text on path
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.style.fontFamily = obj.fontFamily;
      text.style.fontSize = `${obj.sizePx}px`;
      
      const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
      textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${pathId}`);
      textPath.setAttribute('startOffset', '50%');
      textPath.setAttribute('text-anchor', 'middle');
      textPath.textContent = obj.content;
      
      text.appendChild(textPath);
      g.appendChild(text);

      return g;
    }

    renderSelectionHandles(id) {
      // TODO: Implement transform handles (scale/rotate) in next iteration
      console.log('Selection:', id);
    }

    // ===========================================
    // FONT MANAGEMENT
    // ===========================================

    async loadFont(fontFamily, weight = 400) {
      const key = `${fontFamily}-${weight}`;
      if (this.fontsLoaded.has(key)) return true;

      try {
        // Create Google Fonts link if not exists
        if (!document.querySelector(`link[href*="${fontFamily}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@${weight}&display=swap`;
          document.head.appendChild(link);
        }

        // Wait for font to load
        await document.fonts.ready;
        this.fontsLoaded.add(key);
        console.log(`✅ Font loaded: ${fontFamily} ${weight}`);
        return true;
      } catch (error) {
        console.error(`❌ Failed to load font: ${fontFamily}`, error);
        return false;
      }
    }

    // ===========================================
    // UTILITIES
    // ===========================================

    getPrintAreaBounds() {
      const canvas = document.getElementById(this.canvasId);
      const overlay = document.getElementById(this.overlayId);
      
      if (!canvas || !overlay) {
        console.warn('⚠️ Canvas or overlay not found, using fallback dimensions');
        return { x: 0, y: 0, width: 400, height: 500 }; // fallback
      }
      
      const canvasRect = canvas.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      
      // Calculate overlay (print area) position relative to canvas
      const bounds = {
        x: overlayRect.left - canvasRect.left,
        y: overlayRect.top - canvasRect.top,
        width: overlayRect.width,
        height: overlayRect.height
      };
      
      console.log('📐 Print area bounds:', bounds);
      return bounds;
    }

    buildFontFeatureSettings(opentype) {
      const features = [];
      if (opentype.liga) features.push('"liga" 1');
      if (opentype.dlig) features.push('"dlig" 1');
      if (opentype.calt) features.push('"calt" 1');
      if (opentype.tnum) features.push('"tnum" 1');
      if (opentype.pnum) features.push('"pnum" 1');
      if (opentype.zero) features.push('"zero" 1');
      for (let i = 1; i <= 20; i++) {
        const key = `ss${i.toString().padStart(2, '0')}`;
        if (opentype[key]) features.push(`"${key}" 1`);
      }
      return features.length > 0 ? features.join(', ') : null;
    }

    buildFontVariationSettings(axes) {
      const settings = Object.entries(axes)
        .map(([axis, value]) => `"${axis}" ${value}`)
        .join(', ');
      return settings;
    }

    createGradient(obj) {
      const gradId = `grad-${obj.id}`;
      // TODO: Implement gradient creation
      return gradId;
    }

    createShadowFilter(obj) {
      const filterId = `shadow-${obj.id}`;
      // TODO: Implement shadow filter
      return filterId;
    }

    // ===========================================
    // STATE MANAGEMENT
    // ===========================================

    saveState() {
      const state = JSON.stringify(this.textObjects);
      this.undoStack.push(state);
      if (this.undoStack.length > 50) this.undoStack.shift();
      this.redoStack = [];
    }

    undo() {
      if (this.undoStack.length <= 1) return;
      const current = this.undoStack.pop();
      this.redoStack.push(current);
      const previous = this.undoStack[this.undoStack.length - 1];
      this.textObjects = JSON.parse(previous);
      this.render();
    }

    redo() {
      if (this.redoStack.length === 0) return;
      const state = this.redoStack.pop();
      this.undoStack.push(state);
      this.textObjects = JSON.parse(state);
      this.render();
    }

    // ===========================================
    // EXPORT
    // ===========================================

    exportJSON() {
      return JSON.stringify({
        version: '1.0.0',
        textObjects: this.textObjects,
        fonts: Array.from(this.fontsLoaded)
      }, null, 2);
    }

    exportSVG() {
      // Clone SVG without UI elements
      const clone = this.svgContainer.cloneNode(true);
      clone.querySelectorAll('.nt-guides').forEach(el => el.remove());
      const serializer = new XMLSerializer();
      return serializer.serializeToString(clone);
    }

    async exportPNG(width = 4500, height = 5100) {
      // TODO: Implement PNG export via canvas
      console.log('PNG export requested:', width, 'x', height);
    }

    // ===========================================
    // KEYBOARD SHORTCUTS
    // ===========================================

    bindKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Only handle if text engine is active and not in input
        if (!window.NT_FEATURE_TEXT_ENGINE || e.target.matches('input, textarea')) return;

        // Undo/Redo
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          this.undo();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
          e.preventDefault();
          this.redo();
        }

        // Nudge selected object
        if (!this.selectedId) return;
        const obj = this.getTextObject(this.selectedId);
        if (!obj || obj.locked) return;

        const step = e.shiftKey ? 10 : 1;
        let needsUpdate = false;

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            obj.transform.y -= step;
            needsUpdate = true;
            break;
          case 'ArrowDown':
            e.preventDefault();
            obj.transform.y += step;
            needsUpdate = true;
            break;
          case 'ArrowLeft':
            e.preventDefault();
            obj.transform.x -= step;
            needsUpdate = true;
            break;
          case 'ArrowRight':
            e.preventDefault();
            obj.transform.x += step;
            needsUpdate = true;
            break;
          case 'Delete':
          case 'Backspace':
            if (!e.target.matches('input, textarea')) {
              e.preventDefault();
              this.deleteTextObject(this.selectedId);
            }
            break;
        }

        if (needsUpdate) {
          this.saveState();
          this.render();
        }
      });
    }
  }

  // ===========================================
  // EXPORT TO WINDOW
  // ===========================================

  window.TextEngine = TextEngine;
  console.log('✅ TextEngine class loaded');

})();

