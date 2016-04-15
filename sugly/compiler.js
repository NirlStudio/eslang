'use strict'

var tokenizer = require('./tokenizer')

module.exports = function (/* options */) {
  var stack = [[]]

  function beginClause (t) {
    var clause = []
    clause.lineNo = t.startLine
    clause.indent = t.indent

    stack.push(clause)
    return null
  }

  function endClause (t) {
    if (stack.length < 2) {
      return null // tolerate extra closing parentheses.
    }

    var top = stack.pop()
    delete top.lineNo
    delete top.indent

    stack[stack.length - 1].push(top)
    return null
  }

  function endLine (t) {
    var top = stack[stack.length - 1]
    do {
      endClause(t)
      if (stack.length < 2) {
        return
      }
      top = stack[stack.length - 1]
    } while (top.lineNo === t.startLine)
  }

  function endIndent (t) {
    var depth = 1
    for (; depth < stack.length; depth++) {
      if (stack[depth].indent >= t.indent) {
        break
      }
    }

    while (depth < stack.length) {
      endClause(t)
    }
  }

  function endAll (t) {
    while (stack.length > 1) {
      endClause(t)
    }
  }

  function pushPunctuation (t) {
    switch (t.value) {
      case '(':
        beginClause(t)
        break

      case ')':
        endClause(t)
        break

      case '),':
        t.indent >= 0 ? endIndent(t) : endLine(t)
        break

      case ').':
        endAll(t)
        break

      default:
        break
    }
  }

  function pushValue (t) {
    stack[stack.length - 1].push(t.value)
  }

  function pushSymbol (t) {
    stack[stack.length - 1].push(t.value)
  }

  // Since $compile is expected to return a piece program, it should always
  // return a piece of program.
  function tokenError (t) {
    // symbols
    const object = Symbol.for('@')
    const as = Symbol.for(':')
    const mod = Symbol.for('module')
    const code = Symbol.for('statusCode')
    const desc = Symbol.for('statusDescription')
    const error = Symbol.for('error')
    // program
    return [
      [object, mod, as, [object,
        code, as, 400,
        desc, as, 'Invalid token.',
        error, as, JSON.stringify(t)]
      ]
    ]
  }

  function compile (code, src) {
    var tokens = tokenizer(code, src)
    var t = tokens.next()

    while (t) {
      switch (t.type) {
        case 'error':
          return tokenError(t)

        case 'punctuation':
          pushPunctuation(t)
          break

        case 'value':
          pushValue(t)
          break

        case 'symbol':
          pushSymbol(t)
          break

        case 'comment':
          // TODO - comment-based code annotation.
          break

        default:
          break
      }
      t = tokens.next()
    }

    if (stack.length > 1) {
      endAll(null) // automatically close all open parentheses.
    }
    return stack[0]
  }

  return compile
}
