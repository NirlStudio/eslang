'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var object = $.object
  var constant = $void.constant
  var copyObject = $void.copyObject

  var math = constant($, 'math', object())
  copyObject(math, JS.Math, {
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
  })
  return math
}
