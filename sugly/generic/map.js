'use strict'

function createMerge ($void) {
  var thisCall = $void.thisCall

  return function () {
    if (!(this instanceof Map)) {
      return null
    }
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      var next = typeof source === 'function'
        ? source : thisCall(source, 'iterate')
      if (typeof next === 'function') {
        var item = next()
        while (typeof item !== 'undefined' && item !== null) {
          if (Array.isArray(item) && item.length > 0) {
            var key = item[0]
            if (item.length > 1) {
              this.set(key, item[1])
            } else {
              if (Array.isArray(key) && key.length > 0) {
                if (key.length > 1) {
                  this.set(key[0], key[1])
                } else {
                  this.set(key, key)
                }
              }
            }
          }
          item = next()
        }
      }
    }
    return this
  }
}

function iterator ($void) {
  return function () {
    if (!(this instanceof Map)) {
      return null
    }
    var iter = this.entries()
    var current = iter.next()
    if (current) {
      current = current.value
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
          current = current.value
        }
        return cur
      }
    }
  }
}

function iteratorKeys ($void) {
  return function () {
    if (!(this instanceof Map)) {
      return null
    }
    var iter = this.keys()
    var current = iter.next()
    if (current) {
      current = [current.value]
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
          current = [current.value]
        }
        return cur
      }
    }
  }
}

function iteratorValues ($void) {
  return function () {
    if (!(this instanceof Map)) {
      return null
    }
    var iter = this.values()
    var current = iter.next()
    if (current) {
      current = [current.value]
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
          current = [current.value]
        }
        return cur
      }
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

  // create an empty array.
  link(Type, 'empty', function () {
    return new Map()
  })

  // create an array with its elements
  link(Type, 'of', function () {
    return new Map(arguments)
  })

  // convert any iterable object to an array.
  link(Type, 'from', function () {
    switch (arguments.length) {
      case 0:
        return new Map()
      case 1:
        return new Map(arguments[0])
      default:
        return merge.apply(new Map(), arguments)
    }
  })

  // Type Indexer
  typeIndexer(Type)

  var proto = Type.proto
  // generate a new object by comine this object and other objects.
  var merge = link(proto, '+=', createMerge($void))

  // to create a shallow copy of this instance with the same type.
  link(proto, 'copy', function () {
    return this instanceof Map ? new Map(this) : null
  })

  // generate an iterator function
  link(proto, 'iterate', iterator($void))

  // generate an iterator function
  link(proto, 'keys', iteratorKeys($void))

  // generate an iterator function
  link(proto, 'values', iteratorValues($void))

  // generate a new object by comine this object and other objects.
  link(proto, ['merge', '+'], function () {
    return this instanceof Map ? merge.apply(new Map(this), arguments) : null
  })

  // forward the length property.
  link(proto, 'count', function () {
    return this instanceof Map ? this.size : null
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
    } else {
      return null
    }
  })
  // check if this has an item
  link(proto, 'has', function (key) {
    return this instanceof Map ? this.has(key) : null
  })
  // remove an entry by key.
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
    var list = [$Symbol.object, $Symbol.pairing, $Symbol.of('map')] // (@:map ...
    var entries = map.entries()
    var item
    while ((item = entries.next())) {
      // key : value
      var key = item[0]
      list.push(thisCall(key, 'to-code', ctx))
      list.push($Symbol.pairing)
      var value = item[1]
      list.push(thisCall(value, 'to-code', ctx))
    }
    return ctx.complete(map, new Tuple$(list))
  }

  // Description
  link(proto, 'to-string', function () {
    if (!(this instanceof Map)) {
      return null
    }
    var list = ['(@:map']
    var entries = this.entries()
    var item
    while ((item = entries.next())) {
      var key = item[0]
      var ktype = typeOf(key)
      var line
      if (ktype === $Object || ktype instanceof ObjectType$) {
        // prevent recursive call.
        line = '(@:' + ktype['to-string']() + ' ... )'
      } else {
        line = thisCall(key, 'to-string')
      }
      line += ' : '
      var value = item[1]
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
