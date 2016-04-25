'use strict'

function exportTo (container, name, obj) {
  obj.identityName = '(' + container.identityName + ' "' + name + '")'

  container[name] = obj
  return obj
}

function encoder (pretty) {
  var indent = ''
  function increaseIndent () {
    if (pretty) {
      indent += '  '
    }
  }
  function decreaseIndent () {
    if (pretty && indent.length >= 2) {
      indent = indent.substring(0, indent.length - 2)
    }
  }

  function encodeString (str) {
    return JSON.stringify(str)
  }

  function encodeSymbol (sym) {
    return '(` ' + Symbol.keyFor(sym) + ')'
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
    if (obj.identityName) {
      return obj.identityName
    }

    var code = '(@'
    if (obj.typeIdentifier) {
      code += obj.typeIdentifier + '>'
    }

    var keys = Object.getOwnPropertyNames(obj)
    if (keys.length < 1) {
      return code.endsWith('>') ? code + ')' : code + '>)'
    }

    increaseIndent()
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      code += (i === 0 ? '' : '\n' + indent) + key + ': '
      code += encodeValue(obj[key])
    }
    decreaseIndent()
    return code + ')'
  }

  function encodeNativeFunction (func) {
    // encode anonymous function to null.
    return func.identityName || func.name || null
  }

  function encodeSuglyFunction (func) {
    if (func.identityName) {
      return func.identityName
    }

    var code = '(='
    var enclosing = func.$enclosing
    if (enclosing && typeof enclosing === 'object') {
      var obj = encodeObject(enclosing)
      if (obj.length > 4) { // not an empty onject.
        code += ' ' + obj + ' > '
      } else {
        // enclosing an empty object, a null is equivilant here.
        code += ' () > '
      }
    }
    code += '('

    var params = func.$params
    for (var i = 0; i < params.length; i++) {
      var p = params[i]
      if (p[1] === null) {
        code += Symbol.keyFor(p[0]) + ' '
      } else {
        code += '(' + Symbol.keyFor(p[0]) + ' ' + encodeValue(p[1]) + ') '
      }
    }
    if (!func.$fixedArgs) {
      code += '*'
    }
    code += ')'

    code += encodeProgram(func.$body)
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
        return value === null ? 'null' : encodeObject(value)
      case 'function':
        return encodeFunction(value)
      default:
        return 'null' // unknown enitities
    }
  }

  function encodeProgram (clauses) {
    var code = ''
    increaseIndent()
    for (var i = 0; i < clauses.length; i++) {
      var c = clauses[i]
      code += (Array.isArray(c) ? '\n' + indent : ' ') + encodeClause(c)
    }
    decreaseIndent()
    return code
  }

  // value, symbol or clause
  function encodeClause (clause) {
    if (!Array.isArray(clause)) {
      if (typeof clause === 'symbol') {
        return Symbol.keyFor(clause)
      } else {
        return encodeValue(clause)
      }
    }

    var length = clause.length
    if (length < 1) {
      return '()'
    }

    // subject
    var code = '(' + encodeClause(clause[0]) + ' '

    // predicate & objects
    for (var i = 1; i < clause.length; i++) {
      code += encodeClause(clause[i]) + ' '
    }
    return code + ')'
  }

  // encode a piece of program(clauses): [[]]
  function encode (clauses) {
    return Array.isArray(clauses) ? encodeProgram(clauses) : '()'
  }

  // export functions
  encode.identityName = '($"encode")'

  exportTo(encode, 'string', function (str) {
    return typeof str !== 'string' ? '""' : encodeString(str)
  })

  exportTo(encode, 'symbol', function (sym) {
    return typeof sym !== 'symbol' ? '' : encodeSymbol(sym)
  })

  exportTo(encode, 'number', function (num) {
    return typeof num !== 'number' ? 'NaN' : encodeNumber(num)
  })

  exportTo(encode, 'bool', function (bool) {
    return typeof bool !== 'boolean' ? 'false' : encodeBool(bool)
  })

  exportTo(encode, 'date', function (date) {
    return date instanceof Date ? encodeDate(date) : '(date 0)'
  })

  exportTo(encode, 'object', function (obj) {
    if (typeof obj !== 'object') {
      return '(@>)' // empty object
    }
    return obj === null ? 'null' : encodeObject(obj)
  })

  exportTo(encode, 'function', function (func) {
    return typeof func !== 'function' ? 'null' : encodeFunction(func)
  })

  exportTo(encode, 'array', function (arr) {
    return Array.isArray(arr) ? encodeArray(arr) : '(@)'
  })

  exportTo(encode, 'value', encodeValue)
  exportTo(encode, 'clause', encodeClause)
  return encode
}

encoder.identityName = '($"encoder")'
module.exports = encoder
