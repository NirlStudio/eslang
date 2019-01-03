'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var symbolOf = $.symbol.of
  var intValueOf = $.number['parse-int']
  var strReplace = $.string.proto.replace
  var warn = $.warn
  var $export = $void.export
  var isApplicable = $void.isApplicable

  var Constants = $void.constantValues
  var RegexDecimal = $void.regexDecimal
  var RegexSpecialSymbol = $void.regexSpecialSymbol

  var tokenizer = $export($, 'tokenizer', function (parse) {
    if (!isApplicable(parse)) {
      return $.tokenize
    }

    var lineNo, lineOffset, lastChar, spacing, indenting, clauseIndent
    var waiter, pendingText, pendingLine, pendingOffset, pendingIndent
    var escaping, stringPadding
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
      stringPadding = -1
    }

    var singleQuoteWaiter = createStringWaiter("'", 'format')
    var doubleQuoteWaiter = createStringWaiter('"')

    return function tokenizing (text) {
      if (typeof text !== 'string') {
        waiter && waiter() // finalize pending action
        resumeParsing() // clear parsing context
        return false // indicate a reset happened.
      }
      // start parsing
      for (var i = 0; i < text.length; i++) {
        var c = text[i]
        if (!waiter || !waiter(c)) {
          processChar(c)
        }
        finalizeChar(c)
      }
      return true // keep waiting more code
    }

    function processChar (c) {
      switch (c) {
        case '(':
          parse('punctuation', c, [clauseIndent, lineNo, lineOffset])
          clauseIndent = -1 // clear begining indent
          break
        case ')':
          parse('punctuation', c, [indenting, lineNo, lineOffset])
          break
        case '`':
        case '@':
        case ':':
        case '$':
        case ',': // inline-closing, indent-closing
        case ';': // line-closing
        case '\\': // reserved as control punctuation
        case '[': // reserved as block punctuation
        case ']': // reserved as block punctuation
        case '{': // reserved as block punctuation
        case '}': // reserved as block punctuation
          parse('symbol', symbolOf(c), [indenting, lineNo, lineOffset])
          break
        case "'": // reserved for format string
          // JSON.parse requires double-quote
          beginWaiting('"', singleQuoteWaiter)
          break
        case '"':
          beginWaiting('"', doubleQuoteWaiter)
          break
        case '#':
          beginWaiting('', commentWaiter)
          break
        case ' ':
        case '\t': // It may spoil well foramtted code.
          processWhitespace(c)
          break
        default:
          beginSymbol(c)
          break
      }
    }

    function finalizeChar (c) {
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
        warn('tokenizing', 'TAB-space is not suggested in indention.',
          [lineNo, lineOffset, indenting])
      }
      clauseIndent = ++indenting
    }

    function createStringWaiter (quote, tokenType) {
      function raiseValue () {
        var value, error
        try {
          // TODO: to be replaced to native escape processor?
          value = JSON.parse((quote === '"' ? pendingText
            : strReplace.call(pendingText, '"', '\\"')
          ) + '"')
        } catch (err) {
          error = err
        }
        if (typeof value !== 'string') {
          warn('tokenizing', 'invalid string input: [JSON] ',
            (error && error.message) || 'unknow error.', '\n',
            pendingText + quote, '\n',
            [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset])
          value = pendingText.substring(1) // skip all escaping logic.
        }
        parse(tokenType || 'value', value,
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset])
        waiter = null
        return true
      }

      return function (c) {
        if (typeof c === 'undefined') { // unexpected ending
          warn('tokenizing', 'a string value is not properly closed.',
            [lineNo, lineOffset, pendingLine, pendingOffset])
          return raiseValue()
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
              pendingText += ' ' // keeps the first space character.
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
        if (c === quote) {
          return raiseValue()
        }
        pendingText += c
        if (c === '\\') {
          escaping = true
        }
        return true
      }
    }

    function raiseSpace (c) {
      if (!spacing || c === '\n') { // only raise once for common spaces, but
        // raise every new-line in case parser giving it special meanings.
        parse('space', c, [indenting, lineNo, lineOffset])
      }
    }

    function commentWaiter (c) {
      if (typeof c === 'undefined' || c === '\n') {
        parse('comment', pendingText,
          [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset])
        waiter = null
      } else if (pendingText.length < 1 && c === '(') {
        pendingText = '('
        waiter = blockCommentWaiter // upgrade to block comment
      } else {
        pendingText += c
      }
      return true
    }

    function blockCommentWaiter (c) {
      if (c) {
        if (lastChar !== ')' || c !== '#') {
          pendingText += c
          return true
        } // else, normal ending
      } else {
        pendingText += ')'
        warn('tokenizing', 'a block comment is not properly closed.',
          [lineNo, lineOffset, pendingLine, pendingOffset])
      }
      parse('comment', pendingText,
        [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset])
      waiter = null
      return true
    }

    function beginSymbol (c) {
      /[\s]/.test(c) ? raiseSpace(c) // report space once.
        : beginWaiting(c, symbolWaiter)
    }

    function symbolWaiter (c) {
      if (c && !RegexSpecialSymbol.test(c)) {
        pendingText += c
        return true
      }
      raiseSymbol()
      waiter = null
      return false // return the char to tokenizer.
    }

    function raiseSymbol () {
      var type, value
      if (typeof Constants[pendingText] !== 'undefined') { // a constant value
        value = Constants[pendingText]
      } else if (RegexDecimal.test(pendingText)) { // a decimal number
        value = /(\.|e|E|^-0$)/.test(pendingText)
          ? parseFloat(pendingText) : intValueOf(pendingText)
      } else if (pendingText.startsWith('0')) { // a special integer number
        value = intValueOf(pendingText)
      } else { // a common symbol
        type = 'symbol'
        value = symbolOf(pendingText)
      }
      parse(type || 'value', value,
        [pendingIndent, pendingLine, pendingOffset, lineNo, lineOffset - 1])
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
