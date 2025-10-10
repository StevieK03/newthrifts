# Manual Shopify Theme Update Guide

This guide explains how to manually update your theme files in Shopify Admin without using CLI tools.

---

## 📋 Table of Contents

1. [Method 1: Upload Individual Files (Recommended for Small Updates)](#method-1-upload-individual-files)
2. [Method 2: Upload Entire Theme as ZIP](#method-2-upload-entire-theme-as-zip)
3. [Method 3: Use Theme Code Editor](#method-3-use-theme-code-editor)
4. [What Files Were Changed](#what-files-were-changed)

---

## Method 1: Upload Individual Files (Recommended for Small Updates)

### **For Recently Updated Files**

#### **Step 1: Access Theme Editor**
1. Go to **Shopify Admin** → **Online Store** → **Themes**
2. Find your current theme (usually "Current theme")
3. Click **"... Actions"** → **"Edit code"**

#### **Step 2: Upload New Customer Templates**
These are the NEW files that were just added:

**Navigate to** `templates/customers/` **folder in the left sidebar**

Upload these 7 files one by one:

1. **`login.json`**
   - Click **"Add a new template"** → Select **"customers"** → **"login"**
   - Copy content from: `newthrifts2/templates/customers/login.json`
   - Paste into editor → **Save**

2. **`register.json`**
   - Click **"Add a new template"** → Select **"customers"** → **"register"**
   - Copy content from: `newthrifts2/templates/customers/register.json`
   - Paste into editor → **Save**

3. **`account.json`**
   - Click **"Add a new template"** → Select **"customers"** → **"account"**
   - Copy content from: `newthrifts2/templates/customers/account.json`
   - Paste into editor → **Save**

4. **`order.json`**
   - Click **"Add a new template"** → Select **"customers"** → **"order"**
   - Copy content from: `newthrifts2/templates/customers/order.json`
   - Paste into editor → **Save**

5. **`addresses.json`**
   - Click **"Add a new template"** → Select **"customers"** → **"addresses"**
   - Copy content from: `newthrifts2/templates/customers/addresses.json`
   - Paste into editor → **Save**

6. **`reset_password.json`**
   - Click **"Add a new template"** → Select **"customers"** → **"reset_password"**
   - Copy content from: `newthrifts2/templates/customers/reset_password.json`
   - Paste into editor → **Save**

7. **`activate_account.json`**
   - Click **"Add a new template"** → Select **"customers"** → **"activate_account"**
   - Copy content from: `newthrifts2/templates/customers/activate_account.json`
   - Paste into editor → **Save**

#### **Step 3: Upload New Section**

**Navigate to** `Sections` **folder**

1. Click **"Add a new section"**
2. Name it: **"shopify-buy-button"**
3. Copy entire content from: `newthrifts2/sections/shopify-buy-button.liquid`
4. Paste into editor → **Save**

#### **Step 4: Update Modified Files**

**These files were modified:**

1. **`sections/header.liquid`**
   - Click on it in left sidebar
   - Copy content from: `newthrifts2/sections/header.liquid`
   - Replace all content → **Save**

2. **`sections/welcome-social-bar.liquid`**
   - Click on it in left sidebar
   - Copy content from: `newthrifts2/sections/welcome-social-bar.liquid`
   - Replace all content → **Save**

3. **`layout/theme.liquid`**
   - Click on it in left sidebar
   - Copy content from: `newthrifts2/layout/theme.liquid`
   - Replace all content → **Save**

---

## Method 2: Upload Entire Theme as ZIP

### **When to Use This Method**
- Making lots of changes at once
- Want to test on a development theme first
- Need a clean deployment

### **Step 1: Package Your Theme**

**Windows PowerShell:**

```powershell
cd c:\workspace2\newthrifts2

# Create a ZIP file with only theme directories
Compress-Archive -Path assets,config,layout,locales,sections,snippets,templates -DestinationPath newthrifts-theme-updated.zip -Force
```

**Alternative (if Compress-Archive doesn't work):**

1. Navigate to `c:\workspace2\newthrifts2\`
2. Select these folders:
   - `assets`
   - `config`
   - `layout`
   - `locales`
   - `sections`
   - `snippets`
   - `templates`
3. Right-click → **Send to** → **Compressed (zipped) folder**
4. Name it: `newthrifts-theme-updated.zip`

### **Step 2: Upload to Shopify**

#### **Option A: Upload as New Theme (Safest)**

1. Go to **Shopify Admin** → **Online Store** → **Themes**
2. Scroll down to **"Theme library"**
3. Click **"Add theme"** → **"Upload ZIP file"**
4. Select your `newthrifts-theme-updated.zip`
5. Wait for upload to complete
6. Click **"Customize"** to preview
7. When ready, click **"... Actions"** → **"Publish"**

#### **Option B: Replace Current Theme (Use with Caution)**

⚠️ **Warning**: This will overwrite your current theme. Backup first!

1. Go to **Shopify Admin** → **Online Store** → **Themes**
2. On your current theme, click **"... Actions"** → **"Duplicate"** (BACKUP!)
3. On the duplicate, click **"... Actions"** → **"Download theme file"** (EXTRA BACKUP!)
4. Now upload the new version as described in Option A
5. Test thoroughly before publishing

---

## Method 3: Use Theme Code Editor (For Quick Edits)

### **Best For:**
- Small text changes
- CSS/JS tweaks
- Testing quick fixes

### **Steps:**

1. **Shopify Admin** → **Online Store** → **Themes**
2. Click **"... Actions"** → **"Edit code"**
3. Find the file in left sidebar
4. Make your changes
5. Click **"Save"** (changes are live immediately if editing published theme!)

⚠️ **Important**: Changes in code editor are INSTANT on published themes. Test on a duplicate first!

---

## What Files Were Changed

### **Recent Updates (Last 3 Commits)**

#### **Commit 1: Buy Button SDK Section**
```
✅ NEW FILE: sections/shopify-buy-button.liquid
✅ NEW FILE: SHOPIFY_BUY_BUTTON_SETUP.md
```
**What it does**: Fixes CSP frame-ancestors errors by using Shopify's official Buy Button SDK

#### **Commit 2: Logo Relocation**
```
✅ MODIFIED: sections/header.liquid
✅ MODIFIED: sections/welcome-social-bar.liquid
```
**What it does**: Moved NewThrifts logo from header to above Welcome/Social bar

#### **Commit 3: Customer Templates**
```
✅ NEW FILE: templates/customers/login.json
✅ NEW FILE: templates/customers/register.json
✅ NEW FILE: templates/customers/account.json
✅ NEW FILE: templates/customers/order.json
✅ NEW FILE: templates/customers/addresses.json
✅ NEW FILE: templates/customers/reset_password.json
✅ NEW FILE: templates/customers/activate_account.json
```
**What it does**: Added missing customer account page templates for Shopify standards compliance

---

## 📝 Checklist: Files to Upload

Use this checklist to track your manual uploads:

### **New Files (Must Create):**
- [ ] `sections/shopify-buy-button.liquid`
- [ ] `templates/customers/login.json`
- [ ] `templates/customers/register.json`
- [ ] `templates/customers/account.json`
- [ ] `templates/customers/order.json`
- [ ] `templates/customers/addresses.json`
- [ ] `templates/customers/reset_password.json`
- [ ] `templates/customers/activate_account.json`

### **Modified Files (Must Update):**
- [ ] `sections/header.liquid`
- [ ] `sections/welcome-social-bar.liquid`
- [ ] `layout/theme.liquid`

---

## 🔍 Verification Steps

After uploading, verify everything works:

### **1. Check Logo Position**
1. Visit your storefront
2. Verify logo appears above the Welcome/Social bar
3. Test on mobile and desktop

### **2. Check Customer Pages**
1. Try logging in at: `yourdomain.com/account/login`
2. Try registering at: `yourdomain.com/account/register`
3. Check account page: `yourdomain.com/account`

### **3. Check Buy Button Section (If You Add It)**
1. In theme customizer, try adding **"Shopify Buy Button"** section
2. Configure it with your Storefront API token
3. Verify products display without CSP errors

### **4. Check Browser Console**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Verify no new errors appear

---

## 💡 Pro Tips

### **Always Test First**
- Upload to a duplicate/unpublished theme first
- Test thoroughly before publishing
- Keep a backup of your working theme

### **Use Theme Versions**
- Shopify automatically saves theme versions
- Access via **"... Actions"** → **"View theme history"**
- You can restore previous versions if needed

### **Clear Cache**
After uploading:
- Clear browser cache (Ctrl+F5)
- Test in incognito/private window
- Check on mobile device

### **Development Store**
- Use a development store for testing
- Free to create at partners.shopify.com
- Test major changes before deploying to live store

---

## 🚨 Troubleshooting

### **Files Not Showing Up**
- Refresh the code editor page
- Check file naming (must match exactly)
- Verify file is in correct folder

### **Syntax Errors**
- Check for missing brackets or quotes
- Use a JSON validator for .json files
- Compare with original file

### **Theme Won't Save**
- Check for liquid syntax errors
- Ensure all {% tags %} are closed
- Verify JSON is valid

### **Changes Not Visible**
- Clear browser cache
- Disable browser extensions
- Check if editing the published theme
- Wait a few minutes for CDN to update

---

## 📚 Additional Resources

- [Shopify Theme Code Editor](https://help.shopify.com/en/manual/online-store/themes/theme-structure/extend/edit-theme-code)
- [Upload Theme ZIP](https://help.shopify.com/en/manual/online-store/themes/adding-themes#upload-a-theme-file-from-your-computer)
- [Theme Versions](https://help.shopify.com/en/manual/online-store/themes/managing-themes/version-history)
- [Development Stores](https://help.shopify.com/en/partners/dashboard/managing-stores/development-stores)

---

## ⚡ Quick Reference Commands

### **Create Theme ZIP (PowerShell):**
```powershell
cd c:\workspace2\newthrifts2
Compress-Archive -Path assets,config,layout,locales,sections,snippets,templates -DestinationPath newthrifts-theme-updated.zip -Force
```

### **View Recent Changes (Git):**
```bash
cd c:\workspace2\newthrifts2
git log --oneline -5
git diff HEAD~3 HEAD --name-only
```

### **List Modified Files:**
```bash
git diff --name-only HEAD~3 HEAD
```

---

**Need Help?**
- Check Shopify's theme documentation
- Review error messages in code editor
- Test in a development/duplicate theme first
- Keep backups of working versions

---

**Last Updated**: October 10, 2025  
**Theme Version**: Current (includes customer templates, Buy Button SDK, logo relocation)

