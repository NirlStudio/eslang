'use strict'

module.exports = function operators$object ($) {
  var $operators = $.$operators
  var set = $.$set
  var seval = $.$eval
  var symbolValueOf = $.Symbol['value-of']
  var isSymbol = $.Symbol['is-type-of']

  var SymbolIndexer = symbolValueOf(':')

  var SymbolAssign = symbolValueOf('<')
  var SymbolDerive = symbolValueOf('>')

  // (@ prop: value ...)
  function objectCreate ($, clause) {
    var obj = $.object()
    var i = 2
    var length = clause.length
    while (i < length && clause[i] === SymbolIndexer) {
      var key = clause[i - 1]
      if (typeof key === 'string') {
        key = symbolValueOf(key)
      } else if (!isSymbol(key)) {
        break
      }

      i += 1
      set(obj, key, i < length ? seval(clause[i], $) : null)
      i += 2 // next :
    }
    return obj
  }

  // (@ obj < prop: value ...)
  function objectAssign ($, clause) {
    var obj = seval(clause[1], $)
    if (!obj && typeof obj !== 'object' && typeof obj !== 'function') {
      return null
    }

    var i = 4
    var length = clause.length
    while (i < length && clause[i] === SymbolIndexer) {
      var key = clause[i - 1]
      if (typeof key === 'string') {
        key = symbolValueOf(key)
      } else if (!isSymbol(key)) {
        break
      }

      i += 1
      set(obj, key, i < length ? seval(clause[i], $) : null)
      i += 2 // next :
    }
    return obj
  }

  // (@ optional-prototype > prop: value ...).
  function objectDerive ($, clause) {
    var i, prototype
    if (clause[1] === SymbolDerive) {
      i = 3
      prototype = null
    } else {
      i = 4
      prototype = seval(clause[1], $)
      if (typeof prototype !== 'object') {
        return null // non-object cannot derive an object.
      }
    }

    var obj = $.object(prototype)
    var length = clause.length
    while (i < length && clause[i] === SymbolIndexer) {
      var key = clause[i - 1]
      if (typeof key === 'string') {
        key = symbolValueOf(key)
      } else if (!isSymbol(key)) {
        break
      }

      i += 1
      set(obj, key, i < length ? seval(clause[i], $) : null)
      i += 2 // next :
    }
    return obj
  }

  // (@ value ...)
  function arrayCreate ($, clause) {
    var result = []
    var i = 1
    while (i < clause.length) {
      result.push(seval(clause[i], $))
      i += 1
    }
    return result
  }

  $operators['@'] = function ($, clause) {
    var length = clause.length
    if (length > 1) {
      switch (clause[1]) {
        case SymbolIndexer:
          return null
        case SymbolAssign:
          return null
        case SymbolDerive:
          return objectDerive($, clause)
      }
    }
    if (length > 2) {
      switch (clause[2]) {
        case SymbolIndexer:
          return objectCreate($, clause)

        case SymbolAssign:
          return objectAssign($, clause)

        case SymbolDerive:
          return objectDerive($, clause)
      }
    }
    return arrayCreate($, clause)
  }

  // as operators, object and array are the readable version of @
  $operators['object'] = function ($, clause) {
    if (clause.length < 2) {
      return $.object()
    }
    return $operators['@']($, clause)
  }
  // force to create an array
  $operators['array'] = function ($, clause) {
    return arrayCreate($, clause)
  }
}
