# Manual Upload Guide - Get Changes Live NOW

## 🎯 Quick Start

### Step 1: Access Theme Editor
1. Go to: https://admin.shopify.com/store/maxstar03/themes
2. Find your **Current theme** (live theme)
3. Click **Actions** → **Edit code**

### Step 2: Upload Changed Files

Upload these files in this order:

#### File 1: sections/header.liquid ⭐ MOST IMPORTANT
**Location in Shopify:** Sections → header.liquid
**What it fixes:**
- Logo position (no left margin - back to original)
- Mobile header size reduction
- Smaller buttons on mobile
- Dark mode button centering
- White outlines on buttons

**To upload:**
1. Click "Sections" folder
2. Click "header.liquid"
3. Select ALL text (Ctrl+A)
4. Copy content from: `c:\workspace2\newthrifts2\sections\header.liquid`
5. Paste and replace everything
6. Click "Save"

#### File 2: layout/theme.liquid
**Location in Shopify:** Layout → theme.liquid
**What it fixes:**
- Footer button styling (neutral white glassmorphism)
- Global CSS fixes for horizontal scrolling
- White vertical line fix

**To upload:**
1. Click "Layout" folder
2. Click "theme.liquid"
3. Select ALL text (Ctrl+A)
4. Copy content from: `c:\workspace2\newthrifts2\layout\theme.liquid`
5. Paste and replace everything
6. Click "Save"

#### File 3: templates/page.profile.liquid (OPTIONAL)
**Location in Shopify:** Templates → page.profile.liquid
**What it fixes:**
- Profile page styling in dark mode

**To upload:**
1. Click "Templates" folder
2. Click "page.profile.liquid"
3. Select ALL text (Ctrl+A)
4. Copy content from: `c:\workspace2\newthrifts2\templates\page.profile.liquid`
5. Paste and replace everything
6. Click "Save"

#### File 4: sections/user-profile-signup.liquid (OPTIONAL)
**Location in Shopify:** Sections → user-profile-signup.liquid
**What it fixes:**
- Profile signup modal styling

#### File 5: sections/user-profile-dashboard.liquid (OPTIONAL)
**Location in Shopify:** Sections → user-profile-dashboard.liquid
**What it fixes:**
- Profile dashboard styling

### Step 3: Verify Changes
1. Visit: https://newthrifts.com
2. Press **Ctrl + Shift + Delete** (clear cache)
3. Press **Ctrl + Shift + R** (hard refresh)
4. Check if changes are visible

## 🔧 Priority Files

**If you only have time for ONE file:**
Upload **sections/header.liquid** - This has the logo position fix and mobile improvements.

**If you have time for TWO files:**
Upload **sections/header.liquid** AND **layout/theme.liquid** - This covers 90% of changes.

## 📱 Testing Checklist

After uploading, check:
- ✅ Logo position (should be at far left, no extra margin)
- ✅ Mobile header fits without scrolling
- ✅ Footer buttons have white outline style
- ✅ Dark mode button centered between Sign in and Cart
- ✅ No horizontal scrolling on mobile
- ✅ No white vertical line on homepage

## ⚡ If Manual Upload Doesn't Work

If you still don't see changes:
1. Clear browser cache completely
2. Try in incognito/private mode
3. Check you edited the LIVE theme (not a draft)
4. Make sure you clicked "Save" on each file

## 🚀 Future: Use CLI (Once Authenticated)

To avoid manual uploads in future:
1. Complete authentication: https://accounts.shopify.com/activate-with-code?device_code%5Buser_code%5D=PKRB-TFCC
2. Then run: `shopify theme push --store=maxstar03 --live`
3. All changes will sync automatically

---

Need help? The most important file is **sections/header.liquid** - start there!


