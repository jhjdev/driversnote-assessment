import { StyleSheet, Platform } from 'react-native';
import { MD3Theme } from 'react-native-paper';

// Common base styles (theme-agnostic)
export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    padding: 16,
  },
  containerNoPadding: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Typography
  title: {
    marginBottom: 16,
    marginTop: Platform.OS === 'android' ? 16 : 4,
    textAlign: 'center',
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 12,
    opacity: 0.7,
  },

  // Cards and surfaces
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  smallCard: {
    marginBottom: 8,
    elevation: 2,
  },
  surface: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  // Forms
  input: {
    marginBottom: 16,
  },
  smallInput: {
    marginBottom: 8,
  },

  // Buttons
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  smallButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },

  // States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },

  // Spacing
  bottomSpacing: {
    height: 20,
  },
  divider: {
    marginVertical: 12,
  },
  smallDivider: {
    marginVertical: 8,
  },
});

// Error text styles
export const errorStyles = StyleSheet.create({
  text: {
    color: '#B71C1C',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
});

// Counter/stepper styles
export const counterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 8,
  },
  button: {
    margin: 0,
  },
  display: {
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    alignItems: 'center',
    minWidth: 80,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
});

// Price display styles
export const priceStyles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 16,
    borderRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    fontWeight: '500',
  },
  discount: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  total: {
    color: '#6750A4',
    fontWeight: 'bold',
  },
});

// User card styles
export const userCardStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#6750A4',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  address: {
    marginLeft: 40,
    marginTop: 4,
    opacity: 0.7,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingTop: 0,
  },
  discountChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E8',
  },
  discountChipText: {
    color: '#2E7D32',
    fontSize: 12,
  },
  tagChip: {
    backgroundColor: '#E3F2FD',
    marginRight: 4,
    marginBottom: 4,
  },
  tagChipText: {
    color: '#1565C0',
    fontSize: 11,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 56,
    marginTop: 4,
    marginBottom: 8,
    gap: 6,
  },
});

// Form field styles
export const formStyles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  halfWidth: {
    flex: 1,
  },
  discountContainer: {
    paddingVertical: 8,
  },
  discountLabel: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    marginBottom: 8,
  },
});

// Text styles for consistent typography
export const textStyles = StyleSheet.create({
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

// Create theme-aware styles function
export const createThemedStyles = (theme: MD3Theme) => StyleSheet.create({
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 16,
  },
  background: {
    backgroundColor: theme.colors.background,
  },
  surface: {
    backgroundColor: theme.colors.surface,
  },
  primaryText: {
    color: theme.colors.primary,
  },
  onSurfaceText: {
    color: theme.colors.onSurface,
  },
});
