# 📱 Build Android APK - Automated Script
# This script automates the entire APK build process

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Trade Tracker - APK Builder         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Step 1: Check Prerequisites
Write-Host "Step 1: Checking Prerequisites..." -ForegroundColor Yellow
Write-Host ""

$allPrereqsMet = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor White
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js found: $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "  ❌ Node.js not found" -ForegroundColor Red
    Write-Host "     Download from: https://nodejs.org/" -ForegroundColor Yellow
    $allPrereqsMet = $false
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor White
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "  ✅ npm found: $npmVersion" -ForegroundColor Green
}
else {
    Write-Host "  ❌ npm not found" -ForegroundColor Red
    Write-Host "     Install Node.js to get npm" -ForegroundColor Yellow
    $allPrereqsMet = $false
}

# Check Java
Write-Host "Checking Java JDK..." -ForegroundColor White
if (Test-Command "java") {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "  ✅ Java found: $javaVersion" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Java not found (optional for command-line build)" -ForegroundColor Yellow
    Write-Host "     Download JDK 17 from: https://adoptium.net/" -ForegroundColor Yellow
}

Write-Host ""

if (-not $allPrereqsMet) {
    Write-Host "════════════════════════════════════════" -ForegroundColor Red
    Write-Host "❌ PREREQUISITES MISSING" -ForegroundColor Red
    Write-Host "════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install the missing prerequisites:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Node.js (Required)" -ForegroundColor White
    Write-Host "   Download: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "   Install the LTS version" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Java JDK 17 (Optional, for command-line build)" -ForegroundColor White
    Write-Host "   Download: https://adoptium.net/" -ForegroundColor Cyan
    Write-Host "   Or install Android Studio for GUI build" -ForegroundColor Gray
    Write-Host ""
    Write-Host "After installing, restart your terminal and run this script again." -ForegroundColor Yellow
    Write-Host ""
    
    # Ask if user wants to open download pages
    $openPages = Read-Host "Open download pages in browser? (y/n)"
    if ($openPages -eq 'y') {
        Start-Process "https://nodejs.org/"
        Start-Process "https://adoptium.net/"
    }
    
    exit 1
}

# Step 2: Install Capacitor Dependencies
Write-Host "Step 2: Installing Capacitor Dependencies..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "node_modules/@capacitor/android") {
    Write-Host "  ✅ Capacitor already installed" -ForegroundColor Green
}
else {
    Write-Host "  📦 Installing @capacitor/core @capacitor/cli @capacitor/android..." -ForegroundColor White
    npm install @capacitor/core @capacitor/cli @capacitor/android --save
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Capacitor installed successfully" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Failed to install Capacitor" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Step 3: Prepare Web Files
Write-Host "Step 3: Preparing Web Files..." -ForegroundColor Yellow
Write-Host ""

# Create www directory if it doesn't exist
if (-not (Test-Path "www")) {
    New-Item -ItemType Directory -Path "www" -Force | Out-Null
    Write-Host "  ✅ Created www directory" -ForegroundColor Green
}

# Copy web files
Write-Host "  📁 Copying web files to www..." -ForegroundColor White
Copy-Item -Path "index.html", "app.js", "style.css", "mobile-responsive.css", "adaptive-layouts.css", "adaptive-layout.js" -Destination "www\" -Force -ErrorAction SilentlyContinue

Write-Host "  ✅ Web files copied" -ForegroundColor Green
Write-Host ""

# Step 4: Add Android Platform
Write-Host "Step 4: Setting Up Android Platform..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "android") {
    Write-Host "  ✅ Android platform already exists" -ForegroundColor Green
}
else {
    Write-Host "  🤖 Adding Android platform..." -ForegroundColor White
    npx cap add android
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Android platform added" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Failed to add Android platform" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Step 5: Sync Files
Write-Host "Step 5: Syncing Files to Android..." -ForegroundColor Yellow
Write-Host ""

npx cap sync android

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Files synced successfully" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Sync completed with warnings" -ForegroundColor Yellow
}

Write-Host ""

# Step 6: Build APK
Write-Host "Step 6: Building APK..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Choose build method:" -ForegroundColor Cyan
Write-Host "  [1] Android Studio (Recommended - GUI)" -ForegroundColor White
Write-Host "  [2] Command Line (Requires Java JDK)" -ForegroundColor White
Write-Host ""

$buildChoice = Read-Host "Enter your choice (1 or 2)"

if ($buildChoice -eq "1") {
    # Open in Android Studio
    Write-Host ""
    Write-Host "  🚀 Opening Android Studio..." -ForegroundColor White
    Write-Host ""
    Write-Host "  In Android Studio:" -ForegroundColor Cyan
    Write-Host "    1. Wait for Gradle sync to complete (may take 5-10 minutes first time)" -ForegroundColor Gray
    Write-Host "    2. Click Build → Build Bundle(s) / APK(s) → Build APK(s)" -ForegroundColor Gray
    Write-Host "    3. Wait for build to complete" -ForegroundColor Gray
    Write-Host "    4. Click 'locate' to find your APK" -ForegroundColor Gray
    Write-Host ""
    
    npx cap open android
    
    Write-Host "  ✅ Android Studio opened" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Your APK will be at:" -ForegroundColor Yellow
    Write-Host "  android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
    
}
elseif ($buildChoice -eq "2") {
    # Command line build
    if (-not (Test-Command "java")) {
        Write-Host "  ❌ Java JDK not found" -ForegroundColor Red
        Write-Host "  Please install Java JDK 17 from: https://adoptium.net/" -ForegroundColor Yellow
        Write-Host "  Or use Android Studio (option 1)" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "  🔨 Building debug APK..." -ForegroundColor White
    Write-Host "  This may take 5-10 minutes on first build..." -ForegroundColor Gray
    Write-Host ""
    
    Set-Location "android"
    
    if ($IsWindows -or $env:OS -match "Windows") {
        .\gradlew.bat assembleDebug
    }
    else {
        ./gradlew assembleDebug
    }
    
    Set-Location ".."
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "  ✅ APK built successfully!" -ForegroundColor Green
        Write-Host ""
        
        $apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
        if (Test-Path $apkPath) {
            $apkSize = (Get-Item $apkPath).Length / 1MB
            Write-Host "  📦 APK Details:" -ForegroundColor Cyan
            Write-Host "     Location: $apkPath" -ForegroundColor White
            Write-Host "     Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor White
            Write-Host ""
            
            # Ask if user wants to open folder
            $openFolder = Read-Host "  Open APK folder? (y/n)"
            if ($openFolder -eq 'y') {
                explorer.exe "android\app\build\outputs\apk\debug"
            }
        }
    }
    else {
        Write-Host ""
        Write-Host "  ❌ Build failed" -ForegroundColor Red
        Write-Host "  Check the error messages above" -ForegroundColor Yellow
        exit 1
    }
}
else {
    Write-Host "  ❌ Invalid choice" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ BUILD COMPLETE!" -ForegroundColor Green
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Locate your APK:" -ForegroundColor White
Write-Host "   android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Install on your Android device:" -ForegroundColor White
Write-Host "   • Copy APK to your phone" -ForegroundColor Gray
Write-Host "   • Open the APK file on your phone" -ForegroundColor Gray
Write-Host "   • Allow installation from unknown sources" -ForegroundColor Gray
Write-Host "   • Install the app" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test the app:" -ForegroundColor White
Write-Host "   • Open Trade Tracker" -ForegroundColor Gray
Write-Host "   • Test all features" -ForegroundColor Gray
Write-Host "   • Verify data persistence" -ForegroundColor Gray
Write-Host ""
Write-Host "For release APK (signed for distribution):" -ForegroundColor Yellow
Write-Host "  See BUILD_APK_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
