/** @jsx React.DOM */
var React = require('react'),
    ItemNumber = require('./itemnumber'),
    Previous = require('./previous'),
    Next = require('./next'),
    Preview = require('./preview'),
    Bag;

Bag = React.createClass({
    getInitialState: function () {
        return { preview: false };
    },
    togglePreview: function(event) {
        this.setState({preview: !this.state.preview});
    },
    render: function () {
        if (this.props.file) {
            var preview = null;
            if (this.state.preview) {
                preview = <Preview files={this.props.files} file={this.props.file} />
            }
            var fs = {backgroundImage: "url("+this.props.file.image_large+")"};
            return <div className="bag">
                     <div className="navbar navbar-default">
                       <div className="container-fluid">
                         <Previous className="btn btn-default navbar-btn navbar-left" onItemChanged={this.props.onItemChanged} item={this.props.file} items={this.props.files} />
                         <button type="button" className="btn btn-default navbar-btn" onClick={this.togglePreview}>toggle preview</button>
                         <ItemNumber className="navbar-text" file={this.props.file} files={this.props.files} />
                         <Next className="btn btn-default navbar-btn navbar-right" onItemChanged={this.props.onItemChanged} item={this.props.file} items={this.props.files} />
                       </div>
                     </div>
                     {preview}
                     <div className="bagitem">
                       <div className="image" style={fs}></div>
                     </div>
                   </div>;
        } else {
            return <div><p>...</p></div>;
        }
    }
});

module.exports = Bag;
