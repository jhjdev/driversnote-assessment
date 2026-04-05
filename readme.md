# Driversnote Assessment

A monorepo containing a React Native Expo application and Fastify API for managing users, iBeacon orders, and receipts with Turso (libSQL) database.

## 🎯 Overview

This monorepo contains two workspaces:

- **app/** - React Native mobile application (Expo SDK 55)
- **api/** - Fastify backend API with Turso (libSQL)

The application allows users to:

- Manage user profiles and customer data
- Place orders for iBeacon devices with delivery information
- Generate and view receipts stored in Turso
- View statistics and manage application settings
- Switch between light and dark themes

## 📁 Project Structure

```
driversnote-assessment/
├── app/                 # React Native mobile application
│   ├── app/            # App screens and components
│   ├── android/        # Android native code
│   ├── ios/            # iOS native code
│   ├── __mocks__/      # Jest mocks
│   └── package.json    # App dependencies
│
├── api/                # Fastify API service
│   ├── src/            # API source code
│   ├── tests/          # API tests
│   ├── vercel.json     # Vercel deployment config
│   └── package.json    # API dependencies
│
└── package.json        # Root workspace configuration
```

## ✅ Project Status

**COMPLETED IMPLEMENTATION** - The application has been successfully built with modern React Native + Expo managed workflow, featuring:

- ✅ Complete user management system
- ✅ Full order flow with iBeacon selection and delivery
- ✅ Receipt generation and Turso database storage
- ✅ Material Design 3 theming with dark/light mode
- ✅ Navigation flow fixes and proper stack management
- ✅ TypeScript strict configuration
- ✅ Fastify API backend with Turso (libSQL) integration
- ✅ Expo SDK 55 with React Native 0.83 and React 19.2
- ✅ Redux Toolkit state management
- ✅ Consistent safe area handling across Android/iOS
- ✅ Centralized and consistent style system
- ✅ Navigation stack reset after order completion
- ✅ API key authentication and security
- ✅ Monorepo structure with npm workspaces
- ✅ Vercel deployment configuration

## 🛠 Tech Stack

- **Frontend**: React Native with Expo SDK 55 (bare workflow)
- **Navigation**: React Navigation v7 with nested stack/tab navigators
- **State Management**: Redux Toolkit with Redux Persist
- **API**: Fastify with Turso (libSQL) database
- **Deployment**: Vercel (serverless)
- **Database**: Turso (libSQL)
- **UI Framework**: React Native Paper (Material Design 3)
- **Language**: TypeScript (strict configuration)
- **Development**: Expo CLI, Metro bundler
- **Monorepo**: npm workspaces

## 📱 Features

### Expo SDK 55 Highlights

The app runs on Expo SDK 55 (React Native 0.83, React 19.2), which includes:

- **New Architecture only** — Legacy Architecture support has been dropped; the New Architecture is now the default
- **Dynamic Colors API** — Material 3 Dynamic Colors on Android that adapt to the user's wallpaper, and adaptive platform colors on iOS
- **Improved expo-blur** — efficient background blurs on Android 12+ via the RenderNode API
- **Apple Zoom transitions** — native gesture-driven shared element transitions on iOS, enabled by default
- **Hermes v1 (opt-in)** — new compiler with meaningful performance improvements (may increase build time)
- **Expo UI improvements** — Markdown in Text components, SwiftUI/Jetpack Compose parity, and extensible custom components

### User Interface

- Material Design 3 theming with light/dark mode support
- Custom tab navigation with floating action button
- Responsive design with proper screen transitions
- Loading states and error handling throughout

### User Management

- View existing users from Turso database
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
- Receipt storage in Turso with proper indexing
- Receipt listing with detailed information
- Integration with order completion flow

### Analytics & Settings

- Statistics dashboard
- Theme toggle between light and dark modes
- Application settings and preferences

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- iOS Simulator (for macOS) or Android Emulator
- Expo CLI (`npm install -g @expo/cli`)
- Turso CLI (`brew install tursodatabase/tap/turso` on macOS)
- Vercel CLI (`npm install -g vercel`)

### Installation

```bash
# Install all workspace dependencies
npm install
```

### Environment Variables

#### API (.env file in /api directory)

```env
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
NODE_ENV=development
PORT=3000
API_KEY=your-api-key-here
```

#### App (.env file in /app directory)

```env
API_BASE_URL=http://localhost:3000/api
API_KEY=your-api-key-here
```

**Important**:

- API key is required for ALL operations (create, read, update, delete)
- The `.env` files are git-ignored for security

### Running the Projects

#### Mobile App

```bash
# Start Expo dev server
npm run app

# Run on Android
npm run app:android

# Run on iOS
npm run app:ios
```

#### API

```bash
# Run in development mode
npm run api

# Build for production
npm run api:build

# Start production server
npm run api:start
```

### Testing

```bash
# Run all tests
npm test

# Run tests for specific workspace
npm test --workspace=app
npm test --workspace=api
```

## 📁 App Structure

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

The API is deployed on Vercel:

**Base URL**: `https://driversnote-assessment.vercel.app/api`

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

**Documentation**: Available at `https://driversnote-assessment.vercel.app/docs`

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

| Version | Supported        |
| ------- | ---------------- |
| 1.0.x   | ✅ Current       |
| < 1.0   | ❌ Not supported |

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

## ☁️ Deploying the API to Vercel

The API is deployed as a serverless function on Vercel, using Turso as the database.

### 1. Set Up Turso

Install the Turso CLI and authenticate:

```bash
# Install (macOS)
brew install tursodatabase/tap/turso

# Log in (opens browser)
turso auth login
```

Create a database:

```bash
turso db create driversnote-assessment
```

Retrieve the database URL and create an auth token:

```bash
# Get the database URL
turso db show driversnote-assessment --url

# Create an auth token
turso db tokens create driversnote-assessment
```

### 2. Set Up Vercel

Install the Vercel CLI and log in:

```bash
npm install -g vercel
vercel login
```

Link the project (from the repo root):

```bash
vercel link
```

### 3. Configure Environment Variables

Add the Turso credentials to Vercel. Use `printf` (not `echo`) to avoid trailing newlines:

```bash
printf 'libsql://your-db-url.turso.io' | vercel env add TURSO_DATABASE_URL production
turso db tokens create driversnote-assessment | tr -d '\n' | vercel env add TURSO_AUTH_TOKEN production
```

Also add any other required env vars (e.g. `API_KEY`):

```bash
printf 'your-api-key' | vercel env add API_KEY production
```

### 4. Deploy

```bash
vercel --prod
```

The API will be available at `https://driversnote-assessment.vercel.app`.

### Redeployment

After making changes, simply run `vercel --prod` again from the repo root. Environment variables persist across deployments.

### Vercel Configuration

The deployment is configured in `api/vercel.json`. All routes are directed to the Fastify entry point (`src/index.ts`), which runs as a single serverless function.

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
   - Ensure `.env` file is in the correct directory
   - Restart the development server

4. **Vercel deployment errors:**
   - Check env vars are set: `vercel env ls`
   - Inspect logs: `vercel logs <deployment-url>`
   - Ensure no trailing newlines in env var values

## 📄 License

This project is part of a technical assessment and is for evaluation purposes.
