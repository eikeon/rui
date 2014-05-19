/** @jsx React.DOM */
var React = require('react'), Previous;

Previous = React.createClass({
    handleClick: function(event) {
        var i = this.props.items.indexOf(this.props.item);
        if (i>0) {
            this.props.onItemChanged(this.props.items[i-1]);
        }
    },
    render: function () {
        return <a onClick={this.handleClick} rel="previous"><span className="glyphicon glyphicon-chevron-left"></span></a>;
    }
});

module.exports = Previous;