'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Tuple$ = $void.Tuple
  var $export = $void.export
  var tokenizer = $.tokenizer

  var compiler = $export($, 'compiler', function (evaluater) {
    var raiseExpression = evaluater || printExpression

    var stack = [[]]
    var sourceStack = [[]]
    var waiter = null
    var lastToken = null

    var tokenizing = tokenizer(compileToken)
    return function compiling (text) {
      if (tokenizing(text)) {
        return stack.length
      }
      // reset compiling context.
      resetContext()
      return -1
    }

    function compileToken (type, value, source, errCode, errMessage) {
      if (type === 'error') {
        raiseExpression([stack, sourceStack], 'tokenizer:' + errCode, errMessage,
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
          pushValue(value, source)
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
      stack = [[]]
      sourceStack = [[]]
      waiter = null
      lastToken = null
      raiseExpression(null, 'reseting',
        'reseting tokenizer and compiler context.')
    }

    function tryToRaise () {
      while (stack[0].length > 0) {
        raiseExpression([stack[0].shift(), sourceStack[0].shift()])
      }
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
      switch (value.key) {
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

    function endTopWith (ending, source) {
      var srcTop = sourceStack.pop()
      // append ending token(s)' source info.
      Array.prototype.push.apply(srcTop[0], arguments)
      // create a tuple for the top clause, and
      var top = new Tuple$(stack.pop(), false, srcTop)
      // push it to the end of container clause.
      stack[stack.length - 1].push(top)
      // since the source has been saved into the tuple, only left a placeholder here
      sourceStack[sourceStack.length - 1].push([])
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
        ? endIndent(value, source) : endLine(value, source)
      tryToRaise()
    }

    function endLine (value, source) {
      var depth = stack.length - 1
      while (depth > 0) {
        var startSource = sourceStack[depth][0][0] // start source.
        if (startSource[1] < source[1]) { // comparing line numbers.
          break
        }
        endTopWith(lastToken[2], source)
        depth = stack.length - 1
      }
    }

    function endIndent (value, source) {
      var lastSource = lastToken[2]
      var endingIndent = lastSource[0]
      var depth = stack.length - 1
      while (depth > 0) {
        var indent = sourceStack[depth][0][0][0]
        // try to looking for and stop with the first matched indent.
        if (indent >= 0 && indent <= endingIndent) {
          if (indent === endingIndent) {
            endTopWith(lastSource, source)
          } // otherwise, no matched indent found. It is still tolerable but
            // not a good practice.
          break
        }
        endTopWith(lastSource, source)
        depth = stack.length - 1
      }
    }

    function endAll (value, source) {
      while (stack.length > 1) {
        endTopWith(lastToken[2], source)
      }
      tryToRaise()
    }
  })

  // a helper function to compile a piece of source code.
  $export($, 'compile', function (text) {
    var list = []
    var src = [[0, 0, 0]]
    var warnings = null
    var compiling = compiler(function collector (expr, status) {
      if (status) {
        if (status !== 'reseting') { // restting is ignored for sync compiling.
          if (!warnings) {
            warnings = [list]
          }
          warnings.push(Array.prototype.slice.call(arguments))
        }
      } else {
        list.push(expr[0])
        src.push(expr[1])
      }
    })
    if (compiling(text) > 1) {
      compiling('\n') // end pending waiter.
    }
    compiling() // notify the end of stream.
    return warnings || new Tuple$(list, true, src)
  })
}

function printExpression (expr, status, message, info) {
  if (status) {
    console.log('compiling >', status, ':', message, expr || '', info || '')
  } else {
    console.log('compiling > expression:', expr[0], expr[1])
  }
}
