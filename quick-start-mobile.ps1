# 📱 QUICK START - Build Phone & Tablet Apps

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Trade Tracker - Mobile Quick Start   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose your platform:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  [1] Android (Phone & Tablet)" -ForegroundColor White
Write-Host "  [2] iOS (iPhone & iPad) - macOS only" -ForegroundColor White
Write-Host "  [3] Both platforms" -ForegroundColor White
Write-Host "  [4] Just install dependencies" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

Write-Host ""

switch ($choice) {
    "1" {
        Write-Host "🤖 Setting up Android..." -ForegroundColor Green
        Write-Host ""
        
        # Install dependencies
        Write-Host "📦 Installing Capacitor..." -ForegroundColor Yellow
        npm install @capacitor/core @capacitor/cli @capacitor/android --save
        
        # Add Android platform
        Write-Host ""
        Write-Host "📱 Adding Android platform..." -ForegroundColor Yellow
        npx cap add android
        
        # Sync files
        Write-Host ""
        Write-Host "🔄 Syncing files..." -ForegroundColor Yellow
        npx cap sync android
        
        Write-Host ""
        Write-Host "✅ Android setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Install Android Studio: https://developer.android.com/studio" -ForegroundColor White
        Write-Host "  2. Run: npx cap open android" -ForegroundColor White
        Write-Host "  3. Click the green 'Run' button in Android Studio" -ForegroundColor White
        Write-Host ""
        Write-Host "✅ Works on Android phones AND tablets!" -ForegroundColor Green
    }
    
    "2" {
        Write-Host "🍎 Setting up iOS..." -ForegroundColor Green
        Write-Host ""
        
        if ($IsMacOS) {
            # Install dependencies
            Write-Host "📦 Installing Capacitor..." -ForegroundColor Yellow
            npm install @capacitor/core @capacitor/cli @capacitor/ios --save
            
            # Add iOS platform
            Write-Host ""
            Write-Host "📱 Adding iOS platform..." -ForegroundColor Yellow
            npx cap add ios
            
            # Sync files
            Write-Host ""
            Write-Host "🔄 Syncing files..." -ForegroundColor Yellow
            npx cap sync ios
            
            Write-Host ""
            Write-Host "✅ iOS setup complete!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Cyan
            Write-Host "  1. Install Xcode from Mac App Store" -ForegroundColor White
            Write-Host "  2. Run: npx cap open ios" -ForegroundColor White
            Write-Host "  3. Click the 'Run' button in Xcode" -ForegroundColor White
            Write-Host ""
            Write-Host "✅ Works on iPhones AND iPads!" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  iOS development requires macOS with Xcode" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "You can still:" -ForegroundColor Cyan
            Write-Host "  • Build for Android on Windows" -ForegroundColor White
            Write-Host "  • Use a Mac to build iOS later" -ForegroundColor White
        }
    }
    
    "3" {
        Write-Host "🚀 Setting up both platforms..." -ForegroundColor Green
        Write-Host ""
        
        # Install dependencies
        Write-Host "📦 Installing Capacitor..." -ForegroundColor Yellow
        npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios --save
        
        # Add Android
        Write-Host ""
        Write-Host "🤖 Adding Android platform..." -ForegroundColor Yellow
        npx cap add android
        
        # Add iOS
        Write-Host ""
        Write-Host "🍎 Adding iOS platform..." -ForegroundColor Yellow
        npx cap add ios
        
        # Sync files
        Write-Host ""
        Write-Host "🔄 Syncing files..." -ForegroundColor Yellow
        npx cap sync
        
        Write-Host ""
        Write-Host "✅ Both platforms setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Android next steps:" -ForegroundColor Cyan
        Write-Host "  1. Install Android Studio" -ForegroundColor White
        Write-Host "  2. Run: npx cap open android" -ForegroundColor White
        Write-Host ""
        Write-Host "iOS next steps (macOS only):" -ForegroundColor Cyan
        Write-Host "  1. Install Xcode" -ForegroundColor White
        Write-Host "  2. Run: npx cap open ios" -ForegroundColor White
        Write-Host ""
        Write-Host "✅ Both support phones AND tablets!" -ForegroundColor Green
    }
    
    "4" {
        Write-Host "📦 Installing dependencies only..." -ForegroundColor Green
        Write-Host ""
        npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios --save
        Write-Host ""
        Write-Host "✅ Dependencies installed!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Run this script again to add platforms" -ForegroundColor Cyan
    }
    
    default {
        Write-Host "❌ Invalid choice. Please run again and choose 1-4" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
