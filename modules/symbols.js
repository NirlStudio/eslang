'use strict'

var proc = typeof window === 'undefined' ? global.process : {
  // a fake process object for web browser.
  platform: 'browser',
  env: {
    'DISPLAY': window.navigator.userAgent
  }
}
var os = proc.platform

module.exports = function (exporting) {
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
