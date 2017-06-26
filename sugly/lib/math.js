'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var Object$ = $void.Object
  var $export = $void.export
  var copyType = $void.copyType

  var math = $export($, 'math', new Object$({
    'is-readonly': true
  }))
  // TODO: naming & removing?
  copyType(math, JS.Math, {
    /* basic */
    'E': 'E',
    'LN10': 'LN10',
    'LN2': 'LN2',
    'LOG10E': 'LOG10E',
    'LOG2E': 'LOG2E',
    'PI': 'PI',
    'SQRT1_2': 'SQRT1_2',
    'SQRT2': 'SQRT2',

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
}
