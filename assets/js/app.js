/** @jsx React.DOM */

var React = require('react'),
    Projects = require('./projects'),
    Bags = require('./bags'),
    Bag = require('./bag'),
    Preview = require('./preview'),
    Breadcrumbs = require('./breadcrumbs'),
    $     = require('jquery'),
    App;

App = React.createClass({
    getInitialState: function () {
        return { projects: [], project: null, bags: [], bag: null, files: [], file: null, preview: false, chooseProject: false };
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
    togglePreview: function(event) {
        this.setState({preview: !this.state.preview});
    },
    toggleChooseProject: function(event) {
        this.setState({chooseProject: !this.state.chooseProject});
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
        var preview = null;
        if (this.state.preview) {
            preview = <Preview files={this.state.files} file={this.state.file} />
        }
        var bags = null;
        if (this.getBagsOfInterest().length > 0) {
            bags = <div className="form-group">
                <label htmlFor="bag">Bag</label>
                <Bags bags={this.getBagsOfInterest()} bag={this.state.bag} onChange={this.handleBagChanged} />
                </div>;
        } else {
            if (this.state.project != null) {
                bags = <div>no bags to review</div>;
            }
        }
        var select_project_bag = null;
        if (this.state.project == null || this.state.chooseProject) {
            select_project_bag = <div className="container-fluid">
                                   <form className="form" role="form">
                                     <div className="form-group">
                                       <label htmlFor="project">Project</label>
                                       <Projects projects={this.state.projects} project={this.state.project} onChange={this.handleProjectChanged} />
                                       {bags}
                                     </div>
                                   </form>
                                 </div>;
        }
        return <html id="site">
  <head>
    <title>Quality Review</title>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="/css/site.css" rel="stylesheet" media="screen" />
    {prefetch}
  </head>
  <body>
    <nav className="navbar navbar-default" role="navigation">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">Quality Review</a>
        </div>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <button type="button" className="btn btn-default navbar-btn" onClick={this.togglePreview}>toggle preview</button>
          <button type="button" className="btn btn-default navbar-btn" onClick={this.toggleChooseProject}>toggle Choose Project</button>
        </div>
      </div>
    </nav>
    <Breadcrumbs project={this.state.project} bag={this.state.bag} files={this.state.files} file={this.state.file} />
    {select_project_bag}
    {preview}
    <Bag files={this.state.files} file={this.state.file} onItemChanged={this.handleItemChanged}/>
    <script src="/site.js"></script>
  </body>
</html>;
    }
});

module.exports = App;
