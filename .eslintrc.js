module.exports = {
  root: true,
  extends: ['eslint:recommended', 'standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-empty-function': 'off',

    // React rules
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // General rules - more lenient
    'no-console': 'off', // Allow console statements in React Native development
    'prefer-const': 'warn',
    'no-var': 'error',
    'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
    'no-undef': 'off', // TypeScript handles this

    // Formatting rules (less strict)
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'always-multiline'],

    // Import rules
    'import/no-duplicates': 'warn',

    // Use standard's space-before-function-paren rule (no spaces)
    'space-before-function-paren': ['error', 'never'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'build/',
    'dist/',
    '*.config.js',
    'metro.config.js',
    'babel.config.js',
    'jest.setup.js',
    'jest.config.js',
    '__mocks__/',
  ],
};
