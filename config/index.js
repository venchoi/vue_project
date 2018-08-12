// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var poxyOrigin = 'http://vip.cp.test.yuncaijing.com/hapi';

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static/',
    assetsPublicPath: '/res/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8989,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/user': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/user': '/user'
        }
      },
      '/index': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/index': '/index'
        }
      },
      '/news': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/news': '/news'
        },
      },
      '/stock': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/stock': '/stock'
        },
      },
      '/market': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/market': '/market'
        },
      },
      '/picking': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/picking': '/picking'
        },
      },
      '/message': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/message': '/message'
        },
      },
      '/mall': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/mall': '/mall'
        },
      },
      '/configs': {
        target: poxyOrigin,
          changeOrigin: true,
          pathRewrite: {
          '^/configs': '/configs'
        },
      },
      '/FirmTrack': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/FirmTrack': '/FirmTrack'
        }
      },
      '/tool': {
        target: poxyOrigin,
        changeOrigin: true,
        pathRewrite: {
          '^/tool': '/tool'
        }
      },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
