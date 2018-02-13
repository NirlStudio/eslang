'use strict'

module.exports = function object ($void) {
  var $ = $void.$
  var $Object = $.object
  var $Symbol = $.symbol
  var Symbol$ = $void.Symbol
  var ClassType$ = $void.ClassType
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  // (@ value ...)
  function arrayCreate (space, clist, offset) {
    var result = []
    while (offset < clist.length) {
      result.push(evaluate(clist[offset], space))
      offset += 1
    }
    return result
  }

  // (@ symbol: value ...)
  function objectCreate (space, clist, type, offset) {
    var obj = type.empty()
    var length = clist.length
    offset += 1 // moving to the first ':'
    while (offset < length) {
      if (clist[offset] !== $Symbol.pairing) {
        offset += 1; continue // look for next colon
      }
      var name = clist[offset - 1]
      if (name instanceof Symbol$) {
        name = name.key
      } else if (typeof name !== 'string') {
        name = evaluate(name, space)
        if (name instanceof Symbol$) {
          name = name.key
        } else if (typeof name !== 'string') {
          offset += 3; continue // try next pair
        }
      }
      offset += 1
      obj[name] = offset < length ? evaluate(clist[offset], space) : null
      offset += 2 // jump to next ':'
    }
    // activate a typed object
    var activator = type.proto.activator
    if (typeof activator === 'function') {
      activator.call(obj, obj)
    }
    return obj
  }

  staticOperator('@', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) { // (@)
      return []
    }
    if (clist[1] === $Symbol.pairing) {
      if (length < 3) { // (@:)
        return Object.create($Object.proto)
      }
      var type = evaluate(clist[2], space) // (@:type-or-factory )
      return objectCreate(space, clist, type instanceof ClassType$ ? type : $Object, 3)
    }
    if (length > 2 && clist[2] === $Symbol.pairing) { // (@ ? :)
      return objectCreate(space, clist, $Object, 1)
    } else { // as array
      return arrayCreate(space, clist, 1)
    }
  })
}
