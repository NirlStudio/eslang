'use strict'

const RegexNumber = /^-?\d+\.?\d*$/

const keywords = {
  'null': null,
  'true': true,
  'false': false
}

var Tokenizer = function (lines, source) {
  this._lines = lines
  this._source = source
  this._lineNo = 0
  this._offset = 0
  this._indent = 0
  this._current = null

  this.next = function () {
    var c = this._nextChar()
    if (c === null) {
      return null // no more
    }

    if (c === '\n') {
      this._indent = 0 // reset indent status.
    } else if (c === ' ' && this._indent >= 0) {
      this._indent += 1 // count leading whitespaces.
    }

    this._current = null
    switch (c) {
      case '(':
        return this._finalizeToken(this._createToken('punctuation'), c)

      case ')':
        let n = this._nextChar()
        if (n === ',') {
          this._current = null
          return this._finalizeToken(this._createToken('punctuation'), c + n)
        }
        if (n === '.') {
          this._current = null
          return this._finalizeToken(this._createToken('punctuation'), c + n)
        }
        return this._finalizeToken(this._createToken('punctuation'), c)

      case '$':
      case '`':
      case "'": // reserved.
      case '@':
      case ':':
        // single character symbols.
        return this._finalizeToken(this._createToken('symbol'), Symbol.for(c))

      case '"':
        return this._readString()

      case ' ':
      case '\r':
      case '\n':
        // skipping free whitespaces.
        return this.next()

      case '#':
        // comment to end of the line.
        return this._finalizeToken(this._createToken('comment'), this._readComment())

      case '\t': // The world would be more peceaful now.
        if (this._indent < 0) {
          return this.next()
        }
        return this._finalizeToken(this._createToken('error'), 'Indent TAB is not allowed.')

      default:
        return this._readSymbolOrValue(c)
    }
  }

  this._nextChar = function () {
    if (this._current) {
      return this._current
    }

    if (this._lineNo >= this._lines.length) {
      return null
    }

    var line = this._lines[this._lineNo]
    if (this._offset < line.length) {
      this._current = line[this._offset]
      this._offset += 1
    } else {
      this._lineNo += 1
      this._offset = 0
      this._current = '\n' // insert a virtual new-line
    }
    return this._current
  }

  this._createToken = function (type) {
    var t = {
      type: type,
      source: this._source,
      indent: this._indent,
      startLine: this._lineNo,
      startOffset: this._offset - 1
    }
    this._indent = -1 // clear indent for the first non-whitespace.
    return t
  }

  this._finalizeToken = function (token, value, type) {
    token.value = value
    token.endLine = this._lineNo
    token.endOffset = this._offset
    if (type) {
      token.type = type
    }
    return token
  }

  this._readString = function () {
    var token = this._createToken('value')
    var str = '"'
    var index = this._offset

    var line = this._lines[this._lineNo]
    while (index < line.length) {
      let c = line[index]
      index += 1
      if (c === '"') {
        str += '"'; break
      }
      if (c !== '\\') {
        str += c; continue
      }

      if (index >= line.length) {
        str += '\\n'
      } else if (line[index] === '\r') {
        str += '\\r\\n'
      } else {
        str += '\\' + line[index]
        index += 1; continue
      }

      this._lineNo += 1
      line = this._lineNo >= this._lines.length ? '' : this._lines[this._lineNo]
      index = 0
    }

    try {
      this._offset = index
      return this._finalizeToken(token, JSON.parse(str))
    } catch (err) {
      this._finalizeToken(token, 'Invalid string input.', 'error')
      token.data = str
      return token
    }
  }

  this._readComment = function () {
    var line = this._lines[this._lineNo]
    var comment = line.substring(this._offset)
    this._offset = line.length
    return comment
  }

  this._readSymbolOrValue = function (s) {
    var token = this._createToken('symbol')

    var n = this._nextChar()
    while (n) {
      if ('()$`\'@:" \r\n#\t\\'.indexOf(n) >= 0) {
        break
      }
      s += n
      this._current = null
      n = this._nextChar()
    }

    if (keywords.hasOwnProperty(s)) {
      return this._finalizeToken(token, keywords[s], 'value')
    }
    if (RegexNumber.test(s)) {
      return this._finalizeToken(token, Number.parseFloat(s), 'value')
    }
    return this._finalizeToken(token, Symbol.for(s))
  }
}

module.exports = function (code, source) {
  if (typeof code !== 'string') {
    code = '()'
  }

  var lines = code.split('\n')
  var tokenizer = new Tokenizer(lines, source)
  return tokenizer
}
