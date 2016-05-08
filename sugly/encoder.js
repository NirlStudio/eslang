'use strict'

function exportTo (container, name, obj) {
  obj.identityName = '(' + container.identityName + ' "' + name + '")'

  container[name] = obj
  return obj
}

function encoder ($, pretty) {
  var $Symbol = $.Symbol
  var symbolIs = $Symbol.is
  var symbolValueOf = $Symbol['value-of']
  var symbolKeyOf = $Symbol['key-of']

  var SymbolContext = symbolValueOf('$')
  var SymbolFor = symbolValueOf('for')

  var indentStack = []
  var indentValue = ''
  var indentTouched = true

  function getIndent () {
    indentTouched = true
    return indentValue
  }

  function increaseIndent () {
    if (!pretty) {
      return
    }
    indentStack.push([indentValue, indentTouched])
    if (indentTouched) {
      indentValue += '  '
      indentTouched = false
    }
  }

  function decreaseIndent () {
    if (!pretty || indentStack.length < 1) {
      return
    }

    var last = indentStack.pop()
    indentValue = last[0]
    indentTouched = last[1]
  }

  function encodeString (str) {
    return JSON.stringify(str)
  }

  function encodeSymbol (sym) {
    var key = symbolKeyOf(sym)
    return key.length > 0 ? '(` ' + key + ')' : ''
  }

  function encodeNumber (num) {
    return num.toString()
  }

  function encodeBool (bool) {
    return bool ? 'true' : 'false'
  }

  function encodeDate (date) {
    return '(date ' + date.getTime() + ')'
  }

  function encodeObject (obj) {
    if (Object.prototype.hasOwnProperty.call(obj, 'identityName')) {
      return obj.identityName
    }

    var code = '(@'
    var pt = Object.getPrototypeOf(obj)
    if (pt.hasOwnProperty('identityName') && typeof pt.identityName === 'string') {
      code += pt.identityName + ' >'
    }

    var keys = Object.getOwnPropertyNames(obj)
    if (keys.length < 1) {
      return code.endsWith('>') ? code + ')' : code + '>)'
    }

    increaseIndent()
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      if (key.startsWith('$') || key.startsWith('__')) {
        continue
      }
      code += (code.length < 3 ? '' : '\n' + getIndent()) + key + ': '
      code += encodeValue(obj[key])
    }
    decreaseIndent()
    return code + ')'
  }

  function encodeNativeFunction (func) {
    // encode anonymous function to null.
    return func.hasOwnProperty('identityName') ? func.identityName : 'null'
  }

  function encodeSuglyFunction (func) {
    if (func.hasOwnProperty('identityName')) {
      return func.identityName
    }

    var code = '(= '
    var enclosing = func.$enclosing
    if (enclosing) {
      var obj = encodeObject(enclosing)
      if (obj.length > 4) { // not an empty onject.
        code += obj + ' > '
      }
    }

    code += '('
    var params = func.$params
    var i = 0
    for (; i < params.length; i++) {
      if (i > 0) {
        code += ' '
      }
      var p = params[i]
      if (p[1] === null) {
        code += symbolKeyOf(p[0])
      } else {
        code += '(' + symbolKeyOf(p[0]) + ' ' + encodeValue(p[1]) + ')'
      }
    }

    if (!func.$fixedArgs) {
      code += i > 0 ? ' *' : '*'
    }
    code += ')'

    code += encodeProgram(func.$body, true)
    return code + ')'
  }

  function encodeFunction (func) {
    return func.$params && func.$body ? encodeSuglyFunction(func) : encodeNativeFunction(func)
  }

  function encodeArray (array) {
    var code = '(@'
    for (var i = 0; i < array.length; i++) {
      code += ' ' + encodeValue(array[i])
    }
    return code + ')'
  }

  // encode anything as its literally
  function encodeValue (value) {
    if (Array.isArray(value)) {
      return encodeArray(value)
    }
    if (value instanceof Date) {
      return encodeDate(value)
    }

    switch (typeof value) {
      case 'boolean':
        return encodeBool(value)
      case 'number':
        return encodeNumber(value)
      case 'string':
        return encodeString(value)
      case 'symbol':
        return encodeSymbol(value)
      case 'object':
        if (value === null) {
          return 'null'
        }
        return symbolIs(value) ? encodeSymbol(value) : encodeObject(value)
      case 'function':
        return encodeFunction(value)
      default:
        return 'null' // unknown enitities
    }
  }

  function encodeProgram (clauses, inFunc) {
    var code = ''
    if (inFunc) {
      increaseIndent()
    }
    for (var i = 0; i < clauses.length; i++) {
      var c = clauses[i]
      if (Array.isArray(c) && i > 0 && !code.endsWith('>')) {
        code += '\n'
        if (inFunc) {
          code += getIndent()
        }
      } else if (inFunc || i > 0) {
        code += ' '
      }
      c = encodeClause(c)
      if (inFunc) {
        code += c
      } else {
        // try to simplify ending parentheses
        var j = c.length
        for (; j > 0; j--) {
          if (c.charAt(j - 1) !== ')') {
            break
          }
        }
        code += j < c.length - 1 ? c.substring(0, j + 1) + '.' : c
      }
    }
    if (inFunc) {
      decreaseIndent()
    }
    return code
  }

  // value, symbol or clause
  function encodeClause (clause) {
    if (!Array.isArray(clause)) {
      if (symbolIs(clause)) {
        return symbolKeyOf(clause)
      } else {
        return encodeValue(clause)
      }
    }

    var length = clause.length
    if (length < 1) {
      return '()'
    }

    // subject
    var c0 = clause[0]
    var beginNewLine = c0 === SymbolContext || c0 === SymbolFor ? 2 : 1
    var code = '(' + encodeClause(c0)

    // predicate & objects
    increaseIndent()
    for (var i = 1; i < clause.length; i++) {
      var c = clause[i]
      if (i === 1) {
        if (c0 === SymbolContext) {
          code += encodeClause(c)
        } else {
          code += ' ' + encodeClause(c)
        }
      } else {
        code += (Array.isArray(c) && i > beginNewLine && !code.endsWith('>') ? '\n' + getIndent() : ' ') + encodeClause(c)
      }
    }
    decreaseIndent()
    return code + ')'
  }

  // encode a piece of program(clauses): [[]]
  function encode (clauses) {
    return Array.isArray(clauses) ? encodeProgram(clauses, false) : '()'
  }

  // export functions
  encode.identityName = '($"encode")'

  exportTo(encode, 'string', function (str) {
    if (typeof str === 'undefined' || str === null) {
      return 'null' // null is always possible.
    }
    return typeof str !== 'string' ? '""' : encodeString(str)
  })

  exportTo(encode, 'symbol', function (sym) {
    if (typeof sym === 'undefined' || sym === null) {
      return 'null' // null is always possible.
    }
    return encodeSymbol(sym)
  })

  exportTo(encode, 'number', function (num) {
    if (typeof num === 'undefined' || num === null) {
      return 'null' // null is always possible.
    }
    return typeof num !== 'number' ? 'NaN' : encodeNumber(num)
  })

  exportTo(encode, 'bool', function (bool) {
    if (typeof bool === 'undefined' || bool === null) {
      return 'null' // null is always possible.
    }
    return typeof bool !== 'boolean' ? 'false' : encodeBool(bool)
  })

  exportTo(encode, 'date', function (date) {
    if (typeof date === 'undefined' || date === null) {
      return 'null' // null is always possible.
    }
    return date instanceof Date ? encodeDate(date) : '(date 0)'
  })

  exportTo(encode, 'object', function (obj) {
    if (typeof obj === 'undefined' || obj === null) {
      return 'null' // null is always possible.
    }
    if (typeof obj !== 'object' || symbolIs(obj)) {
      return '(@>)' // empty object for non-object
    }
    // array and date are valid objects.
    if (Array.isArray(obj)) {
      return encodeArray(obj)
    }
    if (obj instanceof Date) {
      return encodeDate(obj)
    }
    return encodeObject(obj)
  })

  exportTo(encode, 'function', function (func) {
    return typeof func !== 'function' ? 'null' : encodeFunction(func)
  })

  exportTo(encode, 'array', function (arr) {
    if (typeof arr === 'undefined' || arr === null) {
      return 'null' // null is always possible.
    }
    return Array.isArray(arr) ? encodeArray(arr) : '(@)'
  })

  exportTo(encode, 'value', encodeValue)
  exportTo(encode, 'clause', encodeClause)
  return encode
}

encoder.identityName = '($"encoder")'
module.exports = encoder
