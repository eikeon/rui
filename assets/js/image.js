/** @jsx React.DOM */
var React = require('react'),
    ItemNumber = require('./itemnumber'),
    Previous = require('./previous'),
    Next = require('./next'),
    Image;

Image = React.createClass({
    render: function () {
        var fs = {};
        if (this.props.file) {
            fs = {backgroundImage: "url("+this.props.file.image_large+")"};
        }
        return <div className="image" style={fs}></div>;
    }
});

module.exports = Image;
