# Centralized Styling System

This directory contains the centralized styling system for the driversnote-clean React Native app. The system is designed to provide consistent styling across all components while maintaining flexibility for customization.

## Structure

- `styles.ts` - Main styles file containing all style definitions
- `index.ts` - Export file for easy imports

## Available Style Categories

### 1. Common Styles (`commonStyles`)
Base layout and component styles used throughout the app:

- **Layout**: `container`, `containerNoPadding`, `centered`, `row`, `spaceBetween`
- **Typography**: `title`, `sectionTitle`, `subtitle`
- **Cards**: `card`, `smallCard`, `surface`
- **Forms**: `input`, `smallInput`
- **Buttons**: `button`, `smallButton`, `buttonContent`
- **States**: `loadingContainer`, `errorContainer`, `emptyContainer`
- **Spacing**: `bottomSpacing`, `divider`, `smallDivider`

### 2. Error Styles (`errorStyles`)
Styles for error states and messaging:
- `text` - Error text styling
- `card` - Error card container

### 3. Counter Styles (`counterStyles`)
Styles for stepper/counter components:
- `container` - Counter wrapper
- `button` - Counter buttons
- `display` - Counter value display
- `value` - Counter number text
- `label` - Counter label text

### 4. Price Styles (`priceStyles`)
Styles for price displays and calculations:
- `container` - Price display wrapper
- `row` - Price row layout
- `value` - Price value text
- `discount` - Discount text (green)
- `total` - Total price text (primary color)

### 5. User Card Styles (`userCardStyles`)
Styles for user display components:
- `header` - User card header layout
- `avatar` - User avatar styling
- `info` - User info section
- `address` - Address text styling
- `actions` - Card actions layout
- `discountChip` - Discount chip styling
- `discountChipText` - Discount chip text styling

### 6. Form Styles (`formStyles`)
Styles for form components and inputs:
- `container` - Form container
- `row` - Form row layout
- `halfWidth` - Half-width inputs
- `discountContainer` - Discount slider section
- `discountLabel` - Discount label text
- `slider` - Slider component styling
- `sliderLabels` - Slider label layout
- `tagsContainer` - Tags container layout
- `tag` - Individual tag styling

### 7. Text Styles (`textStyles`)
Common text styling patterns:
- `loadingText` - Loading state text
- `emptyText` - Empty state text

### 8. Theme-Aware Styles (`createThemedStyles`)
Function that creates styles based on the current theme:
```typescript
const themedStyles = createThemedStyles(theme);
```

Available themed styles:
- `errorText` - Theme-aware error text
- `background` - Theme background color
- `surface` - Theme surface color
- `primaryText` - Theme primary text color
- `onSurfaceText` - Theme on-surface text color

## Usage

### Basic Import
```typescript
import { commonStyles, priceStyles, userCardStyles } from '../styles';
```

### Using Styles
```typescript
// Basic container
<View style={commonStyles.container}>

// Price display
<Surface style={priceStyles.container}>
  <View style={priceStyles.row}>
    <Paragraph>Total:</Paragraph>
    <Paragraph style={priceStyles.total}>{formatPrice(total)}</Paragraph>
  </View>
</Surface>

// User card
<Card style={commonStyles.card}>
  <View style={userCardStyles.header}>
    <Avatar.Text style={userCardStyles.avatar} />
    <View style={userCardStyles.info}>
      // User info content
    </View>
  </View>
</Card>
```

### Using Theme-Aware Styles
```typescript
import { useTheme } from 'react-native-paper';
import { createThemedStyles } from '../styles';

function MyComponent() {
  const theme = useTheme();
  const themedStyles = createThemedStyles(theme);
  
  return (
    <View style={[commonStyles.container, themedStyles.background]}>
      <Text style={themedStyles.primaryText}>Hello World</Text>
    </View>
  );
}
```

## Benefits

1. **Consistency** - All components use the same styling patterns
2. **Maintainability** - Changes can be made in one place
3. **Theme Integration** - Works seamlessly with React Native Paper themes
4. **Developer Experience** - Easy to find and use appropriate styles
5. **Performance** - Styles are created once and reused

## Migration Guide

When migrating existing components:

1. Remove local `StyleSheet.create()` calls
2. Import relevant style categories from `../styles`
3. Replace style references with centralized equivalents
4. Use theme-aware styles where needed

Example migration:
```typescript
// Before
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 16, textAlign: 'center' }
});

// After
import { commonStyles } from '../styles';
// Remove StyleSheet.create and use commonStyles.container, commonStyles.title
```

## Adding New Styles

When adding new common patterns:

1. Identify the category (common, form, price, etc.)
2. Add to the appropriate StyleSheet in `styles.ts`
3. Export if needed in `index.ts`
4. Document the new style here
5. Update existing components to use the new pattern

This system helps maintain a consistent, scalable, and maintainable codebase while leveraging React Native Paper's Material Design 3 theming system.
