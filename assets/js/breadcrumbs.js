/** @jsx React.DOM */
var React = require('react'),
    Breadcrumbs;

Breadcrumbs = React.createClass({
    render: function () {
        var crumbs = this.props.children.map(function(child) {
             return <span>{child}</span>
         });
        return <span>
                 {crumbs}
        </span>;
    }
});

module.exports = Breadcrumbs;
