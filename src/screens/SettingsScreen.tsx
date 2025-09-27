import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Progress Reset', 'Your progress has been reset.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your learning data has been exported successfully.');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'Data import feature will be available in a future update.');
  };

  const handleAbout = () => {
    Alert.alert(
      'About PowerShell Master',
      'Version 1.0.0\n\nA comprehensive PowerShell learning app designed to take you from beginner to advanced scripting.\n\n© 2024 PowerShell Master'
    );
  };

  const handleFeedback = () => {
    Alert.alert('Send Feedback', 'Feedback feature will be available in a future update.');
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    showArrow = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#667eea" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && <Icon name="chevron-right" size={20} color="#ccc" />}
      </View>
    </TouchableOpacity>
  );

  const DifficultySelector = () => (
    <View style={styles.difficultyContainer}>
      {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.difficultyButton,
            difficulty === level && styles.difficultyButtonActive,
          ]}
          onPress={() => setDifficulty(level)}
        >
          <Text
            style={[
              styles.difficultyText,
              difficulty === level && styles.difficultyTextActive,
            ]}
          >
            {level}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.header}
      >
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your learning experience</Text>
      </LinearGradient>

      <View style={styles.sectionsContainer}>
        {/* Learning Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Preferences</Text>
          
          <SettingItem
            icon="school"
            title="Default Difficulty"
            subtitle="Set your preferred learning level"
            rightComponent={<DifficultySelector />}
          />

          <SettingItem
            icon="lightbulb-outline"
            title="Show Hints"
            subtitle="Display helpful hints during exercises"
            rightComponent={
              <Switch
                value={showHints}
                onValueChange={setShowHints}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={showHints ? '#f5dd4b' : '#f4f3f4'}
              />
            }
          />

          <SettingItem
            icon="save"
            title="Auto Save Progress"
            subtitle="Automatically save your learning progress"
            rightComponent={
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={autoSave ? '#f5dd4b' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive notifications about your progress"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={notifications ? '#f5dd4b' : '#f4f3f4'}
              />
            }
          />

          <SettingItem
            icon="schedule"
            title="Daily Reminders"
            subtitle="Get reminded to study every day"
            rightComponent={
              <Switch
                value={dailyReminders}
                onValueChange={setDailyReminders}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={dailyReminders ? '#f5dd4b' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <SettingItem
            icon="brightness-6"
            title="Dark Mode"
            subtitle="Use dark theme throughout the app"
            rightComponent={
              <Switch
                value={theme.isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={theme.isDark ? '#f5dd4b' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Audio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          
          <SettingItem
            icon="volume-up"
            title="Sound Effects"
            subtitle="Play sounds for interactions and feedback"
            rightComponent={
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={soundEffects ? '#f5dd4b' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <SettingItem
            icon="file-download"
            title="Export Data"
            subtitle="Export your learning progress and achievements"
            onPress={handleExportData}
            showArrow
          />

          <SettingItem
            icon="file-upload"
            title="Import Data"
            subtitle="Import previously exported data"
            onPress={handleImportData}
            showArrow
          />

          <SettingItem
            icon="refresh"
            title="Reset Progress"
            subtitle="Start over with a clean slate"
            onPress={handleResetProgress}
            showArrow
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <SettingItem
            icon="feedback"
            title="Send Feedback"
            subtitle="Help us improve the app"
            onPress={handleFeedback}
            showArrow
          />

          <SettingItem
            icon="help"
            title="Help & FAQ"
            subtitle="Get help and find answers"
            onPress={() => Alert.alert('Help', 'Help section will be available soon.')}
            showArrow
          />

          <SettingItem
            icon="info"
            title="About"
            subtitle="App version and information"
            onPress={handleAbout}
            showArrow
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfoContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.appInfoCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="code" size={40} color="#fff" />
            <Text style={styles.appName}>PowerShell Master</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Master PowerShell from fundamentals to advanced scripting
            </Text>
          </LinearGradient>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionsContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  difficultyButtonActive: {
    backgroundColor: '#667eea',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  difficultyTextActive: {
    color: '#fff',
  },
  appInfoContainer: {
    marginTop: 20,
  },
  appInfoCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    color: '#f0f0f0',
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen;
