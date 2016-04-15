'use strict'

var fs = require('fs')
var path = require('path')

function notFound (source) {
  source = JSON.stringify(source)
  return '(console warn "File not found:" ' + source + ').' +
    '(@statusCode: 404 ' +
      'statusDescription: "File not found" ' +
      'source: ' + source + ').'
}

function failedInReading (source, err) {
  source = JSON.stringify(source)
  return '(console warn "Failed to read file:" ' + source + ').' +
    '(@statusCode: 500 ' +
      'statusDescription: "Failed in reading file" ' +
      'source: ' + source + ' ' +
      'error: ' + JSON.stringify(err.toString()) + ').'
}

function loadFile (source, cb) {
  fs.exists(source, function (exists) {
    if (!exists) {
      return cb(notFound(source))
    }

    fs.readFile(source, 'utf8', function (err, code) {
      if (err) {
        return cb(failedInReading(source, err))
      } else {
        return cb(code)
      }
    })
  })
}

function loadFileSync (source) {
  if (!fs.existsSync(source)) {
    return notFound(source)
  }
  try {
    return fs.readFileSync(source, 'utf8')
  } catch (err) {
    return failedInReading(source, err)
  }
}

function load (source, cb) {
  if (!source) {
    return typeof cb === 'function' ? cb(null) : null
  }
  source = path.resolve(source) // to absolute path.
  return typeof cb === 'function' ? loadFile(source, cb) : loadFileSync(source)
}

load.normalize = function (source) {
  return 'file://' + (source ? path.resolve(source) : '') // to FQDN
}

module.exports = function (/* options */) {
  return load
}
