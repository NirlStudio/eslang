'use strict'

module.exports = function arrayIn ($void) {
  var $ = $void.$
  var Type = $.map
  var $Array = $.array
  var $Symbol = $.symbol
  var $Iterator = $.iterator
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall
  var boolValueOf = $void.boolValueOf
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf
  var EncodingContext$ = $void.EncodingContext
  var iterateOfGeneric = $void.iterateOfGeneric

  var symbolComma = $Symbol.comma
  var symbolLiteral = $Symbol.literal
  var symbolPairing = $Symbol.pairing
  var symbolMap = sharedSymbolOf('map')

  var iteratorOfGeneric = $Iterator['of-generic']

  // create an empty map.
  link(Type, 'empty', function () {
    return new Map()
  }, true)

  // create a map with a series of key-value pairs
  link(Type, 'of', function () {
    var map = new Map()
    for (var i = 0, len = arguments.length; i < len; i++) {
      mapAdd.call(map, arguments[i])
    }
    return map
  }, true)

  var mapFrom = link(Type, 'from', function () {
    var map = new Map()
    for (var i = 0, len = arguments.length; i < len; i++) {
      var pairs = arguments[i]
      if (pairs instanceof Map) {
        pairs.forEach(function (v, k) { map.set(k, v) })
      } else {
        if (!(pairs instanceof Set) && !Array.isArray(pairs)) {
          pairs = $Array.from(pairs)
        }
        pairs.forEach(function (pair) {
          mapAdd.call(map, pair)
        })
      }
    }
    return map
  }, true)

  var proto = Type.proto
  link(proto, 'size', function () {
    return this.size
  })

  link(proto, 'has', function (key) {
    return this.has(key)
  })
  link(proto, 'contains', function (keys) { // an array, set of keys, or another map.
    if (keys instanceof Map) {
      keys = keys.keys()
    } else if (!(keys instanceof Set) && !Array.isArray(keys)) {
      keys = $Array.from(keys)
    }
    for (var key of keys) {
      if (!this.has(key)) {
        return false
      }
    }
    return true
  })

  var mapAdd = link(proto, 'add', function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      var pair = arguments[i]
      Array.isArray(pair) ? mapSet.apply(this, pair)
        // this keeps consistent with literal logic.
        : this.set(pair, null)
    }
    return this
  })
  var mapSet = link(proto, 'set', function (key, value) {
    if (arguments.length > 0) {
      this.set(key, value)
    }
    return value
  })
  link(proto, 'get', function (key) {
    return this.get(typeof key === 'undefined' ? null : key)
  })

  link(proto, ['combines-with', 'combines', '+='], function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      var pairs = arguments[i]
      if (pairs instanceof Map) {
        pairs.forEach(function (v, k) {
          this.set(k, v)
        })
      } else {
        if (!(pairs instanceof Set) && !Array.isArray(pairs)) {
          pairs = $Array.from(pairs)
        }
        pairs.forEach(function (pair) {
          mapAdd.call(this, pair)
        })
      }
    }
    return this
  })

  link(proto, ['merge', '+'], function () { // other collections
    var sources = Array.prototype.slice.call(arguments)
    sources.unshift(this)
    return mapFrom.apply(Type, sources)
  })

  link(proto, 'delete', function () { // keys
    for (var i = 0, len = arguments.length; i < len; i++) {
      this.delete(arguments[i])
    }
    return this
  })
  link(proto, 'remove', function () { // other maps, or set/array of keys
    for (var i = 0, len = arguments.length; i < len; i++) {
      var keys = arguments[i]
      if (keys instanceof Map) {
        keys = keys.keys()
      } else if (!(keys instanceof Set) && !Array.isArray(keys)) {
        keys = $Array.from(keys)
      }
      for (var key of keys) {
        this.delete(key)
      }
    }
    return this
  })
  link(proto, 'clear', function () {
    this.clear()
    return this
  })

  link(proto, 'iterate', function () {
    return iterateOfGeneric(this.entries(), true)
  })
  link(proto, 'keys', function () {
    return iteratorOfGeneric(this.keys())
  })
  link(proto, 'values', function () {
    return iteratorOfGeneric(this.values())
  })
  link(proto, 'pairs', function () {
    return iteratorOfGeneric(this.entries())
  })

  link(proto, 'copy', function () {
    return new Map(this)
  })

  // return the amount of elements.
  link(proto, ['count', 'for-each'], function (filter) {
    if (!isApplicable(filter)) {
      return this.size // keep consistency with array.
    }
    var counter = 0
    this.forEach(function (v, k, m) {
      boolValueOf(filter.call(m, k, v)) && counter++
    })
    return counter
  })

  // the equivalence of two maps only considers the keys.
  link(proto, ['equals', '=='], function (another) {
    if (this === another) {
      return true
    }
    if (!(another instanceof Map) || this.size !== another.size) {
      return false
    }
    for (var key of another.keys()) {
      if (!this.has(key)) {
        return false
      }
    }
    return true
  })
  link(proto, ['not-equals', '!='], function (another) {
    if (this === another) {
      return false
    }
    if (!(another instanceof Map) || this.size !== another.size) {
      return true
    }
    for (var key of another.keys()) {
      if (!this.has(key)) {
        return true
      }
    }
    return false
  })

  // the comparison of two maps only counts on keys too.
  link(proto, 'compares-to', function (another) {
    if (this === another) {
      return 0
    }
    if (!(another instanceof Map)) {
      return null
    }
    var reverse = another.size > this.size
    var a = reverse ? another : this
    var b = reverse ? this : another
    for (var key of b.keys()) {
      if (!a.has(key)) {
        return null
      }
    }
    return a.size === b.size ? 0
      : reverse ? -1 : 1
  })

  link(proto, 'is-empty', function () {
    return !(this.size > 0)
  })
  link(proto, 'not-empty', function () {
    return this.size > 0
  })

  var toCode = link(proto, 'to-code', function (printing) {
    var ctx
    if (printing instanceof EncodingContext$) {
      ctx = printing
      var sym = ctx.begin(this)
      if (sym) { return sym }
    } else {
      ctx = new EncodingContext$(this, printing)
    }
    var code = [symbolLiteral, symbolPairing, symbolMap]
    var first = true
    this.forEach(function (value, key) {
      first ? (first = false) : ctx.printing && code.push(symbolComma)
      code.push(ctx.encode(key), symbolPairing, ctx.encode(value))
    })
    return ctx.end(this, Type, new Tuple$(code))
  })

  // Description
  link(proto, 'to-string', function () {
    return thisCall(toCode.call(this, true), 'to-string')
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}
