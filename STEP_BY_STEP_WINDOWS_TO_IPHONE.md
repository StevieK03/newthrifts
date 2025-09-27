# Step-by-Step: Windows to iPhone 17 Development

## 🪟➡️📱 **Complete Step-by-Step Guide**

Follow these exact steps to get your PowerShell Master app on your iPhone 17 from Windows:

## **📋 Prerequisites (Do This First)**

### **Step 1: Install Node.js**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (v18 or higher)
3. Run the installer
4. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

### **Step 2: Install Git (if not already installed)**
1. Go to [https://git-scm.com/](https://git-scm.com/)
2. Download and install Git for Windows
3. **Verify installation:**
   ```bash
   git --version
   ```

## **🚀 Step-by-Step Development Setup**

### **Step 3: Install Expo CLI**
Open **Command Prompt** or **PowerShell** as Administrator and run:
```bash
npm install -g @expo/cli
```

**Wait for installation to complete** (this may take 2-3 minutes)

### **Step 4: Create Your Project**
```bash
# Navigate to where you want your project
cd C:\Users\YourUsername\Documents

# Create the PowerShell Master app
npx create-expo-app PowerShellMaster --template blank-typescript

# Navigate into the project
cd PowerShellMaster
```

### **Step 5: Install Required Dependencies**
```bash
# Install navigation
npm install @react-navigation/native @react-navigation/stack

# Install screen components
npm install react-native-screens react-native-safe-area-context

# Install UI components
npm install react-native-vector-icons react-native-linear-gradient
npm install react-native-animatable react-native-progress

# Install storage
npm install @react-native-async-storage/async-storage

# Install additional utilities
npm install react-native-gesture-handler react-native-reanimated
```

**Wait for all installations to complete** (this may take 5-10 minutes)

### **Step 6: Create Project Structure**
Create these folders and files in your `PowerShellMaster` directory:

```
PowerShellMaster/
├── src/
│   ├── contexts/
│   └── screens/
├── App.tsx
├── package.json
└── app.json
```

### **Step 7: Copy Your App Files**
Copy all the files from our conversation into your project:

1. **Copy `App.tsx`** to the root directory
2. **Copy `src/contexts/ThemeContext.tsx`** to `src/contexts/`
3. **Copy all screen files** to `src/screens/`:
   - `HomeScreen.tsx`
   - `LearningPathScreen.tsx`
   - `FlashcardsScreen.tsx`
   - `QuizScreen.tsx`
   - `PracticeScreen.tsx`
   - `CodePlaygroundScreen.tsx`
   - `ProgressScreen.tsx`
   - `SettingsScreen.tsx`
   - `ReferenceScreen.tsx`

### **Step 8: Configure app.json**
Create or update `app.json` in your project root:
```json
{
  "expo": {
    "name": "PowerShell Master",
    "slug": "powershell-master",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourname.powershellmaster"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1a2e"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

## **📱 iPhone 17 Setup**

### **Step 9: Install Expo Go on iPhone 17**
1. **Open App Store** on your iPhone 17
2. **Search for "Expo Go"**
3. **Install Expo Go** (it's free)
4. **Open Expo Go** app

### **Step 10: Start Development Server**
On your Windows computer, run:
```bash
npx expo start
```

**You should see:**
- A QR code in your terminal
- A web page opening with the QR code
- Development server starting

### **Step 11: Connect iPhone 17 to App**
1. **Open Expo Go** on your iPhone 17
2. **Tap "Scan QR Code"**
3. **Point camera at QR code** from your computer
4. **Wait for app to load** (first time may take 2-3 minutes)

**🎉 Your PowerShell Master app should now be running on your iPhone 17!**

## **🔧 Development Workflow**

### **Step 12: Test the App**
On your iPhone 17, test these features:
- ✅ **Home screen** - Navigate through all sections
- ✅ **Flashcards** - Test the flip animations
- ✅ **Quizzes** - Answer some questions
- ✅ **Practice** - Try the coding exercises
- ✅ **Code Playground** - Test the code editor
- ✅ **Progress** - Check your learning progress
- ✅ **Settings** - Toggle dark mode
- ✅ **Reference** - Browse PowerShell commands

### **Step 13: Make Changes (Optional)**
1. **Edit any file** in your project
2. **Save the file**
3. **App updates automatically** on your iPhone 17
4. **No need to restart** or rescan QR code

## **🏪 App Store Deployment (Optional)**

### **Step 14: Install EAS CLI**
```bash
npm install -g eas-cli
```

### **Step 15: Login to Expo**
```bash
eas login
```
**Create a free Expo account** if you don't have one

### **Step 16: Configure Build**
```bash
eas build:configure
```

### **Step 17: Build for iOS**
```bash
eas build --platform ios
```

**This will:**
- Create an iOS build
- Upload to Expo servers
- Generate a download link
- Take 10-15 minutes

### **Step 18: Test Build**
1. **Download the build** from the link provided
2. **Install on iPhone 17** using TestFlight or direct installation
3. **Test all features** work correctly

### **Step 19: Submit to App Store**
```bash
eas submit --platform ios
```

**Requirements:**
- Apple Developer Program account ($99/year)
- App Store Connect access
- App review process (1-7 days)

## **🛠️ Troubleshooting**

### **Common Issues and Solutions:**

#### **"Expo CLI not found"**
```bash
# Reinstall Expo CLI
npm uninstall -g @expo/cli
npm install -g @expo/cli
```

#### **"QR code not working"**
- Make sure iPhone 17 and Windows computer are on same WiFi network
- Try scanning from the web page instead of terminal
- Restart Expo development server

#### **"App not loading"**
```bash
# Clear Expo cache
npx expo start --clear
```

#### **"Dependencies not installing"**
```bash
# Clear npm cache
npm cache clean --force
# Reinstall dependencies
npm install
```

#### **"iPhone 17 not connecting"**
- Check WiFi connection on both devices
- Try using tunnel mode:
```bash
npx expo start --tunnel
```

## **📱 Daily Development Workflow**

### **Every Time You Want to Develop:**

1. **Open Command Prompt** in your project directory
2. **Run:** `npx expo start`
3. **Open Expo Go** on iPhone 17
4. **Scan QR code**
5. **Start coding!**

### **Making Changes:**
1. **Edit any file** in your project
2. **Save the file**
3. **App updates automatically** on iPhone 17
4. **Test changes** on real device

## **🎯 What You'll Have**

### **Complete PowerShell Learning App on iPhone 17:**
- ✅ **45+ Interactive Flashcards** (PowerShell 5.1 + 7)
- ✅ **35+ Quiz Questions** with explanations
- ✅ **15+ Practice Exercises** with solutions
- ✅ **25+ Reference Commands** with syntax
- ✅ **11 Learning Modules** from beginner to advanced
- ✅ **Code Playground** with touch support
- ✅ **Progress Tracking** with XP and achievements
- ✅ **Dark Mode Support** with theme switching
- ✅ **All Your PowerShell Topics** covered comprehensively

## **🎉 Success!**

**You now have a complete PowerShell learning app running on your iPhone 17, developed entirely on Windows!**

**Total setup time: 30-45 minutes**
**Daily development: 2 minutes**
**Full functionality: 100%**

**Happy PowerShell Learning! 🚀**

---

*Follow these steps exactly, and you'll have your PowerShell Master app on your iPhone 17 in under an hour!*
