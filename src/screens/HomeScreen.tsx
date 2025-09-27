import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const menuItems = [
    {
      title: 'Learning Path',
      subtitle: 'Structured curriculum from basics to advanced',
      icon: 'school',
      color: ['#667eea', '#764ba2'],
      screen: 'LearningPath',
    },
    {
      title: 'Flashcards',
      subtitle: 'Quick review of PowerShell concepts',
      icon: 'style',
      color: ['#f093fb', '#f5576c'],
      screen: 'Flashcards',
    },
    {
      title: 'Quiz',
      subtitle: 'Test your knowledge with interactive quizzes',
      icon: 'quiz',
      color: ['#4facfe', '#00f2fe'],
      screen: 'Quiz',
    },
    {
      title: 'Practice',
      subtitle: 'Hands-on coding exercises',
      icon: 'code',
      color: ['#43e97b', '#38f9d7'],
      screen: 'Practice',
    },
    {
      title: 'Code Playground',
      subtitle: 'Experiment with PowerShell code',
      icon: 'play-arrow',
      color: ['#fa709a', '#fee140'],
      screen: 'CodePlayground',
    },
    {
      title: 'Reference',
      subtitle: 'Quick command and concept lookup',
      icon: 'book',
      color: ['#a8edea', '#fed6e3'],
      screen: 'Reference',
    },
    {
      title: 'Progress',
      subtitle: 'Track your learning journey',
      icon: 'trending-up',
      color: ['#ffecd2', '#fcb69f'],
      screen: 'Progress',
    },
    {
      title: 'Settings',
      subtitle: 'Customize your learning experience',
      icon: 'settings',
      color: ['#d299c2', '#fef9d7'],
      screen: 'Settings',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.header}
      >
        <Text style={styles.title}>PowerShell Master</Text>
        <Text style={styles.subtitle}>
          Master PowerShell from fundamentals to advanced scripting
        </Text>
      </LinearGradient>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={item.color}
              style={styles.menuItemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.menuItemContent}>
                <Icon name={item.icon} size={32} color="#fff" />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
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
  menuContainer: {
    padding: 20,
  },
  menuItem: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItemGradient: {
    borderRadius: 15,
    padding: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#f0f0f0',
    lineHeight: 20,
  },
});

export default HomeScreen;
