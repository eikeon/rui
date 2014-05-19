/** @jsx React.DOM */
var React = require('react'),
    $     = require('jquery'),
    ItemNumber = require('./itemnumber'),
    Previous = require('./previous'),
    Next = require('./next'),
    Bag;

Bag = React.createClass({
    render: function () {
        var fs = {backgroundImage: "url("+this.props.file.image_large+")"};
        return <div className="foo">
                 <div className="image" style={fs}>
                 </div>
                 <div className="previous">
                   <h1><Previous onItemChanged={this.props.onItemChanged} item={this.props.file} items={this.props.files} /></h1>
                 </div>
                 <div className="current">
                   <ItemNumber file={this.props.file} files={this.props.files} />
                 </div>
                 <div className="next">
                   <h1><Next onItemChanged={this.props.onItemChanged} item={this.props.file} items={this.props.files} /></h1>
                 </div>
               </div>;
    }
});

module.exports = Bag;
