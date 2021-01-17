'use strict'

module.exports = function (exporting, context, $void) {
  var proc = $void.isNativeHost ? process : {
    platform: 'browser',
    env: {
      'DISPLAY': window.navigator.userAgent
    }
  }
  var os = proc.platform

  // define special indicator characters.
  if (os === 'win32') {
    exporting.passed = '\u221a '
    exporting.failed = '\u00d7 '
    exporting.pending = '~ '
  } else if (os === 'darwin' || proc.env['DISPLAY']) {
    exporting.passed = '✓ '
    exporting.failed = '✘ '
    exporting.pending = '\u22EF '
  } else { // *nix without X.
    exporting.passed = '= '
    exporting.failed = 'x '
    exporting.pending = '~ '
  }
  // it always succeeds.
  return true
}
