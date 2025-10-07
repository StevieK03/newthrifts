# Interactive T-shirt Mockup v2.0 - Implementation Guide

## 🏗️ Architecture Overview

### Core Components
1. **Liquid Template** (`sections/interactive-mockup-v2.liquid`) - Shopify section with schema
2. **JavaScript Engine** (`assets/mockup-engine-v2.js`) - High-performance mockup engine
3. **CSS Styles** (`assets/mockup-styles-v2.css`) - Responsive, accessible styling
4. **Cart Integration** (`assets/cart-integration.js`) - Design data persistence
5. **Test Suite** (`MOCKUP_TEST_CHECKLIST.md`) - Comprehensive testing guide

### Key Features
- **High-Performance**: OffscreenCanvas, debounced events, memory optimization
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Multi-View**: Front, back, hanging, model views with color variants
- **High-DPI**: 2x, 3x scaling for crisp exports
- **Cart Integration**: Design data persisted in line item properties
- **Mobile Optimized**: Touch gestures, responsive design, performance optimized

## 🚀 Installation

### 1. Upload Files
```bash
# Upload section file
sections/interactive-mockup-v2.liquid

# Upload assets
assets/mockup-engine-v2.js
assets/mockup-styles-v2.css
assets/cart-integration.js
```

### 2. Add to Theme
```liquid
<!-- In your theme.liquid, add before </head> -->
{{ 'mockup-styles-v2.css' | asset_url | stylesheet_tag }}

<!-- Add before </body> -->
{{ 'mockup-engine-v2.js' | asset_url | script_tag }}
{{ 'cart-integration.js' | asset_url | script_tag }}
```

### 3. Add Section to Template
```liquid
<!-- In your product template or index.liquid -->
{% section 'interactive-mockup-v2' %}
```

## ⚙️ Configuration

### Section Settings
The section includes comprehensive settings in the Shopify admin:

#### Content Settings
- **Title**: Section heading
- **Description**: Section description text
- **Base Mockup**: T-shirt image upload

#### Design Overlay Settings
- **Top Position**: 0-90% (step: 0.5%)
- **Left Position**: 0-90% (step: 0.5%)
- **Design Width**: 10-100% (step: 1%)
- **Design Rotation**: -45° to 45° (step: 0.5°)

#### Styling Options
- **Background Color**: Section background
- **Title Color**: Heading color
- **Text Color**: Description color

#### Functionality Options
- **Download Feature**: Enable/disable mockup downloads
- **Cart Integration**: Save design data to cart
- **Accessibility**: Enhanced keyboard/screen reader support

## 🎨 Customization

### CSS Custom Properties
```css
:root {
  --mockup-primary: #27e1c1;
  --mockup-secondary: #8b5cf6;
  --mockup-danger: #ef4444;
  --mockup-success: #10b981;
  --mockup-warning: #f59e0b;
  --mockup-info: #3b82f6;
  
  --mockup-bg: #f8fafc;
  --mockup-surface: #ffffff;
  --mockup-text: #374151;
  --mockup-text-muted: #6b7280;
  --mockup-border: #e2e8f0;
}
```

### JavaScript Configuration
```javascript
const mockupEngine = new MockupEngine('section-id', {
  highDPI: true,
  dpiScale: 3,
  debounceDelay: 16,
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ['image/png', 'image/jpeg', 'image/svg+xml']
});
```

## 🔧 Advanced Configuration

### Multi-View Setup
```javascript
// Configure available views
const mockupImages = {
  front: {
    white: "{{ 'WFront_t-shirt.png' | asset_url }}",
    black: "{{ 'WFront_t-shirt.png' | asset_url }}"
  },
  back: {
    white: "{{ 'Wback_t-shirt.png' | asset_url }}",
    black: "{{ 'Wback_t-shirt.png' | asset_url }}"
  }
};
```

### Cart Integration Setup
```javascript
// Enable cart integration
const cartIntegration = new CartIntegration();

// Listen for design updates
document.addEventListener('design:updated', (event) => {
  cartIntegration.saveDesignToCart(event.detail);
});
```

### Accessibility Configuration
```javascript
// Enable enhanced accessibility
const mockupEngine = new MockupEngine('section-id', {
  enableAccessibility: true,
  announceChanges: true,
  keyboardNavigation: true
});
```

## 📱 Mobile Optimization

### Touch Gestures
- **Single Touch**: Drag design
- **Two Finger**: Pinch to resize
- **Long Press**: Context menu
- **Swipe**: Quick position adjustment

### Performance Optimizations
- **Lazy Loading**: Images load on demand
- **Debounced Events**: Smooth 60fps interactions
- **Memory Management**: Automatic cleanup
- **Canvas Caching**: OffscreenCanvas for high-DPI

## 🎯 Performance Monitoring

### Core Web Vitals
- **LCP**: < 2.5 seconds
- **FID**: < 100 milliseconds
- **CLS**: < 0.1

### Performance Metrics
```javascript
// Monitor performance
const performanceMonitor = {
  loadTime: performance.now() - performance.timing.navigationStart,
  memoryUsage: performance.memory?.usedJSHeapSize,
  frameRate: 60 // Target FPS
};
```

## 🔒 Security Considerations

### File Upload Security
- **Type Validation**: MIME type checking
- **Size Limits**: 10MB maximum
- **Content Scanning**: Image validation
- **XSS Prevention**: Input sanitization

### Data Protection
- **Cart Data**: Encrypted in line item properties
- **Image Compression**: Automatic optimization
- **Session Management**: Secure data handling

## 🧪 Testing

### Automated Testing
```bash
# Run performance tests
npm run test:performance

# Run accessibility tests
npm run test:a11y

# Run cross-browser tests
npm run test:browser
```

### Manual Testing
See `MOCKUP_TEST_CHECKLIST.md` for comprehensive testing guide.

## 🐛 Troubleshooting

### Common Issues

#### Images Not Loading
```javascript
// Check asset URLs
console.log('Asset URL:', "{{ 'WFront_t-shirt.png' | asset_url }}");

// Verify file exists
fetch("{{ 'WFront_t-shirt.png' | asset_url }}")
  .then(response => console.log('Status:', response.status));
```

#### Performance Issues
```javascript
// Monitor memory usage
setInterval(() => {
  console.log('Memory:', performance.memory?.usedJSHeapSize);
}, 5000);
```

#### Cart Integration Issues
```javascript
// Check cart data
fetch('/cart.js')
  .then(response => response.json())
  .then(cart => console.log('Cart:', cart));
```

### Debug Mode
```javascript
// Enable debug logging
const mockupEngine = new MockupEngine('section-id', {
  debug: true,
  verbose: true
});
```

## 📊 Analytics Integration

### Google Analytics
```javascript
// Track design interactions
gtag('event', 'design_upload', {
  'event_category': 'mockup',
  'event_label': 'file_type'
});
```

### Custom Events
```javascript
// Listen for custom events
document.addEventListener('design:updated', (event) => {
  // Track design changes
  analytics.track('Design Updated', event.detail);
});
```

## 🔄 Updates & Maintenance

### Version Control
- **Semantic Versioning**: v2.0.0
- **Changelog**: Document all changes
- **Migration Guide**: Update instructions
- **Backward Compatibility**: Maintain API compatibility

### Performance Monitoring
- **Error Tracking**: Monitor JavaScript errors
- **Performance Metrics**: Track load times
- **User Behavior**: Analyze usage patterns
- **Conversion Impact**: Measure business impact

## 📚 API Reference

### MockupEngine Class
```javascript
class MockupEngine {
  constructor(sectionId, options)
  init()
  updateBase()
  updateDesign()
  updateDesignPosition()
  downloadComposite()
  cleanup()
}
```

### CartIntegration Class
```javascript
class CartIntegration {
  constructor()
  saveDesignToCart(designData)
  restoreDesignFromCart()
  exportDesignData()
  importDesignData(file)
}
```

### Events
```javascript
// Available events
'design:updated'     // Design state changed
'design:restore'     // Design restored from cart
'cart:updated'       // Cart data updated
'mockup:ready'       // Mockup initialized
```

## 🎉 Success Metrics

### Performance Targets
- **Load Time**: < 3 seconds
- **Interaction Response**: < 100ms
- **Memory Usage**: < 100MB
- **Error Rate**: < 0.1%

### User Experience Targets
- **Task Completion**: > 90%
- **User Satisfaction**: > 4.5/5
- **Accessibility Score**: 100% WCAG 2.1 AA
- **Mobile Usability**: > 95%

### Business Impact Targets
- **Conversion Rate**: +15% improvement
- **Cart Abandonment**: -10% reduction
- **User Engagement**: +25% increase
- **Support Tickets**: < 5% of users

---

## 📞 Support

For technical support or questions:
- **Documentation**: Check this guide first
- **Issues**: Report bugs with reproduction steps
- **Feature Requests**: Submit enhancement ideas
- **Community**: Join our developer community

**Version**: 2.0.0  
**Last Updated**: 2024  
**Compatibility**: Shopify 2.0+ themes
