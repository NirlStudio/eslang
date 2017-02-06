'use strict'

function defineEnum ($void) {
  var Enum = $void.$.Enum
  var $Object = $void.$.Object
  var readonly = $void.readonly
  var isPrototypeOf = $void.isPrototypeOf
  var createUserType = $void.createUserType

  return function Enum$define (table) {
    var keys = []
    var values = []
    if (Array.isArray(table)) { // only keys
      table.forEach(function (key) {
        if (typeof key === 'string') {
          keys.push(key)
          values.push(values.length) // use key's offset as value
        }
      })
    } else if (isPrototypeOf($Object.proto, table)) { // keys & values
      keys = Object.getOwnPropertyNames(table)
      keys.forEach(function (key) {
        values.push(table[key])
      })
    }

    if (keys.length < 1) {
      return null
    }

    var type = createUserType(Enum)
    var entries = []
    for (var i = 0; i < keys.length; i++) {
      var entry = Object.create(type.proto)
      type[entry.key = keys[i]] = entry
      entry.value = values[i]
      entries.push(entry)
    }

    // return all enum entries.
    readonly(type, 'get-all', function EnumType$getAll () {
      return entries.slice()
    })
    // return all enum keys.
    readonly(type, 'get-keys', function EnumType$getKeys () {
      return keys.slice()
    })
    // return all enum values.
    readonly(type, 'get-values', function EnumType$getValues () {
      return values.slice()
    })
    return type
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Enum
  var proto = type.proto
  var virtual = $void.virtual
  var readonly = $void.readonly
  var isPrototypeOf = $void.isPrototypeOf

  // add a define method to create a new enum type.
  readonly(type, 'define', defineEnum($void))

  // override equivalency logic to compare value only.
  readonly(proto, 'equals', function enum$equals (another) {
    if (!isPrototypeOf(proto, another)) {
      return false
    }
    if (this.value === another.value) {
      return true
    }
    if (typeof this.equals === 'function') {
      return this.equals(another) === true
    }
    return false
  })

  virtual(proto, 'to-string', function enum$toString () {
    var typeName = this.type && typeof this.type.name === 'string'
      ? this.type.name : type.name
    return '(' + typeName + ':' + this.key + ')'
  })

  virtual(proto, 'is-empty', function enum$isEmpty () {
    return typeof this.value === 'undefined' || this.value === null
  })
  virtual(proto, 'not-empty', function enum$notEmpty () {
    return typeof this.value !== 'undefined' && this.value !== null
  })
}
