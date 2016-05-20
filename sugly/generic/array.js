'use strict'

var $export = require('../export')

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

function fromSource () {
  return function Array$from (source, mapFunc, thisArg) {
    var result = []
    if (typeof source.iterate === 'function') {
      if (typeof mapFunc !== 'function') {
        mapFunc = null
      }
      if (typeof thisArg === 'undefined' || thisArg === null) {
        thisArg = result
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

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Array

  // prevent inheritance since it's really a native type.
  type.finalized = true

  // create an array with its elements
  $export(type, 'create', create())

  // create an empty array.
  $export(type, 'empty', function Array$empty () {
    return []
  })

  // create an array by concat arguments
  $export(type, 'of', function Array$of () {
    return arguments.length < 1 ? [] : Array.prototype.concat.apply([], arguments)
  })

  // convert any iterable object to an array.
  $export(type, 'from', fromSource())

  var proto = type.proto

  // forward the length property.
  $export(proto, 'length', function array$length () {
    return this.length
  })

  // array element accessors
  $export(proto, 'get', function array$get (offset) {
    return typeof offset === 'number' && offset >= 0 && offset < this.length
      ? this[offset] : null
  })
  $export(proto, 'set', function array$set (offset, value) {
    if (typeof offset !== 'number' || offset >= this.length) {
      return null
    }
    return typeof offset === 'number' && offset >= 0 && offset < this.length
      ? (this[offset] = typeof value === 'undefined' ? null : value) : null
  })
  $export(proto, 'first', function array$first () {
    return this.length > 0 ? this[0] : null
  })
  $export(proto, 'last', function array$last () {
    return this.length > 0 ? this[this.length - 1] : null
  })

  // standard array operations to produce a new array
  $export.copy(proto, Array.prototype, {
    // index-based subset generation
    'slice': 'slice',
    'concat': 'concat' /* IE5.5 */
  })

  // override operations for a container.
  // revesed indexer: find offset by value
  $export.copy(proto, Array.prototype, {
    /* CH/FF/SF, IE9+ */
    'indexOf': 'index-of',
    'lastIndexOf': 'last-index-of'
  })

  // array data structure manipulation.
  $export(proto, 'swap', function array$swap (x, y) {
    var tmp
    var length = this.length
    if (x >= 0 && x < length) {
      tmp = this[x]
      if (y >= 0 && y < length) {
        this[x] = this[y]
        this[y] = tmp
      } else {
        this[x] = null
      }
    } else {
      tmp = null
      if (y >= 0 && y < length) {
        this[y] = null
      }
    }
    return tmp
  })
  $export.copy(proto, Array.prototype, {
    /* IE5.5 */
    'splice': 'splice',
    'shift': 'shift',
    'unshift': 'unshift'
  })
  // re-ordering by its values
  $export.copy(proto, Array.prototype, {
    /* CH/FF/SF, IE9+ */
    'reverse': 'reverse',
    'sort': 'sort'
  })
  // use an array as a stack data structure
  $export.copy(proto, Array.prototype, {
    /* IE5.5 */
    'pop': 'pop',
    'push': 'push'
  })

  // generate a new collection by a customized logic.
  // TODO - generalized it to for-in loop or an interace?
  $export.copy(proto, Array.prototype, {
    /* IE9 */
    'map': 'map',
    'filter': 'filter'
  })

  // support comparison operators to test length
  $export(proto, '>', function array$opr_gt (length) {
    return typeof length === 'number' ? this.length > length : false
  })
  $export(proto, '>=', function array$opr_ge (length) {
    return typeof length === 'number' ? this.length >= length : false
  })
  $export(proto, '<', function array$opr_lt (length) {
    return typeof length === 'number' ? this.length < length : false
  })
  $export(proto, '<=', function array$opr_le (length) {
    return typeof length === 'number' ? this.length <= length : false
  })

  // override copy function
  $export.copy(proto, Array.prototype, {
    'slice': 'copy'
  })

  // override general operators
  $export.copy(proto, Array.prototype, {
    'concat': '+' /* IE5.5 */
  })
  $export(proto, '+=', function array$opr_merge () {
    Array.prototype.concat.apply(this, arguments)
  })

  // persistency & describing
  $export(proto, 'to-code', function array$to_code () {
    return $.encode.array(this)
  })
  $export(proto, 'to-string', function array$to_string (separator) {
    if (typeof separator !== 'string') {
      separator = ' '
    }
    var length = this.length
    var result = ''
    for (var i = 0; i < length; i++) {
      var item = this[i]
      if (i > 0) {
        result += separator
      }
      if (typeof item === 'string') {
        result += item
        continue
      }
      var to_str = $void.get(item, 'to-string')
      result += typeof to_str === 'function' ? to_str.call(item) : '(?)'
    }
    return result
  })

  // special persistency lgoic according to its literal meaning.
  $export(proto, 'to-clause', function array$to_clause (pretty) {
    return $.encode.clause(this)
  })
  $export(proto, 'to-program', function array$to_program (pretty) {
    return $.encode.program(this)
  })

  // determine emptiness by array's length
  $export(proto, 'is-empty', function () {
    return this.length < 1
  })
  $export(proto, 'not-empty', function () {
    return this.length > 0
  })

  // indexer: overridding, interpret number value as offset.
  $export(proto, ':', function array$indexer (index, value) {
    if (arguments.length === 1) {
      if (typeof index === 'number') {
        return index < 0 || index >= this.length ? null : this[index]
      } else {
        return typeof proto[index] === 'undefined' ? null : proto[index]
      }
    } else if (arguments.length > 1) {
      if (typeof index === 'number') {
        return index < 0 || index >= this.length ? null : (this[index] = value)
      } else {
        // prevent give a managed array extra properties
      }
    }
    return null
  })

  // iterator: iterate all offsets and values
  require('./array-iterator')($)

  // export to system's prototype
  $void.injectTo(Array, 'type', type)
  $void.injectTo(Array, ':', proto[':'])
}
