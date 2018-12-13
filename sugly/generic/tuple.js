'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.tuple
  var $Array = $.array
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Range$ = $void.Range
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf

  // the empty value
  var empty = link(Type, 'empty', new Tuple$([]))
  // the empty value for a plain tuple.
  var blank = link(Type, 'blank', new Tuple$([], true))
  // an unknown structure.
  var unknown = link(Type, 'unknown', new Tuple$([$Symbol.etc]))

  // empty operations
  link(Type, 'lambda', new Tuple$([$Symbol.lambda, empty, blank]))
  link(Type, 'function', new Tuple$([$Symbol.function, empty, blank]))
  link(Type, 'operator', new Tuple$([$Symbol.operator, empty, blank]))

  // empty objects
  link(Type, 'array', new Tuple$([$Symbol.literal]))
  link(Type, 'object', new Tuple$([$Symbol.literal, $Symbol.pairing]))
  link(Type, 'class', new Tuple$([
    $Symbol.literal, $Symbol.pairing, sharedSymbolOf('class')
  ]))

  // check if the value can be accepted as an element of a tuple.
  link(Type, 'accepts', function (value) {
    return value instanceof Symbol$ ||
      value instanceof Tuple$ ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value instanceof Range$ ||
      value instanceof Date ||
      value === null ||
      typeof value === 'undefined'
  }, true)

  var atomOf = link(Type, 'atom-of', function (value) {
    return value instanceof Symbol$ ||
      value instanceof Tuple$ ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value instanceof Range$ ||
      value instanceof Date ||
      value === null ? value : typeof value === 'undefined' ? null : unknown
  }, true)

  var append = function () {
    var i = this.length
    this.push.apply(this, arguments)
    for (; i < this.length; i++) {
      this[i] = atomOf(this[i])
    }
    return this
  }

  // create a common tuple (statement) of the argument values.
  link(Type, 'of', function () {
    return arguments.length ? new Tuple$(append.apply([], arguments)) : empty
  }, true)

  // create a plain tuple (code block or list of statements) of the argument values
  link(Type, 'of-plain', function () {
    return arguments.length
      ? new Tuple$(append.apply([], arguments), true) : blank
  }, true)

  // create a tuple by elements from the iterable arguments or the argument
  // values itself if it's not iterable.
  link(Type, 'from', function () {
    return merge.apply(empty, arguments)
  }, true)
  link(Type, 'from-plain', function () {
    return merge.apply(blank, arguments)
  }, true)

  var proto = Type.proto
  // the length of this tuple.
  link(proto, 'length', function () {
    return this.$.length
  })

  // the flag of a plain tuple.
  link(proto, 'is-plain', function () {
    return this.plain === true
  })
  link(proto, 'not-plain', function () {
    return this.plain !== true
  })

  // generate a plain tuple.
  link(proto, 'as-plain', function () {
    return this.plain === true ? this
      : this.$.length < 1 ? blank : new Tuple$(this.$, true)
  })

  // the source map of this tuple.
  link(proto, 'source-map', function () {
    return this.source
  })

  var array = $Array.proto
  // generate an iterator function to traverse all items.
  link(proto, 'iterate', function () {
    return array.iterate.apply(this.$, arguments)
  })

  // make a new copy with all items or some in a range of (begin, begin + count).
  link(proto, 'copy', function (begin, count) {
    var s = array.copy.apply(this.$, arguments)
    return s && s.length > 0
      ? s.length === this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? blank : empty
  })
  // make a new copy with all items or some in a range of (begin, end).
  link(proto, 'slice', function (begin, end) {
    var s = array.slice.apply(this.$, arguments)
    return s && s.length > 0
      ? s.length === this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? blank : empty
  })

  // retrieve the first n element(s).
  link(proto, 'first', function (count) {
    if (typeof count === 'undefined') {
      return array.first.call(this.$)
    }
    var s = array.first.call(this.$, count >> 0)
    return s && s.length > 0
      ? s.length >= this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? blank : empty
  })
  // find the first occurance of a value.
  link(proto, 'first-of', function (value) {
    return array['first-of'].call(this.$, value)
  })
  // retrieve the last n element(s).
  link(proto, 'last', function (count) {
    if (typeof count === 'undefined') {
      return array.last.call(this.$)
    }
    var s = array.last.call(this.$, count >> 0)
    return s && s.length > 0
      ? s.length >= this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? blank : empty
  })
  // find the last occurance of a value.
  link(proto, 'last-of', function (value) {
    return array['last-of'].call(this.$, value)
  })

  // merge this tuple's items and argument values to create a new one.
  link(proto, 'concat', function () {
    var list = append.apply(this.$.slice(0), arguments)
    return list.length > this.$.length ? new Tuple$(list, this.plain) : this
  })

  // merge this tuple and items from the argument tuples or arrays.
  var merge = link(proto, ['merge', '+'], function () {
    var list = this.$.slice(0)
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (Array.isArray(source)) {
        append.apply(list, array.select.call(source)) // compress discrete array.
      } else if (source instanceof Tuple$) {
        list.push.apply(list, source.$)
      } else {
        list.push(atomOf(source))
      }
    }
    return list.length > this.$.length ? new Tuple$(list, this.plain) : this
  })

  // convert to an array, the items will be left as they're.
  link(proto, 'to-array', function () {
    return this.$.slice(0)
  })

  // Equivalence: to be determined by field values.
  var equals = link(proto, ['equals', '=='], function (another) {
    if (this === another) {
      return true
    }
    if (!(another instanceof Tuple$) ||
      this.plain !== another.plain ||
      this.$.length !== another.$.length) {
      return false
    }
    var t$ = this.$
    var a$ = another.$
    for (var i = t$.length - 1; i >= 0; i--) {
      if (!thisCall(t$[i], 'equals', a$[i])) {
        return false
      }
    }
    return true
  })
  link(proto, ['not-equals', '!='], function (another) {
    return !equals.call(this, another)
  })

  // override comparison logic to keep consistent with Equivalence.
  link(proto, 'compare', function (another) {
    return equals.call(this, another) ? 0 : null
  })

  // Emptiness: an empty tuple has no items.
  link(proto, 'is-empty', function () {
    return !(this.$.length > 0)
  })
  link(proto, 'not-empty', function () {
    return this.$.length > 0
  })

  // expand to a string list as an enclosed expression or a series of expressions.
  var encode = function (list, indent, padding) {
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
      if (list.length > 0) {
        list.push(' ')
      }
      if (this.$[0] instanceof Tuple$) {
        encode.call(this.$[0], list, indent, padding)
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
          encode.call(item, list, indent, padding)
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
            encode.call(item, list, indent, padding + indent)
            item.$.length > 1 && list.push(lineBreak)
          }
        } else {
          first ? (first = false) : list.push(' ')
          encode.call(item, list, indent, padding)
        }
      } else {
        first || item === $Symbol.pairing || (
          i === 2 && list[1] === '@' && list[2] === ':'
        ) ? (first = false) : list.push(' ')
        list.push($void.thisCall(item, 'to-string'))
      }
    }
    list.push(')')
    return list
  }

  // Representation: as an enclosed expression or a plain series of expression.
  link(proto, 'to-string', function (indent, padding) {
    return encode.call(this, [], indent, padding).join('')
  })

  // Indexer
  var indexer = link(proto, ':', function (index, end) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key)
        : typeof index !== 'number' ? null
          : typeof end === 'undefined' ? this.$[index]
            : new Tuple$(array.slice.apply(this.$, arguments), this.plain)
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}
