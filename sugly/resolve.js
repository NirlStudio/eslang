'use strict'

module.exports = function ($) {
  var $Null = $.Null
  var $bool = $.Bool.$
  var $int = $.Int.$
  var $float = $.Float.$

  var $string = $.String.$
  var $Symbol = $.Symbol
  var $symbol = $Symbol.$

  var $object = $.Object.$
  var $func = $.Function.$

  var $date = $.Date.$
  var $array = $.Array.$

  return function resolve (subject, key) {
    if (typeof subject === 'undefined' || subject === null) {
      return $Null[key]
    }

    if (subject.hasOwnProperty && subject.hasOwnProperty(key)) {
      return subject[key]
    }

    if (subject.$has && subject.$has(key)) {
      return subject[key]
    }

    switch (typeof subject) {
      case 'boolean':
        return $bool[key]
      case 'number':
        return Number.isInteger(subject) ? $int[key] : $float[key]
      case 'string':
        return $string[key]
      case 'symbol':
        return $symbol[key]
      case 'function':
        return $func[key]
      case 'object':
        if (Array.isArray(subject)) {
          return $array[key]
        } else if (subject instanceof Date) {
          return $date[key]
        } else if ($Symbol.is(subject)) {
          return $symbol[key]
        }
        var value = subject[key]
        return typeof value === 'undefined' ? $object[key] : value
      default:
        return $Null[key]
    }
  }
}
