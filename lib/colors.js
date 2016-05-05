'use strict'

var colors
try {
  colors = require('colors/safe')
} catch (err) {
  colors = {
    red: function (str) { return str },
    gray: function (str) { return str },
    green: function (str) { return str },
    underline: function (str) { return str }
  }
  colors['is-missing'] = true
}

if (require('process').platform === 'win32') {
  colors.passed = '\u221a '
  colors.failed = '\u00d7 '
} else {
  colors.passed = '✓ '
  colors.failed = '✖ '
}

colors.passed = colors.green(colors.passed)
colors.failed = colors.red(colors.failed)

module.exports = colors
