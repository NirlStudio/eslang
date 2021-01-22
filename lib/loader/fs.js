'use strict'

var fs = require('fs')

function fileUnavailable (file, err) {
  return ['503', 'File Unavailable', [file, err]]
}

function getTimestamp (file) {
  var stats = fs.statSync(file)
  return 'mtime:' + stats.mtimeMs.toString()
}

module.exports = function fsIn ($void) {
  return {
    load: function (file) {
      try {
        var version = getTimestamp(file)
        var code = fs.readFileSync(file, 'utf8')
        return [code, version]
      } catch (err) {
        return [null, fileUnavailable(file, err)]
      }
    }
  }
}
