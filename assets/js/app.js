/** @jsx React.DOM */

var React = require('react'),
    ItemNumber = require('./itemnumber'),
    $     = require('jquery'),    
    App;

var Files = [{
    "image_large": "http://sampler.rdc.lctl.gov/sample/39790/6837602.jpg",
    "@id": "http://sampler.rdc.lctl.gov/api/filesample/6837602",
    "@type": "FileSample"
}];

    App = React.createClass({    
        getInitialState: function () {
            return { files: Files, file: Files[0] };
        },
        componentDidMount: function () {            
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function(data) {
                    var files = data["files"];
                    this.setState({files: files, file: files[0]});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
            window.document.onkeydown = this.handleKeyDown;
        },
        componentWillUnmount: function() {
        },
        handleKeyDown: function(event) {
            if (event.keyCode == '37') {
                this.handlePrevious(event);
            }
            else if (event.keyCode == '39') {
                this.handleNext(event);
            }
        },
        handleNext: function(event) {
            var i = this.state.files.indexOf(this.state.file);
            var n = this.state.files.length;
            this.state.file = this.state.files[(i+1+n)%n];
            this.setState(this.state);            
        },        
        handlePrevious: function(event) {
            var i = this.state.files.indexOf(this.state.file);
            var n = this.state.files.length;            
            this.state.file = this.state.files[(i-1+n)%n];
            this.setState(this.state);
        },
        render: function () {
            var current = this.state.files.indexOf(this.state.file);
            var total = this.state.files.length;
            if(typeof window == 'undefined') {
            } else {
                $.get(this.state.file.image_large);
                $.get(this.state.files[(current+1+total)%total].image_large);
                $.get(this.state.files[(current-1+total)%total].image_large);
            }
            var fs = {backgroundImage: "url("+this.state.file.image_large+")"};
            return <div className="foo">
                <div className="image" style={fs}>
                </div>
                <div className="previous">
                  <h1><a onClick={this.handlePrevious} rel="previous"><span className="glyphicon glyphicon-chevron-left"></span></a></h1>
                </div>
                <div className="current">
                  <ItemNumber file={this.state.file} files={this.state.files} />
                </div>
                <div className="next" onClick={this.handleNext}>
                  <h1><a rel="next"><span className="glyphicon glyphicon-chevron-right"></span></a></h1>
                </div>
                
                </div>;
    }
});

App.start = function () {
    React.renderComponent(<App url="http://sampler.rdc.lctl.gov/api/sample/39790"/>, document.getElementById('app'));
};

if(typeof window == 'undefined') {
    module.exports = App;
} else {
    module.exports = window.App = App;    
}
