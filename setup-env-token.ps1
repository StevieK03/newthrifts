# Quick Environment Variable Setup for Shopify CLI
# This sets your Shopify token as an environment variable

Write-Host ""
Write-Host "🔐 Shopify Environment Variable Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Read current token from file if exists
$currentToken = $null
if (Test-Path "shopify.theme.toml") {
    $content = Get-Content "shopify.theme.toml" -Raw
    if ($content -match 'password\s*=\s*"([^"]+)"') {
        $currentToken = $matches[1]
        Write-Host "✅ Found existing token in shopify.theme.toml" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Choose how to set the environment variable:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Use existing token from shopify.theme.toml (Quick)" -ForegroundColor White
Write-Host "2. Enter token manually" -ForegroundColor White
Write-Host "3. Skip - Use OAuth instead (Recommended)" -ForegroundColor Green
Write-Host ""

$choice = Read-Host "Enter your choice (1, 2, or 3)"

$tokenToUse = $null

switch ($choice) {
    "1" {
        if ($currentToken) {
            $tokenToUse = $currentToken
            Write-Host ""
            Write-Host "✅ Will use token from shopify.theme.toml" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ No token found in shopify.theme.toml" -ForegroundColor Red
            Write-Host "Please choose option 2 or 3" -ForegroundColor Yellow
            exit
        }
    }
    
    "2" {
        Write-Host ""
        $tokenToUse = Read-Host "Enter your Shopify token (shpat_...)" -MaskInput
        
        if (-not $tokenToUse) {
            Write-Host ""
            Write-Host "❌ No token provided. Setup cancelled." -ForegroundColor Red
            exit
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "🎉 Great choice! OAuth is the most secure method." -ForegroundColor Green
        Write-Host ""
        Write-Host "To use OAuth authentication:" -ForegroundColor Cyan
        Write-Host "  1. Remove password from shopify.theme.toml" -ForegroundColor White
        Write-Host "  2. Run: shopify auth login" -ForegroundColor White
        Write-Host "  3. Done! No environment variables needed." -ForegroundColor White
        Write-Host ""
        exit
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice." -ForegroundColor Red
        exit
    }
}

if ($tokenToUse) {
    Write-Host ""
    Write-Host "📝 Setting environment variable..." -ForegroundColor Yellow
    Write-Host ""
    
    # Set for current session
    $env:SHOPIFY_CLI_THEME_TOKEN = $tokenToUse
    Write-Host "✅ Set for current PowerShell session" -ForegroundColor Green
    
    # Set permanently for user
    [System.Environment]::SetEnvironmentVariable('SHOPIFY_CLI_THEME_TOKEN', $tokenToUse, 'User')
    Write-Host "✅ Set permanently for your user account" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎉 Environment variable configured!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Update shopify.theme.toml (remove password line):" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   [environments.newthrifts]" -ForegroundColor Gray
    Write-Host "   theme = `"137255125090`"" -ForegroundColor Gray
    Write-Host "   store = `"irwe0x-mk.myshopify.com`"" -ForegroundColor Gray
    Write-Host "   # Token is read from SHOPIFY_CLI_THEME_TOKEN env var" -ForegroundColor Green
    Write-Host ""
    
    $updateFile = Read-Host "Would you like me to update shopify.theme.toml now? (y/n)"
    
    if ($updateFile -eq "y" -or $updateFile -eq "Y") {
        $newContent = @"
[environments.newthrifts]
theme = "137255125090"
store = "irwe0x-mk.myshopify.com"
# Token is read from SHOPIFY_CLI_THEME_TOKEN environment variable
"@
        $newContent | Out-File -FilePath "shopify.theme.toml" -Encoding utf8 -NoNewline
        Write-Host ""
        Write-Host "✅ Updated shopify.theme.toml" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "2. Test the connection:" -ForegroundColor Yellow
    Write-Host ""
    
    $test = Read-Host "Would you like to test the connection now? (y/n)"
    
    if ($test -eq "y" -or $test -eq "Y") {
        Write-Host ""
        Write-Host "🧪 Testing Shopify CLI with environment variable..." -ForegroundColor Yellow
        Write-Host ""
        
        shopify theme list -e newthrifts
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ SUCCESS! Environment variable is working!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now safely commit shopify.theme.toml to Git." -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Connection failed. Please check your token." -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📚 Important Notes:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Token is stored in Windows User Environment Variables" -ForegroundColor White
    Write-Host "✅ Will persist across terminal sessions" -ForegroundColor White
    Write-Host "✅ Not tracked by Git" -ForegroundColor White
    Write-Host "⚠️  New terminal windows may need to be restarted" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To verify environment variable anytime:" -ForegroundColor Gray
    Write-Host "  `$env:SHOPIFY_CLI_THEME_TOKEN" -ForegroundColor Gray
    Write-Host ""
    Write-Host "To remove it later:" -ForegroundColor Gray
    Write-Host "  [System.Environment]::SetEnvironmentVariable('SHOPIFY_CLI_THEME_TOKEN', `$null, 'User')" -ForegroundColor Gray
    Write-Host ""
}

