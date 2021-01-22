'use strict'

function reload (print) {
  var counter = 3
  setInterval(function () {
    if (counter > 0) {
      print(counter--)
    } else {
      window.location.reload()
    }
  }, 500)
  return 'reloading ...'
}

module.exports = function exitIn ($void) {
  return function exit (code) {
    return reload(function (counter) {
      switch (counter) {
        case 1:
          return $void.$printf('.' + counter, 'red')
        case 2:
          return $void.$printf('..' + counter, 'yellow')
        default:
          return $void.$printf('...' + counter, 'blue')
      }
    })
  }
}
