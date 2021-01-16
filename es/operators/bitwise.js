'use strict'

module.exports = function bitwise ($void) {
  var $ = $void.$
  var $Number = $.number
  var link = $void.link
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var operator = $void.operator
  var intValueOf = $void.intValueOf
  var numberValueOf = $void.numberValueOf
  var staticOperator = $void.staticOperator

  var symbolSubject = $.symbol.subject

  staticOperator('~', function (space, clause) {
    if (clause.$.length > 1) {
      var value = evaluate(clause.$[1], space)
      return typeof value === 'number' ? ~value : -1
    }
    return -1
  }, function (value) {
    return typeof value === 'number' ? ~value : -1
  })

  // bitwise AND and assign it back to the same variable
  link($Number.proto, '&=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that !== 'number') {
      return 0 // The value of this operator is defined as 0.
    }
    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    var value = clist.length > base ? evaluate(clist[base], space) : 0
    that &= typeof value === 'number' ? value : numberValueOf(value)

    var sym = clist[base - 2]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise OR and assign it back to the same variable
  link($Number.proto, '|=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that !== 'number') {
      return 0 // The value of this operator is defined as 0.
    }

    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    var value = clist.length > base ? evaluate(clist[base], space) : 0
    that |= typeof value === 'number' ? value : numberValueOf(value)

    var sym = clist[base - 2]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise XOR and assign it back to the same variable
  link($Number.proto, '^=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that !== 'number') {
      return 0 // The value of this operator is defined as 0.
    }

    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    var value = clist.length > base ? evaluate(clist[base], space) : 0
    that ^= typeof value === 'number' ? value : numberValueOf(value)

    var sym = clist[base - 2]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise left-shift and assign it back to the same variable
  link($Number.proto, '<<=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that !== 'number') {
      return 0 // The value of this operator is defined as 0.
    }

    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    var offset = clist.length > base ? evaluate(clist[base], space) : 0
    that <<= typeof offset === 'number' ? offset : intValueOf(offset)

    var sym = clist[base - 2]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise right-shift and assign it back to the same variable
  link($Number.proto, '>>=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that !== 'number') {
      return 0 // The value of this operator is defined as 0.
    }

    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    var offset = clist.length > base ? evaluate(clist[base], space) : 0
    that >>= typeof offset === 'number' ? offset : intValueOf(offset)

    var sym = clist[base - 2]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))

  // bitwise zero-fill right-shift and assign it back to the same variable
  link($Number.proto, '>>>=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that !== 'number') {
      return 0 // The value of this operator is defined as 0.
    }

    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    var offset = clist.length > base ? evaluate(clist[base], space) : 0
    that >>>= typeof offset === 'number' ? offset : intValueOf(offset)

    var sym = clist[base - 2]
    if (sym instanceof Symbol$) {
      space.let(sym.key, that)
    }
    return that
  }))
}
