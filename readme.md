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
- ✅ Hosted API backend with MongoDB integration
- ✅ Redux Toolkit state management
- ✅ Consistent safe area handling across Android/iOS
- ✅ Centralized and consistent style system
- ✅ Navigation stack reset after order completion
- ✅ API key authentication and security

## 🛠 Tech Stack

- **Frontend**: React Native with Expo (bare workflow)
- **Navigation**: React Navigation v6 with nested stack/tab navigators
- **State Management**: Redux Toolkit with Redux Persist
- **API**: Hosted API service on Render.com with MongoDB backend
- **UI Framework**: React Native Paper (Material Design 3)
- **Language**: TypeScript (strict configuration)
- **Development**: Expo CLI, Metro bundler
- **Backend**: Express.js API hosted on Render.com ([API Repository](https://github.com/jhjdev/driversnote-assessment-api))

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
   
   Copy the example environment file and configure it:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your actual values:
   ```env
   # API Configuration
   API_BASE_URL=https://driversnote-assessment-api.onrender.com/api
   API_KEY=your-api-key-here
   ```
   
   **Important**: 
   - The API is hosted on Render.com and does not require local server setup
   - API key is required for ALL operations (create, read, update, delete)
   - Contact the project maintainer for the actual API key
   - The hosted API is fully functional and ready to use
   - The `.env` file is git-ignored for security

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android

# Development mode
npm run dev

# Start app only
npm start
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

The app connects to a hosted API service on Render.com:

**Base URL**: `https://driversnote-assessment-api.onrender.com/api`  
**API Repository**: [driversnote-assessment-api](https://github.com/jhjdev/driversnote-assessment-api)

**Public Endpoints** (no authentication required):
- `GET /` - Root endpoint
- `GET /api/health` - Health check
- `GET /docs` - API documentation

**Protected Endpoints** (require X-API-Key header):
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create new receipt
- `DELETE /api/receipts/:id` - Delete receipt

**Authentication**: All data endpoints require a valid API key sent in the `X-API-Key` header.

**Documentation**: Available at `https://driversnote-assessment-api.onrender.com/docs`

## 🔒 Security

### API Security
- **Authentication**: All API endpoints (except health check and docs) require API key authentication
- **API Key**: Must be provided in the `X-API-Key` header for all requests
- **Rate Limiting**: API includes rate limiting to prevent abuse
- **CORS**: Configured to allow requests from approved origins
- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: Proper error responses without exposing sensitive information

### Environment Variables
- **Never commit secrets**: The `.env` file is git-ignored to prevent API key exposure
- **Environment isolation**: Separate environment variables for development, testing, and production
- **API key rotation**: API keys should be rotated regularly in production environments

### Best Practices
- **Secure storage**: API keys are stored securely and never logged
- **Network security**: All API communications use HTTPS
- **Data validation**: Input validation on both client and server sides
- **Error boundaries**: Proper error handling to prevent crashes

### Reporting Security Issues

If you discover a security vulnerability in this project:

1. **Do not** create a public GitHub issue
2. Email the project maintainer directly with details
3. Include steps to reproduce the vulnerability
4. Allow reasonable time for the issue to be addressed
5. Security issues will be acknowledged within 48 hours

### Supported Versions

This project is part of a technical assessment. Security updates are provided for:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Current         |
| < 1.0   | ❌ Not supported   |

## 🧪 Key Implementation Notes

### Styling and Safe Area Fixes
Implemented centralized styling to ensure consistent title spacing and visibility on Android:
- Unified style usage across screens
- Leveraged platform-specific configurations for Android safe areas
- Removed all inline styles and inconsistencies for predictability

### Navigation Reset Fix
The application includes a fix for navigation stack issues where the order flow would persist after completion. When navigating to Users or Receipts tabs after completing an order, the navigation stack is properly reset.

### API Integration
- Uses hosted API service with MongoDB backend
- Includes proper error handling and retry logic with exponential backoff
- Fallback to sample data when API is unavailable
- No local database setup required

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
