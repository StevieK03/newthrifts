# Deploy Instructions

## Files to Upload to Shopify

You need to upload these 2 files:

1. **`assets/dark-mode.css`** - Fixes dark mode shadow
2. **`sections/custom-tshirt-studio.liquid`** - Fixes canvas visibility + Add Text feature

---

## Quick Manual Deploy (5 minutes)

### Step 1: Go to Shopify Theme Editor
1. Open: https://admin.shopify.com/store/maxstar03/themes
2. Click the **"..."** (three dots) next to your theme
3. Click **"Edit code"**

### Step 2: Upload dark-mode.css
1. In the left sidebar, click **Assets**
2. Find and click **dark-mode.css**
3. Open your local file: `C:\workspace2\newthrifts2\assets\dark-mode.css`
4. Copy all contents (Ctrl+A, Ctrl+C)
5. Back in Shopify, select all (Ctrl+A) and paste (Ctrl+V)
6. Click **Save**

### Step 3: Upload custom-tshirt-studio.liquid
1. In the left sidebar, click **Sections**
2. Find and click **custom-tshirt-studio.liquid**
3. Open your local file: `C:\workspace2\newthrifts2\sections\custom-tshirt-studio.liquid`
4. Copy all contents (Ctrl+A, Ctrl+C)
5. Back in Shopify, select all (Ctrl+A) and paste (Ctrl+V)
6. Click **Save**

### Step 4: Test
1. Go to your store page
2. Hard refresh: **Ctrl + Shift + R**
3. Everything should work perfectly! 🎉

---

## What Gets Fixed:

✅ **Dark mode shadow** - No more excessive glow on headings  
✅ **Canvas visibility** - T-shirt shows immediately in light mode  
✅ **Add Text button** - Full text engine functionality restored  
✅ **Black t-shirt** - Uses correct `tshirt-black-v2.png` file  
✅ **Overlay positioning** - "Your Design Here" in correct spot  

---

## Future Deploys

To deploy future changes, repeat the same process:
1. Edit code in Shopify
2. Copy/paste from your local files
3. Save

Or fix the Shopify CLI authentication by running:
```bash
shopify auth logout
shopify auth login
```



