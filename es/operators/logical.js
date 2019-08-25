'use strict'

module.exports = function logical ($void) {
  var $ = $void.$
  var $Type = $.type
  var $Bool = $.bool
  var Null = $void.null
  var link = $void.link
  var Space$ = $void.Space
  var isFalsy = $void.isFalsy
  var operator = $void.operator
  var evaluate = $void.evaluate
  var thisCall = $void.thisCall
  var symbolSubject = $.symbol.subject
  var staticOperator = $void.staticOperator

  staticOperator('not', staticOperator('!', function (space, clause) {
    if (clause.$.length < 2) {
      return false
    }
    var value = evaluate(clause.$[1], space)
    return value === false || value === null || value === 0
  }, isFalsy), isFalsy)

  // global logical AND operator
  link(Null, ['&&', 'and'], operator(function (space, clause, that) {
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
    var i = clist[0] === symbolSubject ? 3 : 2
    for (var len = clist.length; i < len; i++) {
      value = evaluate(clist[i], space)
      if (value === false || value === null || value === 0) {
        return value
      }
    }
    return value
  }))

  // global logical OR operator
  link(Null, ['||', 'or'], operator(function (space, clause, that) {
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
    var i = clist[0] === symbolSubject ? 3 : 2
    for (var len = clist.length; i < len; i++) {
      value = evaluate(clist[i], space)
      if (value !== false && value !== null && value !== 0) {
        return value
      }
    }
    return value
  }))

  // Boolean Test.
  // (x ?) - booleanize, returns true or false.
  // (x ? y) - boolean fallback, returns x itself or returns y if x is equivalent to false.
  // (x ? y z) - boolean switch, returns y if x is equivalent to true, returns z otherwise.
  link(Null, '?', operator(function (space, clause, that) {
    var clist = clause && clause.$
    if (!clist || !clist.length || clist.length < 2) {
      return null // invalid call
    }
    var base = clist[0] === symbolSubject ? 3 : 2
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

  // Emptiness Test.
  // (x ?*) - booleanized emptiness, returns true or false.
  // x ?* y) - emptiness fallback, returns x itself or returns y if x is empty.
  // (x ?* y z) - emptiness switch, returns y if x is not an empty value, returns z otherwise.
  link(Null, '?*', operator(function (space, clause, that) {
    var clist = clause && clause.$
    if (!clist || !clist.length || clist.length < 2) {
      return null // invalid call
    }
    var base = clist[0] === symbolSubject ? 3 : 2
    if (thisCall(that, 'not-empty')) {
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

  // Null Test.
  // (x ??) - booleanize null, returns true or false.
  // (x ?? y) - null fallback, returns x itself or returns y if x is null.
  // (null ?? y z ...) returns the first non-null value after it if x is null.
  link(Null, '??', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return null
    }
    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    switch (clist.length - base) {
      case 0: // booleanize
        return false
      case 1: // fallback
        return evaluate(clist[base], space)
      default: // (falsy) switch
        return evaluate(clist[base + 1], space)
    }
  }))

  // for all non-null values.
  link($Type.proto, '??', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return null
    }
    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    switch (clist.length - base) {
      case 0: // booleanize
        return true
      case 1: // (no) fallback
        return that
      default: // (truthy) switch
        return evaluate(clist[base], space)
    }
  }))

  // Boolean value verification helpers.
  link($Bool.proto, 'fails', operator(function (space, clause, that) {
    return space instanceof Space$ ? !that : null
  }))
  link($Bool.proto, 'succeeds', operator(function (space, clause, that) {
    return space instanceof Space$ ? !!that : null
  }))
}
