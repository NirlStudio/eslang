'use strict'

module.exports = function assignment ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var symbolAll = $Symbol.all
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator
  var tryToUpdateName = $void.tryToUpdateName

  // 'export' exports a value when called in module context.
  // (export symbol value)
  staticOperator('export', function (space, clause) {
    var clist = clause.$
    if (clist.length < 3) {
      return null
    }
    var sym
    if (space.inop) { // in operator context, export works like a function
      sym = evaluate(clist[1], space)
      var key = typeof sym === 'string' ? sym
        : sym instanceof Symbol$ ? sym.key : null
      return key ? space.export(key,
        space.var(key, tryToUpdateName(evaluate(clist[2], space), key))) : null
    }
    // in normal context, the symbol part can only be a symbol
    sym = clist[1]
    var values = evaluate(clist[2], space)
    var i, names, name, value
    // (export (names ...) obj)
    if (sym instanceof Tuple$) {
      if (values instanceof Object$) {
        names = sym.$
        for (i = 0; i < names.length; i++) {
          name = names[i]
          if (name instanceof Symbol$) {
            name = name.key
            value = values[name]
            space.export(name, space.var(name,
              typeof value === 'undefined' ? null : value
            ))
          }
        }
        return values
      }
      return null
    }
    if (!(sym instanceof Symbol$)) {
      return null
    }
    // (export name value)
    if (sym !== symbolAll) {
      return space.export(sym.key,
        space.var(sym.key, tryToUpdateName(values, sym.key)))
    }
    // (export * obj)
    if (values instanceof Object$) {
      names = Object.getOwnPropertyNames(values)
      for (i = 0; i < names.length; i++) {
        name = names[i]
        value = values[name]
        space.export(name, space.var(name,
          typeof value === 'undefined' ? null : value
        ))
      }
      return values
    }
    return null
  })

  // 'let' update the variable in most recent context.
  // in function: (let var-name value)), or
  //              (let (var-name ...) values), or
  //              (let (field-name ...) object)
  // in operator: (let name-expr value-expr)
  staticOperator('let', createOperatorFor('let'))

  // 'var' explicitly declares a local variable in current function's context.
  // in function: (var var-name value), or
  //              (var (var-name ...) values), or
  //              (var (field-name ...) object)
  // in operator: (var name-expr value-expr)
  staticOperator('var', createOperatorFor('var'))

  // 'local' explicitly declares a context variable in and only in current function's context.
  // in function: (local var-name value), or
  //              (local (var-name ...) values), or
  //              (local (field-name ...) object)
  // in operator: (local name-expr value-expr)
  staticOperator('local', createOperatorFor('cvar'))

  function createOperatorFor (method) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        return null
      }
      var sym = clist[1]
      var values = length < 3 ? null : evaluate(clist[2], space)
      if (space.inop) { // in operator context, let & var works like a function
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
        if (values instanceof Object$) {
          names = Object.getOwnPropertyNames(values)
          for (i = 0; i < names.length; i++) {
            name = names[i]
            value = values[name]
            space[method](name, space.var(name,
              typeof value === 'undefined' ? null : value
            ))
          }
          return values
        }
        return null
      }
      if (!(sym instanceof Tuple$) || sym.$.length < 1) {
        return null // unrecognized pattern
      }
      // (var (symbol ...) value-or-values).
      var syms = sym.$
      if (Array.isArray(values)) { // assign the value one by one.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            space[method](syms[i].key, i < values.length ? values[i] : null)
          }
        }
      } else if (values instanceof Object$) { // read fields into an array.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            name = syms[i].key
            value = values[name]
            space[method](name, typeof value === 'undefined' ? null : value)
          }
        }
      } else { // assign all symbols the same value.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            space[method](syms[i].key, values)
          }
        }
      }
      return values
    }
  }
}
