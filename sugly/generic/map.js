'use strict'

function createMapOf ($void) {
  var thisCall = $void.thisCall

  return function () {
    var map = new Map()
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      var next = typeof source === 'function'
        ? source : thisCall(source, 'iterate')
      if (typeof next === 'function') {
        var item = next()
        while (typeof item !== 'undefined' && item !== null) {
          // looking for key/value pairs
          if (Array.isArray(item) && item.length > 0) {
            var key = item[0]
            if (item.length > 1) {
              map.set(key, item[1])
            } else if (Array.isArray(key) && key.length > 1) {
              map.set(key[0], key[1])
            }
          }
          item = next()
        }
      }
    }
    return map
  }
}

function iterator ($void) {
  return function () {
    if (!(this instanceof Map)) {
      return null
    }
    var iter = this.entries()
    var current = null
    var next = iter.next()
    next = next.value ? next.value : null
    return function (inSitu) {
      if (current !== null && typeof inSitu !== 'undefined' && inSitu !== false &&
          inSitu !== null && inSitu !== 0) {
        return current // cached current value
      }
      if (next === null) {
        return // no more.
      }
      current = next // move to next
      next = iter.next()
      next = next.value ? next.value : null
      return current
    }
  }
}

function iteratorKeys ($void) {
  return function () {
    if (!(this instanceof Map)) {
      return null
    }
    var iter = this.keys()
    var current = null
    var next = iter.next()
    next = next.done ? null : [next.value]
    return function (inSitu) {
      if (current !== null && typeof inSitu !== 'undefined' && inSitu !== false &&
          inSitu !== null && inSitu !== 0) {
        return current // cached current value
      }
      if (next === null) {
        return null // no more.
      }
      current = next // move to next
      next = next.done ? null : [next.value]
      return current
    }
  }
}

function iteratorValues ($void) {
  return function () {
    if (!(this instanceof Map)) {
      return null
    }
    var iter = this.values()
    var current = null
    var next = iter.next()
    next = next.done ? null : [next.value]
    return function (inSitu) {
      if (current !== null && typeof inSitu !== 'undefined' && inSitu !== false &&
          inSitu !== null && inSitu !== 0) {
        return current // cached current value
      }
      if (next === null) {
        return null // no more.
      }
      current = next // move to next
      next = iter.next()
      next = next.done ? null : [next.value]
      return current
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.map
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

  // create an empty map.
  link(Type, 'empty', function () {
    return new Map()
  })

  // create an map of the key/value pairs returned by iterable arguments.
  link(Type, 'of', createMapOf($void))

  // Type Indexer
  typeIndexer(Type)

  var proto = Type.proto
  // generate an iterator function to traverse all entries as [key, value]
  link(proto, 'iterate', iterator($void))

  // generate an iterator function to traverse all keys.
  link(proto, 'keys', iteratorKeys($void))

  // generate an iterator function to traverse all values.
  link(proto, 'values', iteratorValues($void))

  // the current count of entries.
  link(proto, 'count', function () {
    return this instanceof Map ? this.size : null
  })

  // override common object's copy-from to copy data only.
  // allow an array as source to enble the type downgrading in encoding.
  link(proto, ['copy-from', '='], function (source) {
    if (!(this instanceof Map)) {
      return null
    }
    // allow an array as source to enble the type downgrading in encoding.
    if (Array.isArray(source) && source.length > 0) {
      for (var i = 0; i < source.length; i++) {
        var item = source[i]
        if (Array.isArray(item) && item.length > 1) {
          this.set(item[0], item[1])
        }
      }
      this.push.apply(this, source)
    } else if (source instanceof Map) {
      var iter = source.entries()
      var value
      while ((value = iter.next().value)) {
        this.set(value[0], value[1])
      }
    }
    return this
  })

  // to create a shallow copy of this map.
  link(proto, 'copy', function () {
    return this instanceof Map ? new Map(this) : null
  })

  // include the entris from argument maps.
  var includeFrom = link(proto, '+=', function () {
    if (!(this instanceof Map)) {
      return null
    }
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i]
      if (src instanceof Map) {
        var iter = src.entries()
        var value
        while ((value = iter.next().value)) {
          this.set(value[0], value[1])
        }
      }
    }

    return this
  })

  // create a new map with the entries of this map and argument maps.
  link(proto, ['merge', '+'], function () {
    return this instanceof Map
      ? includeFrom.apply(new Map(this), arguments) : null
  })

  // retrieve the value by a key
  link(proto, 'get', function (key) {
    if (this instanceof Map) {
      var value = this.get(key)
      return typeof value === 'undefined' ? null : value
    }
    return null
  })
  // add a new item into this set.
  link(proto, 'set', function (key, value) {
    if (this instanceof Map) {
      var cur = this.get(key)
      this.set(key, value)
      return typeof cur === 'undefined' ? null : cur
    }
    return null
  })
  // check if this has an item
  link(proto, 'has', function (key) {
    return this instanceof Map ? this.has(key) : null
  })
  // remove one or more entries by key or keys.
  link(proto, 'remove', function (key) {
    var counter = 0
    if (this instanceof Map) {
      for (var i = 0; i < arguments.length; i++) {
        counter += this.delete(arguments[i]) ? 1 : 0
      }
      return counter
    } else {
      return null
    }
  })
  // remove all entries from this map.
  link(proto, 'clear', function () {
    if (this instanceof Map) {
      this.clear()
      return this
    } else {
      return null
    }
  })

  // Type Verification
  typeVerifier(Type)

  // determine emptiness by array's length
  link(proto, 'is-empty', function () {
    return this instanceof Map ? this.size < 1 : null
  }, 'not-empty', function () {
    return this instanceof Map ? this.size > 0 : null
  })

  // default object persistency & describing logic
  link(proto, 'to-code', function (ctx) {
    if (!(this instanceof Map)) {
      return null
    }
    // an empty object.
    if (this.size < 1) {
      return $Tuple.of($Symbol.object, $Symbol.pairing, $Symbol.of('map'))
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

  function encode (ctx, map) {
    var pairs = []
    var iter = map.entries()
    var value
    while ((value = iter.next().value)) {
      pairs.push([
        thisCall(value[0], 'to-code', ctx),
        thisCall(value[1], 'to-code', ctx)
      ])
    }
    var list = [$Symbol.object, $Symbol.pairing, $Symbol.of('map')] // (@:map ...
    var i, item
    if (ctx.isReferred(map)) { // nested reference.
      // downgrade to an data array of key/value pairs: (@ (@key value) ...)
      list = [$Symbol.object]
      for (i = 0; i < pairs.length; i++) {
        item = pairs[i]
        list.push(new Tuple$([$Symbol.object, item[0], item[1]]))
      }
    } else { // an instance map object: (@:map key : value ...)
      list = [$Symbol.object, $Symbol.pairing, $Symbol.of('map')]
      for (i = 0; i < pairs.length; i++) {
        item = pairs[i]
        list.push(item[0], $Symbol.pairing, item[1])
      }
    }
    return ctx.complete(map, new Tuple$(list))
  }

  // Description
  link(proto, 'to-string', function () {
    if (!(this instanceof Map)) {
      return null
    }
    var list = ['(@:map']
    var iter = this.entries()
    var pair
    while ((pair = iter.next().value)) {
      var key = pair[0]
      var ktype = typeOf(key)
      var line
      if (ktype === $Object || ktype instanceof ObjectType$) {
        // prevent recursive call.
        line = '(@:' + ktype['to-string']() + ' ... )'
      } else {
        line = thisCall(key, 'to-string')
      }
      line += ' : '
      var value = pair[1]
      var vtype = typeOf(value)
      if (vtype === $Object || vtype instanceof ObjectType$) {
        // prevent recursive call.
        line += '(@:' + vtype['to-string']() + ' ... )'
      } else {
        line += thisCall(value, 'to-string')
      }
      list.push(line)
    }
    list.push(')')
    return list.join('\n')
  })

  // Indexer
  nativeIndexer(Type, Map, Map)
}
