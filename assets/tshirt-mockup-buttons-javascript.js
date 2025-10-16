/* ========================================== */
/* T-SHIRT MOCKUP DESIGN BUTTONS - JAVASCRIPT */
/* ========================================== */

// Main Mockup Object
const mockup = {
  // Mockup images mapping
  mockupImages: {
    front: {
      white: "{{ 'tshirt-view.png' | asset_url }}",
      black: "{{ 'tshirt-view.png' | asset_url }}",
      pink: "{{ 'tshirt-view.png' | asset_url }}",
      blue: "{{ 'tshirt-view.png' | asset_url }}"
    },
    back: {
      white: "{{ 'tshirt-view.png' | asset_url }}",
      black: "{{ 'tshirt-view.png' | asset_url }}",
      pink: "{{ 'tshirt-view.png' | asset_url }}",
      blue: "{{ 'tshirt-view.png' | asset_url }}"
    },
    hanging: {
      white: "{{ 'tshirt-view.png' | asset_url }}",
      black: "{{ 'tshirt-view.png' | asset_url }}",
      pink: "{{ 'tshirt-view.png' | asset_url }}",
      blue: "{{ 'tshirt-view.png' | asset_url }}"
    },
    person1: {
      white: "{{ 'Girl-Model.png' | asset_url }}",
      black: "{{ 'Girl-Model.png' | asset_url }}",
      pink: "{{ 'Girl-Model.png' | asset_url }}",
      blue: "{{ 'Girl-Model.png' | asset_url }}"
    },
    person2: {
      white: "{{ 'Women-side.png' | asset_url }}",
      black: "{{ 'Women-side.png' | asset_url }}",
      pink: "{{ 'Women-side.png' | asset_url }}",
      blue: "{{ 'Women-side.png' | asset_url }}"
    }
  },
  
  // Current base mockup image
  baseMockup: "{{ 'tshirt-view.png' | asset_url }}",

  // Current design state
  designState: {
    text: 'Your Design Here',
    fontSize: 32,
    fontFamily: "'Bebas Neue', sans-serif",
    textColor: '#000000',
    shirtColor: 'white',
    effect: 'none'
  },

  // Current view state
  state: { view: "front", color: "white" },

  // Enhanced placement state
  placementState: {
    topPct: 30,
    leftPct: 50,
    widthPct: 50,
    heightPct: 65,
    rotateDeg: 0,
    dragging: false,
    resizing: false,
    resizeDirection: 'se',
    lastX: 0,
    lastY: 0,
    hasUploadedDesign: false,
    designSelected: false
  },

  // Initialize the mockup
  init() {
    console.log('🎯 Initializing Enhanced Interactive Mockup...');
    this.bindEvents();
    this.loadFromCustomizer();
    this.updateBase();
    this.updateDesign();
    this.updatePlacementDisplay();
    this.updateDesignPosition();
    console.log('✅ Enhanced Interactive Mockup initialized');
  },

  // Bind all event handlers
  bindEvents() {
    const rootId = "nt-mockup";
    
    // Keyboard event handling for delete/backspace
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && this.placementState.hasUploadedDesign && this.placementState.designSelected) {
        e.preventDefault();
        this.removeDesign();
        this.showMessage('🗑️ Design deleted with keyboard', 'info');
      }
    });
    
    // View buttons
    const viewBtns = Array.from(document.querySelectorAll(`#${rootId} .nt-btn--view`));
    viewBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.state.view = btn.dataset.view;
        this.setActive(viewBtns, this.state.view);
        this.updateBase();
      });
    });

    // Color buttons
    const colorBtns = Array.from(document.querySelectorAll(`#${rootId} .nt-btn--color`));
    colorBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        this.state.color = btn.dataset.color;
        this.setActive(colorBtns, this.state.color);
        this.updateBase();
      });
    });

    // Upload button
    const uploadBtn = document.getElementById('nt-upload');
    const fileInput = document.getElementById('nt-file-input');
    
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener("click", (e) => {
        if (e.target === uploadBtn) {
          console.log('📁 Upload button clicked');
          fileInput.click();
        }
      });

      fileInput.addEventListener("change", (e) => {
        console.log('📁 File input changed', e.target.files);
        const file = e.target.files[0];
        if (file) {
          console.log('📁 File selected:', file.name, file.type, file.size);
          this.handleFileUpload(file);
        }
      });
    }

    // Remove button
    const removeBtn = document.getElementById('nt-remove');
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        this.removeDesign();
      });
    }

    // Placement controls
    this.bindPlacementControls();
    this.bindDragResize();
    this.bindPresetButtons();
    this.bindSubmitRequest();
    this.bindPerfectFit();

    // Download button
    const downloadBtn = document.getElementById('nt-download');
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        this.downloadComposite();
      });
    }

    this.setupCustomizerListener();
  },

  // Set active button state
  setActive(buttons, active) {
    buttons.forEach(b => {
      const on = (b.dataset.view || b.dataset.color) === active;
      if (on) {
        b.classList.add("is-active");
        b.style.borderColor = "#27e1c1";
        b.style.background = "#27e1c1";
        b.style.color = "white";
      } else {
        b.classList.remove("is-active");
        b.style.borderColor = "#e2e8f0";
        b.style.background = "white";
        b.style.color = "#64748b";
      }
      b.setAttribute("aria-selected", on ? "true" : "false");
    });
  },

  // Update base mockup image
  updateBase() {
    const baseEl = document.getElementById("nt-base");
    if (baseEl) {
      const mockupImage = this.mockupImages[this.state.view]?.[this.state.color] || 
                         this.mockupImages.front?.white ||
                         this.baseMockup;
      
      console.log('🔄 Loading mockup:', mockupImage);
      baseEl.src = '';
      setTimeout(() => {
        baseEl.src = mockupImage;
      }, 10);
    }
  },

  // Update design text
  updateDesign() {
    const designText = document.getElementById("nt-design-text");
    if (designText) {
      designText.textContent = this.designState.text;
      designText.style.fontFamily = this.designState.fontFamily;
      designText.style.fontSize = this.designState.fontSize + 'px';
      designText.style.color = this.designState.textColor;
    }
  },

  // Load design from customizer
  loadFromCustomizer() {
    if (window.customizer && window.customizer.state) {
      this.designState = { ...this.designState, ...window.customizer.state };
      this.updateDesign();
    }
  },

  // Setup customizer listener
  setupCustomizerListener() {
    const originalUpdatePreview = window.customizer?.updatePreview;
    if (originalUpdatePreview) {
      window.customizer.updatePreview = () => {
        originalUpdatePreview.call(window.customizer);
        setTimeout(() => {
          this.loadFromCustomizer();
          this.updateDesign();
        }, 100);
      };
    }
  },

  // Handle file upload
  handleFileUpload(file) {
    console.log('📤 Processing file:', file.name, file.type, file.size);
    
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      this.showMessage('❌ Invalid file type. Please upload PNG, JPG, or SVG files.', 'error');
      return;
    }
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showMessage('❌ File too large. Please upload files smaller than 10MB.', 'error');
      return;
    }
    
    this.showMessage('📁 Processing your design...', 'info');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('✅ File loaded, applying to mockup');
      this.applyUploadedDesign(e.target.result);
    };
    reader.readAsDataURL(file);
  },

  // Apply uploaded design to mockup
  applyUploadedDesign(imageData) {
    console.log('🎨 Applying design to mockup');
    
    const overlayDiv = document.getElementById('nt-overlay');
    const designText = document.getElementById('nt-design-text');
    
    if (overlayDiv && designText) {
      designText.style.display = 'none';
      
      // Remove any existing uploaded image
      const existingImg = overlayDiv.querySelector('img');
      if (existingImg) {
        existingImg.remove();
      }
      
      const uploadedImg = document.createElement('img');
      uploadedImg.src = imageData;
      uploadedImg.style.cssText = `
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        display: block;
        pointer-events: none;
      `;
      
      overlayDiv.appendChild(uploadedImg);
      
      this.placementState.hasUploadedDesign = true;
      this.updateButtonVisibility();
      this.showMessage('✅ Design uploaded successfully!', 'success');
    }
  },

  // Update button visibility based on design state
  updateButtonVisibility() {
    const perfectFitBtn = document.getElementById('nt-perfect-fit-btn');
    const removeBtn = document.getElementById('nt-remove');
    const submitBtn = document.getElementById('nt-submit-request-btn');
    
    if (this.placementState.hasUploadedDesign) {
      if (perfectFitBtn) perfectFitBtn.style.display = 'block';
      if (removeBtn) removeBtn.style.display = 'block';
      if (submitBtn) {
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        submitBtn.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.5)';
        submitBtn.style.animation = 'pulse 2s ease-in-out infinite';
      }
    } else {
      if (perfectFitBtn) perfectFitBtn.style.display = 'none';
      if (removeBtn) removeBtn.style.display = 'none';
    }
  },

  // Remove design
  removeDesign() {
    const overlayDiv = document.getElementById('nt-overlay');
    const designText = document.getElementById('nt-design-text');
    const uploadedImg = overlayDiv?.querySelector('img');
    
    if (uploadedImg) {
      uploadedImg.remove();
    }
    
    if (designText) {
      designText.style.display = 'block';
    }
    
    this.placementState.hasUploadedDesign = false;
    this.updateButtonVisibility();
    this.showMessage('🗑️ Design removed', 'info');
  },

  // Bind placement controls
  bindPlacementControls() {
    const sliders = {
      top: document.getElementById('nt-placement-top'),
      left: document.getElementById('nt-placement-left'),
      width: document.getElementById('nt-placement-width'),
      height: document.getElementById('nt-placement-height'),
      rotation: document.getElementById('nt-placement-rotation')
    };

    Object.entries(sliders).forEach(([key, slider]) => {
      if (slider) {
        slider.addEventListener('input', () => {
          switch (key) {
            case 'top':
              this.placementState.topPct = parseFloat(slider.value);
              break;
            case 'left':
              this.placementState.leftPct = parseFloat(slider.value);
              break;
            case 'width':
              this.placementState.widthPct = parseFloat(slider.value);
              break;
            case 'height':
              this.placementState.heightPct = parseFloat(slider.value);
              break;
            case 'rotation':
              this.placementState.rotateDeg = parseFloat(slider.value);
              break;
          }
          this.updateDesignPosition();
        });
      }
    });
  },

  // Update placement display
  updatePlacementDisplay() {
    const sliders = {
      top: document.getElementById('nt-placement-top'),
      left: document.getElementById('nt-placement-left'),
      width: document.getElementById('nt-placement-width'),
      height: document.getElementById('nt-placement-height'),
      rotation: document.getElementById('nt-placement-rotation')
    };

    Object.entries(sliders).forEach(([key, slider]) => {
      if (slider) {
        switch (key) {
          case 'top':
            slider.value = this.placementState.topPct;
            break;
          case 'left':
            slider.value = this.placementState.leftPct;
            break;
          case 'width':
            slider.value = this.placementState.widthPct;
            break;
          case 'height':
            slider.value = this.placementState.heightPct;
            break;
          case 'rotation':
            slider.value = this.placementState.rotateDeg;
            break;
        }
      }
    });
  },

  // Update design position
  updateDesignPosition() {
    const overlay = document.getElementById('nt-overlay');
    if (!overlay) return;

    overlay.style.top = this.placementState.topPct + '%';
    overlay.style.left = this.placementState.leftPct + '%';
    overlay.style.width = this.placementState.widthPct + '%';
    overlay.style.height = this.placementState.heightPct + '%';
    overlay.style.transform = `translateX(-50%) rotate(${this.placementState.rotateDeg}deg)`;
  },

  // Bind drag and resize functionality
  bindDragResize() {
    const overlay = document.getElementById('nt-overlay');
    const canvas = document.getElementById('nt-mockup-canvas');
    
    if (!overlay || !canvas) return;
    
    // Bind the drag functions to this context
    this.handleDrag = this.handleDrag.bind(this);
    this.stopDrag = this.stopDrag.bind(this);
    
    overlay.addEventListener('mousedown', (e) => {
      this.startDrag(e);
    });
    
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectDesign();
    });
    
    canvas.addEventListener('click', (e) => {
      if (e.target === canvas) {
        this.deselectDesign();
      }
    });
  },

  // Select design
  selectDesign() {
    this.placementState.designSelected = true;
    const overlay = document.getElementById('nt-overlay');
    if (overlay) {
      overlay.style.borderColor = '#3b82f6';
      overlay.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.3)';
    }
  },

  // Deselect design
  deselectDesign() {
    this.placementState.designSelected = false;
    const overlay = document.getElementById('nt-overlay');
    if (overlay) {
      overlay.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      overlay.style.boxShadow = 'inset 0 4px 12px rgba(0, 0, 0, 0.1)';
    }
  },

  // Start drag
  startDrag(e) {
    this.placementState.dragging = true;
    this.placementState.lastX = e.clientX;
    this.placementState.lastY = e.clientY;
    
    const overlay = document.getElementById('nt-overlay');
    if (overlay) {
      overlay.style.cursor = 'grabbing';
    }
    
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.stopDrag);
  },

  // Handle drag
  handleDrag(e) {
    if (!this.placementState.dragging) return;
    
    const deltaX = e.clientX - this.placementState.lastX;
    const deltaY = e.clientY - this.placementState.lastY;
    
    const canvas = document.getElementById('nt-mockup-canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;
      
      this.placementState.leftPct += deltaXPercent;
      this.placementState.topPct += deltaYPercent;
      
      // Constrain to canvas bounds
      this.placementState.leftPct = Math.max(0, Math.min(100, this.placementState.leftPct));
      this.placementState.topPct = Math.max(0, Math.min(100, this.placementState.topPct));
      
      this.updateDesignPosition();
    }
    
    this.placementState.lastX = e.clientX;
    this.placementState.lastY = e.clientY;
  },

  // Stop drag
  stopDrag() {
    this.placementState.dragging = false;
    
    const overlay = document.getElementById('nt-overlay');
    if (overlay) {
      overlay.style.cursor = 'grab';
    }
    
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  },

  // Bind preset buttons
  bindPresetButtons() {
    // 3D Rotate button
    const rotateBtn = document.getElementById('nt-3d-rotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        this.rotateDesign();
      });
    }

    // Zoom button
    const zoomBtn = document.getElementById('nt-zoom');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        this.zoomDesign();
      });
    }

    // Validate button
    const validateBtn = document.getElementById('nt-validate');
    if (validateBtn) {
      validateBtn.addEventListener('click', () => {
        this.validateDesign();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('nt-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetDesign();
      });
    }
  },

  // Rotate design
  rotateDesign() {
    this.placementState.rotateDeg = (this.placementState.rotateDeg + 15) % 360;
    this.updateDesignPosition();
    this.updatePlacementDisplay();
    this.showMessage('🔄 Design rotated', 'info');
  },

  // Zoom design
  zoomDesign() {
    const currentWidth = this.placementState.widthPct;
    const currentHeight = this.placementState.heightPct;
    
    if (currentWidth < 80 && currentHeight < 80) {
      this.placementState.widthPct = Math.min(80, currentWidth + 10);
      this.placementState.heightPct = Math.min(80, currentHeight + 10);
      this.updateDesignPosition();
      this.updatePlacementDisplay();
      this.showMessage('🔍 Design zoomed in', 'info');
    } else {
      this.showMessage('⚠️ Maximum zoom reached', 'warning');
    }
  },

  // Validate design
  validateDesign() {
    if (!this.placementState.hasUploadedDesign) {
      this.showMessage('❌ Please upload a design first', 'error');
      return;
    }

    const issues = [];
    
    if (this.placementState.widthPct > 70) {
      issues.push('Design might be too large for print area');
    }
    
    if (this.placementState.topPct < 20 || this.placementState.topPct > 60) {
      issues.push('Design might be positioned outside optimal print area');
    }
    
    if (issues.length === 0) {
      this.showMessage('✅ Design validation passed! Ready for print.', 'success');
    } else {
      this.showMessage(`⚠️ Validation issues: ${issues.join(', ')}`, 'warning');
    }
  },

  // Reset design
  resetDesign() {
    this.placementState.topPct = 30;
    this.placementState.leftPct = 50;
    this.placementState.widthPct = 50;
    this.placementState.heightPct = 65;
    this.placementState.rotateDeg = 0;
    
    this.updateDesignPosition();
    this.updatePlacementDisplay();
    this.showMessage('🔄 Design reset to default position', 'info');
  },

  // Bind submit request
  bindSubmitRequest() {
    const submitBtn = document.getElementById('nt-submit-request-btn');
    
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (!this.placementState.hasUploadedDesign) {
          this.showMessage('📁 Please upload a design first to submit your request', 'error');
          return;
        }
        
        // Show request form or trigger submission
        this.submitTShirtRequest();
      });
    }
  },

  // Submit t-shirt request
  async submitTShirtRequest() {
    // Implementation for submitting request
    this.showMessage('🚀 Submitting your request...', 'info');
    
    // Add your submission logic here
    // This could include form data collection, API calls, etc.
  },

  // Bind perfect fit
  bindPerfectFit() {
    const perfectFitBtn = document.getElementById('nt-perfect-fit-btn');
    
    if (perfectFitBtn) {
      perfectFitBtn.addEventListener('click', () => {
        if (!this.placementState.hasUploadedDesign) {
          this.showMessage('❌ Please upload a design first', 'error');
          return;
        }
        this.applyPerfectFit();
      });
    }
    
    // Bind Placement Guide Toggle
    this.bindPlacementGuide();
  },

  // Bind placement guide
  bindPlacementGuide() {
    const toggleBtn = document.getElementById('nt-toggle-guide');
    const guideText = document.getElementById('nt-guide-text');
    const overlay = document.getElementById('nt-overlay');
    let guideVisible = false;
    
    if (toggleBtn && overlay) {
      toggleBtn.addEventListener('click', () => {
        guideVisible = !guideVisible;
        
        if (guideVisible) {
          // Show guide - add red border and crosshairs
          overlay.style.border = '2px dashed #ef4444';
          overlay.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2), inset 0 0 0 2px rgba(239, 68, 68, 0.1)';
          
          if (guideText) guideText.textContent = 'Hide';
          this.showMessage('📐 Placement guide enabled - red border shows print area', 'success');
        } else {
          // Hide guide - remove border and crosshairs
          overlay.style.border = '2px dashed rgba(255, 255, 255, 0.3)';
          overlay.style.boxShadow = 'inset 0 4px 12px rgba(0, 0, 0, 0.1)';
          
          if (guideText) guideText.textContent = 'Show';
          this.showMessage('📐 Placement guide disabled', 'success');
        }
      });
    }
  },

  // Apply perfect fit
  applyPerfectFit() {
    // Optimal dimensions for perfect fit in print area
    const perfectDimensions = {
      topPct: 29.142857142856876,
      leftPct: 50.21428571428568,
      widthPct: 37,
      heightPct: 42,
      rotateDeg: 0
    };

    // Apply the perfect dimensions
    this.placementState.topPct = perfectDimensions.topPct;
    this.placementState.leftPct = perfectDimensions.leftPct;
    this.placementState.widthPct = perfectDimensions.widthPct;
    this.placementState.heightPct = perfectDimensions.heightPct;
    this.placementState.rotateDeg = perfectDimensions.rotateDeg;

    // Update the display and position
    this.updatePlacementDisplay();
    this.updateDesignPosition();

    // Show success message
    this.showMessage('✨ Perfect fit applied! Design positioned optimally in print area', 'success');
    
    // Add a subtle animation to show the change
    const overlay = document.getElementById('nt-overlay');
    if (overlay) {
      overlay.style.transform = `translateX(-50%) rotate(${this.placementState.rotateDeg}deg) scale(1.05)`;
      setTimeout(() => {
        overlay.style.transform = `translateX(-50%) rotate(${this.placementState.rotateDeg}deg) scale(1)`;
      }, 200);
    }
  },

  // Download composite image
  async downloadComposite() {
    if (!this.placementState.hasUploadedDesign) {
      alert('⚠️ Please upload a design first!');
      return;
    }

    try {
      this.showMessage('🎨 Generating mockup image...', 'info');
      
      // Get the canvas and overlay elements
      const canvas = document.getElementById('nt-mockup-canvas');
      const baseImg = document.getElementById('nt-base');
      const overlay = document.getElementById('nt-overlay');
      
      if (!canvas || !baseImg || !overlay) {
        throw new Error('Required elements not found');
      }

      // Create a new canvas for the composite image
      const compositeCanvas = document.createElement('canvas');
      const ctx = compositeCanvas.getContext('2d');
      
      // Set canvas size (high resolution)
      const scale = 2; // 2x resolution for better quality
      compositeCanvas.width = 800 * scale;
      compositeCanvas.height = 1000 * scale;
      
      // Scale the context
      ctx.scale(scale, scale);
      
      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 1000);
      
      // Load and draw the base t-shirt image
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // Draw the base t-shirt image centered
          const imgWidth = 400;
          const imgHeight = 500;
          const x = (800 - imgWidth) / 2;
          const y = (1000 - imgHeight) / 2;
          ctx.drawImage(img, x, y, imgWidth, imgHeight);
          resolve();
        };
        img.onerror = reject;
        img.src = baseImg.src;
      });
      
      // Load and draw the uploaded design
      const designImg = overlay.querySelector('img');
      if (designImg) {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            // Calculate the design position on the canvas
            const canvasRect = canvas.getBoundingClientRect();
            const overlayRect = overlay.getBoundingClientRect();
            
            // Convert percentage positions to canvas coordinates
            const designX = (overlayRect.left - canvasRect.left) / canvasRect.width * 400;
            const designY = (overlayRect.top - canvasRect.top) / canvasRect.height * 500;
            const designWidth = (overlayRect.width / canvasRect.width) * 400;
            const designHeight = (overlayRect.height / canvasRect.height) * 500;
            
            // Draw the design image
            ctx.drawImage(img, designX, designY, designWidth, designHeight);
            resolve();
          };
          img.onerror = reject;
          img.src = designImg.src;
        });
      }
      
      // Convert canvas to blob and download
      compositeCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `custom-tshirt-mockup-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showMessage('✅ Mockup downloaded successfully!', 'success');
      }, 'image/png', 0.95);
      
    } catch (error) {
      console.error('Download error:', error);
      this.showMessage('❌ Failed to generate mockup. Please try again.', 'error');
    }
  },

  // Show message to user
  showMessage(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Remove existing message
    const existingMessage = document.querySelector('.nt-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message element
    const messageEl = document.createElement('div');
    messageEl.className = 'nt-message';
    messageEl.textContent = message;
    
    // Style based on type
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-weight: 600;
      font-size: 14px;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      messageEl.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  mockup.init();
});

// Export for use in other scripts
window.mockup = mockup;
