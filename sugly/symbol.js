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

function Symbol$isKey (key) {
  return typeof key === 'string' && (SpecialSymbol.test(key) || !InvalidSymbol.test(key))
}

function useNativeSymbol () {
  var nothing = Symbol.for('')

  return {
    Nothing: nothing,
    isKey: Symbol$isKey,
    // to be used by tokenizer
    $InvalidSymbol: InvalidSymbol,

    for: function Symbol$for (key) {
      return Symbol$isKey(key) ? Symbol.for(key) : nothing
    },

    keyFor: function Symbol$keyFor (sym) {
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
    isKey: Symbol$isKey,
    // to be used by tokenizer
    $InvalidSymbol: InvalidSymbol,

    for: function Symbol$for (key) {
      if (!Symbol$isKey(key)) {
        return nothing
      }
      if (sharedSymbols[key]) {
        return sharedSymbols[key]
      }
      return (sharedSymbols[key] = new Symbol$(key))
    },

    keyFor: function Symbol$keyFor (sym) {
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
