import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Text, Card, ProgressBar, useTheme, Divider, ActivityIndicator } from 'react-native-paper';
import { commonStyles, createThemedStyles } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUsers } from '../store/user/userSlice';
import { fetchReceipts } from '../store/receipts/receiptsSlice';
import { formatPrice } from '../data/Price';

export default function StatsScreen() {
  const theme = useTheme();
  const themedStyles = createThemedStyles(theme);
  const dispatch = useDispatch<AppDispatch>();

  // Get data from Redux state
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.user);
  const { receipts, loading: receiptsLoading } = useSelector((state: RootState) => state.receipts);

  const loading = usersLoading || receiptsLoading;

  useEffect(() => {
    // Fetch fresh data when component mounts
    dispatch(fetchUsers());
    dispatch(fetchReceipts());
  }, [dispatch]);

  // Calculate real statistics from the data
  const stats = useMemo(() => {
    if (!users.length && !receipts.length) {
      return {
        totalUsers: 0,
        totalReceipts: 0,
        totalRevenue: 0,
        averageDiscount: 0,
        topCustomers: [],
        monthlyGrowth: 0,
        discountUsage: 0,
        totalBeacons: 0,
        averageOrderValue: 0,
      };
    }

    // Basic counts
    const totalUsers = users.length;
    const totalReceipts = receipts.length;

    // Revenue calculations
    const totalRevenue = receipts.reduce((sum, receipt) => sum + receipt.totalPrice, 0);
    const averageOrderValue = totalReceipts > 0 ? totalRevenue / totalReceipts : 0;

    // Discount calculations
    const receiptsWithDiscount = receipts.filter(receipt => receipt.discount > 0);
    const discountUsage = totalReceipts > 0 ? receiptsWithDiscount.length / totalReceipts : 0;
    const averageDiscount = receiptsWithDiscount.length > 0
      ? receiptsWithDiscount.reduce((sum, receipt) => {
        const discountPercent = receipt.basePrice > 0 ? (receipt.discount / receipt.basePrice) * 100 : 0;
        return sum + discountPercent;
      }, 0) / receiptsWithDiscount.length
      : 0;

    // Total beacons sold
    const totalBeacons = receipts.reduce((sum, receipt) => sum + (receipt.beacons || 0), 0);

    // Top customers by number of purchases
    const customerPurchases = receipts.reduce((acc, receipt) => {
      const customerName = receipt.userName;
      acc[customerName] = (acc[customerName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCustomers = Object.entries(customerPurchases)
      .map(([name, purchases]) => ({ name, purchases }))
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 5); // Top 5 customers

    // Monthly growth (simplified - could be enhanced with real date analysis)
    const monthlyGrowth = Math.min(totalReceipts / 10, 1); // Simple metric based on total receipts

    return {
      totalUsers,
      totalReceipts,
      totalRevenue,
      averageDiscount,
      topCustomers,
      monthlyGrowth,
      discountUsage,
      totalBeacons,
      averageOrderValue,
    };
  }, [users, receipts]);

  if (loading) {
    return (
      <SafeAreaView style={[commonStyles.containerNoPadding, themedStyles.background]}>
        <View style={[commonStyles.loadingContainer, themedStyles.background]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={commonStyles.loadingText}>
            Loading statistics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[commonStyles.containerNoPadding, themedStyles.background]}>
      <View style={[commonStyles.safeContainer, themedStyles.background]}>
        <ScrollView style={[commonStyles.container, themedStyles.background]}>
          <Text variant="headlineMedium" style={commonStyles.title}>
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
            <Text variant="bodyMedium">Total Orders</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.overviewRow}>
        <Card style={[styles.overviewCard, styles.halfWidth]} mode="outlined">
          <Card.Content style={styles.overviewContent}>
            <Text variant="titleLarge" style={[styles.statNumber, { color: theme.colors.tertiary }]}>
              {stats.totalBeacons}
            </Text>
            <Text variant="bodyMedium">Beacons Sold</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.overviewCard, styles.halfWidth]} mode="outlined">
          <Card.Content style={styles.overviewContent}>
            <Text variant="titleMedium" style={[styles.statNumber, { color: theme.colors.primary }]}>
              {formatPrice(stats.averageOrderValue)}
            </Text>
            <Text variant="bodyMedium">Avg Order Value</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Revenue</Text>
          <Text variant="headlineSmall" style={[styles.revenueText, { color: theme.colors.primary }]}>
            {formatPrice(stats.totalRevenue)}
          </Text>
          <Text variant="bodySmall" style={styles.subText}>
            Average discount: {stats.averageDiscount.toFixed(1)}%
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
          {stats.topCustomers.length > 0
            ? (
                stats.topCustomers.map((customer, index) => (
              <View key={index}>
                <View style={styles.customerRow}>
                  <Text variant="bodyMedium" style={styles.customerName}>
                    {customer.name}
                  </Text>
                  <Text variant="bodyMedium" style={[styles.customerPurchases, { color: theme.colors.primary }]}>
                    {customer.purchases} order{customer.purchases !== 1 ? 's' : ''}
                  </Text>
                </View>
                {index < stats.topCustomers.length - 1 && <Divider style={styles.divider} />}
              </View>
                ))
              )
            : (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No customer data available yet
            </Text>
              )}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});
