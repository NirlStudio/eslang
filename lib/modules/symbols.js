'use strict'

module.exports = function $symbols ($void) {
  var symbols = Object.create(null)
  var os = $void.isNativeHost ? process.platform : 'browser'

  if (os === 'win32') {
    symbols.passed = '\u221a '
    symbols.failed = '\u00d7 '
    symbols.pending = '~ '
  } else if (os === 'darwin' || os === 'browser') {
    symbols.passed = '✓ '
    symbols.failed = '✘ '
    symbols.pending = '\u22EF '
  } else { // *nix without X.
    symbols.passed = '= '
    symbols.failed = 'x '
    symbols.pending = '~ '
  }

  return symbols
}
