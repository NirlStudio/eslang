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
    this.proto = Prototype
    // The primal type is the container type of the supreme prototype.
    defineTypeProperty(Prototype, this)
  }
  Type$.prototype = Prototype

  /* Nameless beginning of heaven and earth, the famous mother of all things. */
  function naming (type, name) {
    $[name] = type
    type.name = name
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
  $void.Type = function () {}
  $void.Type.prototype = Type

  /* It's ready to create primitive types, */
  function create (name) {
    var type = Object.create(Type)
    // a new type should have a new nature.
    type.proto = Object.create(Type.proto)
    // a proto always intrinsically knows its container type.
    type.proto.type = type
    // give a name to the new type.
    naming(type, name)
    return type
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
  var Range$ = $void.Range = function (begin, end, step) {
    this.begin = begin
    this.end = end
    this.step = step
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
  var Symbol$ = $void.Symbol = function (key) {
    this.key = key
  }
  Symbol$.prototype = $.symbol.proto

  // A tuple is a list of other static values, symbols and tuples.
  // A tuple will be interpreted as a statement under current context to produce
  // an output value by the evaluation function.
  // The name 'list' is left to be used for more common scenarios.
  create('tuple')
  var Tuple$ = $void.Tuple = function (list, plain, source) {
    this.$ = list // hidden native data
    this.plain = plain === true // as code block.
    if (source) { // reserved for source map and other debug information.
      this.source = source
    }
  }
  Tuple$.prototype = $.tuple.proto

  /* Operation Types */
  /* All operations will be evaluated to the output of its invocation. */

  // An operator is an operation which accepts raw argument expressions, which
  // means no evaluation happens to arguments before the invocation, to allow
  // more syntax structures can be defined.
  // An operator is an immutable entity and can be fully encoded.
  var operator = create('operator')
  $void.operator = function (impl, code) {
    impl.type = $.operator
    impl.code = code
    return impl
  }

  // the contaier for static operators. Static operators are taken as an
  // essential part of the language itself. They cannot be overridden.
  $void.staticOperators = Object.create(null)

  // A lambda is another type of operation which wants the values of its arguments
  // as input, so the runtime helps to evaluate all them before invocation.
  // A lambda is an immutable entity and can be fully encoded.
  create('lambda')
  $void.lambda = function (impl, code) {
    impl.type = $.lambda
    impl.code = code
    return impl
  }

  // A function is an operation which works like a Closure. Its behaviour depends
  // on both the values of arguments and current values in its outer context.
  // A function is not explicitly alterable but its implicit context is dynamic
  // and persistent in running. So its overall state is mutable.
  // For the existence of the context, a function cannot be fully encoded. But
  // it may be automatically downgraded to a lambda when the encoding is required.
  create('function')
  $void.function = function (impl, code) {
    impl.type = $.function
    impl.code = code
    return impl
  }

  // an operator is not a first-class value, so it can only be a direct predicate.
  $void.isApplicable = function (func) {
    return typeof func === 'function' && func.type !== operator
  }

  /* Compound Types */
  /* Generally, all compound entities are mutable. */
  /* All compound entities are also fixed points of evaluation funtion. */

  // A special type to wrap an iterate function.
  create('iterator')
  var Iterator$ = $void.Iterator = function (next) {
    this.next = next
  }
  Iterator$.prototype = $.iterator.proto

  // A collection of values indexed by zero-based integers.
  create('array')

  // The object is the fundamental type of all compound entities.
  create('object')
  var Object$ = $void.Object = function (src) {
    if (src) {
      Object.assign(this, src)
    }
  }
  Object$.prototype = $.object.proto

  /*
    The Evoluation.
  */
  // Class is a meta type to create more types.
  var $Class = naming(Object.create(Type), 'class')

  // the prototype of classes is also a type.
  var $ClassProto = $Class.proto = Object.create(Type)
  $ClassProto.name = ''
  $ClassProto.type = $Class

  // A fake constructor for instanceof checking for a class.
  var ClassType$ = $void.ClassType = function () {}
  ClassType$.prototype = $ClassProto

  // the prototype of class instances is object.proto.
  var $Instance = $ClassProto.proto = Object.create($.object.proto)
  // A fake constructor for instanceof checking for an instance of a class.
  var ClassInst$ = $void.ClassInst = function () {}
  ClassInst$.prototype = $Instance

  // export the ability of creation to enable an autonomous process.
  $void.createClass = function () {
    var class_ = Object.create($ClassProto)
    // a new type should have a new nature.
    class_.proto = Object.create($Instance)
    // a proto always intrinsically knows its container type.
    defineTypeProperty(class_.proto, class_)
    return class_
  }

  // type is not enumerable.
  $void.defineProperty = defineProperty
  function defineProperty (obj, name, value) {
    Object.defineProperty ? Object.defineProperty(obj, name, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: value
    }) : (obj[name] = value)
    return value
  }

  $void.defineTypeProperty = defineTypeProperty
  function defineTypeProperty (proto, type) {
    return defineProperty(proto, 'type', type)
  }

  return $void
}
