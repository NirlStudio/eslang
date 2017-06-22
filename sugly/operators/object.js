'use strict'

module.exports = function operators$object ($void) {
  var $ = $void.$
  var $Class = $.class
  var $Object = $.object
  var $Symbol = $.symbol
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var ClassType$ = $void.ClassType
  var staticOperator = $void.staticOperator
  var staticObjectFields = $void.staticObjectFields

  // (@ value ...)
  function arrayCreate (space, clist, offset) {
    var result = []
    while (offset < clist.length) {
      result.push(evaluate(clist[offset], space))
      offset += 1
    }
    return result
  }

  // (@ symbol: value ...)
  function objectCreate (space, clist, type, offset) {
    var data = Object.create($Object.proto)
    var length = clist.length
    offset += 1 // moving to the first ':'
    while (offset < length && clist[offset] === $Symbol.pairing) {
      var name = clist[offset - 1]
      if (name instanceof Symbol$) {
        name = name.key
      } else {
        offset += 3 // try next pair
        continue // ignore unknow name type.
      }
      if (staticObjectFields[name]) {
        offset += 3 // try next pair
        continue // ignore reserved field names.
      }
      offset += 1
      data[name] = offset < length ? evaluate(clist[offset], space) : null
      offset += 2 // jump to next ':'
    }
    // restore data to its type.
    if (type !== $Object) {
      var obj = type.empty()
      obj['='](data) // copy data to typed object.
      return obj
    }
    return data
  }

  // (@set value ...)
  function setCreate (space, clist, offset) {
    var result = new Set()
    while (offset < clist.length) {
      result.add(evaluate(clist[offset], space))
      offset += 1
    }
    return result
  }

  // (@map key: value)
  function mapCreate (space, clist, offset) {
    var map = new Map()
    var length = clist.length
    offset += 1 // moving to the first ':'
    while (offset < length && clist[offset] === $Symbol.pairing) {
      var key = evaluate(clist[offset - 1], space)
      offset += 1
      map.set(key, offset < length ? evaluate(clist[offset], space) : null)
      offset += 2 // jump to next ':'
    }
    return map
  }

  // (@class super: parent-class  type: (@ ...) symbol: value)
  function classCreate (space, clist, offset) {
    var super_ = null
    var type = null
    var proto = Object.create($Object.proto)
    var length = clist.length
    offset += 1 // moving to the first ':'
    while (offset < length && clist[offset] === $Symbol.pairing) {
      var name = clist[offset - 1]
      if (name instanceof Symbol$) {
        name = name.key
      } else {
        offset += 3 // try next pair
        continue // ignore unknow name type.
      }
      offset += 1
      var value = offset < length ? evaluate(clist[offset], space) : null
      if (name === 'super') {
        super_ = value
      } else if (name === 'type') {
        type = value
      } else if (!staticObjectFields[name]) {
        proto[name] = value
      }
      offset += 2 // jump to next ':'
    }
    return $Class.of(super_, type, proto)
  }

  staticOperator('@', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) { // (@)
      return []
    }
    if (clist[1] === $Symbol.pairing) {
      if (length < 3) { // (@:)
        return Object.create($Object.proto)
      }
      var type = clist[2]
      if (type instanceof Symbol$) { // static object types
        switch (type.key) {
          case 'array':
            return arrayCreate(space, clist, 3)
          case 'object':
            return objectCreate(space, clist, $Object, 3)
          case 'set':
            return setCreate(space, clist, 3)
          case 'map':
            return mapCreate(space, clist, 3)
          case 'class':
            return classCreate(space, clist, 3)
          default: // as a common class type
            break
        }
      }
      type = evaluate(clist[2], space)
      if (type instanceof ClassType$) { // (@user-type )
        return objectCreate(space, clist, type, 3)
      }
      return null // invalid type value.
    }
    if (length > 2 && clist[2] === $Symbol.pairing) { // (@ ? :)
      return objectCreate(space, clist, $Object, 3)
    } else { // as array
      return arrayCreate(space, clist, 1)
    }
  })
}
