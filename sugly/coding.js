'use strict'

module.exports = function $coding ($void) {
  var Symbol$ = $void.Symbol

  function $Coding (root, asCompat) {
    // compat mode ignores any unnecessary whitespace.
    this.asCompat = asCompat
    // an object tree need to be analyzed firstly before generating code.
    this.analyzed = false

    // a counter used to generate lcoal variable name
    this._counter = 0
    // the map of all objects under root to their information.
    this._map = new Map()
    // the buffer to save lines of code.
    this._code = []

    // automatically analyze/touch the root object.
    this.analyze(root)
  }

  $Coding.prototype = {
    // check if an object is repeating.
    analyze: function analyze (obj) {
      var status = this._map.get(obj)
      if (!status) {
        this._map.set(obj, {})
        return 0 // first time, to recursively analyze child objects.
      }
      if (status.key) {
        return 2 // variable has been created
      }
      status.key = 'V' + this._counter
      status.stage = 0
      this._counter += 1
      return 1
    },
    // called to save code of creating an empty object
    create: function create (obj, code) {
      if (this._code.length < 1) {
        this._code.push('((= ()')
      }
      this._code.push('(var ' + this._map.get(obj).key + ' ' + code + ')')
    },
    query: function query (obj) {
      var status = this._map.get(obj)
      return status && status.key
    },
    // query if an object need to be declared as a variable.
    generating: function generating (obj) {
      var status = this._map.get(obj)
      if (!status) {
        console.warn('state is inconsistent.')
        status = {}
      }
      if (status.key) {
        status.stage += 1 // 1 - generating, 2 - generated.
      }
      return status
    },
    // provide code to update the object with its properties.
    update: function update (obj, code) {
      this._code.push(code)
    },
    // return the count of lines of code
    count: function count () {
      return this._code.length
    },
    // generate final code with the last piece of it.
    end: function end (code) {
      this._code.push(code)
      this._code.push(') ).')
      return this._code.join(this.asCompat ? ' ' : '\n')
    },
    // only used to check if the same object has appeared once.
    touch: function touch (obj) {
      if (this._map.has(obj)) {
        return true
      }
      this._map.add(obj, true)
      return false
    },
    // call the correct to-code method of a value
    toCode: function toCode (value, defaulue) {
      if (typeof value === 'undefined' || value === null) {
        return 'null'
      }
      var toCode = value['to-code'] ||
        (value.type && value.type.proto && value.type.proto['to-code'])
      return typeof toCode === 'function' ? toCode.call(value, this) : defaulue
    },
    decompile: function decompile (value, code) {
      if (!Array.isArray(code)) {
        code = []
      }
      // null, bool, number, symbol, string and array
      if (typeof value === 'undefined' || // intercept undefined as null.
          value === null ||
          typeof value === 'boolean' ||
          typeof value === 'number' ||
          typeof value === 'string' ||
          value instanceof Symbol$) {
        code.push(this.toCode(value, ''))
      } else if (typeof value === 'function') {
        code.push('(=())')
      } else if (typeof value !== 'object') {
        code.push('()')
      } else if (!Array.isArray(value)) {
        code.push('(@:)')
      } else {
        code.push('(')
        value.forEach(function decompileClause (clause) {
          this.decompile(clause, code)
        }, this)
        code.push(')')
      }
      return code
    }
  }

  $void.coding = {
    // check if the coding is a coding context instance.
    is: function is (coding) {
      return coding instanceof $Coding
    },
    // create a new coding context.
    start: function $start (root, asCompat) {
      // by default, use readable codign style.
      return new $Coding(root, asCompat === true)
    },
    toString: function toString (value) {
      if (value === null) {
        return 'null'
      }
      var toString = value['to-string'] ||
        (value.type && value.type.proto && value.type.proto['to-string'])
      return typeof toString === 'function' ? toString.call(value) : '(?)'
    }
  }
}
