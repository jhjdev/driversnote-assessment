# Driversnote Assessment

A React Native Expo application for managing users, iBeacon orders, and receipts with MongoDB integration.

## 🎯 Overview

This project is a complete mobile application built with React Native and Expo that allows users to:

- Manage user profiles and customer data
- Place orders for iBeacon devices with delivery information
- Generate and view receipts stored in MongoDB
- View statistics and manage application settings
- Switch between light and dark themes

## ✅ Project Status

**COMPLETED IMPLEMENTATION** - The application has been successfully built with modern React Native + Expo managed workflow, featuring:

- ✅ Complete user management system
- ✅ Full order flow with iBeacon selection and delivery
- ✅ Receipt generation and MongoDB storage
- ✅ Material Design 3 theming with dark/light mode
- ✅ Navigation flow fixes and proper stack management
- ✅ TypeScript strict configuration
- ✅ Express.js backend with MongoDB integration
- ✅ Redux Toolkit state management
- ✅ Consistent safe area handling across Android/iOS
- ✅ Centralized and consistent style system
- ✅ Navigation stack reset after order completion

## 🛠 Tech Stack

- **Frontend**: React Native with Expo (managed workflow)
- **Navigation**: React Navigation v6 with nested stack/tab navigators
- **State Management**: Redux Toolkit with Redux Persist
- **Database**: MongoDB (hosted on port 4000)
- **Backend**: Node.js/Express server
- **UI Framework**: React Native Paper (Material Design 3)
- **Language**: TypeScript (strict configuration)
- **Development**: Expo CLI, Metro bundler

## 📱 Features

### User Interface
- Material Design 3 theming with light/dark mode support
- Custom tab navigation with floating action button
- Responsive design with proper screen transitions
- Loading states and error handling throughout

### User Management
- View existing users from MongoDB
- Create new users with comprehensive form validation
- Country selection with discount calculations
- Tag management for customer categorization

### Order Flow
- Select users and configure iBeacon quantities
- Input delivery addresses with form validation
- Calculate pricing with automatic discounts
- Order overview with confirmation

### Receipt System
- Automatic receipt generation after order completion
- Receipt storage in MongoDB with proper indexing
- Receipt listing with detailed information
- Integration with order completion flow

### Analytics & Settings
- Statistics dashboard
- Theme toggle between light and dark modes
- Application settings and preferences

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- iOS Simulator (for macOS) or Android Emulator
- Expo CLI (`npm install -g @expo/cli`)
- MongoDB instance (hosted or local)

### Installation

1. **Clone and install:**
   ```bash
   git clone https://github.com/jhjdev/driversnote-assessment.git
   cd driversnote-assessment
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   MONGODB_DB_NAME=driversnote
   PORT=4000
   EXPO_ROUTER_IMPORT_MODE=sync
   EXPO_ROUTER_APP_ROOT=./app
   ```

3. **Install server dependencies:**
   ```bash
   cd server && npm install && cd ..
   ```

### Running the App

```bash
# iOS (includes server startup)
npm run ios

# Android (includes server startup)
npm run android

# Server only
npm run server
```

## 📁 Project Structure

```
driversnote-assessment/
├── app/                    # Main application code
│   ├── components/        # Reusable UI components
│   ├── context/          # React contexts (Theme)
│   ├── data/             # Static data and utilities
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   ├── services/         # API and external services
│   ├── store/            # Redux store and slices
│   ├── styles/           # Shared styles and themes
│   └── types/            # TypeScript type definitions
├── server/               # Express.js backend server
├── assets/               # Static assets (images, icons)
├── android/              # Android native code
├── ios/                  # iOS native code
├── App.tsx              # Application entry point
└── app.json             # Expo configuration
```

## 🔄 Navigation Structure

```
TabNavigator
├── Users (Stack)
│   ├── UsersList
│   ├── Beacons
│   ├── Delivery
│   └── OrderOverview
├── Receipts (Screen)
├── CreateUser (Screen) - Floating Action Button
├── Stats (Screen)
└── Settings (Screen)
```

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt

## 🧪 Key Implementation Notes

### Styling and Safe Area Fixes
Implemented centralized styling to ensure consistent title spacing and visibility on Android:
- Unified style usage across screens
- Leveraged platform-specific configurations for Android safe areas
- Removed all inline styles and inconsistencies for predictability

### Navigation Reset Fix
The application includes a fix for navigation stack issues where the order flow would persist after completion. When navigating to Users or Receipts tabs after completing an order, the navigation stack is properly reset.

### MongoDB Integration
- Uses hosted MongoDB instance on port 4000
- Includes proper error handling and retry logic
- No seeding required (uses existing hosted data)

### Theme Support
- Material Design 3 theming
- Dynamic light/dark mode switching
- Persistent theme preference

## 🛠 Development

### Build for Production
```bash
npx expo build:ios    # For iOS
npx expo build:android # For Android
```

### Testing
```bash
npm test
```

### Troubleshooting

1. **Metro bundler issues:**
   ```bash
   npx expo start --clear
   ```

2. **iOS build issues:**
   ```bash
   cd ios && pod install && cd ..
   npx expo run:ios
   ```

3. **Environment variables not loading:**
   - Ensure `.env` file is in the root directory
   - Restart the development server

## 📄 License

This project is part of a technical assessment and is for evaluation purposes.
