'use strict'

module.exports = function (exporting, context, $void) {
  // to expose all native io members.
  Object.assign(exporting, $void.$io)
  return true
}
