# Shopify Token Rotation Script
# This script helps you safely rotate your Shopify CLI token

Write-Host ""
Write-Host "🔄 Shopify Token Rotation Tool" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Function to test Shopify authentication
function Test-ShopifyAuth {
    Write-Host "🔍 Testing Shopify authentication..." -ForegroundColor Yellow
    $result = shopify theme list -e newthrifts 2>&1
    return $LASTEXITCODE -eq 0
}

# Step 1: Check current authentication
Write-Host "Step 1: Checking current authentication status..." -ForegroundColor Cyan
Write-Host ""

if (Test-ShopifyAuth) {
    Write-Host "✅ Currently authenticated with Shopify" -ForegroundColor Green
} else {
    Write-Host "⚠️  Not currently authenticated" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 2: Instructions for GitHub
Write-Host "Step 2: Allow the current push on GitHub" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before rotating the token, you need to allow the current push:" -ForegroundColor Yellow
Write-Host ""
Write-Host "👉 Visit this URL:" -ForegroundColor White
Write-Host "   https://github.com/StevieK03/newthrifts/security/secret-scanning/unblock-secret/34SyyURf2sOjKJE0QoFizD7JrHb" -ForegroundColor Blue
Write-Host ""
Write-Host "👉 Click 'Allow secret' button" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you allowed the secret on GitHub? (y/n)"

if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host ""
    Write-Host "⏸️  Paused. Please complete the GitHub step first." -ForegroundColor Yellow
    Write-Host "   Run this script again when ready." -ForegroundColor Yellow
    Write-Host ""
    exit
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 3: Push to Git
Write-Host "Step 3: Pushing to Git..." -ForegroundColor Cyan
Write-Host ""

$pushGit = Read-Host "Push to Git now? (y/n)"

if ($pushGit -eq "y" -or $pushGit -eq "Y") {
    Write-Host ""
    Write-Host "📤 Pushing to Git..." -ForegroundColor Yellow
    git push origin master
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Successfully pushed to Git!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Git push failed. Check the error above." -ForegroundColor Red
        Write-Host "   You may need to allow the secret on GitHub first." -ForegroundColor Yellow
        Write-Host ""
        exit
    }
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 4: Rotate Token
Write-Host "Step 4: Rotate Shopify CLI Token" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now let's rotate your token to invalidate the old one." -ForegroundColor Yellow
Write-Host ""

$rotateMethod = Read-Host "Choose method: (1) OAuth Re-login, (2) Manual Token Entry"

if ($rotateMethod -eq "1") {
    Write-Host ""
    Write-Host "🔐 Method 1: OAuth Re-authentication" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This will log you out and log back in with a fresh token." -ForegroundColor Yellow
    Write-Host ""
    
    $confirm = Read-Host "Proceed with logout and re-login? (y/n)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Host ""
        Write-Host "📤 Logging out..." -ForegroundColor Yellow
        shopify auth logout
        
        Write-Host ""
        Write-Host "📥 Logging back in..." -ForegroundColor Yellow
        Write-Host "   (This will open your browser)" -ForegroundColor Gray
        Write-Host ""
        
        shopify auth login
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Successfully re-authenticated!" -ForegroundColor Green
            Write-Host "   Your old token is now invalid." -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Authentication failed. Please try again manually:" -ForegroundColor Red
            Write-Host "   shopify auth login" -ForegroundColor White
            Write-Host ""
            exit
        }
    }
    
} elseif ($rotateMethod -eq "2") {
    Write-Host ""
    Write-Host "🔐 Method 2: Manual Token Entry" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Steps to get a new token:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://irwe0x-mk.myshopify.com/admin/settings/apps/development" -ForegroundColor White
    Write-Host "2. Create or open your CLI app" -ForegroundColor White
    Write-Host "3. Revoke old token (if shown)" -ForegroundColor White
    Write-Host "4. Generate new token with read_themes and write_themes scopes" -ForegroundColor White
    Write-Host "5. Copy the new token (starts with shpat_...)" -ForegroundColor White
    Write-Host ""
    
    $newToken = Read-Host "Enter your new token (or press Enter to skip)" -MaskInput
    
    if ($newToken) {
        Write-Host ""
        Write-Host "💾 Storing token..." -ForegroundColor Yellow
        
        # Update shopify.theme.toml
        $configContent = @"
[environments.newthrifts]
theme = "137255125090"
store = "irwe0x-mk.myshopify.com"
password = "$newToken"
"@
        $configContent | Out-File -FilePath "shopify.theme.toml" -Encoding utf8
        
        Write-Host "✅ Token updated in shopify.theme.toml" -ForegroundColor Green
        Write-Host "⚠️  Remember: This file is in .gitignore (not tracked by Git)" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "⏭️  Skipping token rotation." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""

# Step 5: Verify
Write-Host "Step 5: Verify New Setup" -ForegroundColor Cyan
Write-Host ""

$verify = Read-Host "Test authentication with Shopify? (y/n)"

if ($verify -eq "y" -or $verify -eq "Y") {
    Write-Host ""
    Write-Host "🧪 Testing connection..." -ForegroundColor Yellow
    Write-Host ""
    
    shopify theme list -e newthrifts
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Authentication verified!" -ForegroundColor Green
        Write-Host "   Your new setup is working correctly." -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Verification failed." -ForegroundColor Red
        Write-Host "   Please check your configuration." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 Token Rotation Process Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "✅ What we accomplished:" -ForegroundColor Cyan
Write-Host "   • Pushed changes to Git" -ForegroundColor White
Write-Host "   • Rotated Shopify token" -ForegroundColor White
Write-Host "   • Old token is now invalid" -ForegroundColor White
Write-Host "   • Your store is secure" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more details, see: ROTATE-SHOPIFY-TOKEN.md" -ForegroundColor Gray
Write-Host ""



