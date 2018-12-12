'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var symbolOf = $.symbol.of
  var intValueOf = $.number['parse-int']
  var $export = $void.export

  var Constants = $void.constantValues
  var RegexDecimal = $void.regexDecimal
  var RegexSpecialSymbol = $void.regexSpecialSymbol

  var tokenizer = $export($, 'tokenizer', function (compiler) {
    var raiseToken = compiler || printToken

    var lineNo = 0
    var lineOffset = 0
    var waiter = null
    var spacing = false
    var indenting = 0
    var clauseIndent = 0
    var lastChar = null
    var escaping = false
    var pendingIndent = -1
    var pendingLine = 0
    var pendingOffset = 0
    var pendingText = ''
    var stringPadding = -1

    var singleQuoteWaiter = createStringWaiter("'")
    var doubleQuoteWaiter = createStringWaiter('"')

    var resetting = false
    return function tokenizing (text) {
      if (typeof text !== 'string') { // stopping
        if (!resetting && waiter) {
          waiter() // finalize pending action
        }
        if (!resetting) {
          resetting = true // update state
        }
        // resetting: waiting next piece of source code to continue
        return false
      }
      if (resetting) { // resume parsing
        resumeParsing() // clear parsing context
      }
      // start parsing
      for (var i = 0; i < text.length; i++) {
        if (pushChar(text[i])) {
          return false // resetting
        }
      }
      return true // keep waiting more code
    }

    function resumeParsing () {
      lineNo = 0
      lineOffset = 0
      waiter = null
      spacing = false
      indenting = 0
      clauseIndent = 0
      lastChar = null
      escaping = false
      pendingIndent = -1
      pendingLine = 0
      pendingOffset = 0
      pendingText = ''
      resetting = false
    }

    function pushChar (c) {
      if (waiter && waiter(c)) {
        nextChar(c)
        return resetting
      }
      switch (c) {
        case '(':
          raiseToken('punctuation', c, [clauseIndent, lineNo, lineOffset])
          clauseIndent = -1 // clear begining indent
          break
        case ')':
          raiseToken('punctuation', c, [indenting, lineNo, lineOffset])
          break
        case '`':
        case '@':
        case ':':
        case '$':
          raiseToken('symbol', symbolOf(c), [indenting, lineNo, lineOffset])
          break
        case "'": // TODO: static string?
          beginWaiting("'", singleQuoteWaiter)
          break
        case '"': // TODO: format string?
          beginWaiting('"', doubleQuoteWaiter)
          break
        case '#':
          beginWaiting('', commentWaiter)
          break
        case ' ':
          if (indenting >= 0) {
            indenting += 1
            clauseIndent = indenting
          } else {
            raiseSpace(c)
          }
          break
        case '\t': // The world would be more peceaful now.
          if (indenting >= 0) {
            raiseToken('error', c, [indenting, lineNo, lineOffset],
              'tab-indent', 'TAB cannot be used as indent character.')
            resetting = true
            return true // ending
          } else {
            raiseSpace(c)
          }
          break
        case ',': // reserved as punctuation
        case ';': // reserved as punctuation
        case '\\': // reserved as punctuation
        default:
          beginSymbol(c)
          break
      }
      nextChar(c)
      return resetting
    }

    function nextChar (c) {
      if (!/[\s]/.test(c)) {
        spacing = false // continuous spacing will be ignored.
      }
      lastChar = c
      if (c !== ' ') {
        indenting = -1
      }
      if (c === '\n') {
        lineNo += 1
        lineOffset = 0
        indenting = 0
        clauseIndent = 0
      } else {
        lineOffset += 1
      }
    }

    function beginWaiting (c, stateWaiter) {
      pendingText = c
      pendingLine = lineNo
      pendingOffset = lineOffset
      pendingIndent = indenting
      waiter = stateWaiter
    }

    function createStringWaiter (quote) {
      return function (c) {
        if (!c) { // unexpected ending
          raiseToken('error', pendingText,
            [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset],
            'missing-quote: ' + quote, 'the format of string is invalid.')
          resetting = true
          return true
        }
        if (c === '\r') { // skip '\r' anyway
          return true
        }
        if (c === '\n') { // multiline string.
          if (escaping) { // trailing escaping char indicates to keep the '\n'
            pendingText += 'n'
            stringPadding = 1 // use the new-line as space padding.
            escaping = false
          } else if (stringPadding < 0) {
            stringPadding = 0 // turn on space padding
          }
          return true
        }
        if (/[\s]/.test(c)) {
          if (stringPadding >= 0) { // padding or padded
            if (stringPadding === 0) { // pading
              pendingText += c // keeps the first space character.
              stringPadding = 1
            }
            return true
          }
          // fallback to common string logic
        } else {
          stringPadding = -1 // turn off string padding
        }
        if (escaping) { // common escaping
          pendingText += c
          escaping = false
          return true
        }
        if (c !== quote) {
          pendingText += c
          if (c === '\\') {
            escaping = true
          }
          return true
        }
        // string resetting
        pendingText += quote
        var value = JSON.parse(pendingText)
        if (typeof value === 'string') {
          raiseToken('value', value,
            [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset])
          waiter = null
          return true
        }
        // invalid string.
        raiseToken('error', pendingText,
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset],
          'invalid-string:' + quote, 'the format of string is invalid.')
        resetting = true
        return true
      }
    }

    function raiseSpace (c) {
      if (!spacing) {
        spacing = true
        raiseToken('space', c, [indenting, lineNo, lineOffset])
      }
    }

    function commentWaiter (c) {
      if (c !== '\n') {
        if (pendingText.length < 1 && c === '(') {
          waiter = blockCommentWaiter
          return true
        } else if (c) {
          pendingText += c
          return true
        }
      }
      raiseToken('comment', pendingText,
        [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset]
      )
      waiter = null
      return true
    }

    function blockCommentWaiter (c) {
      if (c) {
        if (lastChar !== ')' || c !== '#') {
          pendingText += c
          return true
        }
      }
      raiseToken('comment', pendingText,
        [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset]
      )
      waiter = null
      return true
    }

    function beginSymbol (c) {
      if (/[\s]/.test(c)) {
        raiseSpace(c) // report space once.
      } else {
        beginWaiting(c, symbolWaiter)
      }
    }

    function symbolWaiter (c) {
      if (c && !RegexSpecialSymbol.test(c)) {
        pendingText += c
        return true
      }
      finalizeSymbol()
      waiter = null
      return false
    }

    function finalizeSymbol () {
      if (RegexDecimal.test(pendingText)) {
        // try float number
        raiseToken('value',
          /(\.|e|E|^-0$)/.test(pendingText)
            ? parseFloat(pendingText)
            : intValueOf(pendingText),
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset - 1])
      } else if (pendingText.startsWith('0')) {
        // try integer number
        raiseToken('value', intValueOf(pendingText),
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset - 1])
      } else if (typeof Constants[pendingText] !== 'undefined') {
        // check if a constant value
        raiseToken('value', Constants[pendingText],
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset - 1])
      } else {
        // as a common symbol
        raiseToken('symbol', symbolOf(pendingText),
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset - 1])
      }
    }
  })

  // a helper function to tokenize a piece of text.
  $export($, 'tokenize', function (text) {
    var tokens = []
    var tokenizing = tokenizer(function collector () {
      tokens.push(Array.prototype.slice.call(arguments))
    })
    tokenizing(text)
    tokenizing() // notify the end of stream.
    return tokens
  })
}

function printToken (type, value, source, errCode, errMessage) {
  if (type === 'error') {
    console.warn('tokenizing >', type, value, source, errCode, errMessage)
  } else {
    console.log('tokenizing > token:', type, value, source, errCode, errMessage)
  }
}
