'use strict'

module.exports = function operators$general ($void) {
  var thisCall = $void.thisCall
  var evaluate = $void.evaluate
  var numberValueOf = $void.$.number.of
  var staticOperator = $void.staticOperator

  staticOperator('+', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length > 1) {
      var base = evaluate(clist[1], space)
      return length === 2 ? base : typeof base === 'number'
        ? sum(space, base, clist) : concat(space, base, clist)
    }
    return 0
  })

  function concat (space, str, clist) {
    var length = clist.length
    if (typeof str !== 'string') {
      str = thisCall(str, 'to-string')
    }
    for (var i = 2; i < length; i++) {
      var value = evaluate(clist[i], space)
      str += typeof value === 'string' ? value : thisCall(value, 'to-string')
    }
    return str
  }

  function sum (space, num, clist) {
    var length = clist.length
    for (var i = 2; i < length; i++) {
      var value = evaluate(clist[i], space)
      if (typeof value === 'number') {
        num += value
      } else {
        num += numberValueOf(value)
      }
    }
    return num
  }
}
