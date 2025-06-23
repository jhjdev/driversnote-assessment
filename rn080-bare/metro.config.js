const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Enable Hermes
  config.transformer = {
    ...config.transformer,
    enableHermes: true,
  };

  // Block problematic Node.js modules
  config.resolver.blockList = [
    /scripts[\/\\].*/,
    /node_modules[\/\\]mongodb[\/\\].*/,
    /node_modules[\/\\].*[\/\\]lib[\/\\].*\.node$/,
    /node_modules[\/\\].*[\/\\]build[\/\\].*\.node$/,
    /\.node$/,
    // Block specific problematic Node.js modules
    /node_modules[\/\\](util|path|fs|os|crypto|buffer|stream|events)[\/\\].*/,
  ];

  // Ensure React Native resolver platforms
  config.resolver.platforms = ['ios', 'android', 'native', 'web'];

  // Add node modules resolver
  config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

  // Add polyfills for Node.js modules
  config.resolver.alias = {
    anser: path.resolve(__dirname, 'node_modules/anser/lib/index.js'),
    // Add polyfills for common Node.js modules
    util: path.resolve(__dirname, 'polyfills/util.js'),
    path: path.resolve(__dirname, 'polyfills/path.js'),
    fs: path.resolve(__dirname, 'polyfills/fs.js'),
    process: path.resolve(__dirname, 'polyfills/process.js'),
  };

  return config;
})();
