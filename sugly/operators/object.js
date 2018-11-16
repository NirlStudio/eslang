'use strict'

module.exports = function object ($void) {
  var $ = $void.$
  var $Array = $.array
  var $Class = $.class
  var $Object = $.object
  var $Symbol = $.symbol
  var symbolOf = $Symbol.of
  var Symbol$ = $void.Symbol
  var ClassType$ = $void.ClassType
  var evaluate = $void.evaluate
  var arraySet = $.array.proto.set
  var staticOperator = $void.staticOperator

  // (@ value ...)
  function arrayCreate (space, clist, offset) {
    var result = []
    var index, value
    while (offset < clist.length) {
      value = evaluate(clist[offset], space)
      offset += 1
      if (offset < clist.length && clist[offset] === $Symbol.pairing) {
        index = value >> 0; offset += 1
        arraySet.call(result, index, offset >= clist.length ? null
          : evaluate(clist[offset++], space)
        )
      } else {
        result.push(value)
      }
    }
    return result
  }

  // (@ symbol: value ...)
  function objectCreate (space, clist, type, offset) {
    var obj = type.empty()
    var length = clist.length
    while (offset < length) {
      var name = clist[offset++]
      if (name instanceof Symbol$) {
        if (name === $Symbol.pairing) {
          continue
        }
        name = name.key
      } else if (typeof name !== 'string') {
        name = evaluate(name, space)
        if (name instanceof Symbol$) {
          if (name === $Symbol.pairing) {
            continue
          }
          name = name.key
        } else if (typeof name !== 'string') {
          continue
        }
      }
      if (clist[offset] === $Symbol.pairing) {
        obj[name] = ++offset < length ? evaluate(clist[offset++], space) : null
      } else {
        obj[name] = evaluate(symbolOf(name), space)
      }
    }
    // activate a typed object
    var activator = type.proto.activator
    if (typeof activator === 'function') {
      activator.call(obj, obj)
    }
    return obj
  }

  staticOperator('@', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) { // (@)
      return []
    }
    var indicator = clist[1]
    if (indicator === $Symbol.pairing) {
      if (length < 3) { // (@:)
        return Object.create($Object.proto)
      }
      var type = evaluate(clist[2], space) // (@:type-or-factory )
      return type === $Class
        ? $Class.of(objectCreate(space, clist, $Object, 3))
        : type instanceof ClassType$
          ? objectCreate(space, clist, type, 3)
          : type === $Array
            ? arrayCreate(space, clist, 3)
            : objectCreate(space, clist, $Object, 3)
    }
    if (length > 2 && clist[2] === $Symbol.pairing &&
        (typeof indicator === 'string' || indicator instanceof Symbol$)
    ) { // (@ ? :)
      return objectCreate(space, clist, $Object, 1)
    } else { // as array
      return arrayCreate(space, clist, 1)
    }
  })
}
