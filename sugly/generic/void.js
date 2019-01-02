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
  var $Lambda = $.lambda
  var $String = $.string
  var $Function = $.function
  var $Object = $.object
  var Null = $void.null
  var Tuple$ = $void.Tuple
  var Object$ = $void.Object
  var Symbol$ = $void.Symbol
  var operator = $void.operator
  var ClassType$ = $void.ClassType
  var isApplicable = $void.isApplicable

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

  // default native output methods - TODO: move to $/lib/io.js
  function formatArgs () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      strings.push($String.of(arguments[i]))
    }
    return strings.join(' ')
  }
  $void.print = function () {
    var text = formatArgs.apply(null, arguments)
    console.log(text) // keep orginal types in browser
    return text
  }
  function formatWarning () {
    var args = Array.prototype.slice.call(arguments)
    args.splice(1, 0, '>')
    return args
  }
  $void.warn = console.warn ? function () {
    var args = formatWarning.apply(null, arguments)
    var text = formatArgs.apply(null, args)
    console.warn(text) // keep orginal types in browser
    return text
  } : function () {
    var args = formatWarning.apply(null, arguments)
    args.unshift('[WARN]')
    var text = formatArgs.apply(null, args)
    console.log(text) // keep orginal types in browser
    return text
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

  // pseudo operater ':' is implemented in evaluation function.
  staticOperator(':', function () {
    return null
  })

  $void.regexNumber = /(^)([-+]?\d*\.\d+|[-+]?\d+\.\d*|[+-]\d+|\d+)/
  $void.regexDecimal = /(^)([-+]?\d*\.\d+|[-+]?\d+\.\d*|[+-]\d+|\d\b|[1-9]\d*)/
  $void.regexSpecialSymbol = /[(`@:$"#)',;\\\s[\]{}]/

  $void.regexConstants = /^(null|true|false)$/
  $void.constantValues = Object.assign(Object.create(null), {
    'null': null,
    'true': true,
    'false': false
  })

  var regexNumber = $void.regexNumber
  var regexConstants = $void.regexConstants
  var regexSpecialSymbol = $void.regexSpecialSymbol

  var isSafeSymbol = $void.isSafeSymbol = function (key) {
    return !regexSpecialSymbol.test(key) &&
      !regexConstants.test(key) && !regexNumber.test(key)
  }
  $void.encodeFieldName = function (name) {
    return isSafeSymbol(name) ? (sharedSymbols[name] || new Symbol$(name))
      : name // use the raw string in the place of symbol.
  }

  // to check if an value is a compatible object.
  $void.isObject = function (obj) {
    return obj instanceof Object$ || (!!obj && obj.type === $Object)
  }

  // retrieve the system indexer of an entity.
  var indexerOf = $void.indexerOf = function (entity) {
    var type = $Type.of(entity)
    return (type && type.indexer) || Null[':']
  }

  // retrieve a field value from prototype; it will be bound to its subject
  // if it's a function.
  var protoValueOf = $void.protoValueOf = function (subject, proto, key) {
    var value = proto[key]
    return typeof value === 'function' && (
      value.type === $Lambda || value.type === $Function
    ) ? bind(subject, value) : value
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
    space[name] = isApplicable(entity) ? bind(null, entity) : entity
    return tryToUpdateName(entity, name)
  }

  // create a bound function from the original function or lambda.
  function bind ($this, func) {
    if (typeof func.bound === 'function') {
      return func // binding can only happen once.
    }
    var bound = func.bind($this)
    func.$name && (
      bound.$name = func.$name
    )
    bound.type !== func.type && (
      bound.type = func.type
    )
    typeof func.code !== 'undefined' && (
      bound.code = func.code
    )
    bound.this = $this
    bound.bound = func
    return bound
  }
  $void.bind = bind

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
        entity = bind(owner, entity)
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
      var func = target[mapping[name]] = src[name]
      if (typeof func === 'function') {
        func.type = $Lambda
        if (!func.$name) {
          func.$name = mapping[name]
        }
      }
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

    // Desccription
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

    // bind a function to a fixed subject.
    link(proto, 'bind', function ($this) {
      return typeof $this === 'undefined' ? this : bind($this, this)
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
