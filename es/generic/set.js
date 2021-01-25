'use strict'

module.exports = function setIn ($void) {
  var $ = $void.$
  var Type = $.set
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
  var symbolSet = sharedSymbolOf('set')

  var iteratorOfGeneric = $Iterator['of-generic']

  // create an empty array.
  link(Type, 'empty', function () {
    return new Set()
  }, true)

  // create an array of the arguments
  link(Type, 'of', function (x, y, z) {
    return new Set(arguments)
  }, true)

  var setFrom = link(Type, 'from', function (src) {
    return arguments.length < 1 ? new Set()
      // keep the consistent concatenation logic with (array from)
      : new Set($Array.from.apply($Array, arguments))
  }, true)

  var proto = Type.proto
  link(proto, 'size', function () {
    return this.size
  })

  link(proto, 'has', function (value) {
    return this.has(value)
  })
  link(proto, 'contains', function (items) {
    if (!(items instanceof Set) && !Array.isArray(items)) {
      items = $Array.from(items)
    }
    for (var value of items) {
      if (!this.has(value)) {
        return false
      }
    }
    return true
  })

  link(proto, 'add', function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      this.add(arguments[i])
    }
    return this
  })
  link(proto, ['combines-with', 'combines', '+='], function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      var items = arguments[i]
      if (!(items instanceof Set) && !Array.isArray(items)) {
        items = $Array.from(items)
      }
      for (var item of items) {
        this.add(item)
      }
    }
    return this
  })
  link(proto, ['merge', '+'], function () {
    var sources = Array.prototype.slice.call(arguments)
    sources.unshift(this)
    return setFrom.apply(Type, sources)
  })

  // delete separate elements
  link(proto, 'delete', function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      this.delete(arguments[i])
    }
    return this
  })
  // delete elements in other collection(s)
  link(proto, 'remove', function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      var items = arguments[i]
      if (!(items instanceof Set) && !Array.isArray(items)) {
        items = $Array.from(items)
      }
      for (var item of items) {
        this.delete(item)
      }
    }
    return this
  })
  link(proto, 'clear', function () {
    this.clear()
    return this
  })

  link(proto, 'iterate', function () {
    return iterateOfGeneric(this.values())
  })
  link(proto, 'values', function () {
    return iteratorOfGeneric(this.values())
  })

  link(proto, 'copy', function () {
    return new Set(this)
  })

  // return the amount of elements.
  link(proto, ['count', 'for-each'], function (filter) {
    if (!isApplicable(filter)) {
      return this.size // keep consistency with array.
    }
    var counter = 0
    this.forEach(function (v, _, s) {
      boolValueOf(filter.call(s, v)) && counter++
    })
    return counter
  })

  link(proto, ['equals', '=='], function (another) {
    if (this === another) {
      return true
    }
    if (!(another instanceof Set) || this.size !== another.size) {
      return false
    }
    for (var item of another) {
      if (!this.has(item)) {
        return false
      }
    }
    return true
  })
  link(proto, ['not-equals', '!='], function (another) {
    if (this === another) {
      return false
    }
    if (!(another instanceof Set) || this.size !== another.size) {
      return true
    }
    for (var item of another) {
      if (!this.has(item)) {
        return true
      }
    }
    return false
  })

  link(proto, 'compares-to', function (another) {
    if (this === another) {
      return 0
    }
    if (!(another instanceof Set)) {
      return null
    }
    var reverse = another.size > this.size
    var a = reverse ? another : this
    var b = reverse ? this : another
    for (var item of b) {
      if (!a.has(item)) {
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

  // default object persistency & describing logic
  var toCode = link(proto, 'to-code', function (printing) {
    var ctx
    if (printing instanceof EncodingContext$) {
      ctx = printing
      var sym = ctx.begin(this)
      if (sym) { return sym }
    } else {
      ctx = new EncodingContext$(this, printing)
    }
    var code = [symbolLiteral, symbolPairing, symbolSet]
    var first = true
    for (var item of this) {
      first ? (first = false) : ctx.printing && code.push(symbolComma)
      code.push(ctx.encode(item))
    }
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
