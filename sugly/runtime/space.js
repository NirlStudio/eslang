'use strict'

module.exports = function space ($void) {
  var $ = $void.$
  var $Object = $.object
  var Module$ = $void.Module
  var $export = $void.export

  $void.Space = Space$
  function Space$ (local, locals, context, export_) {
    this.local = local
    this.context = context || Object.create(local)
    if (locals) {
      this.locals = locals
    }
    if (export_) {
      this.export = export_
    }
  }
  Space$.prototype = Object.assign(Object.create(null), {
    resolve: function (key) {
      var value = this.context[key]
      return typeof value === 'undefined' ? null : this.context[key]
    },
    var: function (key, value) {
      return (this.local[key] = value)
    },
    let: function (key, value) {
      if (typeof this.local[key] !== 'undefined' || !this.locals) {
        return (this.local[key] = value)
      }
      if (this.locals) {
        for (var i = this.locals.length - 1; i >= 0; i--) {
          if (typeof this.locals[i][key] !== 'undefined') {
            return (this.locals[i][key] = value)
          }
        }
      }
      return (this.local[key] = value)
    },
    export: function (key, value) {
      return this.export && typeof this.export[key] === 'undefined'
        ? $export(this.export, key, (this.local[key] = value)) : null
    }
  })

  $void.createModuleSpace = function (uri) {
    var local = Object.create($)
    var export_ = Object.create($Object.proto)
    local['-module'] = export_['-module'] = new Module$(uri)
    return new Space$(local, null, null, export_)
  }

  $void.createLambdaSpace = function () {
    return new Space$(Object.create($))
  }

  $void.createFunctionSpace = function (parent) {
    return parent
      ? new Space$(Object.create(parent.local),
          parent.locals ? parent.locals.concat(parent.local) : [parent.local])
      : new Space$(Object.create($))
  }

  // customized the behaviour of the space of an operator
  function OperatorSpace$ (parent) {
     // save the real function context for embedded operator calls.
    this.fnContext = parent.fnContext || parent.context
    // ensure the calling function's context is accessible for this operator.
    this.context = Object.create(this.fnContext)
    // use the same local with calling function.
    this.local = parent.local
    if (parent.locals) {
      this.locals = parent.locals
    }
  }
  OperatorSpace$.prototype = Object.assign(Object.create(Space$.prototype), {
    inop: true, // indicates this is an operator space.
    var: function (key, value) {
      // to make explicit vars restricted in the operator's scope.
      return (this.context[key] = value)
    },
    let: function (key, value) {
      // try to update context first, but finally it still fall back to local.
      if (typeof this.context[key] !== 'undefined' &&
          key !== 'operands' && key !== 'operant') {
        return (this.context[key] = value)
      }
      if (typeof this.local[key] !== 'undefined' || !this.locals) {
        return (this.local[key] = value)
      }
      if (this.locals) {
        for (var i = this.locals.length - 1; i >= 0; i--) {
          if (typeof this.locals[i][key] !== 'undefined') {
            return (this.locals[i][key] = value)
          }
        }
      }
      return (this.local[key] = value)
    }
  })

  $void.createOperatorSpace = function (parent) {
    return new OperatorSpace$(parent)
  }
}
