'use strict'

var LocalRef = /^[.{1,2}$|.{0,2}/]/

module.exports = function moduleIn ($void) {
  var warn = $void.$warn
  var completeFile = $void.completeFile
  var runtimeHome = $void.$env('runtime-home')

  var $package = require('./package')($void)

  function resolveOrigin (moduleUri) {
    var url = new URL(moduleUri)
    return url.protocol + '//' + url.host
  }

  var $module = Object.create(null)

  $module.create = function create (appSpace) {
    var $path = $void.$path
    var loader = $void.loader
    var appHome = appSpace.local['-app-home']

    var packages = $package.create(appSpace)

    var modules = Object.create(null)
    var cache = modules.cache = Object.create(null)

    function resolveForRemote (path, targetModule, srcModuleDir) {
      var pkgRoot
      if (targetModule.startsWith('//')) {
        pkgRoot = packages.findSourcePackage(srcModuleDir) || (
          loader.isRemote(appHome) ? appHome : resolveOrigin(srcModuleDir)
        )
      } else if (targetModule.startsWith('/')) {
        pkgRoot = loader.isRemote(appHome) ? appHome
          : resolveOrigin(srcModuleDir)
      }
      return pkgRoot && path.join(pkgRoot, targetModule)
    }

    function resolveForLocal (targetModule, srcModuleDir) {
      if ($path.isAbsolute(targetModule)) {
        if (!targetModule.startsWith('//')) {
          return $path.normalize(targetModule)
        }
      }
      if (targetModule.startsWith('//')) {
        var pkgRoot = packages.findSourcePackage(srcModuleDir) || appHome
        return $path.join(pkgRoot, targetModule)
      }
      return null
    }

    function resolvePackage (path, targetModule, srcModuleDir) {
      var pkg, mod
      var offset = targetModule.indexOf('/')
      if (offset > 0) { // offset cannot be 0
        pkg = targetModule.substring(0, offset)
        mod = targetModule.substring(offset) || '/' // include leading '/'
      } else {
        pkg = targetModule
        mod = '/'
      }

      var pkgRoot = pkg === 'es'
        ? $path.resolve(runtimeHome, 'modules')
        : packages.resolveReference(srcModuleDir, pkg)
      return path.join(pkgRoot, completeFile(mod))
    }

    modules.resolve = function resolve (targetModule, srcModuleDir) {
      var completedTarget = completeFile(targetModule)
      if (loader.isRemote(targetModule)) {
        return completedTarget
      }

      var path, moduleUri
      if (loader.isRemote(srcModuleDir)) {
        path = $path.http || $path
        moduleUri = resolveForRemote(path, completedTarget, srcModuleDir)
      } else {
        path = $path
        moduleUri = resolveForLocal(completedTarget, srcModuleDir)
      }
      if (moduleUri) {
        return moduleUri
      }
      if (LocalRef.test(targetModule)) {
        return path.resolve(srcModuleDir, completedTarget)
      }

      // not './' '../' '/' or '//'
      return resolvePackage(path, targetModule, srcModuleDir)
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
