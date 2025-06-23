/**
 * @format
 */

// CRITICAL: Install require polyfill IMMEDIATELY before any imports
// This must execute before any code that might call require()
(function() {
  if (typeof global !== 'undefined') {
    const originalRequire = global.require;
    
    global.require = function(moduleName: string) {
      console.error('🔍 REQUIRE CALLED:', {
        module: moduleName,
        stack: new Error().stack?.split('\n').slice(0, 5),
        hasOriginal: !!originalRequire
      });
      
      // If there was an original require, try that first
      if (originalRequire) {
        try {
          return originalRequire(moduleName);
        } catch (e) {
          console.error('Original require failed for', moduleName, ':', e);
        }
      }
      
      // Comprehensive fallback polyfills
      switch (moduleName) {
        case 'util':
          return {
            format: function() { return ''; },
            inspect: function() { return ''; },
            isArray: Array.isArray,
            inherits: function() {},
            deprecate: function(fn: Function) { return fn; }
          };
        case 'path':
          return {
            join: function() { return ''; },
            resolve: function() { return ''; },
            basename: function() { return ''; },
            dirname: function() { return ''; },
            sep: '/',
            delimiter: ':'
          };
        case 'fs':
          return {
            readFileSync: function() { return ''; },
            existsSync: function() { return false; },
            readFile: function() {},
            writeFile: function() {}
          };
        case 'process':
          return {
            env: {},
            argv: [],
            platform: 'react-native',
            nextTick: function(fn: Function) { setTimeout(fn, 0); },
            cwd: function() { return '/'; }
          };
        case 'os':
          return {
            platform: function() { return 'react-native'; },
            type: function() { return 'react-native'; }
          };
        default:
          console.warn('Unknown module "' + moduleName + '" - returning empty object');
          return {};
      }
    };
    
    global.module = global.module || { exports: {} };
    global.exports = global.exports || {};
    global.process = global.process || {
      env: {},
      argv: [],
      platform: 'react-native',
      nextTick: function(fn: Function) { setTimeout(fn, 0); },
      cwd: function() { return '/'; }
    };
    
    console.log('✅ Comprehensive require polyfill installed');
  }
})();

// Import React Native components
import {AppRegistry, LogBox} from 'react-native';

// Disable LogBox to avoid issues
LogBox.ignoreAllLogs();

import App from './App';
// For development builds, often use 'main' as the component name
const appName = 'main';

AppRegistry.registerComponent(appName, () => App);
