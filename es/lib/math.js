'use strict'

var isFirefox = (typeof window !== 'undefined') &&
  (typeof firefox !== 'undefined' || navigator.userAgent.indexOf('Firefox/') > 0)

module.exports = function ($void) {
  var $ = $void.$
  var link = $void.link
  var $export = $void.export
  var thisCall = $void.thisCall
  var copyType = $void.copyType

  var math = copyType($.object.empty(), Math, {
    'E': 'e',
    'PI': 'pi',
    'LN2': 'ln2',
    'LN10': 'ln10',
    'LOG10E': 'log-e',
    'LOG2E': 'log2-e',
    'SQRT2': 'sqrt-2',
    'SQRT1_2': 'sqrt-1/2',

    'sin': 'sin',
    'cos': 'cos',
    'tan': 'tan',
    'asin': 'asin',
    'acos': 'acos',
    'atan': 'atan',
    'atan2': 'atan2',

    'exp': 'exp',
    'pow': 'pow',
    'log': 'ln',
    'log10': 'log',
    'log2': 'log2',
    'sqrt': 'sqrt',

    'abs': 'abs',
    'max': 'max',
    'min': 'min',

    'random': 'random'
  })

  // hotfix for Firefox, in which Math.exp(1) does not returns Math.E.
  isFirefox && link(math, 'exp', function exp (x) {
    return x === 1 ? Math.E : Math.exp(x)
  }, true)

  $export($, 'math', math)

  $export($, 'max', function (x, y) {
    switch (arguments.length) {
      case 0:
        return null
      case 1:
        return x
      case 2:
        return x === null || typeof x === 'undefined' ? y
          : thisCall(x, 'compare', y) === -1 ? y : x
      default:
        break
    }
    for (var i = 1; i < arguments.length; i++) {
      y = arguments[i]
      if (y !== null && typeof y !== 'undefined') {
        if (x === null || typeof x === 'undefined' ||
          thisCall(y, 'compare', x) === 1) {
          x = y
        }
      }
    }
    return x
  })

  $export($, 'min', function (x, y) {
    switch (arguments.length) {
      case 0:
        return null
      case 1:
        return x
      case 2:
        return x === null || typeof x === 'undefined' ? y
          : thisCall(x, 'compare', y) === 1 ? y : x
      default:
        break
    }
    for (var i = 1; i < arguments.length; i++) {
      y = arguments[i]
      if (y !== null && typeof y !== 'undefined') {
        if (x === null || typeof x === 'undefined' ||
          thisCall(y, 'compare', x) === -1) {
          x = y
        }
      }
    }
    return x
  })
}
