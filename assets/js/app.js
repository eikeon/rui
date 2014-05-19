/** @jsx React.DOM */

var React = require('react'),
    ItemNumber = require('./itemnumber'),
    Previous = require('./previous'),
    Next = require('./next'),
    $     = require('jquery'),
    Site,
    App;

var Files = [{
    "image_large": "http://sampler.rdc.lctl.gov/sample/39790/6837602.jpg",
    "@id": "http://sampler.rdc.lctl.gov/api/filesample/6837602",
    "@type": "FileSample"
}];

Site = React.createClass({
    render: function () {
        return <html id="site">
  <head>
    <title>Quality Review</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/css/site.css" rel="stylesheet" media="screen" />
  </head>
  <body id="app">
    <App url="http://sampler.rdc.lctl.gov/api/sample/39790"/>
    <script src="/app.js"></script>
    <script>Site.start();</script>
  </body>
</html>;
    }
});

App = React.createClass({
    getInitialState: function () {
        return { files: Files, file: Files[0] };
    },
        componentDidMount: function () {            
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function(data) {
                    var files = data.files;
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
        handleItemChanged: function(item) {
            this.state.file = item;
            this.setState(this.state);
        },
        handleNext: function(event) {
            var i = this.state.files.indexOf(this.state.file);
            if (i<this.state.files.length-1) {
                this.handleItemChanged(this.state.files[i+1]);
            }
        },        
        handlePrevious: function(event) {
            var i = this.state.files.indexOf(this.state.file);
            if (i>0) {
                this.handleItemChanged(this.state.files[i-1]);
            }
        },
        prefetch: function() {
            if(typeof window == 'undefined') {
            } else {
                $.get(this.state.file.image_large);
                var i = this.state.files.indexOf(this.state.file);
                if (i>0) {
                    $.get(this.state.files[i-1].image_large);
                } else if (i<this.state.files.length-1) {
                    $.get(this.state.files[i+1].image_large);
                }
            }
        },
        render: function () {
            this.prefetch();
            var fs = {backgroundImage: "url("+this.state.file.image_large+")"};
            return <div className="foo">
                     <div className="image" style={fs}>
                     </div>
                     <div className="previous">
                       <h1><Previous onItemChanged={this.handleItemChanged} item={this.state.file} items={this.state.files} /></h1>
                     </div>
                     <div className="current">
                       <ItemNumber file={this.state.file} files={this.state.files} />
                     </div>
                     <div className="next">
                       <h1><Next onItemChanged={this.handleItemChanged} item={this.state.file} items={this.state.files} /></h1>
                     </div>
                   </div>;
    }
});

Site.start = function() {
    React.renderComponent(<Site/>, document.getElementById('site'));
};

if(typeof window == 'undefined') {
    module.exports = Site;
} else {
    module.exports = window.Site = Site;
}
