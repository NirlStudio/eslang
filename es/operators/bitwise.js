'use strict'

module.exports = function bitwise ($void) {
  var $ = $void.$
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
  }, function (value) {
    return typeof value === 'number' ? ~value : ~0
  })

  // bitwise AND and assign it back to the same variable
  link($Number.proto, '&=', operator(function (space, clause, that) {
    var clist = clause.$
    if (typeof that !== 'number' || clist.length < 3) {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var value = evaluate(clist[2], space)
    that &= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise OR and assign it back to the same variable
  link($Number.proto, '|=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var value = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that |= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise XOR and assign it back to the same variable
  link($Number.proto, '^=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var value = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that ^= typeof value === 'number' ? value : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise left-shift and assign it back to the same variable
  link($Number.proto, '<<=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var offset = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that <<= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise right-shift and assign it back to the same variable
  link($Number.proto, '>>=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var offset = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that >>= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise zero-fill right-shift and assign it back to the same variable
  link($Number.proto, '>>>=', operator(function (space, clause, that) {
    if (typeof that !== 'number') {
      return 0
    }
    if (!(space instanceof Space$)) {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause && clause.$
    var offset = clist && clist.length && clist.length > 2
      ? evaluate(clist[2], space) : 0
    that >>>= typeof offset === 'number' ? offset : 0
    // try to save back
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))
}
