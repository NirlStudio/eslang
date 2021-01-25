'use strict'

var LocalRef = /^[.{1,2}$|.{0,2}/]/

module.exports = function moduleIn ($void) {
  var warn = $void.$warn
  var completeFile = $void.completeFile
  var runtimeHome = $void.$env('runtime-home')

  var $package = require('./package')($void)

  var $module = Object.create(null)

  $module.create = function create (appSpace) {
    var $path = $void.$path
    var loader = $void.loader
    var appDir = appSpace.local['-app-dir']

    var packages = $package.create(appSpace)

    var modules = Object.create(null)
    var cache = modules.cache = Object.create(null)

    modules.resolve = function resolve (targetModule, srcModuleDir) {
      if (loader.isRemote(targetModule)) {
        return completeFile(targetModule)
      }

      var path = loader.isRemote(srcModuleDir) && $path.http ? $path.http : $path
      if (path.isAbsolute(targetModule)) {
        return completeFile(path.normalize(targetModule))
      }

      var pkg, mod
      var offset = targetModule.indexOf('/')
      if (offset >= 0) {
        pkg = targetModule.substring(0, offset++)
        mod = targetModule.substring(offset)
      } else {
        pkg = targetModule
      }
      var pkgRoot = !LocalRef.test(pkg)
        ? pkg === 'es' // runtime modules
          ? path.resolve(runtimeHome, 'modules')
          : packages.lookup(srcModuleDir, pkg)
        : pkg.startsWith('//')
          // TODO: from src pkg root, not app root
          ? path.resolve(appDir, pkg.substring(2))
          : pkg.startsWith('/')
            ? path.resolve(pkg) // from fs root or origin
            : path.resolve(srcModuleDir, pkg) // relative path

      return path.resolve(pkgRoot, completeFile(mod))
    }

    modules.lookupInCache = function lookupInCache (uri, moduleUri) {
      var module_ = cache[uri] || (cache[uri] = {
        status: 0, // an empty module.
        props: {
          '-module': uri
        }
      })
      if (module_.status === 100) {
        warn('import', 'loop dependency on', module_.props, 'from', moduleUri)
        return module_
      }
      if (module_.status !== 200) {
        module_.status = 0 // reset statue to re-import.
        module_.props['-imported-by'] = moduleUri
        module_.props['-imported-at'] = Date.now()
      }
      return module_
    }

    return modules
  }

  return $module
}
