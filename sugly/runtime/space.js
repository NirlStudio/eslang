'use strict'

module.exports = function space ($void) {
  var $ = $void.$
  var $Object = $.object
  var $export = $void.export
  var ownsProperty = $void.ownsProperty

  $void.Space = Space$
  function Space$ (local, locals, context, export_) {
    this.local = local
    this.context = context || Object.create(local)
    if (locals) {
      this.locals = locals
    }
    if (export_) {
      this.exporting = export_
    }
  }
  Space$.prototype = Object.assign(Object.create(null), {
    resolve: function (key) {
      var value = this.context[key]
      return typeof value === 'undefined' ? null : value
    },
    var: function (key, value) {
      return (this.local[key] = value)
    },
    let: function (key, value) {
      if (ownsProperty(this.local, key) || !this.locals) {
        return (this.local[key] = value)
      }
      if (this.locals) {
        for (var i = this.locals.length - 1; i >= 0; i--) {
          if (ownsProperty(this.locals[i], key)) {
            return (this.locals[i][key] = value)
          }
        }
      }
      return (this.local[key] = value)
    },
    export: function (key, value) {
      return this.exporting && typeof this.exporting[key] === 'undefined'
        ? $export(this.exporting, key, (this.local[key] = value)) : null
    }
  })

  $void.createAppSpace = function (uri) {
    var app = Object.create($)
    app['-app'] = uri
    var local = Object.create(app)
    local['-module'] = uri
    var space = new Space$(local, null, null, app)
    space.app = app
    return space
  }

  $void.createModuleSpace = function (uri, appSpace) {
    var app = appSpace && appSpace.app
    var local = Object.create(app || $)
    local['-module'] = uri || ''
    var export_ = Object.create($Object.proto)
    var space = new Space$(local, null, null, export_)
    if (app) {
      space.app = app
    }
    return space
  }

  $void.createLambdaSpace = function (app) {
    if (app) {
      var space = new Space$(Object.create(app))
      space.app = app
      return space
    } else {
      return new Space$(Object.create($))
    }
  }

  $void.createFunctionSpace = function (parent) {
    var space = new Space$(Object.create(parent.local),
      parent.locals ? parent.locals.concat(parent.local) : [parent.local]
    )
    if (parent.app) {
      space.app = parent.app
    }
    return space
  }

  // customized the behaviour of the space of an operator
  $void.OperatorSpace = OperatorSpace$
  function OperatorSpace$ (parent) {
    // operator context is accessible to the context of calling function.
    this.context = Object.create(parent.context)
    // use the same local of calling function.
    this.local = parent.local
    if (parent.locals) {
      this.locals = parent.locals
    }
    // reserve app
    if (parent.app) {
      this.app = parent.app
    }
  }
  OperatorSpace$.prototype = Object.assign(Object.create(Space$.prototype), {
    inop: true, // indicates this is an operator space.
    var: function (key, value) {
      // to make explicit vars restricted in the operator's scope.
      return (this.context[key] = value)
    }
  })

  $void.createOperatorSpace = function (parent) {
    return new OperatorSpace$(parent)
  }
}
