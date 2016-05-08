'use strict'

var $export = require('./export')

module.exports = function ($, JS) {
  var type = $export($, null, $export.copy('Math', JS.Math, {
    /* basic */
    'E': 'E',
    'LN10': 'LN10',
    'LN2': 'LN2',
    'LOG10E': 'LOG10E',
    'LOG2E': 'LOG2E',
    'PI': 'PI',
    'SQRT1_2': 'SQRT1_2',
    'SQRT2': 'SQRT2',

    'abs': 'abs',
    'ceil': 'ceil',
    'floor': 'floor',
    'round': 'round',

    'sin': 'sin',
    'cos': 'cos',
    'tan': 'tan',
    'asin': 'asin',
    'acos': 'acos',
    'atan': 'atan',
    'atan2': 'atan2',

    'exp': 'exp',
    'log': 'log',
    'pow': 'pow',

    'max': 'max',
    'min': 'min',

    'random': 'random',

    /* extended */
    'cbrt': 'cbrt',
    'log2': 'log2',
    'log10': 'log10'
  }))
  return type
}
