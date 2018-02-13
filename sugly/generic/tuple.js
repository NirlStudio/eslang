
'use strict'

function createAppend (accepts, empty) {
  return function append () {
    var offset = this.length
    // apend arguments
    Array.prototype.push.apply(this, arguments)
    // fix invalid values
    for (var i = offset; i < this.length; i++) {
      if (!accepts(this[i])) {
        // replace invalid value to an empty tuple since it's not a null.
        this[i] = empty
      } else if (typeof this[i] === 'undefined') {
        this[i] = null
      }
    }
    return this
  }
}

function createTupleFrom ($void, accepts, empty) {
  var Tuple$ = $void.Tuple
  var thisCall = $void.thisCall

  return function () {
    var list = []
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (source instanceof Tuple$) {
        Array.prototype.push.apply(list, source.$)
        continue
      }
      var next = typeof source === 'function' ? source : thisCall(source, 'iterate')
      if (typeof next !== 'function') {
        continue
      }
      var item = next()
      while (typeof item !== 'undefined' && item !== null) {
        var value = !Array.isArray(item) ? item
          : item.length > 0 ? item[0] : null
        if (!accepts(list[i])) {
          value = empty // replace invalid value to an empty tuple.
        } else if (typeof list[i] === 'undefined') {
          value = null
        }
        list.push(value)
        item = next()
      }
    }
    return list.length > 0 ? new Tuple$(list, empty.plain) : empty
  }
}

function iterator ($void) {
  var Tuple$ = $void.Tuple
  return function () {
    if (!(this instanceof Tuple$)) {
      return null
    }
    var list = this.$
    var current = null
    var next = 0
    return function (inSitu) {
      return current !== null && typeof inSitu !== 'undefined' &&
        inSitu !== false && inSitu !== null && inSitu !== 0 ? list[current]
        : (next >= list.length) ? null : [list[(current = next++)]]
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Range$ = $void.Range
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall
  var initializeType = $void.initializeType
  var protoIndexer = $void.protoIndexer

  // the empty value
  var empty = initializeType(Type, new Tuple$([]))
  // a empty value for plain tuple.
  var plain = link(Type, 'plain', new Tuple$([], true))

  // a shared value to indicate a unkown structure.
  link(Type, 'unknown', new Tuple$([$Symbol.etc]))

  // empty operations
  link(Type, 'lambda', new Tuple$([$Symbol.lambda, empty, plain]))
  link(Type, 'function', new Tuple$([$Symbol.function, empty, plain]))
  link(Type, 'operator', new Tuple$([$Symbol.operator, empty, plain]))

  // empty objects
  link(Type, 'array', new Tuple$([$Symbol.object]))
  link(Type, 'object', new Tuple$([$Symbol.object, $Symbol.pairing]))

  // check if the value can be accepted as an element of a tuple.
  var accepts = link(Type, 'accepts', function (value) {
    return value === null ||
      typeof value === 'boolean' ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      value instanceof Symbol$ ||
      value instanceof Tuple$ ||
      value instanceof Range$ ||
      value instanceof Date ||
      typeof value === 'undefined'
  })

  var append = createAppend(accepts, empty)

  // create a common tuple (statement) of the argument values.
  link(Type, 'of', function () {
    return new Tuple$(append.apply([], arguments))
  })

  // create a plain tuple (code block or list of statements) of the argument values
  link(Type, 'of-plain', function () {
    return new Tuple$(append.apply([], arguments), true)
  })

  // create a tuple by elements from the iterable arguments or the argument
  // values itself if it's not iterable.
  link(Type, 'from', createTupleFrom($void, accepts, empty))

  var proto = Type.proto
  // generate an iterator function to traverse all items.
  link(proto, 'iterate', iterator($void))

  // make a new copy with all items or some in a range.
  link(proto, 'copy', function (begin, end) {
    if (!(this instanceof Tuple$)) {
      return null
    }
    if (typeof begin !== 'number') {
      begin = 0
    } else if (begin < 0) {
      begin += this.$.length
      if (begin < 0) {
        begin = 0
      }
    }
    if (typeof end !== 'number') {
      end = this.$.length
    } else if (end < 0) {
      end += this.$.length
      if (end < 0) {
        end = 0
      }
    } else if (end > this.$.length) {
      end = this.$.length
    }
    var s = this.$.slice(begin, end)
    if (s.length === this.$.length) {
      return this // a full copy returns the same tuple since it's readonly.
    }
    return s && s.length > 0
      ? s.length === this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? plain : empty
  })

  // retrieve the first element.
  link(proto, 'first', function () {
    return this instanceof Tuple$ && this.$.length > 0 ? this.$[0] : null
  })

  // retrieve the last element.
  link(proto, 'last', function () {
    return this instanceof Tuple$ && this.$.length > 0
      ? this.$[this.$.length - 1] : null
  })

  // merge this tuple's items and argument values to create a new one.
  link(proto, 'concat', function () {
    if (!(this instanceof Tuple$)) {
      return null
    }
    var list = this.$.slice(0) // copy a new list
    append.apply(list, arguments) // append & fix
    return list.length > this.$.length ? new Tuple$(list, this.plain) : this
  })

  // merge this tuple and items from the argument tuples.
  link(proto, ['merge', '+'], function () {
    if (!(this instanceof Tuple$)) {
      return null
    }
    var list = this.$.slice(0)
    for (var i = 0; i < arguments.length; i++) {
      var t = arguments[i]
      if (t instanceof Tuple$) {
        Array.prototype.push.apply(list, t.$)
      }
    }
    return list.length > this.$.length ? new Tuple$(list, this.plain) : this
  })

  // convert to an array, the items will be left as they're.
  link(proto, 'to-array', function () {
    return this instanceof Tuple$ ? this.$.slice(0) : null
  })

  // Emptiness: an empty tuple has no items.
  link(proto, 'is-empty', function () {
    return this instanceof Tuple$ ? this.$.length < 1 : null
  }, 'not-empty', function () {
    return this instanceof Tuple$ ? this.$.length > 0 : null
  })

  // Encoding
  link(proto, 'to-code', function () {
    return this instanceof Tuple$ ? this : null
  })

  // expand to a string list as an enclosed expression or a series of expressions.
  link(proto, 'to-list', function (list, indent, padding) {
    if (!(this instanceof Tuple$)) {
      return null
    }
    if (!Array.isArray(list)) {
      list = []
    }
    if (typeof indent !== 'string') {
      indent = '  '
    }
    if (typeof padding !== 'string') {
      padding = ''
    }
    if (this.plain && this.$.length === 1) { // unwrap a container block
      if (this.$[0] instanceof Tuple$) {
        this.$[0]['to-list'](list, indent, padding)
      } else {
        list.push(thisCall(this.$[0], 'to-string'))
      }
      return list
    }

    var i, item
    var lineBreak = '\n' + padding
    if (this.plain) {
      for (i = 0; i < this.$.length; i++) {
        list.push(lineBreak)
        item = this.$[i]
        if (item instanceof Tuple$) {
          item['to-list'](list, indent, padding)
        } else {
          list.push(thisCall(item, 'to-string'))
        }
      }
      return list
    }

    list.push('(')
    var first = true
    for (i = 0; i < this.$.length; i++) {
      item = this.$[i]
      if (item instanceof Tuple$) {
        if (item.plain) {
          if (item.$.length > 0) {
            item['to-list'](list, indent, padding + indent)
            list.push(lineBreak)
          }
        } else {
          first ? (first = false) : list.push(' ')
          item['to-list'](list, indent, padding)
        }
      } else {
        first ? (first = false) : list.push(' ')
        list.push($void.thisCall(item, 'to-string'))
      }
    }
    list.push(')')
    return list
  })

  // Representation: as an enclosed expression or a plain series of expression.
  link(proto, 'to-string', function (indent, padding) {
    return this instanceof Tuple$
      ? this['to-list']([], indent, padding).join('')
      : this === proto ? '(tuple proto)' : null
  })

  // Indexer
  protoIndexer(Type, function (index, length) {
    if (!(this instanceof Tuple$)) {
      return null
    }
    // getting properties
    if (typeof index === 'string') {
      return index === 'length' ? this.$.length
        : index === 'plain' ? this.plain : proto[index]
    }
    // read items
    if (typeof index !== 'number') {
      return null
    }
    // use the same behaviour of string.
    index = Math.trunc(index)
    var list = this.$
    if (index < 0) {
      index += list.length
      if (index < 0) {
        index = 0
      }
    } else if (index >= list.length) {
      return this.plain ? plain : empty
    }
    if (typeof length !== 'number') {
      length = 1
    } else if (length <= 0) {
      return this.plain ? plain : empty
    }
    if (index + length > list.length) {
      length = list.length - index
    }
    var l = list.slice(index, index + length)
    return l.length === list.length ? this
      : l.length < 1 ? this.plain ? plain : empty
        : new Tuple$(l, this.plain)
  })
}
