# 🗄️ NewThrifts Database Setup Guide

Complete guide for setting up and using the custom design database tables.

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Database Tables](#database-tables)
3. [JavaScript API Reference](#javascript-api-reference)
4. [Usage Examples](#usage-examples)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Step 1: Create Database Tables

1. **Open Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Click on "SQL Editor" in the left sidebar
   - Click "+ New query"

2. **Run Migration**
   - Copy all content from `assets/supabase-tables-migration.sql`
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - ✅ You should see "Success. No rows returned"

3. **Verify Tables Created**
   - Go to "Table Editor" in Supabase
   - You should see these new tables:
     - `custom_designs`
     - `order_customizations`
     - `product_interactions`
     - `design_templates`
     - `design_gallery`
     - `design_likes`

### Step 2: Deploy to Shopify

The JavaScript helper is already included in your theme! Just push:

```bash
shopify theme push --theme=137255125090 --allow-live
```

---

## 📊 Database Tables

### 1. **`custom_designs`** - User T-Shirt Designs
Stores all custom t-shirt designs created by users.

**Key Fields:**
- `user_id` - Links to user profile
- `design_name` - User's name for the design
- `design_data` - JSON with canvas/SVG data
- `preview_image_url` - Preview thumbnail
- `base_color` - T-shirt color
- `is_public` - Public in gallery?
- `tags` - Array of tags for search

**Use Cases:**
- Save designs from mockup tool
- Load saved designs for editing
- Share designs publicly

---

### 2. **`order_customizations`** - Shopify Orders + Designs
Links Shopify orders to custom designs.

**Key Fields:**
- `shopify_order_id` - Shopify order ID
- `custom_design_id` - Links to saved design
- `customization_data` - Design snapshot at purchase
- `order_status` - Order fulfillment status

**Use Cases:**
- Track which designs were ordered
- Show order history with previews
- Analytics on popular designs

---

### 3. **`product_interactions`** - User Engagement Tracking
Tracks every product interaction for analytics.

**Interaction Types:**
- `view` - Product page view
- `quick_view` - Quick view modal opened
- `add_to_cart` - Added to cart
- `wishlist` - Added to wishlist
- `purchase` - Completed purchase

**Use Cases:**
- Conversion funnel analysis
- Popular products tracking
- User behavior insights

---

### 4. **`design_templates`** - Pre-Made Design Templates
Ready-to-use design templates for users.

**Key Fields:**
- `template_name` - Template display name
- `category` - "Halloween", "Sports", etc.
- `design_data` - JSON template data
- `is_premium` - Requires subscription?
- `usage_count` - Popularity metric

**Use Cases:**
- Quick-start designs
- Seasonal collections
- Premium content

---

### 5. **`design_gallery`** - Public Design Showcase
Public gallery of user-created designs.

**Key Fields:**
- `custom_design_id` - Links to design
- `likes_count` - Social engagement
- `views_count` - Visibility metric
- `is_featured` - Admin featured?

**Use Cases:**
- Community showcase
- Design inspiration
- Social proof

---

### 6. **`design_likes`** - Like/Favorite System
Tracks which users liked which designs.

**Features:**
- Auto-increments gallery likes count
- Prevents duplicate likes
- Enables unlike functionality

---

## 🛠️ JavaScript API Reference

All functions are available globally via `window.NewThriftsDesigns`

### Custom Designs

#### Save a Design
```javascript
const result = await window.NewThriftsDesigns.saveCustomDesign({
  name: "My Awesome Design",
  canvas: { /* canvas/SVG data */ },
  previewUrl: "https://...",
  baseColor: "#000000",
  size: "L",
  isPublic: true,
  tags: ["halloween", "spooky"],
  productId: "123456789",
  variantId: "987654321"
});

if (result.success) {
  console.log("Design saved!", result.design);
}
```

#### Get User's Designs
```javascript
const result = await window.NewThriftsDesigns.getUserDesigns({
  publicOnly: false,
  limit: 10
});

if (result.success) {
  result.designs.forEach(design => {
    console.log(design.design_name);
  });
}
```

#### Update a Design
```javascript
const result = await window.NewThriftsDesigns.updateDesign(
  'design-id-here',
  {
    design_name: "Updated Name",
    is_public: true
  }
);
```

#### Delete a Design
```javascript
const result = await window.NewThriftsDesigns.deleteDesign('design-id-here');
```

---

### Gallery Functions

#### Get Gallery Designs
```javascript
const result = await window.NewThriftsDesigns.getGalleryDesigns({
  limit: 20,
  sortBy: 'likes_count' // or 'views_count', 'created_at'
});

if (result.success) {
  result.designs.forEach(design => {
    console.log(`${design.title} - ${design.likes_count} likes`);
  });
}
```

#### Add Design to Gallery
```javascript
const result = await window.NewThriftsDesigns.addToGallery(
  'design-id-here',
  {
    title: "Check out my design!",
    description: "Halloween themed tee"
  }
);
```

#### Like/Unlike Designs
```javascript
// Like
await window.NewThriftsDesigns.likeDesign('design-id', 'gallery-id');

// Unlike
await window.NewThriftsDesigns.unlikeDesign('design-id');
```

---

### Design Templates

#### Get Templates
```javascript
const result = await window.NewThriftsDesigns.getDesignTemplates({
  category: 'Halloween',
  premiumOnly: false
});

if (result.success) {
  result.templates.forEach(template => {
    console.log(template.template_name);
  });
}
```

#### Track Template Usage
```javascript
await window.NewThriftsDesigns.useTemplate('template-id');
```

---

### Analytics

#### Track Product Interaction
```javascript
await window.NewThriftsDesigns.trackProductInteraction({
  productId: '123456789',
  productTitle: 'Cool T-Shirt',
  type: 'quick_view', // view, quick_view, add_to_cart, wishlist, purchase
  variantId: '987654321',
  variantTitle: 'Size M / Black',
  price: 29.99,
  metadata: {
    source: 'homepage',
    position: 3
  }
});
```

#### Get Product Analytics
```javascript
const result = await window.NewThriftsDesigns.getProductAnalytics('product-id');

if (result.success) {
  console.log(`Views: ${result.stats.total_views}`);
  console.log(`Conversion Rate: ${result.stats.conversion_rate}%`);
}
```

---

### Order Customizations

#### Save Order with Design
```javascript
const result = await window.NewThriftsDesigns.saveOrderCustomization({
  orderId: 'shopify-order-id',
  lineItemId: 'line-item-id',
  orderNumber: '#1001',
  designId: 'custom-design-id',
  designSnapshot: { /* design data */ },
  productTitle: 'Custom T-Shirt',
  variantTitle: 'Size L / Black',
  quantity: 2,
  price: 59.98
});
```

#### Get User's Orders
```javascript
const result = await window.NewThriftsDesigns.getUserOrders();

if (result.success) {
  result.orders.forEach(order => {
    console.log(`Order ${order.shopify_order_number}`);
  });
}
```

---

## 💡 Usage Examples

### Example 1: Save Design from Mockup Tool

```javascript
// In your interactive mockup section
document.getElementById('save-design-btn').addEventListener('click', async () => {
  const canvas = document.getElementById('tshirt-canvas');
  const designData = {
    elements: canvas.toJSON(), // Or your canvas data format
    background: canvas.backgroundColor
  };

  const result = await window.NewThriftsDesigns.saveCustomDesign({
    name: document.getElementById('design-name').value,
    canvas: designData,
    previewUrl: canvas.toDataURL(),
    baseColor: document.getElementById('color-picker').value,
    size: document.getElementById('size-select').value,
    isPublic: document.getElementById('make-public').checked,
    tags: ['custom', 'user-created']
  });

  if (result.success) {
    alert('Design saved successfully!');
  } else {
    alert('Error: ' + result.error);
  }
});
```

### Example 2: Track Quick View Opens

```javascript
// In your quick view modal JS
document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    const productId = e.target.dataset.productId;
    const productTitle = e.target.dataset.productTitle;

    // Track the interaction
    await window.NewThriftsDesigns.trackProductInteraction({
      productId: productId,
      productTitle: productTitle,
      type: 'quick_view'
    });

    // Then open your modal...
  });
});
```

### Example 3: Display User's Saved Designs

```javascript
async function displayUserDesigns() {
  const result = await window.NewThriftsDesigns.getUserDesigns({ limit: 10 });

  if (result.success) {
    const container = document.getElementById('my-designs');
    container.innerHTML = result.designs.map(design => `
      <div class="design-card">
        <img src="${design.preview_image_url}" alt="${design.design_name}">
        <h3>${design.design_name}</h3>
        <p>Created: ${new Date(design.created_at).toLocaleDateString()}</p>
        <button onclick="loadDesign('${design.id}')">Edit</button>
        <button onclick="deleteDesign('${design.id}')">Delete</button>
      </div>
    `).join('');
  }
}

// Call on profile page
document.addEventListener('DOMContentLoaded', displayUserDesigns);
```

### Example 4: Popular Gallery with Likes

```javascript
async function showGallery() {
  const result = await window.NewThriftsDesigns.getGalleryDesigns({
    limit: 12,
    sortBy: 'likes_count'
  });

  if (result.success) {
    const gallery = document.getElementById('design-gallery');
    gallery.innerHTML = result.designs.map(item => `
      <div class="gallery-item">
        <img src="${item.custom_designs.preview_image_url}">
        <h4>${item.title || item.custom_designs.design_name}</h4>
        <p>By ${item.user_profiles.email.split('@')[0]}</p>
        <div class="stats">
          <span>❤️ ${item.likes_count}</span>
          <span>👁️ ${item.views_count}</span>
        </div>
        <button onclick="likeDesign('${item.custom_design_id}', '${item.id}')">
          Like
        </button>
      </div>
    `).join('');
  }
}
```

---

## 🔧 Troubleshooting

### Issue: "User must be logged in" Error
**Solution:** Ensure user is authenticated before calling functions:
```javascript
const { data: { user } } = await window.supabase.auth.getUser();
if (!user) {
  alert('Please log in first');
  return;
}
```

### Issue: RLS Policy Error
**Solution:** Check that Row Level Security policies allow the operation. You may need to adjust policies in Supabase dashboard.

### Issue: Foreign Key Violation
**Solution:** Ensure referenced records exist:
- `user_id` must exist in `user_profiles`
- `custom_design_id` must exist in `custom_designs`

### Issue: Unique Constraint Error
**Solution:** Some operations can't be repeated:
- Can't add same design to gallery twice
- Can't like same design twice
- Use try-catch to handle gracefully

---

## 📈 Analytics Queries (Run in Supabase SQL Editor)

### Most Popular Designs
```sql
SELECT 
  cd.design_name,
  cd.preview_image_url,
  dg.likes_count,
  dg.views_count,
  up.email as creator_email
FROM design_gallery dg
JOIN custom_designs cd ON dg.custom_design_id = cd.id
LEFT JOIN user_profiles up ON dg.user_id = up.id
ORDER BY dg.likes_count DESC
LIMIT 10;
```

### Conversion Funnel for Product
```sql
SELECT * FROM product_funnel 
WHERE shopify_product_id = 'YOUR_PRODUCT_ID';
```

### User Design Stats
```sql
SELECT * FROM user_design_stats 
WHERE user_id = 'USER_ID';
```

### Recent Orders with Designs
```sql
SELECT 
  oc.*,
  cd.design_name,
  cd.preview_image_url
FROM order_customizations oc
LEFT JOIN custom_designs cd ON oc.custom_design_id = cd.id
ORDER BY oc.created_at DESC
LIMIT 20;
```

---

## 🎯 Next Steps

1. ✅ Create tables in Supabase
2. ✅ Deploy theme updates
3. 🔨 Integrate save functionality in mockup tool
4. 🔨 Add "My Designs" page to user profile
5. 🔨 Build design gallery showcase
6. 🔨 Create analytics dashboard
7. 🔨 Add design templates section

---

## 🆘 Need Help?

- Check console for error messages (`F12` → Console)
- Verify Supabase connection works
- Test with simple queries first
- Check RLS policies in Supabase

---

**Happy Building! 🚀**

