/** @jsx React.DOM */

var React = require('react'),
    Projects = require('./projects'),
    Bags = require('./bags'),
    Bag = require('./bag'),
    $     = require('jquery'),
    Site;


Site = React.createClass({
    getInitialState: function () {
        var Projects = [{
            "@id": "http://sampler.rdc.lctl.gov/api/project/1",
            "@type": "Project",
            "name": "Copyright Card Scanning"
        }, {
            "@id": "http://sampler.rdc.lctl.gov/api/project/2",
            "@type": "Project",
            "name": "Presidential Papers"
        },
                       ];

        var Files = [{
            "image_large": "http://sampler.rdc.lctl.gov/sample/39790/6837602.jpg",
            "@id": "http://sampler.rdc.lctl.gov/api/filesample/6837602",
            "@type": "FileSample"
        }];
        return { projects: Projects, project: Projects[0], bags: [], bag: null, files: Files, file: Files[0] };
    },
    componentDidMount: function () {
        $.ajax({
            url: "http://sampler.rdc.lctl.gov/api",
            dataType: 'json',
            success: function(data) {
                var projects = data;
                this.setState({projects: projects, project: projects[0]});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.document.onkeydown = this.handleKeyDown;
    },
    handleProjectChanged: function(project) {
        this.state.project = project;
        this.state.bags = [];
        this.setState(this.state);
        $.ajax({
            url: this.state.project["@id"],
            dataType: 'json',
            success: function(data) {
                var bags = data.bags;
                this.setState({bags: bags, bag: bags[0]});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleBagChanged: function(bag) {
        this.state.bag = bag;
        this.state.sample = null;
        this.setState(this.state);
        $.ajax({
            url: this.state.bag["@id"],
            dataType: 'json',
            success: function(data) {
                var url = data.samples[0]["@id"]
                console.error("URL: " + url);
                this.getFiles(url);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
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
    getFiles: function(sample_url) {
        $.ajax({
            url: sample_url,
            dataType: 'json',
            success: function(data) {
                var files = data.files;
                this.setState({files: files, file: files[0]});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        this.prefetch();
        return <html id="site">
  <head>
    <title>Quality Review</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/css/site.css" rel="stylesheet" media="screen" />
  </head>
  <body>
    <Projects projects={this.state.projects} onChange={this.handleProjectChanged} />
    <Bags bags={this.state.bags} bag ={this.state.bag} onChange={this.handleBagChanged} />
    <Bag files={this.state.files} file={this.state.file} onItemChanged={this.handleItemChanged}/>
    <script src="/app.js"></script>
    <script>Site.start();</script>
  </body>
</html>;
    }
});

Site.start = function() {
    React.renderComponent(<Site/>, document.getElementById('site'));
};

if(typeof window == 'undefined') {
    module.exports = Site;
} else {
    module.exports = window.Site = Site;
    window.React = React;
}
