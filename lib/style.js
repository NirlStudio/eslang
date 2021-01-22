/**
 * This module is refactored & simplified from code in project
 * [colors](https://github.com/Marak/colors.js).
 */
'use strict'

var style = Object.create(null)

var codes = {
  black: [30, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],

  bold: [1, 22],
  italic: [3, 23],

  overline: null,
  underline: [4, 24],
  'line-through': [9, 29]
}

function stylize (code, str) {
  return '\u001b[' + code[0] + 'm' + str + '\u001b[' + code[1] + 'm'
}

var styles = style.styles = Object.create(null)
Object.keys(codes).forEach(function (key) {
  if (codes[key]) {
    styles[key] = stylize.bind(styles, codes[key])
  }
})

var classes = style.classes = Object.assign(Object.create(null), {
  black: 'color',
  white: 'color',
  grey: 'color',
  gray: 'color',

  red: 'color',
  green: 'color',
  yellow: 'color',
  blue: 'color',

  bold: 'font-weight',
  italic: 'font-style',

  overline: 'text-decoration',
  underline: 'text-decoration',
  'line-through': 'text-decoration'
})

var allowMultiple = style.allowMultiple = new Set([
  'text-decoration'
])

function parseList (values) {
  var props = Object.create(null)
  var enabled = false
  for (var i = 0; i < values.length; i++) {
    var value = values[i]
    if (typeof value !== 'string' || !classes[value]) {
      continue
    }
    enabled = true
    var key = classes[value]
    if (allowMultiple.has(key)) {
      props[key] ? props[key].add(value) : (props[key] = new Set([value]))
    } else {
      props[key] = value
    }
  }
  return enabled && props
}

function parseObject (obj) {
  var props = Object.create(null)
  var enabled = false
  for (var key in obj) {
    var value = obj[key]
    if (typeof value !== 'string') {
      continue
    }
    value = allowMultiple.has(key) ? value.split(/\s/) : [value]
    value.forEach(function (value) {
      if (classes[value] !== key) {
        return
      }
      enabled = true
      if (allowMultiple.has(key)) {
        props[key] ? props[key].add(value) : (props[key] = new Set([value]))
      } else {
        props[key] = value
      }
    })
  }
  return enabled && props
}

style.parse = function parse (format) {
  if (Array.isArray(format)) {
    return parseList(format)
  }
  if (typeof format === 'string') {
    return parseList(format.split(/\s/))
  }
  if (format && typeof format === 'object') {
    return parseObject(format)
  }
  return false
}

style.apply = function apply (text, props) {
  if (props) {
    for (var key in props) {
      var value = props[key]
      if (typeof value === 'string') {
        text = styles[value](text)
      } else { // set
        Array.from(value).forEach(function (value) {
          text = styles[value] && styles[value](text)
        })
      }
    }
  }
  return text
}

module.exports = style
