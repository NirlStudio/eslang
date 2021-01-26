'use strict'

module.exports = function assignment ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var symbolAll = $Symbol.all
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var isObject = $void.isObject
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator
  var tryToUpdateName = $void.tryToUpdateName

  // 'export' update the variable in most recent context.
  // in function: (export var-name value)), or
  //              (export * object), or
  //              (export (field-name ...) object), or
  //              (export (var-name ...) values)
  // in operator: (export name-expr value-expr)
  staticOperator('export', createOperatorFor('export'))

  // 'var' explicitly declares a local variable in current function's context.
  // in function: (var var-name value)), or
  //              (var * object), or
  //              (var (field-name ...) object), or
  //              (var (var-name ...) values)
  // in operator: (var name-expr value-expr)
  staticOperator('var', createOperatorFor('var'))

  // the once-assignment variable.
  staticOperator('const', createOperatorFor('const'))

  // 'let' update the variable in most recent context.
  // in function: (let var-name value)), or
  //              (let * object), or
  //              (let (field-name ...) object), or
  //              (let (var-name ...) values)
  // in operator: (let name-expr value-expr)
  staticOperator('let', createOperatorFor('let'))

  // 'local' explicitly declares a context variable in and only in current function's context.
  // in function: (local var-name value)), or
  //              (local * object), or
  //              (local (field-name ...) object), or
  //              (local (var-name ...) values)
  // in operator: (local name-expr value-expr)
  staticOperator('local', createOperatorFor('lvar'))

  // the local version of once-assignment variable.
  staticOperator('locon', createOperatorFor('lconst'))

  function createOperatorFor (method) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        return null
      }
      var sym = clist[1]
      var values = length < 3 ? null : evaluate(clist[2], space)
      if (space.inop && clause.inop) { // in operator context, let & var works like a function
        sym = evaluate(sym, space)
        var key = typeof sym === 'string' ? sym
          : sym instanceof Symbol$ ? sym.key : null
        return !key ? null
          : space[method](key, tryToUpdateName(values, key))
      }
      var i, names, name, value
      // (var symbol value)
      if (sym instanceof Symbol$) {
        if (sym !== symbolAll) {
          return space[method](sym.key, tryToUpdateName(values, sym.key))
        }
        // (var * obj)
        if (isObject(values)) {
          names = Object.getOwnPropertyNames(values)
          for (i = 0; i < names.length; i++) {
            name = names[i]
            value = values[name]
            space[method](name, typeof value === 'undefined' ? null : value)
          }
          return values
        }
        return null
      }
      if (!(sym instanceof Tuple$) || sym.$.length < 1) {
        return null // unrecognized pattern
      }
      // (var (symbol ...) value-or-values).
      var symbols = sym.$
      if (Array.isArray(values)) { // assign the value one by one.
        for (i = 0; i < symbols.length; i++) {
          if (symbols[i] instanceof Symbol$) {
            space[method](symbols[i].key, i < values.length ? values[i] : null)
          }
        }
      } else if (isObject(values)) { // read fields into an array.
        for (i = 0; i < symbols.length; i++) {
          if (symbols[i] instanceof Symbol$) {
            name = symbols[i].key
            value = values[name]
            space[method](name, typeof value === 'undefined' ? null : value)
          }
        }
      } else { // assign all symbols the same value.
        for (i = 0; i < symbols.length; i++) {
          if (symbols[i] instanceof Symbol$) {
            space[method](symbols[i].key, values)
          }
        }
      }
      return values
    }
  }
}
