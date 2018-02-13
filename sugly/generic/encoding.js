'use strict'

// for any object, the object.proto.to-code will always be called firstly,
// in the default to-code, the object.to-code will be called. remove the resolve logic.
// the same for the constructor: to ensure the instance will always be returned.
// immediately call to an operator, lambda or function.
// for object:
//  - anything defined in type cannot be overridden in instance
//  - object.proto.* will allow the overridden and ensure the consistency and type safe.

// ployfill Map & Array.prototype.indexOf
var createIndex = typeof Map === 'function' ? function () {
  var index = new Map()
  return {
    get: index.get.bind(index),
    set: function (key, value) {
      index.set(key, value)
      return value
    },
    add: function (key, value) {
      index.set(key, value)
      return value
    }
  }
} : typeof Array.prototype.indexOf === 'function' ? function () {
  var keys = []
  var values = []
  return {
    get: function (key) {
      var offset = keys.indexOf(key)
      if (offset >= 0) {
        return values[offset]
      }
    },
    set: function (key, value) {
      var offset = keys.indexOf(key)
      if (offset >= 0) {
        return (values[offset] = value)
      }
      return this.add(key, value)
    },
    add: function (key, value) {
      keys.push(key)
      values.push(value)
      return value
    }
  }
} : function () {
  var keys = []
  var values = []
  return {
    get: function (key) {
      for (var i = keys.length - 1; i >= 0; i--) {
        if (keys[i] === key) {
          return values[i]
        }
      }
    },
    set: function (key, value) {
      for (var i = keys.length - 1; i >= 0; i--) {
        if (keys[i] === key) {
          return (values[i] = value)
        }
      }
      return this.add(key, value)
    },
    add: function (key, value) {
      keys.push(key)
      values.push(value)
      return value
    }
  }
}

module.exports = function ($void) {
  var Tuple$ = $void.Tuple
  var $Tuple = $void.$.tuple
  var $Array = $void.$.array
  var $Symbol = $void.$.symbol
  var $Object = $void.$.object
  var sharedSymbolOf = $void.sharedSymbolOf

  $void.EncodingContext = function (root) {
    this.objs = createIndex()
    this.objs.add(this.root = root, null)
    this.clist = []
    this.counter = 0
  }
  $void.EncodingContext.prototype = {
    _createVar: function () {
      return ++this.counter > 256
        ? $Symbol.of('_' + this.counter) : sharedSymbolOf('_' + this.counter)
    },
    _declareVar: function (type) {
      return type === $Array ? $Tuple.array
        : type === $Object ? $Tuple.object
          : new Tuple$([$Symbol.object, $Symbol.pairing, type['to-code']()])
    },
    _updateVar: function (record) {
      var type = record[2]
      return type === $Array
        ? new Tuple$([record[1], $Symbol.of('append'), record[3]])
        : type === $Object
          ? new Tuple$([$Symbol.object, $Symbol.of('assign'), record[1], record[3]])
          : new Tuple$([$Symbol.class, $Symbol.of('attach'), record[1], record[3]])
    },
    begin: function (obj) {
      var offset = this.objs.get(obj)
      if (typeof offset === 'undefined') { // first touch
        return this.objs.add(obj, null)
      }
      var sym
      if (offset === null) { // recursive reference.
        sym = this._createVar()
        this.objs.set(obj, this.clist.length)
        this.clist.push([0, sym, null])
        return sym
      }
      // repeated reference
      var record = this.clist[offset]
      if (!record[0] || record[1]) { // recursive or referred twice
        return record[1]
      }
      var code = record[2]
      if (!(code instanceof Tuple$) || code.$.length < 1) { // an atom value
        return code
      }
      // code must be a plain tuple!!!
      // allocate a var name
      sym = record[1] = this._createVar()
      record[2] = new Tuple$(code.$) // duplicate whole tuple
      code.$ = [sym] // update value tuple to a reference
      return sym
    },
    end: function (obj, type, code) {
      code = new Tuple$([code], true)
      var offset = this.objs.get(obj)
      if (offset === null) {
        this.objs.set(obj, this.clist.length)
        this.clist.push([1, null, code])
        return obj === this.root ? this.finalize() : code
      }
      // recursive reference
      this.clist[offset][2] = type
      this.clist.push([2, this.clist[offset][1], type, code])
      return obj === this.root ? this.finalize() : this.clist[offset][1]
    },
    finalize: function () {
      if (this.counter < 1) {
        return this.clist[this.clist.length - 1][2]
      }
      var code = [$Symbol.lambda, $Tuple.object]
      for (var i = 0; i < this.clist.length; i++) {
        var record = this.clist[i]
        switch (record[0]) {
          case 0: // declare empty array or object
            code.push(new Tuple$([$Symbol.var, record[1], this._declareVar(record[2])]))
            break
          case 1: // declare array or object
            if (record[1]) {
              code.push(new Tuple$([$Symbol.var, record[1], record[2]]))
            }
            break
          default: // update empty array or object to its value
            code.push(this._updateVar(record))
        }
      }
      return new Tuple$(code)
    }
  }
}
