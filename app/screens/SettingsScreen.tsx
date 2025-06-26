import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, List, Switch, useTheme, Divider } from 'react-native-paper';

interface SettingsScreenProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function SettingsScreen({ isDarkMode, toggleDarkMode }: SettingsScreenProps) {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Settings
      </Text>
      
      {/* Appearance */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
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

      {/* Business Settings */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Business Settings
          </Text>
          <List.Item
            title="Default Discount"
            description="Set the default discount percentage"
            left={(props) => <List.Icon {...props} icon="percent" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Tax Settings"
            description="Configure tax rates and calculations"
            left={(props) => <List.Icon {...props} icon="calculator" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Receipt Template"
            description="Customize receipt appearance"
            left={(props) => <List.Icon {...props} icon="receipt" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      {/* User Management */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            User Management
          </Text>
          <List.Item
            title="User Permissions"
            description="Manage user access levels"
            left={(props) => <List.Icon {...props} icon="account-cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Bulk Import"
            description="Import users from CSV file"
            left={(props) => <List.Icon {...props} icon="upload" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>

      {/* Data & Backup */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Data & Backup
          </Text>
          <List.Item
            title="Export Data"
            description="Export receipts and user data"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Backup Settings"
            description="Configure automatic backups"
            left={(props) => <List.Icon {...props} icon="backup-restore" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
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
            title="Terms of Service"
            description="View terms and conditions"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            description="View privacy policy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </Card.Content>
      </Card>
    </ScrollView>
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
