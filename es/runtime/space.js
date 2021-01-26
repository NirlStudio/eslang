'use strict'

module.exports = function space ($void) {
  var $ = $void.$
  var $Object = $.object
  var ClassInst$ = $void.ClassInst
  var warn = $void.$warn
  var isObject = $void.isObject
  var indexerOf = $void.indexerOf
  var defineConst = $void.defineConst
  var ownsProperty = $void.ownsProperty

  var reservedSymbols = $void.reservedSymbols

  // late binding: transient wrappers
  var moduleCreate = function $moduleCreate () {
    moduleCreate = $void.module.create.bind($void.module)
    return moduleCreate.apply(null, arguments)
  }
  var dirname = function $dirname () {
    if (!$void.$path.http) {
      dirname = $void.$path.dirname.bind($void.$path)
    } else {
      dirname = function $$dirname (path) {
        return $void.$path.http.isAbsolute(path)
          ? $void.$path.http.dirname(path)
          : $void.$path.dirname(path)
      }
    }
    return dirname.apply(null, arguments)
  }
  var isAbsolutePath = function $isAbsolutePath () {
    if (!$void.$path.http) {
      isAbsolutePath = $void.$path.isAbsolute.bind($void.$path)
    } else {
      isAbsolutePath = function $$isAbsolutePath (path) {
        return $void.$path.http.isAbsolute(path) ||
          $void.$path.isAbsolute(path)
      }
    }
    return isAbsolutePath.apply(null, arguments)
  }

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
      var value = this.context[key]
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
      if (reservedSymbols[key]) {
        warn('var', 'reserved symbol:', key)
        return this.context[key]
      }
      return (this.local[key] = value)
    },
    const: function (key, value) {
      if (reservedSymbols[key]) {
        warn('const', 'reserved symbol:', key)
        return this.context[key]
      }
      return defineConst(this.local, key, value)
    },
    lvar: function (key, value) {
      if (reservedSymbols[key]) {
        warn('local', 'reserved symbol:', key)
        return this.context[key]
      }
      return (this.context[key] = value)
    },
    lconst: function (key, value) {
      if (reservedSymbols[key]) {
        warn('locon', 'reserved symbol:', key)
        return this.context[key]
      }
      return defineConst(this.context, key, value)
    },
    let: function (key, value) {
      if (reservedSymbols[key]) {
        warn('let', 'reserved symbol:', key)
        return this.context[key]
      }
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
      if (this.exporting) {
        if (typeof this.exporting[key] !== 'undefined') {
          warn('export', 're-exporting', key)
          return this.exporting[key]
        }
        this.exporting[key] = value
      }
      // it's not encouraged to use a reserved symbol in a module's exports.
      // e.g. caller's (var * (import ...)) will not be able to work reliably.
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
        if (reservedSymbols[key]) {
          warn('var/p', 'reserved symbol:', key)
          continue
        }
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
            break
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
          app: this.app
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
    Object.assign(app, $void.$app)
    app['-app'] = uri
    app['-app-dir'] = dirname(uri)
    app['-app-home'] = home || app['-app-dir']

    var local = Object.create(app)
    local['-module'] = app['-app']
    local['-module-dir'] = app['-app-dir']

    var exporting = Object.create(null)
    var space = new Space$(local, null, null, exporting)
    app.modules = moduleCreate(space)
    space.app = app
    space.export = function (key, value) {
      if (reservedSymbols[key]) {
        warn('export/a', 'reserved symbol:', key)
        return this.context[key]
      }
      if (typeof exporting[key] !== 'undefined') {
        warn('export/a', 're-exporting', key)
        return this.exporting[key]
      }
      app[key] = value // make app exports available for whole app.
      exporting[key] = value
      return (local[key] = value)
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
    local['-module-dir'] = uri && (isAbsolutePath(uri) ? dirname(uri) : '')
    var export_ = Object.create($Object.proto)
    var space = new Space$(local, null, null, export_)
    if (app) {
      space.app = app
    }
    return space
  }

  $void.createLambdaSpace = function (app, modules, module_) {
    var space
    if (app) {
      space = new Space$(Object.create(app))
      space.app = app
    } else {
      space = new Space$(Object.create($))
    }
    if (module_) {
      space.local['-module'] = module_ || ''
      space.local['-module-dir'] = module_ ? dirname(module_) : ''
    }
    return space
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
