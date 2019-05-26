'use strict'

function createEmptyOperation () {
  return function () {
    return null
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var $Type = $.type
  var $Tuple = $.tuple
  var Type$ = $void.Type
  var $Bool = $.bool
  var $Date = $.date
  var $Number = $.number
  var $String = $.string
  var $Object = $.object
  var $Array = $.array
  var $Lambda = $.lambda
  var $Function = $.function
  var $Operator = $.operator
  var $Promise = $.promise
  var Null = $void.null
  var Tuple$ = $void.Tuple
  var Object$ = $void.Object
  var Symbol$ = $void.Symbol
  var Promise$ = $void.Promise
  var operator = $void.operator
  var ClassType$ = $void.ClassType
  var isApplicable = $void.isApplicable

  // flag indicates if it's running in native host.
  $void.isNativeHost = typeof window === 'undefined'

  // generate an empty function.
  $void.createEmptyOperation = createEmptyOperation

  // a static version of isPrototypeOf.
  var isPrototypeOf = Function.prototype.call.bind(Object.prototype.isPrototypeOf)
  $void.isPrototypeOf = isPrototypeOf

  // a static version of hasOwnProperty.
  var ownsProperty = Function.prototype.call.bind(
    Object.prototype.hasOwnProperty
  )
  $void.ownsProperty = ownsProperty

  // ensure the runtime bind can be safely called
  var safelyBind = Function.prototype.call.bind(
    Function.prototype.bind
  )
  $void.safelyBind = safelyBind

  // support native new operator on a constructor function
  var newInstance = function (A, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
    switch (arguments.length) {
      case 0: return null
      case 1: return new A()
      case 2: return new A(b)
      case 3: return new A(b, c)
      case 4: return new A(b, c, d)
      case 5: return new A(b, c, d, e)
      case 6: return new A(b, c, d, e, f)
      case 7: return new A(b, c, d, e, f, g)
      case 8: return new A(b, c, d, e, f, g, h)
      case 9: return new A(b, c, d, e, f, g, h, i)
      case 10: return new A(b, c, d, e, f, g, h, i, j)
      case 11: return new A(b, c, d, e, f, g, h, i, j, k)
      case 12: return new A(b, c, d, e, f, g, h, i, j, k, l)
      case 13: return new A(b, c, d, e, f, g, h, i, j, k, l, m)
      case 14: return new A(b, c, d, e, f, g, h, i, j, k, l, m, n)
      case 15: return new A(b, c, d, e, f, g, h, i, j, k, l, m, n, o)
      case 16: return new A(b, c, d, e, f, g, h, i, j, k, l, m, n, o, p)
      default: return new A(b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q)
    }
  }
  $void.newInstance = newInstance

  // safe copy all members from a source object or function to a target object.
  // generate do and new operation for a native function source.
  var safelyAssign = function (target, source, isGeneric) {
    for (var key in source) {
      if (ownsProperty(source, key)) {
        var value = source[key]
        target[key] = typeof value !== 'function' ? value
          : safelyBind(value, source)
      }
    }
    if (isGeneric && typeof source === 'function') {
      // If the source have a 'do' or 'new' function, it will be just overridden.
      // This behavior can be changed if it's really worthy in future.
      target.do = safelyBind(source, null)
      target.new = newInstance.bind(null, source)
    }
    return target
  }
  $void.safelyAssign = safelyAssign

  // make sure a file uri has correct sugly extension
  $void.appendExt = function (path) {
    return !path || typeof path !== 'string' ? path
      : path.endsWith('.s') || path.endsWith('.sugly') ? path
        : path + '.s'
  }

  // to retrieve or create a shared symbol.
  var sharedSymbols = $void.sharedSymbols = Object.create(null)
  function sharedSymbolOf (key) {
    return sharedSymbols[key] || (sharedSymbols[key] = new Symbol$(key))
  }
  $void.sharedSymbolOf = sharedSymbolOf

  // generic operators cannot be overridden in program. They are interpreted
  // directly in core evaluation function.
  function staticOperator (name, impl) {
    // make the symbol a pure symbol.
    $[name] = sharedSymbolOf(name)
    // export the implementation.
    $void.staticOperators[name] = operator(impl, $Tuple.operator)
    return impl
  }
  $void.staticOperator = staticOperator

  $void.regexNumber = /(^)([-+]?\d*\.\d+|[-+]?\d+\.\d*|[+-]\d+|\d+)/
  $void.regexDecimal = /(^)([-+]?\d*\.\d+|[-+]?\d+\.\d*|[+-]\d+|\d\b|[1-9]\d*)/
  $void.regexPunctuation = /[\\(,)\s]/
  $void.regexSpecialSymbol = /[(`@:$"#)',;\\\s[\]{}]/

  $void.regexConstants = /^(null|true|false)$/
  $void.constantValues = Object.assign(Object.create(null), {
    'null': null,
    'true': true,
    'false': false
  })

  var regexNumber = $void.regexNumber
  var regexConstants = $void.regexConstants
  var regexPunctuation = $void.regexPunctuation
  var regexSpecialSymbol = $void.regexSpecialSymbol

  var isSafeName = $void.isSafeName = function (key) {
    return !!key && !regexSpecialSymbol.test(key) &&
      !regexConstants.test(key) &&
        !regexNumber.test(key)
  }
  $void.isSafeSymbol = function (key) {
    return !!key && !regexPunctuation.test(key) &&
      (!regexSpecialSymbol.test(key) || key.length < 2) &&
        !regexConstants.test(key) &&
          !regexNumber.test(key)
  }
  $void.escapeSymbol = function (key) {
    var chars = []
    for (var i = 0; i < key.length; i++) {
      regexSpecialSymbol.test(key[i]) && chars.push('\\')
      chars.push(key[i])
    }
    return chars.join('')
  }
  $void.encodeFieldName = function (name) {
    return isSafeName(name)
      ? (sharedSymbols[name] || new Symbol$(name)) // print as a symbol.
      : name // print as a literal string.
  }

  // to check if an value is a compatible object.
  $void.isObject = function (obj) {
    return obj instanceof Object$ || typeOf(obj) === $Object
  }

  // retrieve the real type of an entity.
  function typeOf (entity) {
    if (entity === null || typeof entity === 'undefined') {
      return null
    }
    switch (typeof entity) {
      case 'boolean':
        return $Bool
      case 'number':
        return $Number
      case 'string':
        return $String
      case 'function':
        return entity.type === $Lambda ? $Lambda
          : entity.type === $Operator ? $Operator
            : $Function
      case 'object':
        var proto = Object.getPrototypeOf(entity)
        return proto.type === $Type || proto.type instanceof Type$ ? proto.type
          : Array.isArray(entity) ? $Array
            : entity instanceof Date ? $Date
              : entity instanceof Promise$ ? $Promise
                : $Object
      default:
        return null
    }
  }
  $void.typeOf = typeOf

  // retrieve the system indexer of an entity.
  var indexerOf = $void.indexerOf = function (entity) {
    var type = typeOf(entity)
    return (type && type.indexer) || Null[':']
  }

  // retrieve a field value from prototype; it will be bound to its subject
  // if it's a function.
  var protoValueOf = $void.protoValueOf = function (subject, proto, key) {
    var value = proto[key]
    return typeof value === 'function' && (
      value.type === $Lambda || value.type === $Function
    ) ? bindThis(subject, value) : value
  }

  function thisCall (subject, methodName) {
    var method = indexerOf(subject).call(subject, methodName)
    return typeof method !== 'function' ? method
      : arguments.length < 3 ? method.call(subject)
        : method.apply(subject, Array.prototype.slice.call(arguments, 2))
  }
  $void.thisCall = thisCall

  // try to update the name of a function or a class.
  var tryToUpdateName = $void.tryToUpdateName = function (entity, name) {
    if (typeof entity === 'function') {
      if (!entity.$name) {
        entity.$name = name
      }
    } else if (entity instanceof ClassType$) {
      if (!entity.name) {
        entity.name = name
      }
    }
    return entity
  }

  // to export an entity to a space.
  $void.export = function (space, name, entity) {
    // ensure exported names are shared.
    sharedSymbolOf(name)
    // automatically bind null for static methods
    if (isApplicable(entity)) {
      entity = bindThis(null, entity)
    }
    tryToUpdateName(entity, name)
    if (entity && typeof entity === 'object') {
      entity.seal ? entity.seal() : Object.freeze(entity)
    }
    return (space[name] = entity)
  }

  // create a bound function from the original function or lambda.
  function bindThis ($this, func) {
    if (typeof func.this !== 'undefined') {
      // a this-bound static lambda may not be bound.
      return func
    }
    var binding = safelyBind(func, $this)
    binding.this = $this
    binding.bound = func
    typeof func.code !== 'undefined' && (
      binding.code = func.code
    )
    if (typeof func.$name === 'string') {
      binding.$name = func.$name
    }
    if (binding.type !== func.type) {
      binding.type = func.type
    }
    if (func.type === $Lambda && func.static === true) {
      binding.const = true // upgrade static to const lambda
    }
    return binding
  }
  $void.bindThis = bindThis

  // to link an entity to its owner.
  function link (owner, names, entity, autoBind) {
    if (typeof entity === 'function') {
      if (!ownsProperty(entity, 'type')) {
        entity.type = $Lambda
      }
      if (!entity.$name) {
        entity.$name = typeof names === 'string' ? names : names[0]
      }
      if (autoBind && isApplicable(entity)) {
        entity = bindThis(owner, entity)
      }
    }
    if (typeof names === 'string') {
      sharedSymbolOf(names)
      owner[names] = entity
    } else {
      for (var i = 0; i < names.length; i++) {
        sharedSymbolOf(names[i])
        owner[names[i]] = entity
      }
    }
    return entity
  }
  $void.link = link

  // to export native type (static) methods.
  $void.copyType = function (target, src, mapping) {
    var names = Object.getOwnPropertyNames(mapping)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      var entity = src[name]
      if (typeof entity === 'function') {
        entity = safelyBind(entity, src)
        entity.type = $Lambda
        entity.$name = mapping[name]
      }
      target[mapping[name]] = entity
    }
    return target
  }

  $void.prepareOperation = function (type, noop, emptyCode) {
    // the empty function
    noop.$name = 'noop'
    var empty = link(type, 'empty', function () {
      return noop
    }, true)

    // a placeholder of function
    link(type, 'of', empty, true)

    var proto = type.proto
    // return operation's name
    link(proto, 'name', function () {
      return this.$name || ''
    })

    // return operation's parameters
    link(proto, 'parameters', function () {
      return (this.code || emptyCode).$[1]
    })

    // return operation's body
    link(proto, 'body', function () {
      return (this.code || emptyCode).$[2]
    })

    // test if the operation is a generic one.
    link(proto, 'is-generic', function () {
      return !(this.code instanceof Tuple$)
    })
    link(proto, 'not-generic', function () {
      return this.code instanceof Tuple$
    })

    // Emptiness: a managed operation without a body.
    link(proto, 'is-empty', function () {
      return this.code instanceof Tuple$ &&
          (this.code.$.length < 3 || this.code.$[2].$.length < 1)
    })
    link(proto, 'not-empty', function () {
      return !(this.code instanceof Tuple$) ||
          (this.code.$.length > 2 && this.code.$[2].$.length > 0)
    })

    // Encoding
    link(proto, 'to-code', function (ctx) {
      return this.code || emptyCode
    })

    // Description
    link(proto, 'to-string', function () {
      return (this.code || emptyCode)['to-string']()
    })

    // Indexer
    var indexer = link(proto, ':', function (index) {
      return typeof index === 'string' ? protoValueOf(this, proto, index)
        : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
    })
    indexer.get = function (key) {
      return proto[key]
    }

    // export type indexer.
    link(type, 'indexer', indexer)
  }

  $void.prepareApplicable = function (type, emptyCode) {
    var proto = type.proto

    // test if the lambda/function has been bound to a subject.
    link(proto, 'is-bound', function () {
      return typeof this.bound === 'function'
    })
    link(proto, 'not-bound', function () {
      return typeof this.bound !== 'function'
    })

    // return operation's parameters
    link(proto, 'this', function () {
      return typeof this.bound === 'function' ? this.this : null
    })

    // apply a function and expand arguments from an array.
    link(proto, 'apply', function (subject, args) {
      return typeof subject === 'undefined' ? this.apply(null)
        : Array.isArray(args) ? this.apply(subject, args)
          : typeof args === 'undefined'
            ? this.call(subject)
            : this.call(subject, args)
    })

    link(proto, ['is', '==='], function (another) {
      return typeof another === 'function' && (this === another || (
        typeof this.this !== 'undefined' && (
          this.this === another.this || Object.is(this.this, another.this)
        ) && typeof this.bound !== 'undefined' && this.bound === another.bound
      ))
    })
    link(proto, ['is-not', '!=='], function (another) {
      return typeof another !== 'function' || (this !== another && (
        typeof this.this === 'undefined' || (
          this.this !== another.this && !Object.is(this.this, another.this)
        ) || typeof this.bound === 'undefined' || this.bound !== another.bound
      ))
    })

    link(proto, ['equals', '=='], function (another) {
      return typeof another === 'function' && (
        this === another || this === another.bound || (
          typeof this.bound !== 'undefined' && (
            this.bound === another || this.bound === another.bound
          )
        )
      )
    })
    link(proto, ['not-equals', '!='], function (another) {
      return typeof another !== 'function' || (
        this !== another && this !== another.bound && (
          typeof this.bound === 'undefined' || (
            this.bound !== another && this.bound !== another.bound
          )
        )
      )
    })
  }
}
