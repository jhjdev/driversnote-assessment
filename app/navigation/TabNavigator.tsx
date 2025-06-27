import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FAB, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import UserStackNavigator from './UserStackNavigator';
import ReceiptsScreen from '../screens/ReceiptsScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CreateUserScreen from '../screens/CreateUserScreen';

// Import theme context
import { useAppTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const theme = useTheme();
  const { isDarkMode } = useAppTheme();

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.colors.surface }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
        const isFocused = state.index === index;

        // Skip the middle tab (CreateUser) as it will be replaced with FAB
        if (route.name === 'CreateUser') {
          return (
            <View key={route.key} style={styles.fabContainer}>
              <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('CreateUser')}
                mode="elevated"
              />
            </View>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // Special handling for Users tab to reset to UsersList when navigating from other tabs
            if (route.name === 'Users') {
              navigation.navigate(route.name, {
                screen: 'UsersList',
                params: {}
              });
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        const getIconName = (routeName: string, focused: boolean) => {
          switch (routeName) {
            case 'Users':
              return focused ? 'account-group' : 'account-group-outline';
            case 'Receipts':
              return focused ? 'receipt' : 'file-document-outline';
            case 'Stats':
              return focused ? 'chart-line' : 'chart-line-variant';
            case 'Settings':
              return focused ? 'cog' : 'cog-outline';
            default:
              return 'circle';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Icon
              name={getIconName(route.name, isFocused)}
              size={24}
              color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  const { isDarkMode, toggleDarkMode } = useAppTheme();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Users" 
        component={UserStackNavigator}
        options={{
          tabBarLabel: 'Users',
        }}
      />
      <Tab.Screen 
        name="Receipts" 
        component={ReceiptsScreen}
        options={{
          tabBarLabel: 'Receipts',
        }}
      />
      <Tab.Screen 
        name="CreateUser" 
        component={CreateUserScreen}
        options={{
          tabBarLabel: 'Create',
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{
          tabBarLabel: 'Stats',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        options={{
          tabBarLabel: 'Settings',
        }}
      >
        {() => <SettingsScreen isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
