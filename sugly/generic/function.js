'use strict'

var $export = require('../export')

function isTypeOf () {
  return function Function$is_type_of (value) {
    return typeof value === 'function'
  }
}

function equals () {
  return function Function$equals (another) {
    if (typeof this !== 'function' || typeof another !== 'function') {
      return false
    }
    if (this === another) {
      return true
    }
    if (this.$fixedArgs !== another.$fixedArgs) {
      return false
    }
    var thisArgs = this.$params
    var otherArgs = another.$params
    if (!thisArgs || !otherArgs || thisArgs.length !== otherArgs.length) {
      return false
    }
    for (var i = 0; i < thisArgs.length; i++) {
      // only compare names, ignoring default values.
      if (thisArgs[i][0] !== otherArgs[i][0]) {
        return false
      }
    }
    return true
  }
}

function toCode ($) {
  return function Function$to_code () {
    return $.encode.function(this)
  }
}

function toString () {
  return function Function$to_string () {
    return '[Function ' + (this.identityName || this.Name || '(anonymous)') + ']'
  }
}

function functionIndexer () {
  return function function$indexer (index, value) {
    if (typeof index !== 'string') {
      // query parameter
      if (typeof index === 'number' && this.$params && index >= 0 && index < this.$params.length) {
        return [].concat(this.$params[index]) // copy & return parameter & its default value.
      }
      return null
    }
    // get/set a property
    switch (arguments.length) {
      case 1:
        value = this[index]
        return typeof value === 'undefined' ? null : value
      case 2:
        return (this[index] = (typeof value === 'undefined' ? null : value))
      default:
        return null
    }
  }
}

module.exports = function ($) {
  var type = $.Function
  // function will not be taken as an object.
  $export(type, 'is-type-of', isTypeOf())

  var class_ = type.class
  // the equivalence of functions are determined by their parameters.
  $export(class_, 'equals', equals())

  // persistency & describing
  $export(class_, 'to-code', toCode($))
  $export(class_, 'to-string', toString($))

  // normal functions are always taken as a non-empty entity.
  $export(class_, 'is-empty', function () {
    return false
  })
  $export(class_, 'not-empty', function () {
    return true
  })

  // indexer: override to implement setter.
  $export(class_, ':', functionIndexer($))

  // dynamically invoke a function.
  $export.copy(class_, Function.prototype, {
    'apply': 'apply',
    'call': 'call'
  })

  // retrieve function meta information (readonly).
  $export(class_, 'is-fixed-args', function () {
    return this.$fixedArgs === true
  })
  $export(class_, 'get-parameters', function () {
    var names = []
    if (Array.isArray(this.$params)) {
      for (var i = 0; i < this.$params.length; i++) {
        names.push(this.$params[i][0])
      }
    }
    return names
  })

  // access function properties.
  $export(class_, 'get-properties', function () {
    var names = Object.getOwnPropertyNames(this)
    var result = []
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (!name.startsWith('$') && !name.startsWith('__') && name !== 'length') {
        result.push(name)
      }
    }
    return result
  })
  $export(class_, 'has-property', function (name) {
    return typeof this[name] !== 'undefined'
  })
  $export(class_, 'get-property', function (name) {
    return name.startsWith('$') ? null : this[name]
  })
  $export(class_, 'set-property', function (name, value) {
    if (!name.startsWith('$') && !name.startsWith('__') && name !== 'length') {
      return (this[name] = typeof value === 'undefined' ? null : value)
    }
    return null
  })
  $export(class_, 'remove-property', function (name) {
    if (name.startsWith('$') || name.startsWith('__') || name === 'length') {
      return null
    }
    var value
    if (Object.prototype.hasOwnProperty.call(this, name)) {
      value = this[name]
      delete this[name]
    } else {
      value = null
    }
    return value
  })
}
