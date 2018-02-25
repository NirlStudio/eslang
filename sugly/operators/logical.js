'use strict'

module.exports = function logical ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var Null = $void.null
  var link = $void.link
  var Space$ = $void.Space
  var operator = $void.operator
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  var not = staticOperator('!', function (space, clause) {
    if (clause.$.length > 1) {
      var value = evaluate(clause.$[1], space)
      return value === false || value === 0 || value === null || typeof value === 'undefined'
    }
    return true
  })

  staticOperator('not', not)

  // global logical AND operator
  link(Null, '&&', operator(function (space, clause, operant) {
    if (!(space instanceof Space$)) {
      return null
    }
    var clist = clause.$
    if (typeof operant === 'undefined' || clist.length < 2) {
      return true // The value of AND is defined as true.
    }
    if (operant === false || operant === null || operant === 0) {
      return false
    }
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (value === false || value === null || value === 0) {
        return false
      }
    }
    return true
  }, $Tuple.operator))

  // global logical OR operator
  link(Null, '||', operator(function (space, clause, operant) {
    var clist = clause && clause.$
    if (typeof operant === 'undefined' || !clist.length || clist.length < 2) {
      return false // the value of OR is defined as False
    }
    if (operant !== false && operant !== null && operant !== 0) {
      return true
    }
    if (!(space instanceof Space$)) {
      return null
    }
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (value !== false && value !== null && value !== 0) {
        return true
      }
    }
    return false
  }, $Tuple.operator))

  // Boolean Test: only for null.
  // - (x ?) returns true or false.
  // - (x ? y) returns x itself or returns y if x is equivalent to false.
  // - (x ? y z) returns y if x is equivalent to true, returns z otherwise.
  link(Null, '?', operator(function (space, clause, operant) {
    var clist = clause && clause.$
    if (!clist || !clist.length || clist.length < 2) {
      return null // invalid call
    }
    if (typeof operant !== 'undefined' && operant !== false && operant !== null && operant !== 0) {
      switch (clist.length) { // true logic
        case 2:
          return true
        case 3:
          return operant
        default:
          return space instanceof Space$ ? evaluate(clist[2], space) : null
      }
    }
    switch (clist.length) { // false logic
      case 2:
        return false
      case 3:
        return space instanceof Space$ ? evaluate(clist[2], space) : null
      default:
        return space instanceof Space$ ? evaluate(clist[3], space) : null
    }
  }, $Tuple.operator))

  // Null Fallback: only for null.
  // (x ?? y z ...) returns the first non-null value after it if x is null.
  link(Null, '??', operator(function (space, clause, operant) {
    if (typeof operant !== 'undefined' && operant !== null) {
      return operant // shortcut
    }
    if (!(space instanceof Space$)) {
      return null // the value of OR is defined as False
    }
    var clist = clause.$
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (value !== null) {
        return value
      }
    }
    return null
  }, $Tuple.operator))
}
