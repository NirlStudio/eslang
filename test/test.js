'use strict'

// load Sugly testing space
var $ = require('../sugly-test')

// TODO - to implement a Sugly assert.
var assert = $.assert
var define = $.define
var should = $.should

// record JS/Sugly Bootstrapping failures
var failed = false
function ensure (func) {
  try {
    func()
  } catch (err) {
    failed = true
    throw err
  }
}

define('Javascript Environment', function () {
  define('global || window', function () {
    should('have console object', function () {
      ensure(function () {
        assert.isOk(console, 'no console object.')
        assert.isOk(console.log, 'no console.log.')
        assert.isOk(console.warn, 'no console.warn.')
        assert.isOk(console.error, 'no console.error.')
      })
    })
    should('support Symbol type', function () {
      ensure(function () {
        assert.isOk(Symbol, 'no Symbol.')
        assert.isOk(Symbol.for, 'no Symbol.for.')
        assert.isOk(Symbol.keyFor, 'no Symbol.keyFor.')
      })
    })
  })

  define('Object', function () {
    should('implement Object.assign', function () {
      ensure(function () {
        assert.typeOf(Object.assign, 'function')
      })
    })
  })

  define('String', function () {
    should('implement String.prototype.startsWith', function () {
      ensure(function () {
        assert.typeOf(String.prototype.startsWith, 'function')
      })
    })
    should('implement String.prototype.endsWith', function () {
      ensure(function () {
        assert.typeOf(String.prototype.endsWith, 'function')
      })
    })
  })

  define('Array', function () {
    should('implement Array.isArray', function () {
      ensure(function () {
        assert.typeOf(Array.isArray, 'function')
      })
    })
    should('implement Array.prototype.forEach', function () {
      ensure(function () {
        assert.typeOf(Array.prototype.forEach, 'function')
      })
    })
  })
})

// Sugly bootstrap verification
define('Sugly Bootstrapping', function () {
  define('Pretest', function () {
    should('"()"', 'be evaluated to null', function () {
      ensure(function () {
        assert.equal($.exec('()'), null)
      })
    })
    should('\'(let var "value") 32 var (var)\'', 'return the string "value"', function () {
      ensure(function () {
        var code = '(let var "value") 32 var (var)'
        assert.equal($.exec(code), 'value')
      })
    })
  })

  define('global functions ', function () {
    var functions = ['object', 'function', 'lambda',
                    'bool', 'string', 'symbol', 'number', 'date', 'array',
                    'eval', 'beval', 'exec', 'run', 'require']
    for (var i = 0; i < functions.length; i++) {
      (function (f) {
        should('have ' + f, function () {
          ensure(function () {
            assert.typeOf($.exec('($ "' + f + '")'), 'function')
          })
        })
      })(functions[i])
    }
  })

  define('global objects ', function () {
    var objects = ['(Math "random")', '(JSON "parse")', '(URI "encode")']
    for (var i = 0; i < objects.length; i++) {
      (function (o) {
        should('have ' + o, function () {
          ensure(function () {
            assert.typeOf($.exec(o), 'function')
          })
        })
      })(objects[i])
    }
  })

  define('calling generic functions from Sugly', function () {
    should('(Math random)', 'return a random number', function () {
      ensure(function () {
        assert.typeOf($.exec('(Math random)'), 'number')
      })
    })
    should('(JSON parse "{v:32}")', 'return an object with property v=32', function () {
      ensure(function () {
        var obj = $.exec('(JSON parse "{\\"v\\":32}")')
        assert.equal(obj.v, 32)
      })
    })
    should('(URI encode "my test.asp?name=ståle&car=saab")\n\t', 'return encoded special characters', function () {
      ensure(function () {
        var uri = $.exec('(URI encode "my test.asp?name=ståle&car=saab")')
        assert.equal(uri, 'my%20test.asp?name=st%C3%A5le&car=saab')
      })
    })
  })

  define('creating Sugly objects', function () {
    should('(@ 1 2 3)', 'create an array', function () {
      ensure(function () {
        var array = $.exec('(@ 1 2 3)')
        assert.isOk(array, 'failed to create an array.')
        assert.equal(array.length, 3, 'invalid length.')
        assert.equal(array[1], 2, 'invalid value.')
      })
    })
    should('(@ p1: 1 p2:"string" p3: true)', 'create an object', function () {
      ensure(function () {
        var obj = $.exec('(@ p1: 1 p2:"string" p3: true)')
        assert.isOk(obj, 'failed to create a new object.')
        assert.equal(obj[Symbol.for('p1')], 1, 'invalid number value.')
        assert.equal(obj[Symbol.for('p2')], 'string', 'invalid string value.')
        assert.equal(obj[Symbol.for('p3')], true, 'invalid boolean value.')
      })
    })
    should('($ (= (x y) (+ x y 20)) 1 10)', 'create a function and call it.', function () {
      ensure(function () {
        assert.equal($.exec('($ (= (x y) (+ x y 20)) 1 10)'), 31)
      })
    })
    should('(let base 20)\\n($\\n (= base > (x y) (+ x y base), 1 10)\n\t', 'create a lambda and call it', function () {
      assert.equal($.exec('(let base 20)\n($\n (= base > (x y) (+ x y base), 1 10)'), 31)
    })
  })
})

// pass to Sugly testing code.
define('Sugly Bootstrapping - Done!', function () {
  should('switch to Sugly testing code ...', function () {
    if (failed) {
      assert(false, 'further testing cancelled for failures in bootstrapping stage.')
    } else {
      $.run('test/test.s')
    }
  })
})