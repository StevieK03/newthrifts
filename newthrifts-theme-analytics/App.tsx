import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { ThemeProvider } from './src/contexts/ThemeContext';

import HomeScreen from './src/screens/HomeScreen';
import LearningPathScreen from './src/screens/LearningPathScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import QuizScreen from './src/screens/QuizScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CodePlaygroundScreen from './src/screens/CodePlaygroundScreen';
import ReferenceScreen from './src/screens/ReferenceScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'PowerShell Master' }}
          />
          <Stack.Screen 
            name="LearningPath" 
            component={LearningPathScreen} 
            options={{ title: 'Learning Path' }}
          />
          <Stack.Screen 
            name="Flashcards" 
            component={FlashcardsScreen} 
            options={{ title: 'Flashcards' }}
          />
          <Stack.Screen 
            name="Quiz" 
            component={QuizScreen} 
            options={{ title: 'Quiz' }}
          />
          <Stack.Screen 
            name="Practice" 
            component={PracticeScreen} 
            options={{ title: 'Practice' }}
          />
          <Stack.Screen 
            name="Progress" 
            component={ProgressScreen} 
            options={{ title: 'Progress' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }}
          />
          <Stack.Screen 
            name="CodePlayground" 
            component={CodePlaygroundScreen} 
            options={{ title: 'Code Playground' }}
          />
          <Stack.Screen 
            name="Reference" 
            component={ReferenceScreen} 
            options={{ title: 'Reference' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" />
    </ThemeProvider>
  );
};

export default App;
