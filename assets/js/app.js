/** @jsx React.DOM */

var React = require('react'),
    $     = require('jquery'),
    App;

App = React.createClass({
    getInitialState: function () {
        return { projects: [], project: null, bags: [], bag: null, files: [], file: null, preview: false, landscape: false};
    },
    toggleLandscape: function(event) {
        this.setState({landscape: !this.state.landscape});
    },
    componentDidMount: function () {
        $.ajax({
            url: "http://sampler.rdc.lctl.gov/api",
            dataType: 'json',
            success: function(data) {
                var projects = data;
                this.setState({projects: projects});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.document.onkeydown = this.handleKeyDown;
    },
    render: function () {
        var bodyClass = "";
        if (this.state.landscape) {
            bodyClass = "landscape";
        }
        return <html id="site">
  <head>
    <title>Reactive UI</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/css/site.css" rel="stylesheet" media="screen" />
  </head>
  <body className={bodyClass}>
    <div className="top">
      <a className="navbar-brand" onClick={this.toggleLandscape}>Reactive UI</a>
    </div>
    <div>
      <h1>Hello World!</h1>
    </div>
    <script src="/site.js"></script>
  </body>
</html>;
    }
});

module.exports = App;
