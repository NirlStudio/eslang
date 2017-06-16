'use strict'

function createMerge ($void) {
  var thisCall = $void.thisCall

  return function () {
    if (!(this instanceof Set)) {
      return null
    }
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      var next = typeof source === 'function'
        ? source : thisCall(source, 'iterate')
      if (typeof next !== 'function') {
        this.push(source)
        continue
      }
      var item = next()
      while (typeof item !== 'undefined' && item !== null) {
        if (Array.isArray(item)) {
          if (item.length > 0) {
            this.push(item[0])
          }
        } else {
          this.push(item)
        }
        item = next()
      }
    }
    return this
  }
}

function iterator ($void) {
  return function () {
    if (!(this instanceof Set)) {
      return null
    }
    var iter = this.entries()
    var current = iter.next()
    if (current) {
      current = [current.value[0]]
    }
    return function (inSitu) {
      inSitu = typeof inSitu !== 'undefined' && inSitu !== false &&
        inSitu !== null && inSitu !== 0
      if (inSitu || current === null) {
        return current
      } else {
        var cur = current
        current = iter.next()
        if (current) {
          current = [current.value[0]]
        }
        return cur
      }
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.set
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var $Object = $.object
  var link = $void.link
  var typeOf = $void.typeOf
  var Tuple$ = $void.Tuple
  var thisCall = $void.thisCall
  var ObjectType$ = $void.ObjectType
  var CodingContext$ = $void.CodingContext
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var nativeIndexer = $void.nativeIndexer

  // create an empty array.
  link(Type, 'empty', function () {
    return new Set()
  })

  // create an array with its elements
  link(Type, 'of', function () {
    return new Set(arguments)
  })

  // convert any iterable object to an array.
  link(Type, 'from', function () {
    switch (arguments.length) {
      case 0:
        return new Set()
      case 1:
        return new Set(arguments[0])
      default:
        return merge.apply(new Set(), arguments)
    }
  })

  // Type Indexer
  typeIndexer(Type)

  var proto = Type.proto
  // generate a new object by comine this object and other objects.
  var merge = link(proto, '+=', createMerge($void))

  // to create a shallow copy of this instance with the same type.
  link(proto, 'copy', function () {
    return this instanceof Set ? new Set(this) : null
  })

  // generate an iterator function
  link(proto, 'iterate', iterator($void))

  // generate a new object by comine this object and other objects.
  link(proto, ['merge', '+'], function () {
    return Array.isArray(this) ? merge.apply(this.slice(0), arguments) : null
  })

  // forward the length property.
  link(proto, 'count', function () {
    return this instanceof Set ? this.size : null
  })

  // add a new item into this set.
  link(proto, 'add', function (item) {
    if (this instanceof Set) {
      for (var i = 0; i < arguments.length; i++) {
        this.add(arguments[i])
      }
      return this
    } else {
      return null
    }
  })
  // check if this has an item
  link(proto, 'has', function (item) {
    return this instanceof Set ? this.has(item) : null
  })
  link(proto, 'remove', function (item) {
    var counter = 0
    if (this instanceof Set) {
      for (var i = 0; i < arguments.length; i++) {
        counter += this.delete(arguments[i]) ? 1 : 0
      }
      return counter
    } else {
      return null
    }
  })
  link(proto, 'clear', function () {
    if (this instanceof Set) {
      if (typeof this.clear === 'function') {
        this.clear()
      } else {
        for (var item in this) { this.delete(item) }
      }
      return this
    } else {
      return null
    }
  })

  // Type Verification
  typeVerifier(Type)

  // determine emptiness by array's length
  link(proto, 'is-empty', function () {
    return this instanceof Set ? this.size < 1 : null
  }, 'not-empty', function () {
    return this instanceof Set ? this.size > 0 : null
  })

  // default object persistency & describing logic
  link(proto, 'to-code', function (ctx) {
    if (!(this instanceof Set)) {
      return null
    }
    // an empty object.
    if (this.size < 1) {
      return $Tuple.of($Symbol.object, $Symbol.pairing, $Symbol.of('set'))
    }
    // not empty
    if (ctx instanceof CodingContext$) {
      var sym = ctx.touch(this, Type)
      if (sym) {
        return sym
      }
      return encode(ctx, this)
    } else { // as root
      ctx = new CodingContext$()
      ctx.touch(this, Type)
      var code = encode(ctx, this)
      return ctx.final(code)
    }
  })

  function encode (ctx, set) {
    var list = [$Symbol.object, $Symbol.pairing, $Symbol.of('set')] // (@:set ...
    for (var value in set) {
      var vtype = typeOf(value)
      list.push(
        vtype === Type || vtype instanceof ObjectType$
          ? thisCall(value, 'to-code', ctx) : thisCall(value, 'to-code')
      )
    }
    return ctx.complete(set, new Tuple$(list))
  }

  // Description
  link(proto, 'to-string', function (separator) {
    if (!(this instanceof Set)) {
      return null
    }
    var items = ['(@:set']
    for (var value in this) {
      var valueType = typeOf(value)
      if (valueType === $Object || valueType instanceof ObjectType$) {
        // prevent recursive call.
        items.push('(@:' + valueType['to-string']() + ' ... )')
      } else {
        items.push(thisCall(value, 'to-string'))
      }
    }
    items.push(')')
    return items.join(separator || ' ')
  })

  // Indexer
  nativeIndexer(Type, Set, Set)
}
