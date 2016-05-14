'use strict'

module.exports = function ($) {
  var tokenize = $.$tokenize

  $.$compiler = function () {
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

    return function compile (code, src/*, options */) {
      var nextToken = tokenize(code, src)
      var t = nextToken()

      while (t) {
        switch (t.type) {
          case 'error':
            // only try to describe the on-site problem.
            $.print.warn({
              from: '$/sugly/compiler',
              message: 'compiling cancelled for the last tokenizer error.'
            })
            return [[]]

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
        t = nextToken()
      }

      if (stack.length > 1) {
        endAll(null) // automatically close all open parentheses.
      }
      return stack[0]
    }
  }
}
