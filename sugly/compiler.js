'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var $export = $void.export
  var tokenizer = $.tokenizer

  var compiler = $export($, 'compiler', function (evaluater) {
    var raiseExpression = evaluater || printExpression

    var stack = [[]]
    var sourceStack = [[[]]]
    var waiter = null
    var lastToken = null

    var tokenizing = tokenizer(compileToken)
    return function compiling (text) {
      if (tokenizing(text)) {
        return true
      }
      // reset compiling context.
      resetContext()
      return false
    }

    function compileToken (type, value, source, errCode, errMessage) {
      if (type === 'error') {
        raiseExpression(stack[0], sourceStack[0], 'error:tokenizer:' + errCode, errMessage,
          [type, value, source])
        resetContext()
        return
      }
      if (waiter && waiter(type, value, source)) {
        lastToken = [type, value, source]
        return
      }
      switch (type) {
        case 'value':
          pushValue(value, source)
          break
        case 'symbol':
          pushValue($Symbol.of(value), source)
          break
        case 'comment':
          // TODO: comment as embedded code, e.g. document, html, js.
          // pushValue(new Tuple$([$Symbol.comment, null/* render */, value], true), source)
          break
        case 'punctuation':
          pushPunctuation(value, source)
          break
        default: // do nothing for free space.
          break
      }
      lastToken = [type, value, source]
    }

    function resetContext () {
      stack = [[]]; sourceStack = [[[]]]
      waiter = null
      lastToken = null
      raiseExpression(null, 'reseting',
        'reseting tokenizer and compiler context.')
    }

    function tryToRaise () {
      if (stack.length > 1) {
        return
      }
      var expr = new Tuple$(stack[0], false, sourceStack[0])
      stack = [[]]; sourceStack = [[]]
      waiter = null
      raiseExpression(expr)
    }

    function pushValue (value, source) {
      stack[stack.length - 1].push(value)
      sourceStack[stack.length - 1].push(source)
      tryToRaise()
    }

    function pushPunctuation (value, source) {
      switch (value) {
        case '(': // begin a new clause
          stack.push([])
          sourceStack.push([[source]])
          break
        case ')':
          // wait for next token to decide
          waiter = endingWaiter
          break
        default: // just skip unknow punctuations as some placeholders.
          break
      }
    }

    function endingWaiter (type, value, source) {
      waiter = null // wait only once.
      if (type !== 'symbol') {
        endClause()
        return false // stop waiting
      }
      switch (value) {
        case ',':
          endMatched(value, source)
          return true
        case '.':
          endAll(value, source)
          return true
        default:
          endClause()
          return false
      }
    }

    function endTopWith (ending) {
      var top = stack.pop()
      stack[stack.length - 1].push(top)
      var srcTop = sourceStack.pop()
      Array.prototype.push(srcTop[0], arguments)
      sourceStack[sourceStack.length - 1].push(srcTop)
    }

    function endClause () {
      if (stack.length < 2) {
        raiseExpression(null, 'warning',
          'extra enclosing parentheses is found and ignored.', [lastToken])
        return // allow & ignore extra enclosing parentheses
      }
      endTopWith(lastToken[2])
      tryToRaise()
    }

    function endMatched (value, source) {
      if (stack.length < 2) {
        raiseExpression(null, 'warning',
          'extra enclosing parentheses is found and ignored.',
          [lastToken, ['symbol', value, source]])
        return // allow & ignore extra enclosing parentheses
      }
      lastToken[2][0] >= 0 // the indent value of ')'
        ? endLine(value, source) : endIndent(value, source)
    }

    function endLine (value, source) {
      var depth = stack.length - 1
      while (depth > 1) {
        var startSource = sourceStack[depth][0][0] // start source.
        if (startSource[1] >= source[1]) { // comparing line numbers.
          endTopWith(lastToken[2], source)
        }
        depth -= 1
      }
      tryToRaise()
    }

    function endIndent (value, source) {
      var depth = stack.length - 1
      while (depth > 1) {
        var startSource = sourceStack[depth][0][0] // start source.
        var lastSource = lastToken[2]
        if (startSource[2] >= lastSource[2]) { // line offset
          endTopWith(lastSource, source)
        }
        depth -= 1
      }
      tryToRaise()
    }

    function endAll (value, source) {
      while (stack.length > 1) {
        endTopWith(lastToken[2], source)
      }
    }
  })

  // a helper function to compile a piece of source code.
  $export($, 'compile', function (text) {
    var list = []
    var compiling = compiler(function collector () {
      list.push(Array.prototype.slice.call(arguments))
    })
    compiling(text)
    compiling() // notify the end of stream.
    return new Tuple$(list, true/* as code block */)
  })
}

function printExpression (expr, status, message, info) {
  if (status) {
    console.log('compiling >', status, ':', message, expr ? expr.$ : '', info || '')
  } else {
    console.log('compiling > expression:', expr)
  }
}
