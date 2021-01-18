/**
 * This module is refactored & simplified from code in project
 * [colors](https://github.com/Marak/colors.js).
 */
'use strict'

var colors = {}

var codes = {
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39]
}

function render (code, str) {
  return '\u001b[' + code[0] + 'm' + str + '\u001b[' + code[1] + 'm'
}

Object.keys(codes).forEach(function (key) {
  colors[key] = render.bind(colors, codes[key])
})

module.exports = colors
