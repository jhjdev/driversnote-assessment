module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      {
        // Disable automatic babel runtime imports that cause require issues
        useTransformReactJSXExperimental: false,
        enableBabelRuntime: false,
      }
    ]
  ],
  plugins: [
    // Disable transform-runtime plugin to prevent require() calls
    // ['@babel/plugin-transform-runtime', { helpers: false }]
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      safe: false,
      allowUndefined: true
    }]
  ],
};
