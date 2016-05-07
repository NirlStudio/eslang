'use strict'

var $export = require('../export')
var dump = $export.dump(Function)

var $inst = {}
Object.assign($inst, dump.methods)

function isType ($) {
  var isSymbol = $.Symbol.is
  return function Function$is_type (value) {
    return typeof value === 'object' && value !== null && !isSymbol(value)
  }
}

function create () {
  return function Function$create (prototype) {
    // to be assembled with the implementation of core eval function
    return function () { return null }
  }
}

function isSame () {
  return function Function$is_same (another) {
    return typeof this === 'function' && this === another
  }
}

function equals () {
  return function Function$equals (another) {
    if (typeof this !== 'function' || typeof another !== 'function') {
      return false
    }
    // TODO - to compare parameters
    return this === another
  }
}

function toCode ($) {
  return function Function$to_code () {
    return $.encode.function(this)
  }
}

module.exports = function ($) {
  var type = $export($, null, $export.copy('Function', type))
  $export(type, 'is', isType())
  $export(type, 'create', create())

  var pt = $export(type, null, $export.copy('$', $inst))
  $export(pt, 'is', isSame())
  $export(pt, 'equals', equals())

  $export(pt, 'to-code', toCode($))
  $export(pt, 'to-string', toCode($)) // TODO - to provide a more readable version?
  return type
}
