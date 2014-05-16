require('node-jsx').install();

var http = require('http'),
    send = require('send'),
    url = require('url'),
    React = require('react'),
    MyApp = require('./assets/js/app.js');

var fs = require('fs'),
    Handlebars = require('handlebars'),
    template;

fs.readFile('./site.html', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  template = Handlebars.compile(data);
});


exports = module.exports = function (req, res) {
    if (req.url == '/') {
        res.setHeader('Content-Type', 'text/html');
        var app = new Handlebars.SafeString(React.renderComponentToStaticMarkup(MyApp({})));
        res.end(template({"app": app}));
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
