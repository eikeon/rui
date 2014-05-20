/** @jsx React.DOM */

var React = require('react'),
    Projects = require('./projects'),
    Bags = require('./bags'),
    Bag = require('./bag'),
    $     = require('jquery'),
    Site;


Site = React.createClass({
    getInitialState: function () {
        return { projects: [], project: null, bags: [], bag: null, files: [], file: null };
    },
    getBagsOfInterest: function() {
        return this.state.bags.filter(function(bag, i, a) {
            if (bag.status == null) {
                return true;
            } else {
                return false;
            }
        });
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
        this.handleBagChanged(null);
        this.setState({project: project});
        $.ajax({
            url: project["@id"],
            dataType: 'json',
            success: function(data) {
                var bags = data.bags;
                this.setState({bags: bags});
                var b = this.getBagsOfInterest();
                this.handleBagChanged(b[0]);
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleBagChanged: function(bag) {
        this.setState({bag: bag, files: [], file: null});
        if (bag != null) {
            $.ajax({
                url: bag["@id"],
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
        }
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
        this.setState({file: item});
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
        var links = [];
        var i = this.state.files.indexOf(this.state.file);
        if (i>0) {
            links.push(this.state.files[i-1].image_large);
        } if (i<this.state.files.length-1) {
            links.push(this.state.files[i+1].image_large);
        }
        var prefetch = links.map(function(href) {
            return <link rel="prefetch" href={href} key={href} />;
        });
        return <html id="site">
  <head>
    <title>Quality Review</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/css/site.css" rel="stylesheet" media="screen" />
    {prefetch}
  </head>
  <body>
    <div className="container-fluid">
    <h1>Quality Review</h1>
    <form className="form" role="form">
      <div className="form-group">
        <label htmlFor="project">Project</label>
        <Projects projects={this.state.projects} onChange={this.handleProjectChanged} />
      </div>
      <div className="form-group">
        <label htmlFor="bag">Bag</label>
        <Bags bags={this.getBagsOfInterest()} bag ={this.state.bag} onChange={this.handleBagChanged} />
      </div>
    </form>
    </div>
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
