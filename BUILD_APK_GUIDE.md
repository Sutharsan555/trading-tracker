# 📱 Build Android APK - Complete Guide

This guide will help you create an APK file for your Trade Tracker app.

---

## ⚠️ Prerequisites Required

Before building the APK, you need to install:

### 1. Node.js (Required)
- **Download**: https://nodejs.org/
- **Version**: LTS (Long Term Support) recommended
- **Why**: Needed for Capacitor and npm

**Installation:**
1. Download the Windows installer (.msi)
2. Run the installer
3. Follow the setup wizard
4. Restart your computer after installation

**Verify Installation:**
```powershell
node --version
npm --version
```

### 2. Java JDK 17 (Required)
- **Download**: https://adoptium.net/
- **Version**: JDK 17 (Temurin)
- **Why**: Required to build Android apps

**Installation:**
1. Download Windows x64 installer
2. Run installer
3. Check "Set JAVA_HOME variable"
4. Check "Add to PATH"

**Verify Installation:**
```powershell
java --version
```

### 3. Android Studio (Optional but Recommended)
- **Download**: https://developer.android.com/studio
- **Why**: Easier APK building with GUI

**Installation:**
1. Download Android Studio
2. Run installer
3. Follow setup wizard
4. Install Android SDK when prompted

---

## 🚀 Quick Build (Automated Script)

I've created an automated script for you!

### Step 1: Install Prerequisites
1. Install Node.js from https://nodejs.org/
2. Install Java JDK 17 from https://adoptium.net/
3. Restart your computer

### Step 2: Run Build Script
```powershell
cd "C:\Users\USER\Desktop\tracking app"
.\build-apk.ps1
```

The script will:
- ✅ Check all prerequisites
- ✅ Install Capacitor dependencies
- ✅ Add Android platform
- ✅ Sync your web files
- ✅ Build the APK
- ✅ Show you where the APK is located

---

## 📋 Manual Build Process

If you prefer to build manually:

### Step 1: Install Capacitor
```powershell
cd "C:\Users\USER\Desktop\tracking app"
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Add Android Platform
```powershell
npx cap add android
```

### Step 3: Sync Files
```powershell
npx cap sync android
```

### Step 4: Build APK

**Option A: Using Android Studio (Easier)**
```powershell
npx cap open android
```
Then in Android Studio:
1. Wait for Gradle sync to complete
2. Click `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. Wait for build to complete
4. Click "locate" to find your APK

**Option B: Using Command Line (No Android Studio needed)**
```powershell
cd android
.\gradlew assembleDebug
```

### Step 5: Find Your APK
The APK will be located at:
```
C:\Users\USER\Desktop\tracking app\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🎯 Build Options

### Debug APK (For Testing)
- **Purpose**: Testing on your device
- **Signing**: Auto-signed with debug key
- **Size**: Larger (includes debug info)
- **Command**: `gradlew assembleDebug`

### Release APK (For Distribution)
- **Purpose**: Publishing to Play Store or sharing
- **Signing**: Requires your keystore
- **Size**: Optimized and smaller
- **Command**: `gradlew assembleRelease`

---

## 🔐 Creating a Signed Release APK

For production/distribution, you need a signed APK:

### Step 1: Generate Keystore
```powershell
keytool -genkey -v -keystore trade-tracker.keystore -alias trade-tracker -keyalg RSA -keysize 2048 -validity 10000
```

Answer the prompts:
- Password: (choose a strong password)
- Name, Organization, etc.

**IMPORTANT**: Save this keystore file and password securely!

### Step 2: Configure Signing

Create `android/key.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=trade-tracker
storeFile=../trade-tracker.keystore
```

### Step 3: Build Release APK
```powershell
cd android
.\gradlew assembleRelease
```

Release APK location:
```
android\app\build\outputs\apk\release\app-release.apk
```

---

## 📦 APK Locations

After building, find your APK here:

**Debug APK:**
```
C:\Users\USER\Desktop\tracking app\android\app\build\outputs\apk\debug\app-debug.apk
```

**Release APK:**
```
C:\Users\USER\Desktop\tracking app\android\app\build\outputs\apk\release\app-release.apk
```

---

## 📱 Installing APK on Your Device

### Method 1: USB Cable
1. Enable **Developer Options** on your Android device
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
2. Enable **USB Debugging**
   - Settings → Developer Options → USB Debugging
3. Connect phone to PC via USB
4. Copy APK to phone
5. Open APK file on phone to install

### Method 2: Direct Transfer
1. Copy APK to your phone (via USB, email, cloud)
2. On phone, open the APK file
3. Allow installation from unknown sources if prompted
4. Install the app

### Method 3: ADB (Advanced)
```powershell
adb install app-debug.apk
```

---

## 🔧 Troubleshooting

### "Node.js not found"
**Solution**: Install Node.js from https://nodejs.org/ and restart terminal

### "Java not found"
**Solution**: Install JDK 17 from https://adoptium.net/ and set JAVA_HOME

### "Gradle build failed"
**Solution**: 
1. Make sure Java JDK 17 is installed
2. Delete `android/.gradle` folder
3. Try building again

### "SDK not found"
**Solution**: Install Android Studio or set ANDROID_HOME environment variable

### "Build takes too long"
**Solution**: First build takes 5-10 minutes. Subsequent builds are faster.

### "APK not installing on phone"
**Solution**: 
1. Enable "Install from unknown sources"
2. Make sure Android version is 5.0+
3. Try debug APK first

---

## 📊 Build Size Optimization

To reduce APK size:

### 1. Enable ProGuard (Minification)
Edit `android/app/build.gradle`:
```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 2. Enable App Bundle (Recommended)
```powershell
cd android
.\gradlew bundleRelease
```

Creates `.aab` file (smaller, optimized for Play Store)

### 3. Remove Unused Resources
The build automatically removes unused resources in release mode.

---

## 🎨 Customizing Your APK

### Change App Name
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">Trade Tracker Pro</string>
```

### Change App Icon
Replace icons in:
```
android/app/src/main/res/mipmap-*/ic_launcher.png
```

Use https://icon.kitchen/ to generate all sizes.

### Change Package Name
Edit `capacitor.config.json`:
```json
{
    "appId": "com.yourcompany.tradetracker"
}
```

Then rebuild Android platform:
```powershell
npx cap sync android
```

### Change Version
Edit `android/app/build.gradle`:
```gradle
versionCode 1
versionName "1.0.0"
```

---

## 📈 Build Performance

**First Build:**
- Time: 5-10 minutes
- Downloads dependencies
- Sets up Gradle

**Subsequent Builds:**
- Time: 1-3 minutes
- Uses cached dependencies
- Much faster

**Tips for Faster Builds:**
- Use SSD drive
- Close other applications
- Use Gradle daemon (enabled by default)

---

## ✅ Verification Checklist

After building, verify:

- [ ] APK file exists in output folder
- [ ] APK size is reasonable (5-15 MB for this app)
- [ ] APK installs on test device
- [ ] App opens without crashing
- [ ] All features work (trades, charts, calendar)
- [ ] Data persists after closing app
- [ ] Offline mode works

---

## 🚀 Next Steps

### For Testing:
1. Build debug APK
2. Install on your device
3. Test all features
4. Fix any issues

### For Distribution:
1. Create signed release APK
2. Test thoroughly
3. Optimize size
4. Prepare for Play Store

### For Play Store:
1. Create Google Play Console account ($25 one-time fee)
2. Build signed release AAB (App Bundle)
3. Fill in store listing
4. Submit for review

---

## 📚 Additional Resources

- **Capacitor Docs**: https://capacitorjs.com/docs/android
- **Android Studio**: https://developer.android.com/studio
- **Play Console**: https://play.google.com/console
- **Icon Generator**: https://icon.kitchen/

---

## 🎯 Quick Commands Reference

```powershell
# Install dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# Add Android platform
npx cap add android

# Sync files
npx cap sync android

# Open in Android Studio
npx cap open android

# Build debug APK (command line)
cd android
.\gradlew assembleDebug

# Build release APK (command line)
cd android
.\gradlew assembleRelease

# Build App Bundle
cd android
.\gradlew bundleRelease

# Clean build
cd android
.\gradlew clean
```

---

## 💡 Pro Tips

1. **Always test debug APK first** before creating release
2. **Keep your keystore safe** - you can't update your app without it
3. **Use App Bundle (.aab)** for Play Store - it's smaller and optimized
4. **Test on multiple devices** if possible
5. **Enable ProGuard** for release builds to reduce size
6. **Version your builds** properly (increment version code)

---

**Ready to build? Start here:**

1. ✅ Install Node.js: https://nodejs.org/
2. ✅ Install Java JDK 17: https://adoptium.net/
3. ✅ Run: `.\build-apk.ps1`

Your APK will be ready in minutes! 🎉
