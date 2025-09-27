# PowerShell Master - iPhone Installation Guide

## 📱 How to Install PowerShell Master on Your iPhone

### Method 1: Development Installation (Recommended for Testing)

#### Prerequisites
1. **Mac Computer** with Xcode installed
2. **iPhone** with iOS 12.0 or later
3. **Apple Developer Account** (free or paid)
4. **Node.js** (v16 or higher)
5. **React Native CLI**

#### Step 1: Install Development Tools

```bash
# Install Node.js from https://nodejs.org
# Install Xcode from Mac App Store
# Install React Native CLI
npm install -g react-native-cli

# Install CocoaPods (for iOS dependencies)
sudo gem install cocoapods
```

#### Step 2: Setup the Project

```bash
# Clone or download the PowerShell Master project
cd PowerShellMaster

# Install dependencies
npm install

# Install iOS dependencies
cd ios && pod install && cd ..
```

#### Step 3: Configure for iPhone

1. **Open Xcode:**
   ```bash
   open ios/PowerShellMaster.xcworkspace
   ```

2. **Configure Signing:**
   - Select your project in Xcode
   - Go to "Signing & Capabilities"
   - Select your Apple Developer Team
   - Change Bundle Identifier to something unique (e.g., `com.yourname.powershellmaster`)

3. **Connect Your iPhone:**
   - Connect iPhone via USB
   - Trust the computer on your iPhone
   - Enable Developer Mode in iPhone Settings > Privacy & Security > Developer Mode

#### Step 4: Build and Install

```bash
# Run on your connected iPhone
npx react-native run-ios --device

# Or build from Xcode
# Select your iPhone as the target device
# Click the "Play" button to build and install
```

### Method 2: TestFlight Distribution (For Sharing)

#### Step 1: Prepare for App Store Connect

1. **Create App Store Connect Record:**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app with bundle ID matching your Xcode project
   - Fill in app information

2. **Archive and Upload:**
   ```bash
   # In Xcode, select "Any iOS Device" as target
   # Go to Product > Archive
   # Click "Distribute App" > "App Store Connect"
   # Follow the upload process
   ```

3. **Create TestFlight Build:**
   - Go to App Store Connect > TestFlight
   - Add internal testers (yourself)
   - Add external testers (up to 10,000 users)
   - Send invitation links

#### Step 2: Install via TestFlight

1. **Download TestFlight** from App Store
2. **Accept invitation** via email or link
3. **Install PowerShell Master** through TestFlight

### Method 3: Enterprise Distribution (For Organizations)

#### Step 1: Enterprise Developer Account

1. **Apple Enterprise Developer Program** ($299/year)
2. **Create Enterprise Distribution Certificate**
3. **Create Provisioning Profile**

#### Step 2: Build Enterprise App

```bash
# Configure for enterprise distribution
# Build with enterprise certificate
# Create .ipa file for distribution
```

#### Step 3: Distribute via MDM or Web

1. **Mobile Device Management (MDM)**
2. **Internal Web Server**
3. **Email Distribution** (with proper certificates)

### Method 4: Side-loading (Advanced Users)

#### Prerequisites
- **AltStore** or **Sideloadly**
- **Apple ID** (free)
- **Computer** with iTunes

#### Step 1: Install AltStore

1. **Download AltStore** from [altstore.io](https://altstore.io)
2. **Install AltServer** on your computer
3. **Connect iPhone** and install AltStore

#### Step 2: Prepare App

```bash
# Build the app for distribution
npx react-native run-ios --configuration Release

# Or create .ipa file from Xcode
# Product > Archive > Export > Ad Hoc
```

#### Step 3: Side-load App

1. **Open AltStore** on iPhone
2. **Add .ipa file** or use AltServer
3. **Install PowerShell Master**
4. **Trust Developer** in Settings > General > Device Management

### 🔧 Troubleshooting

#### Common Issues:

1. **"Untrusted Developer" Error:**
   - Go to Settings > General > Device Management
   - Trust your developer certificate

2. **Build Errors:**
   ```bash
   # Clean and rebuild
   cd ios && pod install && cd ..
   npx react-native run-ios --reset-cache
   ```

3. **Metro Bundler Issues:**
   ```bash
   # Reset Metro cache
   npx react-native start --reset-cache
   ```

4. **iOS Simulator Issues:**
   ```bash
   # Reset simulator
   xcrun simctl erase all
   ```

#### Performance Optimization:

1. **Enable Hermes** (in metro.config.js)
2. **Optimize Bundle Size**
3. **Use Release Builds** for testing

### 📋 System Requirements

- **iOS 12.0+** (iPhone 6s and newer recommended)
- **2GB RAM** minimum
- **500MB** storage space
- **Internet connection** for initial setup

### 🎯 Features Available on iPhone

✅ **All Learning Modules**
✅ **Flashcards with 25+ cards**
✅ **Interactive Quizzes**
✅ **Code Playground**
✅ **Progress Tracking**
✅ **Dark Mode Support**
✅ **Offline Learning**
✅ **Achievement System**

### 📱 iPhone-Specific Features

- **Touch-optimized interface**
- **Haptic feedback** for interactions
- **iOS-style navigation**
- **Background app refresh**
- **Push notifications** (if enabled)
- **iCloud sync** (future feature)

### 🔄 Updates and Maintenance

#### Automatic Updates (TestFlight):
- Updates pushed automatically
- No manual intervention needed

#### Manual Updates (Development):
```bash
# Pull latest changes
git pull origin main

# Rebuild and reinstall
npm install
cd ios && pod install && cd ..
npx react-native run-ios --device
```

### 📞 Support

If you encounter issues:

1. **Check iOS version** (12.0+ required)
2. **Restart iPhone** and try again
3. **Clear app data** and reinstall
4. **Check Xcode console** for error messages
5. **Verify certificates** are valid

### 🎉 Success!

Once installed, you'll have access to:
- **Complete PowerShell curriculum**
- **Interactive learning tools**
- **Progress tracking**
- **Dark mode support**
- **All PowerShell topics** from your existing materials

The app covers all the topics you mentioned:
- Arrays, Loops, Switch Statements
- Strings, Write-Host, Verbose
- JSON, XML, Permissions
- Networking, Scheduled Jobs/Tasks
- Export-CSV, File Operations
- Functions, If-Else statements
- And much more!

**Happy Learning! 🚀**
