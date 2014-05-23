require('node-jsx').install();

var http = require('http'),
    send = require('send'),
    url = require('url'),
    React = require('react'),
    QRApp = require('./assets/js/app.js');

exports = module.exports = function (req, res) {
    if (req.url == '/') {
        res.setHeader('Content-Type', 'text/html');
        res.end("<!DOCTYPE html>" + React.renderComponentToStaticMarkup(QRApp({})));
    } else {
        send(req, url.parse(req.url).pathname, {root: './build'})
            .on('error', function(err) {
            res.statusCode = err.status || 500;
            res.end(err.message);
        })
            .on('directory', function() {
            res.statusCode = 301;
            res.setHeader('Location', req.url + '/');
            res.end('Redirecting to ' + req.url + '/');
        })
            .pipe(res);      
    }
};
