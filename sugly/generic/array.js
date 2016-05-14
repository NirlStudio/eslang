'use strict'

var $export = require('../export')

function isTypeOf () {
  return function Array$is_type_of (value) {
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

function equals ($) {
  return function Array$equals (another) {
    if (Object.is(this, another)) {
      return true
    }
    if (!Array.isArray(this) || !Array.isArray(another) || this.length !== another.length) {
      return false
    }
    var length = this.length
    for (var i = 0; i < length; i++) {
      var value = this[i]
      var eq = $.$resolve(value, 'equals')
      if (typeof eq !== 'function' || !eq.call(value, another[i])) {
        return false
      }
    }
    return true
  }
}

function toCode ($) {
  return function Array$to_code (pretty) {
    return $.encode.array(this)
  }
}

function toClause ($) {
  return function Array$to_clause (pretty) {
    return $.encode.clause(this)
  }
}

function toProgram ($) {
  return function Array$to_program (pretty) {
    return $.encode(this)
  }
}

function concat () {
  return function Array$concat () {
    return arguments.length < 1 ? [] : Array.prototype.concat.apply([], arguments)
  }
}

function ofType () {
  return function Array$of (type, length, value) {
    // TODO - to be implemented
    return []
  }
}

function fromSource () {
  return function Array$from (source, mapFunc, thisArg) {
    var result = []
    if (typeof source.iterate === 'function') {
      if (typeof mapFunc !== 'function') {
        mapFunc = null
      }
      if (typeof thisArg === 'undefined' || thisArg === null) {
        thisArg = this
      }
      var iter = source.iterate()
      while (iter && iter.next()) {
        if (mapFunc) {
          result.push(mapFunc.call(thisArg, iter.value))
        } else {
          result.push(iter.value)
        }
      }
    }
    return result
  }
}

function arrayIndexer ($) {
  var resolve = $.Object.class[':']
  return function array$indexer (index, value) {
    if (arguments.length === 1) {
      if (typeof index === 'number') {
        return index < 0 || index >= this.length ? null : this[index]
      } else {
        return resolve.call(this, index)
      }
    } else if (arguments.length > 1) {
      if (typeof index === 'number') {
        return index < 0 || index >= this.length ? null : (this[index] = value)
      } else {
        return resolve.call(this, index, value)
      }
    }
    return null
  }
}

module.exports = function ($) {
  var type = $.Array
  // Array is a native type for its efficiency.
  $export(type, 'is-type-of', isTypeOf())
  // create an array with its elements
  $export(type, 'create', create())

  // create an array by concat arguments
  $export(type, 'concat', concat())

  // TODO - to create a strong-typed array
  $export(type, 'of', ofType())

  // convert any iterable object to an array.
  $export(type, 'from', fromSource())

  var class_ = type.class
  // compare elements one by one by their equivalence logic
  $export(class_, 'equals', equals($))

  // persistency & describing
  $export(class_, 'to-code', toCode($))
  $export(class_, 'to-string', toCode($))
  $export.copy(class_, Array.prototype, {
    /* IE5.5 */
    'join': 'join' // TODO - to remove or override
  })

  // special persistency lgoic according to its literal meaning.
  $export(class_, 'to-clause', toClause($))
  $export(class_, 'to-program', toProgram($))

  // determine emptiness by array's length
  $export(class_, 'is-empty', function () {
    return this.length < 1
  })
  $export(class_, 'not-empty', function () {
    return this.length > 0
  })

  // indexer: overridding, interpret number value as offset.
  $export(class_, ':', arrayIndexer($))

  // standard element accessors
  $export(class_, 'get', function (offset) {
    return typeof offset === 'number' && offset >= 0 && offset < this.length
      ? this[offset] : null
  })
  $export(class_, 'set', function (offset, value) {
    if (typeof offset !== 'number' || offset >= this.length) {
      return null
    }
    return typeof offset === 'number' && offset >= 0 && offset < this.length
      ? (this[offset] = typeof value === 'undefined' ? null : value) : null
  })

  // standard array operations to produce a new array
  $export.copy(class_, Array.prototype, {
    // index-based subset generation
    'slice': 'slice',
    'concat': 'concat' /* IE5.5 */
  })

  // override operations for a container.
  // revesed indexer: find offset by value
  // TODO - override to apply managed equivalence logic
  $export.copy(class_, Array.prototype, {
    /* CH/FF/SF, IE9+ */
    'indexOf': 'index-of',
    'lastIndexOf': 'last-index-of'
  })
  // iterator: iterate all offsets and values
  require('./array-iterator')($)

  // array data structure manipulation.
  $export.copy(class_, Array.prototype, {
    /* IE5.5 */
    'splice': 'splice',
    'shift': 'shift',
    'unshift': 'unshift'
  })
  // re-ordering by its values
  $export.copy(class_, Array.prototype, {
    /* CH/FF/SF, IE9+ */
    'reverse': 'reverse',
    'sort': 'sort'
  })
  // use an array as a stack data structure
  $export.copy(class_, Array.prototype, {
    /* IE5.5 */
    'pop': 'pop',
    'push': 'push'
  })

  // generate a new collection by a customized logic.
  // TODO - generalized it to for-in loop?
  $export.copy(class_, Array.prototype, {
    /* IE9 */
    'map': 'map',
    'filter': 'filter'
  })

  // support general operators
  $export.copy(class_, Array.prototype, {
    'concat': '+' /* IE5.5 */
  })
  $export(class_, '+=', function () {
    for (var i = 0; i < arguments.length; i++) {
      if (Array.isArray(arguments[i])) {
        Array.prototype.push.apply(this, arguments[i])
      } else {
        this.push(arguments[i])
      }
    }
  })
}
