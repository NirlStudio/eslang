'use strict'

var axios = require('axios')

var AxiosMethods = [
  'request', 'options', 'head', 'get', 'post', 'put', 'patch', 'delete'
]

function bind (agent, service) {
  for (var i = 0; i < AxiosMethods.length; i++) {
    var method = AxiosMethods[i]
    agent[method] = service[method].bind(service)
  }
  return agent
}

module.exports = function (exporting, context, $void) {
  var $ = $void.$
  var $Object = $.object

  // export operations on default instance.
  bind(exporting, axios)

  // create a service instance with a particular configuration set.
  exporting.of = function (config) {
    if (!config || typeof config !== 'object') {
      config = $Object.of()
    }
    return bind($Object.of({ config: config }), axios.create(config))
  }

  return true
}
