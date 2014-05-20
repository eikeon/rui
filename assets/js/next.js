/** @jsx React.DOM */
var React = require('react'), Next;

Next = React.createClass({
    handleClick: function(event) {
        var i = this.props.items.indexOf(this.props.item);
        if (i<this.props.items.length-1) {
            this.props.onItemChanged(this.props.items[i+1]);
        }
    },
    render: function () {
        return <button type="button" className={this.props.className} onClick={this.handleClick} rel="next"><span className="glyphicon glyphicon-chevron-right"></span></button>;
    }
});

module.exports = Next;
