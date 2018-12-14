module.exports = function (exporting) {
  exporting.x = 1
  exporting.y = 2
  exporting.z = 3

  exporting.p = 10
  exporting.q = 10

  exporting.a = 101
  exporting.b = 102

  exporting['-a'] = 201
  exporting._b = 202
  return true
}
