'use strict'

module.exports = function () {
  /*
    The Prologue.
  */
  var $void = {}

  /* In the beginning God created the heavens and the earth. */
  var Null = $void.null = Object.create(null)
  /* Now the earth was formless and empty, */
  var $ = $void.$ = Object.create(null)

  /* “Let there be light,” and there was light. */
  // The light is the laws, which is the foundation of all beings.
  var Prototype = Object.create(Null)
  var Type$ = $void.Type = function Type$ () {
    // In both theory and reality, this function should be executed once, and
    // can only be executed once.
    Object.defineProperty(this, 'proto', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: Prototype
    })
    Object.defineProperty(this.proto, 'type', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: this
    })
  }
  Type$.prototype = Prototype

  /* Nameless beginning of heaven and earth, the famous mother of all things. */
  $.name = $.identityName = '$'

  /* ... he separated the light from the darkness, */
  var Type = new Type$()
  /* ... called the light “day,”  */
  Type.name = Type.identityName = 'Type'
  $.Type = Type

  /* ... and the darkness he called “night.” */
  Null.name = Null.identityName = 'null'
  $.null = null
  // The logical noumenon of null is not accessible directly, otherwise it will
  // cause some confusion in evalution process.
  // P.S, so is our fate either?

  /* And there was evening, and there was morning—the first day. */
  // - from Bible and Dao Te Ching

  /*
    Prepare to build generice type system.
  */
  function create (name, prototype) {
    prototype = prototype || Type
    var type = Object.create(prototype)
    // a type includes a prototype
    Object.defineProperty(type, 'proto', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: Object.create(prototype.proto)
    })
    // a prototype link to its type
    Object.defineProperty(type.proto, 'type', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: type
    })
    // export to space.
    type.name = type.identityName = name
    $[name] = type
  }

  // the type of Null is itself.
  Object.defineProperty(Null, 'type', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: null
  })

  // create primitive types
  create('Bool')
  create('Number')
  create('String')
  create('Symbol')
  create('Function')
  create('Class')

  // prepare the constructor of symbol type.
  var Symbol$ = $void.Symbol = function Symbol$ (key) {
    Object.defineProperty(this, 'key', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: key
    })
  }
  Symbol$.prototype = $.Symbol.proto

  // create other fundamental types
  create('Int', $.Number)
  create('Float', $.Number)

  create('Date', $.Class)
  create('Range', $.Class)
  create('Array', $.Class)

  create('Interface', $.Class)

  $void.isPrototypeOf = Function.prototype.call.bind(Object.prototype.isPrototypeOf)
  $void.ownsProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty)

  // expose a method to create new types further.
  $void.createType = function $createType (prototype) {
    var type = Object.create(prototype)
    Object.defineProperty(type, 'proto', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: Object.create(prototype.proto)
    })
    Object.defineProperty(type.proto, 'type', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: type
    })
    return type
  }

  $void.injectTo = function (type, name, value) {
    Object.defineProperty(type.prototype, name, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: value
    })
  }
  return $void
}
