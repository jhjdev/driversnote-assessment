import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View, Platform } from 'react-native';

// Import our custom components
import { ThemeProvider, useAppTheme } from './app/context/ThemeContext';
import TabNavigator from './app/navigation/TabNavigator';
import { store, persistor } from './app/store/store';

function AppContent(): React.JSX.Element {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <TabNavigator />
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
        }
        persistor={persistor}
      >
        <SafeAreaProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
