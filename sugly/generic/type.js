'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.type
  var $Symbol = $.symbol
  var $Object = $.object
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var indexerOf = $void.indexerOf
  var link = $void.link

  /* The Supreme Prototype */
  var proto = Type.proto

  // Identity inherits null.
  // Equivalence inherits null.
  // Ordering inherits null.

  // Type Verification: Any non-empty value is an instance of its type.
  link(proto, 'is-a', function (type) {
    return this.type === type
  })
  link(proto, 'is-not-a', function (type) {
    return this.type !== type
  })

  // Emptiness needs to be customized by each type.

  // Encoding inherits null.

  // Representation and Description need be customized by each type.

  // Indexer: default readonly accessor for all types.
  // all value types' protos must provide a customized indexer.
  link(proto, ':', function proto$indexer (index) {
    var name = typeof index === 'string' ? index
      : index instanceof Symbol$ ? this[index.key] : ''
    return name === 'proto' ? this.objectify() : this[name]
  })

  // Retrieve the real type of an entity.
  link(Type, 'of', function (entity) {
    return typeof entity === 'undefined' || entity === null ? null : entity.type
  })

  // Retrieve the type indexer of an entity.
  link(Type, 'indexer-of', indexerOf)

  // Type Reflection: Convert this type to a type descriptor object.
  link(Type, 'objectify', function () {
    var typeDef = $Object.empty()
    var name
    for (name in this.proto) {
      if (name !== 'type') {
        typeDef[name] = this.proto[name]
      }
    }
    var typeStatic = typeDef.static = $Object.empty()
    for (name in this) {
      if (name !== 'proto') {
        typeStatic[name] = this[name]
      }
    }
    return typeDef
  })

  // Type Reflection: Extend this type with one or more type descriptor objects.
  link(Type, 'typify', function () {
    for (var i = 0; i < arguments.length; i++) {
      var typeDef = arguments[i]
      var props = typeDef instanceof Object$
        ? Object.getOwnPropertyNames(typeDef) : []
      for (var j = 0; j < props.length; j++) {
        var prop = props[j]
        if (prop === 'static') {
          var typeStatic = typeDef.static
          var sprops = typeStatic instanceof Object$
            ? Object.getOwnPropertyNames(typeStatic) : []
          for (var k = 0; k < sprops.length; k++) {
            var sprop = sprops[k]
            if (typeof this[sprop] === 'undefined') {
              this[sprop] = typeStatic[sprop]
            }
          }
        } else if (typeof this.proto[prop] === 'undefined') {
          this.proto[prop] = typeDef[prop]
        }
      }
    }
    return this
  })

  // Type Verification: Any type is a type.
  link(Type, 'is-a', function (type) {
    return Type === type
  })
  link(Type, 'is-not-a', function (type) {
    return Type !== type
  })

  // Emptiness for types:
  //  The primal type is taken as an empty entity.
  //  Any other type is not empty.
  link(Type, 'is-empty', function () {
    return this === Type
  })
  link(Type, 'not-empty', function () {
    return this !== Type
  })

  // Encoding a type by its name
  link(Type, 'to-code', function () {
    return typeof this.name === 'string'
      ? $Symbol['of-shared'](this.name) : $Symbol.empty
  })

  // Description for all types
  link(Type, 'to-string', function () {
    return typeof this.name === 'string' ? this.name : '?type'
  })
}
