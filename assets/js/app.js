/** @jsx React.DOM */

var React = require('react'),
    Select = require('./select'),
    Bags = require('./bags'),
    Image = require('./image'),
    ItemNumber = require('./itemnumber'),
    Previous = require('./previous'),
    Next = require('./next'),
    Preview = require('./preview'),
    $     = require('jquery'),
    App;

App = React.createClass({
    getInitialState: function () {
        return { projects: [], project: null, bags: [], bag: null, files: [], file: null, preview: false, landscape: false};
    },
    togglePreview: function(event) {
        this.setState({preview: !this.state.preview});
    },
    toggleLandscape: function(event) {
        this.setState({landscape: !this.state.landscape});
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
                this.setState({projects: projects});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.document.onkeydown = this.handleKeyDown;
    },
    handleProjectChanged: function(project) {
        this.handleBagChanged(null);
        this.setState({project: project, bags: []});
        if (project != null) {
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
        }
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
    selectProject: function(event) {
        this.handleProjectChanged(null);
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
        var crumbs = [];
        crumbs.push(<Select type="project" items={this.state.projects} item={this.state.project} onChange={this.handleProjectChanged} />);
        if (this.state.project != null) {
            crumbs.push(<Select type="bag" items={this.state.bags} item={this.state.bag} onChange={this.handleBagChanged} />);
            if (this.state.bag != null) {
                crumbs.push(<div>
                              <Previous className="btn btn-default navbar-btn" onItemChanged={this.handleItemChanged} item={this.state.file} items={this.state.files} />
                              <ItemNumber file={this.state.file} files={this.state.files} />
                              <Next className="btn btn-default navbar-btn" onItemChanged={this.handleItemChanged} item={this.state.file} items={this.state.files} />
                            </div>);
                crumbs.push(<button type="button" className="btn btn-default navbar-btn" onClick={this.togglePreview}>toggle preview</button>);
                }
        }
        var preview = null;
        if (this.state.preview) {
            preview = <Preview files={this.state.files} file={this.state.file} />
        }

        var navItems = [];
        if (this.state.file) {
        }
        var bodyClass = "";
        if (this.state.landscape) {
            bodyClass = "landscape";
        }
        return <html id="site">
  <head>
    <title>Quality Review</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/css/site.css" rel="stylesheet" media="screen" />
    {prefetch}
  </head>
  <body className={bodyClass}>
    <div className="top">
      <a className="navbar-brand" onClick={this.toggleLandscape}>Quality Review</a>
      {crumbs}
    </div>
    {preview}
    <Image bag={this.state.bag} files={this.state.files} file={this.state.file} onItemChanged={this.handleItemChanged}/>
    <script src="/site.js"></script>
  </body>
</html>;
    }
});

module.exports = App;
