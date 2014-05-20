/** @jsx React.DOM */
var React = require('react'),
    $     = require('jquery'),
    ItemNumber = require('./itemnumber'),
    Previous = require('./previous'),
    Next = require('./next'),
    Bag;

Bag = React.createClass({
    render: function () {
        if (this.props.file) {
            var fs = {backgroundImage: "url("+this.props.file.image_large+")"};
            return <div className="bagitem">
                     <div className="image" style={fs}>
                </div>
                <div className="navbar navbar-default">
                  <div className="container-fluid">
                  <Previous className="btn btn-default navbar-btn navbar-left" onItemChanged={this.props.onItemChanged} item={this.props.file} items={this.props.files} />
                  <ItemNumber className="navbar-text" file={this.props.file} files={this.props.files} />
                <Next className="btn btn-default navbar-btn navbar-right" onItemChanged={this.props.onItemChanged} item={this.props.file} items={this.props.files} />
                  </div>
                </div>
                    </div>;
        } else {
            return <div><p>...</p></div>;
        }
    }
});

module.exports = Bag;
