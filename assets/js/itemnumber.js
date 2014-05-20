/** @jsx React.DOM */
var React = require('react'),

    ItemNumber;

ItemNumber = React.createClass({
    render: function () {
        var current = this.props.files.indexOf(this.props.file);
        var total = this.props.files.length;
        return <p className={this.props.className}>{current+1} of {total}</p>;
    }
});

module.exports = ItemNumber;
