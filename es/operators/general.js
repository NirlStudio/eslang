'use strict'

module.exports = function general ($void) {
  var $ = $void.$
  var $String = $.string
  var link = $void.link
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var operator = $void.operator
  var thisCall = $void.thisCall
  var evaluate = $void.evaluate
  var numberValueOf = $void.numberValueOf
  var staticOperator = $void.staticOperator

  var symbolSubject = $.symbol.subject

  staticOperator('+', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length > 1) {
      var base = evaluate(clist[1], space)
      return typeof base === 'number'
        ? sum(space, base, clist)
        : concat(space, base, clist)
    }
    return 0
  }, function (base, value) {
    var i = 1
    var len = arguments.length
    if (len < 1) {
      return 0
    }
    if (typeof base === 'number') {
      for (; i < len; i++) {
        value = arguments[i]
        base += typeof value === 'number' ? value : numberValueOf(value)
      }
    } else {
      if (typeof base !== 'string') {
        base = thisCall(base, 'to-string')
      }
      for (; i < len; i++) {
        value = arguments[i]
        base += typeof value === 'string' ? value : thisCall(value, 'to-string')
      }
    }
    return base
  })

  function concat (space, str, clist) {
    var length = clist.length
    if (typeof str !== 'string') {
      str = thisCall(str, 'to-string')
    }
    for (var i = 2; i < length; i++) {
      var value = evaluate(clist[i], space)
      str += typeof value === 'string' ? value : thisCall(value, 'to-string')
    }
    return str
  }

  function sum (space, num, clist) {
    var length = clist.length
    for (var i = 2; i < length; i++) {
      var value = evaluate(clist[i], space)
      num += typeof value === 'number' ? value : numberValueOf(value)
    }
    return num
  }

  // (str += str ... )
  link($String.proto, '+=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that !== 'string') {
      return '' // The value of this operator is defined as 0.
    }

    var clist = clause.$
    var i = clist[0] === symbolSubject ? 3 : 2
    for (var len = clist.length; i < len; i++) {
      var value = evaluate(clist[i], space)
      that += typeof value === 'string' ? value : thisCall(value, 'to-string')
    }

    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // (str -= str ... ) or (str -= num)
  link($String.proto, '-=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that !== 'string') {
      return '' // The value of this operator is defined as 0.
    }

    var clist = clause.$
    var i = clist[0] === symbolSubject ? 3 : 2
    for (var len = clist.length; i < len; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'string') {
        if (that.endsWith(value)) {
          that = that.substring(0, that.length - value.length)
        }
      } else if (typeof value === 'number') {
        that = that.substring(0, that.length - value)
      } else {
        value = thisCall(value, 'to-string')
        if (that.endsWith(value)) {
          that = that.substring(0, that.length - value.length)
        }
      }
    }

    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))
}
