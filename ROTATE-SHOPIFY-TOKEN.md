# 🔄 How to Rotate Your Shopify CLI Token

## Why Rotate Your Token?

Since your old token was committed to Git history and detected by GitHub, it's best practice to:
1. Allow the current push to go through (it's already exposed)
2. Immediately rotate (regenerate) the token
3. Update your local files with the new token
4. The old token becomes invalid, protecting your store

---

## 📋 Step-by-Step Guide

### Step 1: Allow Current Push on GitHub

1. **Visit this URL**:
   ```
   https://github.com/StevieK03/newthrifts/security/secret-scanning/unblock-secret/34SyyURf2sOjKJE0QoFizD7JrHb
   ```

2. **Click "Allow secret"** button
   - GitHub will let this push go through
   - This is a one-time approval

3. **Return to terminal and push**:
   ```powershell
   git push origin master
   ```

---

### Step 2: Regenerate Token in Shopify

**Method A: Via Shopify CLI (Easiest)**

```powershell
# Log out current session
shopify auth logout

# Log in again - this generates a new token automatically
shopify auth login
```

This will:
- Open your browser
- Prompt you to authorize
- Generate a fresh token
- Store it securely (no file needed!)

---

**Method B: Manual Token Regeneration (For Advanced Users)**

#### Option 1: From Your Store Admin

1. **Go to your Shopify Admin**:
   ```
   https://irwe0x-mk.myshopify.com/admin
   ```

2. **Navigate to**:
   ```
   Settings → Apps and sales channels → Develop apps
   ```

3. **Find or Create Custom App**:
   - If you have an existing CLI app, click on it
   - Or click **"Create an app"** → Name it "Shopify CLI" or similar

4. **Configure API Scopes**:
   - Click **"Configuration"** tab
   - Under "Admin API access scopes", select:
     - ✅ `read_themes`
     - ✅ `write_themes`
   - Click **"Save"**

5. **Generate New Access Token**:
   - Click **"API credentials"** tab
   - Under "Admin API access token"
   - Click **"Install app"** (if not installed)
   - Click **"Reveal token once"**
   - **COPY THE TOKEN** (you'll only see it once!)
   - Format will be: `shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

#### Option 2: From Shopify Partners Dashboard

1. **Go to Shopify Partners**:
   ```
   https://partners.shopify.com/
   ```

2. **Navigate to**:
   ```
   Apps → [Your Dev Store] → Extensions → Theme CLI
   ```

3. **Revoke Old Token**:
   - Find your current token/connection
   - Click **"Revoke"** or **"Delete"**

4. **Create New Token**:
   - Click **"Create new connection"** or similar
   - Follow prompts to generate new token
   - **COPY THE TOKEN**

---

### Step 3: Update Local Configuration

**Option A: Continue Using OAuth (Recommended)**

Since you're already authenticated via OAuth, you don't need to do anything!
The `shopify auth login` command automatically handles token rotation.

Your `shopify.theme.toml` stays clean:
```toml
[environments.newthrifts]
theme = "137255125090"
store = "irwe0x-mk.myshopify.com"
# Password managed via Shopify CLI authentication
```

---

**Option B: If Using Environment Variable**

```powershell
# PowerShell - Set new token
$env:SHOPIFY_CLI_THEME_TOKEN = "shpat_NEW_TOKEN_HERE"

# Set permanently
[System.Environment]::SetEnvironmentVariable('SHOPIFY_CLI_THEME_TOKEN', 'shpat_NEW_TOKEN_HERE', 'User')
```

---

**Option C: If Using Config File (Not Recommended)**

Only if you must store in file:

1. **Edit `shopify.theme.toml`**:
```toml
[environments.newthrifts]
theme = "137255125090"
store = "irwe0x-mk.myshopify.com"
password = "shpat_NEW_TOKEN_HERE"  # Replace with your new token
```

2. **Ensure it's in .gitignore**:
```bash
# Verify it's ignored
git check-ignore shopify.theme.toml
# Should output: shopify.theme.toml

# If not, add it:
echo "shopify.theme.toml" >> .gitignore
```

---

### Step 4: Verify New Token Works

Test your new authentication:

```powershell
# Test theme access
shopify theme list -e newthrifts

# Should show your themes list successfully
```

If successful, you'll see output like:
```
✓ Logged in.
╭─ info ─────────────────────────────────────╮
│  irwe0x-mk.myshopify.com theme library     │
│  name                    role      id       │
│  newthrifts/master      [live]    #137...  │
╰────────────────────────────────────────────╯
```

---

### Step 5: Test Theme Push

Verify you can still push changes:

```powershell
# Make a small test change or just push current state
shopify theme push -e newthrifts --allow-live --only templates/index.json
```

---

## 🔒 Security Best Practices Going Forward

### ✅ DO:
- ✅ Use OAuth authentication (`shopify auth login`)
- ✅ Keep `shopify.theme.toml` in `.gitignore`
- ✅ Use environment variables if you need tokens
- ✅ Rotate tokens every 3-6 months
- ✅ Use different tokens for different environments

### ❌ DON'T:
- ❌ Commit tokens to Git
- ❌ Share tokens in chat/email
- ❌ Use same token across multiple projects
- ❌ Store tokens in plain text files tracked by Git

---

## 🆘 Troubleshooting

### "Authentication failed" after rotation
```powershell
shopify auth logout
shopify auth login
```

### "Invalid credentials"
- Double-check you copied the entire token
- Ensure no extra spaces
- Verify token is for correct store

### "Permission denied"
- Ensure your custom app has correct scopes:
  - `read_themes`
  - `write_themes`

### Still can't push
```powershell
# Clear all auth and start fresh
shopify auth logout
rm -rf ~/.config/shopify  # or del /f /s /q %USERPROFILE%\.config\shopify on Windows
shopify auth login
```

---

## 📝 Quick Reference Commands

```powershell
# Log out and re-authenticate (rotates token automatically)
shopify auth logout && shopify auth login

# Verify authentication
shopify theme list -e newthrifts

# Push to theme
shopify theme push -e newthrifts

# Check version
shopify version

# Get help
shopify theme push --help
```

---

## ✅ Checklist

- [ ] Allow secret on GitHub URL
- [ ] Push to Git successfully
- [ ] Log out of Shopify CLI (`shopify auth logout`)
- [ ] Log back in (`shopify auth login`)
- [ ] Verify with `shopify theme list`
- [ ] Test push with `shopify theme push`
- [ ] Old token is now invalid ✓
- [ ] New secure setup complete ✓

---

## 🎯 Result

After completing these steps:
- ✅ Your Git history is pushed
- ✅ Old token is invalidated
- ✅ New token is secure
- ✅ OAuth authentication is active
- ✅ No passwords in Git
- ✅ Future commits are secure

**Time to complete**: 5-10 minutes
**Security level**: ⭐⭐⭐⭐⭐ (Excellent)

