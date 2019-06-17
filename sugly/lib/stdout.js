'use strict'

module.exports = function ($void, stdout) {
  var Symbol$ = $void.Symbol
  var $export = $void.export
  var thisCall = $void.thisCall
  var staticOperator = $void.staticOperator

  // standard output.
  $export($void, '$print', function (value) {
    return stdout.print.apply(stdout, arguments)
  })

  // standard output.
  $export($void, '$printf', function (value, format) {
    return stdout.printf(
      typeof value === 'undefined' ? '' : value,
      typeof format === 'undefined' ? null : format
    )
  })

  // standard error, but only warning exists in sugly space.
  var lastWarning = null // save to make it testable.
  function generateWarningId () {
    var ts = Date.now()
    return !lastWarning || ts !== lastWarning[1][0] ? [ts, 0]
      : [ts, lastWarning[1][1] + 1]
  }

  $export($void, '$warn', function (category) {
    if (typeof category === 'undefined') {
      return lastWarning
    }

    if (typeof category !== 'string' && category !== null) {
      lastWarning = ['stdout:warn', generateWarningId(),
        'category should be a string:', category
      ]
    } else if (category) { // clear warning
      lastWarning = [category, generateWarningId()]
        .concat(Array.prototype.slice.call(arguments, 1))
    } else {
      return (lastWarning = ['', generateWarningId()])
    }
    stdout.warn.apply(stdout, lastWarning)
    return lastWarning
  })

  var sourceOf = function (atomValue) {
    return thisCall(atomValue, 'to-string')
  }
  var evaluate = function (clause, space) {
    evaluate = $void.evaluate
    return evaluate(clause, space)
  }
  var env = function (name) {
    env = $void.env
    return env(name)
  }
  staticOperator('debug', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2 || !space.app) {
      return null
    }
    var args = [sourceOf(clause), '\n ']
    for (var i = 1; i < clist.length; i++) {
      (i > 1) && args.push('\n ')
      args.push(sourceOf(clist[i]), '=', evaluate(clist[i], space))
    }
    if (env('is-debugging') === true) {
      stdout.debug.apply(stdout, args)
    } else if ($void.env('logging-level') >= 2) {
      lastWarning = ['stdout:debug',
        '(debug ...) is only for temporary usage in coding.',
        'Please consider to remove it or replace it with (log d ...) for',
        clause
      ]
      stdout.warn.apply(stdout, lastWarning)
    }
    return args[args.length - 1]
  })

  staticOperator('log', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2 || !space.app) {
      return false
    }
    var log = normalizeLevel(clist[1])
    if (log === null) {
      return false
    } else if (!log) {
      lastWarning = ['stdout:log', 'invalid log level (v/i/w/e/d):',
        clist[1], 'in clause', clause
      ]
      stdout.warn.apply(stdout, lastWarning)
      return false
    }

    var args = []
    for (var i = 2; i < clist.length; i++) {
      args.push(evaluate(clist[i], space))
    }
    log.apply(stdout, args)
    return true
  })

  function normalizeLevel (type) {
    if (type instanceof Symbol$) {
      type = type.key
    } else if (typeof type !== 'string') {
      return false
    }

    switch (type.toLowerCase()) {
      case 'd':
      case 'debug':
        return $void.env('is-debugging') === true ? stdout.debug : null
      case 'v':
      case 'verbose':
        return $void.env('logging-level') >= 4 ? stdout.verbose : null
      case 'i':
      case 'info':
        return $void.env('logging-level') >= 3 ? stdout.info : null
      case 'w':
      case 'warn':
      case 'warning':
        return $void.env('logging-level') >= 2 ? stdout.warn : null
      case 'e':
      case 'err':
      case 'error':
        return $void.env('logging-level') >= 1 ? stdout.error : null
      default:
        return false
    }
  }
}
