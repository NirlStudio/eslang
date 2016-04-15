'use strict'

// Assemble a Sugly space to be used for testing purpose
var load = require('./loader-fs')()
var $ = require('./sugly')(load)

// to explicitly trigger a failure from Sugly code.
$.$export('fails', function (message) {
  throw new Error(message)
})

// TODO - to implement a Sugly assert.
$.$export('assert', require('chai').assert)

/* global describe, it *//* from Mocha */
if (!describe || !it) {
  throw new Error('Currently, mocha is required to run the test.')
}

// (define "feature" (= ...).
$.$export('define', describe)

// (shoud "something" "happen" (= ...). OR
// (should "happen" (= ..).
$.$export('should', function (subject, behaviour, cb) {
  if (typeof behaviour === 'function') {
    cb = behaviour
    behaviour = subject
    subject = ''
  } else {
    if (!subject.endsWith(' ')) {
      subject += ' '
    }
  }
  return it(subject + 'should ' + behaviour, cb)
})

module.exports = $