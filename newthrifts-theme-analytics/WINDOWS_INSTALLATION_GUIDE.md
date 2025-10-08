# PowerShell Master - Windows Installation Guide

## 🪟 **Windows Development Setup**

Yes, you can develop and test the PowerShell Master app on Windows! Here are the Windows-specific steps:

### **📋 Prerequisites for Windows:**

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Android Studio** - [Download here](https://developer.android.com/studio)
3. **Java Development Kit (JDK)** - [Download here](https://www.oracle.com/java/technologies/downloads/)
4. **React Native CLI** - Install with: `npm install -g react-native-cli`
5. **Android SDK** (comes with Android Studio)
6. **Android Emulator** or **Physical Android Device**

### **🚀 Windows Installation Steps:**

#### **Step 1: Install Prerequisites**

```bash
# Install Node.js (download from nodejs.org)
# Install Android Studio (download from developer.android.com)
# Install JDK (download from oracle.com)

# Install React Native CLI globally
npm install -g react-native-cli

# Install Android Studio SDK components
# (Follow Android Studio setup wizard)
```

#### **Step 2: Setup Project**

```bash
# Navigate to your project directory
cd PowerShellMaster

# Install dependencies
npm install

# For Android development, no pod install needed
# (pod install is only for iOS)
```

#### **Step 3: Configure Android Studio**

1. **Open Android Studio**
2. **Go to SDK Manager** (Tools → SDK Manager)
3. **Install required SDK components:**
   - Android SDK Platform 33
   - Android SDK Build-Tools 33.0.0
   - Android SDK Platform-Tools
   - Android SDK Tools
   - Intel x86 Emulator Accelerator (HAXM installer)

#### **Step 4: Setup Android Emulator**

1. **Open Android Studio**
2. **Go to AVD Manager** (Tools → AVD Manager)
3. **Create Virtual Device:**
   - Choose a device (e.g., Pixel 4)
   - Select system image (API 33 or higher)
   - Configure AVD settings
   - Start the emulator

#### **Step 5: Run the App**

```bash
# Start Metro bundler
npx react-native start

# In another terminal, run on Android
npx react-native run-android

# Or run on Android emulator
npx react-native run-android --device
```

## 📱 **Android-Specific Considerations**

### **🔧 Android Configuration:**

1. **Enable Developer Options:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **For Physical Device:**
   - Connect Android device via USB
   - Allow USB debugging when prompted
   - Run: `npx react-native run-android --device`

3. **For Emulator:**
   - Start Android emulator first
   - Run: `npx react-native run-android`

### **📦 Android Build Process:**

```bash
# Generate Android APK
cd android
./gradlew assembleRelease

# Install APK on device
adb install app-release.apk
```

## 🖥️ **Windows Development Workflow**

### **Option 1: Android Development (Recommended for Windows)**

**Pros:**
- ✅ No Mac required
- ✅ Free development
- ✅ Easy setup
- ✅ Full app functionality

**Cons:**
- ❌ Not iOS native
- ❌ Android emulator required
- ❌ Different UI behavior

### **Option 2: Web Development (Alternative)**

You can also run the app as a web application:

```bash
# Install React Native Web
npm install react-native-web

# Run as web app
npx react-native start --web
```

### **Option 3: Expo Development (Easiest)**

```bash
# Install Expo CLI
npm install -g @expo/cli

# Initialize Expo project
npx create-expo-app PowerShellMaster --template

# Run on web
npx expo start --web

# Run on Android
npx expo start --android
```

## 🔧 **Windows-Specific Troubleshooting**

### **Common Windows Issues:**

1. **"adb not found" Error:**
   ```bash
   # Add Android SDK to PATH
   set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
   set PATH=%PATH%;%ANDROID_HOME%\platform-tools
   ```

2. **"Java not found" Error:**
   ```bash
   # Set JAVA_HOME
   set JAVA_HOME=C:\Program Files\Java\jdk-17
   set PATH=%PATH%;%JAVA_HOME%\bin
   ```

3. **"Metro bundler not starting" Error:**
   ```bash
   # Clear Metro cache
   npx react-native start --reset-cache
   ```

4. **"Android emulator not starting" Error:**
   - Check if HAXM is installed
   - Enable virtualization in BIOS
   - Try different emulator image

### **Performance Optimization:**

```bash
# Enable Hermes for better performance
# In android/app/build.gradle
hermesEnabled = true

# Enable ProGuard for release builds
# In android/app/build.gradle
minifyEnabled true
```

## 📱 **Testing on Windows**

### **Android Emulator Testing:**
1. **Start Android Studio**
2. **Launch AVD Manager**
3. **Start emulator**
4. **Run app:** `npx react-native run-android`

### **Physical Device Testing:**
1. **Enable Developer Options** on Android device
2. **Enable USB Debugging**
3. **Connect via USB**
4. **Run app:** `npx react-native run-android --device`

### **Web Testing:**
1. **Install React Native Web**
2. **Run:** `npx react-native start --web`
3. **Open browser** to localhost:8081

## 🎯 **Windows Development Benefits**

### **✅ What Works Great on Windows:**

- ✅ **Full PowerShell learning content**
- ✅ **All 45+ flashcards**
- ✅ **All 35+ quiz questions**
- ✅ **All 15+ practice exercises**
- ✅ **Code playground functionality**
- ✅ **Progress tracking**
- ✅ **Dark mode support**
- ✅ **All PowerShell 5.1 and 7 content**

### **📱 App Features on Windows/Android:**

- **Touch-optimized interface**
- **Smooth animations**
- **Offline learning capability**
- **Settings customization**
- **Progress persistence**
- **All learning modules**
- **Interactive quizzes**
- **Code playground**

## 🚀 **Quick Start for Windows**

```bash
# 1. Install Node.js and Android Studio
# 2. Clone/download the project files
# 3. Navigate to project directory
cd PowerShellMaster

# 4. Install dependencies
npm install

# 5. Start Metro bundler
npx react-native start

# 6. In another terminal, run on Android
npx react-native run-android
```

## 📞 **Windows Support**

### **If you encounter issues:**

1. **Check Node.js version** (16+ required)
2. **Verify Android Studio installation**
3. **Check Java JDK installation**
4. **Ensure Android SDK is properly configured**
5. **Try clearing Metro cache**
6. **Restart development server**

## 🎉 **Success on Windows!**

Once set up, you'll have:
- **Complete PowerShell learning app**
- **All your PowerShell topics covered**
- **PowerShell 5.1 and 7 content**
- **Interactive learning tools**
- **Progress tracking**
- **Dark mode support**
- **Full functionality on Android**

**The app works perfectly on Windows with Android development! 🚀**

---

*This guide provides everything you need to run the PowerShell Master app on Windows using Android development tools.*
