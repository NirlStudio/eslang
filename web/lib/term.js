'use strict'

var MaxLines = 4000
var DrainBatch = 200

var KeyEnter = 0x0D
var KeyUpArrow = 0x26
var KeyDownArrow = 0x28

// the key to be used in localStorage
var InputHistoryKey = '~/.sugly_history'

// Firefox requires a non-zero timeout to refresh UI.
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
var MinimalDelay = isFirefox ? 15 : 0

var pool = []
var spooling = false
var panel, input, enter

function enqueue (todo) {
  if (pool.length > MaxLines) {
    pool = pool.slice(MaxLines / 2)
  }
  pool.push(todo)
}

function drain () {
  if (pool.length < 1) { return }
  setTimeout(function () {
    var todos = pool.splice(0, DrainBatch)
    for (var i = 0, len = todos.length; i < len; i++) {
      var todo = todos[i]
      todo[0](todo[1], todo[2], true)
    }
    drain()
  }, MinimalDelay)
}

function updatePanel () {
  if (panel.childElementCount > MaxLines) {
    var half = MaxLines / 2
    while (panel.childElementCount > half) {
      panel.removeChild(panel.firstElementChild)
    }
  }
  window.scrollTo(0, document.body.scrollHeight)
  input.focus()
}

var currentLine = null

function writeTo (panel) {
  function write (text, render, draining) {
    if (!draining && (spooling || pool.length > 0)) {
      return enqueue([write, text, render])
    }
    var lines = text.split('\n')
    var spans = []
    var i = 0
    var len = lines.length
    for (; i < len; i++) {
      var line = lines[i]
      line ? spans.push(
        appendText(currentLine || (currentLine = createNewLine()), line)
      ) : currentLine = currentLine ? null
        : createNewLine(document.createElement('br'))
    }
    if (render && spans.length > 0) {
      for (i = 0, len = spans.length; i < len; i++) { render(spans[i]) }
    }
    updatePanel()
  }
  return write
}

function createNewLine (child) {
  var li = document.createElement('li')
  li.className = 'print'
  if (child) {
    li.appendChild(child)
  }
  panel.appendChild(li)
  return li
}

function appendText (li, text) {
  var span = document.createElement('span')
  span.className = 'text'
  span.appendChild(document.createTextNode(replaceWhitespace(text)))
  li.appendChild(span)
  return span
}

function styleOf (format) {
  var style = ''
  for (var key in format) {
    var value = format[key]
    if (typeof value === 'string') {
      style += key + ': ' + value + ';'
    }
  }
  return style
}

var styleClasses = Object.assign(Object.create(null), {
  red: 'color',
  green: 'color',
  blue: 'color',
  yellow: 'color',
  grey: 'color',
  gray: 'color',
  underline: '*text-decoration',
  overline: '*text-decoration',
  'line-through': '*text-decoration'
})

function applyClass (cls) {
  var values = cls.split(/\s/)
  var style = {}
  for (var i = 0; i < values.length; i++) {
    var value = values[i]
    if (styleClasses[value]) {
      var key = styleClasses[value]
      if (key.startsWith('*')) {
        key = key.substring(1)
        style[key] = style[key] ? style[key] + ' ' + value : value
      } else {
        style[key] = value
      }
    }
  }
  return applyStyle(style)
}

function applyStyle (obj) {
  var style = styleOf(obj)
  return style && function (span) {
    span.style.cssText = style
  }
}

function logTo (panel, type, max) {
  function log (prompt, text, draining) {
    if (!draining && (spooling || pool.length > 0)) {
      return enqueue([log, prompt, text])
    }
    if (max && text.length > max) {
      text = text.substring(0, max - 10) + '... ... ...' +
        text.substring(text.length - 10) +
        ' # use (print ...) to display all text.'
    }
    var lines = text.split('\n')
    for (var i = 0, len = lines.length; i < len; i++) {
      var li = document.createElement('li')
      li.className = type
      lines[i] ? appendLine(li, lines[i], i > 0 ? '' : prompt)
        : li.appendChild(document.createElement('br'))
      panel.appendChild(li)
    }
    updatePanel()
  }
  return log
}

function appendLine (li, text, prompt) {
  var span = document.createElement('span')
  span.className = 'prompt'
  if (prompt) {
    span.appendChild(document.createTextNode(prompt))
  }
  li.appendChild(span)
  span = document.createElement('span')
  span.className = 'text'
  span.appendChild(document.createTextNode(replaceWhitespace(text)))
  li.appendChild(span)
}

function replaceWhitespace (text) {
  var spaces = ''
  for (var i = 0; i < text.length; i++) {
    if (!/\s/.test(text.charAt(i))) {
      return spaces + text.slice(i)
    } else {
      spaces += '\u00A0'
    }
  }
  return text
}

function loadHistory () {
  if (!window.localStorage) {
    return []
  }
  var data = window.localStorage.getItem(InputHistoryKey)
  if (!data) {
    return []
  }
  try {
    var history = JSON.parse(data)
    return Array.isArray(history) ? history : []
  } catch (err) {
    console.warn('failed to load input history:', err)
    return []
  }
}

function updateHistory (records, value) {
  if (records.length > 0 && records[records.length - 1] === value) {
    return records.length
  }
  records.push(value)
  if (records.length > 1000) {
    records = records.slice(-1000)
  }
  if (window.localStorage) {
    try {
      window.localStorage.setItem(InputHistoryKey, JSON.stringify(records))
    } catch (err) {
      console.warn('failed to save input history:', err)
    }
  }
  return records.length
}

function bindInput (term) {
  var inputHistory = loadHistory()
  var inputOffset = inputHistory.length
  var inputValue = ''

  function exec (value) {
    if (term.reader) {
      setTimeout(function () {
        spooling = true
        term.reader(value)
        spooling = false
        drain()
      }, MinimalDelay)
    }
  }

  enter.onclick = function () {
    if (!input.value) {
      return
    }
    var value = input.value
    input.value = ''
    inputValue = ''
    inputOffset = updateHistory(inputHistory, value)
    term.input(value)
    exec(value)
  }
  input.addEventListener('keypress', function (event) {
    if (event.keyCode === KeyEnter) {
      event.preventDefault()
      enter.onclick()
    }
  })
  input.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
      case KeyUpArrow:
        (inputOffset === inputHistory.length) && (inputValue = input.value)
        if (--inputOffset >= 0 && inputOffset < inputHistory.length) {
          input.value = inputHistory[inputOffset]
        } else {
          inputOffset = inputHistory.length
          input.value = inputValue
        }
        break
      case KeyDownArrow:
        (inputOffset === inputHistory.length) && (inputValue = input.value)
        if (++inputOffset < inputHistory.length) {
          input.value = inputHistory[inputOffset]
        } else if (inputOffset > inputHistory.length) {
          inputOffset = 0
          if (inputOffset < inputHistory.length) {
            input.value = inputOffset < inputHistory.length
              ? inputHistory[inputOffset] : ''
          }
        } else {
          input.value = inputValue
        }
        break
      default:
        return
    }
    event.preventDefault()
  })
  input.focus()
}

module.exports = function () {
  var term = {}
  panel = document.getElementById('stdout-panel')
  input = document.getElementById('stdin-input')
  enter = document.getElementById('stdin-enter')

  // serve stdout
  var writerOf = writeTo.bind(null, panel)
  var write = writerOf('print')
  term.print = function (text) {
    write(text.charAt(text.length - 1) === '\n' ? text : text + '\n')
  }
  term.printf = function (text, format) {
    var render = typeof format === 'string' ? applyClass(format)
      : typeof format === 'object' ? applyStyle(format) : null
    write(text, render)
  }

  // serve stderr
  var loggerOf = logTo.bind(null, panel)
  term.verbose = loggerOf('verbose').bind(null, '#V')
  term.info = loggerOf('info').bind(null, '#I')
  term.warn = loggerOf('warn').bind(null, '#W')
  term.error = loggerOf('error').bind(null, '#E')
  term.debug = loggerOf('debug').bind(null, '#D')

  // serve shell
  term.echo = loggerOf('echo', 80).bind(null, '=')

  // serve stdin
  var inputPrompt = '>'
  var prompt = document.getElementById('stdin-prompt')
  term.prompt = function (text) {
    if (text) {
      prompt.innerText = inputPrompt = text
    }
  }
  var writeInput = loggerOf('input')
  term.input = function (text) {
    writeInput(inputPrompt, text)
  }
  bindInput(term)
  term.connect = function (reader) {
    return (term.reader = typeof reader === 'function' ? reader : null)
  }
  term.disconnect = function () {
    term.reader = null
  }
  return term
}
