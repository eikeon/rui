/** @jsx React.DOM */


var React = require('react'),
    App = require('./app.js');

window.jQuery = require('jquery');
require('../../bower_components/bootstrap/dist/js/bootstrap.min');

React.renderComponent(<App/>, document.getElementById('site'));
