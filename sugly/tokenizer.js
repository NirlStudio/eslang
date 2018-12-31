'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var symbolOf = $.symbol.of
  var intValueOf = $.number['parse-int']
  var warn = $void.warn
  var print = $void.print
  var $export = $void.export

  var Constants = $void.constantValues
  var RegexDecimal = $void.regexDecimal
  var RegexSpecialSymbol = $void.regexSpecialSymbol

  var tokenizer = $export($, 'tokenizer', function (compiler) {
    var raiseToken = compiler || printToken

    var lineNo, lineOffset, lastChar, spacing, indenting, clauseIndent
    var waiter, pendingText, pendingLine, pendingOffset, pendingIndent, escaping
    var stringPadding, resetting
    resumeParsing() // initialize context

    function resumeParsing () {
      // general states
      lineNo = 0
      lineOffset = 0
      lastChar = null
      spacing = false
      indenting = 0
      clauseIndent = 0
      // escaping states
      waiter = null
      pendingText = ''
      pendingLine = 0
      pendingOffset = 0
      pendingIndent = -1
      escaping = false
      // TODO: to be removed
      resetting = false
    }

    var singleQuoteWaiter = createStringWaiter("'")
    var doubleQuoteWaiter = createStringWaiter('"')

    return function tokenizing (text) {
      if (typeof text !== 'string') { // stopping
        if (!resetting) {
          waiter && waiter() // finalize pending action
          resetting = true // update state
        }
        // resetting: waiting for next piece of source code to start.
        return false
      }
      if (resetting) { // resume parsing
        resumeParsing() // clear parsing context
      }
      // start parsing
      for (var i = 0; i < text.length; i++) {
        if (pushChar(text[i])) {
          return false // entered an abnormal state, resetting
        }
      }
      return true // keep waiting more code
    }

    function pushChar (c) {
      if (waiter && waiter(c)) {
        return finalizePushing(c)
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
        case '[': // reserved as block punctuation
        case ']': // reserved as block punctuation
        case '{': // reserved as block punctuation
        case '}': // reserved as block punctuation
          raiseToken('symbol', symbolOf(c), [indenting, lineNo, lineOffset])
          break
        case "'": // TODO: format string
          beginWaiting("'", singleQuoteWaiter)
          break
        case '"': // TODO: static string
          beginWaiting('"', doubleQuoteWaiter)
          break
        case '#':
          beginWaiting('', commentWaiter)
          break
        case ' ':
        case '\t': // It may spoils well foramtted code.
          processWhitespace(c)
          break
        case ',': // inline-closing, indent-closing
        case ';': // line-closing
        case '\\': // reserved as control punctuation
        default:
          beginSymbol(c)
          break
      }
      return finalizePushing(c)
    }

    function finalizePushing (c) {
      lastChar = c
      spacing = /[\s]/.test(c)
      if (c !== ' ' && c !== '\t') {
        indenting = -1
      }
      if (c === '\n') {
        lineNo += 1
        lineOffset = indenting = clauseIndent = 0
      } else {
        lineOffset += 1
      }
      return resetting
    }

    function beginWaiting (c, stateWaiter) {
      waiter = stateWaiter
      pendingText = c
      pendingLine = lineNo
      pendingOffset = lineOffset
      pendingIndent = indenting
    }

    function processWhitespace (c) {
      if (indenting < 0) {
        return raiseSpace(c)
      }
      if (c === '\t') {
        warn('tokenizing> TAB-space is not suggested in indention.',
          [lineNo, lineOffset, indenting])
      }
      clauseIndent = ++indenting
    }

    function createStringWaiter (quote) {
      return function (c) {
        if (typeof c === 'undefined') { // unexpected ending
          warn('tokenizing> a string is not closed properly.',
            [lineNo, lineOffset, pendingLine, pendingOffset])
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
      if (!spacing || c === '\n') { // only raise once for common spaces, but
        // raise every new-line in case parser giving it special meanings.
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

  function printToken (type, value, source, errCode, errMessage) {
    if (type === 'error') {
      warn('tokenizing>', type, value, source, errCode, errMessage)
    } else {
      print('tokenizing> token:', type, value, source, errCode, errMessage)
    }
  }
}
