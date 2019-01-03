'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var Tuple$ = $void.Tuple
  var warn = $.warn
  var $export = $void.export
  var tokenizer = $.tokenizer
  var isApplicable = $void.isApplicable

  var compiler = $export($, 'compiler', function (evaluate) {
    if (!isApplicable(evaluate)) {
      return $.compile
    }

    var stack, sourceStack, waiter, lastToken, openningLine, openningOffset
    resetContext()

    function resetContext () {
      stack = [[]]
      sourceStack = [[[0, 0, 0]]]
      waiter = null
      lastToken = null
      openningLine = -1
      openningOffset = 0
    }

    var tokenizing = tokenizer(compileToken)
    return function compiling (text) {
      if (tokenizing(text)) {
        return stack.length
      }
      // reset compiling context.
      waiter && waiter()
      if (stack.length > 1) {
        warn('compiling', 'open statements are not properly closed.',
          [lastToken])
        endAll(null, lastToken ? lastToken[2] : [0, 0, 0])
      }
      tryToRaise()
      resetContext()
      return 0
    }

    function compileToken (type, value, source) {
      var endingLine = source[source.length - 2]
      if (endingLine !== openningLine) {
        openningLine = endingLine
        openningOffset = stack[stack.length - 1].length
      }
      if (!waiter || !waiter(type, value, source)) {
        parseToken(type, value, source)
      }
      lastToken = [type, value, source]
    }

    function parseToken (type, value, source) {
      switch (type) {
        case 'value':
          pushValue(value, source)
          break
        case 'symbol':
          pushSymbol(value, source)
          break
        case 'punctuation':
          pushPunctuation(value, source)
          break
        case 'format': // TODO: as a format string.
          pushValue(value, source) // treat it as a common string now.
          break
        case 'space':
          if (value === '\n') {
            tryToRaise()
          }
          break
        case 'comment':
          // TODO: special comment can works as annotation.
          break
        default: // do nothing for free space.
          break
      }
    }

    function tryToRaise () {
      while (stack[0].length > 0) {
        evaluate([stack[0].shift(), sourceStack[0].splice(0, 1)])
      }
    }

    function pushValue (value, source) {
      stack[stack.length - 1].push(value)
      sourceStack[sourceStack.length - 1].push(source)
    }

    function pushSymbol (value, source) {
      switch (value.key) {
        case ',':
          // a free comma functions only as a stronger visual indicator like
          // a whitespace, so it will be just skipped in building AST.
          if (lastToken && lastToken[0] === 'symbol' && lastToken[1].key === ',') {
            pushValue(null, source)
          }
          break
        case ';':
          endLine(value, source)
          if (!crossingLines()) {
            closeLine(value, source)
          }
          break
        default:
          pushValue(value, source)
      }
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
          if (stack.length > 1) {
            endAll(value, source)
          } else {
            warn('compiling', 'extra enclosing ")." is found and ignored.',
              [lastToken, ['symbol', value, source]])
          }
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
      var statement = stack.pop()
      var top = statement.length > 0
        ? new Tuple$(statement, false, srcTop) : $Tuple.empty
      // push it to the end of container clause.
      stack[stack.length - 1].push(top)
      // since the source has been saved into the tuple, only left a placeholder here
      sourceStack[sourceStack.length - 1].push([])
    }

    function endClause () {
      if (stack.length < 2) {
        warn('compiling', 'extra enclosing parentheses is found and ignored.',
          [lastToken])
        return // allow & ignore extra enclosing parentheses
      }
      var lastSource = lastToken[2]
      endTopWith(lastSource, lastSource)
    }

    function endMatched (value, source) {
      if (stack.length < 2) {
        warn('compiling', 'extra ")," is found and ignored.',
          [lastToken, ['symbol', value, source]])
        return // allow & ignore extra enclosing parentheses
      }
      lastToken[2][0] >= 0 // the indent value of ')'
        ? endIndent(value, source) : endLine(value, source)
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

    function crossingLines () {
      var depth = sourceStack.length - 1
      var srcOffset = openningOffset + 1
      var topSource = sourceStack[depth]
      return topSource.length > srcOffset &&
        openningLine > topSource[srcOffset][1]
    }

    function closeLine (value, source) {
      var depth = stack.length - 1
      stack.push(stack[depth].splice(openningOffset))
      var src = sourceStack[depth].splice(openningOffset + 1)
      var lastSource
      if (src.length > 0) {
        src.unshift(src[0])
        lastSource = lastToken[2]
      } else {
        src.push(source)
        lastSource = source
      }
      sourceStack.push(src)
      endTopWith(lastSource, source)
      openningOffset = stack[depth].length
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
          }
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
    }
  })

  // a helper function to compile a piece of source code.
  $export($, 'compile', function (text) {
    var list = []
    var src = [[0, 0, 0]]
    var compiling = compiler(function collector (expr) {
      list.push(expr[0])
      src.push(expr[1])
    })
    if (compiling(text) > 1) {
      compiling('\n') // end any pending waiter.
    }
    compiling() // notify the end of stream.
    return list.length > 0 ? new Tuple$(list, true, src) : $Tuple.blank
  })
}
