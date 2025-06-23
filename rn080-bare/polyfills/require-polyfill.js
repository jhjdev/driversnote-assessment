/**
 * Require polyfill for React Native with Hermes
 * This must be injected as early as possible in the bundle
 */

(function() {
  'use strict';
  
  if (typeof global === 'undefined') {
    return;
  }

  // Check if require already exists
  if (typeof global.require !== 'undefined') {
    console.log('require already exists, not installing polyfill');
    return;
  }

  // Install require polyfill
  global.require = function(moduleName) {
    console.warn('require("' + moduleName + '") called - providing safe fallback');
    console.trace('require call stack');
    
    // Provide safe fallbacks for common Node.js modules
    switch (moduleName) {
      case 'util':
        return {
          format: function() { return ''; },
          inspect: function() { return ''; },
          isArray: Array.isArray,
          inherits: function() {}
        };
      case 'path':
        return {
          join: function() { return ''; },
          resolve: function() { return ''; },
          basename: function() { return ''; },
          dirname: function() { return ''; },
          sep: '/'
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
          nextTick: function(fn) { setTimeout(fn, 0); },
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

  // Also provide module and exports globals
  if (typeof global.module === 'undefined') {
    global.module = { exports: {} };
  }
  
  if (typeof global.exports === 'undefined') {
    global.exports = {};
  }

  // Provide process global if it doesn't exist
  if (typeof global.process === 'undefined') {
    global.process = {
      env: {},
      argv: [],
      platform: 'react-native',
      nextTick: function(fn) { setTimeout(fn, 0); },
      cwd: function() { return '/'; }
    };
  }

  console.log('✅ Require polyfill installed successfully');
})();
