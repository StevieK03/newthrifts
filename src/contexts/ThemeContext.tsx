import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  gradients: {
    primary: string[];
    secondary: string[];
    success: string[];
    warning: string[];
    error: string[];
    info: string[];
  };
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
    accent: '#4CAF50',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  gradients: {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'],
    success: ['#4CAF50', '#45a049'],
    warning: ['#FF9800', '#f57c00'],
    error: ['#F44336', '#d32f2f'],
    info: ['#2196F3', '#1976d2'],
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333',
    accent: '#4CAF50',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  gradients: {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'],
    success: ['#4CAF50', '#45a049'],
    warning: ['#FF9800', '#f57c00'],
    error: ['#F44336', '#d32f2f'],
    info: ['#2196F3', '#1976d2'],
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDark(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (darkMode: boolean) => {
    try {
      await AsyncStorage.setItem('theme', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveTheme(newTheme);
  };

  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode);
    saveTheme(darkMode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
