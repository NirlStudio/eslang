'use strict'

module.exports = function operators$logical ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var Null = $void.null
  var link = $void.link
  var Tuple$ = $void.Tuple
  var Space$ = $void.Space
  var operator = $void.operator
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  staticOperator('!', function (space, clause) {
    if (clause.$.length > 1) {
      var value = evaluate(clause.$[1], space)
      return value === false || value === 0 || value === null || typeof value === 'undefined'
    }
    return true
  })

  // global logical AND operators
  link(Null, '&&', operator(function (space, clause, operant) {
    var clist = clause.$
    if (!(space instanceof Space$) || !(clause instanceof Tuple$) ||
        typeof operant === 'undefined' || clist.length < 2) {
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

  // global logical AND operators
  link(Null, '||', operator(function (space, clause, operant) {
    var clist = clause.$
    if (!(space instanceof Space$) || !(clause instanceof Tuple$) ||
        typeof operant === 'undefined' || clist.length < 2) {
      return false // the value of OR is defined as False
    }
    if (operant !== false && operant !== null && operant !== 0) {
      return true
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
    var clist = clause.$
    if (!(space instanceof Space$) || !(clause instanceof Tuple$) ||
        typeof operant === 'undefined' || clist.length < 2) {
      return null // the value of OR is defined as False
    }
    if (operant !== false && operant !== null && operant !== 0) {
      switch (clist.length) { // true logic
        case 2:
          return true
        case 3:
          return operant
        default:
          return evaluate(clist[2], space)
      }
    }
    switch (clist.length) { // false logic
      case 2:
        return false
      case 3:
        return evaluate(clist[2], space)
      default:
        return evaluate(clist[3], space)
    }
  }, $Tuple.operator))

  // Null Fallback: only for null.
  // (x ?? y z ...) returns the first non-null value after it if x is null.
  link(Null, '??', operator(function (space, clause, operant) {
    if (operant !== null) {
      return typeof operant !== 'undefined' ? null : operant // shortcut
    }
    var clist = clause.$
    if (!(space instanceof Space$) || !(clause instanceof Tuple$) ||
        typeof operant === 'undefined' || clist.length < 2) {
      return null // the value of OR is defined as False
    }
    for (var i = 2; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (value !== null) {
        return value
      }
    }
    return null
  }, $Tuple.operator))
}
