/**
 * Advanced Designer Enhancements
 * Adds: Image layers, curved text, full export, drag-drop, animations, gradients, templates, auto-save
 */

(function() {
  'use strict';

  // ============================================
  // ENHANCEMENT 1: Image Layer Support
  // ============================================
  
  window.DesignerEnhancements = window.DesignerEnhancements || {};
  
  DesignerEnhancements.ImageLayer = {
    createImageLayer: function(imageData) {
      return {
        id: 'img-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        type: 'image',
        src: imageData,
        transform: {
          x: 50,
          y: 50,
          rotation: 0,
          scale: 1,
          flipH: false,
          flipV: false
        },
        filters: {
          brightness: 100,
          contrast: 100,
          saturate: 100,
          grayscale: 0,
          sepia: 0,
          blur: 0
        },
        visible: true
      };
    },
    
    handleImageUpload: function(file, callback) {
      if (!file || !file.type.match('image.*')) {
        alert('Please upload a valid image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        callback(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    
    renderImageLayer: function(layer, container) {
      let imgEl = document.getElementById(layer.id);
      
      if (!imgEl) {
        imgEl = document.createElement('img');
        imgEl.id = layer.id;
        imgEl.className = 'designer-image-layer';
        imgEl.style.position = 'absolute';
        imgEl.style.cursor = 'move';
        imgEl.style.maxWidth = '100%';
        imgEl.style.maxHeight = '100%';
        imgEl.style.userSelect = 'none';
        container.appendChild(imgEl);
      }
      
      imgEl.src = layer.src;
      imgEl.style.left = layer.transform.x + '%';
      imgEl.style.top = layer.transform.y + '%';
      imgEl.style.display = layer.visible ? 'block' : 'none';
      
      const scaleX = layer.transform.flipH ? -layer.transform.scale : layer.transform.scale;
      const scaleY = layer.transform.flipV ? -layer.transform.scale : layer.transform.scale;
      imgEl.style.transform = `translate(-50%, -50%) rotate(${layer.transform.rotation}deg) scale(${scaleX}, ${scaleY})`;
      
      // Apply filters
      const filters = [
        `brightness(${layer.filters.brightness}%)`,
        `contrast(${layer.filters.contrast}%)`,
        `saturate(${layer.filters.saturate}%)`,
        `grayscale(${layer.filters.grayscale}%)`,
        `sepia(${layer.filters.sepia}%)`,
        `blur(${layer.filters.blur}px)`
      ];
      imgEl.style.filter = filters.join(' ');
      
      return imgEl;
    }
  };

  // ============================================
  // ENHANCEMENT 2: Curved Text Rendering
  // ============================================
  
  DesignerEnhancements.CurvedText = {
    createCurvedTextSVG: function(layer) {
      const text = layer.text;
      const fontSize = layer.fontSize;
      const radius = layer.curveRadius || 0;
      
      if (radius === 0) return null;
      
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', '300');
      svg.setAttribute('height', '300');
      svg.setAttribute('viewBox', '-150 -150 300 300');
      
      // Create path for text
      const path = document.createElementNS(svgNS, 'path');
      const pathId = 'curve-' + layer.id;
      path.setAttribute('id', pathId);
      
      const absRadius = Math.abs(radius);
      const arcAngle = 180;
      const startAngle = radius < 0 ? 0 : 180;
      const endAngle = radius < 0 ? 180 : 0;
      
      const pathD = this.describeArc(0, 0, absRadius, startAngle, endAngle);
      path.setAttribute('d', pathD);
      path.setAttribute('fill', 'none');
      
      // Create defs for path
      const defs = document.createElementNS(svgNS, 'defs');
      defs.appendChild(path);
      svg.appendChild(defs);
      
      // Create text element
      const textEl = document.createElementNS(svgNS, 'text');
      textEl.setAttribute('font-family', layer.fontFamily);
      textEl.setAttribute('font-size', fontSize);
      textEl.setAttribute('fill', layer.color);
      textEl.setAttribute('letter-spacing', layer.letterSpacing || 0);
      
      // Apply stroke if enabled
      if (layer.stroke && layer.stroke.enabled) {
        textEl.setAttribute('stroke', layer.stroke.color);
        textEl.setAttribute('stroke-width', layer.stroke.width);
        textEl.setAttribute('paint-order', 'stroke fill');
      }
      
      // Create textPath
      const textPath = document.createElementNS(svgNS, 'textPath');
      textPath.setAttribute('href', '#' + pathId);
      textPath.setAttribute('startOffset', '50%');
      textPath.setAttribute('text-anchor', 'middle');
      textPath.textContent = text;
      
      textEl.appendChild(textPath);
      svg.appendChild(textEl);
      
      return svg;
    },
    
    describeArc: function(x, y, radius, startAngle, endAngle) {
      const start = this.polarToCartesian(x, y, radius, endAngle);
      const end = this.polarToCartesian(x, y, radius, startAngle);
      const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
      
      return [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArc, 0, end.x, end.y
      ].join(' ');
    },
    
    polarToCartesian: function(centerX, centerY, radius, angleInDegrees) {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    }
  };

  // ============================================
  // ENHANCEMENT 3: Full SVG/PNG Export
  // ============================================
  
  DesignerEnhancements.Export = {
    exportToSVG: function(layers, canvasWidth, canvasHeight) {
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('width', canvasWidth);
      svg.setAttribute('height', canvasHeight);
      svg.setAttribute('xmlns', svgNS);
      
      // Add styles
      const style = document.createElementNS(svgNS, 'style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;700&family=Roboto:wght@400;700&display=swap');
      `;
      svg.appendChild(style);
      
      layers.filter(l => l.visible).forEach(layer => {
        if (layer.type === 'image') {
          const img = document.createElementNS(svgNS, 'image');
          img.setAttribute('href', layer.src);
          img.setAttribute('x', (layer.transform.x / 100 * canvasWidth) - 100);
          img.setAttribute('y', (layer.transform.y / 100 * canvasHeight) - 100);
          img.setAttribute('width', 200 * layer.transform.scale);
          img.setAttribute('height', 200 * layer.transform.scale);
          img.setAttribute('transform', `rotate(${layer.transform.rotation} ${layer.transform.x / 100 * canvasWidth} ${layer.transform.y / 100 * canvasHeight})`);
          svg.appendChild(img);
        } else {
          const text = document.createElementNS(svgNS, 'text');
          text.setAttribute('x', layer.transform.x / 100 * canvasWidth);
          text.setAttribute('y', layer.transform.y / 100 * canvasHeight);
          text.setAttribute('font-family', layer.fontFamily);
          text.setAttribute('font-size', layer.fontSize);
          text.setAttribute('fill', layer.color);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'middle');
          text.setAttribute('letter-spacing', layer.letterSpacing || 0);
          
          if (layer.stroke && layer.stroke.enabled) {
            text.setAttribute('stroke', layer.stroke.color);
            text.setAttribute('stroke-width', layer.stroke.width);
          }
          
          if (layer.shadow && layer.shadow.enabled) {
            const filter = document.createElementNS(svgNS, 'filter');
            filter.setAttribute('id', 'shadow-' + layer.id);
            const feDropShadow = document.createElementNS(svgNS, 'feDropShadow');
            feDropShadow.setAttribute('dx', layer.shadow.x);
            feDropShadow.setAttribute('dy', layer.shadow.y);
            feDropShadow.setAttribute('stdDeviation', layer.shadow.blur);
            feDropShadow.setAttribute('flood-color', layer.shadow.color);
            filter.appendChild(feDropShadow);
            svg.appendChild(filter);
            text.setAttribute('filter', `url(#shadow-${layer.id})`);
          }
          
          text.setAttribute('transform', `rotate(${layer.transform.rotation} ${layer.transform.x / 100 * canvasWidth} ${layer.transform.y / 100 * canvasHeight}) scale(${layer.transform.scale})`);
          text.textContent = layer.text;
          svg.appendChild(text);
        }
      });
      
      const serializer = new XMLSerializer();
      return serializer.serializeToString(svg);
    },
    
    exportToPNG: async function(layers, canvasWidth, canvasHeight, dpi = 300) {
      const canvas = document.createElement('canvas');
      const scale = dpi / 96;
      canvas.width = canvasWidth * scale;
      canvas.height = canvasHeight * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw each layer
      for (const layer of layers.filter(l => l.visible)) {
        ctx.save();
        
        const x = layer.transform.x / 100 * canvasWidth;
        const y = layer.transform.y / 100 * canvasHeight;
        
        ctx.translate(x, y);
        ctx.rotate(layer.transform.rotation * Math.PI / 180);
        ctx.scale(layer.transform.scale, layer.transform.scale);
        
        if (layer.type === 'image') {
          const img = new Image();
          img.src = layer.src;
          await new Promise(resolve => {
            img.onload = () => {
              ctx.drawImage(img, -100, -100, 200, 200);
              resolve();
            };
          });
        } else {
          ctx.font = `${layer.fontSize}px ${layer.fontFamily}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          if (layer.shadow && layer.shadow.enabled) {
            ctx.shadowOffsetX = layer.shadow.x;
            ctx.shadowOffsetY = layer.shadow.y;
            ctx.shadowBlur = layer.shadow.blur;
            ctx.shadowColor = layer.shadow.color;
          }
          
          if (layer.stroke && layer.stroke.enabled) {
            ctx.strokeStyle = layer.stroke.color;
            ctx.lineWidth = layer.stroke.width;
            ctx.strokeText(layer.text, 0, 0);
          }
          
          ctx.fillStyle = layer.color;
          ctx.fillText(layer.text, 0, 0);
        }
        
        ctx.restore();
      }
      
      return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), 'image/png');
      });
    },
    
    downloadFile: function(data, filename, type) {
      const blob = typeof data === 'string' 
        ? new Blob([data], { type }) 
        : data;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // ============================================
  // ENHANCEMENT 4: Layer Drag-and-Drop Reordering
  // ============================================
  
  DesignerEnhancements.DragDrop = {
    makeSortable: function(container, onReorder) {
      let draggedElement = null;
      let draggedIndex = null;
      
      const items = container.querySelectorAll('[draggable="true"]');
      
      items.forEach((item, index) => {
        item.addEventListener('dragstart', function(e) {
          draggedElement = this;
          draggedIndex = index;
          this.style.opacity = '0.5';
          e.dataTransfer.effectAllowed = 'move';
        });
        
        item.addEventListener('dragend', function(e) {
          this.style.opacity = '1';
          items.forEach(item => item.classList.remove('drag-over'));
        });
        
        item.addEventListener('dragover', function(e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          
          if (this !== draggedElement) {
            this.classList.add('drag-over');
          }
          return false;
        });
        
        item.addEventListener('dragleave', function() {
          this.classList.remove('drag-over');
        });
        
        item.addEventListener('drop', function(e) {
          e.stopPropagation();
          e.preventDefault();
          
          if (draggedElement !== this) {
            const allItems = Array.from(container.children);
            const dropIndex = allItems.indexOf(this);
            
            if (onReorder) {
              onReorder(draggedIndex, dropIndex);
            }
          }
          
          this.classList.remove('drag-over');
          return false;
        });
      });
    }
  };

  // ============================================
  // ENHANCEMENT 5: Text Animations
  // ============================================
  
  DesignerEnhancements.Animations = {
    presets: {
      'fade-in': {
        name: 'Fade In',
        duration: 1000,
        keyframes: [
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 1 }
        ]
      },
      'slide-up': {
        name: 'Slide Up',
        duration: 800,
        keyframes: [
          { transform: 'translateY(50px)', opacity: 0, offset: 0 },
          { transform: 'translateY(0)', opacity: 1, offset: 1 }
        ]
      },
      'slide-down': {
        name: 'Slide Down',
        duration: 800,
        keyframes: [
          { transform: 'translateY(-50px)', opacity: 0, offset: 0 },
          { transform: 'translateY(0)', opacity: 1, offset: 1 }
        ]
      },
      'scale-in': {
        name: 'Scale In',
        duration: 600,
        keyframes: [
          { transform: 'scale(0)', opacity: 0, offset: 0 },
          { transform: 'scale(1)', opacity: 1, offset: 1 }
        ]
      },
      'rotate-in': {
        name: 'Rotate In',
        duration: 1000,
        keyframes: [
          { transform: 'rotate(-180deg) scale(0)', opacity: 0, offset: 0 },
          { transform: 'rotate(0) scale(1)', opacity: 1, offset: 1 }
        ]
      },
      'bounce': {
        name: 'Bounce',
        duration: 1000,
        keyframes: [
          { transform: 'translateY(0)', offset: 0 },
          { transform: 'translateY(-30px)', offset: 0.4 },
          { transform: 'translateY(0)', offset: 0.6 },
          { transform: 'translateY(-15px)', offset: 0.8 },
          { transform: 'translateY(0)', offset: 1 }
        ]
      },
      'pulse': {
        name: 'Pulse',
        duration: 1000,
        keyframes: [
          { transform: 'scale(1)', offset: 0 },
          { transform: 'scale(1.1)', offset: 0.5 },
          { transform: 'scale(1)', offset: 1 }
        ]
      }
    },
    
    applyAnimation: function(element, animationName, loop = false) {
      const preset = this.presets[animationName];
      if (!preset) return;
      
      const animation = element.animate(preset.keyframes, {
        duration: preset.duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        iterations: loop ? Infinity : 1,
        fill: 'forwards'
      });
      
      return animation;
    },
    
    removeAnimation: function(element) {
      const animations = element.getAnimations();
      animations.forEach(anim => anim.cancel());
    }
  };

  // ============================================
  // ENHANCEMENT 6: Gradient Fills
  // ============================================
  
  DesignerEnhancements.Gradients = {
    createLinearGradient: function(angle, stops) {
      return {
        type: 'linear',
        angle: angle,
        stops: stops // [{ color: '#ff0000', position: 0 }, { color: '#0000ff', position: 100 }]
      };
    },
    
    createRadialGradient: function(stops) {
      return {
        type: 'radial',
        stops: stops
      };
    },
    
    applyGradientToText: function(element, gradient) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = element.offsetWidth || 200;
      canvas.height = element.offsetHeight || 100;
      
      let grad;
      if (gradient.type === 'linear') {
        const angle = gradient.angle * Math.PI / 180;
        const x0 = canvas.width / 2 - Math.cos(angle) * canvas.width / 2;
        const y0 = canvas.height / 2 - Math.sin(angle) * canvas.height / 2;
        const x1 = canvas.width / 2 + Math.cos(angle) * canvas.width / 2;
        const y1 = canvas.height / 2 + Math.sin(angle) * canvas.height / 2;
        grad = ctx.createLinearGradient(x0, y0, x1, y1);
      } else {
        grad = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
      }
      
      gradient.stops.forEach(stop => {
        grad.addColorStop(stop.position / 100, stop.color);
      });
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const dataURL = canvas.toDataURL();
      element.style.background = `url(${dataURL})`;
      element.style.webkitBackgroundClip = 'text';
      element.style.webkitTextFillColor = 'transparent';
      element.style.backgroundClip = 'text';
    },
    
    presets: [
      {
        name: 'Sunset',
        gradient: { type: 'linear', angle: 45, stops: [
          { color: '#ff6b6b', position: 0 },
          { color: '#feca57', position: 100 }
        ]}
      },
      {
        name: 'Ocean',
        gradient: { type: 'linear', angle: 135, stops: [
          { color: '#4facfe', position: 0 },
          { color: '#00f2fe', position: 100 }
        ]}
      },
      {
        name: 'Purple Haze',
        gradient: { type: 'linear', angle: 90, stops: [
          { color: '#a78bfa', position: 0 },
          { color: '#ec4899', position: 100 }
        ]}
      },
      {
        name: 'Forest',
        gradient: { type: 'linear', angle: 180, stops: [
          { color: '#134e4a', position: 0 },
          { color: '#10b981', position: 100 }
        ]}
      },
      {
        name: 'Fire',
        gradient: { type: 'radial', stops: [
          { color: '#ff0000', position: 0 },
          { color: '#ff8800', position: 50 },
          { color: '#ffff00', position: 100 }
        ]}
      }
    ]
  };

  // ============================================
  // ENHANCEMENT 7: Template Presets
  // ============================================
  
  DesignerEnhancements.Templates = {
    presets: [
      {
        name: 'Bold Statement',
        description: 'Large bold text with shadow',
        thumbnail: '',
        layers: [
          {
            type: 'text',
            text: 'BOLD',
            fontFamily: 'Bebas Neue',
            fontSize: 72,
            color: '#000000',
            letterSpacing: 4,
            align: 'center',
            textCase: 'uppercase',
            stroke: { enabled: false },
            shadow: {
              enabled: true,
              x: 4,
              y: 4,
              blur: 8,
              color: '#00000066'
            },
            transform: { x: 50, y: 45, rotation: 0, scale: 1, flipH: false, flipV: false }
          }
        ]
      },
      {
        name: 'Outlined Text',
        description: 'White text with black outline',
        thumbnail: '',
        layers: [
          {
            type: 'text',
            text: 'OUTLINED',
            fontFamily: 'Montserrat',
            fontSize: 56,
            color: '#ffffff',
            letterSpacing: 2,
            align: 'center',
            textCase: 'uppercase',
            stroke: {
              enabled: true,
              width: 4,
              color: '#000000'
            },
            shadow: { enabled: false },
            transform: { x: 50, y: 50, rotation: 0, scale: 1, flipH: false, flipV: false }
          }
        ]
      },
      {
        name: 'Stacked Text',
        description: 'Multi-line centered design',
        thumbnail: '',
        layers: [
          {
            type: 'text',
            text: 'PREMIUM',
            fontFamily: 'Bebas Neue',
            fontSize: 48,
            color: '#000000',
            letterSpacing: 6,
            align: 'center',
            textCase: 'uppercase',
            stroke: { enabled: false },
            shadow: { enabled: false },
            transform: { x: 50, y: 40, rotation: 0, scale: 1, flipH: false, flipV: false }
          },
          {
            type: 'text',
            text: 'QUALITY',
            fontFamily: 'Bebas Neue',
            fontSize: 48,
            color: '#000000',
            letterSpacing: 6,
            align: 'center',
            textCase: 'uppercase',
            stroke: { enabled: false },
            shadow: { enabled: false },
            transform: { x: 50, y: 55, rotation: 0, scale: 1, flipH: false, flipV: false }
          }
        ]
      },
      {
        name: 'Vintage Badge',
        description: 'Classic circular design',
        thumbnail: '',
        layers: [
          {
            type: 'text',
            text: 'EST. 2024',
            fontFamily: 'Playfair Display',
            fontSize: 24,
            color: '#333333',
            letterSpacing: 2,
            align: 'center',
            textCase: 'uppercase',
            stroke: { enabled: false },
            shadow: { enabled: false },
            transform: { x: 50, y: 35, rotation: 0, scale: 1, flipH: false, flipV: false }
          },
          {
            type: 'text',
            text: 'VINTAGE',
            fontFamily: 'Bebas Neue',
            fontSize: 64,
            color: '#222222',
            letterSpacing: 4,
            align: 'center',
            textCase: 'uppercase',
            stroke: { enabled: false },
            shadow: { enabled: false },
            transform: { x: 50, y: 50, rotation: 0, scale: 1, flipH: false, flipV: false }
          },
          {
            type: 'text',
            text: 'QUALITY GOODS',
            fontFamily: 'Inter',
            fontSize: 18,
            color: '#555555',
            letterSpacing: 3,
            align: 'center',
            textCase: 'uppercase',
            stroke: { enabled: false },
            shadow: { enabled: false },
            transform: { x: 50, y: 65, rotation: 0, scale: 1, flipH: false, flipV: false }
          }
        ]
      }
    ],
    
    loadTemplate: function(templateName) {
      const template = this.presets.find(t => t.name === templateName);
      if (!template) return null;
      
      // Deep clone the layers
      return JSON.parse(JSON.stringify(template.layers));
    },
    
    saveCustomTemplate: function(name, description, layers) {
      const template = {
        name: name,
        description: description,
        thumbnail: '',
        layers: JSON.parse(JSON.stringify(layers)),
        custom: true,
        created: new Date().toISOString()
      };
      
      // Save to localStorage
      const customTemplates = this.getCustomTemplates();
      customTemplates.push(template);
      localStorage.setItem('designer-custom-templates', JSON.stringify(customTemplates));
      
      return template;
    },
    
    getCustomTemplates: function() {
      const stored = localStorage.getItem('designer-custom-templates');
      return stored ? JSON.parse(stored) : [];
    }
  };

  // ============================================
  // ENHANCEMENT 8: Auto-Save to localStorage
  // ============================================
  
  DesignerEnhancements.AutoSave = {
    key: 'designer-autosave',
    interval: null,
    
    startAutoSave: function(getStateFunction, intervalMs = 30000) {
      this.interval = setInterval(() => {
        const state = getStateFunction();
        this.save(state);
        console.log('✅ Design auto-saved at', new Date().toLocaleTimeString());
      }, intervalMs);
    },
    
    stopAutoSave: function() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    
    save: function(state) {
      try {
        const data = {
          state: state,
          timestamp: new Date().toISOString(),
          version: '1.0'
        };
        localStorage.setItem(this.key, JSON.stringify(data));
        return true;
      } catch (e) {
        console.error('Auto-save failed:', e);
        return false;
      }
    },
    
    load: function() {
      try {
        const stored = localStorage.getItem(this.key);
        if (!stored) return null;
        
        const data = JSON.parse(stored);
        return data.state;
      } catch (e) {
        console.error('Auto-load failed:', e);
        return null;
      }
    },
    
    clear: function() {
      localStorage.removeItem(this.key);
    },
    
    getLastSaveTime: function() {
      try {
        const stored = localStorage.getItem(this.key);
        if (!stored) return null;
        
        const data = JSON.parse(stored);
        return new Date(data.timestamp);
      } catch (e) {
        return null;
      }
    }
  };

  // ============================================
  // INITIALIZATION HELPER
  // ============================================
  
  DesignerEnhancements.init = function(config) {
    console.log('🎨 Initializing Designer Enhancements...');
    
    // Initialize auto-save
    if (config.autoSave) {
      this.AutoSave.startAutoSave(config.getState, config.autoSaveInterval);
      
      // Try to load previous state
      const savedState = this.AutoSave.load();
      if (savedState && confirm('Found a previously saved design. Would you like to restore it?')) {
        config.setState(savedState);
      }
    }
    
    // Initialize drag-drop if container provided
    if (config.layersContainer) {
      this.DragDrop.makeSortable(config.layersContainer, config.onReorder);
    }
    
    console.log('✅ All enhancements loaded successfully!');
  };

  // Export for use
  window.DesignerEnhancements = DesignerEnhancements;

})();

