import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: typeof MD3LightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom light theme with Material Design 3 colors
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'rgb(103, 80, 164)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(234, 221, 255)',
    onPrimaryContainer: 'rgb(33, 0, 93)',
    secondary: 'rgb(98, 91, 113)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(232, 222, 248)',
    onSecondaryContainer: 'rgb(30, 25, 43)',
    tertiary: 'rgb(125, 82, 96)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 216, 228)',
    onTertiaryContainer: 'rgb(50, 16, 29)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 255)',
    onBackground: 'rgb(29, 27, 32)',
    surface: 'rgb(255, 251, 255)',
    onSurface: 'rgb(29, 27, 32)',
    surfaceVariant: 'rgb(233, 223, 235)',
    onSurfaceVariant: 'rgb(74, 69, 78)',
    outline: 'rgb(124, 117, 126)',
    outlineVariant: 'rgb(204, 196, 206)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(50, 47, 53)',
    inverseOnSurface: 'rgb(245, 239, 244)',
    inversePrimary: 'rgb(208, 187, 255)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(248, 242, 251)',
      level2: 'rgb(244, 236, 248)',
      level3: 'rgb(240, 231, 246)',
      level4: 'rgb(239, 229, 245)',
      level5: 'rgb(236, 226, 243)',
    },
    surfaceDisabled: 'rgba(29, 27, 32, 0.12)',
    onSurfaceDisabled: 'rgba(29, 27, 32, 0.38)',
    backdrop: 'rgba(51, 47, 55, 0.4)',
  },
};

// Custom dark theme with Material Design 3 colors
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'rgb(208, 187, 255)',
    onPrimary: 'rgb(54, 28, 117)',
    primaryContainer: 'rgb(78, 55, 140)',
    onPrimaryContainer: 'rgb(234, 221, 255)',
    secondary: 'rgb(204, 194, 220)',
    onSecondary: 'rgb(51, 46, 64)',
    secondaryContainer: 'rgb(74, 68, 88)',
    onSecondaryContainer: 'rgb(232, 222, 248)',
    tertiary: 'rgb(227, 187, 200)',
    onTertiary: 'rgb(73, 37, 50)',
    tertiaryContainer: 'rgb(99, 59, 72)',
    onTertiaryContainer: 'rgb(255, 216, 228)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 218, 214)',
    background: 'rgb(16, 14, 19)',
    onBackground: 'rgb(231, 225, 229)',
    surface: 'rgb(16, 14, 19)',
    onSurface: 'rgb(231, 225, 229)',
    surfaceVariant: 'rgb(74, 69, 78)',
    onSurfaceVariant: 'rgb(204, 196, 206)',
    outline: 'rgb(150, 142, 152)',
    outlineVariant: 'rgb(74, 69, 78)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(231, 225, 229)',
    inverseOnSurface: 'rgb(50, 47, 53)',
    inversePrimary: 'rgb(103, 80, 164)',
    elevation: {
      level0: 'transparent',
      level1: 'rgb(24, 21, 27)',
      level2: 'rgb(29, 25, 32)',
      level3: 'rgb(35, 30, 38)',
      level4: 'rgb(37, 31, 40)',
      level5: 'rgb(40, 34, 43)',
    },
    surfaceDisabled: 'rgba(231, 225, 229, 0.12)',
    onSurfaceDisabled: 'rgba(231, 225, 229, 0.38)',
    backdrop: 'rgba(51, 47, 55, 0.4)',
  },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
