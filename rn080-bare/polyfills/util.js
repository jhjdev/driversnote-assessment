// Minimal util polyfill for React Native
module.exports = {
  format: function() { return ''; },
  inspect: function() { return ''; },
  isArray: Array.isArray,
  isDate: function(obj) { return obj instanceof Date; },
  isError: function(obj) { return obj instanceof Error; },
  inherits: function() {},
  deprecate: function(fn) { return fn; },
  debuglog: function() { return function() {}; },
  promisify: function(fn) { return fn; }
};
