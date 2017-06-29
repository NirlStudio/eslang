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
    'E': 'e',
    'LN2': 'ln-2',
    'LN10': 'ln-10',
    'LOG2E': 'log2-e',
    'LOG10E': 'log10-e',
    'PI': 'pi',
    'SQRT1_2': 'sqrt-1/2',
    'SQRT2': 'sqrt-2',

    'sin': 'sin',
    'cos': 'cos',
    'tan': 'tan',
    'asin': 'asin',
    'acos': 'acos',
    'atan': 'atan',
    'atan2': 'atan2',

    'log': 'ln',
    'exp': 'exp',
    'pow': 'pow',
    'sqrt': 'sqrt',

    'max': 'max',
    'min': 'min',

    'random': 'random'
  })
}
