'use strict'

module.exports = function operators$arithmetic ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $Number = $.number
  var link = $void.link
  var Tuple$ = $void.Tuple
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var operator = $void.operator
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  staticOperator('++', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) {
      return 1
    }
    var sym = clist[1]
    if (sym instanceof Symbol$) { // (++ symbol)
      var value = space.resolve(sym.key)
      return space.let(sym.key, typeof value === 'number' ? value + 1 : 1)
    }
    // as a normal plus-one operation
    sym = evaluate(sym, space)
    return typeof sym === 'number' ? sym + 1 : 1
  })

  staticOperator('--', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) {
      return -1
    }
    var sym = clist[1]
    if (sym instanceof Symbol$) { // (-- symbol)
      var value = space.resolve(sym.key)
      return space.let(sym.key, typeof value === 'number' ? value - 1 : -1)
    }
    // as a normal minus-one operation
    sym = evaluate(sym, space)
    return typeof sym === 'number' ? sym - 1 : -1
  })

  // increment a value by one and assign it back to the same variable
  link($Number.proto, '++', operator(function (space, clause, operant) {
    var clist = clause.$
    if (!(space instanceof Space$) || !(clause instanceof Tuple$) ||
        typeof operant !== 'number' || clist.length < 2) {
      return 0 // The value of this operator is defined as 0.
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant + 1)
    }
    return operant
  }, $Tuple.operator))

  // increment a value by one and assign it back to the same variable
  link($Number.proto, '--', operator(function (space, clause, operant) {
    var clist = clause.$
    if (!(space instanceof Space$) || !(clause instanceof Tuple$) ||
        typeof operant !== 'number' || clist.length < 2) {
      return 0 // The value of this operator is defined as 0.
    }
    var sym = clist[0]
    if (sym instanceof Symbol$) {
      space.let(sym.key, operant - 1)
    }
    return operant
  }, $Tuple.operator))
}
