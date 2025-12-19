# Trade Tracker - Mobile App Setup Script
# This script sets up Android and iOS apps for phones and tablets

Write-Host "🚀 Trade Tracker Mobile App Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please reinstall Node.js" -ForegroundColor Red
    exit 1
}

# Install Capacitor dependencies
Write-Host ""
Write-Host "📦 Installing Capacitor dependencies..." -ForegroundColor Yellow
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios --save

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install Capacitor dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Capacitor dependencies installed" -ForegroundColor Green

# Initialize Capacitor (if not already done)
Write-Host ""
Write-Host "🔧 Initializing Capacitor..." -ForegroundColor Yellow
if (Test-Path "capacitor.config.json") {
    Write-Host "✅ Capacitor already initialized" -ForegroundColor Green
} else {
    npx cap init "Trade Tracker" "com.tradetracker.app" --web-dir=www
}

# Ensure www directory has all files
Write-Host ""
Write-Host "📁 Copying files to www directory..." -ForegroundColor Yellow
Copy-Item -Path "index.html", "app.js", "style.css" -Destination "www\" -Force
Write-Host "✅ Files copied" -ForegroundColor Green

# Add Android platform
Write-Host ""
Write-Host "🤖 Adding Android platform..." -ForegroundColor Yellow
npx cap add android

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Android platform added" -ForegroundColor Green
} else {
    Write-Host "⚠️  Android platform may already exist or failed to add" -ForegroundColor Yellow
}

# Add iOS platform (macOS only, but we'll try anyway)
Write-Host ""
Write-Host "🍎 Adding iOS platform..." -ForegroundColor Yellow
npx cap add ios

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ iOS platform added" -ForegroundColor Green
} else {
    Write-Host "⚠️  iOS platform requires macOS with Xcode" -ForegroundColor Yellow
}

# Sync files to platforms
Write-Host ""
Write-Host "🔄 Syncing files to platforms..." -ForegroundColor Yellow
npx cap sync

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Mobile App Setup Complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "For Android:" -ForegroundColor Yellow
Write-Host "  1. Install Android Studio from https://developer.android.com/studio" -ForegroundColor White
Write-Host "  2. Run: npx cap open android" -ForegroundColor White
Write-Host "  3. In Android Studio, click 'Run' to test on emulator or device" -ForegroundColor White
Write-Host ""
Write-Host "For iOS (macOS only):" -ForegroundColor Yellow
Write-Host "  1. Install Xcode from Mac App Store" -ForegroundColor White
Write-Host "  2. Run: npx cap open ios" -ForegroundColor White
Write-Host "  3. In Xcode, select device and click 'Run'" -ForegroundColor White
Write-Host ""
Write-Host "Tablet Support:" -ForegroundColor Yellow
Write-Host "  ✅ Android tablets: Automatically supported" -ForegroundColor Green
Write-Host "  ✅ iPad: Automatically supported" -ForegroundColor Green
Write-Host ""
