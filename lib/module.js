'use strict'

var LocalRef = /^[.{1,2}$|.{0,2}/]/

module.exports = function moduleIn ($void) {
  var loader = $void.loader
  var completeFile = $void.completeFile
  var runtimeHome = $void.$env('runtime-home')

  var $package = require('./package')($void)

  var $module = Object.create(null)

  $module.create = function create (appSpace) {
    var $path = $void.$path
    var appDir = appSpace.local['-app-dir']

    var packages = $package.create(appSpace)

    var modules = Object.create(null)
    modules.cache = Object.create(null)

    modules.resolve = function resolve (targetModule, srcModuleDir) {
      var pkg, mod
      var offset = targetModule.indexOf('/')
      if (offset >= 0) {
        pkg = targetModule.substring(0, ++offset)
        mod = targetModule.substring(offset)
      } else {
        pkg = targetModule
      }
      var pkgRoot = !LocalRef.test(pkg)
        ? pkg === 'es' // runtime modules
          ? $path.resolve(runtimeHome, 'modules')
          : $path.resolve(appDir, packages.lookup(srcModuleDir, pkg))
        : pkg.startsWith('//')
          ? $path.resolve(appDir, pkg.substring(2)) // from app root
          : pkg.startsWith('/')
            ? $path.resolve(pkg) // from fs root or origin
            : $path.resolve(srcModuleDir, pkg) // relative path

      return $path.resolve(pkgRoot, completeFile(mod))
    }

    modules.load = function load (uri) {
      loader.load(uri)
    }

    return modules
  }

  return $module
}
