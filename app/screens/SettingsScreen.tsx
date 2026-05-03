import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, List, Switch, useTheme, Divider } from 'react-native-paper';
import { commonStyles, createThemedStyles } from '../styles';

interface SettingsScreenProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function SettingsScreen({ isDarkMode, toggleDarkMode }: SettingsScreenProps) {
  const theme = useTheme();
  const themedStyles = createThemedStyles(theme);

  return (
    <SafeAreaView style={[commonStyles.containerNoPadding, themedStyles.background]}>
      <View style={[commonStyles.safeContainer, themedStyles.background]}>
        <ScrollView style={[commonStyles.container, themedStyles.background]}>
          <Text variant="headlineMedium" style={commonStyles.title}>
            Settings
          </Text>

      {/* Appearance */}
      <Card style={commonStyles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={commonStyles.sectionTitle}>
            Appearance
          </Text>
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark themes"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
              />
            )}
          />
        </Card.Content>
      </Card>

      {/* Tech Stack */}
      <Card style={commonStyles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={commonStyles.sectionTitle}>
            Tech Stack
          </Text>
          <List.Item
            title="React Native"
            description="Framework for building native apps"
            left={(props) => <List.Icon {...props} icon="code-tags" />}
          />
          <Divider />
          <List.Item
            title="Redux"
            description="State management"
            left={(props) => <List.Icon {...props} icon="code-brackets" />}
          />
          <Divider />
          <List.Item
            title="TypeScript"
            description="Typed JavaScript"
            left={(props) => <List.Icon {...props} icon="language-typescript" />}
          />
          <Divider />
          <List.Item
            title="Expo"
            description="Toolchain for React Native"
            left={(props) => <List.Icon {...props} icon="file-code" />}
          />
        </Card.Content>
      </Card>

      {/* Device Info */}
      <Card style={commonStyles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={commonStyles.sectionTitle}>
            Device Info
          </Text>
          <List.Item
            title="Platform"
            description="iOS"
            left={(props) => <List.Icon {...props} icon="cellphone" />}
          />
          <Divider />
          <List.Item
            title="Screen Size"
            description="1080 x 2400"
            left={(props) => <List.Icon {...props} icon="monitor-cellphone" />}
          />
          <Divider />
          <List.Item
            title="OS Version"
            description="16.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </Card.Content>
      </Card>

      {/* About */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            About
          </Text>
          <List.Item
            title="App Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          <Divider />
          <List.Item
            title="Author"
            description="Jon Hnefill Jakobsson"
            left={(props) => <List.Icon {...props} icon="account" />}
          />
          <Divider />
          <List.Item
            title="E-Mail"
            description="jhj@jhjdev.com"
            left={(props) => <List.Icon {...props} icon="email" />}
          />
        </Card.Content>
      </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
});
