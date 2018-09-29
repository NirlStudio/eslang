'use strict'

module.exports = function logical ($void) {
  var $ = $void.$
  var $Type = $.type
  var Null = $void.null
  var link = $void.link
  var Space$ = $void.Space
  var operator = $void.operator
  var evaluate = $void.evaluate
  var symbolPairing = $.symbol.pairing
  var staticOperator = $void.staticOperator

  var not = staticOperator('!', function (space, clause) {
    if (clause.$.length > 1) {
      var value = evaluate(clause.$[1], space)
      return value === false || value === null || value === 0 || typeof value === 'undefined'
    }
    return true
  })

  staticOperator('not', not)

  // global logical AND operator
  link(Null, '&&', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return null
    }
    var clist = clause.$
    if (typeof that === 'undefined') {
      return null
    }
    if (that === false || that === null || that === 0) {
      return that
    }
    var value = that
    var i = clist[0] === symbolPairing ? 3 : 2
    for (; i < clist.length; i++) {
      value = evaluate(clist[i], space)
      if (value === false || value === null || value === 0) {
        return value
      }
    }
    return value
  }))

  // global logical OR operator
  link(Null, '||', operator(function (space, clause, that) {
    var clist = clause && clause.$
    if (typeof that === 'undefined') {
      that = null
    }
    if (that !== false && that !== null && that !== 0) {
      return that
    }
    if (!(space instanceof Space$)) {
      return null
    }
    var value = that
    var i = clist[0] === symbolPairing ? 3 : 2
    for (; i < clist.length; i++) {
      value = evaluate(clist[i], space)
      if (value !== false && value !== null && value !== 0) {
        return value
      }
    }
    return value
  }))

  // Boolean Test: only for null.
  // - (x ?) returns true or false.
  // - (x ? y) returns x itself or returns y if x is equivalent to false.
  // - (x ? y z) returns y if x is equivalent to true, returns z otherwise.
  link(Null, '?', operator(function (space, clause, that) {
    var clist = clause && clause.$
    if (!clist || !clist.length || clist.length < 2) {
      return null // invalid call
    }
    var base = clist[0] === symbolPairing ? 3 : 2
    if (typeof that !== 'undefined' && that !== false && that !== null && that !== 0) {
      switch (clist.length - base) { // true logic
        case 0:
          return true
        case 1:
          return that
        default:
          return space instanceof Space$ ? evaluate(clist[base], space) : null
      }
    }
    switch (clist.length - base) { // false logic
      case 0:
        return false
      case 1:
        return space instanceof Space$ ? evaluate(clist[base], space) : null
      default:
        return space instanceof Space$ ? evaluate(clist[base + 1], space) : null
    }
  }))

  // Null Fallback
  // (null ?? y z ...) returns the first non-null value after it if x is null.
  link(Null, '??', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return null
    }
    var clist = clause.$
    var i = clist[0] === symbolPairing ? 3 : 2
    for (; i < clist.length; i++) {
      var value = evaluate(clist[i], space)
      if (value !== null) {
        return value
      }
    }
    return null
  }))
  // (non-null ?? ...) return non-null.
  link($Type.proto, '??', operator(function (space, clause, that) {
    return that
  }))
}
