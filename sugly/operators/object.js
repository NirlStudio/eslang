'use strict'

module.exports = function operators$object ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var Symbol$ = $void.Symbol
  var createObject = $void.$.object

  // (@ prop: value ...)
  function objectCreate (space, clause) {
    var obj = createObject()
    var i = 2
    var length = clause.length
    while (i < length &&
      clause[i] instanceof Symbol$ && clause[i].key === ':') {
      var name = clause[i - 1]
      if (name instanceof Symbol$) {
        name = name.key
      } else if (typeof name !== 'string') {
        break
      }

      i += 1
      obj[name] = i < length ? evaluate(clause[i], space) : null
      i += 2 // next :
    }
    return obj
  }

  // (@ value ...)
  function arrayCreate (space, clause) {
    var result = []
    var i = 1
    while (i < clause.length) {
      result.push(evaluate(clause[i], space))
      i += 1
    }
    return result
  }

  operators['@'] = function (space, clause) {
    var length = clause.length
    if (length > 2 && clause[2] instanceof Symbol$ && clause[2].key === ':') {
      return objectCreate(space, clause)
    } else {
      return arrayCreate(space, clause)
    }
  }

  // as operators, object and array are the readable version of @
  operators['object'] = objectCreate

  // force to create an array
  operators['array'] = arrayCreate
}
