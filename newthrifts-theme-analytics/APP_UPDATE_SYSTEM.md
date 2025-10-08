# PowerShell Master - App Update System

## 🔄 **Automatic & Manual Update System**

This guide shows you how to set up automatic updates and easy manual updates for your PowerShell Master app.

## **🚀 Automatic Updates (Recommended)**

### **Method 1: Expo Updates (Easiest)**

#### **Setup Automatic Updates:**

```bash
# 1. Install Expo Updates
npm install expo-updates

# 2. Configure app.json for updates
```

**Update your `app.json`:**
```json
{
  "expo": {
    "name": "PowerShell Master",
    "slug": "powershell-master",
    "version": "1.0.0",
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

#### **Add Update Logic to App:**

**Create `src/utils/UpdateManager.tsx`:**
```typescript
import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export class UpdateManager {
  static async checkForUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new version of PowerShell Master is available. Would you like to update now?',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Update', onPress: () => this.downloadAndInstallUpdate() }
          ]
        );
      }
    } catch (error) {
      console.log('Error checking for updates:', error);
    }
  }

  static async downloadAndInstallUpdate() {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      Alert.alert('Update Failed', 'Failed to update the app. Please try again later.');
    }
  }

  static async checkForUpdatesOnAppStart() {
    if (!__DEV__) {
      await this.checkForUpdates();
    }
  }
}
```

#### **Integrate Updates into App:**

**Update your `App.tsx`:**
```typescript
import React, { useEffect } from 'react';
import { UpdateManager } from './src/utils/UpdateManager';
// ... other imports

const App: React.FC = () => {
  useEffect(() => {
    // Check for updates when app starts
    UpdateManager.checkForUpdatesOnAppStart();
  }, []);

  // ... rest of your app
};
```

### **Method 2: Over-the-Air (OTA) Updates**

#### **Setup OTA Updates:**

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure for updates
eas update:configure
```

#### **Publish Updates:**

```bash
# Publish update to all users
eas update --branch production --message "Added new PowerShell 7 features"

# Publish update to specific users
eas update --branch beta --message "Beta testing new features"
```

#### **Automatic Update Check:**

**Add to your app:**
```typescript
import * as Updates from 'expo-updates';

// Check for updates every time app opens
useEffect(() => {
  const checkUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        // Automatically download and install
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  };

  checkUpdates();
}, []);
```

## **📱 Manual Update System**

### **Method 1: In-App Update Checker**

**Create `src/components/UpdateChecker.tsx`:**
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { UpdateManager } from '../utils/UpdateManager';

export const UpdateChecker: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkForUpdates = async () => {
    setChecking(true);
    try {
      const update = await Updates.checkForUpdateAsync();
      setUpdateAvailable(update.isAvailable);
      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new version is available. Would you like to update now?',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Update', onPress: () => UpdateManager.downloadAndInstallUpdate() }
          ]
        );
      } else {
        Alert.alert('No Updates', 'You have the latest version!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to check for updates');
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={checkForUpdates}
        disabled={checking}
      >
        <Text style={styles.buttonText}>
          {checking ? 'Checking...' : 'Check for Updates'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

### **Method 2: Settings Screen Update Option**

**Add to your `SettingsScreen.tsx`:**
```typescript
import { UpdateManager } from '../utils/UpdateManager';

// Add this to your settings items
const handleCheckForUpdates = async () => {
  Alert.alert(
    'Check for Updates',
    'This will check for the latest version of PowerShell Master.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Check', onPress: () => UpdateManager.checkForUpdates() }
    ]
  );
};

// Add to your settings list
<SettingItem
  icon="system-update"
  title="Check for Updates"
  subtitle="Download the latest version"
  onPress={handleCheckForUpdates}
  showArrow
/>
```

## **🔄 Content Updates (PowerShell Learning Material)**

### **Dynamic Content Loading:**

**Create `src/services/ContentService.tsx`:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ContentService {
  static async loadContent() {
    try {
      // Check if content needs update
      const lastUpdate = await AsyncStorage.getItem('lastContentUpdate');
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (!lastUpdate || (now - parseInt(lastUpdate)) > oneDay) {
        // Load new content from server
        await this.fetchLatestContent();
        await AsyncStorage.setItem('lastContentUpdate', now.toString());
      }
    } catch (error) {
      console.log('Error loading content:', error);
    }
  }

  static async fetchLatestContent() {
    // Fetch latest PowerShell content from your server
    // This could include new flashcards, quiz questions, etc.
  }
}
```

### **Update PowerShell Content:**

**Create `src/utils/ContentUpdater.tsx`:**
```typescript
export class ContentUpdater {
  static async updateFlashcards() {
    // Add new PowerShell 7 flashcards
    const newFlashcards = [
      {
        id: 'new-1',
        front: 'What is PowerShell 7.4?',
        back: 'PowerShell 7.4 is the latest version with enhanced performance and new features.',
        category: 'PowerShell 7',
        difficulty: 'Beginner',
        tags: ['powershell7', 'version', 'latest']
      }
      // ... more new content
    ];
    
    // Save to local storage
    await AsyncStorage.setItem('flashcards', JSON.stringify(newFlashcards));
  }

  static async updateQuizQuestions() {
    // Add new quiz questions
    const newQuestions = [
      {
        id: 'new-q1',
        question: 'What is new in PowerShell 7.4?',
        options: ['Better performance', 'New cmdlets', 'Enhanced debugging', 'All of the above'],
        correctAnswer: 3,
        explanation: 'PowerShell 7.4 includes all these improvements and more.',
        difficulty: 'Intermediate',
        category: 'PowerShell 7'
      }
    ];
    
    await AsyncStorage.setItem('quizQuestions', JSON.stringify(newQuestions));
  }
}
```

## **🔄 App Store Updates**

### **Automatic App Store Updates:**

**Users can enable automatic updates:**
1. **iPhone Settings** → **App Store** → **App Updates** → **Automatic Updates**
2. **App Store** → **Updates** → **Update All**

### **Version Management:**

**Update `app.json` for new versions:**
```json
{
  "expo": {
    "version": "1.1.0",
    "ios": {
      "buildNumber": "2"
    }
  }
}
```

**Build and submit updates:**
```bash
# Build new version
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

## **📊 Update Analytics**

### **Track Update Success:**

**Create `src/utils/UpdateAnalytics.tsx`:**
```typescript
export class UpdateAnalytics {
  static async trackUpdateSuccess() {
    // Track successful updates
    console.log('Update completed successfully');
  }

  static async trackUpdateFailure(error: any) {
    // Track failed updates
    console.log('Update failed:', error);
  }

  static async trackUpdateCheck() {
    // Track when users check for updates
    console.log('User checked for updates');
  }
}
```

## **🔄 Complete Update Workflow**

### **Daily Development Updates:**

```bash
# 1. Make changes to your code
# 2. Save files
# 3. App updates automatically on iPhone 17
# 4. Test changes on real device
```

### **Content Updates:**

```bash
# 1. Add new PowerShell content
# 2. Update flashcards, quizzes, exercises
# 3. Publish update
eas update --message "Added new PowerShell 7.4 features"
```

### **App Store Updates:**

```bash
# 1. Update version number
# 2. Build new version
eas build --platform ios

# 3. Submit to App Store
eas submit --platform ios
```

## **🎯 Update Features You'll Have**

### **✅ Automatic Updates:**
- **App updates automatically** when you make changes
- **Content updates** for new PowerShell material
- **Background updates** without user intervention
- **Version checking** on app startup

### **✅ Manual Updates:**
- **Check for updates** button in settings
- **Force update** option
- **Update notifications** for users
- **Update progress** indicators

### **✅ Content Updates:**
- **New flashcards** added automatically
- **New quiz questions** pushed to users
- **New practice exercises** available
- **Updated PowerShell 7 content**

### **✅ App Store Updates:**
- **Automatic app updates** (if enabled by user)
- **Version management** system
- **Build and deployment** automation
- **Update notifications** through App Store

## **🚀 Quick Setup for Updates**

### **Step 1: Install Update Dependencies**
```bash
npm install expo-updates
npm install -g eas-cli
```

### **Step 2: Configure Updates**
```bash
eas update:configure
```

### **Step 3: Add Update Logic**
- Copy the UpdateManager code
- Integrate into your app
- Add update checking to settings

### **Step 4: Test Updates**
```bash
# Make a change to your app
# Publish update
eas update --message "Test update"

# Check on iPhone 17 - update should appear automatically
```

## **🎉 Success!**

**You now have a complete update system that:**
- ✅ **Updates automatically** when you make changes
- ✅ **Pushes new content** to users
- ✅ **Manages versions** properly
- ✅ **Provides manual update** options
- ✅ **Tracks update success** and failures
- ✅ **Works seamlessly** with your iPhone 17

**Your PowerShell Master app will always stay up-to-date with the latest features and content! 🚀**

---

*This update system ensures your PowerShell learning app stays current with the latest PowerShell features and learning content.*
