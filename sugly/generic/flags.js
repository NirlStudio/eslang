'use strict'

var MAX_FLAGS = 32

function defineFlags ($void) {
  var Flags = $void.$.Flags
  var readonly = $void.readonly
  var createUserType = $void.createUserType

  return function Flags$define (table) {
    var keys
    var values = []
    if (Array.isArray(table)) { // only keys
      if (table.length > MAX_FLAGS) {
        table = table.slice(0, MAX_FLAGS)
      }
      keys = []
      var value = 1
      table.forEach(function (key) {
        if (typeof key === 'string') {
          keys.push(key)
          values.push(value) // use key's offset as value
        }
        value *= 2
      })
    } else { // keys & values
      keys = Object.getOwnPropertyNames(table)
      keys.forEach(function (key) {
        values.push(Number.isInteger(table[key]) ? table[key] : 0 /* never resolved to */)
      })
    }

    // one key at least
    if (keys.length < 1) {
      return null
    }

    // create flags type and entries.
    var type = createUserType(Flags)
    var flags = []
    for (var i = 0; i < keys.length; i++) {
      var flag = Object.create(type.proto)
      type[flag.key = keys[i]] = flag
      flag.value = values[i]
      flags.push(flag)
    }
    // return all flags.
    readonly(type, 'get-all', function FlagsType$getAll () {
      return flags.slice()
    })
    // return all flag keys.
    readonly(type, 'get-keys', function FlagsType$getKeys () {
      return keys.slice()
    })
    // return all flag values.
    readonly(type, 'get-values', function FlagsType$getValues () {
      return values.slice()
    })

    // resolve to individual flags
    readonly(type, 'resolve', function flags$resolve (value) {
      if (isPrototypeOf(Flags.proto, value)) {
        value = value.value
      }
      var list = []
      if (Number.isInteger(value)) {
        for (var i = 0; i < flags.length; i++) {
          if (value & values[i] !== 0) {
            list.push(flags[i])
          }
        }
      }
      return list
    })

    return type
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Flags
  var proto = type.proto
  var virtual = $void.virtual
  var readonly = $void.readonly
  var isPrototypeOf = $void.isPrototypeOf

  // override create method to create a new enum type.
  readonly(type, 'define', defineFlags($void))

  // override equivalency logic to compare value only.
  readonly(proto, 'equals', function enum$equals (another) {
    return isPrototypeOf(proto, another) ? this.value === another.value : false
  })

  virtual(proto, 'to-string', function enum$toString () {
    var typeName = this.type && typeof this.type.name === 'string'
      ? this.type.name : type.name
    return '(' + typeName + ':' + this.key + ')'
  })

  // emptiness is defined to null or zero.
  readonly(proto, 'is-empty', function enum$isEmpty () {
    return typeof this.value === 'undefined' ||
      this.value === null || this.value === 0
  })
  readonly(proto, 'not-empty', function date$notEmpty () {
    return typeof this.value !== 'undefined' &&
      this.value !== null && this.value !== 0
  })
}
