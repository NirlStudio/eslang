'use strict'

require('./polyfill')
var $export = require('./export')

var JS = global || window

function createSpace () {
  var $ = $export.copy('$')
  $.$isSpace = Object.prototype.isPrototypeOf

  // meta information
  var sugly = $export($, 'Sugly', {})
  $export(sugly, 'runtime', 'js')
  $export(sugly, 'version', '0.0.1')
  $export(sugly, 'debugging', true)
  return $
}

function exportConstants ($) {
  $[''] = null
  $.null = null
  $.true = true
  $.false = false
  $.NaN = NaN
  $.Infinity = Infinity
}

function initializeSpace ($) {
  // Hello, world.
  require('./generic/null')($)

  require('./generic/symbol')($)
  $export($, 'symbol', $.Symbol['value-of'])

  require('./generic/bool')($)
  $export($, 'bool', $.Bool['value-of'])

  require('./generic/number')($)
  $export($, 'number', $.Number['value-of'])

  require('./generic/int')($)
  $export($, 'int', $.Int['value-of'])

  require('./generic/float')($)
  $export($, 'float', $.Float['value-of'])

  require('./generic/string')($)
  $export($, 'string', $.String['value-of'])

  require('./generic/object')($)
  $export($, 'object', $.Object['create'])

  require('./generic/function')($)
  $export($, 'function', $.Function['create'])

  require('./generic/date')($)
  $export($, 'date', $.Date['create'])

  require('./generic/array')($)
  $export($, 'array', $.Array['create'])

  require('./generic/signal')($)

  require('./resolve')($)
  require('./assign')($)

  $export($, 'range', require('./generic/range'))
  $export($, 'iterate', require('./generic/iterate'))

  require('./uri')($, JS)
  require('./math')($, JS)
  require('./json')($, JS)
}

module.exports = function (output) {
  var $ = createSpace()

  // export global constant values.
  exportConstants($)

  // create generic type system
  initializeSpace($)

  // compile a piece of code to program/clauses: [[]].
  $export($, 'compile', function (code, src) {
    return require('./compiler')($)(code, src)
  })

  // encode function factory
  var encoder = $export($, 'encoder', require('./encoder'))

  // default encode function
  $export($, 'encode', encoder($, true))

  // default output function. depending on $.encode
  $export($, 'print', require('./print')($, output))

  // this is only used by runtime itself or its assembler
  $.$export = function (name, obj) {
    $export(this, name, obj)
  }

  // a placeholder loader
  require('./load')($)
  return $
}
