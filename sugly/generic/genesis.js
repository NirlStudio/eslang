'use strict'

module.exports = function () {
  /* In the beginning God created the heavens and the earth. */
  var $void = {}
  var protoNull = Object.create(null)

  /* Now the earth was formless and empty, */
  var $ = $void.$ = Object.create(protoNull)

  /* “Let there be light,” and there was light. */
  var Type$ = $void.Type = function Type$ (prototype) {
    Object.defineProperty(this, 'proto', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: prototype ? prototype : Object.create(protoNull)
    })
    this.proto.type = this
  }

  /* Nameless beginning of heaven and earth, the famous mother of all things. */
  function define (name, prototype) {
    var type = new Type$(prototype)
    type.name = name
    type.identityName = name
    $[type.name] = type
  }

  $.identityName = '$'
  Type$.prototype = protoNull
  define('Null', protoNull)

  var protoClass = Type$.prototype = Object.create(protoNull)
  define('Class', protoClass)
  define('Bool')
  define('Number')
  define('String')
  define('Symbol')
  define('Function')

  var Symbol$ = $void.Symbol = function Symbol$ (key) {
    Object.defineProperty(this, 'key', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: key
    })
  }
  Symbol$.prototype = $.Symbol.proto

  function create (name, prototype) {
    var type = Object.create(prototype)
    Object.defineProperty(type, 'proto', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: Object.create(prototype.proto)
    })
    type.proto.type = type
    type.name = name
    type.identityName = name
    $[type.name] = type
  }

  create('Int', $.Number)
  create('Float', $.Number)

  create('Date', $.Class)
  create('Range', $.Class)
  create('Array', $.Class)

  create('Interface', $.Class)

  $void.isPrototypeOf = Function.prototype.call.bind(Object.prototype.isPrototypeOf)
  $void.ownsProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty)

  $void.createType = function $derive (prototype) {
    var type = Object.create(prototype)
    Object.defineProperty(type, 'proto', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: Object.create(prototype.proto)
    })
    type.proto.type = type
  }

  return $void
}
