'use strict'

module.exports = function operators$operator ($void) {
  var $Tuple = $void.$.tuple
  var $Symbol = $void.$.symbol
  var Tuple$ = $void.Tuple
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var lambda = $void.lambda
  var evaluate = $void.evaluate
  var operator = $void.operator
  var createOperatorSpace = $void.createOperatorSpace

  $void.operatorOf = function operatorOf (space, clause) {
    // compile code
    var code = [$Symbol.operator]
    var params = formatOperands(clause.$[1])
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(2) || []
    if (body.length > 0) {
      var tbody = new Tuple$(body, true)
      code.push(tbody)
      return operator(createOperator(params, tbody), code)
    } else {
      code.push($Tuple.plain) // empty body
      return lambda(function () { // use an empty function
        return null
      }, code)
    }
  }

  function createOperator (params, tbody) {
    return function (space, clause, operant) {
      if (!(space instanceof Space$)) {
        return null // invalid call.
      }
      var scope = createOperatorSpace(space)
      // populate operands
      var clist = clause.$
      var offset = typeof operant !== 'undefined' ? 2 : 1
      for (var i = 0; i < params.length; i++) {
        var j = i + offset
        scope.context[params[i]] = j < clist.length ? clist[j] : $Symbol.empty
      }
      scope.context['operands'] = clause
      scope.context['operant'] = typeof operant !== 'undefined' ? operant : null
      // execution
      return evaluate(tbody, scope)
    }
  }

  // accepts operand or (operand ...)
  // returns [operand-list, code]
  function formatOperands (params) {
    if (params instanceof Symbol$) {
      return [[params.key], params]
    }
    if (!(params instanceof Tuple$) || params.$.length < 1) {
      return [[], $Tuple.empty]
    }
    var oprs = []
    var code = []
    params = params.$
    for (var i = 0; i < params.length; i++) {
      var param = params[i]
      if (param instanceof Symbol$) {
        oprs.push(param.key)
        code.push(param)
      }
    }
    return oprs.length < 1 ? [[], $Tuple.empty] : [oprs, new Tuple$(code)]
  }
}
