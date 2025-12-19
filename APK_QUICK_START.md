# 🚀 Quick Start - Build Your APK

## ⚡ Fastest Way to Build

### Step 1: Install Prerequisites (One-Time Setup)

1. **Install Node.js** (Required)
   - Download: https://nodejs.org/
   - Choose: LTS version (recommended)
   - Install and restart your computer

2. **Install Java JDK 17** (Optional, for command-line build)
   - Download: https://adoptium.net/
   - Or install Android Studio for GUI build

### Step 2: Run the Build Script

```powershell
cd "C:\Users\USER\Desktop\tracking app"
.\build-apk.ps1
```

That's it! The script will:
- ✅ Check prerequisites
- ✅ Install Capacitor
- ✅ Set up Android project
- ✅ Build your APK

---

## 📱 Your APK Location

After building, find your APK at:
```
C:\Users\USER\Desktop\tracking app\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📲 Install on Your Phone

1. Copy `app-debug.apk` to your Android phone
2. Open the APK file on your phone
3. Allow installation from unknown sources (if prompted)
4. Install and enjoy!

---

## 📚 Need More Help?

See **[BUILD_APK_GUIDE.md](file:///c:/Users/USER/Desktop/tracking%20app/BUILD_APK_GUIDE.md)** for:
- Detailed instructions
- Troubleshooting
- Creating signed release APK
- Publishing to Play Store

---

## 🎯 Build Options

### Debug APK (For Testing)
```powershell
.\build-apk.ps1
```
Choose option 1 (Android Studio) or 2 (Command Line)

### Release APK (For Distribution)
See BUILD_APK_GUIDE.md for creating signed release APK

---

## ⚠️ Common Issues

**"Node.js not found"**
→ Install from https://nodejs.org/ and restart terminal

**"Build failed"**
→ Make sure Java JDK 17 is installed or use Android Studio

**"APK not installing"**
→ Enable "Install from unknown sources" on your phone

---

**Ready? Run:** `.\build-apk.ps1` 🚀
