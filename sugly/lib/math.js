'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var Object$ = $void.Object
  var $export = $void.export
  var copyType = $void.copyType

  $export($, 'math', copyType(new Object$(), JS.Math, {
    'E': 'E',
    'PI': 'Pi',

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

    'abs': 'abs',
    'max': 'max',
    'min': 'min',

    'random': 'random'
  }))
}
