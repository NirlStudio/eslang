const path = require('path')
const shell = require('shelljs')
const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const HooksPlugin = require('hooks-webpack-plugin')

const MODE_PROD = 'production'
const MODE_DEV = 'development'

const ignoreNativeModules = new webpack.IgnorePlugin(
  /^(\.\/loader-fs|node-localstorage)$/
)

const injectPackedScript = new HtmlPlugin({
  template: path.join(__dirname, 'web/index.html'),
  inject: 'head',
  filename: './www/index.html'
})

const prepareDevWebSite = new HooksPlugin({
  beforeRun: () => {
    shell.rm('-r', 'dist/www')
    shell.mkdir('dist/www')
    shell.mkdir('dist/www/modules')
    shell.mkdir('dist/www/test')
  },
  done: () => {
    shell.cp('dist/sugly.js', 'dist/www/')
    shell.cp('dist/sugly.map', 'dist/www/')
    shell.cp('web/@.s', 'dist/www/')
    shell.cp('-r', 'examples/', 'dist/www/')
    shell.cp('-r', 'spec/', 'dist/www/')
    shell.cp('modules/*.s', 'dist/www/modules/')
    shell.cp('test/test.s', 'dist/www/test/')
  }
})

module.exports = (env, options) => {
  const mode = options.mode === MODE_PROD ? MODE_PROD : MODE_DEV
  const isProd = mode === MODE_PROD
  const name = isProd ? 'sugly.min' : 'sugly'
  const plugins = isProd ? [
    ignoreNativeModules
  ] : [
    ignoreNativeModules,
    injectPackedScript,
    prepareDevWebSite
  ]
  const config = {
    entry: './web/index.js',
    mode,
    plugins,
    output: {
      filename: `${name}.js`,
      sourceMapFilename: `${name}.map`
    },
    devtool: 'source-map'
  }
  return isProd ? config : { ...config,
    devServer: {
      port: 6501,
      publicPath: '/',
      contentBase: 'dist/www',
      hot: true
    }
  }
}
