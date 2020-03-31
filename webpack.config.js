const webpack = require('atool-build/lib/webpack');
const pxtorem = require('postcss-pxtorem');

module.exports = function(webpackConfig, env) {

    webpackConfig.babel.plugins.push('transform-runtime');

    postcss: [
        pxtorem({
            rootValue: 100,
            propWhiteList: [],
        })
    ];

    webpackConfig.babel.plugins.push(['import', {
        libraryName: 'antd',
        style: 'css',  //因为你使用css important 所以,你不能改变风格(js)
    }]);

//    webpackConfig.babel.plugins.push(['import', {
//	  libraryName: 'ant-mobile',
//      style: 'css',
//    }]);

  // Support hmr
    if (env === 'development') {
        webpackConfig.devtool = '#eval';
        webpackConfig.babel.plugins.push('dva-hmr');
    } else {
        webpackConfig.babel.plugins.push('dev-expression');
    }

  // Don't extract common.js and common.css
//   webpackConfig.plugins = webpackConfig.plugins.filter(function(plugin) {
//        return !(plugin instanceof webpack.optimize.CommonsChunkPlugin);
//   });

  // Support CSS Modules
  // Parse all less files as css module.
    webpackConfig.module.loaders.forEach(function(loader, index) {
        if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
            loader.include = /node_modules/;
            loader.test = /\.less$/;
            test: /\.css$/;
            loader: 'style!css!postcss';
        }
        if (loader.test.toString() === '/\\.module\\.less$/') {
            loader.exclude = /node_modules/;
            loader.test = /\.less$/;
            test: /\.css$/;
            loader: 'style!css!postcss';
        }
    });

    webpackConfig.module.noParse = /ali-oss/;

    return webpackConfig;
};
