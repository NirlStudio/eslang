'use strict'

module.exports = function space ($void) {
  var $ = $void.$
  var $Object = $.object
  var ClassInst$ = $void.ClassInst
  var isObject = $void.isObject
  var indexerOf = $void.indexerOf
  var defineConst = $void.defineConst
  var ownsProperty = $void.ownsProperty

  // shared empty array
  var EmptyArray = Object.freeze([])

  var atomOf = $.tuple['atom-of']
  // to be used for safely separating spaces.
  $void.atomicArrayOf = function (src) {
    var values = []
    for (var i = 0; i < src.length; i++) {
      values.push(atomOf(src[i]))
    }
    return values
  }

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
      var value = $[key]
      if (typeof value !== 'undefined') {
        return value
      }
      value = this.context[key]
      if (typeof value !== 'undefined') {
        return value
      }
      var this_ = this.context.this
      return typeof this_ === 'undefined' || this_ === null ? null
        : indexerOf(this_).call(this_, key)
    },
    $resolve: function (key) {
      return typeof $[key] === 'undefined' ? null : $[key]
    },
    var: function (key, value) {
      return (this.local[key] = value)
    },
    const: function (key, value) {
      return defineConst(this.local, key, value)
    },
    lvar: function (key, value) {
      return (this.context[key] = value)
    },
    lconst: function (key, value) {
      return defineConst(this.context, key, value)
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
        this.context.arguments = ctx.length < 1 ? EmptyArray
          : Object.isFrozen(ctx) ? ctx : Object.freeze(ctx)
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
              this.context.arguments = ctx.arguments.length < 1 ? EmptyArray
                : Object.isFrozen(ctx.arguments) ? ctx.arguments
                  : Object.freeze(ctx.arguments.slice())
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
      this.context.arguments = args.length < 1
        ? EmptyArray : Object.freeze(args)
    },
    prepareOp: function (operation, operand, that) {
      this.context.operation = operation
      this.context.operand = operand
      this.context.that = typeof that !== 'undefined' ? that : null
    },
    reserve: function () {
      return this._reserved || (
        this._reserved = {
          local: this.local,
          locals: this.locals,
          app: this.app,
          modules: this.modules
        }
      )
    },
    bindOperators: function () {
      // convert operators to internal helper functions
      $void.bindOperatorFetch(this)
      $void.bindOperatorImport(this)
      $void.bindOperatorLoad(this)
    }
  })

  $void.createAppSpace = function (uri, home) {
    var app = Object.create($)
    app['-app'] = uri
    app['-app-dir'] = $void.loader.dir(uri)
    app['-app-home'] = home || app['-app-dir']
    app.env = $void.$env
    app.run = $void.$run
    app.warn = $void.$warn
    app.print = $void.$print
    app.printf = $void.$printf
    app.espress = $void.$espress
    app.timer = $void.$timer

    var local = Object.create(app)
    local['-module'] = app['-app']
    local['-module-dir'] = app['-app-dir']

    var exporting = Object.create(null)
    var space = new Space$(local, null, null, exporting)
    space.app = app
    space.modules = Object.create(null)
    space.export = function (key, value) {
      if (typeof exporting[key] === 'undefined') {
        app[key] = value
        exporting[key] = value
      }
      return space.var(key, value)
    }
    return space
  }

  // a bootstrap app space can be used to fetch app's dependencies.
  $void.createBootstrapSpace = function (appUri) {
    var bootstrap = $void.bootstrap = $void.createAppSpace(appUri)
    bootstrap.bindOperators()
    return bootstrap
  }

  $void.createModuleSpace = function (uri, appSpace) {
    var app = appSpace && appSpace.app
    var local = Object.create(app || $)
    local['-module'] = uri || ''
    local['-module-dir'] = uri && $void.loader.isResolved(uri)
      ? $void.loader.dir(uri) : ''
    var export_ = Object.create($Object.proto)
    var space = new Space$(local, null, null, export_)
    if (app) {
      space.app = app
      space.modules = appSpace.modules
    }
    return space
  }

  $void.createLambdaSpace = function (app, modules, module_) {
    var space
    if (app) {
      space = new Space$(Object.create(app))
      space.app = app
      space.modules = modules
    } else {
      space = new Space$(Object.create($))
    }
    if (module_) {
      space.local['-module'] = module_ || ''
      space.local['-module-dir'] = module_ ? $void.loader.dir(module_) : ''
    }
    return space
  }

  $void.createFunctionSpace = function (parent) {
    var space = new Space$(Object.create(parent.local),
      parent.locals ? parent.locals.concat(parent.local) : [parent.local]
    )
    if (parent.app) {
      space.app = parent.app
      space.modules = parent.modules
    }
    return space
  }

  // customized the behavior of the space of an operator
  $void.OperatorSpace = OperatorSpace$
  function OperatorSpace$ (parent, origin) {
    // the original context is preferred over global.
    this.$ = origin
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
      this.modules = parent.modules
    }
  }
  OperatorSpace$.prototype = Object.assign(Object.create(Space$.prototype), {
    inop: true, // indicates this is an operator space.
    $resolve: function (key) {
      // global entities are not overridable
      return typeof $[key] !== 'undefined' ? $[key]
        : typeof this.$[key] === 'undefined' ? null : this.$[key]
    }
  })

  $void.createOperatorSpace = function (parent, origin) {
    return new OperatorSpace$(parent, origin)
  }
}
