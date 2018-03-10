'use strict'

module.exports = function function_ ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var $Lambda = $.lambda
  var $Function = $.function
  var Tuple$ = $void.Tuple
  var evaluate = $void.evaluate
  var signalOf = $void.signalOf
  var lambdaOf = $void.lambdaOf
  var functionOf = $void.functionOf
  var staticOperator = $void.staticOperator

  // create lambda operator
  staticOperator('=', createOperator(lambdaOf, $Lambda.noop))

  // create function operator
  staticOperator('=>', createOperator(functionOf, $Function.noop))

  // call this function by tail-recursion (elimination)
  staticOperator('redo', signalOf('redo'))

  // leave function or module.
  staticOperator('return', signalOf('return'))

  // request to stop the execution of current module.
  staticOperator('exit', signalOf('exit'))

  // create the implementatio
  function createOperator (funcOf, empty) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        return empty
      }
      var params
      var offset
      if (clist[1] === $Symbol.pairing) {
        offset = 2
      } else if (length > 2 && clist[2] === $Symbol.pairing) {
        params = clist[1]
        offset = 3
      } else {
        return funcOf(space, clause, 1)
      }
      // instant evaluation
      if (length <= (offset + 1)) {
        return null // no body
      }
      var func = funcOf(space, clause, offset)
      if (params instanceof Tuple$) {
        var plist = params.$
        if (plist.length < 1) {
          return func()
        }
        var args = []
        for (var i = 0; i < plist.length; i++) {
          args.push(evaluate(plist[i], space))
        }
        return func.apply(null, args)
      } else if (typeof params === 'undefined') {
        return func()
      } else {
        return func(evaluate(params, space))
      }
    }
  }
}
