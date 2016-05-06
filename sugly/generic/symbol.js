'use strict'

var SpecialSymbol = /^[\$\`\@\:]{1}$/
var InvalidSymbol = /[\(\)\$\`\'\@\:\"\#\\\s]/

function Symbol$ (key) {
  Object.defineProperty(this, '$key', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: key
  })
}

function Symbol$is_key (key) {
  return typeof key === 'string' && (SpecialSymbol.test(key) || !InvalidSymbol.test(key))
}

function useNativeSymbol () {
  var nothing = Symbol.for('')

  return {
    Nothing: nothing,
    'is-key': Symbol$is_key,
    // to be used by tokenizer
    $InvalidSymbol: InvalidSymbol,

    for: function Symbol$for (key) {
      return Symbol$is_key(key) ? Symbol.for(key) : nothing
    },

    'key-for': function Symbol$key_for (sym) {
      return typeof sym === 'symbol' ? Symbol.keyFor(sym) : ''
    },

    is: function Symbol$is (sym) {
      return typeof sym === 'symbol'
    }
  }
}

var sharedSymbols = Object.create(null)
var nothing = sharedSymbols[''] = new Symbol$('')

function usePolyfillSymbol () {
  return {
    Nothing: nothing,
    'is-key': Symbol$is_key,
    // to be used by tokenizer
    $InvalidSymbol: InvalidSymbol,

    for: function Symbol$for (key) {
      if (!Symbol$is_key(key)) {
        return nothing
      }
      if (sharedSymbols[key]) {
        return sharedSymbols[key]
      }
      return (sharedSymbols[key] = new Symbol$(key))
    },

    'key-for': function Symbol$key_for (sym) {
      return sym instanceof Symbol$ ? sym.$key : ''
    },

    is: function Symbol$is (sym) {
      return sym instanceof Symbol$
    }
  }
}

module.exports = function (JS) {
  if (!JS) {
    JS = global || window
  }
  /* uncomment to test polyfill symbol */
  // JS.Symbol = null
  return JS.Symbol ? useNativeSymbol() : usePolyfillSymbol()
}
