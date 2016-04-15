'use strict'

const SymbolIdentityName = Symbol.for('identityName')
const SymbolTypeIdentifier = Symbol.for('typeIdentifier')

function exportTo (container, name, obj) {
  var owner = container[SymbolIdentityName]
  obj[SymbolIdentityName] = '(' + owner + ' "' + name + '")'

  container[name] = obj
  container[Symbol.for(name)] = obj
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
    return '($date ' + date.toString() + ')'
  }

  function encodeObject (obj) {
    var identityName = obj[SymbolIdentityName]
    if (identityName) {
      return identityName
    }

    var code = '(@'
    var typeIdentifier = obj[SymbolTypeIdentifier]
    if (typeIdentifier) {
      code += typeIdentifier + '>'
    }

    var keys = Object.getOwnPropertySymbols(obj)
    if (keys.length < 1) {
      return code.endsWith('>') ? code + ')' : code + '>)'
    }

    increaseIndent()
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      code += (i === 0 ? '' : '\n' + indent) + Symbol.keyFor(key) + ': '
      code += encodeValue(obj[key])
    }
    decreaseIndent()
    return code + ')'
  }

  function encodeNativeFunction (func) {
    // encode anonymous function to null.
    return func[SymbolIdentityName] || func.name || null
  }

  function encodeSuglyFunction (func) {
    if (func.hasOwnProperty(SymbolIdentityName)) {
      var name = func[SymbolIdentityName]
      if (name) {
        return name
      }
    }

    var code = '(='
    if (func.enclosing) {
      var obj = encodeObject(func.enclosing)
      if (obj.length > 4) {
        code += ' ' + obj + ' > '
      } else {
        // enclosing an empty object, a null is equivilant here.
        code += ' () > '
      }
    }
    code += '('

    for (let i = 0; i < func.params.length; i++) {
      var p = func.params[i]
      if (p[1] == null) {
        code += Symbol.keyFor(p[0]) + ' '
      } else {
        code += '(' + Symbol.keyFor(p[0]) + ' '
        code += encode(p[1]) + ') '
      }
    }
    if (!func.fixedArgs) {
      code += '*'
    }
    code += ')'

    increaseIndent()
    for (let i = 0; i < func.body.length; i++) {
      var c = func.body[i]
      code += (Array.isArray(c) ? '\n' + indent : ' ') + encodeClause(c)
    }
    decreaseIndent()
    return code + ')'
  }

  function encodeFunction (func) {
    return func.params && func.body ? encodeSuglyFunction(func) : encodeNativeFunction(func)
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
        return 'null'
    }
  }

  function encodeProgram (program) {
    // TODO - value-based clauses
    return '()'
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
    if (!Array.isArray(clauses)) {
      return '(console log "Invalid program:" ' + encode.value(clauses) + ')'
    }

    var code = ''
    for (var i = 0; i < clauses.length; i++) {
      code += encodeClause(clauses[i]) + '\n'
    }
    return code
  }

  // export functions
  encode[SymbolIdentityName] = '($"encode")'

  exportTo(encode, 'string', function (str) {
    if (typeof str !== 'string') {
      return '""'
    }
    return encodeString(str)
  })

  exportTo(encode, 'symbol', function (sym) {
    if (typeof sym !== 'symbol') {
      return ''
    }
    return encodeSymbol(sym)
  })

  exportTo(encode, 'number', function (num) {
    if (typeof num !== 'number') {
      return 'NaN'
    }
    return encodeNumber(num)
  })

  exportTo(encode, 'bool', function (bool) {
    if (typeof bool !== 'boolean') {
      return false
    }
    return encodeBool(bool)
  })

  exportTo(encode, 'date', function (date) {
    if (!date instanceof Date) {
      return '($date 0)'
    }
    return encodeDate(date)
  })

  exportTo(encode, 'object', function (obj) {
    if (typeof obj !== 'object') {
      return '(@>)' // empty object
    }
    return obj === null ? 'null' : encodeObject(obj)
  })

  exportTo(encode, 'function', function (func) {
    if (typeof func !== 'function') {
      return 'null'
    }
    return encodeFunction(func)
  })

  exportTo(encode, 'array', function (arr) {
    if (!Array.isArray(arr)) {
      return '(@)' // an empty array
    }
    return encodeArray(arr)
  })

  exportTo(encode, 'value', encodeValue)
  exportTo(encode, 'program', encodeProgram)
  exportTo(encode, 'clause', encodeClause)
  return encode
}

encoder[SymbolIdentityName] = '($"encoder")'
module.exports = encoder