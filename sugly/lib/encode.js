'use strict'

var $export = require('../export')

module.exports = function ($void, JS) {
  var $ = $void.$
  var Symbol$ = $void.Symbol
  var ownsProperty = $void.ownsProperty

  var $Symbol = $.Symbol
  var symbolValueOf = $Symbol['value-of']

  var SymbolContext = symbolValueOf('$')
  var SymbolFor = symbolValueOf('for')

  return $export($, 'encoder', function encoder (pretty) {
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
      return JS.JSON.stringify(str)
    }

    function encodeSymbol (sym) {
      return sym instanceof Symbol$ ? sym.key : ''
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
      if (ownsProperty(obj, 'identityName')) {
        return obj.identityName // a unique entity.
      }
      if (obj.proto) {
        return obj.identityName // A type must have a identityName
      }
      // an instance object.
      var hasType = obj.type && obj.type !== $.Object && obj.type.identityName
      var code = hasType ? '(' + obj.type.identityName + ' create ' : ''
      var keys = Object.getOwnPropertyNames(obj)
      if (keys.length < 1) {
        return code.length > 0 ? code + ')' : '(object )'
      }
      code += '(@'
      increaseIndent()
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        code += (code.length < 3 ? '' : '\n' + getIndent()) + key + ': '
        code += encodeValue(obj[key])
      }
      decreaseIndent()
      return code + (hasType ? '))' : ')')
    }

    function encodeNativeFunction (func) {
      // encode anonymous function to null.
      return func.hasOwnProperty('identityName')
        ? func.identityName : func.name || '(=(native function) ())'
    }

    function encodeSuglyFunction (func) {
      if (func.hasOwnProperty('identityName')) {
        return func.identityName
      }

      var code = '(= '
      var enclosing = func.$enclosing
      if (enclosing) {
        var obj = encodeObject(enclosing)
        if (obj !== '(object )') { // not an empty onject.
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
          code += p[0].key
        } else {
          code += '(' + p[0].key + ' ' + encodeValue(p[1]) + ')'
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
        case 'object':
          if (value === null) {
            return 'null'
          }
          return value instanceof Symbol$ ? encodeSymbol(value) : encodeObject(value)
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
        if (clause instanceof Symbol$) {
          return clause.key
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

    // export functions
    var encode = $.object()
    encode.identityName = 'encode'

    $export(encode, 'string', function encode$string (str) {
      if (typeof str === 'undefined' || str === null) {
        return 'null' // null is always possible.
      }
      return typeof str !== 'string' ? '""' : encodeString(str)
    })

    $export(encode, 'symbol', function encode$symbol (sym) {
      if (typeof sym === 'undefined' || sym === null) {
        return 'null' // null is always possible.
      }
      return encodeSymbol(sym)
    })

    $export(encode, 'number', function encode$number (num) {
      if (typeof num === 'undefined' || num === null) {
        return 'null' // null is always possible.
      }
      return typeof num !== 'number' ? 'NaN' : encodeNumber(num)
    })

    $export(encode, 'bool', function encode$bool (bool) {
      if (typeof bool === 'undefined' || bool === null) {
        return 'null' // null is always possible.
      }
      return typeof bool !== 'boolean' ? 'false' : encodeBool(bool)
    })

    $export(encode, 'date', function encode$date (date) {
      if (typeof date === 'undefined' || date === null) {
        return 'null' // null is always possible.
      }
      return date instanceof Date ? encodeDate(date) : '(date 0)'
    })

    $export(encode, 'object', function encode$object (obj) {
      if (typeof obj === 'undefined' || obj === null) {
        return 'null' // null is always possible.
      }
      if (typeof obj !== 'object' || obj instanceof Symbol$) {
        return '(object )' // empty object for non-object
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

    $export(encode, 'function', function encode$function (func) {
      return typeof func !== 'function' ? 'null' : encodeFunction(func)
    })

    $export(encode, 'array', function encode$array (arr) {
      if (typeof arr === 'undefined' || arr === null) {
        return 'null' // null is always possible.
      }
      return Array.isArray(arr) ? encodeArray(arr) : '(@)'
    })

    $export(encode, 'value', function encode$value (value) {
      return typeof value === 'undefined' ? 'null' : encodeValue(value)
    })

    $export(encode, 'clause', function encode$clause (clause) {
      return typeof clause === 'undefined' ? '()' : encodeClause(clause)
    })

    $export(encode, 'program', function encode$program (clauses) {
      return Array.isArray(clauses) ? encodeProgram(clauses, false) : '()'
    })
    return encode
  })
}
