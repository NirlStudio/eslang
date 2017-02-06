'use strict'

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
      if (typeof iter.next === 'function') {
        while (iter.next()) {
          if (mapFunc) {
            result.push(mapFunc.call(thisArg, iter.value))
          } else {
            result.push(iter.value)
          }
        }
      }
    }
    return result
  }
}

function toCodeAsRoot (array, ctx) {
  analyzeArray(array, ctx)
  ctx.analyzed = true

  // update status for this object.
  var status = ctx.generating(array)
  var code = arrayToCode(array, ctx)
  if (ctx.count() > 0) { // use ctx result
    if (status.key) {
      return ctx.end('(' + status.key + ' += ' + code + ')') // update
    } else {
      return ctx.end(code)
    }
  } else {
    return code // no nested object, return code directly
  }
}

function toCodeAsChild (array, ctx) {
  if (!ctx.analyzed) { // in analyzing
    switch (ctx.analyze(array)) {
      case 0: // not repeated yet.
        return analyzeArray(array, ctx)
      case 1: // repeated once
        return ctx.create(array, '(@)')
      default: // more than once
        return // do nothing
    }
  }

  // generating code
  var status = ctx.generating(array)
  if (!status.key) { // single occurrence
    return arrayToCode(array, ctx)
  }
  if (status.stage === 1) { // repeated first time.
    ctx.update('(' + status.key + ' += ' + arrayToCode(array, ctx) + ')')
  }
  // generated before, so here returns variable name only.
  return status.key
}

function analyzeArray (array, ctx) {
  array.forEach(function analyzeField (value) {
    if (value !== null && (typeof value === 'object' ||
      typeof value === 'function')) {
      ctx.toCode(value)
    }
  })
}

function arrayToCode (array, ctx) {
  var code = ['(@']
  array.forEach(function printItem (value) {
    code.push(ctx.toCode(value, '()'))
  })
  code.push(')')
  return code.join(ctx.asCompat ? ' ' : '\n')
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Array
  var readonly = $void.readonly
  var virtual = $void.virtual
  var copyProto = $void.copyProto

  // create an array with its elements
  readonly(type, 'create', create())

  // create an empty array.
  readonly(type, 'empty', function Array$empty () {
    return []
  })

  // create an array by concat arguments
  readonly(type, 'concat', function Array$of () {
    return arguments.length < 1 ? [] : Array.prototype.concat.apply([], arguments)
  })

  // convert any iterable object to an array.
  readonly(type, 'from', fromSource())

  var proto = type.proto

  // forward the length property.
  virtual(proto, 'length', function array$length () {
    return this.length
  })

  // array element accessors
  virtual(proto, 'get', function array$get (offset) {
    return typeof offset === 'number' && offset >= 0 && offset < this.length
      ? this[offset] : null
  })
  virtual(proto, 'set', function array$set (offset, value) {
    if (typeof offset !== 'number' || offset >= this.length) {
      return null
    }
    return typeof offset === 'number' && offset >= 0 && offset < this.length
      ? (this[offset] = typeof value === 'undefined' ? null : value) : null
  })
  virtual(proto, 'first', function array$first () {
    return this.length > 0 ? this[0] : null
  })
  virtual(proto, 'last', function array$last () {
    return this.length > 0 ? this[this.length - 1] : null
  })

  var verify = Array.isArray.bind(Array)

  // standard array operations to produce a new array
  copyProto(type, Array, verify, {
    // index-based subset generation
    'slice': 'slice',
    'concat': 'concat' /* IE5.5 */
  })

  // override operations for a container.
  // revesed indexer: find offset by value
  copyProto(type, Array, verify, {
    /* CH/FF/SF, IE9+ */
    'indexOf': 'index-of',
    'lastIndexOf': 'last-index-of'
  })

  // array data structure manipulation.
  virtual(proto, 'swap', function array$swap (x, y) {
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
  copyProto(type, Array, verify, {
    /* IE5.5 */
    'splice': 'splice',
    'shift': 'shift',
    'unshift': 'unshift'
  })
  // re-ordering by its values
  copyProto(type, Array, verify, {
    /* CH/FF/SF, IE9+ */
    'reverse': 'reverse',
    'sort': 'sort'
  })
  // use an array as a stack data structure
  copyProto(type, Array, verify, {
    /* IE5.5 */
    'pop': 'pop',
    'push': 'push'
  })

  // generate a new collection by a customized logic.
  // TODO - generalized it to for-in loop or an interace?
  copyProto(type, Array, verify, {
    /* IE9 */
    'map': 'map',
    'filter': 'filter'
  })

  // support comparison operators to test length
  virtual(proto, '>', function array$oprGT (length) {
    return typeof length === 'number' ? this.length > length : false
  })
  virtual(proto, '>=', function array$oprGE (length) {
    return typeof length === 'number' ? this.length >= length : false
  })
  virtual(proto, '<', function array$oprLT (length) {
    return typeof length === 'number' ? this.length < length : false
  })
  virtual(proto, '<=', function array$oprLE (length) {
    return typeof length === 'number' ? this.length <= length : false
  })

  // override copy function
  copyProto(type, Array, verify, {
    'slice': 'copy'
  })

  // override general operators
  copyProto(type, Array, verify, {
    'concat': '+' /* IE5.5 */
  })
  virtual(proto, '+=', function array$oprMerge () {
    Array.prototype.concat.apply(this, arguments)
  })

  // default object persistency & describing logic
  var coding = $void.coding
  readonly(proto, 'to-code', function array$toCode (asCompat) {
    if (!Array.isArray(this)) {
      return '(@)'
    }
    return coding.is(asCompat) ? toCodeAsChild(this, asCompat)
      : toCodeAsRoot(this, coding.start(this, asCompat))
  })
  readonly(proto, 'to-clause', function array$toString (asCompat) {
    if (!Array.isArray(this)) {
      return '()'
    }
    var ctx = coding.start(this, asCompat)
    var code = []
    ctx.decompile(this, code)
    return '(' + code.join(' ') + ')'
  })
  readonly(proto, 'to-program', function array$toString (asCompat) {
    if (!Array.isArray(this)) {
      return '()'
    }
    var ctx = coding.start(this, asCompat)
    var code = ctx.decompile(this)
    return code.join('\n')
  })
  readonly(proto, 'to-string', function array$toString (separator) {
    if (!Array.isArray(this)) {
      return '(@)'
    }
    var items = []
    this.forEach(function printField (value) {
      if (value === null) {
        items.push('null')
      } else if (typeof value !== 'object' || value instanceof Date) {
        items.push(coding.toString(value))
      } else {
        if (value.type && value.type.name) {
          items.push('(' + value.type.name.toLowerCase() + ' )')
        } else {
          items.push('(@:)')
        }
      }
    }, this)
    return items.join(separator || ' ')
  })

  // determine emptiness by array's length
  readonly(proto, 'is-empty', function array$isEmpty () {
    return this.length < 1
  })
  readonly(proto, 'not-empty', function array$notEmpty () {
    return this.length > 0
  })

  // indexer: overridding, interpret number value as offset.
  readonly(proto, ':', function array$indexer (index, value) {
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

  // export to system's prototype
  $void.injectTo(Array, 'type', type)
  $void.injectTo(Array, ':', proto[':'])
}
