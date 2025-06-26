import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ProgressBar, useTheme, Divider } from 'react-native-paper';

export default function StatsScreen() {
  const theme = useTheme();

  const stats = {
    totalUsers: 156,
    totalReceipts: 1234,
    totalRevenue: 45678.99,
    averageDiscount: 12.5,
    topCustomers: [
      { name: 'John Doe', purchases: 45 },
      { name: 'Jane Smith', purchases: 38 },
      { name: 'Mike Johnson', purchases: 32 },
    ],
    monthlyGrowth: 0.85,
    discountUsage: 0.65,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Statistics
      </Text>
      
      {/* Overview Cards */}
      <View style={styles.overviewRow}>
        <Card style={[styles.overviewCard, styles.halfWidth]} mode="outlined">
          <Card.Content style={styles.overviewContent}>
            <Text variant="titleLarge" style={[styles.statNumber, { color: theme.colors.primary }]}>
              {stats.totalUsers}
            </Text>
            <Text variant="bodyMedium">Total Users</Text>
          </Card.Content>
        </Card>
        
        <Card style={[styles.overviewCard, styles.halfWidth]} mode="outlined">
          <Card.Content style={styles.overviewContent}>
            <Text variant="titleLarge" style={[styles.statNumber, { color: theme.colors.secondary }]}>
              {stats.totalReceipts}
            </Text>
            <Text variant="bodyMedium">Total Receipts</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Revenue</Text>
          <Text variant="headlineSmall" style={[styles.revenueText, { color: theme.colors.primary }]}>
            ${stats.totalRevenue.toLocaleString()}
          </Text>
          <Text variant="bodySmall" style={styles.subText}>
            Average discount: {stats.averageDiscount}%
          </Text>
        </Card.Content>
      </Card>

      {/* Progress Indicators */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Performance Metrics</Text>
          
          <View style={styles.progressItem}>
            <Text variant="bodyMedium">Monthly Growth</Text>
            <ProgressBar 
              progress={stats.monthlyGrowth} 
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.progressText}>
              {Math.round(stats.monthlyGrowth * 100)}%
            </Text>
          </View>

          <View style={styles.progressItem}>
            <Text variant="bodyMedium">Discount Usage</Text>
            <ProgressBar 
              progress={stats.discountUsage} 
              color={theme.colors.secondary}
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.progressText}>
              {Math.round(stats.discountUsage * 100)}%
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Top Customers */}
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Top Customers</Text>
          {stats.topCustomers.map((customer, index) => (
            <View key={index}>
              <View style={styles.customerRow}>
                <Text variant="bodyMedium" style={styles.customerName}>
                  {customer.name}
                </Text>
                <Text variant="bodyMedium" style={[styles.customerPurchases, { color: theme.colors.primary }]}>
                  {customer.purchases} purchases
                </Text>
              </View>
              {index < stats.topCustomers.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
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
  overviewRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  overviewCard: {
    marginBottom: 8,
  },
  halfWidth: {
    flex: 1,
  },
  overviewContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 8,
  },
  cardTitle: {
    marginBottom: 12,
  },
  revenueText: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    opacity: 0.7,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressBar: {
    marginVertical: 8,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'right',
    opacity: 0.7,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  customerName: {
    flex: 1,
  },
  customerPurchases: {
    fontWeight: '500',
  },
  divider: {
    marginVertical: 4,
  },
});
