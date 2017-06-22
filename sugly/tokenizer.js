'use strict'

var RegexNumber = /^-?\d+\.?\d*$/

var Constants = Object.assign(Object.create(null), {
  'null': null,
  'true': true,
  'false': false,
  'NaN': NaN,
  'Infinity': Infinity
})

module.exports = function ($void) {
  var InvalidSymbol = $void.InvalidSymbol
  var $ = $void.$
  var symbolOf = $.symbol.of
  var $export = $void.export

  var tokenizer = $export($, 'tokenizer', function (compiler) {
    var raiseToken = compiler || printToken

    var lineNo = 0
    var lineOffset = 0
    var waiter = null
    var spacing = false
    var indenting = 0
    var lastChar = null
    var escaping = false
    var pendingIndent = -1
    var pendingLine = 0
    var pendingOffset = 0
    var pendingText = ''

    var singleQuoteWaiter = createStringWaiter("'")
    var doubleQuoteWaiter = createStringWaiter('"')

    var reseting = false
    return function tokenizing (text) {
      if (typeof text !== 'string') { // stopping
        if (!reseting && waiter) {
          waiter() // finalize pending action
        }
        if (!reseting) {
          reseting = true // update state
        }
        // reseting: wating next piece of source code to continue
        return false
      }
      if (reseting) { // resume parsing
        resumeParsing() // clear parsing context
      }
      // start parsing
      for (var i = 0; i < text.length; i++) {
        if (pushChar(text[i])) {
          return false // reseting
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
      lastChar = null
      escaping = false
      pendingIndent = -1
      pendingLine = 0
      pendingOffset = 0
      pendingText = ''
      reseting = false
    }

    function pushChar (c) {
      if (waiter && waiter(c)) {
        nextChar(c)
        return reseting
      }
      switch (c) {
        case '(':
        case ')':
        case ',': // reserved as punctuation
        case ';': // reserved as punctuation
        case '\\': // reserved as punctuation
          raiseToken('punctuation', c, [indenting, lineNo, lineOffset])
          break
        case '`':
        case '@':
        case ':':
        case '$':
          raiseToken('symbol', c, [indenting, lineNo, lineOffset])
          break
        case "'":
          beginWaiting("'", singleQuoteWaiter)
          break
        case '"':
          beginWaiting('"', doubleQuoteWaiter)
          break
        case '#':
          beginWaiting('', commentWaiter)
          break
        case ' ':
          if (indenting >= 0) {
            indenting += 1
          } else {
            raiseSpace(c)
          }
          break
        case '\t': // The world would be more peceaful now.
          if (indenting >= 0) {
            raiseToken('error', c, [indenting, lineNo, lineOffset],
              'tab-indent', 'TAB cannot be used as indent character.')
            reseting = true
            return true // ending
          } else {
            raiseSpace(c)
          }
          break
        default:
          beginSymbol(c)
          break
      }
      nextChar(c)
      return reseting
    }

    function nextChar (c) {
      lastChar = c
      if (c !== ' ') {
        indenting = -1
      }
      if (c === '\n') {
        lineNo += 1
        lineOffset = 0
        indenting = 0
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
        if (!c) {
          raiseToken('error', pendingText,
            [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset],
            'missing-quote: ' + quote, 'the format of string is invalid.')
          reseting = true
          return true
        }

        if (escaping) {
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
        // string reseting
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
        reseting = true
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
      if (c && !InvalidSymbol.test(c)) {
        pendingText += c
        return true
      }
      finalizeSymbol()
      waiter = null
      return false
    }

    function finalizeSymbol () {
      if (RegexNumber.test(pendingText)) {
        // try float number
        raiseToken('value', parseFloat(pendingText),
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset - 1])
      } else if (pendingText.startsWith('0')) {
        // try integer number
        raiseToken('value', parseInt(pendingText),
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
