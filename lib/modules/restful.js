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

module.exports = function $restful ($void) {
  var $ = $void.$
  var $Object = $.object
  var restful = Object.create(null)

  // export operations on default instance.
  bind(restful, axios)

  // create a service instance with a particular configuration set.
  restful.of = function (config) {
    if (!config || typeof config !== 'object') {
      config = $Object.empty()
    }
    return bind($Object.of({ config: config }), axios.create(config))
  }

  return restful
}
