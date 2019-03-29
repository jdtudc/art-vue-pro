/**
 * @Author: Created By McChen
 * @Date: 2019/3/26
 * @Mail: chenjiahao@jd.com
 * @Version: V1.0.0
 */

module.exports = {
  // 选项...
  // baseUrl
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  // 关闭文件hash
  // filenameHashing: false,
  // babel-loader 转译文件
  transpileDependencies: [],
  // 关闭生产环境sourcemap
  productionSourceMap: false,
  // webpack配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
    config.entry.app = ['./src/main.js']
  },
  // webpack-dev-server
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/': {
        target: 'http://localhost:80/', // 设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'
        }
      }
    }
  },
  transpileDependencies: [
    'node_modules/art-vue'
  ]
}
