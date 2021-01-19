'use strict'

module.exports = function typeIn ($void) {
  var $ = $void.$
  var Type = $.type
  var $Symbol = $.symbol
  var $Object = $.object
  var Null = $void.null
  var Symbol$ = $void.Symbol
  var link = $void.link
  var typeOf = $void.typeOf
  var bindThis = $void.bindThis
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf

  /* The Supreme Prototype */
  var proto = Type.proto

  // Identity inherits null.
  // Equivalence inherits null.
  // Ordering inherits null.

  // Type Verification: Any non-empty value is an instance of its type.
  link(proto, ['is-a', 'is-an'], function (type) {
    return typeOf(this) === type
  })
  link(proto, ['is-not-a', 'is-not-an'], function (type) {
    return typeOf(this) !== type
  })

  // Emptiness needs to be customized by each type.

  // Encoding inherits null.

  // Representation and Description need be customized by each type.

  // Indexer: default read-only accessor for all types.
  // all value types' proto must provide a customized indexer.
  var indexer = link(proto, ':', function (index) {
    var name = typeof index === 'string' ? index
      : index instanceof Symbol$ ? index.key : ''
    return name === 'proto' ? this.reflect()
      : name !== 'indexer' ? protoValueOf(this, this, name)
        : bindThis(isApplicable(this.empty) ? this.empty() : this.empty,
          this.indexer
        )
  })
  indexer.get = function (key) {
    return key === 'proto' ? this.reflect()
      : key === 'indexer' ? null : this[key]
  }

  // the type is its own empty value.
  link(Type, 'empty', Type)

  // Retrieve the real type of an entity.
  link(Type, 'of', typeOf, true)

  // Retrieve the indexer for this type's instances.
  link(Type, 'indexer', indexer)

  // Type Reflection: Convert this type to a type descriptor object.
  link(Type, 'reflect', function (entity) {
    var typeDef = $Object.empty()
    var name
    if (this === Type && entity === null) {
      for (name in Null) {
        typeDef[name] = bindThis(null, Null[name])
      }
      typeDef.type = null
      return typeDef
    }

    var proto_ = this.proto
    var value, thisEmpty
    if (typeOf(entity) === this) {
      thisEmpty = entity
    }
    for (name in proto_) {
      if (name !== 'type' && typeof proto[name] === 'undefined') {
        value = proto_[name]
        typeDef[name] = !isApplicable(value) ? value
          : bindThis(typeof thisEmpty !== 'undefined' ? thisEmpty
            : (thisEmpty = isApplicable(this.empty) ? this.empty() : this.empty)
          , value)
      }
    }
    var typeStatic = typeDef.type = $Object.empty()
    for (name in this) {
      if (name !== 'proto' && name !== 'type' && typeof proto[name] === 'undefined') {
        value = this[name]
        typeStatic[name] = !isApplicable(value) ? value
          : bindThis(name !== 'indexer' ? this
            : typeof thisEmpty !== 'undefined' ? thisEmpty
              : (thisEmpty = isApplicable(this.empty) ? this.empty() : this.empty)
          , value)
      }
    }
    return typeDef
  })

  // Mutability
  link(Type, 'seal', function () {
    return this
  })
  link(Type, 'is-sealed', function () {
    return true // all primary types are sealed.
  })

  // Type Verification: Any type is a type.
  link(Type, ['is-a', 'is-an'], function (type) {
    return Type === type
  }, true)
  link(Type, ['is-not-a', 'is-not-an'], function (type) {
    return Type !== type
  }, true)

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
      ? sharedSymbolOf(this.name) : $Symbol.empty
  })

  // Description for all types
  link(Type, 'to-string', function () {
    return typeof this.name === 'string' ? this.name : ''
  })
}
