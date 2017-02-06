'use strict'

function toCodeAsRoot (func, ctx) {
  if (!func.context) {
    return functionToCode(func, ctx, true)
  }

  // analyze any nested objects in function's context object.
  ctx.toCode(func.context)
  ctx.analyzed = true

  // generate code
  var status = ctx.generating(func)
  if (status.stage === 1) { // has nested reference to this function.
    // update context only
    return ctx.end('(' + status.key + ' bind ' + ctx.toCode(func.context) + ')')
  }

  var code = functionToCode(this, ctx, false)
  if (ctx.count() > 0) { // use ctx result
    return ctx.end(code)
  } else {
    return code // no nested object, return code directly
  }
}

function toCodeAsChild (func, ctx) {
  if (!ctx.analyzed) { // in analyzing
    switch (ctx.analyze(func)) {
      case 0: // not repeated yet. to analyze context object.
        return ctx.toCode(func.context || null)
      case 1: // repeated once
        return ctx.create(func, functionToCode(func, ctx, true))
      default: // more than once
        return // do nothing
    }
  }

  // generating code
  var status = ctx.generating(func)
  if (!status.key) { // single occurrence
    return functionToCode(func, ctx, false)
  }
  if (status.stage === 1) { // repeated first time.
    ctx.update('(' + status.key + ' bind ' + ctx.toCode(func.context) + ')')
  }
  // generated before, so here returns variable name only.
  return status.key
}

function functionToCode (func, ctx, skipContext) {
  var code = ['(=']
  if (!skipContext) {
    code.push(ctx.toCode(func.context))
    code.push('>')
  }

  code.push('(')
  func.parameters.forEach(function printParam (param) {
    var name = param[0] && param[0].key
    if (typeof name !== 'string') {
      return
    }
    var defaulue = param[1]
    if (typeof defaulue === 'undefined' || defaulue === null) {
      code.push(name)
    } else {
      code.push('(' + name + ' ' + ctx.decompile(defaulue) + ')')
    }
  })

  if (!func['fixed-args']) {
    code.push('*')
  }
  code.push(')')

  ctx.decompile(func.body, code)
  code.push(')')
  return code.join(ctx.asCompat ? ' ' : '\n')
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Function
  var $Object = $.Object
  var readonly = $void.readonly
  var isPrototypeOf = $void.isPrototypeOf

  // dynamically call a function. execute & execute-with will be implmented with $execute.
  readonly(type, 'call', function Function$call (subject, func) {
    return typeof func !== 'function' ? null
      : func.apply(subject, Array.prototype.slice.call(arguments, 2))
  })
  readonly(type, 'apply', function Function$apply (subject, func, args) {
    if (typeof args === 'undefined') {
      args = func; func = subject; subject = null
    }
    return typeof func !== 'function' ? null
      : func.apply(subject, Array.isArray(args) ? args : [])
  })

  var proto = type.proto

  // emptiness is defined to the 0 value of timestamp.
  readonly(proto, 'bind', function function$bind (context) {
    if (typeof this !== 'function') {
      return this
    }
    if (!isPrototypeOf($Object.proto, context)) {
      context = $Object.create()
    }
    readonly(this, 'context', context)
    return this
  })

  // emptiness is defined to the 0 value of timestamp.
  readonly(proto, 'is-empty', function function$isEmpty () {
    return this.body && this.body.length > 0
  })
  readonly(proto, 'not-empty', function function$notEmpty () {
    return !this.body || this.body.length < 1
  })

  // persistency & describing
  var coding = $void.coding
  readonly(proto, 'to-code', function function$toCode (asCompat) {
    if (typeof this !== 'function') {
      return '()' // not a function
    }
    if (!Array.isArray(this.parameters) || !Array.isArray(this.body)) {
      return '(=())' // A generic or malformed function
    }
    return coding.is(asCompat) ? toCodeAsChild(this, asCompat)
      : toCodeAsRoot(this, coding.start(this, asCompat))
  })
  readonly(proto, 'to-string', function function$toString () {
    var code = ['(=']
    if (this.context) {
      code.push('>')
    }
    code.push('(')
    var counter = 0
    if (Array.isArray(this.parameters)) {
      this.parameters.forEach(function (p) {
        if (counter === 1) {
          code.push(' ')
        }
        counter += 1
        code.push(p[0].key)
      })
    }
    if (!this['fixed-args']) {
      code.push(counter > 0 ? ' *) ' : '*) ')
    }
    code.push('"' + (this.name || 'anonymous') + '")')
    return code.join('')
  })

  // indexer: override to expose this function's meta information.
  readonly(proto, ':', function function$indexer (name) {
    return typeof name !== 'string' ? null
      : typeof this[name] === 'undefined'
        ? typeof proto[name] === 'undefined' ? null : proto[name] : this[name]
  })

  // override to boost - an object is always true
  readonly(proto, '?', function function$boolTest (a, b) {
    return typeof a === 'undefined' ? true : a
  })

  // export to system's prototype
  $void.injectTo(Function, 'type', type)
  $void.injectTo(Function, ':', proto[':'])
}
