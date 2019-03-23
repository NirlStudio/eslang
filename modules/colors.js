'use strict'

var proc = typeof window === 'undefined' ? global.process : {
  platform: window.navigator ? 'navigator' : '',
  env: {
    'DISPLAY': window.navigator ? window.navigator.userAgent : ''
  }
}
var os = proc.platform

var exportingColors = ['red', 'gray', 'green', 'underline']

module.exports = function (exporting) {
  try { // to load native module
    var colors = require('colors/safe')
    for (var i = 0; i < exportingColors.length; i++) {
      var color = exportingColors[i]
      exporting[color] = concatWith(colors[color])
    }
  } catch (err) { // create a mock interface if it's missing
    mockColors(exporting)
    exporting['is-missing'] = true
    exporting['import-error'] = err
  }
  // give special indicator characters.
  if (os === 'win32') {
    exporting.passed = '\u221a '
    exporting.failed = '\u00d7 '
    exporting.pending = '? '
  } else if (os === 'darwin' || proc.env['DISPLAY']) {
    exporting.passed = '✓ '
    exporting.failed = '✘ '
    exporting.pending = '\u22EF '
  } else { // *nix without X.
    exporting.passed = '= '
    exporting.failed = 'x '
    exporting.pending = '? '
    // mock them since they looks not working very well.
    exporting.gray = concatWith(function (text) { return text })
    exporting.underline = concatWith(function (text) { return text })
  }
  // render special characters
  exporting.passed = exporting.green(exporting.passed)
  exporting.failed = exporting.red(exporting.failed)
  // it always succeeds.
  return true
}

function concatWith (color) {
  return function () {
    return color(Array.prototype.slice.call(arguments).join(''))
  }
}
// create a mocking interface to coloring text.
function mockColors (exporting) {
  for (var i = 0; i < exportingColors.length; i++) {
    exporting[exportingColors[i]] = function () {
      return Array.prototype.slice.call(arguments).join('')
    }
  }
}
