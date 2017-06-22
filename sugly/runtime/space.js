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
      for (var i = this.locals.length - 1; i >= 0; i--) {
        if (typeof this.locals[i][key] !== 'undefined') {
          return (this.locals[i][key] = value)
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

  $void.createOperatorSpace = function (parent) {
    var space = parent
      ? new Space$(parent.local, parent.locals, Object.create(parent.context))
      : new Space$(Object.create($))
    space.inop = true
    return space
  }
}
