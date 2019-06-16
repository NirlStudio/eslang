const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const webpack = require('webpack')
const HooksPlugin = require('hooks-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MODE_PROD = 'production'
const MODE_DEV = 'development'

const ignoreNativeModules = new webpack.IgnorePlugin(
  /^(\.\/loader-fs|node-localstorage|colors\/safe)$/
)

const suglyDirs = [
  'examples/',
  'modules/',
  'spec/',
  'test/',
  'tools/',
  'web/'
]

const updateWebSite = new HooksPlugin({
  beforeRun: () => {
    fs.existsSync('dist') || shell.mkdir('dist')
    fs.existsSync('dist/www') && shell.rm('-r', 'dist/www')
    shell.mkdir('dist/www')
    shell.mkdir('dist/www/modules')
    shell.mkdir('dist/www/test')
  },
  'beforeCompile@': (params, callback) => {
    var dependencies = params.compilationDependencies
    if (dependencies.includeSuglyFiles) {
      return callback()
    }
    var files = readCachedFiles()
    if (files) {
      files.forEach(file =>
        !dependencies.has(file) && dependencies.add(file)
      )
    } else {
      dependencies.add('profile.s')
      suglyDirs.forEach(dir => {
        files = []
        readDir(dir, file => {
          if (file.endsWith('.s')) {
            files.push(file)
            !dependencies.has(file) && dependencies.add(file)
          }
        })
        updateCachedFiles(dir, files)
      })
    }
    dependencies.includeSuglyFiles = true
    callback()
  },
  done: () => {
    shell.cp('web/favicon.*', 'dist/www/')
    shell.cp('web/index.css', 'dist/www/')
    shell.cp('profile.s', 'dist/www/')
    shell.cp('web/*.s', 'dist/www/')
    shell.cp('modules/*.s', 'dist/www/modules/')
    shell.cp('test/test.s', 'dist/www/test/')
    shell.cp('-r', 'examples/', 'dist/www/')
    shell.cp('-r', 'spec/', 'dist/www/')
    shell.cp('-r', 'tools/', 'dist/www/')
  }
})

const injectJavaScript = new HtmlWebpackPlugin({
  template: 'web/index.html'
})

module.exports = (env, options) => {
  const mode = options.mode === MODE_PROD ? MODE_PROD : MODE_DEV
  const name = mode === MODE_PROD ? 'sugly.min' : 'sugly'
  return {
    mode,
    entry: './web/lib/shell.js',
    plugins: [
      ignoreNativeModules,
      injectJavaScript,
      updateWebSite
    ],
    output: {
      filename: `${name}.js`,
      path: path.resolve(__dirname, 'dist/www'),
      sourceMapFilename: `${name}.map`
    },
    devtool: 'source-map',
    devServer: {
      port: 6501,
      publicPath: '/',
      contentBase: 'dist/www',
      hot: true,
      open: true
    }
  }
}

// util functions
function readDir (dir, callback) {
  var files = fs.readdirSync(dir)
  files.forEach((file) => {
    file = path.join(dir, file)
    fs.statSync(file).isDirectory()
      ? readDir(file, callback)
      : callback(file)
  })
}

function cachePathOf (dir) {
  return path.resolve('dist', '.cache_' + dir.replace(/[\\/.]/g, '_') + '.json')
}

function readCachedFiles (dir) {
  try {
    var files = require(cachePathOf(dir))
    return Array.isArray(files) ? files : null
  } catch (err) {
    return null
  }
}

function updateCachedFiles (dir, files) {
  try {
    fs.writeFileSync(cachePathOf(dir), JSON.stringify(files, null, '  '), 'utf8')
  } catch (err) {
    console.warn('Failed to save file list for', dir)
  }
}
