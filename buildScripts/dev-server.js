require('./check-versions')();

process.env.NODE_ENV = 'development';

let config = require('./config.js');
let path = require('path');
let express = require('express');
let webpack = require('webpack');
let opn = require('opn');
let proxyMiddleware = require('http-proxy-middleware');
let webpackConfig = require('./webpack.dev.conf');

// default port where dev server listens for incoming traffic
let port = process.env.PORT || config.devServer.port;
let devHost = config.devServer.devHost;
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
let proxyTable = config.proxyTable;

let app = express();
let compiler = webpack(webpackConfig);

let devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

let hotMiddleware = require('webpack-hot-middleware')(compiler);
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({action: 'reload'});
        cb()
    })
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === 'string') {
        options = {target: options}
    }
    app.use(proxyMiddleware(context, options))
});

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// serve pure static assets
app.use(config.assetsPublicPath, express.static(config.assetsCopyPath));

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err);
        return
    }
    let uri = 'http://' + devHost + ':' + port;
    console.log('Listening at ' + uri + '\n');

    //opn(uri)
});