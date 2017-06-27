'use strict'

module.exports = function bitwise ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $Number = $.number
  var link = $void.link
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var operator = $void.operator
  var staticOperator = $void.staticOperator

  staticOperator('~', function (space, clause) {
    if (clause.$.length > 1) {
      var value = evaluate(clause.$[1], space)
      return typeof value === 'number' ? ~value : ~0
    }
    return ~0
  })

  // bitwise AND and assign it back to the same variable
  link($Number.proto, '&=', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause.$
    if (typeof operant !== 'number' || clist.length < 3) {
      return 0
    }
    var value = evaluate(clist[2], space)
    operant &= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant)
    }
    return operant
  }, $Tuple.operator))

  // bitwise OR and assign it back to the same variable
  link($Number.proto, '|=', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof operant !== 'number') {
      return 0
    }
    var clist = clause.$
    var value = clist.length > 2 ? evaluate(clist[2], space) : 0
    operant |= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant)
    }
    return operant
  }, $Tuple.operator))

  // bitwise XOR and assign it back to the same variable
  link($Number.proto, '^=', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof operant !== 'number') {
      return 0
    }
    var clist = clause.$
    var value = clist.length > 2 ? evaluate(clist[2], space) : 0
    operant ^= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant)
    }
    return operant
  }, $Tuple.operator))

  // bitwise left-shift and assign it back to the same variable
  link($Number.proto, '<<=', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof operant !== 'number') {
      return 0
    }
    var clist = clause.$
    var offset = clist.length > 2 ? evaluate(clist[2], space) : 0
    operant <<= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant)
    }
    return operant
  }, $Tuple.operator))

  // bitwise right-shift and assign it back to the same variable
  link($Number.proto, '>>=', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof operant !== 'number') {
      return 0
    }
    var clist = clause.$
    var offset = clist.length > 2 ? evaluate(clist[2], space) : 0
    operant >>= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant)
    }
    return operant
  }, $Tuple.operator))

  // bitwise zero-fill right-shift and assign it back to the same variable
  link($Number.proto, '>>>=', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    if (typeof operant !== 'number') {
      return 0
    }
    var clist = clause.$
    var offset = clist.length > 2 ? evaluate(clist[2], space) : 0
    operant >>>= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant)
    }
    return operant
  }, $Tuple.operator))
}
