
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
    var index = 0
    return function (inSitu) {
      return (index >= list.length) ? null
        : typeof inSitu !== 'undefined' && inSitu !== false && inSitu !== null && inSitu !== 0
          ? [list[index]] : [list[index++]]
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
  var Integer$ = $void.Integer
  var link = $void.link
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var createProtoIndexer = $void.createProtoIndexer

  // the empty value
  var empty = link(Type, 'empty', new Tuple$([]))
  // a empty value for plain tuple.
  link(Type, 'plain', new Tuple$([], true))

  // a shared value to indicate a unkown structure.
  link(Type, 'unknown', new Tuple$([$Symbol.etc]))

  // empty operations
  link(Type, 'lambda', new Tuple$([$Symbol.lambda, empty]))
  link(Type, 'function', new Tuple$([$Symbol.function, empty]))
  link(Type, 'operator', new Tuple$([$Symbol.operator, empty]))

  // empty objects
  link(Type, 'array', new Tuple$([$Symbol.object]))
  link(Type, 'object', new Tuple$([$Symbol.object, $Symbol.pairing]))

  // check if the value can be accepted as an element of a tuple.
  var accepts = link(Type, 'accepts', function (value) {
    return value === null ||
      typeof value === 'boolean' ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      value instanceof Integer$ ||
      value instanceof Symbol$ ||
      value instanceof Tuple$ ||
      value instanceof Range$ ||
      value instanceof Date ||
      typeof value === 'undefined'
  })

  var append = createAppend($void, empty)

  // create a common tuple (statement) of the argument values.
  link(Type, 'of', function () {
    var list = append.apply([], arguments)
    return new Tuple$(list)
  })

  // create a plain tuple (code block or list of statements) of the argument values
  link(Type, 'of-plain', function () {
    var list = append.apply([], arguments)
    return new Tuple$(list, true)
  })

  // create a tuple by elements from the iterable arguments or the argument
  // values itself if it's not iterable.
  link(Type, 'from', createTupleFrom($void, true, accepts, empty))

  typeIndexer(Type)

  var proto = Type.proto
  // generate an iterator function to traverse all items.
  link(proto, 'iterate', iterator($void))

  // return the length of this tuple.
  link(proto, 'length', function () {
    return this instanceof Tuple$ ? this.$.length : null
  })

  // make a new copy with all items or some in a range.
  link(proto, 'copy', function (begin, end) {
    if (this instanceof Tuple$) {
      var s = this.$.slice(begin, end)
      return s && s.length > 0 ? new Tuple$(s, this.plain) : empty
    }
    return null
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
    return new Tuple$(list, this.plain)
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
    return new Tuple$(list, this.plain)
  })

  // convert to an array, the items will be left as they're.
  link(proto, 'to-array', function () {
    return this instanceof Tuple$ ? this.$.slice(0) : null
  })

  // Type Verification
  typeVerifier(Type)

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
  link(proto, 'to-list', function (indent, list) {
    if (!(this instanceof Tuple$)) {
      return null
    }
    if (!Array.isArray(list)) {
      list = []
    }
    var hasIndent = typeof indent === 'string'
    if (this.plain) {
      this.$.forEach(function (item) {
        hasIndent ? list.push('\n', indent) : list.push('\n')
        if (item instanceof Tuple$) {
          item['to-list'](hasIndent ? indent + '  ' : indent, list)
        } else {
          list.push($void.thisCall(item, 'to-string'))
        }
      })
    } else {
      list.push('(')
      this.$.forEach(function (item) {
        if (item instanceof Tuple$) {
          if (item.plain) {
            if (item.$.length > 0) {
              item['to-list'](hasIndent ? indent + '  ' : indent, list)
              list.push('\n', indent)
            }
          } else {
            item['to-list'](hasIndent ? indent : indent, list)
          }
        } else {
          list.push($void.thisCall(item, 'to-string'))
        }
      })
      list.push(')')
    }
    return list
  })

  // Representation: as an enclosed expression or a plain series of expression.
  link(proto, 'to-string', function (indent) {
    return this instanceof Tuple$
      ? this['to-list'](indent).join('') : null
  })

  // Indexer
  var protoIndexer = createProtoIndexer(Type)
  link(proto, ':', function (index, length) {
    if (!(this instanceof Tuple$)) {
      return this === proto ? protoIndexer(index, length) : null
    }
    if (typeof this !== 'string') {
      return null
    }
    // getting properties
    if (typeof index === 'string') {
      return index === ':' ? null
        : index === 'type' ? Type // fake field
          : index === 'plain' ? this.plain // expose length
            : typeof proto[index] === 'undefined' ? null : proto[index]
    }
    // read items
    if (index instanceof Integer$) {
      index = index.number
    }
    if (typeof index === 'number') {
      index = Math.trunc(index)
      if (length instanceof Integer$) {
        length = Math.trunc(length.number)
      }
      var list = this.$
      return typeof length === 'number' && length > 0
        ? new Tuple$(list.slice(index, index + length)) // slice to create a new tuple.
        : index >= 0 && index < list.length ? list[index] : null // get an item.
    }
    return null
  })
}
