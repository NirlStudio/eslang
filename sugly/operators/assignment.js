'use strict'

module.exports = function operators$let ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  // 'export' exports a value when called in module context.
  // (export symbol value)
  staticOperator('export', function (space, clause) {
    var clist = clause.$
    if (clist.length >= 3) {
      var sym = space.inop // in operator context, export works like a function
        ? evaluate(clist[1], space) : clist[1]
      return sym instanceof Symbol$
        ? space.export(sym.key, evaluate(clist[2], space)) : null
    }
    return null
  })

  // 'let' update the variable in most recent context.
  // in function: (let var-name value), (let (var-name value) ...)
  //              or (let (@ var-name ...) values)
  // in operator: (let name-expr value-expr)
  staticOperator('let', createOperatorFor('let'))

  // 'var' explicitly declares a local variable in current function's context.
  // in function: (var var-name value), (var (var-name value) ...)
  //              or (var (@ var-name ...) values)
  // in operator: (var name-expr value-expr)
  staticOperator('var', createOperatorFor('var'))

  function createOperatorFor (method) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        return null
      }
      var sym = clist[1]
      if (space.inop) { // in operator context, var works like a function
        sym = evaluate(sym, space)
        return sym instanceof Symbol$
          ? space[method](sym.key, length < 3 ? null
            : tryToUpdateName(sym.key, evaluate(clist[2], space)))
          : null
      }
      // (var symbol value)
      if (sym instanceof Symbol$) {
        return (space[method](sym.key, length < 3 ? null
          : tryToUpdateName(sym.key, evaluate(clist[2], space))))
      }
      var i
      // var (@ symbol ...) value-list)
      if (sym instanceof Tuple$ && sym.$.length > 0 && sym.$[0] === $Symbol.object) {
        var syms = sym.$
        var values = length > 2 ? evaluate(clist[2], space) : null
        if (Array.isArray(values)) { // assign the value one by one.
          for (i = 1; i < syms.length; i++) {
            if (syms[i] instanceof Symbol$) {
              space[method](syms[i].key, i < values.length ? values[i] : null)
            }
          }
        } else { // assign all symbols the same value.
          for (i = 1; i < syms.length; i++) {
            if (syms[i] instanceof Symbol$) {
              space[method](syms[i].key, values)
            }
          }
        }
        return values
      }
      // (var (symbol value) ...)
      var last = null
      for (i = 1; i < length; i++) {
        var pair = clist[i]
        if (pair instanceof Tuple$ && pair.$.length > 0) {
          pair = pair.$
          sym = pair[0]
          if (sym instanceof Symbol$) {
            last = space[method](sym.key, pair.length > 1
              ? tryToUpdateName(sym.key, evaluate(pair[1], space)) : null)
            continue
          }
        }
        last = null
      }
      return last
    }
  }
}

function tryToUpdateName (name, value) {
  if (typeof value === 'function' && !value.name) {
    Object.defineProperty(value, 'name', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: name
    })
  }
  return value
}
