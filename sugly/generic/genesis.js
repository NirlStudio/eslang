'use strict'

// Publish an enumerable value to a container.
function publish (container, key, value, overridable) {
  Object.defineProperty(container, key, {
    enumerable: true,
    configurable: false,
    writable: overridable === true,
    value: value
  })
}

// Define a readonly property for an object or a function.
function define (obj, prop, value) {
  Object.defineProperty(obj, prop, {
    enumerable: false,
    configurable: false,
    writable: false, // It may be true according to security context.
    value: value
  })
}

// Assemble a global entity into its container by a name.
function assemble (container, name, entity, overridable) {
  publish(container, name, entity, overridable)
  if (entity && (typeof entity === 'object' || typeof entity === 'function') &&
    !Object.prototype.hasOwnProperty.call(entity, 'to-string')) {
    // overrride to-code function
    define(entity, 'to-code', function () {
      return name
    })
    // overrride to-string function
    define(entity, 'to-string', function () {
      return name
    })
  }
  return entity
}

// link a entity to its container by a name.
function link (container, name, entity, overridable) {
  publish(container, name, entity, overridable)
  if (typeof entity === 'function') {
    // give or override existing name.
    if (!Object.prototype.hasOwnProperty.call(entity, 'name') || !entity.name) {
      define(entity, 'name', container['to-string']() + ':' + name)
    }
  }
  return entity
}

function copy (obj, src, mapping, linker, wrapper) {
  Object.getOwnPropertyNames(mapping).forEach(function copy$map (name) {
    var value = src[name]
    if (typeof value === 'undefined') {
      console.warn(src, 'missing required property:', name)
    } else if (typeof value === 'function') {
      linker(obj, mapping[name], wrapper(value))
    } else {
      linker(obj, mapping[name], value)
    }
  })
  return obj
}

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
  // The light is the laws, which are the foundation of all beings.
  var Prototype = Object.create(Null)
  var Type$ = $void.Type = function Type$ () {
    // In both theory and reality, this function should be executed once,
    // and can only be executed once.
    // The primitive type is derived from the supreme prototype.
    define(this, 'proto', Prototype)
    // Type is the type of itself.
    define(Prototype, 'type', this)
  }
  Type$.prototype = Prototype

  /* Nameless beginning of heaven and earth, the famous mother of all things. */
  /* ... he separated the light from the darkness, */
  var Type = new Type$()

  /* ... called the light “day,”  */
  assemble($, 'Type', Type)

  /* ... and the darkness he called “night.” */
  $.null = null

  // The logical noumenon of null is not accessible directly, otherwise it will
  // cause some confusion in evalution process.
  // P.S, so is our fate either?

  /* And there was evening, and there was morning — the first day. */
  /*   - from Bible and Dao Te Ching */

  /*
    Start to build generic type system.
  */
  function create (name, superType) {
    superType = superType || Type
    var type = Object.create(superType)
    define(type, 'name', name)
    // a new type should have a new prototype.
    define(type, 'proto', Object.create(superType.proto))
    // the prototype links back to the type.
    define(type.proto, 'type', type)
    // assemble the new type to runtime space.
    assemble($, name, type)
  }

  /*
    Create primitive generic types
  */
  // A boolean type is not a prerequisite to implement boolean logic, but it
  // may help to avoid ambiguity in some cases.
  // All Bool values are fixed points of evaluation function.
  create('Bool')

  // Number is a substance type in Javascript VM. But it may be a abstract type
  // in other interpreter implementation.
  // All Number values are fixed points of evaluation function.
  create('Number')

  // The type of date and time values. It's a special object in Javascript VM.
  // But it's necessary at all. A Double value of seconds or milliseconds should
  // be enough.
  // All Date values are fixed points of evaluation function.
  create('Date')

  // String is a piece of free form text.
  // All string values are fixed points of  evaluation function.
  create('String')

  // Symbol is a semantic element so its key must comply with some lexical rules.
  // A symbol will be evaluated to its associated value or null. So it may not
  // be a fixed point.
  create('Symbol')
  // the constructor function is used to test a symbol instance with instanceof.
  var Symbol$ = $void.Symbol = function Symbol$ (key) {
    publish(this, 'key', typeof key === 'string' ? key : '')
  }
  Symbol$.prototype = $.Symbol.proto

  // Object is a compound entity which may hold fields.
  // All objects are fixed points of evaluation funtion.
  create('Object')

  // A function may dynamically produce an entity other than itself when it's
  // called. So it may not be a fixed piont.
  create('Function')

  /*
    Define more fundamental generic types.
  */
  // The type of integer values.
  create('Int', $.Number)

  // The type of real numbers.
  create('Float', $.Number)

  // The type of a number value set which select values in the range of
  // [begin, end) with a step.
  create('Range', $.Object)

  /*
    Basic Data Structures
  */
  // A collection of values indexed by zero-based continuous integers.
  create('Array', $.Object)
  // A collection of distinctive values indexed by themselves.
  create('Set', $.Object) // TODO
  // A collection of values indexed by a set of distinctive values.
  create('Map', $.Object) // TODO

  // A type to create user types which have enumerable instances based on a set
  // of names and optional values. The value part may be a zero-based integerr
  // by default, or any other type of value explicitly given.
  create('Enum', $.Object)

  // A type to create user types which creates instances based on integer values.
  // An instance of a Flags type can be resolved to its predefined flags by
  // bitwise logic.
  create('Flags', $.Object)

  // The type of a description of a object structure. It can be used to define
  // expectation and test an object strictly before accept it.
  create('Interface', $.Object)

  // A type to create extensible user types which support a build-in constructor
  // logic. Its 'define' function is different with other sub-types of Object.
  // It support derivation from callee class.
  create('Class', $.Object)

  // expose a static edition of isPrototypeOf.
  $void.isPrototypeOf = Function.prototype.call.bind(Object.prototype.isPrototypeOf)

  // expose a static edition of hasOwnProperty.
  $void.ownsProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty)

  // add a method to create user types.
  $void.createUserType = function $createUserType (superType) {
    var type = Object.create(superType)
    publish(type, 'name', '', true)
    define(type, 'proto', Object.create(superType.proto))
    define(type.proto, 'type', type)
    return type
  }

  // add a method to inject properties to system prototypes.
  $void.injectTo = function injectTo (type, name, value) {
    define(type.prototype, name, value)
  }

  // safely get managed type from an object.
  $void.typeOf = function typeOf (value) {
    if (typeof value === 'undefined' || value === null) {
      return null
    }
    if (typeof value === 'number') {
      return Number.isInteger(value) ? $.Int : $.Float
    } else {
      return value.type || Type // unknown & not-null
    }
  }

  // safely test a value with a type.
  $void.instanceOf = function instanceOf (value, type) {
    var isA = typeof value === 'undefined' || value === null
      ? Null['is-a'] : value['is-a'] ||
        (value.type && value.type.proto && value.type.proto['is-a'])
    return typeof isA === 'function' ? isA.call(value, type) : false
  }

  // safely test the equivalency of two values.
  $void.isEqual = function isEqual (left, right) {
    if (left === right) {
      return true // shortcut for most of cases.
    }
    if (typeof left === 'undefined') {
      left = null
    }
    var equals = left.equals ||
      (left.type && left.type.proto && left.type.proto.equals)
    if (typeof equals === 'function') {
      return equals.call(left, right) === true
    }
    return false
  }

  // export an entity as a constant field in a contaier.
  $void.constant = function $constant (container, name, entity) {
    return assemble(container, name, entity)
  }

  // export an entity as a constant field in a contaier.
  $void.variable = function $variable (container, name, entity) {
    return assemble(container, name, entity, true)
  }

  // define an entity as a readonly property of container.
  $void.readonly = function $readonly (container, name, entity) {
    return link(container, name, entity)
  }

  // define an entity as a overridable property of container.
  $void.virtual = function $virtual (container, name, entity) {
    return link(container, name, entity, true)
  }

  $void.copyObject = function $copyObject (obj, src, mapping) {
    return copy(obj, src, mapping, $void.readonly,
      function funcWrapper (func) {
        return function () {
          return func.apply(src, arguments)
        }
      }
    )
  }

  $void.copyProto = function $copyProto (obj, src, verify, mapping) {
    return copy(obj.proto, src.prototype, mapping, $void.readonly,
      function methodWrapper (method) {
        return function () {
          return verify(this) ? method.apply(this, arguments) : null
        }
      }
    )
  }

  return $void
}
