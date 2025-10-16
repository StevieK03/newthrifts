# 🎨 T-Shirt Mockup Design Buttons - Complete Documentation

## Overview
This documentation covers the complete t-shirt mockup design button system extracted from the Shopify theme. The system includes HTML structure, CSS styling, JavaScript functionality, and interactive features for a professional t-shirt design interface.

## 📁 Files Included

### 1. `tshirt-mockup-buttons-html.html`
Complete HTML structure for all button components including:
- View control buttons (Front, Back, Hanging, Person Models)
- Color control buttons (White, Black, Pink, Blue)
- 3D control buttons (Rotate, Zoom, Validate, Reset)
- Hero action buttons (Upload Design, Submit Request)
- Secondary action buttons (Download, Edit, Placement Guide, Perfect Fit, Remove)

### 2. `tshirt-mockup-buttons-css.css`
Complete CSS styling including:
- Base button styles with glassmorphism effects
- Animated gradients and hover effects
- Hero button animations (Royal Blue flow, Sparkle effects, Pulse animations)
- Responsive design for mobile devices
- Accessibility features (focus states, ARIA labels)

### 3. `tshirt-mockup-buttons-javascript.js`
Complete JavaScript functionality including:
- Mockup state management
- Event handlers for all buttons
- File upload handling
- Drag and drop functionality
- Perfect fit positioning
- Download composite image generation
- Form submission logic

### 4. `tshirt-mockup-complete-example.html`
Complete working example that demonstrates:
- Full integration of all components
- Interactive mockup canvas
- Real-time design updates
- All button functionality working together

## 🎯 Button Categories

### View Controls
- **Front View** - Shows t-shirt from the front
- **Back View** - Shows t-shirt from the back  
- **Hanging View** - Shows t-shirt hanging
- **Person Model 1** - Shows t-shirt on person model 1
- **Person Model 2** - Shows t-shirt on person model 2

### Color Controls
- **White** - White t-shirt color (default active)
- **Black** - Black t-shirt color
- **Pink** - Pink t-shirt color
- **Blue** - Blue t-shirt color

### 3D Controls
- **3D Rotate** - Rotates design by 15 degrees
- **Zoom** - Increases design size (max 80%)
- **Validate** - Checks design positioning and size
- **Reset** - Resets design to default position

### Hero Action Buttons
- **Upload Your Design** - Royal blue gradient with flowing animations and sparkle effects
- **Submit Request** - Pink/red gradient with pulse animation

### Secondary Action Buttons
- **Download Mockup** - Downloads high-resolution composite image
- **Edit Design** - Opens design editing interface
- **Placement Guide** - Shows/hides print area guidelines
- **Perfect Fit** - Automatically positions design optimally
- **Remove Design** - Removes uploaded design

## 🎨 Visual Features

### Glassmorphism Design
- Semi-transparent backgrounds with backdrop blur
- Layered visual depth
- Modern, professional appearance

### Animated Gradients
- **Upload Button**: Royal blue flowing gradient (`upload-royal-flow`)
- **Submit Button**: Pink/red pulsing gradient (`submit-pulse`)
- **Sparkle Effects**: Floating white particles (`sparkle-float`)

### Hover Effects
- Transform animations (translateY, scale)
- Enhanced shadows and glows
- Smooth transitions with cubic-bezier easing

### Responsive Design
- Mobile-optimized layouts
- Flexible grid systems
- Touch-friendly button sizes

## ⚙️ JavaScript Functionality

### State Management
```javascript
const mockup = {
  state: { view: "front", color: "white" },
  placementState: {
    topPct: 30,
    leftPct: 50,
    widthPct: 50,
    heightPct: 65,
    rotateDeg: 0,
    hasUploadedDesign: false,
    designSelected: false
  }
};
```

### Event Handling
- View button clicks update `state.view` and call `updateBase()`
- Color button clicks update `state.color` and call `updateBase()`
- Upload button triggers file input and processes uploaded images
- 3D control buttons manipulate `placementState` values
- Action buttons trigger specific functionality (download, submit, etc.)

### File Upload
- Accepts PNG, JPG, JPEG, SVG files
- Maximum file size: 10MB
- Converts to base64 data URL
- Applies to mockup overlay with proper scaling

### Drag & Drop
- Mouse-based dragging of uploaded designs
- Real-time position updates
- Constrained to canvas bounds
- Visual feedback with cursor changes

### Perfect Fit Algorithm
```javascript
const perfectDimensions = {
  topPct: 29.142857142856876,
  leftPct: 50.21428571428568,
  widthPct: 37,
  heightPct: 42,
  rotateDeg: 0
};
```

### Download Functionality
- Creates high-resolution composite canvas (2x scale)
- Draws base t-shirt image
- Overlays uploaded design with current position/size/rotation
- Downloads as PNG file with timestamp

## 🎭 CSS Animations

### Upload Button Animations
```css
@keyframes upload-royal-flow {
  0% { background-position: 0% 50%; transform: scale(1); }
  25% { background-position: 50% 0%; transform: scale(1.01); }
  50% { background-position: 100% 50%; transform: scale(1.02); }
  75% { background-position: 50% 100%; transform: scale(1.01); }
  100% { background-position: 0% 50%; transform: scale(1); }
}

@keyframes sparkle-float {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
  50% { transform: translateY(-8px) scale(1.2); opacity: 1; }
}
```

### Submit Button Animations
```css
@keyframes submit-pulse {
  0%, 100% { 
    box-shadow: 0 6px 24px rgba(255, 79, 163, 0.4);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 10px 32px rgba(255, 79, 163, 0.6);
    transform: scale(1.02);
  }
}
```

## 📱 Responsive Breakpoints

### Mobile (≤ 768px)
- Single column layout for action buttons
- Smaller button sizes and padding
- Stacked control groups
- Optimized touch targets

### Tablet (≤ 480px)
- Further size reductions
- Simplified button layouts
- Compressed spacing

## ♿ Accessibility Features

### ARIA Labels
- `role="tablist"` for button groups
- `aria-selected` for active states
- `aria-label` for screen readers

### Keyboard Navigation
- Tab navigation between buttons
- Enter/Space activation
- Delete/Backspace for design removal

### Focus States
- Visible focus indicators
- High contrast outlines
- Consistent focus behavior

### Color Contrast
- WCAG AA compliant color ratios
- High contrast text on buttons
- Clear visual hierarchy

## 🔧 Integration Guide

### Basic Setup
1. Include the CSS file in your `<head>`
2. Include the JavaScript file before closing `</body>`
3. Add the HTML structure to your page
4. Initialize with `mockup.init()`

### Customization
- Modify color schemes in CSS variables
- Adjust animation durations and easing
- Customize button sizes and spacing
- Add new view types or color options

### Shopify Integration
- Replace asset URLs with Shopify liquid tags
- Use section IDs for unique element identification
- Integrate with Shopify's form submission system
- Connect to Shopify's file upload system

## 🚀 Performance Considerations

### Optimization Tips
- Use CSS transforms instead of position changes
- Debounce drag events for smooth performance
- Lazy load mockup images
- Compress uploaded images before processing

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- File API and Canvas API support needed
- ES6+ JavaScript features used

## 📊 File Sizes
- HTML: ~15KB (complete example)
- CSS: ~12KB (all styles)
- JavaScript: ~25KB (full functionality)
- Total: ~52KB (uncompressed)

## 🎯 Use Cases
- E-commerce t-shirt customization
- Print-on-demand services
- Custom merchandise platforms
- Design preview tools
- Product visualization systems

## 🔄 Version History
- **v1.0** - Initial extraction from Shopify theme
- Complete button system with all functionality
- Responsive design and accessibility features
- Professional animations and interactions

---

*This documentation covers the complete t-shirt mockup design button system extracted from the NewThrifts Shopify theme. All code is production-ready and can be integrated into any web application.*
