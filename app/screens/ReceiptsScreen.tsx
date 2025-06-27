import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView, Platform } from 'react-native';
import { Text, Card, List, Chip, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import { commonStyles, createThemedStyles, textStyles } from '../styles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchReceipts, deleteReceipt, addMockReceipts } from '../store/receipts/receiptsSlice';
import { formatPrice } from '../data/Price';

export default function ReceiptsScreen() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { receipts, loading, error } = useSelector((state: RootState) => state.receipts);
  const themedStyles = createThemedStyles(theme);

  useEffect(() => {
    // First try to fetch from MongoDB
    dispatch(fetchReceipts());
  }, [dispatch]);

  const handleDeleteReceipt = (receiptId: string, userName: string) => {
    Alert.alert(
      'Delete Receipt',
      `Are you sure you want to delete the receipt for ${userName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteReceipt(receiptId))
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, commonStyles.centered, themedStyles.background]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Loading receipts...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[commonStyles.containerNoPadding, themedStyles.background]}>
      <View style={[commonStyles.safeContainer, themedStyles.background]}>
        <ScrollView style={[commonStyles.container, themedStyles.background]}>
          <Text variant="headlineMedium" style={commonStyles.title}>
            Receipts
          </Text>
      
      {receipts.length === 0 ? (
        <View style={commonStyles.emptyContainer}>
          <Text variant="bodyLarge" style={textStyles.emptyText}>
            No receipts found. Make a purchase to see receipts here.
          </Text>
        </View>
      ) : (
        receipts.map((receipt) => {
          const receiptDate = new Date(receipt.date).toLocaleDateString();
          const discountPercent = receipt.discountApplied 
            ? `${Math.round((receipt.discount / receipt.basePrice) * 100)}%`
            : '0%';

          return (
            <Card key={receipt.id} style={styles.card} mode="outlined">
              <Card.Content>
                <List.Item
                  title={receipt.userName}
                  description={`${receiptDate} • ${formatPrice(receipt.totalPrice)}`}
                  left={(props) => <List.Icon {...props} icon="receipt" />}
                  right={() => (
                    <View style={styles.chipContainer}>
                      <Chip icon="percent" compact>
                        {discountPercent}
                      </Chip>
                    </View>
                  )}
                />
                <View style={styles.itemsContainer}>
                  <Text variant="bodySmall" style={textStyles.emptyText}>Items:</Text>
                  <View style={styles.itemsRow}>
                    {receipt.items.map((item, index) => (
                      <Chip key={index} compact style={styles.itemChip}>
                        {item}
                      </Chip>
                    ))}
                  </View>
                  <View style={styles.priceBreakdown}>
                    <Text variant="bodySmall" style={styles.priceText}>
                      Base: {formatPrice(receipt.basePrice)}
                    </Text>
                    {receipt.discountApplied && (
                      <Text variant="bodySmall" style={[styles.priceText, { color: theme.colors.primary }]}>
                        Discount: -{formatPrice(receipt.discount)}
                      </Text>
                    )}
                    <Text variant="bodyMedium" style={[styles.priceText, { fontWeight: 'bold' }]}>
                      Total: {formatPrice(receipt.totalPrice)}
                    </Text>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <IconButton 
                  icon="delete" 
                  mode="outlined" 
                  size={20}
                  iconColor={theme.colors.error}
                  onPress={() => handleDeleteReceipt(receipt.id, receipt.userName)}
                />
              </Card.Actions>
            </Card>
          );
        })
      )}
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
    marginBottom: 8,
  },
  chipContainer: {
    justifyContent: 'center',
  },
  itemsContainer: {
    marginTop: 8,
    marginLeft: 40,
  },
  itemsLabel: {
    marginBottom: 4,
    opacity: 0.7,
  },
  itemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  itemChip: {
    marginRight: 4,
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  priceBreakdown: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  priceText: {
    marginBottom: 2,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
});
