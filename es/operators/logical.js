'use strict'

module.exports = function logical ($void) {
  var $ = $void.$
  var $Type = $.type
  var $Bool = $.bool
  var Null = $void.null
  var link = $void.link
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var isFalsy = $void.isFalsy
  var operator = $void.operator
  var evaluate = $void.evaluate
  var thisCall = $void.thisCall
  var staticOperator = $void.staticOperator

  var symbolSubject = $.symbol.subject

  staticOperator('not', staticOperator('!', function (space, clause) {
    if (clause.$.length < 2) {
      return false
    }
    var value = evaluate(clause.$[1], space)
    return value === false || value === null || value === 0
  }, isFalsy), isFalsy)

  // global logical AND operator
  var logicalAnd = link(Null, ['&&', 'and'], operator(function (
    space, clause, that
  ) {
    if (!(space instanceof Space$) || typeof that === 'undefined') {
      return true
    }
    if (that === false || that === null || that === 0) {
      return that
    }

    var clist = clause.$
    var i = clist[0] === symbolSubject ? 3 : 2
    for (var len = clist.length; i < len; i++) {
      that = evaluate(clist[i], space)
      if (that === false || that === null || that === 0) {
        return that
      }
    }
    return that
  }))

  link(Null, '&&=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that === 'undefined') {
      return true
    }

    var result = logicalAnd(space, clause, that)
    if (!Object.is(that, result)) {
      var clist = clause.$
      var sym = clist[clist[0] === symbolSubject ? 1 : 0]
      if (sym instanceof Symbol$) {
        space.let(sym.key, result)
      }
    }
    return result
  }))

  // global logical OR operator
  var logicalOr = link(Null, ['||', 'or'], operator(function (
    space, clause, that
  ) {
    if (!(space instanceof Space$) || typeof that === 'undefined') {
      return false
    }
    if (that !== false && that !== null && that !== 0) {
      return that
    }

    var clist = clause.$
    var i = clist[0] === symbolSubject ? 3 : 2
    for (var len = clist.length; i < len; i++) {
      that = evaluate(clist[i], space)
      if (that !== false && that !== null && that !== 0) {
        return that
      }
    }
    return that
  }))

  link(Null, '||=', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that === 'undefined') {
      return false
    }

    var result = logicalOr(space, clause, that)
    if (!Object.is(that, result)) {
      var clist = clause.$
      var sym = clist[clist[0] === symbolSubject ? 1 : 0]
      if (sym instanceof Symbol$) {
        space.let(sym.key, result)
      }
    }
    return result
  }))

  // Boolean Test.
  // (x ?) - booleanize, returns true or false.
  // (x ? y) - boolean fallback, returns x itself or returns y if x is equivalent to false.
  // (x ? y z) - boolean switch, returns y if x is equivalent to true, returns z otherwise.
  link(Null, '?', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that === 'undefined') {
      return true // defined as true.
    }
    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    if (clist.length < base) {
      return true // defined as true
    }

    if (that !== false && that !== null && that !== 0) {
      switch (clist.length - base) { // true logic
        case 0:
          return true
        case 1:
          return that
        default:
          return evaluate(clist[base], space)
      }
    }

    switch (clist.length - base) { // false logic
      case 0:
        return false
      case 1:
        return evaluate(clist[base], space)
      default:
        return evaluate(clist[base + 1], space)
    }
  }))

  // Emptiness Test.
  // (x ?*) - booleanized emptiness, returns true or false.
  // x ?* y) - emptiness fallback, returns x itself or returns y if x is empty.
  // (x ?* y z) - emptiness switch, returns y if x is not an empty value, returns z otherwise.
  link(Null, '?*', operator(function (space, clause, that) {
    if (!(space instanceof Space$) || typeof that === 'undefined') {
      return true // defined as true.
    }
    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    if (clist.length < base) {
      return true // defined as true
    }

    if (thisCall(that, 'not-empty')) {
      switch (clist.length - base) { // true logic
        case 0:
          return true
        case 1:
          return that
        default:
          return evaluate(clist[base], space)
      }
    }
    switch (clist.length - base) { // false logic
      case 0:
        return false
      case 1:
        return evaluate(clist[base], space)
      default:
        return evaluate(clist[base + 1], space)
    }
  }))

  // Null Test.
  // (x ??) - booleanize null, returns true or false.
  // (x ?? y) - null fallback, returns x itself or returns y if x is null.
  // (null ?? y z ...) returns the first non-null value after it if x is null.
  link(Null, '??', operator(function (space, clause, that) {
    if (!(space instanceof Space$)) {
      return true // defined as true.
    }

    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    if (clist.length < base) {
      return true // defined as true
    }

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
      return true // defined as true.
    }

    var clist = clause.$
    var base = clist[0] === symbolSubject ? 3 : 2
    if (clist.length < base) {
      return true // defined as true
    }

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
    return typeof that === 'boolean' ? !that : true
  }))
  link($Bool.proto, 'succeeds', operator(function (space, clause, that) {
    return typeof that === 'boolean' ? that : false
  }))
}
