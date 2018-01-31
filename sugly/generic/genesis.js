'use strict'

module.exports = function () {
  /*
    The Prologue.
  */
  // The Void is out of the scope of the Being and cannot be analyzed in the
  // scope of Being. Therefore, it cannot be described as either existent or
  // nonexistent. Boolean logic is part of the Being.
  var $void = {}

  /*
    The Beginning.
  */
  /* In the beginning God created the heavens and the earth. */
  var Null = $void.null = Object.create(null)
  /* Now the earth was formless and empty, */
  var $ = $void.$ = Object.create(null) /* 0. Generation */

  /* “Let there be light,” and there was light. */
  // The light is the laws, which are the foundation of all beings.
  var Prototype = Object.create(Null) /* 1. Derivation */
  function Type$ () { /* 2. Separation & Aggregation */
    // This function should be executed once, and only once.
    // The primal type is derived from the supreme prototype.
    publish(this, 'proto', Prototype)
    // The primal type is the container type of the supreme prototype.
    publish(Prototype, 'type', this)
  }
  Type$.prototype = Prototype

  /* Nameless beginning of heaven and earth, the famous mother of all things. */
  function naming (type, name) {
    publish($, name, type)
    publish(type, 'name', name)
    return type
  }

  /* ... he separated the light from the darkness, */
  var Type = new Type$()
  /* ... called the light “day,”  */
  naming(Type, 'type')
  /* ... and the darkness he called “night.” */
  $.null = null

  // The logical noumenon of null is not accessible directly, otherwise it will
  // cause some confusion in evalution process.
  // P.S, so is our fate too?

  /* A placeholder constructor to test a type. */
  $void.Type = function Type () {}
  $void.Type.prototype = Type

  /* It's ready to create primitive types, */
  function create (name, superType) {
    if (!superType) {
      superType = Type
    }
    var type = Object.create(superType)
    // a new type should have a new nature.
    publish(type, 'proto', Object.create(superType.proto))
    // a proto always intrinsically knows its container type.
    publish(type.proto, 'type', type)
    // give a name to the new type.
    naming(type, name)
  }

  /* And there was evening, and there was morning — the first day. */
  /*   - from Bible and Dao Te Ching */

  /*
    The Creating.
  */
  /* Static Value Types */
  /* All static values are fixed points of evaluation function. */
  /* All static values can be fully encoded and recovered by evaluation. */

  // A boolean type is not a prerequisite to implement boolean logic, but it
  // may help to avoid ambiguity in many cases.
  create('bool')

  // A string is a piece of free form text.
  create('string')

  // A number may have a real number value in the proper range.
  create('number')

  // A date value is a combination of a timestamp and a associated locale string.
  create('date')
  $void.Date = Date

  // A range value represents a descrete sequence of numbers in the interval of
  // [begin, end) and a step value.
  create('range')
  var Range$ = $void.Range = function Range$ (begin, end, step) {
    publish(this, 'begin', begin)
    publish(this, 'end', end)
    publish(this, 'step', step)
  }
  Range$.prototype = $.range.proto

  /* Expression Types */
  /* An expression entity may produce another entity after evaluation. */
  /* An expression value can be fully encoded and recevered. */
  /* A static value can also be a part of an expression. */

  // A symbol is an identifer of a semantic element, so the string value of its
  // key must comply with some fundamental exical rules.
  // A symbol will be resolved to the associated value under current context or
  // null by the evaluation function.
  create('symbol')
  var Symbol$ = $void.Symbol = function Symbol$ (key) {
    publish(this, 'key', key)
  }
  Symbol$.prototype = $.symbol.proto

  // A tuple is a list of other static values, symbols and tuples.
  // A tuple will be interpreted as a statement under current context to produce
  // an output value by the evaluation function.
  // The name 'list' is left to be used for more common scenarios.
  create('tuple')
  var Tuple$ = $void.Tuple = function Tuple$ (list, plain, source) {
    publish(this, '$', list) // hidden native data
    publish(this, 'plain', plain === true) // as code block.
    if (source) { // reserved for source map and other debug information.
      define(this, 'source', source)
    }
  }
  Tuple$.prototype = $.tuple.proto

  /* Operation Types */
  /* All operations will be evaluated to the output of its invocation. */

  // An operator is an operation which accepts raw argument expressions, which
  // means no evaluation happens to arguments before the invocation, to allow
  // more syntax structures can be defined.
  // An operator is an immutable entity and can be fully encoded.
  create('operator')
  $void.operator = function operator$ (impl, code) {
    define(impl, 'type', $.operator)
    define(impl, 'code', code)
    return impl
  }

  // the contaier for static operators. Static operators are taken as an
  // essential part of the language itself. They cannot be overridden.
  $void.staticOperators = Object.create(null)

  // A lambda is another type of operation which wants the values of its arguments
  // as input, so the runtime helps to evaluate all them before invocation.
  // A lambda is an immutable entity and can be fully encoded.
  create('lambda')
  $void.lambda = function lambda$ (impl, code) {
    define(impl, 'type', $.lambda)
    define(impl, 'code', code)
    return impl
  }

  // A function is an operation which works like a Closure. Its behaviour depends
  // on both the values of arguments and current values in its outer context.
  // A function is not explicitly alterable but its implicit context is dynamic
  // and persistent in running. So its overall state is mutable.
  // For the existence of the context, a function cannot be fully encoded. But
  // it may be automatically downgraded to a lambda when the encoding is required.
  create('function', $.lambda)
  $void.function = function function$ (impl, code) {
    define(impl, 'type', $.function)
    define(impl, 'code', code)
    return impl
  }

  /* Compound Types */
  /* Generally, all compound entities are mutable. */
  /* All compound entities are also fixed points of evaluation funtion. */

  // A collection of values indexed by zero-based integers.
  create('array')

  // The object is the fundamental type of all compound entities.
  create('object')
  var Object$ = $void.Object = function Object$ (src) {
    if (src) {
      Object.assign(this, src)
    }
  }
  Object$.prototype = $.object.proto

  // A fake constructor for instanceof type checking.
  var ObjectType$ = $void.ObjectType = function ObjectType$ () {}
  ObjectType$.prototype = $.object

  /* Extensible Data Type */
  /* A extensible data type can facilitate complexity by type inheritance. */

  // Class is a meta type to create types that can be extended by inheritance.
  // All instances of all classes can be downgraded to a common object.
  var $Class = naming(Object.create(Type), 'class')

  // A fake constructor for instanceof type checking.
  var ClassType$ = $void.ClassType = function ClassType$ () {}
  ClassType$.prototype = $.class

  /*
    The Evoluation.
  */
  // export the ability of creation to enable an autonomous process.
  $void.createClass = function createClass () {
    var class_ = Object.create($Class)
    publish(class_, 'proto', Object.create($.object.proto))
    publish(class_.proto, 'type', class_)
    return class_
  }

  return $void
}

// Publish a value to its owner by a key.
function publish (owner, key, value) {
  Object.defineProperty(owner, key, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: value
  })
}

// Define a value as a non-enumerable property of an entity.
function define (entity, prop, value) {
  Object.defineProperty(entity, prop, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  })
}
