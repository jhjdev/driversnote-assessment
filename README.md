# Driversnote Assessment - React Native App

## Project Status

### ⚠️ Important Notice ⚠️

**The original app is currently broken** due to its reliance on React Native version 0.71 and the old architecture, which has proven unstable in modern development environments. When this assessment was created, the company that asked for it insisted on using this outdated version, which has led to compatibility issues with current development tools and libraries.

### 🚀 New App Under Construction

We are actively developing a new version of the application with:

- React Native 0.80 with Expo bare workflow
- Modern Redux Toolkit for state management
- RTK Query for efficient API calls
- Improved TypeScript implementation
- Enhanced error handling and performance optimizations

The new app can be found in the `rn080-bare` directory. Please refer to the [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) for details on the migration progress and improvements.

## Original Assessment Task

We built an MVP with a flow to buy a single iBeacon and make an order to get it delivered. The app starts with selecting a customer from a list and follows three steps: Selecting an iBeacon, picking a delivery address, and showing an order confirmation.

### Requirements:

1. **Multiple iBeacons Purchase**

   - Update UI and purchase logic to let users specify the number of iBeacons
   - Apply a 15% discount when a user buys more than 5 iBeacons

2. **Dynamic Pricing (A/B Testing)**

   - Fetch price data from two endpoints:
     - User experiments: `https://6548fde7dd8ebcd4ab240284.mockapi.io/user_experiments/{user_id}`
     - Beacon prices: `https://633ab21ae02b9b64c6151a44.mockapi.io/api/v2/BeaconPrice`

3. **Improve Architecture and Code Quality**
   - This has been addressed in our migration to Redux Toolkit

## Running the New App

### Prerequisites

- Node.js 16+
- Yarn or npm
- iOS: XCode 14+ and CocoaPods
- Android: Android Studio with SDK 31+

### Installation

```bash
# Navigate to the new app directory
cd rn080-bare

# Install dependencies
yarn install

# Install iOS dependencies
cd ios && pod install && cd ..
```

### Running the App

```bash
# Start Metro bundler
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## Development Status

The new app is currently under active development. We have successfully:

- ✅ Migrated the core architecture to Redux Toolkit
- ✅ Implemented RTK Query for API calls
- ✅ Migrated all screens with improved functionality
- ✅ Enhanced TypeScript typing throughout the codebase

Future work includes:

- ⬜ Comprehensive testing
- ⬜ Enhanced UI/UX
- ⬜ Performance optimizations
- ⬜ Additional features

## Troubleshooting

If you encounter any issues with the new app, please:

1. Ensure you have the correct Node.js version
2. Try clearing the Metro bundler cache: `yarn start --reset-cache`
3. For iOS issues: `cd ios && pod install --repo-update`
4. For Android issues: `cd android && ./gradlew clean`

## Contributing

Please refer to the [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) and [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) for guidance on the project structure and ongoing migration efforts.
