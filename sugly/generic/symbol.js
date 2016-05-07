'use strict'

var $export = require('../export')

var SpecialSymbol = /^[\$\`\@\:]{1}$/
var InvalidSymbol = /[\(\)\$\`\'\@\:\"\#\\\s]/

function isKey () {
  return function Symbol$is_key (key) {
    return typeof key === 'string' && (SpecialSymbol.test(key) || !InvalidSymbol.test(key))
  }
}

function useNativeSymbol () {
  var nothing = Symbol.for('')
  var is_key = isKey()

  return {
    // to be used by tokenizer
    $InvalidSymbol: InvalidSymbol,
    $Symbol: Symbol,
    Nothing: nothing,
    is_key: is_key,

    is: function () {
      return function Symbol$is (sym) {
        return typeof sym === 'symbol'
      }
    },

    valueOf: function () {
      return function Symbol$value_of (key) {
        return is_key(key) ? Symbol.for(key) : nothing
      }
    },

    keyOf: function () {
      return function Symbol$key_of (sym) {
        return typeof sym === 'symbol' ? Symbol.keyFor(sym) : ''
      }
    },

    isSame: function () {
      return function Symbol$is_same (sym) {
        return typeof this === 'symbol' && typeof sym === 'symbol'
          ? Symbol.keyFor(this) === Symbol.keyFor(sym) : 0
      }
    },

    toCode: function () {
      return function Symbol$to_code () {
        return typeof this === 'symbol' ? Symbol.keyFor(this) : ''
      }
    },

    toString: function () {
      return function Symbol$to_string () {
        return typeof this === 'symbol' ? '(` ' + Symbol.keyFor(this) + ')' : ''
      }
    }
  }
}

function usePolyfillSymbol () {
  function Symbol$ (key) {
    Object.defineProperty(this, '$key', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: key
    })
  }

  var sharedSymbols = Object.create(null)
  var nothing = sharedSymbols[''] = new Symbol$('')
  var is_key = isKey()

  return {
    // to be used by tokenizer
    $InvalidSymbol: InvalidSymbol,
    $Symbol: Symbol$,
    Nothing: nothing,
    is_key: is_key,

    is: function () {
      return function Symbol$is (sym) {
        return sym instanceof Symbol$ || typeof sym === 'symbol'
      }
    },

    valueOf: function () {
      return function Symbol$value_of (key) {
        if (!is_key(key)) {
          return nothing
        }
        if (sharedSymbols[key]) {
          return sharedSymbols[key]
        }
        return (sharedSymbols[key] = new Symbol$(key))
      }
    },

    keyOf: function () {
      return function Symbol$key_of (sym) {
        if (sym instanceof Symbol$) {
          return sym.$key
        }
        return typeof sym === 'symbol' ? Symbol.keyFor(sym) : ''
      }
    },

    isSame: function () {
      return function Symbol$is_same (value) {
        var thisKey
        if (this instanceof Symbol$) {
          thisKey = this.$key
        } else if (typeof this === 'symbol') {
          thisKey = Symbol.keyFor(this)
        } else {
          return
        }

        var valueKey
        if (value instanceof Symbol$) {
          valueKey = value.$key
        } else if (typeof value === 'symbol') {
          valueKey = Symbol.keyFor(value)
        } else {
          return
        }

        return thisKey === valueKey
      }
    },

    toCode: function () {
      return function Symbol$to_code () {
        if (this instanceof Symbol$) {
          return this.$key
        }
        return typeof this === 'symbol' ? Symbol.keyFor(this) : ''
      }
    },

    toString: function () {
      return function Symbol$to_string () {
        if (this instanceof Symbol$) {
          return '(` ' + this.$key + ')'
        }
        return typeof this === 'symbol' ? '(` ' + Symbol.keyFor(this) + ')' : ''
      }
    }
  }
}

module.exports = function ($) {
  var native = typeof Symbol === 'function'
  var impl = native ? useNativeSymbol() : usePolyfillSymbol()

  var type = $export($, 'Symbol')
  type.$InvalidSymbol = impl.$InvalidSymbol
  type.$Symbol = impl.$Symbol
  type.Nothing = impl.Nothing
  $export(type, 'is-key', impl.is_key)

  $export(type, 'is', impl.is())
  $export(type, 'value-of', impl.valueOf())
  $export(type, 'key-of', impl.keyOf())

  var pt = $export(type, null, $export.copy('$'))
  $export(pt, 'is', impl.isSame())
  $export(pt, 'equals', impl.isSame())
  $export(pt, 'to-code', impl.toCode())
  $export(pt, 'to-string', impl.toString())

  $export(pt, 'key', impl.toCode())
  return type
}
