# Trade Tracker - Desktop & Mobile App Setup

## 📱 Mobile App (iOS & Android) - Using Capacitor

### Prerequisites
- Node.js (v16 or higher)
- For iOS: macOS with Xcode installed
- For Android: Android Studio installed

### Setup Steps

1. **Install Dependencies**
```bash
cd "C:\Users\USER\Desktop\tracking app"
npm install -g @capacitor/cli @capacitor/core
npm install @capacitor/android @capacitor/ios
```

2. **Prepare Web Assets**
```bash
# Create www folder and copy files
mkdir www
copy index.html www\
copy app.js www\
copy style.css www\
```

3. **Initialize Capacitor**
```bash
npx cap init
```

4. **Add Platforms**

For Android:
```bash
npx cap add android
npx cap sync
npx cap open android
```

For iOS (macOS only):
```bash
npx cap add ios
npx cap sync
npx cap open ios
```

5. **Build & Run**
- **Android**: Open in Android Studio and click "Run"
- **iOS**: Open in Xcode and click "Run"

---

## 🖥️ Desktop App (Windows, Mac, Linux) - Using Electron

### Prerequisites
- Node.js (v16 or higher)

### Setup Steps

1. **Install Dependencies**
```bash
cd "C:\Users\USER\Desktop\tracking app"
npm install
```

2. **Run in Development Mode**
```bash
npm start
```

3. **Build for Distribution**

**Windows:**
```bash
npm run build-win
```
Output: `dist/Trade Tracker Setup.exe`

**macOS:**
```bash
npm run build-mac
```
Output: `dist/Trade Tracker.dmg`

**Linux:**
```bash
npm run build-linux
```
Output: `dist/Trade Tracker.AppImage`

---

## 📦 What's Included

### Desktop App Features:
- ✅ Native window with menu bar
- ✅ Keyboard shortcuts (Ctrl+1-4 for navigation, Ctrl+E for export)
- ✅ System tray integration
- ✅ Auto-updates support
- ✅ Offline-first (all data stored locally)

### Mobile App Features:
- ✅ Native iOS and Android apps
- ✅ Touch-optimized interface
- ✅ Splash screen
- ✅ Offline support
- ✅ Native file system access

---

## 🎨 App Icons

You'll need to create app icons in the following formats:

**Desktop:**
- `icon.ico` (Windows) - 256x256px
- `icon.icns` (macOS) - 512x512px
- `icon.png` (Linux) - 512x512px

**Mobile:**
- iOS: Use Xcode asset catalog (1024x1024px)
- Android: Place in `android/app/src/main/res/` folders

### Quick Icon Generation:
Use online tools like:
- https://www.appicon.co/
- https://icon.kitchen/

---

## 📝 Notes

### Data Storage:
- **Desktop**: Data stored in `localStorage` (browser-like)
- **Mobile**: Data stored in app's local storage (persistent)

### Updates:
- **Desktop**: Can implement auto-updates using electron-updater
- **Mobile**: Updates through App Store / Google Play

### Distribution:
- **Desktop**: Distribute .exe, .dmg, or .AppImage files
- **Mobile**: Submit to App Store and Google Play Store

---

## 🚀 Quick Start Commands

**Desktop Development:**
```bash
npm start
```

**Desktop Build (Windows):**
```bash
npm run build-win
```

**Mobile Development (Android):**
```bash
npx cap sync
npx cap open android
```

**Mobile Development (iOS):**
```bash
npx cap sync
npx cap open ios
```

---

## 🔧 Troubleshooting

### Desktop App Won't Start:
- Ensure Node.js is installed
- Run `npm install` again
- Check for port conflicts

### Mobile Build Fails:
- Ensure Android Studio / Xcode is properly installed
- Check Java version (Android requires JDK 11+)
- Run `npx cap sync` before opening

### Icons Not Showing:
- Ensure icon files are in the correct format and location
- Rebuild the app after adding icons

---

## 📞 Support

For issues or questions, refer to:
- Electron docs: https://www.electronjs.org/docs
- Capacitor docs: https://capacitorjs.com/docs
