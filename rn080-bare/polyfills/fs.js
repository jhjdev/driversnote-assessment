// Minimal fs polyfill for React Native
module.exports = {
  readFile: function() {},
  writeFile: function() {},
  existsSync: function() { return false; },
  readFileSync: function() { return ''; },
  writeFileSync: function() {},
  stat: function() {},
  lstat: function() {},
  mkdir: function() {},
  rmdir: function() {}
};
