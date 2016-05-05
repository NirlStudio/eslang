'use strict'

var proc = require('process')
var os = proc.platform

var mockColors = {
  red: function (str) { return str },
  gray: function (str) { return str },
  green: function (str) { return str },
  underline: function (str) { return str }
}

var colors
try {
  colors = require('colors/safe')
} catch (err) {
  colors = mockColors
  colors['is-missing'] = true
}

if (os === 'win32') {
  colors.passed = '\u221a '
  colors.failed = '\u00d7 '
} else if (os === 'darwin' || proc.env['DISPLAY']) {
  colors.passed = '✓ '
  colors.failed = '✖ '
} else {
  colors = {
    red: colors.red,
    green: colors.green,
    gray: mockColors.gray,
    underline: mockColors.underline
  }
  colors.passed = '= '
  colors.failed = 'x '
}

colors.passed = colors.green(colors.passed)
colors.failed = colors.red(colors.failed)

module.exports = colors
