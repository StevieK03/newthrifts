# Shopify Buy Button SDK Setup Guide

## 🎯 Purpose
This solution **eliminates CSP `frame-ancestors` errors** by using Shopify's official Buy Button SDK instead of iframes. This is the recommended approach by Shopify.

---

## 📋 Step 1: Create a Storefront Access Token

1. **Go to Shopify Admin** → Settings → Apps and sales channels
2. Click **"Develop apps"** (at the bottom of the page)
3. If prompted, click **"Allow custom app development"**
4. Click **"Create an app"**
5. Name it something like **"Buy Button Embed"**
6. Click **"Create app"**

### Configure Storefront API Scopes:

7. Click **"Configure Storefront API scopes"**
8. Enable these scopes (at minimum):
   - ✅ `unauthenticated_read_product_listings`
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_read_product_tags`
   - ✅ `unauthenticated_read_collection_listings`
   - ✅ `unauthenticated_write_checkouts`
   - ✅ `unauthenticated_read_checkouts`

9. Click **"Save"**
10. Click **"Install app"**
11. Go to **"API credentials"** tab
12. Under **"Storefront API access token"**, click **"Manage"** or **"Create token"**
13. **Copy the token** - you'll need this! (It looks like: `shpat_xxxxxxxxxxxxxxxxxxxxx`)

---

## 📋 Step 2: Get Your Collection or Product ID

### For a Collection:

1. Go to **Admin → Products → Collections**
2. Click on the collection you want to embed
3. Look at the URL: `https://admin.shopify.com/store/YOUR-STORE/collections/123456789`
4. The number at the end is your **Collection ID**
5. Convert it to GID format: `gid://shopify/Collection/123456789`

### For a Single Product:

1. Go to **Admin → Products → All products**
2. Click on the product you want to embed
3. Look at the URL: `https://admin.shopify.com/store/YOUR-STORE/products/987654321`
4. The number at the end is your **Product ID**
5. Convert it to GID format: `gid://shopify/Product/987654321`

---

## 📋 Step 3: Add Section to Your Theme

### Option A: Add to Homepage

1. Go to **Online Store → Themes → Customize**
2. On the homepage, click **"Add section"**
3. Find and select **"Shopify Buy Button"**
4. Configure the settings (see below)

### Option B: Add to Any Page

1. Edit the page in the Shopify admin
2. If using the page editor, add a custom liquid block
3. Or add the section through the theme customizer

---

## ⚙️ Step 4: Configure the Section

In the theme customizer, configure these settings:

### **API Configuration:**
- **Shopify Domain**: `newthrifts.myshopify.com` (or your actual domain)
- **Storefront Access Token**: Paste the token from Step 1

### **Embed Settings:**
- **Embed Type**: Choose "Collection" or "Single Product"
- **Collection ID** (if collection): `gid://shopify/Collection/YOUR_ID`
- **Product ID** (if product): `gid://shopify/Product/YOUR_ID`

### **Display Settings:**
- **Button Text**: "Add to cart" (or customize)
- **Button Background Color**: Match your theme
- **Button Text Color**: Usually white (#ffffff)
- **Price Color**: Match your theme

### **Layout Settings:**
- **Product Card Border Radius**: 16px (default, adjust to taste)
- **Minimum Column Width**: 220px (responsive grid)
- **Grid Gap**: 16px (space between products)
- **Show Cart Popup**: false (shows sidebar cart)

---

## 🎨 Customization Examples

### Modern Card Style:
```
Border Radius: 16px
Grid Gap: 20px
Min Column Width: 240px
Button Color: #000000
```

### Minimalist Style:
```
Border Radius: 8px
Grid Gap: 12px
Min Column Width: 200px
Button Color: #333333
```

### Bold & Colorful:
```
Border Radius: 24px
Grid Gap: 24px
Min Column Width: 260px
Button Color: #3b82f6 (blue)
```

---

## ✅ Benefits of This Approach

1. **No CSP Errors** - Uses Shopify's official SDK, no iframe violations
2. **Better Performance** - Native integration, faster loading
3. **Fully Customizable** - Control colors, layout, and styling
4. **Responsive** - Automatically adapts to mobile/tablet/desktop
5. **Dark Mode Support** - Built-in dark mode compatibility
6. **SEO Friendly** - Better than iframes for search engines
7. **Cart Integration** - Uses your existing Shopify cart

---

## 🔧 Troubleshooting

### "Please configure your Storefront Access Token"
- Check that you've added the token in theme settings
- Make sure it starts with `shpat_`
- Verify the app is installed and not deleted

### Products Not Showing
- Verify the Collection/Product ID is correct
- Make sure the collection/product is published
- Check that the Storefront API scopes are enabled
- Ensure products are available for online store sales channel

### Styling Issues
- Adjust the border radius and grid gap settings
- Check color contrast between button background and text
- Test in dark mode using the theme toggle

### Cart Not Working
- Verify `unauthenticated_write_checkouts` scope is enabled
- Check that products have inventory available
- Ensure checkout isn't disabled in your store settings

---

## 📚 Additional Resources

- [Shopify Buy Button SDK Documentation](https://shopify.github.io/buy-button-js/)
- [Storefront API Documentation](https://shopify.dev/docs/api/storefront)
- [Custom App Development Guide](https://help.shopify.com/en/manual/apps/app-types/custom-apps)

---

## 🚀 Next Steps

After configuration:
1. ✅ Save your theme changes
2. ✅ Test on desktop and mobile
3. ✅ Verify cart and checkout work properly
4. ✅ Check browser console - CSP errors should be gone!
5. ✅ Customize colors and layout to match your brand

---

## 💡 Pro Tips

- **Use Collections**: Easier to manage than individual products
- **Create Multiple Sections**: Different collections on different pages
- **Match Your Theme**: Use the same colors as your existing design
- **Test Checkout**: Always test the full purchase flow
- **Update Regularly**: Keep your products and collections current

---

Need help? The configuration is all done through the Shopify theme customizer - no coding required!

