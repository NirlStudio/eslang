'use strict'

module.exports = function (exporting) {
  if (typeof window === 'undefined') {
    return 'web module is only available when hosted in web browser'
  }

  function safe (obj, excluding) {
    var proto = Object.getPrototypeOf(obj)
    // cut type connection to object.
    if (proto.type && !Object.prototype.hasOwnProperty.call(proto, 'type')) {
      proto.type = null
      proto['to-code'] = function () {
        var stub = Object.create(null)
        var empty = Object.create(null)
        var fields = Object.getOwnPropertyNames(this)
        for (var i = 0, len = fields.length; i < len; i++) {
          var field = fields[i]
          var value = obj[field]
          stub[field] = value && typeof value === 'object' ? empty : value
        }
        return stub
      }
    }
    // indicate this is a class
    obj.type = (proto.constructor && proto.constructor.name) || 'unknown'
    return obj
  }

  // exports here may be wrapped in future.
  exporting.window = safe(window)
  exporting.document = safe(window.document)
  exporting.navigator = safe(window.navigator)
  exporting.location = safe(window.location)
  return true
}
