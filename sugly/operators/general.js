'use strict'

module.exports = function general ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $String = $.string
  var link = $void.link
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var operator = $void.operator
  var thisCall = $void.thisCall
  var evaluate = $void.evaluate
  var numberValueOf = $.number.of
  var staticOperator = $void.staticOperator

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
      if (typeof value === 'number') {
        num += value
      } else {
        num += numberValueOf(value)
      }
    }
    return num
  }

  // (str += str ... )
  link($String.proto, '+=', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof operant !== 'string') {
      operant = ''
    }
    var clist = clause && clause.$ && clause.$.length ? clause.$ : []
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'string') {
        operant += value
      } else {
        operant += thisCall(value, 'to-string')
      }
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant)
    }
    return operant
  }, $Tuple.operator))

  // (str -= str ... ) or (str -= num)
  link($String.proto, '-=', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof operant !== 'string') {
      return null
    }
    if (operant.length < 1) {
      return operant
    }
    var clist = clause && clause.$ && clause.$.length ? clause.$ : []
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'string') {
        if (operant.endsWith(value)) {
          operant = operant.substring(0, operant.length - value.length)
        }
      } else if (typeof value === 'number') {
        operant = operant.substring(0, operant.length - value)
      } else {
        value = thisCall(value, 'to-string')
        if (operant.endsWith(value)) {
          operant = operant.substring(0, operant.length - value.length)
        }
      }
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant)
    }
    return operant
  }, $Tuple.operator))
}
