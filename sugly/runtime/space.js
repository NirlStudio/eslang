'use strict'

module.exports = function space ($void) {
  var $ = $void.$
  var $Object = $.object
  var ClassInst$ = $void.ClassInst
  var isObject = $void.isObject
  var indexerOf = $void.indexerOf
  var ownsProperty = $void.ownsProperty

  // shared empty array
  var EmptyArray = Object.freeze && Object.freeze([])

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
      if (typeof value !== 'undefined') {
        return value
      }
      var this_ = this.context.this
      return typeof this_ === 'undefined' || this_ === null ? null
        : indexerOf(this_).call(this_, key)
    },
    var: function (key, value) {
      return (this.local[key] = value)
    },
    lvar: function (key, value) {
      return (this.context[key] = value)
    },
    let: function (key, value) {
      if (ownsProperty(this.local, key)) {
        return (this.local[key] = value)
      }
      if (this.locals) {
        for (var i = this.locals.length - 1; i >= 0; i--) {
          if (ownsProperty(this.locals[i], key)) {
            return (this.locals[i][key] = value)
          }
        }
      }
      var this_ = this.context.this
      if (isObject(this_) && (ownsProperty(this_, key) || (
        (this_ instanceof ClassInst$) && key !== 'type' &&
        ownsProperty(this_.type.proto, key)
      ))) {
        // auto field assignment only works for an existing field of an object.
        return indexerOf(this_).call(this_, key, value)
      }
      return (this.local[key] = value)
    },
    export: function (key, value) {
      this.exporting && typeof this.exporting[key] === 'undefined' &&
        (this.exporting[key] = value)
      return this.var(key, value)
    },
    populate: function (ctx) {
      if (Array.isArray(ctx)) {
        this.context.arguments = ctx.length < 1 && EmptyArray ? EmptyArray : ctx
        return
      }
      if (ctx === null || typeof ctx !== 'object') {
        return
      }

      var keys = Object.getOwnPropertyNames(ctx)
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        switch (key) {
          case 'this':
            this.context.this = ctx.this
            break
          case 'arguments':
            if (Array.isArray(ctx.arguments)) {
              this.context.arguments = ctx.arguments.length < 1 && EmptyArray
                ? EmptyArray : ctx.arguments
            }
            break
          default:
            this.local[key] = ctx[key]
        }
      }
    },
    prepare: function (do_, this_, args) {
      this.context.do = do_
      this.context.this = typeof this_ === 'undefined' ? null : this_
      this.context.arguments = args.length < 1 && EmptyArray ? EmptyArray : args
    },
    prepareOp: function (operation, operand, that) {
      this.context.operation = operation
      this.context.operand = operand
      this.context.that = typeof that !== 'undefined' ? that : null
    },
    reserve: function () {
      return this.reserved || (
        this.reserved = {
          local: this.local,
          locals: this.locals,
          app: this.app
        }
      )
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
    inop: true // indicates this is an operator space.
  })

  $void.createOperatorSpace = function (parent) {
    return new OperatorSpace$(parent)
  }
}
