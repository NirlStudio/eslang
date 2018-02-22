'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Range$ = $void.Range
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall

  // the empty value
  var empty = link(Type, 'empty', new Tuple$([]))
  // the empty value for a plain tuple.
  var plain = link(Type, 'plain', new Tuple$([], true))
  // an unkown structure.
  var unknown = link(Type, 'unknown', new Tuple$([$Symbol.etc]))

  // empty operations
  link(Type, 'lambda', new Tuple$([$Symbol.lambda, empty, plain]))
  link(Type, 'function', new Tuple$([$Symbol.function, empty, plain]))
  link(Type, 'operator', new Tuple$([$Symbol.operator, empty, plain]))

  // empty objects
  link(Type, 'array', new Tuple$([$Symbol.object]))
  link(Type, 'object', new Tuple$([$Symbol.object, $Symbol.pairing]))

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
  })

  var atomOf = link(Type, 'atom-of', function (value) {
    return value instanceof Symbol$ ||
      value instanceof Tuple$ ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value instanceof Range$ ||
      value instanceof Date ||
      value === null ? value : typeof value === 'undefined' ? null : unknown
  })

  var append = function () {
    var args = Array.prototype.slice(arguments)
    for (var i = 0; i < args.length; i++) {
      args[i] = atomOf(args[i])
    }
    this.push.apply(this, args)
    return this
  }

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
  link(Type, 'from', function () {
    return merge.apply(empty, arguments)
  })
  link(Type, 'from-plain', function () {
    return merge.apply(plain, arguments)
  })

  var proto = Type.proto
  // the length of this tuple.
  link(proto, 'length', function () {
    return this.$.length
  })

  // the flag of a plain tuple.
  link(proto, 'is-plain', function () {
    return this.plain
  })

  // generate an iterator function to traverse all items.
  link(proto, 'iterate', function () {
    var list = this.$
    var current = null
    var next = 0
    return function (inSitu) {
      return current !== null && inSitu === true ? current
        : next >= list.length ? null : (current = [list[next++]])
    }
  })

  // make a new copy with all items or some in a range.
  link(proto, 'copy', function (begin, end) {
    begin = begin >> 0
    if (begin < 0) {
      begin += this.length
    }
    end = typeof end === 'undefined' ? this.length : end >> 0
    if (end < 0) {
      end += this.length
    }
    var s = this.$.slice(begin, end)
    return s && s.length > 0
      ? s.length === this.$.length ? this : new Tuple$(s, this.plain)
      : this.plain ? plain : empty
  })

  // retrieve the first element.
  link(proto, 'first', function (count) {
    count >>= 0
    return count > 1 ? this.$.slice(0, count) : this.$[0]
  })
  link(proto, 'first-of', function (value) {
    if (typeof value === 'undefined') {
      value = null
    }
    var list = this.$
    for (var i = 0; i < list.length; i++) {
      var v = list[i]
      if (v === value || Object.is(v, value) || thisCall(v, 'equals', value)) {
        return i
      }
    }
    return null
  })

  // retrieve the last element.
  link(proto, 'last', function (count) {
    count >>= 0
    var list = this.$
    return count > 1 ? list.slice(list.length - count, list.length)
      : list[list.length - 1]
  })
  link(proto, 'last-of', function (value) {
    if (typeof value === 'undefined') {
      value = null
    }
    var list = this.$
    for (var i = list.length - 1; i >= 0; i--) {
      var v = list[i]
      if (v === value || Object.is(v, value) || thisCall(v, 'equals', value)) {
        return i
      }
    }
    return null
  })

  // merge this tuple's items and argument values to create a new one.
  link(proto, 'concat', function () {
    var list = this.$.slice(0) // copy a new list
    append.apply(list, arguments) // append & fix
    return list.length > this.$.length ? new Tuple$(list, this.plain) : this
  })

  // merge this tuple and items from the argument tuples.
  var merge = link(proto, ['merge', '+'], function () {
    var list = this.$.slice(0)
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (source instanceof Tuple$) {
        list.push.apply(list, source.$)
        continue
      }
      var next = thisCall(source, 'iterate')
      if (typeof next !== 'function') {
        list.push(atomOf(source))
        continue
      }
      var item = next()
      while (typeof item !== 'undefined' && item !== null) {
        list.push(atomOf(Array.isArray(item) ? item[0] : item))
        item = next()
      }
    }
    return list.length > this.$.length ? new Tuple$(list, this.plain) : this
  })

  // convert to an array, the items will be left as they're.
  link(proto, 'to-array', function () {
    return this.$.slice(0)
  })

  // Emptiness: an empty tuple has no items.
  link(proto, 'is-empty', function () {
    return this.$.length < 1
  }, 'not-empty', function () {
    return !(this.$.length < 1)
  })

  // expand to a string list as an enclosed expression or a series of expressions.
  link(proto, 'to-list', function (list, indent, padding) {
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
        first || item === $Symbol.pairing ? (first = false) : list.push(' ')
        list.push($void.thisCall(item, 'to-string'))
      }
    }
    list.push(')')
    return list
  })

  // Representation: as an enclosed expression or a plain series of expression.
  link(proto, 'to-string', function (indent, padding) {
    return this['to-list']([], indent, padding).join('')
  })

  // Indexer
  link(proto, ':', function (index, length) {
    return typeof index === 'string' ? proto[index]
        : typeof index !== 'number'
          ? index instanceof Symbol$ ? proto[index.key] : null
          : typeof length === 'undefined' ? this.$[index] // getting item
            : this.copy(index, length)
  })
}
