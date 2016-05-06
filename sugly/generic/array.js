'use strict'

var $export = require('../export')
var dump = $export.dump(Array)

var $inst = {}
Object.assign($inst, dump.props)
Object.assign($inst, dump.methods)

function isType () {
  return function Array$is_type (value) {
    return Array.isArray(value)
  }
}

function create () {
  return function Array$create (x, y, z) {
    switch (arguments.length) {
      case 0:
        return []
      case 1:
        return [x]
      case 2:
        return [x, y]
      case 3:
        return [x, y, z]
      default:
        return Array.prototype.slice.call(arguments)
    }
  }
}

function toCode ($) {
  return function Array$to_code (value, pretty) {
    return $.encode.array(value)
  }
}

function toString ($) {
  return function Array$to_string (value, format) {
    return $.encode.array(value)
  }
}

function codeAsClause ($) {
  return function Array$code_as_clause (value, pretty) {
    return $.encode.clause(value)
  }
}

function codeAsProgram ($) {
  return function Array$code_as_program (value, pretty) {
    return $.encode(value)
  }
}

function isInstance () {
  return function Array$is_instance (value) {
    return Object.is(this, value)
  }
}

function concat () {
  return function Array$concat () {
    return arguments.length < 1 ? [] : Array.prototype.concat.apply([], arguments)
  }
}

module.exports = function ($) {
  var $Array = $export.copy('Array')

  $Array.create = create()
  $Array.concat = concat()
  $Array.of = function (type/*, items */) {
    // TODO - typed array
    return []
  }
  $Array.from = function (src, mapFunc, thisArg) {
    // TODO - iterable to array
    return []
  }

  $Array.$ = $export.copy('$', $inst)
  $Array.$['to-code'] = toCode($)
  $Array.$['to-string'] = toString($)

  $Array.$['to-clause'] = toClause($)
  $Array.$['to-program'] = toProgram($)

  return $Array
}
