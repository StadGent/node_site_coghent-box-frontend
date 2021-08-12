
const path = require('path')

module.exports = {
  devServer: {
    disableHostCheck: true,
    progress: false,
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve('./node_modules/vue'),
        //'vee-validate': path.resolve('./node_modules/vee-validate'),
        //'@vee-validate/i18n': path.resolve('./node_modules/@vee-validate/i18n'),
        //'@vee-validate/rules': path.resolve('./node_modules/@vee-validate/rules'),
      },
    },
  }
}
