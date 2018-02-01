'use strict'

module.exports = function object ($void) {
  var $ = $void.$
  var $Object = $.object
  var $Symbol = $.symbol
  var $Operator = $.operator
  var Symbol$ = $void.Symbol
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
    var data = Object.create($Object.proto)
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
      data[name] = offset < length ? evaluate(clist[offset], space) : null
      offset += 2 // jump to next ':'
    }
    // activate the data object
    if (typeof data.activator === 'function' && data.activator.type !== $Operator) {
      var obj = data.activator()
      if (typeof obj !== 'undefined' && obj !== null) {
        // the activator should return a typed entity if it does return anything.
        return obj
      }
    }
    // restore data to its proper type.
    return type === $Object || typeof type.of !== 'function' ||
      type.of.type === $Operator ? data : type.of(data)
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
      return objectCreate(space, clist, type || $Object, 3)
    }
    if (length > 2 && clist[2] === $Symbol.pairing) { // (@ ? :)
      return objectCreate(space, clist, $Object, 1)
    } else { // as array
      return arrayCreate(space, clist, 1)
    }
  })
}
