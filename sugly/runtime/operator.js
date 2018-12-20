'use strict'

module.exports = function operators$operator ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Space$ = $void.Space
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var operator = $void.operator
  var symbolPairing = $Symbol.pairing
  var createOperatorSpace = $void.createOperatorSpace
  var createEmptyOperation = $void.createEmptyOperation

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
      return operator(createOperator(params, tbody), new Tuple$(code))
    } else {
      code.push($Tuple.blank) // empty body
      return params.length < 1 ? $.operator.noop
        : operator(createEmptyOperation(), new Tuple$(code))
    }
  }

  function createOperator (params, tbody) {
    return function (space, clause, that) {
      if (!(space instanceof Space$)) {
        return null // invalid call.
      }
      // populate operands
      var clist = clause.$
      var offset = typeof that !== 'undefined' ? 2 : 1
      if (clist[0] === symbolPairing) {
        offset += 1
      }
      var scope = createOperatorSpace(space)
      for (var i = 0; i < params.length; i++) {
        var j = i + offset
        scope.context[params[i]] = j < clist.length ? clist[j] : null
      }
      scope.prepareOp(clause, offset, that)
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
    return oprs.length < 1 ? [[], $Tuple.empty]
      : oprs.length === 1 ? [oprs, code[0]]
        : [oprs, new Tuple$(code)]
  }
}
