'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Tuple$ = $void.Tuple
  var warn = $.warn
  var $export = $void.export
  var tokenizer = $.tokenizer
  var isApplicable = $void.isApplicable
  var formatPattern = $void.formatPattern
  var sharedSymbolOf = $void.sharedSymbolOf

  var symbolPairing = $.symbol.pairing
  var symbolSubject = $.symbol.subject
  var symbolString = sharedSymbolOf('string')
  var symbolFormat = sharedSymbolOf('format')
  var symbolToString = sharedSymbolOf('to-string')

  var compiler = $export($, 'compiler', function (evaluate) {
    if (!isApplicable(evaluate)) {
      return $.compile
    }

    var stack, sourceStack, waiter, lastToken, openningLine, openningOffset
    resetContext()

    function resetContext () {
      stack = [[]]
      sourceStack = [[[[0, 0, 0]]]]
      waiter = null
      lastToken = ['space', '', [0, 0, 0]]
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
        endAll(null, lastToken[2])
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
        case 'format':
          pushFormat(value, source)
          break
        case 'space':
          if (value === '\n') {
            tryToRaise()
          }
          break
        case 'comment':
          // TODO: special comment as document?
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

    function pushFormat (pattern, source) {
      var args = formatPattern(pattern)
      if (!args || !(args.length > 1)) {
        warn('compiling', 'unnecessary format string.',
          pattern, ['format', pattern, source])
        return pushValue(pattern, source)
      }

      var beginning = source.slice(0, 3).concat(source.slice(1, 2))
      var ending = source.slice(0, 1).concat(source.slice(-2))
      stack.push([symbolString, symbolFormat])
      sourceStack.push([[beginning], beginning, beginning])

      pushValue(args[0], source)
      for (var i = 1; i < args.length; i++) {
        var code = $.compile(args[i])
        pushValue(code.$.length > 0 ? code.$[0] : null, ending)
      }
      endTopWith(ending)
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

    function endTopWith (source) {
      // create a tuple for the top clause, and
      var statement = stack.pop()
      // append ending token(s)' source info.
      var sourceMap = sourceStack.pop()
      sourceMap[0].push(source || lastToken[2])
      while (statement.length > 2 &&
        tryTofoldStatement(statement, sourceMap)
      );
      // push it to the end of container clause.
      stack[stack.length - 1].push(new Tuple$(statement, false, sourceMap))
      // since the source has been saved into the tuple, only keeps its overall range.
      sourceStack[sourceStack.length - 1].push(sourceMap[0])
    }

    function tryTofoldStatement (statement, sourceMap) { // sweeter time.
      var max = statement.length - 1
      for (var i = 1; i < max; i++) {
        if (statement[i] === symbolPairing && statement[i + 1] === symbolPairing) {
          statement.splice(i, 2)
          sourceMap.splice(i + 1, 2)
          foldStatement(statement, sourceMap, i)
          return true
        }
      }
      return false
    }

    function foldStatement (statement, sourceMap, length) {
      // (x :: y) => ($(x) y)
      var expr = statement.splice(0, length)
      // re-arrange source map
      var exprSrcMap = sourceMap.splice(1, length + 1)
      var beginning = exprSrcMap[0].slice(0, 3)
      var ending = exprSrcMap[exprSrcMap.length - 1]
      exprSrcMap.unshift(beginning.concat(ending.slice(-2)))

      // (x ::) => ($(x) to-string)
      if (statement.length < 1) {
        statement.push(symbolToString)
        sourceMap.push(ending.slice(0, 1).concat(ending.slice(-2)))
      }

      statement.unshift(symbolSubject, new Tuple$(expr, false, exprSrcMap))
      sourceMap.splice(1, 0,
        beginning.concat(beginning.slice(1)), exprSrcMap[0]
      )
    }

    function endClause () {
      if (stack.length < 2) {
        warn('compiling', 'extra enclosing parentheses is found and ignored.',
          [lastToken])
        return // allow & ignore extra enclosing parentheses
      }
      endTopWith()
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

    function endLine (value, source) { // sugar time
      var depth = stack.length - 1
      while (depth > 0) {
        var startSource = sourceStack[depth][0][0] // start source.
        if (startSource[1] < source[1]) { // comparing line numbers.
          break
        }
        endTopWith(source)
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

    function closeLine (value, source) { // sweeter time.
      var depth = stack.length - 1
      stack.push(stack[depth].splice(openningOffset))
      var src = sourceStack[depth].splice(openningOffset + 1)
      src.length > 0 ? src.unshift(src[0]) : src.push(source)
      sourceStack.push(src)
      endTopWith(source)
      openningOffset = stack[depth].length
    }

    function endIndent (value, source) { // sugar time
      var endingIndent = lastToken[2][0]
      var depth = stack.length - 1
      while (depth > 0) {
        var indent = sourceStack[depth][0][0][0]
        // try to looking for and stop with the first matched indent.
        if (indent >= 0 && indent <= endingIndent) {
          if (indent === endingIndent) {
            endTopWith(source)
          }
          break
        }
        endTopWith(source)
        depth = stack.length - 1
      }
    }

    function endAll (value, source) { // sugar time
      while (stack.length > 1) {
        endTopWith(source)
      }
    }
  })

  // a helper function to compile a piece of source code.
  $export($, 'compile', function (text) {
    var list = []
    var src = [[[0, 0, 0]]]
    var compiling = compiler(function collector (expr) {
      list.push(expr[0])
      src.push(expr[1])
    })
    if (compiling(text) > 1) {
      compiling('\n') // end any pending waiter.
    }
    compiling() // notify the end of stream.
    return new Tuple$(list, true, src)
  })
}
