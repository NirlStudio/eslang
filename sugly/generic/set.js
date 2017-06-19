'use strict'

function createSetFrom ($void) {
  var thisCall = $void.thisCall

  return function () {
    var collection = new Set()
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      var next = typeof source === 'function'
        ? source : thisCall(source, 'iterate')
      if (typeof next !== 'function') {
        collection.add(source)
        continue
      }
      var item = next()
      while (typeof item !== 'undefined' && item !== null) {
        collection.add(!Array.isArray(item) ? item
          : item.length > 0 ? item[0] : null)
        item = next()
      }
    }
    return collection
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

  // create an empty set.
  link(Type, 'empty', function () {
    return new Set()
  })

  // create a set with unique argument values.
  link(Type, 'of', function () {
    return new Set(Array.prototype.slice.call(arguments))
  })

  // create a set with values from iterable arguments or the argument value
  // itself if it's not iterable.
  link(Type, 'from', createSetFrom($void))

  // Type Indexer
  typeIndexer(Type)

  var proto = Type.proto
  // generate an iterator function to traverse all values in this set.
  link(proto, 'iterate', iterator($void))

  // the current count of values.
  link(proto, 'count', function () {
    return this instanceof Set ? this.size : null
  })

  // override common object's copy-from to copy data only.
  link(proto, ['copy-from', '='], function (source) {
    if (!(this instanceof Set)) {
      return null
    }
    // allow an array as source to enble the type downgrading in encoding.
    if (Array.isArray(source) && source.length > 0) {
      for (var item in source) {
        this.add(item)
      }
    } else if (source instanceof Set) {
      var next = source.entries()
      var cursor
      while ((cursor = next())) {
        this.add(cursor.value[0])
      }
    }
    return this
  })

  // create a shallow copy of this set.
  link(proto, 'copy', function () {
    return this instanceof Set ? new Set(this) : null
  })

  // add values into this set from the argument sets.
  var addFrom = link(proto, '+=', function () {
    if (!(this instanceof Set)) {
      return null
    }
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i]
      if (src instanceof Set) {
        var next = src.entries()
        var cursor
        while ((cursor = next())) {
          this.add(cursor.value[0])
        }
      }
    }
    return this
  })

  // create a new set with the values in this set and argument values.
  link(proto, ['merge', '+'], function () {
    return this instanceof Set ? addFrom.apply(new Set(this), arguments) : null
  })

  // add a new value into this set.
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
  // check if this has an value
  link(proto, 'has', function (value) {
    return this instanceof Set ? this.has(value) : null
  })
  // remove one or more values from this set.
  link(proto, 'remove', function (value) {
    if (!(this instanceof Set)) {
      return null
    }
    var counter = 0
    for (var i = 0; i < arguments.length; i++) {
      counter += this.delete(arguments[i]) ? 1 : 0
    }
    return counter
  })
  // remove all values from this set.
  link(proto, 'clear', function () {
    if (!(this instanceof Set)) {
      return null
    }
    if (typeof this.clear === 'function') {
      this.clear()
    } else {
      for (var item in this) {
        this.delete(item)
      }
    }
    return this
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
      list.push(thisCall(value, 'to-code', ctx))
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
