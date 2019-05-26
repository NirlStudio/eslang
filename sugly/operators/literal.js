'use strict'

module.exports = function literal ($void) {
  var $ = $void.$
  var $Class = $.class
  var $Object = $.object
  var $Symbol = $.symbol
  var symbolOf = $Symbol.of
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var ClassType$ = $void.ClassType
  var thisCall = $void.thisCall
  var evaluate = $void.evaluate
  var arraySet = $.array.proto.set
  var staticOperator = $void.staticOperator

  var symbolPairing = $Symbol.pairing
  var symbolAll = $Symbol.all
  var symbolLiteral = $Symbol.literal
  var symbolArray = $Symbol.of('array')
  var symbolObject = $Symbol.of('object')
  var symbolClass = $Symbol.of('class')

  // (@ value ...)
  function arrayCreate (space, clist, offset) {
    var result = []
    var index, value
    while (offset < clist.length) {
      value = evaluate(clist[offset++], space)
      if (offset < clist.length && clist[offset] === symbolPairing) {
        offset += 1
        index = typeof value === 'number' ? value >> 0 : result.length
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
        name = name.key
      } else if (typeof name !== 'string') {
        if (name instanceof Tuple$) {
          name = evaluate(name, space)
        }
        if (name instanceof Symbol$) {
          name = name.key
        } else if (typeof name !== 'string') {
          name = thisCall(name, 'to-string')
        }
      }
      if (clist[offset] === symbolPairing) {
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
    if (indicator !== symbolPairing) {
      return length <= 2 || clist[2] !== symbolPairing ||
          typeof indicator === 'number' || indicator instanceof Tuple$
        ? arrayCreate(space, clist, 1) // (@ ...) or (@ offset: value ...)
        : objectCreate(space, clist, $Object, 1) // (@ name: ...) or (@ "name": ...)
    }
    // (@: ...)
    if (length < 3) { // (@:)
      return Object.create($Object.proto)
    }
    // (@:a-type ...)
    var type = clist[2]
    return type === symbolClass
      ? $Class.of(objectCreate(space, clist, $Object, 3)) // (@:class ...)
      : type === symbolLiteral || type === symbolObject
        ? objectCreate(space, clist, $Object, 3) // (@:@ ...) (@:object ...)
        : type === symbolAll || type === symbolArray
          ? arrayCreate(space, clist, 3) // (@:* ...) (@:array ...)
          : objectCreate(space, clist,
            (type = evaluate(type, space)) instanceof ClassType$
              ? type // (@:a-class ...)
              : $Object, // ignore type and treat it as a common object.
            3)
  })
}
