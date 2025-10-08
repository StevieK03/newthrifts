# PowerShell Master - Files to Download

## 📁 **Complete File List**

Here are all the files you need to download to create your PowerShell Master iOS app:

### **Root Directory Files:**
1. `App.tsx` - Main app component with navigation
2. `index.js` - App entry point
3. `package.json` - Dependencies and scripts
4. `app.json` - App configuration
5. `metro.config.js` - Metro bundler configuration
6. `babel.config.js` - Babel configuration
7. `README.md` - Project documentation
8. `INSTALLATION_GUIDE.md` - Detailed installation instructions
9. `DOWNLOAD_PACKAGE.md` - Download package information
10. `FILES_TO_DOWNLOAD.md` - This file

### **Source Directory Structure:**
```
src/
├── contexts/
│   └── ThemeContext.tsx
└── screens/
    ├── HomeScreen.tsx
    ├── LearningPathScreen.tsx
    ├── FlashcardsScreen.tsx
    ├── QuizScreen.tsx
    ├── PracticeScreen.tsx
    ├── CodePlaygroundScreen.tsx
    ├── ProgressScreen.tsx
    ├── SettingsScreen.tsx
    └── ReferenceScreen.tsx
```

## 📋 **Step-by-Step Download Instructions**

### **Step 1: Create Project Structure**
```bash
mkdir PowerShellMaster
cd PowerShellMaster
mkdir -p src/contexts
mkdir -p src/screens
```

### **Step 2: Download Root Files**
Copy and paste each file into your PowerShellMaster directory:

1. **App.tsx** - Main app component
2. **index.js** - App entry point  
3. **package.json** - Dependencies
4. **app.json** - App configuration
5. **metro.config.js** - Metro config
6. **babel.config.js** - Babel config
7. **README.md** - Documentation
8. **INSTALLATION_GUIDE.md** - Installation guide
9. **DOWNLOAD_PACKAGE.md** - Package info
10. **FILES_TO_DOWNLOAD.md** - This file

### **Step 3: Download Context Files**
Create `src/contexts/ThemeContext.tsx` with the theme context code

### **Step 4: Download Screen Files**
Create each screen file in `src/screens/`:
- `HomeScreen.tsx`
- `LearningPathScreen.tsx`
- `FlashcardsScreen.tsx`
- `QuizScreen.tsx`
- `PracticeScreen.tsx`
- `CodePlaygroundScreen.tsx`
- `ProgressScreen.tsx`
- `SettingsScreen.tsx`
- `ReferenceScreen.tsx`

## 🚀 **Quick Setup Commands**

After downloading all files, run these commands:

```bash
# Install dependencies
npm install

# Install iOS dependencies
cd ios && pod install && cd ..

# Open in Xcode
open ios/PowerShellMaster.xcworkspace

# Run on device
npx react-native run-ios --device
```

## 📱 **What You'll Get**

### **Complete PowerShell Learning App:**
- ✅ **45+ Interactive Flashcards** (PowerShell 5.1 + 7)
- ✅ **35+ Quiz Questions** with explanations
- ✅ **15+ Practice Exercises** with solutions
- ✅ **25+ Reference Commands** with syntax
- ✅ **11 Learning Modules** from beginner to advanced
- ✅ **Code Playground** with 15+ templates
- ✅ **Progress Tracking** with XP and achievements
- ✅ **Dark Mode Support** with theme switching
- ✅ **All Your PowerShell Topics** covered comprehensively

### **PowerShell 5.1 Content:**
- Arrays, Loops, Switch Statements
- Strings, Write-Host, Verbose
- If-Else, Functions, File Operations
- JSON, XML, Permissions
- Networking, Scheduled Jobs/Tasks
- Export-CSV, File Copy Scripts
- And much more!

### **PowerShell 7 Content:**
- Cross-platform compatibility
- New operators (Ternary `? :`, Null-conditional `?.`)
- Parallel processing (`ForEach-Object -Parallel`)
- Pipeline variables (`-PipelineVariable`)
- Enhanced debugging (`Get-Error`)
- JSON performance (`ConvertFrom-Json -AsHashtable`)
- Security features (`Get-Process -IncludeUserName`)
- Native command integration

## 🎯 **Installation Methods**

### **Method 1: Development Installation**
1. Download all files
2. Run `npm install`
3. Run `cd ios && pod install && cd ..`
4. Open in Xcode
5. Configure signing
6. Run on device

### **Method 2: TestFlight Distribution**
1. Build for App Store Connect
2. Upload to TestFlight
3. Invite testers
4. Install via TestFlight app

### **Method 3: Side-loading**
1. Build .ipa file
2. Use AltStore or similar
3. Side-load to device

## 📞 **Support**

If you need help:
1. Check the `INSTALLATION_GUIDE.md` for detailed instructions
2. Verify all files are downloaded correctly
3. Check Node.js version (16+ required)
4. Ensure Xcode is installed
5. Follow the troubleshooting guide

## 🎉 **Ready to Learn!**

Once you have all files downloaded and installed, you'll have a comprehensive PowerShell learning app that covers everything from basic concepts to advanced PowerShell 7 features!

**Total Learning Content:**
- **45+ Flashcards**
- **35+ Quiz Questions** 
- **15+ Practice Exercises**
- **25+ Reference Commands**
- **11 Learning Modules**
- **15+ Code Templates**

**Happy PowerShell Learning! 🚀**
