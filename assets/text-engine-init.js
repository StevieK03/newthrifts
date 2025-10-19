// assets/text-engine-init.js
// Text Engine Initialization & UI Wiring for Custom T-Shirt Studio

(function() {
  'use strict';

  // Export initialization function
  window.initializeTextEngine = function(sectionId) {
    if (!window.NT_FEATURE_TEXT_ENGINE) {
      console.log('ℹ️ Text Engine feature disabled');
      return;
    }

    console.log('📝 Initializing Text Engine...');

    const canvasId = `nt-mockup-canvas-${sectionId}`;
    const printAreaId = `nt-print-area-${sectionId}`;

    // Create Text Engine instance
    let textEngine;
    try {
      textEngine = new window.TextEngine(canvasId, printAreaId);
      window.textEngine = textEngine; // Make globally accessible
      console.log('✅ Text Engine instance created');
    } catch (error) {
      console.error('❌ Failed to create Text Engine:', error);
      return;
    }

    // UI Elements
    const textBtn = document.getElementById(`nt-text-${sectionId}`);
    const textPanel = document.getElementById(`text-panel-${sectionId}`);
    const textPanelClose = document.getElementById(`text-panel-close-${sectionId}`);
    const textAddBtn = document.getElementById(`text-add-btn-${sectionId}`);
    const textLayersContainer = document.getElementById(`text-layers-${sectionId}`);

    // Panel visibility
    function showTextPanel() {
      textPanel.style.display = 'block';
      console.log('📝 Text panel opened');
    }

    function hideTextPanel() {
      textPanel.style.display = 'none';
      console.log('📝 Text panel closed');
    }

    // Open panel
    textBtn.addEventListener('click', () => {
      showTextPanel();
    });

    // Close panel
    textPanelClose.addEventListener('click', () => {
      hideTextPanel();
    });

    // Add new text object
    textAddBtn.addEventListener('click', () => {
      const textObj = textEngine.createTextObject();
      updateLayersList();
      showEditControls(textObj.id);
    });

    // Update layers list
    function updateLayersList() {
      const textObjects = textEngine.textObjects;
      
      if (textObjects.length === 0) {
        textLayersContainer.innerHTML = `
          <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 14px;">
            No text objects yet.<br>Click "Add New Text" to start!
          </div>
        `;
        return;
      }

      textLayersContainer.innerHTML = '';
      
      textObjects.forEach((obj, index) => {
        const layer = document.createElement('div');
        layer.className = `nt-text-layer ${obj.id === textEngine.selectedId ? 'selected' : ''}`;
        layer.setAttribute('data-id', obj.id);
        
        const preview = obj.content || 'Empty Text';
        
        layer.innerHTML = `
          <span class="nt-text-layer__label">${preview.substring(0, 20)}${preview.length > 20 ? '...' : ''}</span>
          <div class="nt-text-layer__actions">
            <button class="nt-text-layer__btn" data-action="visibility" title="${obj.hidden ? 'Show' : 'Hide'}">
              ${obj.hidden ? '👁️' : '👁️'}
            </button>
            <button class="nt-text-layer__btn" data-action="duplicate" title="Duplicate">📋</button>
            <button class="nt-text-layer__btn danger" data-action="delete" title="Delete">🗑️</button>
          </div>
        `;
        
        // Click layer to select
        layer.addEventListener('click', (e) => {
          if (!e.target.closest('.nt-text-layer__actions')) {
            textEngine.selectedId = obj.id;
            updateLayersList();
            showEditControls(obj.id);
          }
        });
        
        // Action buttons
        const visibilityBtn = layer.querySelector('[data-action="visibility"]');
        const duplicateBtn = layer.querySelector('[data-action="duplicate"]');
        const deleteBtn = layer.querySelector('[data-action="delete"]');
        
        visibilityBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          textEngine.updateTextObject(obj.id, { hidden: !obj.hidden });
          updateLayersList();
        });
        
        duplicateBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          textEngine.duplicateTextObject(obj.id);
          updateLayersList();
        });
        
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Delete this text object?')) {
            textEngine.deleteTextObject(obj.id);
            updateLayersList();
            hideEditControls();
          }
        });
        
        textLayersContainer.appendChild(layer);
      });
    }

    // Show/hide edit controls
    function showEditControls(id) {
      const obj = textEngine.getTextObject(id);
      if (!obj) return;

      // Show all control sections
      document.getElementById(`text-content-section-${sectionId}`).style.display = 'block';
      document.getElementById(`text-font-section-${sectionId}`).style.display = 'block';
      document.getElementById(`text-effects-section-${sectionId}`).style.display = 'block';
      document.getElementById(`text-transform-section-${sectionId}`).style.display = 'block';
      document.getElementById(`text-export-section-${sectionId}`).style.display = 'block';

      // Populate controls with current values
      document.getElementById(`text-content-${sectionId}`).value = obj.content;
      document.getElementById(`text-font-${sectionId}`).value = obj.fontFamily;
      document.getElementById(`text-size-${sectionId}`).value = obj.sizePx;
      document.getElementById(`text-color-${sectionId}`).value = obj.color.value;
      document.getElementById(`text-color-hex-${sectionId}`).value = obj.color.value;
      document.getElementById(`text-tracking-${sectionId}`).value = obj.tracking;
      document.getElementById(`text-tracking-output-${sectionId}`).textContent = `${obj.tracking}px`;
      document.getElementById(`text-leading-${sectionId}`).value = obj.leading;
      document.getElementById(`text-leading-output-${sectionId}`).textContent = obj.leading;
      document.getElementById(`text-rotate-${sectionId}`).value = obj.transform.rotateDeg;
      document.getElementById(`text-rotate-output-${sectionId}`).textContent = `${obj.transform.rotateDeg}°`;
      document.getElementById(`text-scale-${sectionId}`).value = obj.transform.scale;
      document.getElementById(`text-scale-output-${sectionId}`).textContent = obj.transform.scale.toFixed(2);

      // Set alignment buttons
      document.querySelectorAll('[data-align]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-align') === obj.align);
      });

      // Set case buttons
      document.querySelectorAll('[data-case]').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-case') === obj.case);
      });

      // Wire up all controls
      wireTextControls(id);
    }

    function hideEditControls() {
      document.getElementById(`text-content-section-${sectionId}`).style.display = 'none';
      document.getElementById(`text-font-section-${sectionId}`).style.display = 'none';
      document.getElementById(`text-effects-section-${sectionId}`).style.display = 'none';
      document.getElementById(`text-transform-section-${sectionId}`).style.display = 'none';
      document.getElementById(`text-export-section-${sectionId}`).style.display = 'none';
    }

    // Wire up all text controls
    function wireTextControls(id) {
      const obj = textEngine.getTextObject(id);
      if (!obj) return;

      // Content
      const contentInput = document.getElementById(`text-content-${sectionId}`);
      let contentTimeout;
      contentInput.addEventListener('input', (e) => {
        clearTimeout(contentTimeout);
        contentTimeout = setTimeout(() => {
          textEngine.updateTextObject(id, { content: e.target.value });
          updateLayersList();
        }, 100);
      });

      // Font
      document.getElementById(`text-font-${sectionId}`).addEventListener('change', (e) => {
        textEngine.loadFont(e.target.value).then(() => {
          textEngine.updateTextObject(id, { fontFamily: e.target.value });
        });
      });

      // Size
      document.getElementById(`text-size-${sectionId}`).addEventListener('input', (e) => {
        textEngine.updateTextObject(id, { sizePx: parseInt(e.target.value) });
      });

      // Color
      const colorPicker = document.getElementById(`text-color-${sectionId}`);
      const colorHex = document.getElementById(`text-color-hex-${sectionId}`);
      
      colorPicker.addEventListener('input', (e) => {
        colorHex.value = e.target.value;
        textEngine.updateTextObject(id, { color: { mode: 'solid', value: e.target.value } });
      });

      colorHex.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          colorPicker.value = e.target.value;
          textEngine.updateTextObject(id, { color: { mode: 'solid', value: e.target.value } });
        }
      });

      // Tracking
      const trackingInput = document.getElementById(`text-tracking-${sectionId}`);
      const trackingOutput = document.getElementById(`text-tracking-output-${sectionId}`);
      trackingInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        trackingOutput.textContent = `${val}px`;
        textEngine.updateTextObject(id, { tracking: val });
      });

      // Leading
      const leadingInput = document.getElementById(`text-leading-${sectionId}`);
      const leadingOutput = document.getElementById(`text-leading-output-${sectionId}`);
      leadingInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        leadingOutput.textContent = val.toFixed(1);
        textEngine.updateTextObject(id, { leading: val });
      });

      // Alignment
      document.querySelectorAll('[data-align]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const align = e.target.getAttribute('data-align');
          document.querySelectorAll('[data-align]').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          textEngine.updateTextObject(id, { align });
        });
      });

      // Case
      document.querySelectorAll('[data-case]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const caseStyle = e.target.getAttribute('data-case');
          document.querySelectorAll('[data-case]').forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          textEngine.updateTextObject(id, { case: caseStyle });
        });
      });

      // Rotation
      const rotateInput = document.getElementById(`text-rotate-${sectionId}`);
      const rotateOutput = document.getElementById(`text-rotate-output-${sectionId}`);
      rotateInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        rotateOutput.textContent = `${val}°`;
        textEngine.updateTextObject(id, { transform: { ...obj.transform, rotateDeg: val } });
      });

      // Scale
      const scaleInput = document.getElementById(`text-scale-${sectionId}`);
      const scaleOutput = document.getElementById(`text-scale-output-${sectionId}`);
      scaleInput.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        scaleOutput.textContent = val.toFixed(2);
        textEngine.updateTextObject(id, { transform: { ...obj.transform, scale: val } });
      });

      // Center button
      document.getElementById(`text-center-btn-${sectionId}`).addEventListener('click', () => {
        const printArea = textEngine.getPrintAreaBounds();
        textEngine.updateTextObject(id, { 
          transform: { 
            ...obj.transform, 
            x: printArea.width / 2,
            y: printArea.height / 2
          } 
        });
      });

      // Reset button
      document.getElementById(`text-reset-btn-${sectionId}`).addEventListener('click', () => {
        textEngine.updateTextObject(id, { 
          transform: { 
            x: obj.transform.x,
            y: obj.transform.y,
            scale: 1,
            rotateDeg: 0
          } 
        });
        rotateInput.value = 0;
        rotateOutput.textContent = '0°';
        scaleInput.value = 1;
        scaleOutput.textContent = '1.0';
      });

      // Outline toggle
      const outlineToggle = document.getElementById(`text-outline-toggle-${sectionId}`);
      const outlineControls = document.getElementById(`text-outline-controls-${sectionId}`);
      outlineToggle.addEventListener('change', (e) => {
        outlineControls.style.display = e.target.checked ? 'block' : 'none';
        if (e.target.checked) {
          const color = document.getElementById(`text-outline-color-${sectionId}`).value;
          const width = parseFloat(document.getElementById(`text-outline-width-${sectionId}`).value);
          textEngine.updateTextObject(id, { outline: { color, width, join: 'miter' } });
        } else {
          textEngine.updateTextObject(id, { outline: null });
        }
      });

      // Shadow toggle
      const shadowToggle = document.getElementById(`text-shadow-toggle-${sectionId}`);
      const shadowControls = document.getElementById(`text-shadow-controls-${sectionId}`);
      shadowToggle.addEventListener('change', (e) => {
        shadowControls.style.display = e.target.checked ? 'block' : 'none';
        if (e.target.checked) {
          const x = parseFloat(document.getElementById(`text-shadow-x-${sectionId}`).value);
          const y = parseFloat(document.getElementById(`text-shadow-y-${sectionId}`).value);
          const blur = parseFloat(document.getElementById(`text-shadow-blur-${sectionId}`).value);
          textEngine.updateTextObject(id, { shadow: { x, y, blur, opacity: 0.5 } });
        } else {
          textEngine.updateTextObject(id, { shadow: null });
        }
      });

      // Curve toggle
      const curveToggle = document.getElementById(`text-curve-toggle-${sectionId}`);
      const curveControls = document.getElementById(`text-curve-controls-${sectionId}`);
      curveToggle.addEventListener('change', (e) => {
        curveControls.style.display = e.target.checked ? 'block' : 'none';
        if (e.target.checked) {
          const radius = parseFloat(document.getElementById(`text-curve-radius-${sectionId}`).value);
          textEngine.updateTextObject(id, { path: { type: 'arc', radius, invert: false } });
        } else {
          textEngine.updateTextObject(id, { path: { type: 'none' } });
        }
      });

      // Export buttons
      document.getElementById(`text-export-svg-${sectionId}`).addEventListener('click', () => {
        const svg = textEngine.exportSVG();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'text-design.svg';
        a.click();
        URL.revokeObjectURL(url);
        console.log('✅ SVG exported');
      });

      document.getElementById(`text-export-json-${sectionId}`).addEventListener('click', () => {
        const json = textEngine.exportJSON();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'text-design.json';
        a.click();
        URL.revokeObjectURL(url);
        console.log('✅ JSON exported');
      });

      document.getElementById(`text-export-png-${sectionId}`).addEventListener('click', () => {
        textEngine.exportPNG().then(() => {
          console.log('✅ PNG export initiated');
        });
      });
    }

    console.log('✅ Text Engine initialized and wired');
  };

})();

