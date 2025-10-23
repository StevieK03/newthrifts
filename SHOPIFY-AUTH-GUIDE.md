# Shopify CLI Authentication Guide

## 🔐 Secure Authentication Methods (No Hardcoded Passwords)

### Method 1: OAuth Authentication (Recommended - Most Secure)

This is the most secure method and doesn't require storing any passwords.

```bash
# Authenticate with Shopify
shopify auth login

# This will:
# 1. Open your browser
# 2. Log you into your Shopify account
# 3. Store credentials securely in your system
# 4. No password needed in shopify.theme.toml!
```

**After running this, you can use all Shopify CLI commands:**
```bash
shopify theme push -e newthrifts
shopify theme pull -e newthrifts
shopify theme dev -e newthrifts
```

---

### Method 2: Environment Variables

Set environment variables instead of hardcoding in files.

#### Windows PowerShell:
```powershell
# Set for current session
$env:SHOPIFY_CLI_THEME_TOKEN = "shpat_your_token_here"

# Set permanently (User level)
[System.Environment]::SetEnvironmentVariable('SHOPIFY_CLI_THEME_TOKEN', 'shpat_your_token_here', 'User')

# Set permanently (System level - requires admin)
[System.Environment]::SetEnvironmentVariable('SHOPIFY_CLI_THEME_TOKEN', 'shpat_your_token_here', 'Machine')
```

#### Windows Command Prompt:
```cmd
# Set for current session
set SHOPIFY_CLI_THEME_TOKEN=shpat_your_token_here

# Set permanently
setx SHOPIFY_CLI_THEME_TOKEN "shpat_your_token_here"
```

#### Linux/Mac:
```bash
# Add to ~/.bashrc or ~/.zshrc
export SHOPIFY_CLI_THEME_TOKEN="shpat_your_token_here"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

Then modify your `shopify.theme.toml`:
```toml
[environments.newthrifts]
theme = "137255125090"
store = "irwe0x-mk.myshopify.com"
# Token will be read from SHOPIFY_CLI_THEME_TOKEN environment variable
```

---

### Method 3: .env File with dotenv (For Development)

1. **Create a `.env` file** (already in .gitignore):
```env
SHOPIFY_STORE=your-store.myshopify.com
SHOPIFY_THEME_ID=your_theme_id
SHOPIFY_CLI_THEME_TOKEN=shpat_your_token_here
```

2. **Load before Shopify commands:**
```powershell
# Windows PowerShell - Create a helper script
# File: shopify-cmd.ps1
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
    }
}
shopify theme push -e newthrifts
```

---

### Method 4: Partner Dashboard Access Token

1. Go to: https://partners.shopify.com/
2. Navigate to **Apps** > **Create App** > **Create custom app**
3. Generate a **Theme Access Token**
4. Use OAuth method above (shopify auth login)

---

## 🔄 Migration Steps (From Hardcoded to Secure)

### Step 1: Choose Your Method
We recommend **Method 1 (OAuth)** - it's the simplest and most secure.

### Step 2: Authenticate
```bash
shopify auth login
```

### Step 3: Test
```bash
shopify theme list -e newthrifts
```

### Step 4: Update shopify.theme.toml
Remove the password line:
```toml
[environments.newthrifts]
theme = "137255125090"
store = "irwe0x-mk.myshopify.com"
# Password managed via Shopify CLI authentication
```

### Step 5: Commit Safely
```bash
git add shopify.theme.toml
git commit -m "Remove hardcoded password, use Shopify CLI auth"
git push origin master
```

---

## 🛡️ Security Best Practices

1. ✅ **Never commit** `shopify.theme.toml` with passwords
2. ✅ **Always use** `.gitignore` for sensitive files
3. ✅ **Prefer OAuth** authentication over access tokens
4. ✅ **Rotate tokens** regularly if using access tokens
5. ✅ **Use environment-specific** configurations

---

## 📝 Current Setup Status

- [x] `shopify.theme.toml` cleaned (no password)
- [x] Added to `.gitignore`
- [x] Created `shopify.theme.toml.example` template
- [ ] **Next Step: Run `shopify auth login`**

---

## 🚀 Quick Start (Recommended Path)

```bash
# 1. Authenticate (one-time setup)
shopify auth login

# 2. Verify connection
shopify theme list -e newthrifts

# 3. Push changes
shopify theme push -e newthrifts

# 4. Commit and push to Git (now safe!)
git add .
git commit -m "Your commit message"
git push origin master
```

---

## 🔍 Troubleshooting

### "Authentication failed"
```bash
# Clear cached credentials
shopify logout
shopify auth login
```

### "Theme not found"
```bash
# List available themes
shopify theme list

# Update theme ID in shopify.theme.toml if needed
```

### "Store not found"
```bash
# Verify store URL in shopify.theme.toml
# Make sure it's: yourstore.myshopify.com (not custom domain)
```

---

## 📚 Additional Resources

- [Shopify CLI Documentation](https://shopify.dev/docs/themes/tools/cli)
- [Shopify Partners](https://partners.shopify.com/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

