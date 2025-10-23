# Shopify CLI Authentication Setup Script
# This script helps you authenticate with Shopify CLI securely

Write-Host "🔐 Shopify CLI Authentication Setup" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Method Selection
Write-Host "Choose your authentication method:" -ForegroundColor Yellow
Write-Host "1. OAuth Login (Recommended - Most Secure)" -ForegroundColor Green
Write-Host "2. Environment Variable" -ForegroundColor Yellow
Write-Host "3. Check Current Authentication Status" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Enter your choice (1, 2, or 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Starting OAuth Authentication..." -ForegroundColor Green
        Write-Host "This will open your browser. Please log in to your Shopify account." -ForegroundColor Yellow
        Write-Host ""
        
        # Run Shopify auth login
        shopify auth login
        
        Write-Host ""
        Write-Host "✅ Authentication complete!" -ForegroundColor Green
        Write-Host "You can now use Shopify CLI commands without passwords in your config." -ForegroundColor Green
        Write-Host ""
        Write-Host "Test your connection:" -ForegroundColor Cyan
        Write-Host "  shopify theme list -e newthrifts" -ForegroundColor White
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔑 Setting up Environment Variable..." -ForegroundColor Yellow
        Write-Host ""
        
        $token = Read-Host "Enter your Shopify CLI Theme Token (shpat_...)" -MaskInput
        
        if ($token) {
            # Set environment variable for current user
            [System.Environment]::SetEnvironmentVariable('SHOPIFY_CLI_THEME_TOKEN', $token, 'User')
            
            # Set for current session
            $env:SHOPIFY_CLI_THEME_TOKEN = $token
            
            Write-Host ""
            Write-Host "✅ Environment variable set successfully!" -ForegroundColor Green
            Write-Host "The token is stored securely in your user environment variables." -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  Note: You may need to restart your terminal for system-wide effect." -ForegroundColor Yellow
        } else {
            Write-Host "❌ No token provided. Setup cancelled." -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "🔍 Checking Authentication Status..." -ForegroundColor Cyan
        Write-Host ""
        
        # Try to list themes to verify authentication
        shopify whoami
        
        Write-Host ""
        Write-Host "Testing theme access..." -ForegroundColor Cyan
        shopify theme list -e newthrifts
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📚 For more information, see: SHOPIFY-AUTH-GUIDE.md" -ForegroundColor Cyan
Write-Host ""

