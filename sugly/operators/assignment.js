'use strict'

module.exports = function assignment ($void) {
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

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
      return key ? space.export(key, evaluate(clist[2], space)) : null
    }
    // in normal context, the symbol part can only be a symbol
    sym = clist[1]
    return sym instanceof Symbol$
      ? space.export(sym.key, evaluate(clist[2], space)) : null
  })

  // 'let' update the variable in most recent context.
  // in function: (let var-name value)), or
  //              (let (var-name ...) values), or
  //              (let (field-name ...) object)
  // in operator: (let name-expr value-expr)
  staticOperator('let', createOperatorFor('let'))

  // 'var' explicitly declares a local variable in current function's context.
  // in function: (var var-name value), or
  //              (var (@ var-name ...) values), or
  //              (var (field-name ...) object)
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
      if (space.inop) { // in operator context, let & var works like a function
        sym = evaluate(sym, space)
        var key = typeof sym === 'string' ? sym
          : sym instanceof Symbol$ ? sym.key : null
        return key ? space[method](key,
          length < 3 ? null : tryToUpdateName(key, evaluate(clist[2], space)))
          : null
      }
      // (var symbol value)
      if (sym instanceof Symbol$) {
        return (space[method](sym.key, length < 3 ? null
          : tryToUpdateName(sym.key, evaluate(clist[2], space))))
      }
      if (!(sym instanceof Tuple$) || sym.$.length < 1) {
        return null // unrecognized pattern
      }
      // var (symbol ...) value-list)
      var i
      var last = null
      var syms = sym.$
      var values = length > 2 ? evaluate(clist[2], space) : null
      if (Array.isArray(values)) { // assign the value one by one.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            last = space[method](syms[i].key, i < values.length ? values[i] : null)
          }
        }
      } else if (values instanceof Object$) { // read fields into an array.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            var field = syms[i].key
            var value = values[field]
            last = space[method](field, typeof value === 'undefined' ? null : value)
          }
        }
      } else { // assign all symbols the same value.
        for (i = 0; i < syms.length; i++) {
          if (syms[i] instanceof Symbol$) {
            last = space[method](syms[i].key, values)
          }
        }
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
