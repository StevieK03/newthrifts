# 📏 NewThrifts Size Chart System

Complete guide for the size chart and measurement system integrated with custom t-shirt designs.

---

## 🚀 Quick Start

### Step 1: Create Size Chart Tables in Supabase

1. Open **Supabase SQL Editor**
2. Copy SQL from `assets/supabase-size-chart.sql`
3. Paste and **Run**
4. ✅ Tables created with your size data!

### Step 2: Verify Data

Check that these tables exist in Supabase Table Editor:
- ✅ `size_charts` - Your t-shirt measurements
- ✅ `size_recommendations` - Size suggestions
- ✅ `complete_size_guide` (view)
- ✅ `size_comparison` (view)

---

## 📊 Your Size Data (Loaded Automatically)

### Black & White T-Shirts - Measurements (cm)

| Size | Length (衣长) | Bust (胸宽) | Shoulder (肩宽) | Sleeve (袖长) |
|------|---------------|-------------|-----------------|---------------|
| XXS  | 52            | 46          | 42              | 19            |
| XS   | 54            | 48          | 43.5            | 19            |
| S    | 56            | 50          | 45              | 20            |
| M    | 78            | 52          | 46.5            | 20            |
| L    | 60            | 54          | 48              | 21            |
| XL   | 62            | 56          | 49.5            | 21            |
| XXL  | 64            | 58          | 51              | 22            |

**Important Notes:**
- ±1-3cm margin of error (flat measurement)
- Choose carefully based on body type
- Slight color differences may occur

---

## 🛠️ JavaScript API Reference

All functions available via `window.NewThriftsSizes`

### 1. Get Size Chart

```javascript
// Get size chart for specific product and color
const result = await window.NewThriftsSizes.getSizeChart('t-shirt', 'black');

if (result.success) {
  console.log(result.sizes); // Array of size objects
}
```

### 2. Get Available Sizes

```javascript
// Get all available sizes for a product type
const result = await window.NewThriftsSizes.getAvailableSizes('t-shirt');

if (result.success) {
  console.log(result.sizes); // ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
}
```

### 3. Get Size Recommendation

```javascript
// Get personalized size recommendation
const result = await window.NewThriftsSizes.getRecommendedSize({
  height: 175,      // cm
  weight: 70,       // kg
  fitPreference: 'regular' // 'tight', 'regular', 'loose', 'oversized'
});

if (result.success) {
  console.log(`Recommended: ${result.recommendation.size_code}`);
  console.log(result.message);
}
```

### 4. Display Size Chart

```javascript
// Display size chart in a container
await window.NewThriftsSizes.displaySizeChart(
  'size-chart-container',  // container ID
  't-shirt',               // product type
  'black'                  // color
);
```

### 5. Create Size Selector

```javascript
// Create a size dropdown with guide button
await window.NewThriftsSizes.createSizeSelector(
  'size-selector-container',
  't-shirt',
  (selectedSize) => {
    console.log('Selected size:', selectedSize);
    // Do something with the selected size
  }
);
```

### 6. Show Size Guide Modal

```javascript
// Open size guide in a modal
window.NewThriftsSizes.showSizeGuideModal('t-shirt', 'black');
```

### 7. Size Recommendation Wizard

```javascript
// Create an interactive size recommendation wizard
window.NewThriftsSizes.createSizeRecommendationWizard(
  'wizard-container',
  (recommendedSize) => {
    console.log('Wizard recommended:', recommendedSize);
    // Pre-select this size
  }
);
```

---

## 💡 Usage Examples

### Example 1: Add Size Selector to Product Page

```html
<!-- In your product template -->
<div class="product-options">
  <div id="size-selector"></div>
</div>

<script>
document.addEventListener('DOMContentLoaded', async () => {
  await window.NewThriftsSizes.createSizeSelector(
    'size-selector',
    't-shirt',
    (size) => {
      // Update variant based on size
      console.log('Selected:', size);
      document.getElementById('selected-size').value = size;
    }
  );
});
</script>
```

### Example 2: Size Guide Button

```html
<button onclick="window.NewThriftsSizes.showSizeGuideModal('t-shirt', 'black')">
  📏 View Size Guide
</button>
```

### Example 3: Size Recommendation Wizard

```html
<div id="size-wizard"></div>

<script>
window.NewThriftsSizes.createSizeRecommendationWizard(
  'size-wizard',
  (recommendedSize) => {
    // Auto-select the recommended size
    document.getElementById('size-select').value = recommendedSize;
    alert(`We recommend size ${recommendedSize}!`);
  }
);
</script>
```

### Example 4: Integrate with Custom Design

```javascript
// When saving a custom design, include size
const designData = {
  name: "My Cool Design",
  canvas: canvasData,
  previewUrl: previewImage,
  baseColor: '#000000',
  size: 'M', // From size selector
  isPublic: true
};

const result = await window.NewThriftsDesigns.saveCustomDesign(designData);
```

### Example 5: Display Size Chart on Page

```html
<div id="size-chart-display"></div>

<script>
document.addEventListener('DOMContentLoaded', async () => {
  await window.NewThriftsSizes.displaySizeChart(
    'size-chart-display',
    't-shirt',
    'black'
  );
});
</script>
```

---

## 🗄️ Database Queries

### Get Size Chart (SQL)

```sql
-- Using the helper function
SELECT * FROM get_size_chart('t-shirt', 'black');

-- Manual query
SELECT * FROM size_charts 
WHERE product_type = 't-shirt' 
  AND color = 'black' 
  AND is_active = true
ORDER BY size_code;
```

### Get Size Recommendation (SQL)

```sql
-- Using the helper function
SELECT * FROM get_recommended_size(175, 70, 'regular');
-- Returns: size_code, confidence, reason
```

### View Complete Guide

```sql
-- All sizes with recommendations
SELECT * FROM complete_size_guide;
```

### Size Comparison

```sql
-- Average measurements across colors
SELECT * FROM size_comparison;
```

---

## 🎨 Customization

### Update Size Data

```sql
-- Update measurements for a size
UPDATE size_charts
SET garment_length = 58,
    bust_width = 51
WHERE product_type = 't-shirt'
  AND color = 'black'
  AND size_code = 'S';
```

### Add New Color

```sql
-- Add navy blue t-shirt sizes
INSERT INTO size_charts (product_type, color, size_code, garment_length, bust_width, shoulder_width, sleeve_length)
VALUES 
('t-shirt', 'navy', 'S', 56, 50, 45, 20),
('t-shirt', 'navy', 'M', 78, 52, 46.5, 20),
-- ... etc
```

### Add New Product Type

```sql
-- Add hoodie measurements
INSERT INTO size_charts (product_type, color, size_code, garment_length, bust_width, shoulder_width, sleeve_length)
VALUES 
('hoodie', 'black', 'M', 68, 56, 50, 65),
-- ... etc
```

---

## 🎯 Integration with Custom Design System

### Save Design with Size

```javascript
// From your mockup tool
async function saveDesignWithSize() {
  const selectedSize = document.getElementById('size-select').value;
  const selectedColor = document.getElementById('color-picker').value;
  
  const design = await window.NewThriftsDesigns.saveCustomDesign({
    name: 'My Design',
    canvas: getCanvasData(),
    previewUrl: getPreviewImage(),
    baseColor: selectedColor,
    size: selectedSize,  // Include size!
    isPublic: true
  });
  
  if (design.success) {
    alert(`Design saved in size ${selectedSize}!`);
  }
}
```

### Filter Designs by Size

```javascript
// Get user's designs for a specific size
const { data } = await window.supabase
  .from('custom_designs')
  .select('*')
  .eq('size', 'M')
  .eq('user_id', userId);
```

---

## 📱 Responsive Design

The size chart components are fully responsive:
- Desktop: Full table view
- Tablet: Horizontal scroll
- Mobile: Stacked cards (automatic)

All modals and wizards adapt to screen size!

---

## 🌙 Dark Mode Support

All size chart components support dark mode automatically:
- Charts adjust colors for readability
- Modals respect theme
- Forms maintain contrast

No extra code needed!

---

## 🔧 Troubleshooting

### Issue: Size chart not loading
**Solution:** Ensure Supabase tables are created and data is inserted.

```javascript
// Test connection
const result = await window.NewThriftsSizes.getSizeChart('t-shirt', 'black');
console.log(result);
```

### Issue: Recommendations not working
**Solution:** Check that `size_recommendations` table has data and RPC function exists.

```sql
-- Verify function exists
SELECT * FROM pg_proc WHERE proname = 'get_recommended_size';
```

### Issue: Modal not appearing
**Solution:** Check z-index and ensure modal CSS is loaded.

```javascript
// Manual check
const modal = document.getElementById('size-guide-modal');
console.log(modal ? 'Modal exists' : 'Modal missing');
```

---

## 📈 Analytics

Track which sizes are popular:

```sql
-- Most selected sizes in custom designs
SELECT size, COUNT(*) as count
FROM custom_designs
GROUP BY size
ORDER BY count DESC;

-- Most ordered sizes
SELECT 
  oc.variant_title,
  COUNT(*) as orders
FROM order_customizations oc
GROUP BY oc.variant_title
ORDER BY orders DESC;
```

---

## 🎁 Next Steps

1. ✅ Create size chart tables in Supabase
2. 🔨 Add size selector to mockup tool
3. 🔨 Create "Find My Size" wizard on homepage
4. 🔨 Show size guide on product pages
5. 🔨 Track size preferences in user profiles
6. 🔨 Send size recommendations via email

---

## 🆘 Need Help?

- Check browser console for errors (`F12`)
- Verify Supabase tables exist
- Test API functions individually
- Check network tab for failed requests

---

**Happy Sizing! 📏✨**

