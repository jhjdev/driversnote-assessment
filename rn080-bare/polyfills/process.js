// Minimal process polyfill for React Native
module.exports = {
  env: {},
  argv: [],
  platform: 'react-native',
  version: 'v16.0.0',
  nextTick: function(fn) { setTimeout(fn, 0); },
  cwd: function() { return '/'; },
  chdir: function() {},
  exit: function() {},
  on: function() {},
  once: function() {},
  emit: function() {},
  removeListener: function() {}
};
