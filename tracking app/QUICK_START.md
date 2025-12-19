# 📱🖥️ Trade Tracker - Quick Start Guide

## Choose Your Platform:

### Option 1: 🖥️ Desktop App (Easiest - Recommended)

**For Windows:**

1. Open PowerShell in the app folder:
```powershell
cd "C:\Users\USER\Desktop\tracking app"
```

2. Install dependencies (first time only):
```powershell
npm install
```

3. Run the desktop app:
```powershell
npm start
```

4. To create an installer:
```powershell
npm run build-win
```
Your installer will be in the `dist` folder!

---

### Option 2: 📱 Mobile App (iOS/Android)

**For Android:**

1. Install Capacitor:
```powershell
npm install -g @capacitor/cli
cd "C:\Users\USER\Desktop\tracking app"
npm install @capacitor/core @capacitor/android
```

2. Create www folder and copy files:
```powershell
mkdir www
copy index.html www\
copy app.js www\
copy style.css www\
```

3. Add Android platform:
```powershell
npx cap add android
npx cap sync
```

4. Open in Android Studio:
```powershell
npx cap open android
```

5. Click "Run" in Android Studio to install on your phone!

**For iOS (Mac only):**
```bash
npx cap add ios
npx cap sync
npx cap open ios
```

---

### Option 3: 🌐 Progressive Web App (No Installation)

Just open `index.html` in Chrome/Edge and click the install button in the address bar!

---

## 🎯 What You Get:

✅ **Desktop App**: Native Windows/Mac/Linux application  
✅ **Mobile App**: Native iOS/Android app from app stores  
✅ **PWA**: Installable web app that works offline  

All versions use the same code and share the same features!

---

## 📦 Files Created:

- `package.json` - Desktop app configuration
- `electron-main.js` - Desktop app entry point
- `capacitor.config.json` - Mobile app configuration
- `manifest.json` - PWA configuration
- `service-worker.js` - Offline support
- `APP_SETUP_GUIDE.md` - Detailed instructions

---

## 🚀 Next Steps:

1. **Test Desktop App**: Run `npm start`
2. **Create Icons**: Generate app icons (see APP_SETUP_GUIDE.md)
3. **Build**: Create installers for distribution
4. **Publish**: Submit to app stores (optional)

Need help? Check `APP_SETUP_GUIDE.md` for detailed instructions!
