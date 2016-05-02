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

module.exports = colors
